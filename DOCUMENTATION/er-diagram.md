# Entity-Relationship Diagram
## CM Kerala – Chief Minister's Public Grievance Redressal Portal

```mermaid
erDiagram
    User {
        string id PK
        string name
        string email
        string mobile
        string passwordHash
        string role
        string departmentId FK
    }
    Department {
        string id PK
        string name
        string description
        string code
    }
    Grievance {
        string id PK
        string referenceNumber
        string citizenId FK
        string district
        string category
        string subject
        string description
        string priority
        string status
        string departmentId FK
        string aiSuggestedDept
        string aiSummary
        string adminRemarks
    }
    GrievanceHistory {
        string id PK
        string grievanceId FK
        string status
        string remarks
        string changedById FK
    }
    GrievanceAssignment {
        string id PK
        string grievanceId FK
        string departmentId FK
        string actionReport
    }
    Attachment {
        string id PK
        string grievanceId FK
        string filename
        string url
    }
    Feedback {
        string id PK
        string grievanceId FK
        string citizenId FK
        int rating
        string comment
    }
    ContactEnquiry {
        string id PK
        string name
        string email
        string subject
        string message
    }

    User ||--o{ Grievance : "submits"
    User ||--o{ GrievanceHistory : "creates"
    User }o--|| Department : "belongs to"
    Department ||--o{ Grievance : "handles"
    Department ||--o{ GrievanceAssignment : "assigned"
    Grievance ||--o{ GrievanceHistory : "has"
    Grievance ||--o{ GrievanceAssignment : "assigned to"
    Grievance ||--o{ Attachment : "has"
    Grievance ||--o{ Feedback : "receives"
    User ||--o{ Feedback : "gives"
```

---

## Relationship Descriptions

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| User → Grievance | 1 : Many | A citizen can submit multiple grievances |
| User → GrievanceHistory | 1 : Many | A user (any role) can create many history entries |
| User → Department | Many : 1 | Many officers can belong to one department |
| Department → Grievance | 1 : Many | A department handles many assigned grievances |
| Department → GrievanceAssignment | 1 : Many | A department can have many assignment records |
| Grievance → GrievanceHistory | 1 : Many | A grievance has a full audit history |
| Grievance → GrievanceAssignment | 1 : Many | A grievance can be (re)assigned |
| Grievance → Attachment | 1 : Many | A grievance can have multiple file attachments |
| Grievance → Feedback | 1 : Many | (In practice 1:1 — one feedback per grievance) |
| User → Feedback | 1 : Many | A citizen can give feedback on each resolved grievance |

---

## Notes

- `ContactEnquiry` is a **standalone entity** — it has no foreign key relationships with any other table
- `GrievanceHistory` is **append-only** — records are never updated or deleted
- `User.departmentId` is only populated for `OFFICER` role users
- `Grievance.departmentId` is set by CMO admin when assigning the grievance
- All primary keys use **CUID** format (`@default(cuid())`)
