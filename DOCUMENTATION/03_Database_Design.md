# CM Kerala – Chief Minister's Public Grievance Redressal Portal
## 03. Database Design

---

## 1. Overview

The application uses **SQLite** as its database engine, accessed through **Prisma ORM**. The database file is stored at `prisma/dev.db`. The schema defines **8 entities** that model the full lifecycle of a citizen grievance.

- **ORM**: Prisma 5.x
- **Provider**: SQLite
- **Schema file**: `prisma/schema.prisma`
- **ID strategy**: CUID (Collision-resistant Unique ID via `@default(cuid())`)
- **Timestamps**: `createdAt` / `updatedAt` on all major entities

---

## 2. Entities and Fields

### 2.1 User

Represents all portal users: citizens, CMO administrators, and department officers.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique user identifier |
| `name` | String | Required | Full name of the user |
| `email` | String | Unique, Required | Login email address |
| `mobile` | String | Optional | Mobile phone number |
| `passwordHash` | String | Required | bcryptjs hashed password |
| `role` | String | Default: "CITIZEN" | Role: CITIZEN / ADMIN / OFFICER |
| `departmentId` | String | Optional FK → Department | For OFFICER role: assigned department |
| `createdAt` | DateTime | Auto | Record creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relations:**
- Has many `Grievance` (submitted grievances — citizens only)
- Has many `GrievanceHistory` (actions taken on grievances)
- Has many `Feedback` (feedback given — citizens only)
- Belongs to one `Department` (officers only)

---

### 2.2 Department

Represents a Kerala government department that handles specific types of grievances.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique department identifier |
| `name` | String | Unique, Required | Full department name |
| `description` | String | Required | Brief description of department scope |
| `code` | String | Unique, Required | Short code (e.g., "PWD", "HLTH", "EDU") |
| `createdAt` | DateTime | Auto | Record creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

**Relations:**
- Has many `User` (officers assigned to department)
- Has many `Grievance` (grievances assigned to department)
- Has many `GrievanceAssignment` (assignment records)

**Sample departments (from seed data):**
- Public Works Department (PWD)
- Health & Family Welfare (HLTH)
- Education (EDU)
- Water Resources (WATER)
- Revenue & Land (REV)
- Agriculture (AGRI)
- Electricity (KSEB)
- Transport (TRANS)

---

### 2.3 Grievance

The core entity of the application. Represents a citizen's complaint or request.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique grievance identifier |
| `referenceNumber` | String | Unique, Required | Public tracking number (GRV-YYYYMM-XXXXX) |
| `citizenId` | String | FK → User, Required | The citizen who submitted this |
| `district` | String | Required | Kerala district where issue occurs |
| `category` | String | Required | Category: Road/Water/Health/Land/Education/Other |
| `subject` | String | Required | Brief title of the grievance |
| `description` | String | Required | Detailed description of the issue |
| `priority` | String | Default: "MEDIUM" | LOW / MEDIUM / HIGH |
| `status` | String | Default: "SUBMITTED" | Current status (see workflow) |
| `departmentId` | String | Optional FK → Department | Assigned department (set by CMO) |
| `aiSuggestedDept` | String | Optional | AI-suggested department name |
| `aiSuggestedCategory` | String | Optional | AI-suggested category |
| `aiSuggestedPriority` | String | Optional | AI-suggested priority |
| `aiSummary` | String | Optional | AI-generated summary for CMO |
| `isDuplicate` | Boolean | Default: false | AI-flagged as potential duplicate |
| `adminRemarks` | String | Optional | CMO administrator's remarks |
| `createdAt` | DateTime | Auto | Submission timestamp |
| `updatedAt` | DateTime | Auto | Last modification timestamp |

**Status Workflow:**
```
SUBMITTED → UNDER_REVIEW → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED
```

**Relations:**
- Belongs to one `User` (citizen)
- Belongs to one `Department` (optional — when assigned)
- Has many `GrievanceHistory` (audit trail)
- Has many `GrievanceAssignment` (department assignments)
- Has many `Attachment` (supporting files)
- Has many `Feedback` (citizen ratings)

---

### 2.4 GrievanceHistory

Immutable audit log of every status change or action taken on a grievance.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique history entry ID |
| `grievanceId` | String | FK → Grievance, Required | The grievance this entry relates to |
| `status` | String | Required | The status at time of this entry |
| `remarks` | String | Optional | Notes added by the actor |
| `changedById` | String | FK → User, Required | Who made this change |
| `createdAt` | DateTime | Auto | When this change occurred |

**Note:** This entity is append-only. Records are never updated or deleted, ensuring a complete audit trail.

---

### 2.5 GrievanceAssignment

Records the formal assignment of a grievance to a department, including the officer's response.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique assignment ID |
| `grievanceId` | String | FK → Grievance, Required | The assigned grievance |
| `departmentId` | String | FK → Department, Required | Receiving department |
| `actionReport` | String | Optional | Officer's investigation report / action taken |
| `resolvedAt` | DateTime | Optional | When the department resolved the issue |
| `createdAt` | DateTime | Auto | Assignment creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

---

### 2.6 Attachment

Stores metadata for files attached to a grievance (actual file storage is external/URL-based in prototype).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique attachment ID |
| `grievanceId` | String | FK → Grievance, Required | The parent grievance |
| `filename` | String | Required | Original filename |
| `url` | String | Required | URL/path to the stored file |
| `fileType` | String | Required | MIME type (image/jpeg, application/pdf, etc.) |
| `createdAt` | DateTime | Auto | Upload timestamp |

