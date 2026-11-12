"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { formatDate } from "@/lib/utils";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import {
  Briefcase,
  ArrowLeft,
  Clock,
  CheckCircle,
  FileText,
  User,
  MapPin,
  Send,
  Building2,
  FileCheck,
} from "lucide-react";

export default function OfficerGrievanceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [grievance, setGrievance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newStatus, setNewStatus] = useState("IN_PROGRESS");
  const [investigationRemarks, setInvestigationRemarks] = useState("");
  const [actionReport, setActionReport] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const role = (session.user as any)?.role;
      if (role !== "DEPT_OFFICER" && role !== "CMO_ADMIN") {
        router.push("/");
        return;
      }
      loadGrievance();
    }
  }, [status, session, router, params.id]);

  async function loadGrievance() {
    try {
      const res = await fetch(`/api/grievances/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setGrievance(data);
        setNewStatus(data.status);
        if (data.assignments && data.assignments.length > 0) {
          setActionReport(data.assignments[0].actionReport || "");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReport(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/grievances/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          remarks:
            investigationRemarks ||
            `Department Officer submitted Action-Taken update (Status: ${newStatus})`,
          actionReport,
          departmentId: grievance.departmentId,
          changedById: (session?.user as any).id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("Action-Taken Report and status submitted to CMO!");
      setInvestigationRemarks("");
      loadGrievance();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit report");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading complaint details...
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
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/officer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:text-blue-950"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Officer Desk
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={grievance.status} size="lg" />
          <PriorityBadge priority={grievance.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Complaint Details & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {grievance.referenceNumber}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 pt-1">
                {grievance.subject}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {grievance.district} District
                </span>
                <span>•</span>
                <span>Category: {grievance.category}</span>
                <span>•</span>
                <span>Filed on {formatDate(grievance.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase">
                Citizen Grievance Description
              </h4>
              <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 font-mono text-xs">
                {grievance.description}
              </p>
            </div>

            {/* CMO Directives if any */}
            {grievance.adminRemarks && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1 text-xs">
                <span className="font-bold text-amber-900 uppercase">
                  Chief Minister&apos;s Office Directive:
                </span>
                <p className="text-amber-950 font-medium">{grievance.adminRemarks}</p>
              </div>
            )}

            {/* Citizen Details */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-slate-700 uppercase">Citizen Contact:</span>
              <p className="font-semibold text-gray-900">{grievance.citizen?.name}</p>
              <p className="text-gray-500">
                Email: {grievance.citizen?.email} • Mobile: {grievance.citizen?.mobile || "N/A"}
              </p>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-700" />
              Progress Audit History
            </h3>
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {grievance.history?.map((h: any) => (
                <div key={h.id} className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white border-2 border-blue-800"></div>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={h.status} size="sm" />
                      <span className="text-gray-400 font-mono">{formatDate(h.createdAt)}</span>
                    </div>
                    <p className="text-gray-600">by {h.changedBy?.name}</p>
                    {h.remarks && (
                      <p className="text-gray-800 bg-gray-50 p-2 rounded border border-gray-100 mt-1">
                        {h.remarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Action-Taken Report Form */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-700" />
              Action-Taken Report (ATR)
            </h3>
            <p className="text-xs text-gray-500">
              Submit your investigation findings and resolution details directly to CMO.
            </p>
          </div>

          <form onSubmit={handleSubmitReport} className="space-y-5">
            {/* Status Update */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Update Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="IN_PROGRESS">IN_PROGRESS (Under Field Investigation)</option>
                <option value="RESOLVED">RESOLVED (Remedial Action Completed)</option>
              </select>
            </div>

            {/* Action Taken Report */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Formal Action-Taken Report (ATR) *
                </label>
                <span className="text-[10px] text-gray-400">Reviewed by CMO</span>
              </div>
              <textarea
                required
                rows={5}
                value={actionReport}
                onChange={(e) => setActionReport(e.target.value)}
                placeholder="Detail the remedial actions taken: e.g. Pipeline repaired by KWA maintenance team at Kazhakkoottam. Pressure tested successfully and regular water supply restored on 11 Nov 2026."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed font-mono"
              ></textarea>
            </div>

            {/* Investigation Remarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Officer Notes / Remarks for History Log
              </label>
              <input
                type="text"
                value={investigationRemarks}
                onChange={(e) => setInvestigationRemarks(e.target.value)}
                placeholder="e.g. Site inspection conducted by Assistant Engineer; work concluded."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {saving ? (
                "Submitting Report..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Action-Taken Report to CMO
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

