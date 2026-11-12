# CM Kerala – Chief Minister's Public Grievance Redressal Portal
## 05. AI Integration

---

## 1. Overview

The portal integrates AI-powered grievance analysis to assist both citizens and CMO administrators. When a citizen types their grievance subject and description, the AI analyzes the content and provides intelligent suggestions to streamline the routing and prioritization process.

**Key principle:** All AI suggestions are **advisory only**. Citizens can override suggestions, and CMO admins perform final human review before any official action is taken.

---

## 2. AI Model

| Property | Value |
|----------|-------|
| **Model** | Google Gemini 1.5 Flash |
| **SDK** | `@google/generative-ai` (official Google NPM package) |
| **API Endpoint** | `generativelanguage.googleapis.com` |
| **Tier** | Free tier (rate limited — 15 RPM) |
| **Configuration** | Requires `GEMINI_API_KEY` environment variable |
| **Fallback** | Rule-based mock AI engine (keyword matching) |

**Why Gemini 1.5 Flash?**
- Optimized for fast, structured text tasks
- Handles JSON output reliably with appropriate prompting
- Free tier is sufficient for prototype/demo scale
- Native understanding of Indian administrative context

---

## 3. Fallback: Mock AI Engine

When `GEMINI_API_KEY` is not set (development without key, CI/CD, or API unavailability), the system uses a **local mock AI engine** implemented in `lib/mockAI.ts`.

### Mock AI Logic

The mock AI uses a **keyword matching** approach:

```typescript
// Simplified logic (actual implementation in lib/mockAI.ts)
const DEPARTMENT_KEYWORDS = {
  "Public Works Department": ["road", "pothole", "bridge", "highway", "construction", "drainage"],
  "Water Resources Department": ["water", "supply", "pipeline", "flood", "drinking water", "irrigation"],
  "Health & Family Welfare": ["hospital", "doctor", "medicine", "health", "clinic", "ambulance"],
  "Education Department": ["school", "teacher", "college", "study", "exam", "scholarship"],
  "Revenue & Land Department": ["land", "patta", "survey", "encroachment", "property"],
  "Electricity Board (KSEB)": ["electricity", "power", "voltage", "transformer", "current", "bill"],
};

const PRIORITY_KEYWORDS = {
  HIGH: ["urgent", "emergency", "accident", "death", "critical", "immediate", "life"],
  LOW: ["minor", "small", "inconvenience", "suggestion", "request"],
};
```

### Mock AI Scoring
1. Text is lowercased and tokenized
2. Each department's keyword list is scored by match count
3. Highest-scoring department wins
4. Priority is boosted if HIGH keywords present, reduced if LOW keywords present
5. Summary is a concatenation of subject + first 100 chars of description
6. `isDuplicate` is always `false` in mock mode (no DB cross-reference)

---

## 4. AI Analysis Workflow

```
┌─────────────────────────────────────────────────────────┐
│                  Citizen fills form                      │
│   Subject: "No water supply for 3 days in Kakkanad"     │
│   Description: "200 families affected, no notice..."    │
└──────────────────────┬──────────────────────────────────┘
                       │  User clicks "Analyze with AI"
                       ▼
              POST /api/ai/analyze
              { subject, description }
                       │
           ┌───────────▼───────────┐
           │   GEMINI_API_KEY set? │
           └───────────┬───────────┘
                       │
          YES ─────────┴────────── NO
           │                        │
           ▼                        ▼
  @google/generative-ai       lib/mockAI.ts
  gemini-1.5-flash model      Keyword matching
  Structured prompt            Rule-based scoring
           │                        │
           └───────────┬────────────┘
                       ▼
              JSON Response:
              {
                suggestedDept: "Water Resources Department",
                suggestedCategory: "Water Supply",
                suggestedPriority: "HIGH",
                summary: "Citizen reports...",
                isDuplicate: false,
                source: "gemini" | "mock"
              }
                       │
                       ▼
         ┌─────────────────────────────┐
         │   AI Suggestions Panel      │
         │   (shown to citizen)        │
         │   ⚠️ "AI Suggestions"       │
         │   Dept: Water Resources ✓  │
         │   Category: Water Supply ✓ │
         │   Priority: HIGH ✓         │
         │   [Citizen can change]      │
         └─────────────────────────────┘
                       │
                       ▼
         Citizen submits grievance
         (AI fields saved to DB)
                       │
                       ▼
         CMO Dashboard shows:
         - AI suggested dept (advisory)
         - AI summary (for quick review)
         - isDuplicate flag (attention indicator)
```

---

## 5. Prompt Engineering

### 5.1 System Prompt

The API route `app/api/ai/analyze/route.ts` constructs the following prompt:

