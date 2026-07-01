# mindtrack-ai

AI-assisted project management platform with persistent context, semantic retrieval, and local-first LLM support.

## Why this project exists

Most productivity tools store tasks, but not operational context. `mindtrack-ai` is designed to preserve reasoning, decisions, and execution history so teams can move faster without losing continuity.

## Core capabilities

- Project and task management with structured states
- Contextual chat per project
- Semantic search over notes and history
- Local-first LLM workflows with provider flexibility
- Optional BYOK model for cloud inference

## Architecture

- Frontend: Next.js + TypeScript + Tailwind
- Backend: Next.js API routes (App Router)
- Database: PostgreSQL + Prisma + pgvector
- AI providers: Ollama (default), optional cloud providers

## Product principles

- Cost control first: local inference by default
- Portability: API-first design for web, desktop, and mobile clients
- Data ownership: export/import strategy from the core design
- Vendor flexibility: no hard lock-in to one model provider

## Quickstart

```bash
git clone https://github.com/Tiggreee/mindtrack-ai.git
cd mindtrack-ai
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000

## Environment

Configure providers and database in `.env`.

Typical variables:
- `DATABASE_URL`
- `LLM_PROVIDER`
- `EMBEDDING_PROVIDER`
- provider-specific API keys when using cloud models

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Roadmap

- Better contextual suggestions from historical project behavior
- Calendar and scheduling integration
- Export/import workflows for migration and backup
- Desktop/mobile clients over the same API contracts

## Author

Victor Salgado  
Full Stack Developer (MERN + TypeScript)  
Systems-focused, production-oriented, remote-ready
