# CM Kerala – Chief Minister's Public Grievance Redressal Portal
## 06. Setup and Testing Guide

---

## 1. Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 18.x or higher | Download from [nodejs.org](https://nodejs.org) |
| pnpm | 8.x or higher | `npm install -g pnpm` |
| Git | Any recent | For cloning |
| Gemini API Key | Optional | For real AI features; mock AI works without it |

**Check versions:**
```bash
node --version    # Should show v18.x.x or higher
pnpm --version    # Should show 8.x.x or higher
```

---

## 2. Installation Steps

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd CM_project
```

### Step 2: Install Dependencies
```bash
pnpm install
```
This installs all packages: Next.js, Prisma, NextAuth, Tailwind, Recharts, Google Generative AI, etc.

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
```

Open `.env` and fill in the values:
```env
# Database (SQLite — no changes needed for local dev)
DATABASE_URL="file:./prisma/dev.db"

# NextAuth — REQUIRED
NEXTAUTH_SECRET="your-random-secret-string-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI — OPTIONAL (mock AI used if absent)
GEMINI_API_KEY="your-gemini-api-key-from-aistudio.google.com"
```

> **Generating NEXTAUTH_SECRET:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Step 4: Generate Prisma Client
```bash
pnpm exec prisma generate
```

### Step 5: Create the Database and Apply Schema
```bash
pnpm exec prisma db push
```
This creates `prisma/dev.db` and applies all schema tables.

### Step 6: Seed the Database
```bash
pnpm exec prisma db seed
```
This populates:
- 8 government departments
- 1 CMO admin user
- 3 department officers
- 1 test citizen
- 5+ sample grievances in various statuses

### Step 7: Start Development Server
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | — | SQLite file path: `file:./prisma/dev.db` |
| `NEXTAUTH_SECRET` | ✅ | — | Secret for JWT signing (min 32 chars) |
| `NEXTAUTH_URL` | ✅ | — | App URL: `http://localhost:3000` (dev) or Railway URL (prod) |
| `GEMINI_API_KEY` | ❌ | — | Google AI Studio API key; mock AI used if absent |

---

## 4. Demo Test Accounts

These accounts are created by the seed script. All passwords meet the minimum security requirements for the prototype.

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **CMO Administrator** | admin@cmkerala.gov.in | Admin@123 | Full dashboard, all grievances, analytics |
| **Water Dept Officer** | officer.water@kerala.gov.in | Officer@123 | Water department grievances only |
| **Roads Dept Officer** | officer.roads@kerala.gov.in | Officer@123 | PWD grievances only |
| **Health Dept Officer** | officer.health@kerala.gov.in | Officer@123 | Health dept grievances only |
| **Citizen** | arun@test.com | Citizen@123 | Own grievances only |

---

## 5. Test Scenarios

### 5.1 Citizen Flow Tests

#### Test 1: Citizen Registration
1. Navigate to `/register`
2. Fill in: Name="Test User", Email="test@example.com", Mobile="9876543210", Password="Test@123"
3. Submit form
4. **Expected:** Redirect to `/login` with success message

#### Test 2: Citizen Login
1. Navigate to `/login`
2. Enter: Email=`arun@test.com`, Password=`Citizen@123`
3. **Expected:** Redirect to `/citizen/dashboard`

#### Test 3: Grievance Submission with AI
1. Login as citizen (`arun@test.com`)
2. Navigate to `/citizen/submit`
3. Fill Subject: "Water pipe burst near my house flooding the road"
4. Fill Description: "A major water pipe burst on 10th November near my house at MG Road, Ernakulam. The road is completely flooded and traffic is blocked."
5. Click "Analyze with AI"
6. **Expected:** AI panel shows suggested dept (Water Resources), category (Water), priority (HIGH)
7. Select district: "Ernakulam"
8. Submit grievance
9. **Expected:** Success message with reference number (GRV-202611-XXXXX)

#### Test 4: Public Grievance Tracking
1. Note the reference number from Test 3
2. Navigate to `/track` (without logging in, or in incognito)
3. Enter reference number
4. **Expected:** Grievance status and history displayed

#### Test 5: Citizen Dashboard
1. Login as citizen (`arun@test.com`)
2. Navigate to `/citizen/dashboard`
3. **Expected:** List of all grievances submitted by this citizen with status badges

---

### 5.2 CMO Administrator Flow Tests

#### Test 6: CMO Dashboard and Filtering
1. Login as admin (`admin@cmkerala.gov.in`)
2. Navigate to `/cmo/dashboard`
3. **Expected:** All grievances listed with filter panel
4. Apply filter: Status = "SUBMITTED"
5. **Expected:** Only submitted grievances shown

