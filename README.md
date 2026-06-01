# Expense Tracking App
A personal finance management application that helps users track income and expenses, automatically categorize transactions using AI, and manage budgets in real time.

# Demo
[Expense Tracking App Demo](https://quan-ly-chi-tieu-thong-minh-dvbeckham05.vercel.app)
# Getting Started (Local Setup)
1. Clone the repository
```bash
git https://github.com/Davidbeckham2005/Expense-Tracking.git
cd expense-tracking 
```
2. install dependencies
```bash
npm i
```
3. create .env file
```js
VITE_SUPABASE_URL=https://ynlpzqqbcbrabyuaerxh.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_kwScxmmMkIC3giJjhWDhmQ_eLc30L75
GEMINI_API_KEY_02= "your api key"
```

open docker desktop
```bash
docker version -> ok
supabase start
supabase functions serve

```
4. Run the project
npm run dev
# Features
📊 Track income and expenses easily
🤖 AI-powered transaction parsing (OpenAI API)
🏷️ Automatic expense categorization
📅 Filter transactions by date and month
💸 Budget tracking by category
🔐 Data storage with Supabase
⚡ Easy deployment with Vercel

# Tech Stack
Frontend: React + TypeScript + Vite
Backend: Supabase (Database + Auth)
AI Integration: GEMINI API
Deployment: Vercel
Styling: Tailwind CSS (or custom CSS)

# Project Structure 
src/
│
├── assets/              # Static assets
│
├── component/           # Reusable UI components
│   ├── Budget/          # Budget management components
│   ├── Category/        # Category management UI
│   ├── Chart/           # Data visualization components
│   ├── DetectTransaction/ # AI transaction parsing UI
│   ├── Gemini-chat/     # AI chat integration module
│   ├── Report/          # Financial reports UI
│   └── Transactions/    # Transaction list & details
│
├── constants/           # App constants (colors, icons)
├── context/             # React Context providers (global state, authentication)
├── Features/            # Feature-based modules (business logic grouped by feature)
├── lib/                 # External library configurations (Supabase, OpenAI, etc.)
├── Routes/              # Application routing setup
├── Schemas/             # Validation schemas (React Hook Form + resolvers zod)
├── services/            # API calls (Supabase, OpenAI, backend services)
├── store/               # State management (Zustand)
├── types/               # TypeScript type and interface definitions
└── utils/               # Helper functions and utilities




# 👨‍💻 Author
DavidBeckham05, by personal purpose to manager my  lose money :)
Personal project for learning full-stack development with modern tools.
Name: Dinh Hoang Kham 
ID: B2303822
Collect: 3

