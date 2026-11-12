# CM Kerala – Chief Minister's Public Grievance Redressal Portal
## 04. API Documentation

---

## Overview

All API endpoints are implemented as **Next.js Route Handlers** under `app/api/`. They return JSON responses and use standard HTTP status codes.

**Base URL (Development):** `http://localhost:3000`  
**Base URL (Production):** `https://<app>.railway.app`

**Authentication:** Most write endpoints and sensitive reads require a valid NextAuth.js session (JWT cookie). The `Authorization` header is not used; authentication is cookie-based.

**Common Response Format:**
```json
// Success
{ "data": {...} }  // or array

// Error
{ "error": "Error message describing what went wrong" }
```

---

## 1. POST `/api/register`

Register a new citizen account.

**Auth Required:** No (public endpoint)

### Request Body
```json
{
  "name": "Arun Kumar",
  "email": "arun@test.com",
  "mobile": "9876543210",
  "password": "Citizen@123"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `name` | string | ✅ | Non-empty |
| `email` | string | ✅ | Valid email format, must be unique |
| `mobile` | string | ❌ | Optional 10-digit mobile |
| `password` | string | ✅ | Min 6 characters |

### Response – 201 Created
```json
{
  "id": "clxyz123abc",
  "name": "Arun Kumar",
  "email": "arun@test.com",
  "role": "CITIZEN"
}
```

### Error Responses
| Status | Condition |
|--------|-----------|
| 400 | Missing required fields |
| 409 | Email already registered |
| 500 | Server error |

---

## 2. POST `/api/auth/[...nextauth]`

NextAuth.js authentication handler. Handles login, session, signout, and CSRF operations.

**Auth Required:** No (this IS the auth endpoint)

### Login Request (Credentials Provider)
**POST** `/api/auth/callback/credentials`

```json
{
  "email": "admin@cmkerala.gov.in",
  "password": "Admin@123",
  "csrfToken": "<from /api/auth/csrf>"
}
```

### Session Response
**GET** `/api/auth/session`
```json
{
  "user": {
    "id": "clxyz789",
    "name": "CMO Administrator",
    "email": "admin@cmkerala.gov.in",
    "role": "ADMIN",
    "departmentId": null
  },
  "expires": "2026-12-12T08:00:00.000Z"
}
```

### Key NextAuth Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/session` | Get current session |
| GET | `/api/auth/csrf` | Get CSRF token |
| POST | `/api/auth/callback/credentials` | Login |
| POST | `/api/auth/signout` | Logout |

---

## 3. GET `/api/grievances`

List grievances with optional filters. Results are scoped by user role.

**Auth Required:** Yes

**Role Behavior:**
- `CITIZEN`: Returns only their own grievances
- `ADMIN`: Returns all grievances
- `OFFICER`: Returns grievances assigned to their department

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `ref` | string | Filter by reference number (partial match) |
| `status` | string | Filter by status (SUBMITTED/UNDER_REVIEW/ASSIGNED/IN_PROGRESS/RESOLVED/CLOSED) |
| `district` | string | Filter by Kerala district |
| `category` | string | Filter by category |
| `priority` | string | Filter by priority (LOW/MEDIUM/HIGH) |
| `citizenId` | string | Filter by citizen ID (ADMIN only) |
| `departmentId` | string | Filter by assigned department ID |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |

### Example Request
```
GET /api/grievances?status=SUBMITTED&district=Thiruvananthapuram&page=1&limit=10
```

