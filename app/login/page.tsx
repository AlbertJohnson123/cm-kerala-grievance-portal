"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Shield, Lock, Mail, ArrowRight, UserCheck, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password. Please verify credentials.");
      } else {
        toast.success("Signed in successfully!");

        // Determine destination role
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role;

        if (role === "CMO_ADMIN") {
          router.push("/cmo/dashboard");
        } else if (role === "DEPT_OFFICER") {
          router.push("/officer/dashboard");
        } else {
          router.push("/citizen/dashboard");
        }
        router.refresh();
      }
    } catch (err) {
      toast.error("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(userEmail: string, userPass: string) {
    setEmail(userEmail);
    setPassword(userPass);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-serif font-black text-xl mx-auto shadow-md">
          KL
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Sign In to Grievance Portal
        </h1>
        <p className="text-xs text-gray-500">
          Access your citizen account, CMO console, or department nodal officer desk.
        </p>
      </div>

      {/* Demo Credentials Quick Fill Box for Evaluators */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
          <KeyRound className="w-4 h-4 text-amber-700" />
          <span>Evaluator Quick-Fill Credentials:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => fillDemo("admin@cmkerala.gov.in", "Admin@123")}
            className="p-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-lg text-left transition font-medium text-amber-950"
          >
            🏛️ <strong>CMO Admin</strong>
            <span className="block text-[10px] text-gray-500 font-mono">admin@cmkerala.gov.in</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemo("officer.water@kerala.gov.in", "Officer@123")}
            className="p-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-lg text-left transition font-medium text-amber-950"
          >
            💧 <strong>Water Officer</strong>
            <span className="block text-[10px] text-gray-500 font-mono">officer.water...</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemo("officer.roads@kerala.gov.in", "Officer@123")}
            className="p-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-lg text-left transition font-medium text-amber-950"
          >
            🛣️ <strong>PWD Officer</strong>
            <span className="block text-[10px] text-gray-500 font-mono">officer.roads...</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemo("arun@test.com", "Citizen@123")}
            className="p-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-lg text-left transition font-medium text-amber-950"
          >
            👤 <strong>Citizen (Arun)</strong>
            <span className="block text-[10px] text-gray-500 font-mono">arun@test.com</span>
          </button>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? "Authenticating..." : "Sign In to Portal"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          New citizen without an account?{" "}
          <Link href="/register" className="text-emerald-800 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
