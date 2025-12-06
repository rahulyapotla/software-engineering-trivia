export const TRIVIA_QUESTION_PROMPT = `
  Generate ONE unique multiple-choice trivia question about software engineering or computer science.

  Return ONLY valid JSON:
  {
    "question": "text",
    "options": ["opt1","opt2","opt3","opt4"],
    "correct_index": 0
  }

  Rules:
  - The question must be factual and unambiguous.
  - Avoid common repeated themes unless the angle is significantly different.
  - Do NOT ask about the same concept already asked in previous questions (e.g., load balancers, caching, mutexes, HTTP, etc.).
  - Keep options concise and mutually exclusive.
  - Do NOT rephrase known questions.
  - No prefixes (no A), 1., *, -, etc).
  - Options should be distinct and not all the same category unless appropriate
  - Produce fresh, interesting, conceptually distinct content.
`;

export function buildRetryPrompt(
  failureReason: string,
  recentTopicHints: string[]
) {
  return `
    The previous question was rejected because: ${failureReason}.

    Also recently used topics that must be avoided for now:
    ${recentTopicHints.map(t => `- ${t}`).join("\n")}

    Generate a NEW trivia question about software engineering that:
    - is NOT semantically similar to the previous question
    - is NOT on any of the above recent topics
    - is conceptually different
    - follows the required JSON format STRICTLY

    Return ONLY valid JSON in this format:
    {
      "question": "text",
      "options": ["opt1","opt2","opt3","opt4"],
      "correct_index": 0
    }
  `;
}

export const SUBMIT_ANSWER_PROMPT = `
  I’ll send you a question with a list of options.  
  Figure out which option is correct and reply with a single JSON object.  
  Nothing else should be included.

  Return ONLY valid JSON in this format:
  {"correct_index": number, "explanation": "text"}

  A few things to keep in mind:
  - correct_index should be the zero-based index of the right option.
  - explanation should be a 2-3 sentence rationale about why that choice is correct.
  - The response has to be proper JSON, not markdown or code blocks.

  If you can’t produce a clean JSON object that follows this format, then reply with:
  {"error":"formatting"}

  Your entire reply should be either the answer JSON or the error JSON, and nothing more.
`;
