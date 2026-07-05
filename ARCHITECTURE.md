# Fiverr Gig & Inbox Copilot — Architecture

## System Overview

Three-tier architecture: Next.js frontend → FastAPI backend → PostgreSQL + Redis + AI services.

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  Tailwind CSS / shadcn/ui · Supabase Auth (client-side)     │
│  react-query · react-hook-form                              │
│  Vercel (hosting)                                           │
├─────────────────────────────────────────────────────────────┤
│                    API Gateway (FastAPI)                     │
│  REST endpoints · JWT middleware · Rate limiting            │
│  Railway / Fly.io (hosting)                                 │
├────────────────────────┬────────────────────────────────────┤
│   PostgreSQL (Neon)    │   Redis + BullMQ (Upstash)         │
│   - Users & accounts   │   - Queues: draft_gen, classify    │
│   - Gig drafts         │   - Deadline reminders (cron)      │
│   - Conversations      │   - Rate-limit counters            │
│   - Templates          │                                    │
│   - Audit log          │                                    │
├────────────────────────┴────────────────────────────────────┤
│                   AI Layer (OpenAI API)                      │
│   gpt-4o-mini for: gig gen · keyword suggest · intent        │
│   classify · reply draft                                    │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Pages (Next.js App Router)

```
app/
├── page.tsx                    # Landing / login
├── dashboard/
│   └── page.tsx                # Aggregated metrics + alerts
├── gigs/
│   ├── page.tsx                # Gig list (audit view)
│   ├── new/page.tsx            # Gig builder wizard
│   └── [id]/
│       ├── page.tsx            # Gig detail / edit
│       └── audit/page.tsx      # Score + checklist
├── keywords/
│   └── page.tsx                # Keyword planner
├── inbox/
│   ├── page.tsx                # Conversation list (triage)
│   └── [id]/page.tsx           # Thread + reply draft
├── templates/
│   └── page.tsx                # Template library CRUD
├── settings/
│   └── page.tsx                # Profile, notifications, tone
└── api/                        # API route handlers (BFF layer)
    └── ...
```

### State Management

- **Server state:** `@tanstack/react-query` — all API data, caching, optimistic updates
- **Form state:** `react-hook-form` + `zod` validation
- **Auth state:** Supabase client-side session + React context

### Key Components

```
components/
├── ui/                          # shadcn primitives
├── dashboard/
│   ├── GigScoreCard.tsx
│   ├── OverdueAlert.tsx
│   └── ResponseTimerWidget.tsx
├── gig-builder/
│   ├── ServiceInputForm.tsx
│   ├── TitleVariants.tsx
│   ├── DescriptionEditor.tsx
│   ├── PackageBuilder.tsx
│   ├── KeywordSelector.tsx
│   └── FaqGenerator.tsx
├── gig-audit/
│   ├── Checklist.tsx
│   └── ScoreGauge.tsx
├── inbox/
│   ├── ConversationRow.tsx       # intent badge, deadline countdown
│   ├── MessageThread.tsx
│   ├── IntentClassifier.tsx
│   └── ReplyApproval.tsx
├── templates/
│   └── TemplateCard.tsx
└── shared/
    ├── Navbar.tsx
    ├── Sidebar.tsx
    ├── Timer.tsx
    └── NotificationBell.tsx
```

## Backend Architecture (FastAPI)

### Directory Layout

