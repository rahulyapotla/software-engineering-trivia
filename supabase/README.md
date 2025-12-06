# Trivia Game Backend — Supabase Edge Functions

A lightweight backend that generates trivia questions, validates inputs, stores results, and delivers realtime updates to the frontend.  
Built using *Supabase Edge Functions* and *Groq* for fast LLM responses.

---

## ## Overview  
This backend powers a live trivia experience using Supabase Edge Functions, Realtime, and a multi-step uniqueness pipeline built on embeddings.

The system handles:

- Generating trivia questions using strong prompting rules  
- Embedding questions with OpenAI embeddings  
- Detecting semantic duplicates using vector similarity  
- Detecting exact text duplicates as a fallback  
- Preventing topic-cluster repetition back-to-back
- Storing questions and answers  
- Broadcasting real-time insert events to the frontend  
- Graceful retries and failure handling  

---

## Getting Started

### Requirements

Before running the backend locally, ensure the following tools and environment variables are set up:

### ● Deno  
Required to execute Supabase Edge Functions.

*Install:*
⁠ sh
curl -fsSL https://deno.land/install.sh | sh

### ● Supabase CLI  
Used for running functions locally and deploying them.

### ● A Supabase Project  
Your project should have:
- Realtime enabled  
- Edge Functions active  
- A `questions` table configured
- A `answers` table configured

### ● Environment Variables  
The Edge Function requires the following environment variables (set via `.env` or the Supabase dashboard):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`

These are used for:
- Connecting to Supabase from the backend  
- Inserting and retrieving data with elevated permissions  
- Making LLM calls to Groq  

### ● Install Supabase CLI
`brew install supabase/tap/supabase`

 ⁠

---

### Local Setup

1.  *Install Supabase CLI*
    ⁠ bash
    brew install supabase/tap/supabase
     ⁠

2.  *Clone the repo*
    ⁠ bash
    git clone <repo-url>
    cd supabase
     ⁠

3.  *Run Supabase locally*
    ⁠ bash
    supabase start
     ⁠

4.  *Run an edge function locally*
    ⁠ bash
    supabase functions serve <function-name>
     ⁠

---

## 📁 Project Structure

```
supabase/
│
├── functions/
│   ├── generate-new-question/
│   │   ├── .npmrc
│   │   ├── deno.json
│   │   └── index.ts
│   │
│   ├── submit-answer/
│   │   ├── .npmrc
│   │   ├── deno.json
│   │   └── index.ts
│   │
│   ├── config.ts
│   ├── db.ts
│   ├── helpers.ts
│   ├── llm.ts
│   ├── prompts.ts
│   └── types.ts
│
├── migrations/
│   ├── 20251202163752_create_tables.sql
│   ├── 20251204154358_correct_index_remove_column.sql
│   └── 20251205224555_modify_questions_schema.sql
│
├── utils/
│   └── embed.ts
│
├── .env
├── config.toml
├── deno.json
├── deno.lock
├── README.md
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