---

### 2.7 Feedback

Citizen satisfaction rating submitted after a grievance is resolved.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique feedback ID |
| `grievanceId` | String | FK → Grievance, Required | The resolved grievance |
| `citizenId` | String | FK → User, Required | The citizen giving feedback |
| `rating` | Int | Required | 1–5 star rating |
| `comment` | String | Optional | Written feedback comment |
| `createdAt` | DateTime | Auto | Submission timestamp |

---

### 2.8 ContactEnquiry

General enquiries submitted via the public Contact page (not tied to a specific grievance).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique enquiry ID |
| `name` | String | Required | Enquirer's name |
| `email` | String | Required | Enquirer's email address |
| `subject` | String | Required | Subject of the enquiry |
| `message` | String | Required | Full message content |
| `createdAt` | DateTime | Auto | Submission timestamp |

---

## 3. Entity Relationships Summary

```
User (1) ──────────────────── (N) Grievance        [citizen submits]
User (1) ──────────────────── (N) GrievanceHistory  [actor who changed]
User (1) ──────────────────── (N) Feedback          [citizen gives]
User (N) ──────────────────── (1) Department        [officer belongs to]

Department (1) ─────────────── (N) Grievance        [handles]
Department (1) ─────────────── (N) GrievanceAssignment [assigned]

Grievance (1) ──────────────── (N) GrievanceHistory  [has history]
Grievance (1) ──────────────── (N) GrievanceAssignment [assigned to]
Grievance (1) ──────────────── (N) Attachment        [has files]
Grievance (1) ──────────────── (N) Feedback          [receives]
```

---

## 4. ASCII ER Diagram

```
┌──────────────────┐           ┌────────────────────┐
│      User        │           │     Department      │
├──────────────────┤  N:1      ├────────────────────┤
│ id (PK)          ├──────────►│ id (PK)            │
│ name             │           │ name               │
│ email            │           │ description        │
│ mobile           │           │ code               │
│ passwordHash     │           └──────────┬─────────┘
│ role             │                      │ 1
│ departmentId(FK) │                      │
└────────┬─────────┘                      │ N
         │ 1                    ┌──────────▼─────────┐
         │                      │ GrievanceAssignment│
         │ N                    ├────────────────────┤
┌────────▼─────────┐  1:N      │ id (PK)            │
│    Grievance     ├──────────►│ grievanceId (FK)   │
├──────────────────┤           │ departmentId (FK)  │
│ id (PK)          │           │ actionReport       │
│ referenceNumber  │           │ resolvedAt         │
│ citizenId (FK)   │           └────────────────────┘
│ district         │
│ category         │  1:N      ┌────────────────────┐
│ subject          ├──────────►│  GrievanceHistory  │
│ description      │           ├────────────────────┤
│ priority         │           │ id (PK)            │
│ status           │           │ grievanceId (FK)   │
│ departmentId(FK) │           │ status             │
│ aiSuggestedDept  │           │ remarks            │
│ aiSummary        │           │ changedById (FK)   │
│ adminRemarks     │           └────────────────────┘
│ isDuplicate      │
└────────┬─────────┘  1:N      ┌────────────────────┐
         ├──────────────────►  │    Attachment      │
         │                     ├────────────────────┤
         │                     │ id (PK)            │
         │                     │ grievanceId (FK)   │
         │                     │ filename           │
         │                     │ url                │
         │                     │ fileType           │
         │                     └────────────────────┘
         │
         │            1:N      ┌────────────────────┐
         └──────────────────►  │     Feedback       │
                               ├────────────────────┤
                               │ id (PK)            │
                               │ grievanceId (FK)   │
                               │ citizenId (FK)     │
                               │ rating (1-5)       │
                               │ comment            │
                               └────────────────────┘

┌────────────────────┐  (standalone — no FK relations)
│   ContactEnquiry   │
├────────────────────┤
│ id (PK)            │
│ name               │
│ email              │
│ subject            │
│ message            │
└────────────────────┘
```

---

## 5. Sample Seed Data

The `prisma/seed.ts` script populates the database with:

### Departments (8)
Public Works, Health & Family Welfare, Education, Water Resources, Revenue & Land, Agriculture, Electricity Board, Transport

### Users (5+)
| Email | Role | Department |
|-------|------|-----------|
| admin@cmkerala.gov.in | ADMIN | — |
| officer.water@kerala.gov.in | OFFICER | Water Resources |
| officer.roads@kerala.gov.in | OFFICER | Public Works |
| officer.health@kerala.gov.in | OFFICER | Health & Family Welfare |
| arun@test.com | CITIZEN | — |

### Sample Grievances (5+)
Pre-populated grievances in various statuses (SUBMITTED, UNDER_REVIEW, ASSIGNED, IN_PROGRESS, RESOLVED) across different districts and categories to demonstrate the full workflow.

---

## 6. Index Strategy

For production optimization, the following indexes are recommended:

| Table | Index Columns | Reason |
|-------|--------------|--------|
| Grievance | `citizenId` | Citizen dashboard queries |
| Grievance | `status` | Status-based filtering |
| Grievance | `departmentId` | Department filtering |
| Grievance | `referenceNumber` | Public tracking lookup |
| Grievance | `createdAt` | Date range queries |
| GrievanceHistory | `grievanceId` | Timeline queries |
| GrievanceAssignment | `grievanceId` | Assignment lookup |
| User | `email` | Login lookup |

---

*Document version: 1.0 | Date: November 2026 | Project: CM Kerala Grievance Portal Prototype*
