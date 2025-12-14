import { Badge } from "../ui/badge";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "PENDING_REVIEW" | "UNKNOWN";
export type OperationalStatus =
  | "ACTIVE"
  | "PAUSED"
  | "CLOSED"
  | "FULL"
  | "COMPLETED"
  | "PENDING_REVIEW"
  | "REJECTED"
  | "AVAILABLE"
  | "UNKNOWN";

const approvalColors: Record<ApprovalStatus, string> = {
  APPROVED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  PENDING_REVIEW: "bg-amber-100 text-amber-700",
  REJECTED: "bg-rose-100 text-rose-700",
  UNKNOWN: "bg-slate-100 text-slate-700",
};

const statusColors: Record<OperationalStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-amber-100 text-amber-700",
  CLOSED: "bg-slate-100 text-slate-700",
  FULL: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  PENDING_REVIEW: "bg-amber-100 text-amber-700",
  REJECTED: "bg-rose-100 text-rose-700",
  UNKNOWN: "bg-slate-100 text-slate-700",
};

export function StatusBadge({
  label,
  type,
  kind,
}: {
  label?: string;
  type: "approval" | "status";
  kind?: ApprovalStatus | OperationalStatus | null | undefined;
}) {
  const normalized = (kind || "UNKNOWN") as ApprovalStatus & OperationalStatus;
  const style = type === "approval" ? approvalColors[normalized as ApprovalStatus] : statusColors[normalized];
  const text = label || normalized;

  return <Badge className={style}>{text}</Badge>;
}
