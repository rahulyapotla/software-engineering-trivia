import { cors, errorResponse, isValidQuestion, parseError } from "../helpers.ts";
import { generateQuestion } from "../llm.ts";
import { broadcastNewQuestion, saveQuestion } from "../db.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const questionObj = await generateQuestion();
    if (!isValidQuestion(questionObj)) {
      throw new Error("invalid_question: failed validation");
    }

    const saved = await saveQuestion(questionObj);
    await broadcastNewQuestion({ ...saved });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (err: any) {
    const { status, error, details } = parseError(err);
    return errorResponse(status, error, details);
  }
});
