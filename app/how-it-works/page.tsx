import { FileText, ShieldAlert, Building2, SearchCheck, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Citizen Submits Grievance",
      actor: "Citizen / Public",
      color: "border-blue-500 bg-blue-50/50",
      badgeColor: "bg-blue-600 text-white",
      desc: "Citizen registers or logs into the portal, selects their district, enters subject, detailed grievance description, and optional supporting photos/documents. The AI Assistant analyzes the text in real-time, suggests the department, and generates a unique Reference Number (e.g. KL-CMO-2026-881021).",
      status: "Status: SUBMITTED",
    },
    {
      num: "02",
      title: "CMO Administrative Review",
      actor: "Chief Minister's Office Desk",
      color: "border-amber-500 bg-amber-50/50",
      badgeColor: "bg-amber-600 text-white",
      desc: "Authorized CMO administrators review incoming grievances on the central administrative console. The officer reviews the AI executive summary, priority recommendation, checks for duplicate complaints, and forwards the grievance to the competent state department with internal directives.",
      status: "Status: UNDER REVIEW",
    },
    {
      num: "03",
      title: "Department Assignment & Investigation",
      actor: "Department Officer (KWA, PWD, Health, etc.)",
      color: "border-indigo-500 bg-indigo-50/50",
      badgeColor: "bg-indigo-600 text-white",
      desc: "The designated department officer logs into their department desk. The officer inspects the complaint, initiates site inspections or departmental queries, updates the status to 'In Progress', and enters field investigation notes.",
      status: "Status: IN PROGRESS",
    },
    {
      num: "04",
      title: "Action-Taken Report (ATR) Submission",
      actor: "Department Officer → CMO",
      color: "border-purple-500 bg-purple-50/50",
      badgeColor: "bg-purple-600 text-white",
      desc: "Upon completing remedial work (such as repairing a water pipeline, tarring potholes, or supplying hospital medicines), the officer enters a formal Action-Taken Report (ATR) and submits resolution details back to the CMO for scrutiny.",
      status: "Action Taken Submitted",
    },
    {
      num: "05",
      title: "CMO Verification & Resolution",
      actor: "CMO Admin → Citizen",
      color: "border-emerald-500 bg-emerald-50/50",
      badgeColor: "bg-emerald-600 text-white",
      desc: "The CMO reviews the department's action report. If verified satisfactory, the grievance is officially marked 'Resolved'. The citizen receives full visibility of the officer's report and can provide satisfaction ratings and feedback. If not satisfied, the citizen can reopen the complaint.",
      status: "Status: RESOLVED / REOPENED",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Redressal Lifecycle
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900">
          How the Grievance Redressal Process Works
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Every citizen grievance submitted to the Chief Minister&apos;s Office follows a
          standardized, transparent 5-step accountability workflow.
        </p>
      </div>

      {/* Workflow Diagram */}
      <div className="space-y-6">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`border-l-4 ${s.color} rounded-r-2xl p-6 sm:p-8 bg-white border border-gray-200 shadow-sm space-y-3`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${s.badgeColor}`}>
                  STAGE {s.num}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{s.title}</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {s.actor}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            <div className="pt-2 flex items-center justify-between text-xs text-gray-500 font-mono">
              <span className="font-semibold text-emerald-800">{s.status}</span>
              {idx < steps.length - 1 && (
                <span className="text-gray-400">Next Step ↓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center p-8 bg-emerald-900 text-white rounded-3xl space-y-4 shadow-lg">
        <h3 className="text-2xl font-bold">Have a public grievance to report?</h3>
        <p className="text-emerald-100 text-sm max-w-xl mx-auto">
          Submit your complaint directly to the CMO now. It takes less than 2 minutes.
        </p>
        <Link
          href="/citizen/submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition"
        >
          Submit Grievance Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