### Response – 200 OK
```json
{
  "data": [
    {
      "id": "clgrv001",
      "referenceNumber": "GRV-202611-00001",
      "citizen": { "name": "Arun Kumar", "email": "arun@test.com" },
      "district": "Thiruvananthapuram",
      "category": "Road",
      "subject": "Pothole on NH 66 near Vattiyoorkavu",
      "priority": "HIGH",
      "status": "SUBMITTED",
      "department": null,
      "aiSuggestedDept": "Public Works Department",
      "isDuplicate": false,
      "createdAt": "2026-11-10T09:30:00.000Z"
    }
  ],
  "total": 142,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

---

## 4. POST `/api/grievances`

Submit a new grievance.

**Auth Required:** Yes (`CITIZEN` role)

### Request Body
```json
{
  "district": "Ernakulam",
  "category": "Water",
  "subject": "No water supply for 3 days in Kakkanad",
  "description": "The water supply to our ward has been completely cut off for 3 days. No prior notice was given. We have 200 families affected in this area.",
  "priority": "HIGH",
  "aiSuggestedDept": "Water Resources Department",
  "aiSuggestedCategory": "Water Supply",
  "aiSuggestedPriority": "HIGH",
  "aiSummary": "Citizen reports 3-day water supply disruption affecting 200 families in Kakkanad, Ernakulam with no prior notification.",
  "isDuplicate": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `district` | string | ✅ | Kerala district |
| `category` | string | ✅ | Grievance category |
| `subject` | string | ✅ | Brief title (max 200 chars) |
| `description` | string | ✅ | Detailed description |
| `priority` | string | ❌ | LOW/MEDIUM/HIGH (default: MEDIUM) |
| `aiSuggestedDept` | string | ❌ | From AI analysis |
| `aiSuggestedCategory` | string | ❌ | From AI analysis |
| `aiSuggestedPriority` | string | ❌ | From AI analysis |
| `aiSummary` | string | ❌ | AI-generated summary |
| `isDuplicate` | boolean | ❌ | AI duplicate flag |

### Response – 201 Created
```json
{
  "id": "clgrv002",
  "referenceNumber": "GRV-202611-00002",
  "status": "SUBMITTED",
  "createdAt": "2026-11-12T14:00:00.000Z"
}
```

### Side Effects
- Creates initial `GrievanceHistory` entry with status `SUBMITTED`
- Sends reference number to citizen for tracking

---

## 5. GET `/api/grievances/[id]`

Get full detail of a single grievance including history, assignments, and attachments.

**Auth Required:** Yes  
**Access control:** Citizen can only view own grievances; ADMIN/OFFICER can view any.

### Path Parameters
| Parameter | Description |
|-----------|-------------|
| `id` | Grievance CUID |

### Response – 200 OK
```json
{
  "id": "clgrv001",
  "referenceNumber": "GRV-202611-00001",
  "citizen": {
    "id": "cluser001",
    "name": "Arun Kumar",
    "email": "arun@test.com",
    "mobile": "9876543210"
  },
  "district": "Thiruvananthapuram",
  "category": "Road",
  "subject": "Pothole on NH 66 near Vattiyoorkavu",
  "description": "Large pothole on the main highway causing accidents...",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "department": {
    "id": "cldept001",
    "name": "Public Works Department",
    "code": "PWD"
  },
  "aiSuggestedDept": "Public Works Department",
  "aiSuggestedCategory": "Road Maintenance",
  "aiSuggestedPriority": "HIGH",
  "aiSummary": "Citizen reports dangerous pothole on NH 66...",
  "isDuplicate": false,
  "adminRemarks": "Assigned to PWD for immediate repair.",
  "attachments": [],
  "history": [
    {
      "id": "clhist001",
      "status": "SUBMITTED",
      "remarks": "Grievance submitted by citizen",
      "changedBy": { "name": "Arun Kumar", "role": "CITIZEN" },
      "createdAt": "2026-11-10T09:30:00.000Z"
    },
    {
      "id": "clhist002",
      "status": "ASSIGNED",
      "remarks": "Assigned to PWD for action.",
      "changedBy": { "name": "CMO Administrator", "role": "ADMIN" },
      "createdAt": "2026-11-11T10:00:00.000Z"
    }
  ],
  "assignments": [
    {
      "department": { "name": "Public Works Department" },
      "actionReport": "Site inspection conducted. Repair scheduled.",
      "resolvedAt": null,
      "createdAt": "2026-11-11T10:00:00.000Z"
    }
  ],
  "feedback": [],
  "createdAt": "2026-11-10T09:30:00.000Z",
  "updatedAt": "2026-11-11T10:00:00.000Z"
}
```

---

## 6. PATCH `/api/grievances/[id]`

Update a grievance — change status, assign department, add remarks, or submit action report.

**Auth Required:** Yes  
**Allowed Roles:** ADMIN (full update), OFFICER (action report + status within their dept)

### Path Parameters
| Parameter | Description |
|-----------|-------------|
| `id` | Grievance CUID |

### Request Body (ADMIN — assign and update status)
```json
{
  "status": "ASSIGNED",
  "departmentId": "cldept001",
  "adminRemarks": "Forwarded to PWD for immediate road repair.",
  "remarks": "Assigned to Public Works Department"
}
```

### Request Body (OFFICER — submit action report)
```json
{
  "status": "RESOLVED",
  "actionReport": "Site visited on Nov 12. Pothole repaired with bituminous mix. Work completed.",
  "remarks": "Road repair completed successfully."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | ❌ | New status value |
| `departmentId` | string | ❌ | Department to assign (ADMIN only) |
| `adminRemarks` | string | ❌ | CMO remarks (ADMIN only) |
| `actionReport` | string | ❌ | Officer's action report (OFFICER only) |
| `remarks` | string | ❌ | History entry remarks |

### Response – 200 OK
```json
{
  "id": "clgrv001",
  "status": "ASSIGNED",
  "departmentId": "cldept001",
  "updatedAt": "2026-11-12T14:30:00.000Z"
}
```

### Side Effects
- Appends a new `GrievanceHistory` record
- If `departmentId` changes, creates/updates `GrievanceAssignment`
- If `status` is `RESOLVED`, sets `resolvedAt` on assignment

---

## 7. GET `/api/departments`

List all government departments.

**Auth Required:** No (public endpoint)

### Response – 200 OK
```json
[
  {
    "id": "cldept001",
    "name": "Public Works Department",
    "description": "Responsible for roads, bridges, and public infrastructure",
    "code": "PWD"
  },
  {
    "id": "cldept002",
    "name": "Health & Family Welfare",
    "description": "Manages hospitals, clinics, and public health programs",
    "code": "HLTH"
  }
]
```

---

## 8. GET `/api/stats`

Get aggregated statistics for the CMO analytics dashboard.

**Auth Required:** Yes (`ADMIN` role only)

### Response – 200 OK
```json
{
  "overview": {
    "total": 142,
    "submitted": 23,
    "underReview": 15,
    "assigned": 31,
    "inProgress": 28,
    "resolved": 38,
    "closed": 7
  },
  "byDistrict": [
    { "district": "Thiruvananthapuram", "count": 24 },
    { "district": "Ernakulam", "count": 19 },
    { "district": "Kozhikode", "count": 17 }
  ],
  "byCategory": [
    { "category": "Road", "count": 42 },
    { "category": "Water", "count": 31 },
    { "category": "Health", "count": 22 }
  ],
  "byDepartment": [
    { "department": "Public Works Department", "count": 42 },
    { "department": "Water Resources", "count": 31 }
  ],
  "weeklyTrend": [
    { "week": "2026-W44", "count": 18 },
    { "week": "2026-W45", "count": 24 },
    { "week": "2026-W46", "count": 31 }
  ]
}
```

---

## 9. POST `/api/contact`

Submit a general contact enquiry (from the public Contact page).

**Auth Required:** No (public endpoint)

### Request Body
```json
{
  "name": "Priya Nair",
  "email": "priya@gmail.com",
  "subject": "Question about grievance tracking",
  "message": "I submitted a grievance last week but have not received any update. Reference: GRV-202611-00015"
}
```

| Field | Type | Required |
|-------|------|----------|
| `name` | string | ✅ |
| `email` | string | ✅ |
| `subject` | string | ✅ |
| `message` | string | ✅ |

### Response – 201 Created
```json
{
  "id": "clcont001",
  "message": "Your enquiry has been submitted. We will respond within 2 working days."
}
```

---

## 10. POST `/api/feedback`

Submit citizen feedback after a grievance is resolved.

**Auth Required:** Yes (`CITIZEN` role)

### Request Body
```json
{
  "grievanceId": "clgrv001",
  "rating": 4,
  "comment": "Issue was resolved promptly. Officer was professional."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `grievanceId` | string | ✅ | Must be a resolved grievance owned by the citizen |
| `rating` | number | ✅ | Integer 1–5 |
| `comment` | string | ❌ | Optional text feedback |

### Response – 201 Created
```json
{
  "id": "clfb001",
  "rating": 4,
  "createdAt": "2026-11-12T15:00:00.000Z"
}
```

### Error Responses
| Status | Condition |
|--------|-----------|
| 400 | Grievance not yet resolved |
| 403 | Citizen doesn't own this grievance |
| 409 | Feedback already submitted for this grievance |

---

## 11. POST `/api/ai/analyze`

Analyze a grievance subject and description using AI to suggest department, category, priority, and generate a summary.

**Auth Required:** Yes (any authenticated user)

### Request Body
```json
{
  "subject": "No water supply for 3 days in Kakkanad",
  "description": "The water supply to our ward has been completely cut off for 3 days. No prior notice was given. We have 200 families affected."
}
```

| Field | Type | Required |
|-------|------|----------|
| `subject` | string | ✅ |
| `description` | string | ✅ |

### Response – 200 OK
```json
{
  "suggestedDept": "Water Resources Department",
  "suggestedCategory": "Water Supply",
  "suggestedPriority": "HIGH",
  "summary": "Citizen in Kakkanad, Ernakulam reports complete water supply disruption for 3 days affecting approximately 200 families, with no advance notice from authorities. Requires urgent investigation by water supply department.",
  "isDuplicate": false,
  "source": "gemini"
}
```

**`source` field values:**
- `"gemini"` — Response from Google Gemini API
- `"mock"` — Response from local mock AI (no API key configured)

### Error Responses
| Status | Condition |
|--------|-----------|
| 400 | Missing subject or description |
| 500 | AI service error (falls back to mock) |

---

## HTTP Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | Success (GET/PATCH) |
| 201 | Created (POST) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (wrong role) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Internal Server Error |

---

*Document version: 1.0 | Date: November 2026 | Project: CM Kerala Grievance Portal Prototype*
