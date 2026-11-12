# CM Kerala – Chief Minister's Public Grievance Redressal Portal

> ⚠️ **DISCLAIMER**: This is a recruitment prototype application developed for the WhiteMatrix Software Solutions technical evaluation. It is NOT affiliated with, authorized, or endorsed by the Government of Kerala or the Chief Minister's Office.

## 🌐 Live Demo
[Deployment link will be added after Railway deployment]

## 📋 Overview
A full-stack web application enabling citizens to submit grievances directly to Kerala's Chief Minister's Office, track progress, and receive updates. Includes CMO dashboard for oversight and department officer workflow for investigation and resolution.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js (JWT)
- **Database**: SQLite via Prisma ORM
- **AI**: Google Gemini API (with mock fallback)
- **Deployment**: Railway

## 🚀 Quick Start
```bash
git clone <repo-url>
cd CM_project
pnpm install
cp .env.example .env
# Edit .env with your values
pnpm exec prisma generate
pnpm exec prisma db push
pnpm exec prisma db seed
pnpm run dev
```

## 👥 Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| CMO Admin | admin@cmkerala.gov.in | Admin@123 |
| Water Dept Officer | officer.water@kerala.gov.in | Officer@123 |
| Roads Dept Officer | officer.roads@kerala.gov.in | Officer@123 |
| Health Dept Officer | officer.health@kerala.gov.in | Officer@123 |
| Citizen | arun@test.com | Citizen@123 |

## 📂 Project Structure
```
CM_project/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # Backend API endpoints
│   ├── citizen/           # Citizen portal pages
│   ├── cmo/               # CMO dashboard pages
│   ├── officer/           # Officer dashboard pages
│   └── ...                # Public pages
├── components/            # Reusable React components
├── lib/                   # Utilities, Prisma client
├── prisma/                # Schema, migrations, seed
│   └── schema.prisma
├── DOCUMENTATION/         # Project documentation
└── public/               # Static assets
```

## 📊 Features
- ✅ Public portal (Home, About, Departments, Contact, FAQ)
- ✅ Citizen registration, login, grievance submission & tracking
- ✅ Unique reference number generation
- ✅ AI-powered grievance analysis (dept, category, priority suggestion)
- ✅ CMO dashboard with analytics charts
- ✅ Department officer workflow
- ✅ Full status history tracking
- ✅ Feedback system

## 🤖 AI Integration
The AI Grievance Assistant uses Google Gemini API (with keyword-based mock fallback) to:
- Suggest relevant government department
- Classify grievance category
- Recommend priority level (Low/Medium/High)
- Generate summary for CMO review
- Flag potential duplicate complaints

## 📄 Documentation
See the [DOCUMENTATION](./DOCUMENTATION/) folder for complete technical documentation.

## 🛠️ Tools Used
- Next.js, React, TypeScript, Tailwind CSS
- Prisma ORM, SQLite
- NextAuth.js
- Google Gemini API
- Recharts
- Lucide React icons
- AI coding assistant (Antigravity/Claude)
