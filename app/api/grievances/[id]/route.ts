import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    if (!grievance) {
      return NextResponse.json({ error: "Grievance not found" }, { status: 404 });
    }

    return NextResponse.json(grievance);
  } catch (error: any) {
    console.error("Grievance [id] GET error:", error);
    return NextResponse.json({ error: "Failed to retrieve grievance" }, { status: 500 });
  }
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

    const current = await prisma.grievance.findUnique({
      where: { id: params.id },
    });

    if (!current) {
      return NextResponse.json({ error: "Grievance not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminRemarks !== undefined) updateData.adminRemarks = adminRemarks;
    if (departmentId !== undefined) updateData.departmentId = departmentId || null;
    if (priority) updateData.priority = priority;

    const updated = await prisma.grievance.update({
      where: { id: params.id },
      data: updateData,
    });

    // Record in history if status changed or remarks provided
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

    // Record or update department action report
    if (actionReport && (departmentId || current.departmentId)) {
      const activeDeptId = departmentId || current.departmentId!;
      const existingAssignment = await prisma.grievanceAssignment.findFirst({
        where: { grievanceId: params.id, departmentId: activeDeptId },
      });

      if (existingAssignment) {
        await prisma.grievanceAssignment.update({
          where: { id: existingAssignment.id },
          data: {
            actionReport,
            resolvedAt: status === "RESOLVED" ? new Date() : existingAssignment.resolvedAt,
          },
        });
      } else {
        await prisma.grievanceAssignment.create({
          data: {
            grievanceId: params.id,
            departmentId: activeDeptId,
            actionReport,
            resolvedAt: status === "RESOLVED" ? new Date() : null,
          },
        });
      }
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Grievance [id] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update grievance" }, { status: 500 });
  }
}
