export const TRIVIA_QUESTION_PROMPT = `
  I'm building a trivia game. Create ONE new multiple-choice question.
  Before you generate anything, read the list below:

  Do NOT create anything that overlaps in topic or wording with the past questions.

  Return ONLY valid JSON in this structure:
  {
    "question": "text",
    "options": ["opt1","opt2","opt3","opt4"],
    "correct_index": 0
  }

  Question rules:
  - Must be clear, factual, and unique compared to the past questions.
  - Rotate across topics like algorithms, networking, DevOps, system design, databases, cloud, APIs, and security.

  Option rules:
  - 4–5 options.
  - No prefixes (no A), 1., *, -, etc).
  - Options should be distinct and not all the same category unless appropriate.
  - Only raw text in each option.
  - One option must be correct.

  Correct index:
  - Zero-based index pointing to the correct option.

  If you cannot produce JSON that meets all requirements, return:
  {"error":"formatting"}

  Return only the JSON.
`;

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
