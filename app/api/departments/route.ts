import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_DEPARTMENTS = [
  { id: "wrd", code: "WRD", name: "Water Resources Department", description: "Drinking water supply schemes, Kerala Water Authority (KWA), pipeline maintenance, and canal irrigation.", _count: { grievances: 2, officers: 1 } },
  { id: "pwd", code: "PWD", name: "Public Works Department (PWD)", description: "State highways, district roads, bridges, public buildings, and pothole maintenance.", _count: { grievances: 2, officers: 1 } },
  { id: "hfw", code: "HFW", name: "Health and Family Welfare", description: "Primary health centres, medical college hospitals, essential medicines, and public health monitoring.", _count: { grievances: 1, officers: 1 } },
  { id: "ged", code: "GED", name: "General Education Department", description: "Government and aided schools, infrastructure repairs, teacher allotment, and mid-day meal scheme.", _count: { grievances: 1, officers: 1 } },
  { id: "kseb", code: "KSEB", name: "Kerala State Electricity Board (KSEB)", description: "Grid electricity, transformer breakdowns, street lighting lines, and billing disputes.", _count: { grievances: 2, officers: 1 } },
  { id: "agr", code: "AGR", name: "Agriculture Development & Farmers' Welfare", description: "Crop loss compensation, Krishi Bhavan assistance, fertilizers, and farmer distress relief.", _count: { grievances: 1, officers: 1 } },
  { id: "rev", code: "REV", name: "Revenue and Disaster Management", description: "Land records, mutation, village office certificates, disaster relief, and survey disputes.", _count: { grievances: 1, officers: 1 } },
  { id: "pol", code: "POL", name: "Kerala Police Department", description: "Public safety, women's cell, traffic regulation, and local law enforcement support.", _count: { grievances: 1, officers: 1 } },
  { id: "trn", code: "TRN", name: "Transport Department (KSRTC)", description: "Public bus routes, regional transport offices (RTO), and rural connectivity.", _count: { grievances: 1, officers: 1 } },
  { id: "lsgd", code: "LSGD", name: "Local Self Government (LSGD)", description: "Panchayats and municipalities, waste management, building permits, and local sanitation.", _count: { grievances: 1, officers: 1 } },
];

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
    if (departments && departments.length > 0) {
      return NextResponse.json(departments);
    }
    return NextResponse.json(FALLBACK_DEPARTMENTS);
  } catch (error: any) {
    console.warn("Fallback departments returned:", error);
    return NextResponse.json(FALLBACK_DEPARTMENTS);
  }
}
