import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const KERALA_DEPARTMENTS = [
  "Water Resources Department",
  "Public Works Department (PWD)",
  "Health and Family Welfare",
  "General Education Department",
  "Kerala State Electricity Board (KSEB)",
  "Agriculture Development & Farmers' Welfare",
  "Revenue and Disaster Management",
  "Kerala Police Department",
  "Transport Department (KSRTC)",
  "Local Self Government (LSGD)",
];

const CATEGORIES = [
  "Water Supply & Sanitation",
  "Roads, Bridges & Infrastructure",
  "Public Healthcare & Hospitals",
  "Education & Schools",
  "Electricity & Power Distribution",
  "Agriculture, Farmers & Irrigation",
  "Revenue, Land Records & Patta",
  "Police, Law & Public Safety",
  "Public Transport & Traffic",
  "Social Welfare, Pensions & Relief",
  "Civic Waste & Environmental Sanitation",
  "Urban Housing & Local Governance",
  "Other Public Grievances",
];

// Fallback intelligent semantic analyzer
function analyzeWithRuleEngine(
  subject: string,
  description: string,
  district: string
) {
  const combined = `${subject} ${description}`.toLowerCase();

  let suggestedDept = "Local Self Government (LSGD)";
  let suggestedCategory = "Other Public Grievances";
  let suggestedPriority = "MEDIUM";
  let reason = "Classified based on contextual keywords in public service delivery.";

  // Department and Category mapping
  if (
    combined.match(
      /water|pipeline|kwa|tap|drinking water|borewell|contamination|purification|leakage|water supply|well/
    )
  ) {
    suggestedDept = "Water Resources Department";
    suggestedCategory = "Water Supply & Sanitation";
    reason = "Detected water distribution, drinking water disruption, or Kerala Water Authority issues.";
  } else if (
    combined.match(
      /road|pothole|tarring|asphalt|bridge|culvert|pwd|highway|flyover|drainage repair|crater/
    )
  ) {
    suggestedDept = "Public Works Department (PWD)";
    suggestedCategory = "Roads, Bridges & Infrastructure";
    reason = "Identified public works infrastructure, road damage, or bridge condition issues.";
  } else if (
    combined.match(
      /hospital|doctor|medicine|drug|nurse|icu|clinic|dmo|phc|chc|insulin|medical college|patient|treatment/
    )
  ) {
    suggestedDept = "Health and Family Welfare";
    suggestedCategory = "Public Healthcare & Hospitals";
    reason = "Medical infrastructure, medicine shortage, or public healthcare service grievance.";
  } else if (
    combined.match(
      /school|college|teacher|student|classroom|headmaster|education|sslc|syllabus|mid-day meal|pta/
    )
  ) {
    suggestedDept = "General Education Department";
    suggestedCategory = "Education & Schools";
    reason = "School building maintenance, educational administration, or student safety concerns.";
  } else if (
    combined.match(
      /electricity|kseb|power cut|transformer|voltage|electric pole|wiring|tariff|meter|blackout/
    )
  ) {
    suggestedDept = "Kerala State Electricity Board (KSEB)";
    suggestedCategory = "Electricity & Power Distribution";
    reason = "Power grid breakdown, transformer issues, or electricity billing grievance.";
  } else if (
    combined.match(
      /farmer|paddy|crop|harvest|krishi|supplyco|irrigation|fertilizer|flood damage|drought|plantation/
    )
  ) {
    suggestedDept = "Agriculture Development & Farmers' Welfare";
    suggestedCategory = "Agriculture, Farmers & Irrigation";
    reason = "Agrarian crisis, crop loss compensation, or agricultural supply chain matter.";
  } else if (
    combined.match(
      /land|patta|pokkuvaravu|mutation|village office|survey|tahsildar|revenue|encroachment|boundary/
    )
  ) {
    suggestedDept = "Revenue and Disaster Management";
    suggestedCategory = "Revenue, Land Records & Patta";
    reason = "Land title dispute, village office delay, or revenue record update grievance.";
  } else if (
    combined.match(
      /police|crime|theft|harassment|assault|safety|complaint|fir|cyber|drug abuse|illicit/
    )
  ) {
    suggestedDept = "Kerala Police Department";
    suggestedCategory = "Police, Law & Public Safety";
    reason = "Public security concern, neighborhood safety, or law enforcement referral.";
  } else if (
    combined.match(
      /ksrtc|bus|route|depot|conductor|ticket|trip|transport|rto|driving license|fare/
    )
  ) {
    suggestedDept = "Transport Department (KSRTC)";
    suggestedCategory = "Public Transport & Traffic";
    reason = "Public transport deficiency, cancelled bus schedules, or transit accessibility.";
  } else if (
    combined.match(
      /garbage|waste|plastic|panchayat|municipality|corporation|stray dog|drain|stench|sanitation/
    )
  ) {
    suggestedDept = "Local Self Government (LSGD)";
    suggestedCategory = "Civic Waste & Environmental Sanitation";
    reason = "Local civic administration, waste disposal, or municipality service complaint.";
  }

  // Priority Determination
  if (
    combined.match(
      /urgent|critical|death|fatality|accident|hazard|life-threatening|epidemic|outbreak|poison|burst|collapse|emergency|children|danger/
    )
  ) {
    suggestedPriority = "HIGH";
  } else if (
    combined.match(
      /minor|general|query|suggestion|clarification|routine|small delay/
    )
  ) {
    suggestedPriority = "LOW";
  } else {
    suggestedPriority = "MEDIUM";
  }

  // Executive summary for CMO
  const cleanSubj = subject.length > 80 ? subject.substring(0, 80) + "..." : subject;
  const summary = `Citizen from ${district || "Kerala"} reports: "${cleanSubj}". Core issue concerns ${suggestedCategory.toLowerCase()} requiring intervention by ${suggestedDept}. Priority flagged as ${suggestedPriority}.`;

  return {
    suggestedDept,
    suggestedCategory,
    suggestedPriority,
    summary,
    reason,
    source: "Rule-Based Semantic Classifier (Official AI Fallback)",
  };
}

