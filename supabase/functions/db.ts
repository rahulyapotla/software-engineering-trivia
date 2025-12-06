import { events, supabase } from "./helpers.ts";
import { Answer, ScoreBroadcast, StoredQuestion } from "./types.ts";

async function saveQuestion(questionObj: StoredQuestion) {
  const { data, error } = await supabase
    .from("questions")
    .insert({
      question: questionObj.question,
      options: questionObj.options,
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

export {
  saveQuestion,
  saveAnswer,
  broadcastNewQuestion,
  broadcastScore,
};