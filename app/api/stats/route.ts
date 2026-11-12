import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [total, submitted, underReview, inProgress, resolved, reopened] =
      await Promise.all([
        prisma.grievance.count(),
        prisma.grievance.count({ where: { status: "SUBMITTED" } }),
        prisma.grievance.count({ where: { status: "UNDER_REVIEW" } }),
        prisma.grievance.count({ where: { status: "IN_PROGRESS" } }),
        prisma.grievance.count({ where: { status: "RESOLVED" } }),
        prisma.grievance.count({ where: { status: "REOPENED" } }),
      ]);

    const byDistrictRaw = await prisma.grievance.groupBy({
      by: ["district"],
      _count: { id: true },
    });

    const byCategoryRaw = await prisma.grievance.groupBy({
      by: ["category"],
      _count: { id: true },
    });

    const byPriorityRaw = await prisma.grievance.groupBy({
      by: ["priority"],
      _count: { id: true },
    });

    const byDeptRaw = await prisma.grievance.groupBy({
      by: ["departmentId"],
      _count: { id: true },
    });

    const allDepts = await prisma.department.findMany({
      select: { id: true, name: true, code: true },
    });
    const deptMap = Object.fromEntries(allDepts.map((d) => [d.id, d.name]));

    return NextResponse.json({
      total,
      submitted,
      underReview,
      inProgress,
      resolved,
      reopened,
      pending: submitted + underReview + inProgress + reopened,
      byDistrict: byDistrictRaw.map((d) => ({
        district: d.district,
        count: d._count.id,
      })),
      byCategory: byCategoryRaw.map((c) => ({
        category: c.category,
        count: c._count.id,
      })),
      byPriority: byPriorityRaw.map((p) => ({
        priority: p.priority,
        count: p._count.id,
      })),
      byDept: byDeptRaw
        .filter((d) => d.departmentId)
        .map((d) => ({
          dept: deptMap[d.departmentId!] || "Unassigned",
          count: d._count.id,
        })),
    });
  } catch (error: any) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
