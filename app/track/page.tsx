"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Clock, Building2, MapPin, CheckCircle, AlertCircle, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [refInput, setRefInput] = useState(initialRef);
  const [grievance, setGrievance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchGrievance(refToSearch: string) {
    if (!refToSearch.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await fetch(`/api/grievances?ref=${encodeURIComponent(refToSearch.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setGrievance(null);
        setError(data.error || "Grievance not found");
      } else {
        setGrievance(data);
      }
    } catch (err: any) {
      setError("Network error while searching grievance");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialRef) {
      setRefInput(initialRef);
      fetchGrievance(initialRef);
    }
  }, [initialRef]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchGrievance(refInput);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Citizen Transparency Portal
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Track Grievance Status
        </h1>
        <p className="text-base text-gray-600 max-w-xl mx-auto">
          Enter your reference number to view real-time status, department assignment,
          and complete chronological progress.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              required
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="e.g. KL-CMO-2026-881021"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-base font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? "Searching..." : "Track Grievance"}
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500 items-center">
          <span className="font-semibold text-gray-700">Sample Reference IDs to test:</span>
          {["KL-CMO-2026-881021", "KL-CMO-2026-541982", "KL-CMO-2026-319084"].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setRefInput(sample);
                fetchGrievance(sample);
              }}
              className="font-mono text-emerald-700 hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-900 text-sm">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <p className="font-bold">No Record Found</p>
            <p className="text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Result state */}
      {grievance && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-gray-500">REFERENCE NUMBER:</span>
                  <span className="text-base font-mono font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {grievance.referenceNumber}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-1">
                  {grievance.subject}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {grievance.district} District
                  </span>
                  <span>•</span>
                  <span>Category: {grievance.category}</span>
                  <span>•</span>
                  <span>Submitted on: {formatDate(grievance.createdAt)}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={grievance.status} size="lg" />
                <PriorityBadge priority={grievance.priority} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Grievance Description
              </h4>
              <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {grievance.description}
              </p>
            </div>

            {/* AI Summary and Assigned Dept */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-emerald-50/60 border border-emerald-200/80 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  Assigned Kerala Department
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {grievance.department?.name || grievance.aiSuggestedDept || "Pending CMO Assignment"}
                </div>
                {grievance.department?.code && (
                  <span className="text-[11px] font-mono text-emerald-800">
                    Dept Code: {grievance.department.code}
                  </span>
                )}
              </div>

              <div className="bg-indigo-50/60 border border-indigo-200/80 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  AI Grievance Assistant Executive Summary
                </div>
                <p className="text-xs text-indigo-950 leading-relaxed">
                  {grievance.aiSummary || "Automated semantic summary generated for CMO review."}
                </p>
              </div>
            </div>

            {/* CMO Remarks if any */}
            {grievance.adminRemarks && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Chief Minister&apos;s Office Directive / Remarks:
                </span>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {grievance.adminRemarks}
                </p>
              </div>
            )}
          </div>

          {/* Chronological Lifecycle Timeline */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                Traceable Audit Timeline
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                {grievance.history?.length || 0} Events Recorded
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {grievance.history?.map((hist: any, index: number) => (
                <div key={hist.id || index} className="relative group">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-white border-2 border-emerald-800"></div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={hist.status} size="sm" />
                      <span className="text-xs text-gray-400 font-mono">
                        {formatDate(hist.createdAt)}
                      </span>
                      {hist.changedBy && (
                        <span className="text-xs text-gray-500 font-medium">
                          by {hist.changedBy.name} ({hist.changedBy.role})
                        </span>
                      )}
                    </div>
                    {hist.remarks && (
                      <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-1">
                        {hist.remarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Action Taken Reports */}
          {grievance.assignments && grievance.assignments.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                Department Action-Taken Reports (ATR)
              </h3>
              <div className="space-y-3">
                {grievance.assignments.map((assign: any) => (
                  <div key={assign.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{assign.department.name}</span>
                      <span className="text-slate-500 font-mono">{formatDate(assign.updatedAt)}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-mono">
                      {assign.actionReport || "Action in progress by field engineering team."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citizen Feedback if available */}
          {grievance.feedback && grievance.feedback.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900">
                Citizen Feedback &amp; Rating
              </h3>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: grievance.feedback[0].rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  <span className="text-xs text-emerald-950 font-semibold ml-2">
                    {grievance.feedback[0].rating} / 5 Stars
                  </span>
                </div>
                {grievance.feedback[0].comment && (
                  <p className="text-xs text-emerald-950 italic">
                    &ldquo;{grievance.feedback[0].comment}&rdquo;
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading tracking portal...</div>}>
      <TrackContent />
    </Suspense>
  );
}
