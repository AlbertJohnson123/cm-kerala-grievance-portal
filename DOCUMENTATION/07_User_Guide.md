# CM Kerala – Chief Minister's Public Grievance Redressal Portal
## 07. User Guide

---

## Introduction

This guide explains how to use the CM Kerala Grievance Redressal Portal for three distinct user types:
1. **Citizens** — Submit and track grievances
2. **CMO Administrators** — Manage, assign, and monitor all grievances
3. **Department Officers** — Investigate and resolve assigned grievances

---

## Part 1: Citizen Guide

Citizens are members of the public who wish to submit a complaint or grievance to the Chief Minister's Office of Kerala.

---

### Step 1: Register Your Account

**URL:** `/register`

1. Click **"Register"** in the top navigation bar
2. Fill in the registration form:
   - **Full Name**: Your complete name
   - **Email Address**: A valid email (used for login)
   - **Mobile Number**: Your 10-digit mobile number (optional)
   - **Password**: Choose a strong password (min 6 characters)
3. Click **"Create Account"**
4. You will be redirected to the login page

> **Note:** Your email address becomes your unique login ID. Use an email you have access to.

---

### Step 2: Login to Your Account

**URL:** `/login`

1. Enter your registered **Email** and **Password**
2. Click **"Sign In"**
3. You will be directed to your **Citizen Dashboard**

---

### Step 3: Submit a Grievance

**URL:** `/citizen/submit`

1. From your dashboard, click **"Submit New Grievance"** or navigate to `/citizen/submit`
2. Fill in the grievance form:

   | Field | Description | Example |
   |-------|-------------|---------|
   | **Subject** | Brief title of your complaint | "Water supply cut for 3 days" |
   | **Description** | Detailed explanation of the issue | Describe location, duration, impact |
   | **District** | Your Kerala district | Ernakulam |
   | **Category** | Type of issue | Water / Road / Health / Land / Education |
   | **Priority** | How urgent is this? | Low / Medium / High |

3. **Use the AI Assistant (Optional but recommended):**
   - After filling Subject and Description, click **"Analyze with AI"**
   - The AI will suggest:
     - 🏢 Relevant Government Department
     - 📂 Appropriate Category
     - 🔴 Priority Level
     - 📝 Auto-generated Summary
   - You can accept or change any AI suggestion

4. Click **"Submit Grievance"**
5. A **unique Reference Number** will be displayed (format: `GRV-YYYYMM-XXXXX`)
6. **Save this reference number!** You will need it to track your grievance.

> **⚠️ AI Note:** AI suggestions are auto-generated and may not always be accurate. The CMO team will review and confirm the department assignment.

---

### Step 4: Note Your Reference Number

After submission, you receive a reference number like:
```
GRV-202611-00042
```

Save this number. You can use it to:
- Track your grievance without logging in (from the public `/track` page)
- Share with others to check on the status
- Reference in follow-up communications

---

### Step 5: Track Your Grievance (Public Tracking)

**URL:** `/track`

You can track any grievance **without logging in**:
1. Navigate to the **Track Grievance** page (available in the top navigation)
2. Enter your **Reference Number**
3. Click **"Track"**
4. View:
   - Current status with colored badge
   - Full status history timeline
   - Which department is handling it
   - CMO remarks (if any)

---

### Step 6: View Your Dashboard

**URL:** `/citizen/dashboard`

Your personal dashboard shows:
- List of all grievances you have submitted
- Current status of each
- Date submitted and last updated
- Quick access to view grievance details

**Status meanings:**
| Status | Meaning |
|--------|---------|
| 🔵 SUBMITTED | Received by CMO, pending review |
| 🟡 UNDER_REVIEW | Being reviewed by CMO staff |
| 🟠 ASSIGNED | Forwarded to relevant department |
| 🔵 IN_PROGRESS | Department actively investigating |
| 🟢 RESOLVED | Issue resolved by department |
| ⚫ CLOSED | Grievance closed by CMO |

---

### Step 7: Submit Feedback After Resolution

