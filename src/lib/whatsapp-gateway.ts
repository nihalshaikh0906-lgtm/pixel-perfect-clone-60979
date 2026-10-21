// DealOS WhatsApp Gateway (Baileys / Evolution API multi-device bridge)

export interface WhatsAppSession {
  connected: boolean;
  phoneNumber?: string;
  pushName?: string;
  connectedAt?: string;
  batteryLevel?: number;
  platform?: string;
  autoTranscribe: boolean;
  autoCreateLeads: boolean;
  autoMatchInventory: boolean;
  evolutionApiUrl?: string;
  evolutionApiKey?: string;
}

export interface VoiceNoteSimulation {
  id: string;
  senderName: string;
  senderPhone: string;
  audioDuration: string;
  timestamp: string;
  transcript: string;
  language: string;
  extractedData: {
    clientName: string;
    budgetAed: number;
    bedrooms: string;
    preferredAreas: string[];
    investmentType: "Cash" | "Mortgage" | "Payment Plan";
    urgency: "Immediate" | "1-2 Weeks" | "Exploring";
  };
  matchedProjectSlugs?: string[];
}

const STORAGE_KEY = "dealos_whatsapp_session";
const VOICENOTES_KEY = "dealos_whatsapp_voicenotes";

export const SAMPLE_VOICENOTES: VoiceNoteSimulation[] = [
  {
    id: "vn-1",
    senderName: "Dr. Mansoor Al-Ketbi",
    senderPhone: "+971 50 491 8820",
    audioDuration: "0:24",
    timestamp: "2 mins ago",
    language: "English / Arabic",
    transcript:
      "Salam Tariq, I'm looking for a luxury 2-bedroom in Dubai Creek Harbour or Downtown around 3.5 to 4 Million AED. Must have a high floor with open water or skyline view. Cash ready, let me know what developer allocations you have before the weekend.",
    extractedData: {
      clientName: "Dr. Mansoor Al-Ketbi",
      budgetAed: 4000000,
      bedrooms: "2-Bedroom",
      preferredAreas: ["Dubai Creek Harbour", "Downtown Dubai"],
      investmentType: "Cash",
      urgency: "Immediate",
    },
    matchedProjectSlugs: ["creek-waters-2", "burj-crown", "the-address-downtown"],
  },
  {
    id: "vn-2",
    senderName: "Elena Rostova",
    senderPhone: "+971 52 819 4402",
    audioDuration: "0:38",
    timestamp: "18 mins ago",
    language: "English",
    transcript:
      "Hi! Elena here from Monaco. A friend recommended you for Dubai off-plan. I am looking for an investment unit in Sobha Hartland or Dubai Hills around 1.8 to 2.2 Million AED. Preferably a 60/40 or 70/30 post-handover payment plan with good rental yield.",
    extractedData: {
      clientName: "Elena Rostova",
      budgetAed: 2200000,
      bedrooms: "1-Bedroom",
      preferredAreas: ["Sobha Hartland", "Dubai Hills Estate"],
      investmentType: "Payment Plan",
      urgency: "1-2 Weeks",
    },
    matchedProjectSlugs: ["sobha-waves-opulence", "park-horizon-dubai-hills"],
  },
  {
    id: "vn-3",
    senderName: "Vikram Malhotra",
    senderPhone: "+971 55 930 1184",
    audioDuration: "0:19",
    timestamp: "1 hour ago",
    language: "English",
    transcript:
      "Hello team, Vikram here. Looking for a full-floor penthouse or 4-bedroom duplex in Palm Jumeirah or Bluewaters. Budget is flexible up to 25 Million AED. Looking to close before end of month.",
    extractedData: {
      clientName: "Vikram Malhotra",
      budgetAed: 25000000,
      bedrooms: "4-Bedroom / Penthouse",
      preferredAreas: ["Palm Jumeirah", "Bluewaters Island"],
      investmentType: "Cash",
      urgency: "Immediate",
    },
    matchedProjectSlugs: ["como-residences-palm", "one-crescent-palm"],
  },
];

export function getWhatsAppSession(): WhatsAppSession {
  if (typeof window === "undefined") {
    return {
      connected: false,
      autoTranscribe: true,
      autoCreateLeads: true,
      autoMatchInventory: true,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }

    const verifiedPhone = localStorage.getItem("dealos_verified_whatsapp_phone");
    if (verifiedPhone) {
      return {
        connected: true,
        phoneNumber: verifiedPhone,
        pushName: "DealOS Verified UAE Number",
        connectedAt: new Date().toISOString(),
        batteryLevel: 100,
        platform: "WhatsApp OTP Verified (+971 UAE)",
        autoTranscribe: true,
        autoCreateLeads: true,
        autoMatchInventory: true,
      };
    }
  } catch (err) {
    console.error("Failed to load WhatsApp session", err);
  }

  return {
    connected: false,
    autoTranscribe: true,
    autoCreateLeads: true,
    autoMatchInventory: true,
  };
}

export function saveWhatsAppSession(session: WhatsAppSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error("Failed to save WhatsApp session", err);
  }
}

export function connectMockWhatsApp(phone = "+971 50 839 2104"): WhatsAppSession {
  const session: WhatsAppSession = {
    connected: true,
    phoneNumber: phone,
    pushName: "DealOS Dubai Broker",
    connectedAt: new Date().toISOString(),
    batteryLevel: 94,
    platform: "WhatsApp Multi-Device (iOS 18 / Chromium)",
    autoTranscribe: true,
    autoCreateLeads: true,
    autoMatchInventory: true,
  };
  saveWhatsAppSession(session);
  return session;
}

export function disconnectWhatsApp(): WhatsAppSession {
  const session: WhatsAppSession = {
    connected: false,
    autoTranscribe: true,
    autoCreateLeads: true,
    autoMatchInventory: true,
  };
  saveWhatsAppSession(session);
  return session;
}

export function getProcessedVoiceNotes(): VoiceNoteSimulation[] {
  if (typeof window === "undefined") return SAMPLE_VOICENOTES;
  try {
    const raw = localStorage.getItem(VOICENOTES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to load voice notes", err);
  }
  return SAMPLE_VOICENOTES;
}

export function ingestVoiceNote(note: VoiceNoteSimulation): void {
  if (typeof window === "undefined") return;
  try {
    const list = getProcessedVoiceNotes();
    const updated = [note, ...list.filter((n) => n.id !== note.id)];
    localStorage.setItem(VOICENOTES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to ingest voice note", err);
  }
}
