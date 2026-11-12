"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      toast.success("Enquiry saved successfully! CMO cell has received your query.");
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Get in Touch
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Contact the Chief Minister&apos;s Grievance Cell
        </h1>
        <p className="text-base text-gray-600">
          For general queries, Pravasi feedback, or assistance with the online portal,
          reach out to the CMO Public Relations Cell directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Col */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 space-y-8 shadow-lg">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">Office Information</h3>
            <p className="text-emerald-200 text-sm leading-relaxed">
              The Chief Minister&apos;s Public Grievance Redressal Cell operates from the
              Government Secretariat in Thiruvananthapuram.
            </p>
          </div>

          <div className="space-y-6 text-sm text-emerald-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl shrink-0">
                <MapPin className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Secretariat Address</h4>
                <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                  Chief Minister&apos;s Office, North Sandwich Block,
                  Government Secretariat, Thiruvananthapuram, Kerala – 695001
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl shrink-0">
                <Phone className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Helpline Numbers</h4>
                <p className="text-xs text-emerald-200/80 mt-1">
                  1076 (Statewide Toll-Free) <br />
                  +91 471 2333812 / 2518382
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl shrink-0">
                <Mail className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Official Email</h4>
                <p className="text-xs text-emerald-200/80 mt-1">
                  chiefminister@kerala.gov.in <br />
                  cmgrievance@kerala.gov.in
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl shrink-0">
                <Clock className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Public Hearing Hours</h4>
                <p className="text-xs text-emerald-200/80 mt-1">
                  Monday to Saturday: 10:00 AM – 5:00 PM <br />
                  (Closed on Second Saturdays &amp; Public Holidays)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Col */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">Send an Enquiry</h3>
            <p className="text-sm text-gray-500">
              Fill out this form to record an enquiry directly in the CMO database.
            </p>
          </div>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                Thank you! Your enquiry has been saved in the CMO database. Our team
                will respond to your email.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Nair"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. ramesh@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. General enquiry regarding Non-Resident Keralite (NRK) scheme"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Message / Query *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              {submitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Enquiry
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