```
backend/
├── main.py                      # App factory, middleware, routers
├── core/
│   ├── config.py                # Env + settings
│   ├── database.py              # SQLAlchemy async engine
│   ├── redis.py                 # Redis client
│   ├── queue.py                 # BullMQ-like task queue (Redis-backed)
│   └── security.py              # JWT encode/decode, hashing
├── models/                      # SQLAlchemy ORM models
│   ├── user.py
│   ├── gig.py
│   ├── conversation.py
│   ├── message.py
│   └── template.py
├── schemas/                     # Pydantic request/response
│   ├── user.py
│   ├── gig.py
│   ├── inbox.py
│   └── template.py
├── routers/
│   ├── auth.py                  # POST /auth/signup, /auth/login
│   ├── users.py                 # GET /me, PATCH /me
│   ├── gigs.py                  # Gig CRUD + score + checklist
│   ├── keywords.py              # POST /keywords/suggest
│   ├── packages.py              # POST /packages/generate
│   ├── faqs.py                  # POST /faqs/generate
│   ├── inbox.py                 # Conversations + classify + reply
│   ├── templates.py             # Template CRUD
│   └── notifications.py         # GET/POST notifications
├── services/
│   ├── ai.py                    # OpenAI wrapper (copy, classify, draft)
│   ├── gig_builder.py           # Orchestrates draft generation
│   ├── keyword_analyzer.py      # Tag scoring + keyword clustering
│   ├── classifier.py            # Intent classification pipeline
│   ├── reply_generator.py       # Reply drafting with context
│   ├── deadline_tracker.py      # 24h countdown logic
│   └── notification_service.py  # Push / email / Telegram
└── workers/
    ├── draft_worker.py          # Process gig generation queue
    ├── classify_worker.py       # Process message classification queue
    └── reminder_worker.py       # Cron: check deadlines + send alerts
```

### Data Flow: Gig Generation

```
User fills service form
       │
       ▼
POST /gigs/draft
       │
       ▼
FastAPI → enqueue job to Redis/BullMQ
       │
       ▼
draft_worker picks up job
       │
       ▼
parallel OpenAI calls:
  ├── title variants    → gpt-4o-mini
  ├── description       → gpt-4o-mini
  ├── tags/keywords     → gpt-4o-mini
  ├── packages          → gpt-4o-mini
  └── faqs              → gpt-4o-mini
       │
       ▼
Store GigDraft + GigKeyword + GigPackage + GigFAQ rows
       │
       ▼
Return gig_id → frontend polls GET /gigs/{id}
```

### Data Flow: Inbox Classification + Reply

```
Buyer messages arrive (webhook / manual sync)
       │
       ▼
POST /conversations/{id}/classify
       │
       ▼
classify_worker:
  ├── Run intent prompt against gpt-4o-mini
  │   "serious | pricing | unclear | low-fit | spam"
  ├── Store intent_label on BuyerMessage
  └── Return classification
       │
       ▼
User opens conversation → POST /messages/{id}/reply-draft
       │
       ▼
reply_generator:
  ├── Fetch last N messages + tone setting + intent
  ├── Build prompt with context
  ├── gpt-4o-mini → ReplyDraft
  └── Store ReplyDraft (approved_by_user = false)
       │
       ▼
User reviews → POST /messages/{id}/approve-reply
       │
       ▼
Copies reply to clipboard / opens Fiverr compose
```

### Data Flow: Deadline Tracking

```
Cron job (every 5 min):
  reminder_worker:
    SELECT conversations
    WHERE status = 'active'
      AND response_deadline_at < NOW() + INTERVAL '2 hours'
      AND last_reminder_sent_at IS NULL
    FOR EACH:
      → Send push / email / Telegram alert
      → Mark last_reminder_sent_at
```

## Database Schema

