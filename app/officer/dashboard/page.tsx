"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import {
  Briefcase,
  Search,
  Eye,
  Clock,
  CheckCircle,
  FileText,
  Building2,
  RefreshCw,
} from "lucide-react";

export default function OfficerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const departmentId = (session?.user as any)?.departmentId;
  const departmentName = (session?.user as any)?.departmentName;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const role = (session.user as any)?.role;
      if (role !== "DEPT_OFFICER") {
        router.push("/");
        return;
      }
      loadGrievances();
    }
  }, [status, session, router, departmentId]);

  async function loadGrievances() {
    setLoading(true);
    try {
      const url = departmentId
        ? `/api/grievances?departmentId=${departmentId}`
        : "/api/grievances";
      const res = await fetch(url);
      if (res.ok) {
        setGrievances(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = grievances.filter((g) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      g.referenceNumber.toLowerCase().includes(q) ||
      g.subject.toLowerCase().includes(q) ||
      g.district.toLowerCase().includes(q)
    );
  });

  if (status === "loading" || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading Department Officer Portal...
      </div>
    );
  }

  const inProgressCount = grievances.filter((g) => g.status === "IN_PROGRESS").length;
  const resolvedCount = grievances.filter((g) => g.status === "RESOLVED").length;
  const underReviewCount = grievances.filter((g) => g.status === "UNDER_REVIEW").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-700" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Department Nodal Officer Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {departmentName || "Assigned Department"}
          </h1>
          <p className="text-xs text-gray-500">
            Nodal Officer: <strong>{session?.user?.name}</strong> • Grievances forwarded from CMO
          </p>
        </div>

        <button
          onClick={loadGrievances}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">Assigned Total</div>
          <div className="text-3xl font-black text-gray-900 mt-1">{grievances.length}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">From Chief Minister&apos;s Office</div>
        </div>

        <div className="bg-white border border-amber-200 p-5 rounded-2xl shadow-sm bg-amber-50/30">
          <div className="text-xs font-semibold text-amber-800 uppercase">Awaiting Action</div>
          <div className="text-3xl font-black text-amber-600 mt-1">{underReviewCount}</div>
          <div className="text-[11px] text-amber-700/80 mt-0.5">New Forwarded Cases</div>
        </div>

        <div className="bg-white border border-indigo-200 p-5 rounded-2xl shadow-sm bg-indigo-50/30">
          <div className="text-xs font-semibold text-indigo-800 uppercase">Under Investigation</div>
          <div className="text-3xl font-black text-indigo-600 mt-1">{inProgressCount}</div>
          <div className="text-[11px] text-indigo-700/80 mt-0.5">Field Inquiries Active</div>
        </div>

        <div className="bg-white border border-emerald-200 p-5 rounded-2xl shadow-sm bg-emerald-50/30">
          <div className="text-xs font-semibold text-emerald-800 uppercase">Resolved &amp; ATR Filed</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">{resolvedCount}</div>
          <div className="text-[11px] text-emerald-700/80 mt-0.5">Completed</div>
        </div>
      </div>

      {/* Grievances Table */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-700" />
            <h3 className="text-lg font-bold text-gray-900">
              Department Assigned Complaints
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, subject..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-xs">
            No grievances currently assigned to your department.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Reference ID</th>
                  <th className="px-4 py-3">Subject &amp; Citizen</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Received On</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-800 whitespace-nowrap">
                      {g.referenceNumber}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs">
                      <p className="font-bold text-gray-900 truncate" title={g.subject}>
                        {g.subject}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {g.citizen?.name} ({g.citizen?.mobile || g.citizen?.email})
                      </p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-gray-800 font-medium">
                      {g.district}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <PriorityBadge priority={g.priority} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={g.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-gray-500 font-mono">
                      {formatDate(g.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <Link
                        href={`/officer/grievances/${g.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-lg border border-blue-200 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Investigate &amp; Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
