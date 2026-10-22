import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays, MapPin, MessageCircle, Phone, Video, Building2,
  Clock, CheckCircle2, XCircle, ArrowUpRight, Plus, ExternalLink,
  ShieldCheck, User, Users, ChevronRight, Check, CalendarPlus
} from "lucide-react";
import { toast } from "sonner";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { formatAed } from "@/lib/demo-leads";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/app/appointments")({
  head: () => workspaceHead("Appointments & Viewings"),
  component: Page,
});

type AppointmentKind = "On-Site Show Villa" | "Overseas Zoom Call" | "EOI / SPA Signing";
type AppointmentStatus = "Confirmed" | "Scheduled" | "Completed" | "Cancelled";

type Appointment = {
  id: string;
  time: string;
  date: string;
  kind: AppointmentKind;
  status: AppointmentStatus;
  client: string;
  clientCountry: string;
  clientPhone: string;
  budget: number;
  property: string;
  location: string;
  developer: string;
  gatePass?: string;
  agent: string;
  notes: string;
  googleMapsUrl: string;
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-201",
    time: "2:10 AM",
    date: "Today · Mon 12 Oct",
    kind: "On-Site Show Villa",
    status: "Confirmed",
    client: "Michael Thorne",
    clientCountry: "UK Investor",
    clientPhone: "+44 7911 123456",
    budget: 2200000,
    property: "Reef Luxury 995 Show Villa",
    location: "Dubai Land Residential Complex (DLRC), Dubai",
    developer: "Reef Luxury Developments",
    gatePass: "RERA-995-GATE",
    agent: "Saad Al-Harbi (Senior Broker)",
    notes: "Passport copy ready. Bring printed master floor plan. Gate code verified.",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Dubai+Land+Residential+Complex+Reef+Luxury",
  },
  {
    id: "APT-202",
    time: "1:00 PM",
    date: "Today · Mon 12 Oct",
    kind: "Overseas Zoom Call",
    status: "Confirmed",
    client: "Elena Rostova",
    clientCountry: "Swiss Buyer",
    clientPhone: "+41 79 123 4567",
    budget: 2500000,
    property: "Danube Bayz 102 Luxury Tower",
    location: "Business Bay, Dubai Canal",
    developer: "Danube Properties",
    agent: "Priya Raman (Off-Plan Specialist)",
    notes: "Golden Visa eligibility consultation (AED 2M+). Walk through the 1% monthly payment plan on Google Meet.",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Business+Bay+Danube+Bayz+102",
  },
  {
    id: "APT-203",
    time: "4:00 PM",
    date: "Today · Mon 12 Oct",
    kind: "EOI / SPA Signing",
    status: "Confirmed",
    client: "Dr. Tariq Al-Mansoor",
    clientCountry: "Saudi Private Investor",
    clientPhone: "+966 50 123 4567",
    budget: 4000000,
    property: "Sobha Orbis Tower B",
    location: "Sobha Sales Pavilion, Nad Al Sheba, Meydan",
    developer: "Sobha Realty",
    gatePass: "SOBHA-VIP-PASS",
    agent: "Omar Farooq (Executive Director)",
    notes: "2BR Allocation · Sobha Realty · AED 950K. EOI deposit AED 95,000. Bring EOI booking slip and passport copy.",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Motor+City+Sobha+Orbis",
  },
  {
    id: "APT-204",
    time: "11:30 AM",
    date: "Tomorrow · Tue 13 Oct",
    kind: "On-Site Show Villa",
    status: "Scheduled",
    client: "Zara Drummond",
    clientCountry: "UK High-Net-Worth",
    clientPhone: "+44 7822 991100",
    budget: 18500000,
    property: "Palm Jebel Ali Beach Villa Showcase",
    location: "Nakheel Island Sales Pavilion, Dubai",
    developer: "Nakheel",
    agent: "Aisha Salem (Luxury Director)",
    notes: "VIP beachfront plot selection and superyacht mooring briefing.",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Palm+Jebel+Ali+Nakheel",
  },
];

