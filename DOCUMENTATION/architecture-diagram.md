# System Architecture Diagram
## CM Kerala – Chief Minister's Public Grievance Redressal Portal

---

## Full System Architecture (ASCII)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                           USERS / BROWSERS                                   ║
║                                                                              ║
║  ┌─────────────┐    ┌─────────────────┐    ┌────────────────────────────┐   ║
║  │   CITIZEN   │    │  CMO ADMIN      │    │  DEPARTMENT OFFICER        │   ║
║  │ (Public)    │    │ (admin@...)     │    │ (officer.water@...)        │   ║
║  └──────┬──────┘    └────────┬────────┘    └─────────────┬──────────────┘   ║
╚═════════╪═══════════════════╪═════════════════════════════╪═══════════════════╝
          │  HTTPS             │  HTTPS                      │  HTTPS
          └───────────────────┼─────────────────────────────┘
                              │
╔═════════════════════════════▼══════════════════════════════════════════════════╗
║                     NEXT.JS 14 APP ROUTER                                      ║
║                      (Railway Service)                                         ║
║                                                                                ║
║  ┌────────────────────────────────────────────────────────────────────────┐   ║
║  │                        PAGE ROUTES (RSC)                                │   ║
║  │                                                                         │   ║
║  │  PUBLIC            CITIZEN              CMO               OFFICER       │   ║
║  │  /                 /citizen/            /cmo/             /officer/     │   ║
║  │  /about            dashboard            dashboard         dashboard     │   ║
║  │  /track            /citizen/            /cmo/                           │   ║
║  │  /departments      submit               analytics                       │   ║
║  │  /contact                                                               │   ║
║  │  /faq                                                                   │   ║
║  │  /login                                                                 │   ║
║  │  /register                                                              │   ║
║  └────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                ║
║  ┌────────────────────────────────────────────────────────────────────────┐   ║
║  │                       API ROUTES (Route Handlers)                       │   ║
║  │                                                                         │   ║
║  │  POST /api/register          GET/POST /api/grievances                   │   ║
║  │  /api/auth/[...nextauth]     GET/PATCH /api/grievances/[id]            │   ║
║  │  GET /api/departments        GET /api/stats                             │   ║
║  │  POST /api/contact           POST /api/feedback                         │   ║
║  │  POST /api/ai/analyze                                                   │   ║
║  └───────────────────────┬───────────────────────────────┬────────────────┘   ║
║                          │                               │                     ║
║  ┌───────────────────────▼──────┐    ┌──────────────────▼─────────────────┐  ║
║  │   NextAuth.js (JWT)          │    │        Prisma ORM Client            │  ║
║  │                              │    │        (lib/prisma.ts)              │  ║
║  │  CredentialsProvider         │    │                                     │  ║
║  │  bcryptjs password verify    │    │  Type-safe DB queries               │  ║
║  │  JWT cookie generation       │    │  Auto-generated TS types            │  ║
║  │  Session validation          │    │  Connection pooling                 │  ║
║  └──────────────────────────────┘    └────────────────────┬────────────────┘  ║
╚══════════════════════════════════════════════════════════════╪═════════════════╝
                                                              │
                                                              │  File I/O
╔═════════════════════════════════════════════════════════════▼═════════════════╗
║                           SQLite DATABASE                                       ║
║                         (prisma/dev.db)                                         ║
║                                                                                 ║
║  ┌──────────┐  ┌────────────┐  ┌──────────────────┐  ┌───────────────────┐   ║
║  │  User    │  │ Department │  │    Grievance      │  │ GrievanceHistory  │   ║
║  └──────────┘  └────────────┘  └──────────────────┘  └───────────────────┘   ║
║                                                                                 ║
║  ┌──────────────────────┐  ┌────────────┐  ┌──────────┐  ┌───────────────┐   ║
║  │ GrievanceAssignment  │  │ Attachment │  │ Feedback │  │ ContactEnquiry│   ║
║  └──────────────────────┘  └────────────┘  └──────────┘  └───────────────┘   ║
╚═════════════════════════════════════════════════════════════════════════════════╝

                                                   ┌─────────────────────────┐
                                                   │   GOOGLE GEMINI API     │
        POST /api/ai/analyze ─────────────────────►│   (External Service)    │
                                                   │                         │
        GEMINI_API_KEY present?                    │  gemini-1.5-flash       │
                YES → Gemini call                  │  generativelanguage     │
                NO  → Mock AI (lib/mockAI.ts)      │  .googleapis.com        │
                                                   └─────────────────────────┘