export async function POST(req: NextRequest) {
  try {
    const { subject, description, district } = await req.json();

    if (!subject || !description) {
      return NextResponse.json(
        { error: "Subject and description are required for AI analysis." },
        { status: 400 }
      );
    }

    // 1. Check for potential duplicate grievances in database
    let isDuplicate = false;
    let duplicateReference: string | null = null;
    try {
      const subjectTokens = subject
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .split(" ")
        .filter((w: string) => w.length > 4);

      if (subjectTokens.length > 0) {
        const potentialMatches = await prisma.grievance.findMany({
          where: {
            district: district || undefined,
            OR: subjectTokens.slice(0, 3).map((token: string) => ({
              subject: { contains: token },
            })),
          },
          select: { referenceNumber: true, subject: true },
          take: 1,
        });

        if (potentialMatches.length > 0) {
          isDuplicate = true;
          duplicateReference = potentialMatches[0].referenceNumber;
        }
      }
    } catch (e) {
      console.warn("Duplicate check error:", e);
    }

    // 2. Check for Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey.trim());
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are the Chief Minister's Grievance Redressal Portal AI Assistant for Kerala Government.
Analyze the citizen grievance below and classify it strictly.

DEPARTMENTS TO CHOOSE FROM:
${KERALA_DEPARTMENTS.join(", ")}

CATEGORIES TO CHOOSE FROM:
${CATEGORIES.join(", ")}

PRIORITY LEVELS: LOW, MEDIUM, HIGH

CITIZEN GRIEVANCE DETAILS:
- District: ${district || "Not specified"}
- Subject: ${subject}
- Description: ${description}

Respond ONLY with valid JSON (no markdown formatting, no code blocks):
{
  "suggestedDept": "exact department name from list",
  "suggestedCategory": "exact category from list",
  "suggestedPriority": "LOW or MEDIUM or HIGH",
  "summary": "Concise 2-3 sentence executive summary for the Chief Minister's Office review",
  "reason": "1-sentence technical reason for this classification"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response
          .text()
          .replace(/```json\n?|\n?```/g, "")
          .trim();
        const parsed = JSON.parse(text);

        return NextResponse.json({
          ...parsed,
          isDuplicate,
          duplicateReference,
          source: "Google Gemini 1.5 Flash (Live Model)",
        });
      } catch (geminiError: any) {
        console.warn("Gemini API call failed, falling back to rule engine:", geminiError.message);
      }
    }

    // 3. Fallback semantic engine
    const analysis = analyzeWithRuleEngine(subject, description, district);
    return NextResponse.json({
      ...analysis,
      isDuplicate,
      duplicateReference,
    });
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze grievance." },
      { status: 500 }
    );
  }
}
