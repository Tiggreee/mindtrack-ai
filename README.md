# MindTrack

Asistente personal de proyectos con memoria persistente, búsqueda semántica y sincronización con Google Calendar. El núcleo es gestión de proyectos; la búsqueda de empleo vive como módulo opcional dentro del mismo sistema.

**Autor:** Victor — Full Stack (MERN) · Inglés C2 · Remoto US/global

**Estado:** Fase 1 — base técnica y documentación (mayo 2026)

---

## Principios inquebrantables

Estas reglas mandan sobre cualquier decisión de stack o UI.

### 1. Costo operativo al mínimo

El producto debe poder usarse y escalarse **sin quemar dinero en APIs**. Objetivo: margen alto si se vende.

| Uso | Proveedor recomendado | Coste |
|-----|----------------------|-------|
| Desarrollo / uso personal | **Ollama** (local) | $0 |
| Chat en la nube (opcional) | **Groq** (tier gratis) | $0–bajo |
| Calidad puntual (demo) | Anthropic | Solo si hace falta |
| Embeddings | Local (Ollama) o OpenAI con cache | Preferir local |
| Base de datos | Postgres self-hosted o Neon free | $0 al inicio |
| Hosting web | Vercel free / VPS propio | $0–bajo |

**BYOK (Bring Your Own Key):** en una versión vendible, el cliente pone sus keys o corre todo en su servidor. Tú no pagas sus tokens.

**Nada obligatorio de pago** para el flujo core: proyectos, tareas, notas, chat con modelo local.

### 2. Multiplataforma desde el diseño (API primero)

La web (Next.js) es el **primer cliente**, no el único cerebro. Toda la lógica de negocio vive detrás de **API JSON estable** para poder envolverla después.

| Plataforma | Enfoque | Cuándo |
|------------|---------|--------|
| **Web / PWA** | Next.js actual | Ahora |
| **Windows / Linux / macOS** | Tauri o PWA instalable | Fase 5 |
| **Android / iOS** | Capacitor o Expo consumiendo la misma API | Fase 5 |
| **ESP32** | Periférico (botón, sensor, webhook), **no** motor del LLM | Opcional |

No duplicar lógica en cada app: un backend, N clientes.

### 3. Exportación y portabilidad

El usuario es dueño de sus datos. Desde el inicio, planear:

- Export **JSON** completo (proyectos, tareas, notas, chat).
- Export **CSV** para tareas y módulo empleo.
- Import del mismo formato (recuperación o migración).

Sin lock-in: si dejan de pagar, se llevan todo.

### 4. Camino a producto vendible

- **Self-hosted:** Docker + Postgres + Ollama en el servidor del cliente.
- **SaaS barato:** multi-tenant en un VPS, BYOK para IA.
- **Freemium:** core gratis (local), sync/nube de pago.

---

## Qué resuelve

Registra en qué vas en cada proyecto, qué sigue, qué te bloquea y cuándo toca retomar algo. El chat usa contexto guardado en base de datos; las notas se indexan con embeddings para búsqueda por significado, no solo por palabra exacta.

No sustituye Notion ni LinkedIn. Complementa tu flujo: un producto propio que usas a diario y que puedes mostrar en portafolio y entrevistas.

---

## Arquitectura

```
Clientes (presente y futuro)
├── Web / PWA     → Next.js (ahora)
├── Desktop       → Tauri → misma API (futuro)
├── Mobile        → Capacitor / Expo → misma API (futuro)
└── ESP32         → webhook → API (opcional, sin LLM en chip)

API REST (Next.js Route Handlers)
├── /api/projects
├── /api/tasks
├── /api/chat
├── /api/search
├── /api/export     → JSON / CSV (planificado)
└── /api/calendar   → Fase 3

Datos
└── PostgreSQL + pgvector

IA (siempre intercambiable por env)
├── LLM        → ollama (default) | groq | anthropic
├── Embeddings → ollama | openai
└── Búsqueda   → pgvector

Auth
└── Google OAuth (Calendar solo en Fase 3)
```

Regla: ningún componente de UI importa Prisma ni llama al LLM directo; solo habla con `/api/*`.

---

## Fases de desarrollo

| Fase | Alcance | Tiempo orientativo |
|------|---------|-------------------|
| **1 — Core** | Auth Google, CRUD proyectos/tareas, chat con contexto, notas + embeddings | 2–3 semanas |
| **2 — Inteligencia** | Búsqueda semántica en historial, sugerencias de próximos pasos, alertas por inactividad | 1–2 semanas |
| **3 — Calendario** | Crear eventos desde chat (“recuérdame el viernes 10:00”) | 1 semana |
| **4 — Portafolio** | Deploy (Vercel + Neon), README público, demo en video ~2 min | 1 semana |
| **5 — Multiplataforma** | PWA instalable, Tauri (Win/Linux/mac), export/import, doc self-host | según demanda |

**Fase actual:** 1. Scaffold Next.js, schema Prisma, rutas API, IA configurable (Ollama por defecto), landing y panel mínimo.

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
| LLM | Ollama (default) / Groq / Anthropic vía `LLM_PROVIDER` |
| Embeddings | Ollama local o OpenAI (`EMBEDDING_PROVIDER`) |
| Clientes futuros | Tauri, Capacitor/Expo (misma API) |

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
| `LLM_PROVIDER` | `ollama` (default) \| `groq` \| `anthropic` |
| `OLLAMA_BASE_URL` | Ej. `http://localhost:11434` |
| `OLLAMA_MODEL` | Ej. `llama3.2` |
| `GROQ_API_KEY` | Opcional |
| `ANTHROPIC_API_KEY` | Opcional |
| `EMBEDDING_PROVIDER` | `ollama` \| `openai` |
| `OPENAI_API_KEY` | Solo si embeddings = openai |
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

1. **Costo primero:** antes de añadir un SaaS de pago, comprobar si Ollama/local o BYOK lo resuelve.
2. **API primero:** lógica en `src/lib/` + rutas; la UI solo consume JSON.
3. Revisa la fase actual; no adelantar Calendar o apps nativas sin cerrar el core web.
4. Cada sprint grande: actualizar CV si hay demo o métrica nueva.
5. Export JSON/CSV antes de features “bonitas” si compite con portabilidad.

---

## Licencia

Uso personal. Código público opcional para portafolio.
