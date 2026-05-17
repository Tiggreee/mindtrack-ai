# MindTrack

Asistente personal de proyectos con memoria persistente, búsqueda semántica y sincronización con Google Calendar. El núcleo es gestión de proyectos; la búsqueda de empleo vive como módulo opcional dentro del mismo sistema.

**Autor:** Victor — Full Stack (MERN) · Inglés C2 · Remoto US/global

**Estado:** Fase 1 — base técnica y documentación (mayo 2026)

---

## Qué resuelve

Registra en qué vas en cada proyecto, qué sigue, qué te bloquea y cuándo toca retomar algo. El chat usa contexto guardado en base de datos; las notas se indexan con embeddings para búsqueda por significado, no solo por palabra exacta.

No sustituye Notion ni LinkedIn. Complementa tu flujo: un producto propio que usas a diario y que puedes mostrar en portafolio y entrevistas.

---

## Arquitectura

```
Frontend (Next.js App Router)
├── Auth          → NextAuth + Google OAuth
├── Dashboard     → proyectos, tareas, timeline
├── Chat          → contexto del proyecto → LLM
└── Calendario    → Google Calendar (Fase 3)

Backend (API Routes en el mismo repo)
├── /api/projects
├── /api/tasks
├── /api/chat
├── /api/search      → similitud con pgvector
└── /api/calendar    → Google Calendar (Fase 3)

Base de datos (PostgreSQL + pgvector)
├── users
├── projects
├── tasks
├── notes
└── embeddings

IA
├── LLM        → Anthropic Claude o Groq (configurable)
├── Embeddings → OpenAI text-embedding-3-small
└── Búsqueda   → pgvector (coseno)

Integraciones
├── Google OAuth
└── Google Calendar API (Fase 3)
```

---

## Fases de desarrollo

| Fase | Alcance | Tiempo orientativo |
|------|---------|-------------------|
| **1 — Core** | Auth Google, CRUD proyectos/tareas, chat con contexto, notas + embeddings | 2–3 semanas |
| **2 — Inteligencia** | Búsqueda semántica en historial, sugerencias de próximos pasos, alertas por inactividad | 1–2 semanas |
| **3 — Calendario** | Crear eventos desde chat (“recuérdame el viernes 10:00”) | 1 semana |
| **4 — Portafolio** | Deploy (Vercel + Neon), README público, demo en video ~2 min | 1 semana |

**Fase actual:** 1. Lo que ya está en el repo: scaffold Next.js, schema Prisma, rutas API base, capa IA configurable, landing y dashboard mínimo.

---

## Módulo: búsqueda de empleo

Secundario respecto al core. Mismo stack; campos y vistas orientados a vacantes, follow-ups y rutina diaria.

### Plataformas (prioridad)

| Prioridad | Canal |
|-----------|--------|
| Alta | LinkedIn Jobs, Arc.dev, RemotoJOB, Talently, GetManfred |
| Media | Computrabajo, OCC, Glassdoor (salarios y research) |
| Extra | Workana (freelance → proyectos reales en portafolio) |

**Arc.dev:** un filtro técnico; si pasas, empresas US/EU contactan por tu stack. Encaja con MERN + inglés C2.

### Rutina diaria (mientras se construye la app)

| Bloque | Tiempo | Acción |
|--------|--------|--------|
| A — Aplicaciones | 30–45 min | 5 LinkedIn, 2 Arc, 2 RemotoJOB, 1 OCC/Computrabajo |
| B — Networking | 20 min | Mensajes a recruiters, 1 comentario técnico, 1 post/semana |
| C — Portafolio | 30–60 min | Mejorar proyecto, feature con IA, documentar |
| D — Producto | 20 min | Avanzar MindTrack o integrar una API de IA |

Mínimo en día corto: 3 aplicaciones (Bloque A) + 1 commit o feature en MindTrack (Bloque D).

### Estados de una vacante (módulo job)

`saved` → `applied` → `screening` → `interview` → `offer` → `rejected` → `ghosted`

Campos: empresa, rol, URL, plataforma, salario, remoto, recruiter, `followUpAt`, notas.

---

## CV y portafolio (en paralelo al código)

Actualiza el CV dentro de 48 h de cada sprint con algo demostrable. No esperes a tener la app terminada.

### El CV debe decir

- Aplicaciones full stack con React, Node, Express y MongoDB/PostgreSQL
- Integración de APIs de IA en flujos de desarrollo
- Features end-to-end con foco en rendimiento y mantenibilidad
- Inglés C2

### El CV no debe decir

- “Primera oportunidad”, “sin experiencia”, “proyectos escolares”

### Línea de portafolio (cuando haya demo)

> MindTrack — Gestión de proyectos con memoria persistente, chat contextual y búsqueda semántica (Next.js, PostgreSQL/pgvector, APIs LLM).

### Checklist por sprint

- [ ] ¿Hay URL de demo o repo público?
- [ ] ¿El README explica el problema y el stack?
- [ ] ¿El CV menciona una métrica o resultado concreto?
- [ ] ¿LinkedIn refleja el mismo mensaje que el CV?

---

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind 4 |
| Backend | API Routes (App Router) |
| ORM | Prisma |
| DB | PostgreSQL + extensión `vector` (pgvector) |
| Auth | NextAuth.js + Google |
| LLM | Anthropic / Groq (variable `LLM_PROVIDER`) |
| Embeddings | OpenAI `text-embedding-3-small` |

---

## Modelo de datos (resumen)

Ver `prisma/schema.prisma`.

- **User** — cuenta Google
- **Project** — nombre, descripción, estado, `type` (`general` | `job_hunt`)
- **Task** — título, estado, prioridad, `dueAt`, bloqueos
- **Note** — texto libre, ligado a proyecto o tarea
- **Embedding** — vector + referencia a nota/tarea
- **ChatMessage** — historial por proyecto
- **JobApplication** — extensión Fase 1 módulo empleo (empresa, rol, URL, plataforma, estado, follow-up)

---

## Estructura del repo

```
mindtrack-ai/
├── README.md
├── .env.example
├── prisma/schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   ├── chat/
│   │   │   ├── search/
│   │   │   └── calendar/          # stub Fase 3
│   │   ├── dashboard/
│   │   └── page.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── ai/
│   └── types/
└── package.json
```

---

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores.

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | PostgreSQL (Neon local o cloud) |
| `AUTH_SECRET` | Secreto NextAuth (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | OAuth Google |
| `LLM_PROVIDER` | `anthropic` \| `groq` |
| `ANTHROPIC_API_KEY` | Si usas Claude |
| `GROQ_API_KEY` | Si usas Groq |
| `OPENAI_API_KEY` | Embeddings |
| `GOOGLE_CALENDAR_*` | Fase 3 |

---

## Comandos

```bash
npm install
npx prisma generate
npx prisma db push          # primera vez / cambios de schema
npm run dev                 # http://localhost:3000
npm run build
npm run lint
```

En PostgreSQL habilita la extensión antes de `db push`:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## Convenciones de trabajo

1. Revisa la tabla de fases arriba; no implementes Calendar ni RAG avanzado si aún estás en Fase 1.
2. Cada PR o commit grande: una línea nueva para el CV si aplica.
3. El módulo job no redefine el core; reutiliza proyectos, tareas y notas donde se pueda.

---

## Licencia

Uso personal. Código público opcional para portafolio.
