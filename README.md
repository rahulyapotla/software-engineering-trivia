# 🎯 Trivia Game — React + Supabase Realtime

A realtime trivia game built with **React, TypeScript, Vite, and Supabase**.  
The UI stays perfectly synced with the backend through **Supabase Realtime channels** and **Edge Functions** that handle AI-powered question generation and answer validation.

---
### Live App
👉 https://software-engineering-trivia.vercel.app/

---
## 🚀 Features

- Realtime streaming of new questions  
- AI-generated trivia using Groq LLM  
- Realtime scoring via Supabase Broadcast  
- Clean UI component system (Buttons, Radio Groups, Scoreboard)  
- Business logic encapsulated in custom hooks  
- Global score store using React Context  
- Fast development workflow with Vite  
- Fully typed with TypeScript  

---

## ✨ Overview

This project focuses on a clean, modern, scalable frontend architecture:

- Realtime-first data flow
- Custom hooks for separation of logic
- Strong TypeScript typings
- Supabase Edge Functions as the backend
- Stateless UI driven entirely by realtime events

The backend:
- Generates questions using Groq LLM
- Validates answers using the same LLM
- Stores all results in Supabase PostgreSQL
- Broadcasts events to all connected clients

The frontend:
- Subscribes to realtime question + score events
- Reflects backend truth instantly
- Keeps UI extremely responsive and predictable

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Button.tsx
│   ├── RadioGroup.tsx
│   ├── ErrorToast.tsx
│   ├── RadioGroupItem.tsx
│   ├── Scoreboard.tsx
│   ├── HeroTitle.tsx
│   ├── Spinner.tsx                 # Loading spinner shown during requests
│   └── AnswerFeedback.tsx          # triggers confetti
│
├── hooks/
│   ├── useQuestionStream.ts        # Realtime new-question listener
│   └── useAnswerHook.ts            # Submit user-selected answer & listen for updates
│
├── context/
│   └── ScoreContext.tsx            # Global score provider (totalScore, explanation, correctness)
│
├── lib/
│   └── supabaseClient.ts           # Single Supabase instance shared across the app
│
├── pages/
│   ├── Index.tsx                   # Landing page with current session score
│   ├── GamePage.tsx                # Main quiz interface
│   └── NotFound.tsx
│
└── App.tsx                         # App entry with routing + providers
```


---

## 🛠 Getting Started

### 1. Clone the repo
`git clone https://github.com/rahulyapotla/software-engineering-trivia.git`

`cd software-engineering-trivia-game`

### 2. Install dependencies
`cd client`
`npm install`

### 3. Add environment variables
Create a `.env` file in the project `client` folder:

Add the below env variables
`VITE_SUPABASE_URL=your_supabase_url`

`VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`

### 4. Run in development
`npm run dev`

---

## 🔄 Realtime Architecture

### useQuestionStrea
- Calls the Edge function `generate-new-question`.
- Subscribes to the `trivia-room` broadcast channel  
- Receives new questions immediately when backend inserts a new record into db. 
- No polling needed

### useAnswerHook  
- Sends user's selected answer to Edge Function `submit-answer`
- Backend validates using LLM  
- Supabase broadcasts `score_update`  
- UI updates instantly

### useScore (Context)  
- Stores `totalScore`, `explanation`, `isCorrect`  
- Accessible across Home + Game pages  

---

## 🎨 Component Design Philosophy

The UI components follow a few consistent principles:

### ✦ 1. Generic, predictable structure
Each component accepts clear props and avoids hidden behavior.

### ✦ 2. High readability
Each component is short, easy to scan, and behaves exactly how it looks.

### ✦ 3. Separation of concerns
- Hooks handle data retrieval and realtime events  
- Components handle rendering  
- Pages orchestrate state and layout  

### ✦ 4. TypeScript for safety and clarity
TypeScript keeps the codebase easy to maintain by ensuring:
- Strongly typed Supabase responses  
- Well-defined component interfaces  
- Safer state updates  
- Fewer runtime surprises  

This makes refactoring and adding features far more reliable.

---

## 🔑 Key Frontend Design Decisions

### ✔ Realtime-first architecture
Instead of relying on local game logic, the UI always reflects the source of truth from the backend.  
This keeps the game consistent, reduces bugs, and avoids sync issues between clients.

### ✔ Custom hooks instead of in-component logic
Business rules stay inside reusable hooks, so components remain simple, predictable, and easy to test.

### ✔ UI built from small primitives
The interface is composed of small, reliable building blocks rather than large monolithic components.  
This makes styling, refactoring, and extending the UI much easier.

### ✔ TypeScript everywhere
TypeScript strengthens the whole app by enforcing:
- typed Supabase responses  
- predictable component APIs  
- safer state handling  
- easier refactoring over time  

### ✔ Vite for fast refresh + clean bundling
Hot reload is instant and production builds are extremely fast.

### ✔ Built-in loading states with a spinner
The app includes lightweight loading indicators to handle:
- waiting for realtime question events  
- answer submission  
- initial Supabase connection  
This keeps the experience smooth and makes state transitions obvious to the user.

---

## 🎮 Core Quiz Play Flow

The quiz experience is designed to be simple, reactive, and fully driven by realtime updates from the backend.  
Here’s how the flow works from the user’s perspective:

### 1. Landing Page
- The user starts on the home screen.  
- Their **current session score** is displayed immediately (powered by Supabase Realtime).  
- When they tap **Start Quiz**, they are taken into the main quiz screen and a fresh session begins.

### 2. Viewing a Question
- The quiz page loads the latest trivia question published by the backend.  
- Each question includes **multiple-choice options** displayed as clean radio buttons.

### 3. Selecting an Answer
- The user picks one option.  
- The **Submit** button becomes active and ready to use.

### 4. Submitting the Answer
- After clicking **Submit**, the UI temporarily disables input to prevent double-submissions.  
- The backend evaluates the answer and sends back a realtime update with:
  - whether the user was correct  
  - the updated total score  
  - an explanation for the correct answer  

### 5. Showing Results
- If the answer is **correct**:
  - the scoreboard increases immediately  
  - a celebratory **confetti effect** appears  
- If the answer is **wrong**:
  - the score does not change  
- In both cases, the UI shows a short explanation above the question.

### 6. Next Question
- Once the explanation is displayed, the **Next Question** button becomes enabled.  
- Pressing it requests the backend to publish the next question, and the UI updates automatically through the realtime subscriptions.

### 7. Returning Home
- If the user navigates back to the home page, their **updated total score** is shown for the session.  
- Pressing **Start Quiz** again begins a **brand-new quiz**.

This flow keeps the UI responsive, prevents state drift, and ensures the player always sees the canonical truth from the backend.

---

## 🚀 Deployment on Vercel

The frontend is deployed on **Vercel**, which provides fast global edge delivery and zero-config builds for React + Vite projects.

### Why Vercel?
- Automatic build + deploy on every push  
- Extremely fast static asset hosting  
- Built-in environment variable management  
- Perfect for lightweight real-time apps like this quiz  

### Deployment Workflow
1. Push code to your GitHub repository  
2. Vercel detects the project as a **Vite + React** app  
3. It installs dependencies, runs `npm run build`, and uploads the output  
4. The app becomes instantly available on a global CDN  

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





