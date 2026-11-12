"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  CheckCircle,
  Clock,
  Building2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Users,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { STATUS_MAP } from "@/lib/utils";

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, deptRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/departments"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (deptRes.ok) setDepartments(await deptRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Direct Redressal Channel to the Chief Minister
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              A Transparent Kerala, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                Listening to Every Citizen.
              </span>
            </h1>
            <p className="text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
              Submit your grievances directly to the Chief Minister&apos;s Office (CMO).
              Powered by real-time tracking, AI-assisted routing, and accountable department
              action taken reports.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/citizen/submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5" />
                Submit Grievance
              </Link>
              <Link
                href="/track"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base backdrop-blur-sm flex items-center gap-2 transition-all"
              >
                <Search className="w-5 h-5 text-emerald-300" />
                Track Status by Reference ID
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-5">
            <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Live Grievance Redressal Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="text-2xl font-black text-white">
                  {stats ? stats.total : "10"}
                </div>
                <div className="text-xs text-emerald-200 mt-1">Total Received</div>
              </div>
              <div className="bg-emerald-500/20 border border-emerald-400/30 p-4 rounded-xl">
                <div className="text-2xl font-black text-emerald-300">
                  {stats ? stats.resolved : "2"}
                </div>
                <div className="text-xs text-emerald-200 mt-1">Resolved</div>
              </div>
              <div className="bg-indigo-500/20 border border-indigo-400/30 p-4 rounded-xl">
                <div className="text-2xl font-black text-indigo-200">
                  {stats ? stats.inProgress : "4"}
                </div>
                <div className="text-xs text-indigo-200 mt-1">Under Investigation</div>
              </div>
              <div className="bg-amber-500/20 border border-amber-400/30 p-4 rounded-xl">
                <div className="text-2xl font-black text-amber-300">
                  {stats ? stats.underReview : "2"}
                </div>
                <div className="text-xs text-amber-200 mt-1">CMO Review</div>
              </div>
            </div>
            <p className="text-[11px] text-emerald-200/70 italic text-center">
              Statewide grievances updated in real time from Secretariat database
            </p>
          </div>
        </div>
      </section>

      {/* Quick Track Search Banner */}
      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-bold text-gray-900">
              Already filed a grievance?
            </h3>
            <p className="text-sm text-gray-500">
              Enter your reference number (e.g. KL-CMO-2026-881021) to check live status.
            </p>
          </div>
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              const ref = e.target.elements.ref.value.trim();
              if (ref) window.location.href = `/track?ref=${encodeURIComponent(ref)}`;
            }}
            className="flex w-full md:w-auto items-center gap-2"
          >
            <input
              type="text"
              name="ref"
              required
              placeholder="e.g. KL-CMO-2026-881021"
              className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 uppercase font-mono w-full md:w-64"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-semibold whitespace-nowrap shadow-sm"
            >
              Track Now
            </button>
          </form>
        </div>
      </section>

      {/* 5-Step Grievance Redressal Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Mandatory Lifecycle
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900">
            How Your Grievance Is Resolved
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            A transparent 5-stage lifecycle ensuring every complaint receives accountable
            monitoring from registration to resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Citizen Submits",
              desc: "File grievance with details. System assigns unique reference number & AI assistant suggests routing.",
              icon: FileText,
            },
            {
              step: "02",
              title: "CMO Review",
              desc: "Chief Minister's Office desk reviews severity, approves AI classification, and adds internal directives.",
              icon: ShieldCheck,
            },
            {
              step: "03",
              title: "Dept Assignment",
              desc: "Grievance is routed to the designated executive engineer, DMO, or department officer.",
              icon: Building2,
            },
            {
              step: "04",
              title: "Investigation",
              desc: "Officer conducts ground inspection, updates status, and enters an Action-Taken Report (ATR).",
              icon: Clock,
            },
            {
              step: "05",
              title: "CMO Redressal",
              desc: "CMO reviews department resolution, citizen receives update, and can reopen or leave rating feedback.",
              icon: CheckCircle,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-emerald-700 font-mono">
                  {item.step}
                </span>
                <h4 className="text-base font-bold text-gray-900 mt-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="pt-2 text-emerald-800 flex justify-end">
                <item.icon className="w-5 h-5 opacity-70" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Grievance Assistant Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/50 text-emerald-200 text-xs font-semibold">
              <Cpu className="w-4 h-4 text-emerald-300" />
              Intelligent Grievance Processing
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Powered by AI Grievance Assistant
            </h3>
            <p className="text-emerald-100 text-sm leading-relaxed max-w-2xl">
              As soon as a citizen types their grievance description, our AI assistant
              analyzes the text to automatically suggest the most appropriate Kerala
              government department, grievance category, and priority level, and generates
              a concise executive summary for CMO administrators.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-xs text-emerald-300 font-medium">Auto-Categorize</div>
                <div className="text-sm font-bold text-white mt-1">13 Categories</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-xs text-emerald-300 font-medium">Smart Routing</div>
                <div className="text-sm font-bold text-white mt-1">10 Departments</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-xs text-emerald-300 font-medium">Priority Scoring</div>
                <div className="text-sm font-bold text-white mt-1">High/Med/Low</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-xs text-emerald-300 font-medium">Duplicate Filter</div>
                <div className="text-sm font-bold text-white mt-1">Semantic Check</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <Link
              href="/citizen/submit"
              className="px-6 py-4 rounded-xl bg-white text-emerald-950 font-bold text-sm shadow-lg hover:bg-emerald-50 transition transform hover:scale-105"
            >
              Try AI Grievance Submission →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Departments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Government Infrastructure
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
              Participating Departments
            </h2>
          </div>
          <Link
            href="/departments"
            className="text-sm font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
          >
            View all 10 departments <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.slice(0, 6).map((dept) => (
            <div
              key={dept.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold font-mono rounded-lg border border-emerald-100">
                  {dept.code}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {dept._count?.grievances || 0} Grievances
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900">{dept.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {dept.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