```
You are an AI assistant for the Kerala Chief Minister's Office Grievance Portal.
Analyze the citizen's grievance and provide structured suggestions.

Available departments:
- Public Works Department (roads, bridges, infrastructure)
- Water Resources Department (water supply, irrigation, floods)
- Health & Family Welfare (hospitals, doctors, medicines)
- Education Department (schools, colleges, teachers)
- Revenue & Land Department (land records, property, survey)
- Agriculture Department (farming, crops, subsidies)
- Electricity Board KSEB (power supply, bills, transformers)
- Transport Department (buses, vehicles, roads)

Available categories: Road, Water, Health, Land, Education, Agriculture, Electricity, Transport, Other

Priority levels:
- HIGH: Urgent issues affecting health/safety/multiple people
- MEDIUM: Standard grievances requiring timely action
- LOW: Minor issues or suggestions

Grievance Subject: {subject}
Grievance Description: {description}

Respond ONLY with valid JSON in this exact format:
{
  "suggestedDept": "exact department name from the list above",
  "suggestedCategory": "category from the list above",
  "suggestedPriority": "HIGH" | "MEDIUM" | "LOW",
  "summary": "2-3 sentence summary for CMO review",
  "isDuplicate": false
}

Do not include any explanation or text outside the JSON.
```

### 5.2 Why This Prompt Works

| Design Choice | Reason |
|---------------|--------|
| Explicit department list | Prevents hallucinated department names |
| Exact category list | Ensures valid DB values |
| Priority definitions | Guides priority scoring with real criteria |
| JSON-only response | Easy parsing, no post-processing needed |
| No duplicate detection | Mock avoids DB queries; Gemini doesn't have DB access |

### 5.3 Response Parsing

```typescript
const result = await model.generateContent(prompt);
const text = result.response.text();

// Extract JSON from response (handles markdown code blocks if present)
const jsonMatch = text.match(/\{[\s\S]*\}/);
const parsed = JSON.parse(jsonMatch[0]);
```

---

## 6. API Route Implementation

**File:** `app/api/ai/analyze/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { mockAnalyze } from '@/lib/mockAI'

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { subject, description } = await request.json()
  if (!subject || !description) {
    return NextResponse.json({ error: 'Subject and description required' }, { status: 400 })
  }

  // Try Gemini first, fall back to mock
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const result = await model.generateContent(buildPrompt(subject, description))
      const text = result.response.text()
      const json = JSON.parse(text.match(/\{[\s\S]*\}/)[0])
      return NextResponse.json({ ...json, source: 'gemini' })
    } catch (error) {
      console.error('Gemini API error, falling back to mock:', error)
    }
  }

  // Mock fallback
  const mockResult = mockAnalyze(subject, description)
  return NextResponse.json({ ...mockResult, source: 'mock' })
}
```

---

## 7. Environment Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Optional | Google AI Studio API key. If absent, mock AI is used. |

**Getting a Gemini API key:**
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Sign in with Google account
3. Click "Get API key" → "Create API key"
4. Copy and add to `.env` as `GEMINI_API_KEY=your_key_here`

---

## 8. Limitations

| Limitation | Impact |
|------------|--------|
| **Mock uses keyword matching only** | Lower accuracy; may misclassify nuanced grievances |
| **Gemini requires API key** | Cannot use real AI without configuration |
| **No real duplicate detection** | Duplicate flag is always `false` (would need DB query + semantic similarity) |
| **Not 100% accurate** | AI can suggest wrong department; human review is mandatory |
| **Rate limiting (free tier)** | Gemini free tier limited to 15 RPM — sufficient for prototype |
| **Language: English only** | No Malayalam language support in current prompt |
| **Context window** | Very long descriptions may be truncated |

---

## 9. Safeguards and Ethics

The following safeguards ensure responsible AI use in this government portal context:

| Safeguard | Implementation |
|-----------|----------------|
| **Advisory only** | UI clearly labels all AI output as "AI Suggestions" with ⚠️ icon |
| **Citizen override** | Citizen can change any AI-suggested value before submitting |
| **CMO human review** | CMO admin performs independent review before assignment |
| **Source transparency** | `source: "gemini"/"mock"` field tells system which AI was used |
| **No automated action** | AI output never triggers any automated department action |
| **Data minimization** | Only subject + description sent to Gemini; no PII |
| **Fallback guarantee** | System always works (via mock) even without AI API |

---

## 10. Future AI Enhancements (Post-Prototype)

| Enhancement | Description |
|-------------|-------------|
| Semantic duplicate detection | Use embeddings to find similar past grievances |
| Malayalam language support | Add multilingual Gemini prompt |
| Sentiment analysis | Flag high-distress citizens for priority handling |
| Auto-routing | Direct assignment based on AI confidence score (with CMO override) |
| Feedback loop | Use resolved grievances to fine-tune suggestions |

---

*Document version: 1.0 | Date: November 2026 | Project: CM Kerala Grievance Portal Prototype*
