import { cors } from "./config.ts";

const events = {
  NEW_QUESTION: "new_question",
  SCORE_UPDATE: "score_update",
};

function isValidJson(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function isValidQuestion(obj: any) {
  if (!obj || typeof obj !== "object") return false;

  const { question, options } = obj;

  if (typeof question !== "string" || !question.trim()) return false;

  if (!Array.isArray(options) || options.length < 4 || options.length > 5)
    return false;

  if (options.some((opt) => typeof opt !== "string" || !opt.trim())) {
    return false;
  }

  return true;
}

function isValidAnswer(obj: any) {
  if (!obj || typeof obj !== "object") return false;

  const { answerObj, options } = obj;
  const { correct_index } = answerObj;

  if (typeof correct_index !== "number") return false;
  if (correct_index < 0 || correct_index >= options.length) return false;

  return true;
}

function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("timeout")), ms);
    promise
      .then((res) => {
        clearTimeout(id);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });
}

async function runWithRetry<T>(fn: () => Promise<T>, retries = 2) {
  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise((res) => setTimeout(res, 150 * (i + 1)));
    }
  }

  throw new Error("llm_unavailable: Model could not respond after retries");
}

export function parseError(err: any) {
  const raw = err?.message || "internal_error: unexpected failure";
  const [error, details] = raw.split(":").map((s: string) => s.trim());

  // Default 500 unless logic below overrides it
  let status = 500;

  // Client-side problems → 400
  if (
    error === "invalid_request" ||
    error === "invalid_question" ||
    error === "invalid_answer"
  ) {
    status = 400;
  }

  return {
    status,
    error: error || "internal_error",
    details: details || "",
  };
}

function errorResponse(status: number, error: string, message: string) {
  return new Response(
    JSON.stringify({ ok: false, error: error, details: message }),
    {
      status,
      headers: cors,
    }
  );
}

export {
  events,
  isValidJson,
  isValidQuestion,
  isValidAnswer,
  timeout,
  runWithRetry,
  errorResponse,
};