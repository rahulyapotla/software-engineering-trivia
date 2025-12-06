import {
  errorResponse,
  isValidQuestion,
  parseError,
} from "../helpers.ts";

import { generateQuestion } from "../llm.ts";
import {
  broadcastNewQuestion,
  saveQuestion,
  findSemanticDuplicate,
  getRecentQuestions,
  cosineSimilarity,
  exactDuplicateExists,
} from "../db.ts";

import { embedQuestion } from "../../utils/embed.ts";
import { cors, CONFIG } from "../config.ts";
import { buildRetryPrompt, TRIVIA_QUESTION_PROMPT } from "../prompts.ts";
import { StoredQuestion } from "../types.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const result = await generateWithUniqueness();
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (err: any) {
    const { status, error, details } = parseError(err);
    return errorResponse(status, error, details);
  }
});

let lastFailureReason = "";
async function generateWithUniqueness(retry = 0): Promise<void> {
  if (retry >= CONFIG.MAX_RETRIES) {
    throw new Error("invalid_question: exceeded retry attempts");
  }

  // Fetch last N asked questions
  const recentQuestionsList = await getRecentQuestions(CONFIG.RECENT_TOPIC_WINDOW);
  const recentQuestions = recentQuestionsList.map(r => r.question);

  // Build dynamic prompt
  const prompt =
    retry === 0
      ? TRIVIA_QUESTION_PROMPT
      : buildRetryPrompt(lastFailureReason, recentQuestions);

  // Generate question via LLM
  const questionObj = await generateQuestion(prompt, retry);
  const { question } = questionObj;

  // Validate question format
  if (!isValidQuestion(questionObj)) {
    console.warn("Invalid question from LLM.");
    throw new Error("invalid_question: failed validation");
  }

  const isExact = await exactDuplicateExists(question);
  if (isExact) {
    console.warn("Exact duplicate detected, retrying...");
    return generateWithUniqueness(retry + 1);
  }

  // Generate embeddings for the question
  const embedding = await embedQuestion(question);

  await ensureUnique(embedding, recentQuestions);

  await saveAndBroadcast({...questionObj, embedding: embedding});

  lastFailureReason = ""; 
  return;
}

async function ensureUnique(embedding: number[], recentQuestions: any[]) {
  // 1. Find semantic duplicate questions
  const semanticDuplicate = await findSemanticDuplicate(embedding, CONFIG.SEMANTIC_DUPLICATE_THRESHOLD);
  if (semanticDuplicate) {
    console.warn("Semantic duplicate detected:", semanticDuplicate);
    lastFailureReason = "Semantic duplicate of an existing question.";
    return generateWithUniqueness(1);
  }

  // 2. Find recently used topics
  for (const q of recentQuestions) {
    if (q.embedding) {
      const similarity = cosineSimilarity(q.embedding, embedding);
      if (similarity > CONFIG.TOPIC_STREAK_THRESHOLD) {
        lastFailureReason = "Too similar in topic to recently asked questions.";
        return generateWithUniqueness(1);
      }
    }
  }
}

async function saveAndBroadcast(questionObj: StoredQuestion) {
  const saved = await saveQuestion(questionObj as StoredQuestion);
  await broadcastNewQuestion({ ...saved });
}