```

---

## Request-Response Flow

```
Browser                Next.js           Prisma          SQLite
  │                       │                 │               │
  │── GET /cmo/dashboard ►│                 │               │
  │                       │─ getServerSession()             │
  │                       │  (verify JWT cookie)            │
  │                       │                 │               │
  │                       │─ findMany({     │               │
  │                       │   where:...,    │               │
  │                       │   include:...   │               │
  │                       │  }) ───────────►│               │
  │                       │                 │── SELECT ────►│
  │                       │                 │◄── rows ──────│
  │                       │◄── grievances ──│               │
  │                       │                 │               │
  │◄── HTML (RSC) ────────│                 │               │
  │                       │                 │               │
  │                                                         │
  │── PATCH /api/grievances/[id] (assign dept) ────────────►│
  │   body: { status, departmentId, remarks }               │
  │                       │─ verify ADMIN role              │
  │                       │─ update(grievance) ────────────►│
  │                       │─ create(historyEntry) ─────────►│
  │◄── 200 { id, status } │                 │               │
```

---

## Authentication Flow

```
Citizen / Admin / Officer
        │
        │  POST /api/auth/callback/credentials
        │  { email, password }
        │
        ▼
   NextAuth.js CredentialsProvider
        │
        ├─► prisma.user.findUnique({ where: { email } })
        ├─► bcrypt.compare(password, user.passwordHash)
        │
        │  Match? YES
        │
        └─► Return { id, name, email, role, departmentId }
                │
                ▼
           JWT Token created
           (signed with NEXTAUTH_SECRET)
                │
                ▼
           HttpOnly Cookie set
           (session cookie in browser)
                │
                ▼
         User redirected to
         role-appropriate dashboard
         /citizen/dashboard (CITIZEN)
         /cmo/dashboard     (ADMIN)
         /officer/dashboard (OFFICER)
```

---

## Deployment Architecture (Railway)

```
Developer's Machine
        │
        │  git push origin main
        ▼
   GitHub Repository
        │
        │  Webhook trigger
        ▼
   Railway CI/CD Pipeline
        │
        ├─► Nixpacks detects: Node.js + pnpm
        │
        ├─► BUILD PHASE:
        │     pnpm install
        │     pnpm exec prisma generate
        │     pnpm exec prisma db push
        │     pnpm exec prisma db seed
        │     pnpm run build (next build)
        │
        ├─► DEPLOY PHASE:
        │     pnpm start (next start -p $PORT)
        │
        ▼
   Railway Service
        ├── URL: https://<app>.railway.app
        ├── Health check: GET / → 200
        ├── Restart on failure (max 10 retries)
        └── Env vars: DATABASE_URL, NEXTAUTH_SECRET,
                      NEXTAUTH_URL, GEMINI_API_KEY
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────┐
│              Grievance Submission Flow               │
│                                                     │
│  GrievanceForm.tsx (Client Component)               │
│       │                                             │
│       ├─► User fills Subject + Description          │
│       │                                             │
│       ├─► "Analyze with AI" button                  │
│       │       └─► POST /api/ai/analyze              │
│       │               └─► AIAnalysisPanel.tsx       │
│       │                   (shows suggestions)       │
│       │                                             │
│       └─► "Submit Grievance" button                 │
│               └─► POST /api/grievances              │
│                       └─► GrievanceHistory created  │
│                       └─► referenceNumber returned  │
│                       └─► Success toast shown       │
└─────────────────────────────────────────────────────┘
```
