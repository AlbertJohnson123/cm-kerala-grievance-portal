"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import { FileText, PlusCircle, Search, Clock, CheckCircle, AlertCircle, Star } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CitizenDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalGrievance, setFeedbackModalGrievance] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const citizenId = (session.user as any).id;
      fetch(`/api/grievances?citizenId=${citizenId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setGrievances(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, session, router]);

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feedbackModalGrievance) return;
    setSubmittingFeedback(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grievanceId: feedbackModalGrievance.id,
          citizenId: (session?.user as any).id,
          rating,
          comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Feedback submitted! Thank you for rating the redressal.");
      setFeedbackModalGrievance(null);
      setComment("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading citizen dashboard...
      </div>
    );
  }

  const resolvedCount = grievances.filter((g) => g.status === "RESOLVED").length;
  const pendingCount = grievances.filter((g) => g.status !== "RESOLVED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Citizen Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Welcome, {session?.user?.name}
          </h1>
          <p className="text-xs text-gray-500">
            Manage your submitted grievances, monitor live investigation updates, and rate resolutions.
          </p>
        </div>
        <Link
          href="/citizen/submit"
          className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-sm flex items-center gap-2 transition"
        >
          <PlusCircle className="w-4 h-4" />
          Submit New Grievance
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Total Grievances</span>
            <FileText className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-black text-gray-900">{grievances.length}</div>
          <div className="text-xs text-gray-500">Submitted under your account</div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Pending Redressal</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
          <div className="text-xs text-gray-500">Under review or investigation</div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Resolved Grievances</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{resolvedCount}</div>
          <div className="text-xs text-gray-500">Action taken reports approved</div>
        </div>
      </div>

      {/* Grievances List */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900">Your Grievances History</h2>
          <span className="text-xs text-gray-500 font-mono">
            {grievances.length} Records Found
          </span>
        </div>

        {grievances.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm text-gray-500">
              You haven&apos;t submitted any grievances yet.
            </p>
            <Link
              href="/citizen/submit"
              className="inline-block px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
            >
              Submit your first grievance
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {grievances.map((g) => (
              <div
                key={g.id}
                className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/80 rounded-xl px-3 transition"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {g.referenceNumber}
                    </span>
                    <StatusBadge status={g.status} size="sm" />
                    <PriorityBadge priority={g.priority} />
                    <span className="text-xs text-gray-400 font-mono">
                      {formatDate(g.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    {g.subject}
                  </h3>
                  <div className="text-xs text-gray-500 flex flex-wrap items-center gap-3">
                    <span>District: {g.district}</span>
                    <span>•</span>
                    <span>Category: {g.category}</span>
                    <span>•</span>
                    <span>
                      Dept: {g.department?.name || g.aiSuggestedDept || "Pending Assignment"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/track?ref=${encodeURIComponent(g.referenceNumber)}`}
                    className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1 transition"
                  >
                    <Search className="w-3.5 h-3.5" />
                    View Timeline
                  </Link>

                  {g.status === "RESOLVED" && (
                    <button
                      type="button"
                      onClick={() => setFeedbackModalGrievance(g)}
                      className="px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1 transition"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Citizen Feedback Modal */}
      {feedbackModalGrievance && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scaleIn">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {feedbackModalGrievance.referenceNumber}
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                Rate Grievance Resolution
              </h3>
              <p className="text-xs text-gray-500">
                Your feedback helps the Chief Minister&apos;s Office measure departmental efficiency.
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 uppercase">
                  Satisfaction Rating (1 to 5 Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-2 text-2xl transition hover:scale-110"
                    >
                      <span className={star <= rating ? "text-amber-400" : "text-gray-300"}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase">
                  Comments / Remarks (Optional)
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How satisfied are you with the solution provided by the department?"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalGrievance(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-sm font-semibold shadow-sm"
                >
                  {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