```sql
-- Users
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE NOT NULL,
    name            TEXT,
    timezone        TEXT DEFAULT 'UTC',
    tone            TEXT DEFAULT 'professional',
    business_hours  JSONB,                     -- {mon: {start: "09:00", end: "17:00"}, ...}
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Fiverr accounts per user
CREATE TABLE fiverr_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    username        TEXT NOT NULL,
    auth_status     TEXT DEFAULT 'pending',    -- pending | connected | expired
    connected_at    TIMESTAMPTZ,
    UNIQUE(user_id, username)
);

-- Gig drafts
CREATE TABLE gig_drafts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    niche           TEXT,
    title           TEXT,
    description     TEXT,
    status          TEXT DEFAULT 'draft',       -- draft | complete | published
    score           INTEGER,                   -- 0-100
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Keywords / tags attached to a gig
CREATE TABLE gig_keywords (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_draft_id    UUID REFERENCES gig_drafts(id) ON DELETE CASCADE,
    keyword         TEXT NOT NULL,
    type            TEXT,                       -- primary | secondary | long-tail
    priority        INTEGER DEFAULT 0
);

-- Package tiers (basic / standard / premium)
CREATE TABLE gig_packages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_draft_id    UUID REFERENCES gig_drafts(id) ON DELETE CASCADE,
    tier            TEXT NOT NULL,              -- basic | standard | premium
    price           NUMERIC(10,2),
    delivery_days   INTEGER,
    features        JSONB                      -- ["feature 1", "feature 2"]
);

-- FAQs
CREATE TABLE gig_faqs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_draft_id    UUID REFERENCES gig_drafts(id) ON DELETE CASCADE,
    question        TEXT NOT NULL,
    answer          TEXT NOT NULL
);

-- Buyer conversations
CREATE TABLE buyer_conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    platform_thread_id TEXT,
    buyer_name      TEXT,
    status          TEXT DEFAULT 'active',      -- active | resolved | expired
    intent_label    TEXT,                       -- serious | pricing | unclear | low-fit | spam
    last_message_at TIMESTAMPTZ,
    response_deadline_at TIMESTAMPTZ,          -- last_message_at + 24h
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Individual messages
CREATE TABLE buyer_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES buyer_conversations(id) ON DELETE CASCADE,
    sender_type     TEXT NOT NULL,              -- buyer | seller
    body            TEXT NOT NULL,
    intent_label    TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Reply drafts
CREATE TABLE reply_drafts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id      UUID REFERENCES buyer_messages(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    confidence      REAL DEFAULT 0.0,
    approved_by_user BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Response events (analytics)
CREATE TABLE response_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES buyer_conversations(id) ON DELETE CASCADE,
    replied_at      TIMESTAMPTZ DEFAULT now(),
    response_time_minutes INTEGER
);

-- Templates
CREATE TABLE templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    type            TEXT NOT NULL,              -- away | pricing | follow-up | custom
    title           TEXT,
    body            TEXT NOT NULL,
    niche           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

## Security & Auth

- **Auth:** Supabase Auth (magic link / Google OAuth) + JWT for backend
- **JWT middleware** on all `/api/*` routes except `/auth/*`
- **Rate limiting:** Redis-based, 100 req/min per user for AI endpoints
- **Audit log:** Every generated draft, classification, and reply is logged with user_id + timestamp
- **No auto-send:** Replies are never posted to Fiverr without manual copy-paste

## Queue Architecture

```
                    ┌──────────────┐
                    │   Redis      │
                    │  (Upstash)   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       draft_queue   classify_queue  cron_queue
              │            │            │
              ▼            ▼            ▼
       draft_worker classify_worker reminder_worker
              │            │            │
              ├─ OpenAI    ├─ OpenAI    └─ SELECT deadlines
              ├─ DB write  ├─ DB write    → Notifications
              └─ WebSocket └─ WebSocket
```

## Notification Channels

| Trigger | Channel | Service |
|---|---|---|
| New buyer message | In-app toast + sidebar badge | Pusher / WebSocket |
| Reply deadline < 2h | Push notification | Browser Push API |
| Reply deadline < 30m | SMS / Telegram | Twilio / Telegram Bot |
| Gig generation complete | In-app toast | WebSocket |
| Daily overdue summary | Email | Resend / SendGrid |

## Monitoring & Observability

- **Logs:** Logtail / Axiom
- **Errors:** Sentry (frontend + backend)
- **Metrics:** PostHog for product analytics; Vercel Analytics for frontend perf
- **AI costs:** Token usage tracked per user per request in audit log
