Trivia Game Frontend — React + Supabase Realtime

This is the frontend for the trivia app. It’s built with React, TypeScript, and Vite, and it talks to the backend entirely through Supabase Realtime and Edge Functions.
The structure focuses on clarity, maintainability, and a clean separation between UI, hooks, and data-layer concerns.

A quick overview
components/

 Fully reusable UI pieces designed with a generic, predictable structure. Each component aims to be self-contained, readable, and easy to extend.

hooks/

 Houses custom hooks that encapsulate realtime logic and business rules:


useQuestionStream – subscribes to Supabase Realtime to receive new questions as soon as they’re inserted.


useAnswerHook – sends answers to the backend and listens for updates like correctness or scoreboard changes.


lib/


supabaseClient.ts initializes the Supabase client once and reuses it everywhere.


utils.ts includes shared helpers.


pages/

 Simple route-level components powered by React Router:


Home screen


Quiz screen


Not Found screen


 Getting Started
Install dependencies
npm install
Run the dev server
npm run dev
Environment variables
Create a .env file in the frontend root:
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
Vite automatically exposes VITE_ prefixed variables to your client code.

Realtime Integration - How the Frontend Stays in Sync?
The frontend doesn’t poll or fetch repeatedly.
Instead, it uses Supabase Realtime subscriptions wrapped inside custom hooks.
Questions stream — 
useQuestionStream
This hook:
Subscribes to the questions table


Listens specifically for inserts


Pushes new questions straight into React state


Cleans up subscriptions automatically on unmount


This keeps the quiz experience immediate and predictable, without manual refreshes.
Answers & scoring — 
useAnswerHook
This hook:
Sends the selected answer to the backend


Subscribes to the answers table for inserts matching the current player/session


Updates the Scoreboard UI as soon as the backend writes a new row


This design keeps the UI reactive and avoids storing any state that could fall out of sync with the database.

🎨 Component Design Philosophy
The UI components follow a few consistent principles:
✦ 1. Generic, predictable structure
Each component accepts clear props and avoids hidden behavior.
✦ 2. High readability
Each component is short, easy to scan, and behaves exactly how it looks.
✦ 3. Separation of concerns
Hooks handle data retrieval and realtime events.
Components handle rendering.
Pages orchestrate state and layout.
✦ 4. Future-proofing
This structure allows:
theme swaps


animation additions


component reuse


shared states across screens

 without rewriting core logic.



Key Frontend Design Decisions
✓ Realtime-first architecture
Instead of local game logic, the UI always reflects the truth from the backend.
This ensures fewer bugs and fewer sync issues.
✓ Custom hooks instead of in-component logic
Business rules live in hooks so components stay lightweight and easy to test.
✓ UI built from small primitives
Design scales better when everything is composed from reliable building blocks rather than monolithic widgets.
✓ TypeScript everywhere
Ensures:
typed Supabase responses


predictable component APIs


safer state handling


easier refactoring


✓ Vite for fast refresh + clean bundling
Hot reload is instant, and dev builds are extremely fast.
Running a Production Build
npm run build
npm run preview

