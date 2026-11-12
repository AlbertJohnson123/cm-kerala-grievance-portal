# CM Kerala – Chief Minister's Public Grievance Redressal Portal
## 02. System Architecture

---

## 1. Architecture Overview

The application follows a **monolithic full-stack architecture** using Next.js 14 App Router as both the frontend renderer and the backend API layer. All components are deployed as a single Railway service.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                              │
│   React Server Components + Client Components + Tailwind CSS         │
└──────────────────────────┬──────────────────────────────────────────┘
                           │  HTTP / HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 APP ROUTER                             │
│                   (Railway – Single Service)                         │
│                                                                      │
│  ┌─────────────────────────┐    ┌──────────────────────────────┐    │
│  │   Page Routes (RSC)     │    │      API Routes              │    │
│  │  /                      │    │  /api/register               │    │
│  │  /about                 │    │  /api/auth/[...nextauth]     │    │
│  │  /track                 │    │  /api/grievances             │    │
│  │  /citizen/*             │    │  /api/grievances/[id]        │    │
│  │  /cmo/*                 │    │  /api/departments            │    │
│  │  /officer/*             │    │  /api/stats                  │    │
│  │  /departments           │    │  /api/contact                │    │
│  │  /contact               │    │  /api/feedback               │    │
│  │  /faq                   │    │  /api/ai/analyze             │    │
│  └─────────────────────────┘    └──────────────────────────────┘    │
│                                           │                          │
│  ┌─────────────────────────┐    ┌─────────▼────────────────────┐    │
│  │   NextAuth.js (JWT)     │    │      Prisma ORM Client       │    │
│  │   Session Management    │    │      lib/prisma.ts           │    │
│  └─────────────────────────┘    └─────────┬────────────────────┘    │
└────────────────────────────────────────────┼────────────────────────┘
                                             │
                           ┌─────────────────▼──────────────────┐
                           │         SQLite Database             │
                           │      prisma/dev.db (file)          │
                           │                                     │
                           │  Tables: User, Department,          │
                           │  Grievance, GrievanceHistory,       │
                           │  GrievanceAssignment, Attachment,   │
                           │  Feedback, ContactEnquiry           │
                           └─────────────────────────────────────┘

                           ┌─────────────────────────────────────┐
                           │    External: Google Gemini API       │
                           │  generativelanguage.googleapis.com   │
                           │  Model: gemini-1.5-flash             │
                           │  (Optional – mock fallback if no key)│
                           └─────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Next.js 14 App Router

The application uses the **App Router** pattern introduced in Next.js 13+ and stabilized in Next.js 14.

```
app/
├── layout.tsx                  # Root layout (providers, global styles)
├── page.tsx                    # Home page (RSC)
├── about/page.tsx              # About page
├── departments/page.tsx        # Department listing
├── contact/page.tsx            # Contact form
├── faq/page.tsx                # FAQ page
├── track/page.tsx              # Public grievance tracking
├── login/page.tsx              # Login page
├── register/page.tsx           # Citizen registration
│
├── citizen/                    # Protected: CITIZEN role
│   ├── layout.tsx              # Citizen layout with nav
│   ├── dashboard/page.tsx      # Citizen grievance list
│   └── submit/page.tsx         # Grievance submission + AI
│
├── cmo/                        # Protected: ADMIN role
│   ├── layout.tsx              # CMO layout
│   ├── dashboard/page.tsx      # CMO grievance management
│   └── analytics/page.tsx      # Analytics charts
│
├── officer/                    # Protected: OFFICER role
│   ├── layout.tsx              # Officer layout
│   └── dashboard/page.tsx      # Assigned grievances
│
└── api/                        # API routes (Next.js Route Handlers)
    ├── register/route.ts
    ├── auth/[...nextauth]/route.ts
    ├── grievances/
    │   ├── route.ts            # GET list / POST create
    │   └── [id]/route.ts       # GET detail / PATCH update
    ├── departments/route.ts
    ├── stats/route.ts
    ├── contact/route.ts
    ├── feedback/route.ts
    └── ai/analyze/route.ts
```

### 2.2 React Component Architecture

```
components/
├── ui/                         # Base UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   └── Input.tsx
│
├── layout/                     # Layout components
│   ├── Navbar.tsx              # Public navigation
│   ├── Footer.tsx
│   ├── CMONav.tsx              # CMO sidebar navigation
│   ├── CitizenNav.tsx
│   └── OfficerNav.tsx
│
├── grievance/                  # Grievance-specific components
│   ├── GrievanceForm.tsx       # Submission form with AI
│   ├── GrievanceList.tsx       # Filterable table
│   ├── GrievanceDetail.tsx     # Full detail view
│   ├── StatusBadge.tsx
│   └── StatusTimeline.tsx      # History visualization
│
├── charts/                     # Analytics components
│   ├── StatusPieChart.tsx
│   ├── DistrictBarChart.tsx
│   ├── CategoryBarChart.tsx
│   └── TrendLineChart.tsx
│
└── ai/                         # AI components
    └── AIAnalysisPanel.tsx     # Shows AI suggestions
```

### 2.3 Rendering Strategy

| Page Type | Strategy | Why |
|-----------|----------|-----|
| Public pages (/, /about, etc.) | React Server Component | SEO, no interactivity needed |
| Dashboard pages | RSC with Client Islands | Server data fetch + client interactivity |
| Forms (submit, login, register) | Client Component | Needs browser events |
| API routes | Node.js handlers | Server-side only |

---

## 3. Backend Architecture

### 3.1 API Routes (Next.js Route Handlers)

All API routes live under `app/api/` and run as serverless Node.js functions on Railway.

**Authentication flow:**
```
Client → POST /api/auth/[...nextauth] → NextAuth.js
       ← JWT token (httpOnly cookie)
Client → GET /api/grievances (with cookie) → getServerSession()
       → Validates JWT → Returns data
```

**Request lifecycle:**
```
HTTP Request
    │
    ▼
Next.js Route Handler (app/api/*/route.ts)
    │
    ├─► getServerSession() — verify JWT, get user role
    │
    ├─► Validate request body / query params
    │
    ├─► Prisma ORM query
    │       └─► SQLite file (prisma/dev.db)
    │
    └─► JSON Response
