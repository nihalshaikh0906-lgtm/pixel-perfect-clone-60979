/**
 * Universal WhatsApp Dispatcher for DealOS
 * 
 * Works seamlessly with ANY WhatsApp:
 * - Standard WhatsApp Messenger (iOS / Android / Mac / Windows)
 * - WhatsApp Business (iOS / Android / Mac / Windows)
 * - WhatsApp Web fallback
 * 
 * Deep links directly into the native app if installed so the user can send
 * property dossiers, lead pitches, contracts, and updates to clients and agents right away.
 */
import { toast } from "sonner";

export function formatWhatsAppDigits(phone?: string | null): string {
  if (!phone) return "";
  let digits = phone.replace(/\D/g, "");
  // UAE local numbers starting with 05 -> convert to 9715
  if (digits.startsWith("05") && digits.length === 10) {
    digits = `971${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Returns native deep link URI (whatsapp://send)
 * Triggers ANY installed WhatsApp app (Personal WhatsApp, WhatsApp Messenger, WhatsApp Business)
 */
export function getWhatsAppNativeUrl(phone?: string | null, text: string = ""): string {
  const digits = formatWhatsAppDigits(phone);
  const encoded = encodeURIComponent(text.trim());
  if (digits) {
    return `whatsapp://send?phone=${digits}&text=${encoded}`;
  }
  return `whatsapp://send?text=${encoded}`;
}

/**
 * Returns universal web URL (api.whatsapp.com / wa.me)
 */
export function getWhatsAppWebUrl(phone?: string | null, text: string = ""): string {
  const digits = formatWhatsAppDigits(phone);
  const encoded = encodeURIComponent(text.trim());
  if (digits) {
    return `https://api.whatsapp.com/send?phone=${digits}&text=${encoded}`;
  }
  return `https://api.whatsapp.com/send?text=${encoded}`;
}

/**
 * Universal WhatsApp Launcher
 * Immediately opens the native WhatsApp app (Standard or Business) if installed
 * and gracefully falls back to WhatsApp Web if needed.
 */
export function openWhatsApp(options: {
  phone?: string | null;
  text: string;
  recipientName?: string;
  silent?: boolean;
}): void {
  if (typeof window === "undefined") return;

  const { phone, text, recipientName, silent } = options;
  const digits = formatWhatsAppDigits(phone);
  const nativeUrl = getWhatsAppNativeUrl(digits, text);
  const webUrl = getWhatsAppWebUrl(digits, text);

  if (!silent) {
    const label = recipientName || (digits ? `+${digits}` : "contact");
    toast.success(`Opening WhatsApp for ${label}...`, {
      icon: "💬",
      duration: 3000,
    });
  }

  try {
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);

    if (isMobile) {
      if (typeof window !== "undefined") {
        window.location.href = nativeUrl;
        setTimeout(() => {
          if (typeof document !== "undefined" && typeof document.hasFocus === "function" && document.hasFocus()) {
            window.location.href = webUrl;
          }
        }, 1800);
      }
    } else {
      if (typeof document !== "undefined" && document.body && typeof document.createElement === "function") {
        const link = document.createElement("a");
        link.href = nativeUrl;
        link.style.display = "none";
        document.body.appendChild(link);
        if (typeof link.click === "function") {
          link.click();
        }
        setTimeout(() => {
          try {
            document.body?.removeChild(link);
          } catch {}
        }, 800);

        setTimeout(() => {
          if (typeof document !== "undefined" && typeof document.hasFocus === "function" && document.hasFocus()) {
            window.open?.(webUrl, "_blank", "noopener,noreferrer");
          }
        }, 1200);
      } else if (typeof window !== "undefined") {
        window.open?.(webUrl, "_blank", "noopener,noreferrer");
      }
    }
  } catch {
    if (typeof window !== "undefined") {
      window.open?.(webUrl, "_blank", "noopener,noreferrer");
    }
  }
}
