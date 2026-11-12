"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is the Chief Minister's Public Grievance Redressal Portal?",
      a: "It is an integrated digital platform established by the Government of Kerala to enable citizens across all 14 districts (and NRKs) to submit public grievances directly to the Chief Minister's Office (CMO), track progress in real-time, and hold state departments accountable.",
    },
    {
      q: "How does the unique Reference Number work?",
      a: "Upon successful submission of any grievance, the system generates a unique Reference Number (e.g., KL-CMO-2026-881021). You can use this ID on the public 'Track Grievance' page at any time without logging in to see the current status and full investigation history.",
    },
    {
      q: "How does the AI Grievance Assistant help me?",
      a: "When you type your complaint description, our AI assistant automatically analyzes your text to suggest the most appropriate Kerala government department (e.g. Water Resources, PWD, Health), categorizes the problem, suggests an initial priority level, and drafts a concise executive summary for CMO review. You can review and edit these suggestions before final submission.",
    },
    {
      q: "Does AI make official decisions on my grievance?",
      a: "No. In accordance with government policy and ethical guidelines, AI suggestions are strictly advisory and assist in routing. Official decisions and assignments are always reviewed and confirmed by authorized human CMO administrators and department nodal officers.",
    },
    {
      q: "What are the different grievance statuses and what do they mean?",
      a: "There are 5 official statuses: 1) Submitted - Grievance received by system; 2) Under Review - CMO administrative team reviewing details; 3) In Progress - Assigned department officer actively investigating; 4) Resolved - Department completed work and submitted an approved Action-Taken Report; 5) Reopened - Citizen requested further review if unsatisfied.",
    },
    {
      q: "What kind of issues can I submit on this portal?",
      a: "You can submit grievances regarding drinking water supply disruptions, damaged roads/potholes, hospital medicine shortages, school building safety, power outages, farmer paddy procurement delays, land mutation/patta issues, public safety, and public transport routes.",
    },
    {
      q: "What types of matters are NOT covered under this portal?",
      a: "Sub-judice matters (cases pending before courts), RTI applications, commercial business disputes, and anonymous allegations without verifiable facts cannot be entertained through this portal.",
    },
    {
      q: "Can I provide feedback after my grievance is resolved?",
      a: "Yes. Once your grievance reaches 'Resolved' status, the citizen portal allows you to rate the resolution quality (from 1 to 5 stars) and submit remarks. If the problem has not been solved on the ground, you can request to reopen the case.",
    },
    {
      q: "Is there any fee for submitting or tracking a grievance?",
      a: "No. The Chief Minister's Grievance Redressal Portal is a 100% free public service provided by the Government of Kerala to all citizens.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Help &amp; Support
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-gray-600">
          Everything you need to know about registering, tracking, and resolving grievances.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-semibold text-gray-900 hover:bg-gray-50 transition"
              >
                <span className="text-base">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-emerald-700 shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4">
        <h3 className="text-lg font-bold text-emerald-950">
          Still have questions or need assistance?
        </h3>
        <p className="text-sm text-emerald-800 max-w-md mx-auto">
          Contact our 24x7 toll-free citizen helpline at 1076 or send an enquiry directly.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-sm transition"
        >
          Contact Support Desk <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
