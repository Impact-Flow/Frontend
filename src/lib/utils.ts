import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: number, token = "XLM"): string {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount)} ${token}`;
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function calculateDaysRemaining(deadline: string): { days: number; isExpired: boolean; label: string } {
  try {
    const target = new Date(deadline).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, isExpired: true, label: "Ended" };
    }

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 1) return { days, isExpired: false, label: "1 day left" };
    return { days, isExpired: false, label: `${days} days left` };
  } catch {
    return { days: 0, isExpired: false, label: "Flexible" };
  }
}
