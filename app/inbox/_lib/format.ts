export function formatRelativeTime(iso: string | null): string {
  if (!iso) {
    return "Unknown time";
  }
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return "Unknown time";
  }
  const diffMs = Date.now() - then;
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) {
    return "Just now";
  }
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 48) {
    return `${diffHr}h ago`;
  }
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 14) {
    return `${diffDay}d ago`;
  }
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatPhoneDisplay(phone: string | null): string {
  if (!phone) {
    return "Unknown number";
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return formatPhoneDisplay(digits.slice(1));
  }
  return phone;
}

export function telHref(phone: string | null): string | null {
  if (!phone) {
    return null;
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return null;
  }
  const normalized = digits.length === 11 && digits.startsWith("1") ? digits : `1${digits.slice(-10)}`;
  return `tel:+${normalized}`;
}

export function dispositionLabel(disposition: string): string {
  switch (disposition) {
    case "needs_you":
      return "Needs you";
    case "booked":
      return "Booked";
    case "done":
      return "Done";
    case "spam":
      return "Spam";
    case "vip_followup":
      return "VIP follow-up";
    default:
      return disposition;
  }
}

export function displayCallerName(callerName: string, contactName: string | null): string {
  if (callerName.trim()) {
    return callerName.trim();
  }
  if (contactName?.trim()) {
    return contactName.trim();
  }
  return "Unknown caller";
}

export function callerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function summaryPreview(summary: string, maxLines = 2): string {
  const lines = summary.trim().split(/\n+/).filter(Boolean);
  if (lines.length === 0) {
    return "No summary yet.";
  }
  return lines.slice(0, maxLines).join(" ");
}
