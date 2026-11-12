import React from "react";
import { STATUS_MAP, PRIORITY_MAP } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = STATUS_MAP[status] || {
    label: status,
    badge: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-sm px-3 py-1 font-semibold"
      : "text-xs px-2.5 py-1 font-medium";

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.badge} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const config = PRIORITY_MAP[priority] || {
    label: priority,
    badge: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.badge}`}
    >
      {config.label}
    </span>
  );
}
