# CM Kerala – Chief Minister's Public Grievance Redressal Portal
## 01. Project Overview

---

## 1. Problem Statement

Citizens of Kerala often face bureaucratic barriers when seeking redressal for civic issues. Traditional complaint mechanisms are opaque, slow, and difficult to track. There is no unified digital channel for citizens to escalate concerns directly to the Chief Minister's Office (CMO), resulting in unresolved grievances and lack of accountability.

**Key pain points:**
- No single window for submitting complaints to the CMO
- Lack of real-time tracking for submitted grievances
- No structured workflow for routing complaints to the correct department
- CMO staff have no dashboard to monitor and act on the volume of complaints
- Department officers have no digital interface to log investigation reports

---

## 2. Objectives

| # | Objective |
|---|-----------|
| 1 | Provide citizens with a **direct digital channel** to submit grievances to the CM's office |
| 2 | Enable **real-time tracking** of grievance status using a unique reference number |
| 3 | Give the **CMO staff** a comprehensive dashboard for oversight, assignment, and analytics |
| 4 | Provide **department officers** a workflow interface for investigation and resolution |
| 5 | Use **AI assistance** (Google Gemini) to auto-categorize and prioritize grievances |
| 6 | Maintain a full **audit trail** of all status changes and actions taken |
| 7 | Collect **citizen feedback** after grievance resolution for quality assurance |

---

## 3. Scope

The portal consists of **four distinct portals/interfaces**:

### 3.1 Public Portal (Unauthenticated)
- Home page with overview of the portal
- About page explaining the initiative
- Departments listing page
- Public grievance tracking (by reference number)
- Contact/Enquiry form
- FAQ page

### 3.2 Citizen Portal (Authenticated – CITIZEN role)
- Citizen registration and login
- Grievance submission form with AI analysis
- Personal grievance dashboard with status tracking
- Feedback submission after resolution

### 3.3 CMO Dashboard (Authenticated – ADMIN role)
- Full grievance management (view, filter, search)
- Assign grievances to departments
- Update grievance status and add remarks
- Review AI-generated analysis and suggestions
- Analytics charts (status distribution, district-wise, category-wise, trend)
- Contact enquiry management

### 3.4 Department Officer Dashboard (Authenticated – OFFICER role)
- View grievances assigned to own department
- Add investigation remarks and action reports
- Upload supporting documents
- Mark grievances as resolved

---

## 4. Features List (19+ Features)

| # | Feature | Portal | Description |
|---|---------|--------|-------------|
| 1 | **Citizen Registration** | Public | Self-registration with name, email, mobile, password |
| 2 | **JWT Authentication** | All | Secure login with NextAuth.js JWT strategy |
| 3 | **Role-Based Access Control** | All | CITIZEN / ADMIN / OFFICER roles with protected routes |
| 4 | **Grievance Submission** | Citizen | Multi-field form with district, category, subject, description, priority |
| 5 | **Unique Reference Number** | Citizen | Auto-generated format: GRV-YYYYMM-XXXXX for tracking |
| 6 | **AI Grievance Analysis** | Citizen | Google Gemini API (with mock fallback) suggests dept, category, priority |
| 7 | **AI Summary Generation** | Citizen | Auto-generates summary for CMO review |
| 8 | **Duplicate Detection** | Citizen | AI flags potentially duplicate complaints |
| 9 | **Public Grievance Tracking** | Public | Track any grievance by reference number without login |
| 10 | **Status History Audit Trail** | All | Full chronological log of all status changes with actor and remarks |
| 11 | **CMO Grievance Dashboard** | CMO | Paginated, filterable list of all grievances with multi-filter support |
| 12 | **Department Assignment** | CMO | CMO admin assigns grievances to specific government departments |
| 13 | **Status Management** | CMO/Officer | 6-stage status workflow: SUBMITTED → UNDER_REVIEW → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED |
| 14 | **CMO Analytics Charts** | CMO | Recharts-powered visualizations: status pie, district bar, category bar, weekly trend line |
| 15 | **Officer Dashboard** | Officer | Department-scoped view of assigned grievances |
| 16 | **Action Report Upload** | Officer | Officers submit investigation reports and action taken |
| 17 | **Citizen Feedback System** | Citizen | 1-5 star rating + comment after resolution |
| 18 | **Contact Enquiry** | Public | General contact form stored in DB for CMO review |
| 19 | **Department Listing** | Public | Browse all government departments linked to the portal |
| 20 | **Attachment Support** | Citizen | File metadata attached to grievances |
| 21 | **Mock AI Fallback** | System | Rule-based keyword matching when no Gemini API key |
| 22 | **Prisma Seed Data** | Dev | Pre-populated departments, admin, officers, and sample grievances |

---

## 5. Technology Decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | Next.js 14 App Router | Full-stack React with server components and API routes |
| Language | TypeScript | Type safety across frontend and backend |
| Styling | Tailwind CSS | Rapid, consistent utility-first styling |
| Auth | NextAuth.js (JWT) | Lightweight, well-integrated with Next.js |
| ORM | Prisma | Type-safe DB access, easy migrations |
| Database | SQLite | Zero-config, file-based, perfect for prototype |
| AI | Google Gemini 1.5 Flash | State-of-the-art, free-tier API for AI features |
| Charts | Recharts | React-native charting library |
| Deployment | Railway | Simple PaaS deployment with Nixpacks |

---

## 6. Non-Goals (Out of Scope for Prototype)

- Real Kerala Government integration or official data
- SMS/Email notification system
- Payment gateway
- Multi-language support (Malayalam)
- Mobile app (iOS/Android)
- Production-grade file storage (S3/GCS)
- Formal grievance redressal legal compliance

---

*Document version: 1.0 | Date: November 2026 | Project: CM Kerala Grievance Portal Prototype*
