"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  KERALA_DISTRICTS,
  GRIEVANCE_CATEGORIES,
  formatDate,
} from "@/lib/utils";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import {
  Shield,
  Filter,
  BarChart3,
  Search,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = ["#047857", "#0284c7", "#eab308", "#f97316", "#ef4444", "#8b5cf6", "#10b981", "#6366f1"];

export default function CMODashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const userRole = (session.user as any)?.role;
      if (userRole !== "CMO_ADMIN") {
        router.push("/");
        return;
      }
      loadDashboardData();
    }
  }, [status, session, router]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [statsRes, deptRes, listRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/departments"),
        fetch("/api/grievances"),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (deptRes.ok) setDepartments(await deptRes.json());
      if (listRes.ok) setGrievances(await listRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Filtered grievances
  const filtered = grievances.filter((g) => {
    if (statusFilter !== "ALL" && g.status !== statusFilter) return false;
    if (districtFilter !== "ALL" && g.district !== districtFilter) return false;
    if (categoryFilter !== "ALL" && g.category !== categoryFilter) return false;
    if (priorityFilter !== "ALL" && g.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = g.referenceNumber.toLowerCase().includes(q);
      const matchSubj = g.subject.toLowerCase().includes(q);
      const matchCitizen = g.citizen?.name?.toLowerCase().includes(q);
      if (!matchRef && !matchSubj && !matchCitizen) return false;
    }
    return true;
  });

  if (status === "loading" || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading Chief Minister&apos;s Office Administrative Console...
      </div>
    );
  }

  // District chart data
  const districtChartData = stats?.byDistrict || [];
  // Category chart data
  const categoryChartData = stats?.byCategory || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Chief Minister&apos;s Office Console
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
            Grievance Redressal Administrative Dashboard
          </h1>
          <p className="text-xs text-gray-500">
            Real-time oversight of citizen complaints, department action taken reports &amp; state analytics.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
          Refresh Data
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">Total Received</div>
          <div className="text-3xl font-black text-gray-900 mt-1">
            {stats?.total || grievances.length}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Across 14 Districts</div>
        </div>

        <div className="bg-white border border-amber-200 p-5 rounded-2xl shadow-sm bg-amber-50/30">
          <div className="text-xs font-semibold text-amber-800 uppercase">Pending Redressal</div>
          <div className="text-3xl font-black text-amber-600 mt-1">
            {stats?.pending || 0}
          </div>
          <div className="text-[11px] text-amber-700/80 mt-0.5">Requires Action</div>
        </div>

        <div className="bg-white border border-emerald-200 p-5 rounded-2xl shadow-sm bg-emerald-50/30">
          <div className="text-xs font-semibold text-emerald-800 uppercase">Resolved</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {stats?.resolved || 0}
          </div>
          <div className="text-[11px] text-emerald-700/80 mt-0.5">ATR Approved</div>
        </div>

        <div className="bg-white border border-indigo-200 p-5 rounded-2xl shadow-sm bg-indigo-50/30">
          <div className="text-xs font-semibold text-indigo-800 uppercase">Under Review</div>
          <div className="text-3xl font-black text-indigo-600 mt-1">
            {stats?.underReview || 0}
          </div>
          <div className="text-[11px] text-indigo-700/80 mt-0.5">CMO Desk Scrutiny</div>
        </div>

        <div className="bg-white border border-red-200 p-5 rounded-2xl shadow-sm bg-red-50/30 col-span-2 sm:col-span-1">
          <div className="text-xs font-semibold text-red-800 uppercase">Urgent / High</div>
          <div className="text-3xl font-black text-red-600 mt-1">
            {grievances.filter((g) => g.priority === "HIGH").length}
          </div>
          <div className="text-[11px] text-red-700/80 mt-0.5">Priority Flagged</div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* District Chart */}
        <div className="lg:col-span-7 bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              District-Wise Grievance Distribution
            </h3>
            <span className="text-xs text-gray-400">Total Count</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtChartData}>
                <XAxis dataKey="district" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="count" fill="#047857" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Chart */}
        <div className="lg:col-span-5 bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700" />
              Category Breakdown
            </h3>
            <span className="text-xs text-gray-400">Top Sectors</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${(name || "").slice(0, 10)} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {categoryChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter and Table Section */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-700" />
            <h3 className="text-lg font-bold text-gray-900">
              Grievance Records &amp; Assignments
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            Showing {filtered.length} of {grievances.length} grievances
          </span>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Query */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ref, subject, citizen..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REOPENED">Reopened</option>
          </select>

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Districts</option>
            {KERALA_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 truncate"
          >
            <option value="ALL">All Categories</option>
            {GRIEVANCE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {/* Grievance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Reference ID</th>
                <th className="px-4 py-3">Subject / Citizen</th>
                <th className="px-4 py-3">District &amp; Category</th>
                <th className="px-4 py-3">Assigned Dept</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-800 whitespace-nowrap">
                    {g.referenceNumber}
                  </td>
                  <td className="px-4 py-3.5 max-w-xs">
                    <p className="font-bold text-gray-900 truncate" title={g.subject}>
                      {g.subject}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      by {g.citizen?.name} ({g.citizen?.email})
                    </p>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="font-medium text-gray-800">{g.district}</p>
                    <p className="text-[11px] text-gray-500 truncate max-w-[150px]">
                      {g.category}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-gray-800 font-medium">
                      {g.department?.name || (
                        <span className="text-amber-600 font-semibold">Unassigned</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <PriorityBadge priority={g.priority} />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={g.status} size="sm" />
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <Link
                      href={`/cmo/grievances/${g.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
