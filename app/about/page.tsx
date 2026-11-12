import { Shield, Target, Eye, Award, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          About the Initiative
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Chief Minister&apos;s Public Grievance Redressal Portal
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          An empowering democratic bridge directly connecting the citizens of Kerala with
          the Chief Minister&apos;s Office to ensure responsive, timely, and accountable
          governance across all 14 districts.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 space-y-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-700/60 flex items-center justify-center">
            <Eye className="w-6 h-6 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-bold">Our Vision</h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            To build a modern, corruption-free, and digitally accessible public service delivery
            framework where every citizen&apos;s concern is heard with empathy and addressed
            with administrative speed and transparency.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Target className="w-6 h-6 text-emerald-800" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            To eliminate bureaucratic red tape, provide real-time grievance traceability to citizens,
            empower the Chief Minister&apos;s Office with actionable administrative analytics, and
            hold government departments accountable through binding action-taken reports.
          </p>
        </div>
      </div>

      {/* Key Objectives */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 text-center">
          Core Objectives of the Portal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Direct Citizen Access",
              desc: "Citizens anywhere in Kerala or abroad can register complaints online 24/7 without physically visiting government secretariats.",
            },
            {
              title: "AI-Powered Dispatch",
              desc: "Immediate intelligent categorization and routing of grievances to appropriate department officers without manual administrative delays.",
            },
            {
              title: "Transparent Lifecycle",
              desc: "End-to-end timestamped audit trail from submission to CMO review, field investigation, and official resolution.",
            },
            {
              title: "Citizen Feedback Loop",
              desc: "Empowering citizens to rate resolutions and reopen grievances if their issue remains unresolved on the ground.",
            },
            {
              title: "CMO Executive Dashboard",
              desc: "Actionable district-wise and department-wise intelligence allowing the Chief Minister to identify recurring bottlenecks.",
            },
            {
              title: "Equal Priority for Vulnerable",
              desc: "Special prioritization algorithm for emergency public health, contaminated drinking water, student safety, and farmer distress.",
            },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                <h4 className="font-bold text-gray-900 text-base">{item.title}</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pl-7">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