#### Test 7: Grievance Assignment
1. Login as admin
2. Open any SUBMITTED grievance
3. Review AI suggestions panel
4. Select department from dropdown (e.g., "Public Works Department")
5. Add remarks: "Assigned for urgent action"
6. Change status to "ASSIGNED"
7. Click Save
8. **Expected:** 
   - Status badge changes to ASSIGNED
   - History shows new entry with admin name
   - Department shown in grievance detail

#### Test 8: CMO Analytics
1. Login as admin
2. Navigate to `/cmo/analytics` (or analytics tab on dashboard)
3. **Expected:** 
   - Status distribution pie chart
   - District-wise bar chart
   - Category-wise bar chart  
   - Weekly submission trend line chart

---

### 5.3 Officer Flow Tests

#### Test 9: Officer Dashboard
1. Login as officer (`officer.water@kerala.gov.in`)
2. Navigate to `/officer/dashboard`
3. **Expected:** Only grievances assigned to Water Resources Department shown
4. Confirm: PWD or Health grievances NOT shown

#### Test 10: Action Report Submission
1. Login as water officer
2. Open an ASSIGNED or IN_PROGRESS grievance
3. Add action report: "Site visited on Nov 12. Issue identified as burst main pipeline. Repair work completed within 4 hours. Water supply restored."
4. Change status to "RESOLVED"
5. Click Submit
6. **Expected:**
   - Grievance status changes to RESOLVED
   - Action report saved
   - History entry created

---

### 5.4 AI Analysis Tests

#### Test 11: Mock AI (No API Key)
If `GEMINI_API_KEY` is not set:
1. Submit any text to AI analysis
2. **Expected:** Response with `source: "mock"` and keyword-based suggestions

#### Test 12: Gemini AI (With API Key)
If `GEMINI_API_KEY` is set:
1. Submit: Subject="School building roof is leaking and students are sitting in rain", Description="The government school roof has been leaking for 2 months..."
2. **Expected:** Response with `source: "gemini"`, `suggestedDept: "Education Department"`, `suggestedPriority: "HIGH"`

---

## 6. Prisma Database Management

### View database contents (Prisma Studio)
```bash
pnpm exec prisma studio
```
Opens a GUI at http://localhost:5555 to browse and edit database records.

### Reset and re-seed database
```bash
pnpm exec prisma db push --force-reset
pnpm exec prisma db seed
```

### View schema
```bash
cat prisma/schema.prisma
```

---

## 7. Build for Production

```bash
pnpm run build
pnpm start
```

Verify the production build runs correctly before deploying to Railway.

---

## 8. Railway Deployment

### Prerequisites
- Railway account at [railway.app](https://railway.app)
- Project pushed to a GitHub repository
- `railway.toml` present in project root (already created)

### Steps

#### Step 1: Create Railway Project
1. Go to [railway.app/new](https://railway.app/new)
2. Click "Deploy from GitHub repo"
3. Select your CM_project repository

#### Step 2: Configure Environment Variables
In Railway dashboard → Variables tab, add:
```
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_SECRET=<generate-with-openssl-rand-hex-32>
NEXTAUTH_URL=https://<your-app>.railway.app
GEMINI_API_KEY=<your-key>  # Optional
```

#### Step 3: Deploy
Railway automatically runs the build command from `railway.toml`:
```
pnpm install && pnpm exec prisma generate && pnpm exec prisma db push && pnpm exec prisma db seed && pnpm run build
```

#### Step 4: Access the App
1. Railway provides a URL like `https://cm-project-production.up.railway.app`
2. Update `NEXTAUTH_URL` to match this URL
3. Trigger a redeploy

#### Step 5: Verify Deployment
1. Open the Railway URL
2. Test login with `admin@cmkerala.gov.in` / `Admin@123`
3. Submit a test grievance
4. Verify AI analysis works

> **⚠️ SQLite on Railway:** Railway's filesystem is ephemeral; the SQLite database resets on each deploy. For persistent data, migrate to Railway's managed PostgreSQL service and update `DATABASE_URL` and `prisma/schema.prisma` datasource provider to `postgresql`.

---

## 9. Troubleshooting

| Issue | Solution |
|-------|----------|
| `pnpm: command not found` | Run `npm install -g pnpm` |
| `PrismaClientInitializationError` | Run `pnpm exec prisma generate` |
| `NEXTAUTH_SECRET` missing error | Add secret to `.env` file |
| Login fails | Verify `.env` has `NEXTAUTH_URL=http://localhost:3000` |
| AI returns error | Check `GEMINI_API_KEY` or use mock mode without key |
| Port 3000 in use | Run `pnpm run dev -- -p 3001` |
| Database locked | Restart dev server; SQLite WAL mode helps |
| Seed fails | Run `pnpm exec prisma db push --force-reset` first |

---

*Document version: 1.0 | Date: November 2026 | Project: CM Kerala Grievance Portal Prototype*
