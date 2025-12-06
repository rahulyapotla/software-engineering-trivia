import { getAnswerFromLLM } from "../llm.ts";
import { saveAnswer, broadcastScore } from "../db.ts";
import { errorResponse, isValidAnswer, parseError } from "../helpers.ts";
import {
  UserAnswerInput,
} from "../types.ts";
import { cors } from "../config.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const { question_id, question, options, chosen_index, totalScore } = await req.json() as UserAnswerInput;
    if (!question_id) {
      throw new Error("invalid_request: question_id missing");
    }

    const answerObj = await getAnswerFromLLM(question, options);
    if (!isValidAnswer({ answerObj, options })) {
      throw new Error("invalid_answer: failed validation", answerObj);
    }

    const correct_index = answerObj.correct_index;
    const explanation = answerObj.explanation || "";
    const is_correct = chosen_index === correct_index;
    const score = is_correct ? 10 : 0;

    await saveAnswer({
      question_id,
      chosen_index,
      correct_index,
      is_correct,
      score,
      explanation,
    });

    const updatedScore = totalScore + score;
    await broadcastScore({
      totalScore,
      explanation,
      is_correct,
      correct_index,
      totalScore: updatedScore,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (err: any) {
    console.error(err);
    const { status, error, details } = parseError(err);
    return errorResponse(status, error, details);
  }
});
