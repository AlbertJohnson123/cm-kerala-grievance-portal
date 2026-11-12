import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReferenceNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
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

      if (!grievance) {
        return NextResponse.json(
          { error: `No grievance found with reference number "${ref}".` },
          { status: 404 }
        );
      }
      return NextResponse.json(grievance);
    }

    // Filtered list
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

    return NextResponse.json(grievances);
  } catch (error: any) {
    console.error("Grievances GET error:", error);
    return NextResponse.json({ error: "Failed to fetch grievances" }, { status: 500 });
  }
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

    const grievance = await prisma.grievance.create({
      data: {
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

    // Create initial history entry
    await prisma.grievanceHistory.create({
      data: {
        grievanceId: grievance.id,
        status: "SUBMITTED",
        remarks: "Grievance submitted by citizen through portal.",
        changedById: citizenId,
      },
    });

    // Create optional attachment if present
    if (attachmentUrl && attachmentName) {
      await prisma.attachment.create({
        data: {
          grievanceId: grievance.id,
          filename: attachmentName,
          url: attachmentUrl,
          fileType: "document",
        },
      });
    }

    return NextResponse.json(grievance, { status: 201 });
  } catch (error: any) {
    console.error("Grievance POST error:", error);
    return NextResponse.json({ error: "Failed to submit grievance." }, { status: 500 });
  }
}
