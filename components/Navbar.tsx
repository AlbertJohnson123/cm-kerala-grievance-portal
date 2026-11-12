"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  FileText,
  Search,
  Building2,
  HelpCircle,
  Phone,
  Info,
  LogOut,
  User,
  Shield,
  Briefcase,
  Menu,
  X,
  Home,
} from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = (session?.user as any)?.role;

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-emerald-800/10 shadow-sm">
      {/* Top Govt of Kerala banner bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium tracking-wide">
              GOVERNMENT OF KERALA | CHIEF MINISTER&apos;S OFFICE
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-emerald-300">
            <span>Toll-Free Helpline: 1076 / 1800-425-4949</span>
            <span>•</span>
            <span className="text-amber-300 font-semibold">Recruitment Prototype</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Portal Title */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              <span className="text-amber-300 font-serif">KL</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg leading-tight flex items-center gap-1.5">
                CM Kerala Grievance Redressal
              </div>
              <div className="text-xs text-emerald-800 font-medium tracking-wide">
                Chief Minister&apos;s Public Redressal Portal
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-gray-700 hover:text-emerald-800 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
            <Link
              href="/track"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive("/track")
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-gray-700 hover:text-emerald-800 hover:bg-gray-50"
              }`}
            >
              <Search className="w-4 h-4 text-emerald-600" />
              Track Grievance
            </Link>
            <Link
              href="/how-it-works"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/how-it-works")
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-gray-700 hover:text-emerald-800 hover:bg-gray-50"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/departments"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/departments")
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-gray-700 hover:text-emerald-800 hover:bg-gray-50"
              }`}
            >
              Departments
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-gray-700 hover:text-emerald-800 hover:bg-gray-50"
              }`}
            >
              About
            </Link>
            <Link
              href="/faq"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/faq")
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-gray-700 hover:text-emerald-800 hover:bg-gray-50"
              }`}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/contact")
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-gray-700 hover:text-emerald-800 hover:bg-gray-50"
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* User Auth actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {status === "authenticated" ? (
              <div className="flex items-center space-x-3">
                {role === "CMO_ADMIN" && (
                  <Link
                    href="/cmo/dashboard"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 shadow-sm"
                  >
                    <Shield className="w-4 h-4" />
                    CMO Dashboard
                  </Link>
                )}
                {role === "DEPT_OFFICER" && (
                  <Link
                    href="/officer/dashboard"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 shadow-sm"
                  >
                    <Briefcase className="w-4 h-4" />
                    Officer Desk
                  </Link>
                )}
                {role === "CITIZEN" && (
                  <Link
                    href="/citizen/dashboard"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-900 shadow-sm"
                  >
                    <User className="w-4 h-4" />
                    My Grievances
                  </Link>
                )}
                <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-900 leading-none">
                      {session.user?.name?.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {role}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    title="Sign Out"
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/citizen/submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  Submit Grievance
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/track"
              className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-lg"
              title="Track Grievance"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-emerald-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            href="/citizen/submit"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-emerald-800 bg-emerald-50 font-semibold"
          >
            Submit Grievance
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            Track by Reference ID
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            How It Works
          </Link>
          <Link
            href="/departments"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            Departments
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            About Initiative
          </Link>
          <Link
            href="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            Contact CMO
          </Link>

          <div className="pt-4 border-t border-gray-200">
            {status === "authenticated" ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-sm font-semibold text-gray-700">
                  Signed in as {session.user?.name} ({role})
                </div>
                {role === "CMO_ADMIN" && (
                  <Link
                    href="/cmo/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-amber-600 text-white"
                  >
                    CMO Admin Dashboard
                  </Link>
                )}
                {role === "DEPT_OFFICER" && (
                  <Link
                    href="/officer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-700 text-white"
                  >
                    Department Officer Desk
                  </Link>
                )}
                {role === "CITIZEN" && (
                  <Link
                    href="/citizen/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-emerald-800 text-white"
                  >
                    Citizen Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg border border-emerald-800 text-emerald-800 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg bg-emerald-800 text-white font-medium shadow-sm"
                >
                  Register as Citizen
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
