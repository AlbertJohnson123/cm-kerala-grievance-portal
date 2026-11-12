import { prisma } from "@/lib/prisma";
import { Building2, Users, FileText, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const FALLBACK_DEPARTMENTS = [
  {
    id: "wrd",
    code: "WRD",
    name: "Water Resources Department",
    description: "Drinking water supply schemes, Kerala Water Authority (KWA), pipeline maintenance, and canal irrigation.",
    _count: { grievances: 2, officers: 1 },
  },
  {
    id: "pwd",
    code: "PWD",
    name: "Public Works Department (PWD)",
    description: "State highways, district roads, bridges, public buildings, and pothole maintenance.",
    _count: { grievances: 2, officers: 1 },
  },
  {
    id: "hfw",
    code: "HFW",
    name: "Health and Family Welfare",
    description: "Primary health centres, medical college hospitals, essential medicines, and public health monitoring.",
    _count: { grievances: 1, officers: 1 },
  },
  {
    id: "ged",
    code: "GED",
    name: "General Education Department",
    description: "Government and aided schools, infrastructure repairs, teacher allotment, and mid-day meal scheme.",
    _count: { grievances: 1, officers: 1 },
  },
  {
    id: "kseb",
    code: "KSEB",
    name: "Kerala State Electricity Board (KSEB)",
    description: "Grid electricity, transformer breakdowns, street lighting lines, and billing disputes.",
    _count: { grievances: 2, officers: 1 },
  },
  {
    id: "agr",
    code: "AGR",
    name: "Agriculture Development & Farmers' Welfare",
    description: "Crop loss compensation, Krishi Bhavan assistance, fertilizers, and farmer distress relief.",
    _count: { grievances: 1, officers: 1 },
  },
  {
    id: "rev",
    code: "REV",
    name: "Revenue and Disaster Management",
    description: "Land records, mutation, village office certificates, disaster relief, and survey disputes.",
    _count: { grievances: 1, officers: 1 },
  },
  {
    id: "pol",
    code: "POL",
    name: "Kerala Police Department",
    description: "Public safety, women's cell, traffic regulation, and local law enforcement support.",
    _count: { grievances: 1, officers: 1 },
  },
  {
    id: "trn",
    code: "TRN",
    name: "Transport Department (KSRTC)",
    description: "Public bus routes, regional transport offices (RTO), and rural connectivity.",
    _count: { grievances: 1, officers: 1 },
  },
  {
    id: "lsgd",
    code: "LSGD",
    name: "Local Self Government (LSGD)",
    description: "Panchayats and municipalities, waste management, building permits, and local sanitation.",
    _count: { grievances: 1, officers: 1 },
  },
];

export default async function DepartmentsPage() {
  let departments = FALLBACK_DEPARTMENTS;

  try {
    const fetched = await prisma.department.findMany({
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
    if (fetched && fetched.length > 0) {
      departments = fetched;
    }
  } catch (error) {
    console.warn("Using fallback department list in serverless:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          State Administrative Network
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Participating Kerala Government Departments
        </h1>
        <p className="text-base text-gray-600">
          Grievances received at the Chief Minister&apos;s Office are routed to designated
          nodal officers across these state departments for field investigation and resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-mono font-bold rounded-lg border border-emerald-200">
                  {dept.code}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Statewide Division
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {dept.name}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {dept.description}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5 font-medium">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>{dept._count?.grievances || 0} Grievances Filed</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-blue-700" />
                <span>{dept._count?.officers || 1} Nodal Officers</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