function Page() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [filter, setFilter] = useState<string>("All");
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const filtered = appointments.filter((a) => {
    if (filter === "All") return true;
    if (filter === "Today") return a.date.includes("Today");
    if (filter === "Confirmed") return a.status === "Confirmed";
    if (filter === "Show Villa") return a.kind === "On-Site Show Villa";
    if (filter === "Zoom") return a.kind === "Overseas Zoom Call";
    return true;
  });

  const handleWhatsAppConfirmation = (e: React.MouseEvent, appt: Appointment) => {
    e.stopPropagation();
    const cleanNum = appt.clientPhone.replace(/\D/g, "");
    const text = `Hello ${appt.client.split(" ")[0]}, confirming your appointment for *${appt.property}* (${appt.kind}) on *${appt.date}* at *${appt.time}*.\n📍 Location: ${appt.location}\n${appt.gatePass ? `🔑 Access Gate Pass: ${appt.gatePass}\n` : ""}🗺️ Google Maps: ${appt.googleMapsUrl}\nBroker attending: ${appt.agent}. See you then!`;
    const url = `https://web.whatsapp.com/send?phone=${cleanNum}&text=${encodeURIComponent(text)}`;
    try {
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened || opened.closed || typeof opened.closed === "undefined") {
        void navigator.clipboard.writeText(url);
        toast.info("WhatsApp Web link copied to clipboard! Paste it into a new tab.", { duration: 5000 });
      } else {
        toast.success(`WhatsApp confirmation opened for ${appt.client}`);
      }
    } catch {
      void navigator.clipboard.writeText(url);
      toast.info("WhatsApp link copied to clipboard!");
    }
  };

  const handleGoogleCalendarSync = (e: React.MouseEvent, appt: Appointment) => {
    e.stopPropagation();
    const now = new Date();
    const startIso = now.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endIso = new Date(now.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const title = `DealOS Viewing: ${appt.property} with ${appt.client}`;
    const details = `Dubai Real Estate Viewing Inspection\nClient: ${appt.client} (${appt.clientPhone})\nProperty: ${appt.property}\nFormat: ${appt.kind}\nTime: ${appt.time} (${appt.date})\nLocation: ${appt.location}\n${appt.gatePass ? `Developer Gate Pass: ${appt.gatePass}\n` : ""}Google Maps: ${appt.googleMapsUrl}\nLead Broker: ${appt.agent}`;
    
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(appt.location)}`;
    
    window.open(calUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening Google Calendar template… Click 'Save' to sync!");
  };

  const markCompleted = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Completed" } : a))
    );
    toast.success("Appointment marked as Completed & outcome logged.");
  };

  return (
    <div className="w-full space-y-6 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. CLEAN EXECUTIVE HEADER ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                VIP Viewings & Diary
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> 100% Confirmed Attendance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Appointments & Viewings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Investor site visits, zoom briefings, and developer signings with one-tap WhatsApp confirmations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => toast("Appointment diary synced with Google & Apple Calendar.")}
              variant="outline"
              className="h-10 rounded-2xl text-xs font-bold border-border gap-1.5"
            >
              <CalendarDays size={14} />
              <span>Sync Calendar</span>
            </Button>
            <Button
              onClick={() => toast("New appointment scheduler opened.")}
              className="h-10 rounded-2xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm"
            >
              <Plus size={15} />
              <span>Book Appointment</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 2. FILTER PILL SELECTOR ═══ */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
        {[
          { id: "All", label: "All Viewings" },
          { id: "Today", label: "Today (3 Scheduled)" },
          { id: "Confirmed", label: "Confirmed (100%)" },
          { id: "Show Villa", label: "On-Site Show Villas" },
          { id: "Zoom", label: "Overseas Zoom Calls" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ 3. BESPOKE HORIZONTAL APPOINTMENT CARDS (NO CLUMSINESS) ═══ */}
      <div className="space-y-4">
        {filtered.map((appt) => (
          <div
            key={appt.id}
            onClick={() => setSelectedAppt(appt)}
            className="group cursor-pointer rounded-2xl border border-border/80 bg-card hover:border-primary/60 hover:shadow-md p-5 sm:p-6 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
          >
            {/* Time & Kind Badge (Left) */}
            <div className="flex items-center gap-4 min-w-0 lg:min-w-[220px]">
              <div className="text-center p-3 rounded-2xl bg-secondary/70 border border-border/80 min-w-[85px] shadow-sm">
                <p className="text-xl sm:text-2xl font-black text-foreground font-mono leading-none font-display">
                  {appt.time}
                </p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">
                  {(appt.date.split("·")[0] || appt.date).trim()}
                </p>
              </div>

              <div className="space-y-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border font-mono ${
                    appt.kind === "On-Site Show Villa"
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      : appt.kind === "Overseas Zoom Call"
                      ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                      : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  {appt.kind === "Overseas Zoom Call" ? <Video size={10} /> : <Building2 size={10} />}
                  <span>{appt.kind}</span>
                </span>

                <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> {appt.status}
                </p>
              </div>
            </div>

            {/* Investor & Property Details (Middle) */}
            <div className="flex-1 space-y-1.5 lg:px-5 lg:border-l lg:border-r lg:border-border/60">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-base text-foreground font-display group-hover:text-primary transition-colors">
                  {appt.client}
                </h3>
                <span className="text-xs text-muted-foreground">({appt.clientCountry})</span>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Budget: {formatAed(appt.budget)}
                </span>
              </div>

              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MapPin size={13} className="text-rose-400 shrink-0" />
                <span>{appt.property}</span>
                <span className="text-muted-foreground font-normal">({appt.location})</span>
              </p>

              <p className="text-xs text-muted-foreground italic truncate max-w-xl">
                "{appt.notes}"
              </p>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                <span>Broker: <strong className="text-foreground">{appt.agent}</strong></span>
                {appt.gatePass && (
                  <span className="rounded bg-secondary px-2 py-0.5 font-mono text-emerald-400 border border-border">
                    Gate Code: {appt.gatePass}
                  </span>
                )}
              </div>
            </div>

            {/* Action Hub (Right) */}
            <div
              className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => handleGoogleCalendarSync(e, appt)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs transition-all"
                title="Sync appointment to Google Calendar"
              >
                <CalendarPlus size={13} className="text-amber-400" />
                <span>Google Calendar</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleWhatsAppConfirmation(e, appt)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                title="Send WhatsApp confirmation"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </button>

              <a
                href={appt.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs transition-all"
                title="Open location in Google Maps"
              >
                <MapPin size={13} className="text-rose-400" />
                <span>Maps Pin</span>
              </a>

              {appt.status !== "Completed" && (
                <button
                  type="button"
                  onClick={(e) => markCompleted(e, appt.id)}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm transition-all"
                >
                  <Check size={13} />
                  <span>Log Outcome</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ 4. FULL-SCREEN APPOINTMENT DIALOG ═══ */}
      {selectedAppt && (
        <Dialog open={!!selectedAppt} onOpenChange={(open) => { if (!open) setSelectedAppt(null); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border-border p-6 sm:p-8 space-y-5">
            <DialogHeader className="border-b border-border/60 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <DialogTitle className="text-2xl font-extrabold text-foreground font-display">
                    {selectedAppt.property}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedAppt.date} · {selectedAppt.time}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                  {selectedAppt.status}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div className="rounded-2xl bg-secondary/30 border border-border/70 p-4 space-y-2">
                <span className="font-bold text-foreground">Client Profile:</span>
                <p className="text-foreground text-sm font-bold">{selectedAppt.client} ({selectedAppt.clientCountry})</p>
                <p className="text-muted-foreground">Phone: {selectedAppt.clientPhone} · Target Budget: {formatAed(selectedAppt.budget)}</p>
              </div>

              <div className="rounded-2xl bg-secondary/30 border border-border/70 p-4 space-y-2">
                <span className="font-bold text-foreground">Viewing Logistics:</span>
                <p className="text-muted-foreground">Address: {selectedAppt.location}</p>
                {selectedAppt.gatePass && (
                  <p className="text-emerald-400 font-mono font-bold">RERA Community Pass: {selectedAppt.gatePass}</p>
                )}
                <p className="text-muted-foreground">Broker in Attendance: {selectedAppt.agent}</p>
                <p className="text-foreground italic">"{selectedAppt.notes}"</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-border/60">
              <Button variant="outline" onClick={() => setSelectedAppt(null)} className="rounded-xl text-xs">
                Close
              </Button>
              <Button
                variant="outline"
                onClick={(e) => handleGoogleCalendarSync(e, selectedAppt)}
                className="rounded-xl text-xs font-bold gap-1.5 border-border hover:bg-secondary text-foreground"
              >
                <CalendarPlus size={14} className="text-amber-400" />
                <span>Add to Google Calendar</span>
              </Button>
              <Button
                onClick={(e) => {
                  handleWhatsAppConfirmation(e, selectedAppt);
                  setSelectedAppt(null);
                }}
                className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <MessageCircle size={14} />
                <span>Dispatch Confirmation</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
