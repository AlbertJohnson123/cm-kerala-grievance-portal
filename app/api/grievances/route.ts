import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReferenceNumber } from "@/lib/utils";
import {
  fallbackGrievances,
  addFallbackGrievance,
  findFallbackGrievanceByRef,
} from "@/lib/grievancesStore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  const status = searchParams.get("status");
  const district = searchParams.get("district");
  const category = searchParams.get("category");
  const priority = searchParams.get("priority");
  const citizenId = searchParams.get("citizenId");
  const departmentId = searchParams.get("departmentId");

  // Track by reference ID directly (Public track page)
  if (ref) {
    try {
      const grievance = await prisma.grievance.findUnique({
        where: { referenceNumber: ref.trim().toUpperCase() },
        include: {
          citizen: { select: { id: true, name: true, email: true, mobile: true } },
          department: true,
          history: {
            include: { changedBy: { select: { id: true, name: true, role: true } } },
            orderBy: { createdAt: "asc" },
          },
          assignments: {
            include: { department: true },
            orderBy: { createdAt: "desc" },
          },
          feedback: {
            include: { citizen: { select: { name: true } } },
          },
          attachments: true,
        },
      });

      if (grievance) {
        return NextResponse.json(grievance);
      }
    } catch (e) {
      console.warn("DB grievance ref lookup failed, falling back to in-memory store:", e);
    }

    const fallback = findFallbackGrievanceByRef(ref);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json(
      { error: `No grievance found with reference number "${ref}".` },
      { status: 404 }
    );
  }

  // Filtered list
  try {
    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (district && district !== "ALL") where.district = district;
    if (category && category !== "ALL") where.category = category;
    if (priority && priority !== "ALL") where.priority = priority;
    if (citizenId) where.citizenId = citizenId;
    if (departmentId && departmentId !== "ALL") where.departmentId = departmentId;

    const grievances = await prisma.grievance.findMany({
      where,
      include: {
        citizen: { select: { id: true, name: true, email: true, mobile: true } },
        department: true,
        history: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (grievances && grievances.length > 0) {
      return NextResponse.json(grievances);
    }
  } catch (error: any) {
    console.warn("Prisma grievances findMany failed, using fallback store:", error);
  }

  // Fallback filtering
  let filtered = [...fallbackGrievances];
  if (status && status !== "ALL") {
    filtered = filtered.filter((g) => g.status === status);
  }
  if (district && district !== "ALL") {
    filtered = filtered.filter((g) => g.district === district);
  }
  if (category && category !== "ALL") {
    filtered = filtered.filter((g) => g.category === category);
  }
  if (priority && priority !== "ALL") {
    filtered = filtered.filter((g) => g.priority === priority);
  }
  if (citizenId) {
    filtered = filtered.filter(
      (g) => g.citizenId === citizenId || g.citizen?.id === citizenId
    );
  }
  if (departmentId && departmentId !== "ALL") {
    filtered = filtered.filter(
      (g) => g.departmentId === departmentId || g.department?.id === departmentId || g.department?.code === departmentId
    );
  }

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      citizenId,
      district,
      category,
      subject,
      description,
      priority,
      departmentId,
      aiSuggestedDept,
      aiSuggestedCategory,
      aiSuggestedPriority,
      aiSummary,
      isDuplicate,
      attachmentUrl,
      attachmentName,
    } = body;

    if (!citizenId || !district || !category || !subject || !description) {
      return NextResponse.json(
        { error: "District, category, subject and description are required." },
        { status: 400 }
      );
    }

    const referenceNumber = generateReferenceNumber();
    const grievanceId = "grv_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    const newGrievance = {
      id: grievanceId,
      referenceNumber,
      citizenId,
      citizen: {
        id: citizenId,
        name: "Citizen",
        email: "citizen@portal.kerala.gov.in",
      },
      district,
      category,
      subject: subject.trim(),
      description: description.trim(),
      priority: priority || aiSuggestedPriority || "MEDIUM",
      status: "SUBMITTED",
      departmentId: departmentId || null,
      department: departmentId
        ? { id: departmentId, name: "Assigned Department", code: "DEPT" }
        : null,
      aiSuggestedDept: aiSuggestedDept || null,
      aiSuggestedCategory: aiSuggestedCategory || null,
      aiSuggestedPriority: aiSuggestedPriority || null,
      aiSummary: aiSummary || null,
      isDuplicate: Boolean(isDuplicate),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          id: "hist_" + Date.now(),
          status: "SUBMITTED",
          remarks: "Grievance submitted by citizen through portal.",
          createdAt: new Date().toISOString(),
          changedBy: { id: citizenId, name: "Citizen", role: "CITIZEN" },
        },
      ],
      assignments: [],
      attachments: attachmentUrl && attachmentName ? [
        {
          id: "att_" + Date.now(),
          filename: attachmentName,
          url: attachmentUrl,
          fileType: "document",
        }
      ] : [],
      feedback: [],
    };

    // Store in fallback memory
    addFallbackGrievance(newGrievance as any);

    // Persist to Prisma DB in background
    try {
      await prisma.grievance.create({
        data: {
          id: grievanceId,
          referenceNumber,
          citizenId,
          district,
          category,
          subject: subject.trim(),
          description: description.trim(),
          priority: priority || aiSuggestedPriority || "MEDIUM",
          status: "SUBMITTED",
          departmentId: departmentId || null,
          aiSuggestedDept: aiSuggestedDept || null,
          aiSuggestedCategory: aiSuggestedCategory || null,
          aiSuggestedPriority: aiSuggestedPriority || null,
          aiSummary: aiSummary || null,
          isDuplicate: Boolean(isDuplicate),
        },
      });

      await prisma.grievanceHistory.create({
        data: {
          grievanceId,
          status: "SUBMITTED",
          remarks: "Grievance submitted by citizen through portal.",
          changedById: citizenId,
        },
      });

      if (attachmentUrl && attachmentName) {
        await prisma.attachment.create({
          data: {
            grievanceId,
            filename: attachmentName,
            url: attachmentUrl,
            fileType: "document",
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB grievance create warning (saved in fallback):", dbErr);
    }

    return NextResponse.json(newGrievance, { status: 201 });
  } catch (error: any) {
    console.error("Grievance POST error:", error);
    return NextResponse.json({ error: "Failed to submit grievance." }, { status: 500 });
  }
}