Once your grievance is marked **RESOLVED**:
1. Open the grievance from your dashboard
2. Scroll to the **"Leave Feedback"** section
3. Rate your experience: ⭐ 1 to 5 stars
4. Optionally add a written comment
5. Click **"Submit Feedback"**

Your feedback helps improve the grievance redressal process.

---

### Citizen Tips

- 📸 Provide as much detail as possible — specific location, dates, number of people affected
- 📱 Save your reference number immediately after submission
- 🔄 Check back every few days for status updates
- ✉️ For general questions (not grievances), use the **Contact** page at `/contact`
- ❓ See the **FAQ** page at `/faq` for common questions

---

---

## Part 2: CMO Administrator Guide

CMO (Chief Minister's Office) administrators have full access to all grievances and tools to manage the redressal workflow.

---

### Step 1: Login with Admin Credentials

**URL:** `/login`

1. Enter your CMO admin email and password
2. Example test credentials: `admin@cmkerala.gov.in` / `Admin@123`
3. You will be redirected to the **CMO Dashboard**

---

### Step 2: View the CMO Dashboard

**URL:** `/cmo/dashboard`

The dashboard displays:
- **Overview statistics**: Total grievances, by status, recent submissions
- **Grievance list**: All grievances from all citizens across Kerala
- **Filter and search tools**: Narrow down the list

---

### Step 3: Filter and Search Grievances

Use the filter panel to narrow down grievances:

| Filter | Options |
|--------|---------|
| **Status** | SUBMITTED / UNDER_REVIEW / ASSIGNED / IN_PROGRESS / RESOLVED / CLOSED |
| **District** | All 14 Kerala districts |
| **Category** | Road / Water / Health / Land / Education / Agriculture / Electricity / Other |
| **Priority** | LOW / MEDIUM / HIGH |
| **Reference No.** | Partial text search |
| **Department** | Filter by assigned department |

**Workflow tip:** Start your day by filtering on `Status = SUBMITTED` to see new unreviewed grievances.

---

### Step 4: Open a Grievance Detail

1. Click on any grievance row to open the detail view
2. The detail page shows:
   - Full citizen information
   - Complete description
   - **AI Analysis Panel** (suggested dept, category, priority, summary)
   - Attachments (if any)
   - **Status History Timeline** — full audit trail of all actions
   - Current assignment details

---

### Step 5: Review AI Suggestions

The **AI Analysis Panel** shows:
- 🏢 **Suggested Department**: Which department AI recommends
- 📂 **Suggested Category**: AI-classified category
- 🔴 **Priority**: AI-recommended urgency level
- 📝 **AI Summary**: Auto-generated brief summary for quick review
- ⚠️ **Duplicate Flag**: If AI suspects it's a duplicate complaint

> **Important:** Always use AI suggestions as a starting point. Apply your own judgment before assigning.

---

### Step 6: Assign to Department

1. In the **Update Grievance** panel:
   - Select the appropriate **Department** from the dropdown
   - Change **Status** to `ASSIGNED`
   - Add **Admin Remarks** explaining the assignment decision
2. Click **"Save Changes"**

The assigned department's officers will now see this grievance in their dashboard.

---

### Step 7: Add Remarks and Change Status

You can update grievance status at any time:

| Action | Status to Set | When |
|--------|--------------|------|
| Start reviewing | UNDER_REVIEW | When you first open a submitted grievance |
| Forward to dept | ASSIGNED | When you've chosen a department |
| Close resolved | CLOSED | After resolution is confirmed satisfactory |
| Reject invalid | CLOSED | For duplicate/invalid grievances |

Each status change requires you to add **Remarks** that explain your action. This creates an audit trail.

---

### Step 8: Monitor Department Responses

After assigning:
1. Check back after a few days
2. Filter by `Status = ASSIGNED` or `IN_PROGRESS` to see pending department work
3. Open any grievance to see the department's **Action Report** (once submitted by officer)
4. If satisfied with officer's resolution, change status to `CLOSED`

---

### Step 9: View Analytics Charts

**URL:** `/cmo/analytics` (or Analytics tab)

Available visualizations:
- 🥧 **Status Distribution** (Pie chart) — proportion of grievances by status
- 📊 **District-wise Breakdown** (Bar chart) — which districts have most complaints
- 📊 **Category-wise Distribution** (Bar chart) — most common issue types
- 📈 **Weekly Trend** (Line chart) — submission volume over time

Use analytics to:
- Identify overloaded departments
- Spot districts with recurring issues
- Track resolution rate improvements

---

### CMO Administrator Tips

- ⚡ Prioritize HIGH priority and SUBMITTED grievances first
- 🔁 Regularly check for grievances stuck in ASSIGNED/IN_PROGRESS for too long
- 📊 Review analytics weekly to identify systemic issues
- 📝 Always add clear remarks when changing status — the citizen can see the history
- 🤖 AI suggestions save time but verify before assigning critical grievances

---

---

## Part 3: Department Officer Guide

Department officers are government employees assigned to a specific department. They see only the grievances assigned to their department.

---

### Step 1: Login with Officer Credentials

**URL:** `/login`

Use your department officer credentials:

| Department | Email | Password |
|-----------|-------|----------|
| Water Resources | officer.water@kerala.gov.in | Officer@123 |
| Public Works | officer.roads@kerala.gov.in | Officer@123 |
| Health & Family Welfare | officer.health@kerala.gov.in | Officer@123 |

You will be redirected to the **Officer Dashboard**.

---

### Step 2: View Assigned Grievances

**URL:** `/officer/dashboard`

Your dashboard shows only grievances assigned to **your department**. For each grievance you can see:
- Reference number and subject
- District and category
- Priority level (color-coded: 🔴 High, 🟡 Medium, 🟢 Low)
- Current status
- Date assigned

---

### Step 3: Open a Grievance

1. Click on a grievance to open its detail view
2. Review:
   - Citizen's full description
   - AI-generated summary (for context)
   - CMO admin remarks (why it was assigned to your dept)
   - Any attachments uploaded by the citizen
   - Previous status history

---

### Step 4: Add Investigation Remarks

As you work on the grievance:
1. In the **Update** panel, change status to **IN_PROGRESS**
2. Add remarks: "Site visit scheduled for November 15"
3. Save — this creates a history entry visible to the citizen

---

### Step 5: Upload Action Report

After investigating and taking action:
1. In the **Action Report** text area, write a detailed report:
   ```
   Site visited on November 15, 2026. 
   Issue: Burst water main on MG Road, identified by field team.
   Action taken: Emergency repair crew deployed. Pipeline section replaced. 
   Water supply restored by 4:00 PM on November 15.
   Follow-up: Area will be monitored for 7 days to ensure no recurrence.
   ```
2. This report is saved to the assignment record

---

### Step 6: Mark as Resolved

Once the issue is fully resolved:
1. Add your final action report (see Step 5)
2. Change **Status** to **RESOLVED**
3. Click **Save**

The citizen will see their grievance marked as RESOLVED and can submit feedback. The CMO will then review and may mark it as CLOSED.

---

### Officer Tips

- 📋 Read the AI summary and citizen description carefully before visiting the site
- ⏰ Prioritize HIGH priority grievances — these affect health or safety
- 🔄 Update status to IN_PROGRESS as soon as you start working — the citizen can see this
- 📝 Be specific and factual in action reports — they form the official record
- 🔔 Check your dashboard daily for newly assigned grievances

---

## Quick Reference: Status Workflow

```
[Citizen submits]
      │
      ▼
  SUBMITTED
  (CMO reviews)
      │
      ▼
UNDER_REVIEW
  (CMO assigns)
      │
      ▼
  ASSIGNED ──► [Officer sees it]
      │
      ▼
IN_PROGRESS ──► [Officer working]
      │
      ▼
  RESOLVED ──► [Citizen can give feedback]
      │
      ▼
  CLOSED ──► [CMO confirms, case complete]
```

---

## Getting Help

| Issue | Contact |
|-------|---------|
| Technical portal issues | Use the Contact form at `/contact` |
| Questions about your grievance | Track at `/track` with reference number |
| Forgotten password | Contact CMO IT support |
| General FAQ | See `/faq` |

---

*Document version: 1.0 | Date: November 2026 | Project: CM Kerala Grievance Portal Prototype*