```
### 🔍 What Each Section Does

#### **functions/**
Holds all Supabase Edge Functions powering the app logic.

- **generate-new-question/**
  - Generates a unique trivia question
  - Embedding, semantic duplicate check, topic clustering, retries

- **submit-answer/**
  - Validates user answers
  - Generates explanation via LLM
  - Stores result and broadcasts realtime events

- **Shared utilities**
  - `config.ts` – centralized config
  - `db.ts` – Supabase client setup
  - `helpers.ts` – reusable backend helpers
  - `llm.ts` – AI/embedding utilities
  - `prompts.ts` – LLM prompt templates
  - `types.ts` – TypeScript interfaces

---

#### **migrations/**
SQL migration files for database schema evolution.

---

#### **utils/**
Extra internal utilities (embedding helpers, preprocessing, etc.).

---

#### Project Root Files  
- `config.toml` – Supabase local development config  
- `.env` – environment variables  
- `deno.json` & `deno.lock` – dependency and permissions config for edge functions  
- `package.json` – Node dependencies for dev tooling  
- `.gitignore` – ignored files  
- `README.md` – backend documentation  

---

## 💾 Database Structure

| Table | Purpose |
| :--- | :--- |
| *⁠ questions ⁠* | Stores the generated trivia question and its options. |
| *⁠ answers ⁠* | Tracks the user’s submitted answers. |

---

## 📡 Realtime Setup

The frontend listens for new answer submissions via *Supabase Realtime Broadcast channels*.

### Enable Realtime for the ⁠ answers ⁠ table:

1.  Go to *Dashboard* → *Database* → *Realtime*
2.  Enable the schema (typically ⁠ public ⁠).
3.  Turn on *INSERT* events for the ⁠ answers ⁠ table.

---

## 🧩 Embedding Service (Node.js on Vercel)

To keep Supabase Edge Functions lightweight and avoid hitting strict free-tier rate limits on embedding models,  
the embedding logic is implemented in a **separate Node.js microservice** deployed on **Vercel**.

This service acts as a dedicated embedding gateway, giving us more control over retries, caching, and throughput than Supabase Edge Functions alone can provide.

### Why a Separate Embedding Service?

Supabase Edge Functions run inside Deno with tight execution and dependency constraints.  
Embedding calls, especially with free-tier LLM models, introduce challenges:

- **Low rate limits** → free-tier providers throttle quickly  
- **429 errors** if too many embeddings happen in a short window  
- Some SDKs (OpenAI, etc.) require Node-compatible dependencies  
- Cold starts + network retries are easier to manage in a Node server  
- Cleaner separation of duties between “generation logic” and “embedding logic”

By moving embeddings to Vercel:

- We avoid rate-limit spikes on the free model tier  
- We can centralize retries/backoff logic  
- The embedding pipeline becomes more predictable  
- Edge Functions stay fast, small, and Deno-friendly  

---

## 🔑 Environment Variables

Environment variables are essential for securely storing sensitive configuration settings needed by your Edge Functions.

### How to Add Variables in Supabase Dashboard

Add these variables under the *Supabase Dashboard* by navigating to:

	⁠*Project Settings* → *Functions* → *Environment Variables*

| Variable | Description |
| :--- | :--- |
| ⁠ SUPABASE_URL ⁠ | The URL of your Supabase project (e.g., ⁠ https://xxxx.supabase.co ⁠). |
| ⁠ SUPABASE_SERVICE_ROLE_KEY ⁠ | A highly privileged key used by the backend to bypass Row Level Security for critical operations (e.g., inserting answers). *Keep this secure.* |
| ⁠ GROQ_API_KEY ⁠ | Your API key for the Groq LLM service. |


### Accessing Variables Inside Edge Functions

You can access these variables within your Edge Functions using ⁠ Deno.env.get() ⁠:

⁠ typescript
// Example of accessing the Groq API Key
const key = Deno.env.get("GROQ_API_KEY")!;
 ⁠
---

### 📦 Deployment

•⁠  ⁠*Deploy a single function:*
    ⁠ bash
    supabase functions deploy <function-name>
     ⁠
•⁠  ⁠*Deploy everything:*
    ⁠ bash
    supabase functions deploy --all
     ⁠

---

## 💡 Design Decisions

### Reliability: Retries, Fallbacks, and Failure Handling

Working with LLMs and network-based systems means things won’t always behave perfectly. To keep the backend stable, a few guardrails are built in.

#### Retry Mechanism
The LLM occasionally returns malformed JSON, empty fields, or repeated questions. Instead of failing immediately, the backend:

•⁠  ⁠Calls *Groq with a timeout*
•⁠  ⁠*Validates the response*
•⁠  ⁠*Retries* with the same prompt if anything looks off
•⁠  ⁠Bails out only after the max retry count is hit

This keeps transient failures from leaking into the database and keeps the user flow smooth.

#### Fallback Behavior
If all retries fail, the system:

•⁠  ⁠Returns a *safe, descriptive error* to the frontend
•⁠  ⁠Logs enough detail to debug the issue later
•⁠  ⁠*Never writes partial/broken data* to the database
•⁠  ⁠Avoids sending inconsistent results back to the UI

#### Graceful Handling of Failures
The backend tries to fail in a way that’s predictable and easy for the client to handle.

•⁠  ⁠*Examples:*
    * If the LLM returns something invalid, the function returns a *structured error object* instead of crashing.
    * If Supabase insert fails, the function responds with a *clear status* and never silently succeeds.
    * *Timeouts are enforced* so the client isn't left hanging indefinitely.
•⁠  ⁠Errors are separated from the happy-path logic, so failures stay obvious and isolated.

The goal is that any error is both “usable” and non-destructive.

--- 

### Strong Prompt Engineering

LLM quality matters, and weak prompts lead to unstable behavior. The prompts in this project are designed to be:

1.  *Strict in format*
    The LLM is required to return *only valid JSON*, no prose, no markdown, no commentary.
2.  *Clear about constraints*
    The prompt reinforces rules like:
    * no repeated questions
    * unique options
    * no extra whitespace
    * deterministic structure
3.  *Self-correcting*
    The prompt includes reminders about what not to output, so even if the LLM drifts, it snaps back quickly.

---

### Correctness is not stored in the database

Instead of storing ⁠ correct_index ⁠ in the ⁠ questions ⁠ table, *correctness is computed at answer-time*. This keeps the game fair and prevents frontend tampering.

### Edge Functions own all business logic

No business rules live on the client. The frontend only submits minimal data, and the backend handles the rest.

### Realtime updates create a responsive UI

As soon as an answer is inserted, connected clients get notified. This sets things up nicely for multiplayer, leaderboards, and admin tools.

### Broadcast channels for light, fast messaging

When you just need to notify clients, *Broadcast* is the quicker option compared to a full database change notification.

---

## 🚀 Deployment on Vercel

The frontend is deployed on **Vercel**, which provides fast global edge delivery and zero-config builds for React + Vite projects.  

### Backend Deployment
1. Backend is deployed on supabase

Any future pushes to `main` trigger an automatic redeploy with no manual steps required.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the project, fix a bug, or suggest a feature, feel free to open an issue or submit a pull request.

### How to Contribute

1. **Fork** the repository  
2. **Create a new branch** for your change  
3. Make your updates with clear commits  
4. **Open a pull request** describing what you changed and why  
5. The project maintainer will review and merge when ready  

Please keep your code readable, typed, and consistent with the existing project structure.

---

### 👨‍💻 Author

**Rahulya Potla**  
Developer & creator of this Trivia Game project.

---

## Questions?
Just ask! Happy to help clarify anything about the architecture or setup.