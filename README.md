# Fiverr Copilot

Optimize your Fiverr gigs, classify buyer messages, and never miss a 24-hour reply deadline.

## Stack

- **Frontend:** Next.js 16, Tailwind CSS v4, shadcn/ui
- **Backend:** FastAPI, SQLAlchemy 2.0, SQLite
- **AI:** Provider-agnostic — supports OpenAI, Groq, Anthropic, Gemini, Ollama, and any OpenAI-compatible API
- **Extension:** Cross-browser (Chrome, Firefox, Safari via converter)

## Quick Start

```bash
# Backend
cd backend
.venv/bin/uvicorn backend.main:app --reload

# Frontend
cd frontend
npm run dev
```

Set `AI_API_KEY` in `backend/.env` to use real AI responses (optional — mock data works out of the box).

## Browser Extension

Build for all browsers:

```bash
cd browser-extension
bash scripts/build.sh
```

See `browser-extension/README.md` for install instructions per browser.

## Project Structure

```
├── frontend/            Next.js app (dashboard, gig builder, inbox)
├── backend/             FastAPI server (REST API, DB, AI layer)
├── browser-extension/   Cross-browser extension for Fiverr inbox
└── docs/                Architecture & wireframes
```

## AI Provider Config

| Provider | AI_PROVIDER | Requires |
|---|---|---|
| Groq (free) | openai | AI_API_KEY |
| OpenAI | openai | AI_API_KEY |
| Anthropic | anthropic | AI_API_KEY |
| Google Gemini | gemini | AI_API_KEY |
| Ollama (local) | ollama | nothing |

See `backend/.env.example` for all options.
