import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  findFallbackGrievanceById,
  updateFallbackGrievance,
} from "@/lib/grievancesStore";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const grievance = await prisma.grievance.findUnique({
      where: { id: params.id },
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
  } catch (error: any) {
    console.warn("Prisma grievance [id] GET error, trying fallback store:", error);
  }

  const fallback = findFallbackGrievanceById(params.id);
  if (fallback) {
    return NextResponse.json(fallback);
  }

  return NextResponse.json({ error: "Grievance not found" }, { status: 404 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      status,
      remarks,
      departmentId,
      adminRemarks,
      priority,
      changedById,
      actionReport,
    } = body;

    // First update in fallback store
    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminRemarks !== undefined) updateData.adminRemarks = adminRemarks;
    if (departmentId !== undefined) updateData.departmentId = departmentId || null;
    if (priority) updateData.priority = priority;
    if (actionReport) updateData.actionTakenReport = actionReport;

    const fallbackUpdated = updateFallbackGrievance(params.id, updateData);

    // Also attempt DB update
    try {
      const current = await prisma.grievance.findUnique({
        where: { id: params.id },
      });

      if (current) {
        await prisma.grievance.update({
          where: { id: params.id },
          data: updateData,
        });

        if ((status && status !== current.status) || remarks) {
          await prisma.grievanceHistory.create({
            data: {
              grievanceId: params.id,
              status: status || current.status,
              remarks: remarks || `Status updated to ${status || current.status}`,
              changedById: changedById || current.citizenId,
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn("DB update warning (saved in fallback):", dbErr);
    }

    if (fallbackUpdated) {
      return NextResponse.json(fallbackUpdated);
    }

    return NextResponse.json({ success: true, ...updateData });
  } catch (error: any) {
    console.error("Grievance PATCH error:", error);
    return NextResponse.json({ error: "Failed to update grievance" }, { status: 500 });
  }
}
