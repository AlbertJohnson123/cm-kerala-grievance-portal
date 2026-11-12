"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { formatDate } from "@/lib/utils";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import {
  Shield,
  ArrowLeft,
  Building2,
  Clock,
  CheckCircle,
  FileText,
  User,
  MapPin,
  Sparkles,
  Send,
  AlertTriangle,
} from "lucide-react";

export default function CMOGrievanceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [grievance, setGrievance] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedDept, setSelectedDept] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [adminRemarks, setAdminRemarks] = useState("");
  const [remarksHistory, setRemarksHistory] = useState("");
  const [priority, setPriority] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const role = (session.user as any)?.role;
      if (role !== "CMO_ADMIN") {
        router.push("/");
        return;
      }
      loadGrievanceAndDepts();
    }
  }, [status, session, router, params.id]);

  async function loadGrievanceAndDepts() {
    try {
      const [gRes, dRes] = await Promise.all([
        fetch(`/api/grievances/${params.id}`),
        fetch("/api/departments"),
      ]);
      if (gRes.ok) {
        const gData = await gRes.json();
        setGrievance(gData);
        setSelectedDept(gData.departmentId || "");
        setNewStatus(gData.status);
        setPriority(gData.priority);
        setAdminRemarks(gData.adminRemarks || "");
      }
      if (dRes.ok) {
        setDepartments(await dRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/grievances/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentId: selectedDept || null,
          status: newStatus,
          priority,
          adminRemarks,
          remarks: remarksHistory || `CMO updated status to ${newStatus}`,
          changedById: (session?.user as any).id,
        }),
      });

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || "Update failed");

      toast.success("Grievance records and department assignment updated!");
      setRemarksHistory("");
      loadGrievanceAndDepts();
    } catch (err: any) {
      toast.error(err.message || "Failed to update grievance");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading grievance details...
      </div>
    );
  }

  if (!grievance) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Grievance not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/cmo/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CMO Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={grievance.status} size="lg" />
          <PriorityBadge priority={grievance.priority} />
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details, Citizen, AI, History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {grievance.referenceNumber}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 pt-1">
                {grievance.subject}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {grievance.district}
                </span>
                <span>•</span>
                <span>{grievance.category}</span>
                <span>•</span>
                <span>Filed {formatDate(grievance.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase">
                Citizen Grievance Description
              </h4>
              <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {grievance.description}
              </p>
            </div>

            {/* Citizen Details */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold">
                  {grievance.citizen?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{grievance.citizen?.name}</p>
                  <p className="text-gray-500">{grievance.citizen?.email}</p>
                </div>
              </div>
              <div className="text-right text-gray-500">
                <span>Mobile: {grievance.citizen?.mobile || "Not specified"}</span>
              </div>
            </div>
          </div>

          {/* AI Grievance Assistant Intelligence Box */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">AI Grievance Assistant Intelligence</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-white/10 px-2 py-0.5 rounded">
                ADVISORY
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-emerald-300 font-medium">AI Suggested Dept:</span>
                  <p className="font-bold text-white text-sm mt-0.5">
                    {grievance.aiSuggestedDept || "Water Resources Department"}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-emerald-300 font-medium">Recommended Priority:</span>
                  <p className="font-bold text-amber-300 text-sm mt-0.5">
                    {grievance.aiSuggestedPriority || "HIGH"}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl space-y-1">
                <span className="text-emerald-300 font-medium">
                  Executive Brief for Chief Minister&apos;s Review:
                </span>
                <p className="text-emerald-100 leading-relaxed">
                  {grievance.aiSummary ||
                    "Citizen reports significant disruption requiring immediate department remediation."}
                </p>
              </div>

              {grievance.isDuplicate && (
                <div className="bg-amber-500/20 border border-amber-400/40 p-3 rounded-xl text-amber-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Flagged as potential duplicate by semantic clustering.</span>
                </div>
              )}
            </div>
          </div>

          {/* Department Action Taken Reports */}
          {grievance.assignments && grievance.assignments.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                Department Action-Taken Reports (ATR)
              </h3>
              <div className="space-y-3">
                {grievance.assignments.map((a: any) => (
                  <div key={a.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-900">{a.department?.name}</span>
                      <span className="text-gray-400 font-mono">{formatDate(a.updatedAt)}</span>
                    </div>
                    <p className="text-xs text-gray-700 font-mono bg-white p-3 rounded-lg border border-gray-100">
                      {a.actionReport || "Investigation initiated by department."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chronological Audit Timeline */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              Traceable Lifecycle Audit History
            </h3>
            <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {grievance.history?.map((h: any) => (
                <div key={h.id} className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-white border-2 border-emerald-800"></div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={h.status} size="sm" />
                      <span className="text-xs text-gray-400 font-mono">
                        {formatDate(h.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Changed by: <strong>{h.changedBy?.name}</strong> ({h.changedBy?.role})
                    </p>
                    {h.remarks && (
                      <p className="text-xs text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-1">
                        {h.remarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: CMO Action Controls Form */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              CMO Action &amp; Routing Panel
            </h3>
            <p className="text-xs text-gray-500">
              Forward to state department, add administrative directives, or update status.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Assign Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Assign / Forward to Department *
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="">-- Select State Department --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Update Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Update Grievance Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="REOPENED">REOPENED</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Priority Classification
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["LOW", "MEDIUM", "HIGH"].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl border text-xs font-bold transition ${
                      priority === p
                        ? p === "HIGH"
                          ? "bg-red-50 border-red-500 text-red-700"
                          : p === "MEDIUM"
                          ? "bg-amber-50 border-amber-500 text-amber-700"
                          : "bg-slate-100 border-slate-400 text-slate-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* CMO Administrative Directive / Remarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                CMO Official Remarks (Visible to Citizen &amp; Department)
              </label>
              <textarea
                rows={3}
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Enter Chief Minister's Office directives or escalation remarks..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              ></textarea>
            </div>

            {/* Action History Log Remarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Log Reason for Status Change (Audit Trail)
              </label>
              <input
                type="text"
                value={remarksHistory}
                onChange={(e) => setRemarksHistory(e.target.value)}
                placeholder="e.g. Forwarded with high priority to KWA Executive Engineer"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {saving ? (
                "Saving changes..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Save Changes &amp; Forward
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
