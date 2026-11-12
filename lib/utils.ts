export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `KL-CMO-${year}-${random}`;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export const GRIEVANCE_CATEGORIES = [
  "Water Supply & Sanitation",
  "Roads, Bridges & Infrastructure",
  "Public Healthcare & Hospitals",
  "Education & Schools",
  "Electricity & Power Distribution",
  "Agriculture, Farmers & Irrigation",
  "Revenue, Land Records & Patta",
  "Police, Law & Public Safety",
  "Public Transport & Traffic",
  "Social Welfare, Pensions & Relief",
  "Civic Waste & Environmental Sanitation",
  "Urban Housing & Local Governance",
  "Other Public Grievances",
];

export const STATUS_MAP: Record<string, { label: string; badge: string; desc: string }> = {
  SUBMITTED: {
    label: "Submitted",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    desc: "Grievance received and waiting for CMO review",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    desc: "CMO admin reviewing details and identifying department",
  },
  IN_PROGRESS: {
    label: "In Progress",
    badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
    desc: "Assigned department officer actively investigating",
  },
  RESOLVED: {
    label: "Resolved",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    desc: "Action taken report submitted and approved by CMO",
  },
  REOPENED: {
    label: "Reopened",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    desc: "Citizen requested further redressal after initial review",
  },
};

export const PRIORITY_MAP: Record<string, { label: string; badge: string }> = {
  LOW: { label: "Low Priority", badge: "bg-slate-100 text-slate-700 border-slate-200" },
  MEDIUM: { label: "Medium Priority", badge: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  HIGH: { label: "High / Urgent", badge: "bg-red-100 text-red-800 border-red-200 font-semibold" },
};
