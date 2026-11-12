"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  KERALA_DISTRICTS,
  GRIEVANCE_CATEGORIES,
} from "@/lib/utils";
import {
  Sparkles,
  ShieldAlert,
  Send,
  Building2,
  FileCheck,
  AlertTriangle,
  Upload,
  CheckCircle2,
  ArrowRight,
  Info,
} from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";

export default function SubmitGrievancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [district, setDistrict] = useState("Thiruvananthapuram");
  const [category, setCategory] = useState("Water Supply & Sanitation");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [fileName, setFileName] = useState("");

  // AI analysis state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  async function handleAIAnalyze() {
    if (!subject.trim() || !description.trim()) {
      toast.error("Please enter both Subject and Description before running AI analysis.");
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description, district }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAiSuggestion(data);
      toast.success("AI Assistant analyzed your grievance!");
    } catch (err: any) {
      toast.error(err.message || "AI Analysis failed");
    } finally {
      setAiLoading(false);
    }
  }

  function applyAISuggestions() {
    if (!aiSuggestion) return;
    if (aiSuggestion.suggestedCategory) setCategory(aiSuggestion.suggestedCategory);
    if (aiSuggestion.suggestedPriority) setPriority(aiSuggestion.suggestedPriority);
    toast.success("Applied AI recommendations to the form!");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (status !== "authenticated") {
      toast.error("Please sign in or register to submit a grievance.");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId: (session?.user as any)?.id,
          district,
          category,
          subject,
          description,
          priority,
          aiSuggestedDept: aiSuggestion?.suggestedDept,
          aiSuggestedCategory: aiSuggestion?.suggestedCategory,
          aiSuggestedPriority: aiSuggestion?.suggestedPriority,
          aiSummary: aiSuggestion?.summary,
          isDuplicate: aiSuggestion?.isDuplicate || false,
          attachmentName: fileName || null,
          attachmentUrl: fileName ? `/uploads/${fileName}` : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSubmittedRef(data.referenceNumber);
      toast.success("Grievance registered successfully with the CMO!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit grievance");
    } finally {
      setSubmitting(false);
    }
  }

  // Success view with Reference ID
  if (submittedRef) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Grievance Submitted Successfully!
          </h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Your grievance has been lodged directly with the Chief Minister&apos;s Office
            (CMO) for administrative review.
          </p>
        </div>

        <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-3xl max-w-md mx-auto space-y-2">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest">
            Your Unique Grievance Reference ID:
          </span>
          <div className="text-2xl font-black font-mono text-emerald-950 tracking-wider">
            {submittedRef}
          </div>
          <p className="text-[11px] text-emerald-700">
            Please save this reference number to track investigation progress anytime.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Link
            href={`/track?ref=${encodeURIComponent(submittedRef)}`}
            className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
          >
            Track Grievance Live <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/citizen/dashboard"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <span>Kerala CMO Citizen Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Submit Public Grievance
        </h1>
        <p className="text-xs text-gray-500 max-w-xl">
          Report issues regarding public infrastructure, drinking water, healthcare,
          education, agriculture, or civic administration directly to the Chief Minister.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Grievance Form */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* District */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Select District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d} District
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Grievance Category *
                </label>
                {aiSuggestion?.suggestedCategory && (
                  <span className="text-[11px] text-emerald-700 font-medium">
                    AI Suggestion: {aiSuggestion.suggestedCategory}
                  </span>
                )}
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {GRIEVANCE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Grievance Subject / Title *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Drinking water pipeline broken in Ward 7 for 5 days"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Detailed Description *
                </label>
                <span className="text-[11px] text-gray-400">
                  Be specific about location, duration &amp; impact
                </span>
              </div>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide comprehensive details: exact landmark, number of affected families or commuters, previous representations made to local office, etc."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
              ></textarea>
            </div>

            {/* AI Assistant Trigger Button */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  AI Grievance Assistant
                </div>
                <p className="text-[11px] text-emerald-800">
                  Analyze your text to auto-classify department, category &amp; priority.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAIAnalyze}
                disabled={aiLoading}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {aiLoading ? "Analyzing..." : "Run AI Analysis"}
              </button>
            </div>

            {/* Priority Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["LOW", "MEDIUM", "HIGH"].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
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

            {/* Optional File Attachment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Supporting Photo / Document (Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition">
                  <Upload className="w-4 h-4 text-gray-500" />
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e: any) => {
                      if (e.target.files?.[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
                <span className="text-xs text-gray-500 font-mono truncate max-w-xs">
                  {fileName || "No document selected"}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                "Submitting to CMO..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Grievance to Chief Minister
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Recommendations Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-gray-900 text-base">
                  AI Grievance Assistant
                </h3>
              </div>
              {aiSuggestion && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  ANALYZED
                </span>
              )}
            </div>

            {!aiSuggestion ? (
              <div className="py-8 text-center space-y-2">
                <Info className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                  Type your grievance subject &amp; description on the left, then click
                  <strong> &ldquo;Run AI Analysis&rdquo;</strong> to preview intelligent recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                {/* Duplicate Alert if flagged */}
                {aiSuggestion.isDuplicate && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2 text-amber-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Potential Duplicate Alert:</span> A similar
                      grievance exists in this district{" "}
                      {aiSuggestion.duplicateReference && (
                        <span className="font-mono font-bold">
                          ({aiSuggestion.duplicateReference})
                        </span>
                      )}. CMO will review both.
                    </div>
                  </div>
                )}

                {/* Suggested Department */}
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">
                    Suggested Department:
                  </span>
                  <div className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    {aiSuggestion.suggestedDept}
                  </div>
                </div>

                {/* Suggested Category & Priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase">
                      Category:
                    </span>
                    <div className="text-xs font-bold text-gray-900 truncate">
                      {aiSuggestion.suggestedCategory}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase">
                      Priority:
                    </span>
                    <div>
                      <PriorityBadge priority={aiSuggestion.suggestedPriority} />
                    </div>
                  </div>
                </div>

                {/* AI Executive Summary */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold text-emerald-900 uppercase">
                    Executive Summary for CMO Desk:
                  </span>
                  <p className="text-xs text-emerald-950 leading-relaxed italic">
                    &ldquo;{aiSuggestion.summary}&rdquo;
                  </p>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={applyAISuggestions}
                  className="w-full py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  Accept &amp; Apply AI Suggestions
                </button>

                <p className="text-[10px] text-gray-400 text-center leading-tight">
                  Source: {aiSuggestion.source || "Google Gemini / NLP Semantic Engine"}.
                  All AI recommendations are advisory and verified by human officers.
                </p>
              </div>
            )}
          </div>

          {/* Citizen Charter Quick Info */}
          <div className="p-5 bg-slate-900 text-slate-300 rounded-3xl text-xs space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">
              Citizen Service Guarantee
            </h4>
            <p className="leading-relaxed text-slate-400">
              Grievances submitted to the CMO are acknowledged with an official reference ID
              within seconds. High priority issues involving drinking water, public safety,
              and healthcare are forwarded to departments within 24 working hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