```

### 3.2 Authentication (NextAuth.js)

- **Strategy**: JWT (stateless — no DB session table)
- **Provider**: Credentials (email + password)
- **Password hashing**: bcryptjs (10 rounds)
- **Session data**: `{ id, name, email, role, departmentId }`
- **Route protection**: Middleware checks session role against allowed roles

### 3.3 Middleware

```typescript
// middleware.ts — Route protection matrix
/citizen/*  → requires role: CITIZEN
/cmo/*      → requires role: ADMIN
/officer/*  → requires role: OFFICER
/api/grievances (POST) → requires auth
/api/grievances/[id] (PATCH) → requires ADMIN or OFFICER
/api/stats  → requires ADMIN
```

---

## 4. Database Architecture

### 4.1 Prisma ORM

- **Provider**: SQLite (`file:./dev.db`)
- **Client**: Singleton pattern in `lib/prisma.ts` to avoid connection exhaustion in development
- **Migrations**: Managed via `prisma db push` (prototype) / `prisma migrate` (production)

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 4.2 SQLite Considerations

| Concern | Behavior |
|---------|----------|
| Concurrency | SQLite supports one write at a time (WAL mode available) |
| File location | `prisma/dev.db` — ephemeral on Railway unless volume mounted |
| Production note | For production, migrate to PostgreSQL; Railway offers managed Postgres |
| Prototype use | Perfectly suitable for demo/prototype with low concurrent load |

---

## 5. AI Integration Architecture

```
Citizen submits grievance subject + description
    │
    ▼
POST /api/ai/analyze
    │
    ├─► GEMINI_API_KEY present?
    │       │
    │      YES → @google/generative-ai SDK
    │       │       └─► gemini-1.5-flash model
    │       │           └─► Structured prompt
    │       │               └─► JSON response
    │       │
    │      NO  → Mock AI Engine (lib/mockAI.ts)
    │               └─► Keyword matching rules
    │               └─► Rule-based priority scoring
    │
    ▼
Response: {
  suggestedDept: string,
  suggestedCategory: string,
  suggestedPriority: "LOW"|"MEDIUM"|"HIGH",
  summary: string,
  isDuplicate: boolean
}
    │
    ▼
Displayed as suggestions to citizen
(all advisory — citizen can override)
```

---

## 6. Deployment Architecture (Railway)

```
GitHub Repository
    │
    ▼ (push to main)
Railway CI/CD
    │
    ├─► Nixpacks build detection (Node.js / pnpm)
    ├─► pnpm install
    ├─► pnpm exec prisma generate
    ├─► pnpm exec prisma db push
    ├─► pnpm exec prisma db seed
    └─► pnpm run build (next build)
    │
    ▼
Railway Service
    ├─► Start: pnpm start (next start)
    ├─► Port: 3000 (auto-detected)
    ├─► Health check: GET /
    └─► Environment Variables:
            DATABASE_URL=file:./prisma/dev.db
            NEXTAUTH_SECRET=<secret>
            NEXTAUTH_URL=https://<app>.railway.app
            GEMINI_API_KEY=<optional>
```

---

## 7. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Password storage | bcryptjs hash (never stored plain) |
| Session tokens | HttpOnly JWT cookie via NextAuth.js |
| SQL injection | Prisma parameterized queries (ORM protection) |
| CSRF | NextAuth.js built-in CSRF protection |
| XSS | React escapes output by default |
| Role escalation | Server-side session role check on every protected route |
| API abuse | Rate limiting not implemented (prototype scope) |

---

*Document version: 1.0 | Date: November 2026 | Project: CM Kerala Grievance Portal Prototype*
