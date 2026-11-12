import Link from "next/link";
import { Shield, Phone, Mail, MapPin, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About Portal */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-base font-serif">
                KL
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                CM Kerala Grievance Cell
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Official online public redressal portal providing transparent, direct,
              and accountable resolution of citizen grievances under the leadership of
              the Chief Minister of Kerala.
            </p>
            <div className="pt-2 text-xs text-amber-400 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/40">
              ⚠️ <strong>Recruitment Prototype Notice:</strong> Developed for the
              WhiteMatrix Software Solutions Machine Test. Fictional data used for
              evaluation.
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/citizen/submit" className="hover:text-emerald-400 transition-colors">
                  Submit New Grievance
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-emerald-400 transition-colors">
                  Track Grievance Status
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  Grievance Redressal Process
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-emerald-400 transition-colors">
                  Participating Departments
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Administrative Desks */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Administration
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  CMO Administrator Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Department Officer Desk
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  Citizen Charter &amp; SLAs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Public Relations Officer (PRO)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact CMO */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Chief Minister&apos;s Office
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  Secretariat, North Block, Thiruvananthapuram, Kerala – 695001
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1076 (Statewide Toll-Free)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>chiefminister@kerala.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} Chief Minister&apos;s Public Grievance Redressal
            Portal. All Rights Reserved.
          </p>
          <p className="flex items-center space-x-1">
            <span>Powered by Next.js, Prisma, Tailwind &amp; AI Assistant</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
