import { prisma } from "@/lib/prisma";
import { Building2, Users, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
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
                <span>{dept._count.grievances} Grievances Filed</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-blue-700" />
                <span>{dept._count.officers} Nodal Officers</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

