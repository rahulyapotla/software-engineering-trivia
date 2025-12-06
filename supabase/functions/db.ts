import { supabase } from "./config.ts";
import { events } from "./helpers.ts";
import { Answer, ScoreBroadcast, StoredQuestion } from "./types.ts";

async function saveQuestion(questionObj: StoredQuestion) {
  const { data, error } = await supabase
    .from("questions")
    .insert({
      question: questionObj.question,
      options: questionObj.options,
      embedding: questionObj.embedding,
    })
    .select()
    .single();

  if (error) throw new Error(`db_insert_failed: ${error.message}`);
  return data;
}

async function saveAnswer(answer: Answer) {
  const { error } = await supabase.from("answers").insert(answer);
  if (error) throw new Error(`db_insert_failed: ${error.message}`);
}

async function broadcastNewQuestion(payload: StoredQuestion) {
  try {
    const ok = await supabase.realtime.channel("trivia-room").send({
      type: "broadcast",
      event: events.NEW_QUESTION,
      payload,
    });
    if (!ok) {
      throw new Error(
        "broadcast_failed: realtime server did not accept the message"
      );
    }
  } catch (err: any) {
    console.warn("broadcast error:", err);
    throw new Error(
      `broadcast_failed: ${err.message || "could not send event"}`
    );
  }
}

async function broadcastScore(payload: ScoreBroadcast) {
  try {
    const ok = await supabase.realtime.channel("score").send({
      type: "broadcast",
      event: events.SCORE_UPDATE,
      payload,
    });
    if (!ok) {
      throw new Error(
        "broadcast_failed: realtime server did not accept the message"
      );
    }
  } catch (err: any) {
    console.warn("broadcast error:", err);
    throw new Error(
      `broadcast_failed: ${err.message || "could not send event"}`
    );
  }
}

async function exactDuplicateExists(question: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("questions")
    .select("id")
    .eq("question", question.trim())
    .limit(1);

  if (error) {
    console.error("duplicated  detect error:", error);
    throw new Error("duplicate_detect_check_failed");
  }

  return data && data.length > 0;
}

async function findSemanticDuplicate(embedding: number[], similarity_threshold: number) {
  const { data, error } = await supabase.rpc("match_questions", {
    query_embedding: embedding,
    similarity_threshold: similarity_threshold || 0.85,
    match_count: 1,
  });

  if (error) {
    console.warn("semantic_dedupe_error:", error);
    throw new Error(`semantic_dedupe_error: ${error.message}`);
  }

  console.log("RPC Response:", data);
  return data?.[0] || null;
}

// Fetch last N saved questions
async function getRecentQuestions(limit = 3) {
  const { data, error } = await supabase
    .from("questions")
    .select("question, id, embedding")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("recent_question_error:", error);
    throw new Error("recent_question_error", error)
  }

  return data || [];
}

// Compute cosine similarity between two embedding vectors.
// Returns a value from -1 to 1, where 1 = very similar.
function cosineSimilarity(a: number[], b: number[]) {
  // Dot product of the two vectors
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);

  // length of vector a
  const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));

  // length of vector b
  const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));

  // Cosine similarity = dot(a, b) / (|a| * |b|)
  return dotProduct / (magnitudeA * magnitudeB);
}

export {
  saveQuestion,
  saveAnswer,
  broadcastNewQuestion,
  broadcastScore,
  findSemanticDuplicate,
  getRecentQuestions,
  cosineSimilarity,
  exactDuplicateExists,
};