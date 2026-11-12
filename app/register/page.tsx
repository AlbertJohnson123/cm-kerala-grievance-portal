"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-serif font-black text-xl mx-auto shadow-md">
          KL
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Citizen Registration
        </h1>
        <p className="text-xs text-gray-500">
          Create an account to submit and manage public grievances with the CMO.
        </p>
      </div>

      <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm space-y-6">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Arun Krishnan"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. arun@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Mobile Number (10 digits)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="e.g. 9847112233"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? "Registering..." : "Create Citizen Account"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          Already registered?{" "}
          <Link href="/login" className="text-emerald-800 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
