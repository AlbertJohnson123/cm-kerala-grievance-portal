import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            grievances: true,
            officers: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(departments);
  } catch (error: any) {
    console.error("Departments error:", error);
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}
