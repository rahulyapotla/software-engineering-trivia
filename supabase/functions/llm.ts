import OpenAI from "openai";
import { SUBMIT_ANSWER_PROMPT, TRIVIA_QUESTION_PROMPT } from "./prompts.ts";
import { isValidJson, runWithRetry, timeout } from "./helpers.ts";

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: Deno.env.get("GROQ_API_KEY")!,
});

async function generateQuestion() {
  const completion = await runWithRetry(() =>
    timeout(
      openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.9,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: TRIVIA_QUESTION_PROMPT,
          },
        ],
      }),
      8000
    )
  );

  const raw = completion?.choices?.[0]?.message?.content;
  if (!raw) throw new Error("llm_empty: no content returned");

  const parsed = isValidJson(raw);
  if (!parsed)
    throw new Error("llm_invalid_json: could not parse model output");

  return parsed;
}

async function getAnswerFromLLM(question: string, options: string[]) {
  const prompt = `
    ${SUBMIT_ANSWER_PROMPT}

    Question: ${question}
    Options: ${JSON.stringify(options)}
  `;

  const completion = await runWithRetry(() =>
    timeout(
      openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
      8000
    )
  );

  const raw = completion?.choices?.[0]?.message?.content;
  if (!raw) throw new Error("llm_empty: no content returned");

  const obj = isValidJson(raw);
  if (!obj) throw new Error("llm_invalid_json: could not parse model output");

  return obj;
}

export { generateQuestion, getAnswerFromLLM };
