<div align="center">

<h1>⚡ StudyBuddy AI</h1>

<p><strong>A full-stack, gamified EdTech SaaS platform that helps students study smarter, retain information faster, and stay consistent — powered by cutting-edge AI.</strong></p>

<p>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?style=for-the-badge" alt="Groq" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

<p>
  <img src="https://img.shields.io/badge/Auth-NextAuth.js-purple?style=for-the-badge" alt="NextAuth" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#-environment-variables)
  - [Running Locally](#-running-locally)
- [API Reference](#-api-reference)
- [Production Build](#-production-build)
- [Deployment](#-deployment-vercel)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 🎯 Overview

**StudyBuddy AI** is a modern, AI-powered learning platform designed to transform the way students study. It combines conversational AI tutoring, interactive document analysis, gamified quizzes, spaced-repetition flashcards, and personalized exam roadmaps into a single, cohesive platform.

Built with a bold **Neo-Brutalist design system**, StudyBuddy AI prioritizes high engagement through tactile UI interactions, vibrant visuals, and a gamified streak system — making consistent studying feel rewarding rather than tedious.

> Whether you're cramming for finals or building long-term subject mastery, StudyBuddy AI adapts to your learning goals.

---

## ✨ Key Features

### 🤖 1. AI Study Assistant (Chat)
- Conversational AI tutor with full Markdown rendering for rich responses.
- Handles topic explanations, problem-solving walk-throughs, and conceptual deep-dives.
- One-click **Save to Notes** — pin any AI explanation directly into your personal notes library.

### 📄 2. Interactive PDF Tutor
- Upload any PDF study document and interact with it through natural language.
- AI generates a concise summary and answers questions **grounded strictly in the uploaded material** — no hallucinations from unrelated knowledge.
- Ideal for lecture slides, textbook chapters, and research papers.

### 📝 3. AI Quiz Generator & Evaluator
- Generates on-demand **Multiple Choice Question (MCQ)** quizzes based on a custom subject or an uploaded PDF.
- Provides real-time automated scoring, instant answer feedback, and detailed explanations for every question.
- Track quiz performance over time through the Analytics dashboard.

### 🃏 4. 3D Active Recall Flashcards
- Automatically generates **Flashcard Decks** with Question (Front) and Answer (Back) states from any topic.
- Features interactive **3D flip card animations** for immersive active recall practice.
- Decks are saved persistently to MongoDB, enabling long-term **spaced repetition** workflows.

### 🗺️ 5. AI Study Roadmap & Exam Planner
- Generates a tailored, day-by-day exam revision blueprint based on your subject and available time.
- Supports **3, 7, 14, or 30-day** study plans with daily hour allocations and learning goals.
- Interactive checklist UI tracks your completion percentage in real time.

### 📊 6. Analytics & Study Streak Tracker
- Gamified **Daily Study Streak (🔥)** system with automated break detection to keep you accountable.
- Visual dashboard metrics covering total quizzes attempted, flashcard decks created, and overall study activity over time.

### 🎨 7. Neo-Brutalist & Gamified UI
- Distinctive design language featuring high-contrast borders, offset drop shadows, vibrant color badges, and satisfying interactive press states.
- Fully responsive layout with a unified sidebar for desktop and a mobile-friendly drawer navigation.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | SSR, Server Actions, API Routes |
| **Language** | TypeScript (Strict) | End-to-end type safety |
| **Styling** | Tailwind CSS | Custom Neo-Brutalist design tokens |
| **Authentication** | NextAuth.js / Auth.js | Session management & route protection |
| **Database** | MongoDB + Mongoose ODM | Persistent data storage |
| **AI Model** | Groq SDK (`llama-3.3-70b-versatile`) | Ultra-fast AI inference |
| **Notifications** | Sonner | Toast notification system |
| **Icons** | Lucide React | Consistent icon library |
| **Deployment** | Vercel | CI/CD and edge hosting |

---

## 📂 Project Structure

```
studybuddy-ai/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── analytics/        # Study streak & performance metrics
│   │   │   ├── chat/             # AI conversational tutor
│   │   │   ├── dashboard/        # Main hub with feature shortcuts
│   │   │   ├── flashcards/       # 3D flashcard deck viewer & generator
│   │   │   ├── pdf-tutor/        # PDF upload, parsing & context-aware Q&A
│   │   │   ├── quiz/             # MCQ quiz generator & auto-evaluator
│   │   │   ├── roadmap/          # Personalized exam revision planner
│   │   │   └── saved-notes/      # Personal notes library
│   │   ├── api/
│   │   │   ├── analytics/        # Streak tracking & stats endpoints
│   │   │   ├── chat/             # Groq AI streaming completion route
│   │   │   ├── flashcards/       # Flashcard CRUD & generation endpoints
│   │   │   ├── quiz/             # Quiz creation & scoring endpoints
│   │   │   └── roadmap/          # Roadmap generation & persistence endpoints
│   │   ├── layout.tsx            # Root layout (fonts, toast provider)
│   │   ├── loading.tsx           # Global loading skeleton fallback
│   │   └── page.tsx              # Public landing page
│   ├── components/
│   │   ├── Sidebar.tsx           # Persistent desktop sidebar & mobile drawer
│   │   └── ui/                   # Reusable Neo-Brutalist UI primitives
│   ├── lib/
│   │   ├── db.ts                 # Cached MongoDB connection handler
│   │   └── utils.ts              # Shared utility/helper functions
│   └── models/
│       ├── Flashcard.ts          # Mongoose schema for flashcard decks
│       ├── Roadmap.ts            # Mongoose schema for study roadmaps
│       ├── User.ts               # Mongoose schema for authenticated users
│       └── UserStat.ts           # Mongoose schema for analytics & streaks
├── public/                       # Static assets (images, icons, fonts)
├── .env.local                    # Local environment configuration (gitignored)
├── next.config.ts                # Next.js build & runtime configuration
├── tailwind.config.ts            # Tailwind custom theme (colors, shadows, borders)
└── package.json                  # Project dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed and configured before proceeding:

- **Node.js** `v18.x` or higher ([Download](https://nodejs.org/))
- **npm** or **pnpm**
- **MongoDB** — a local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Groq API Key** — obtain a free key from the [Groq Console](https://console.groq.com/)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/shaheerawan/studybuddy-ai.git
cd studybuddy-ai
```

**2. Install dependencies**

```bash
npm install
# or
pnpm install
```

---

### 🔑 Environment Variables

Create a `.env.local` file in the project root and populate it with the following keys:

```env
# ─── Database ───────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/studybuddy?retryWrites=true&w=majority

# ─── AI Provider ────────────────────────────────────────────────
GROQ_API_KEY=gsk_your_groq_api_key_here

# ─── Authentication ─────────────────────────────────────────────
AUTH_SECRET=your_super_secret_auth_key_here
NEXTAUTH_URL=http://localhost:3000
```

| Variable | Description |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB Atlas or local connection string |
| `GROQ_API_KEY` | API key from [console.groq.com](https://console.groq.com/) |
| `AUTH_SECRET` | A long, random string used to sign session tokens (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | The canonical URL of your deployment (use `http://localhost:3000` for local dev) |

> ⚠️ **Never commit `.env.local` to version control.** It is already included in `.gitignore`.

---

### ▶️ Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app supports **Hot Module Replacement (HMR)** — changes are reflected instantly without a full page reload.

---

## 📡 API Reference

All API routes live under `/src/app/api/` and follow Next.js App Router conventions.

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/chat` | `POST` | Streams a conversational AI response from Groq |
| `/api/quiz` | `POST` | Generates an MCQ quiz for a given subject or document |
| `/api/flashcards` | `GET` | Fetches all saved flashcard decks for the current user |
| `/api/flashcards` | `POST` | Generates and saves a new flashcard deck |
| `/api/roadmap` | `POST` | Generates and saves a personalized study roadmap |
| `/api/roadmap` | `GET` | Retrieves saved roadmaps for the current user |
| `/api/analytics` | `GET` | Fetches study streak data and usage statistics |

> All routes are protected by NextAuth.js session middleware. Unauthenticated requests receive a `401 Unauthorized` response.

---

## 🏗️ Production Build

Verify the build is error-free before deploying:

```bash
# Compile and type-check the production build
npm run build

# Start the production server locally
npm run start
```

This runs a full TypeScript compilation and Next.js static analysis. Resolve any reported errors before pushing to production.

---

## 🌐 Deployment (Vercel)

StudyBuddy AI is optimized for deployment on the **Vercel Platform**.

1. Push your repository to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. In **Project Settings → Environment Variables**, add all four variables from your `.env.local`:
   - `MONGODB_URI`
   - `GROQ_API_KEY`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL` *(set this to your live Vercel domain, e.g., `https://studybuddy-ai.vercel.app`)*
4. Click **Deploy**.

Vercel automatically handles CI/CD — every push to `main` triggers a new production deployment.

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated. To contribute:

1. **Fork** the repository.
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Commit your changes**: `git commit -m 'feat: add your feature description'`
4. **Push to your branch**: `git push origin feature/your-feature-name`
5. **Open a Pull Request** against the `main` branch.

Please ensure your code passes the production build (`npm run build`) and follows the existing TypeScript and code style conventions before submitting a PR.

For major feature proposals, please open an **Issue** first to discuss the change.

---

## 👤 Author

**Shaheer Awan**

- GitHub: [@shaheerawan](https://github.com/shaheerawan)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Shaheer Awan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

<div align="center">
  <p>Built with ❤️ by <strong>Shaheer Awan</strong></p>
  <p>
    <a href="https://github.com/shaheerawan/studybuddy-ai/issues">Report a Bug</a> ·
    <a href="https://github.com/shaheerawan/studybuddy-ai/issues">Request a Feature</a>
  </p>
</div>