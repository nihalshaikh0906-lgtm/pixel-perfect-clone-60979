import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarClock, Phone, Mail, MessageCircle, Clock, CheckCircle2,
  AlertTriangle, Plus, ShieldCheck, User, Users, Check, ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { formatAed, LEAD_BY_ID } from "@/lib/demo-leads";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/follow-ups")({
  head: () => workspaceHead("Follow-Ups"),
  component: Page,
});

type Status = "Due Now" | "Upcoming" | "Completed" | "Cancelled";
type Kind = "Call" | "Email" | "Meeting" | "WhatsApp";

type Task = {
  id: string;
  lead: string;
  country: string;
  phone: string;
  kind: Kind;
  agent: string;
  status: Status;
  dueText: string;
  isOverdue: boolean;
  propertyInterest: string;
  budget: number;
  note: string;
};

const INITIAL_TASKS: Task[] = [
  {
    id: "FU-2101",
    lead: "Marco R.",
    country: "Italy",
    phone: "+971 52 709 1188",
    kind: "Call",
    agent: "Saad Khan",
    status: "Due Now",
    dueText: "25 min overdue",
    isOverdue: true,
    propertyInterest: "Town Square 2BR",
    budget: 1400000,
    note: "Called twice yesterday; promised to ring back regarding school proximity and Town Square payment schedule.",
  },
  {
    id: "FU-2102",
    lead: "Ivan F.",
    country: "Russia",
    phone: "+971 50 597 1402",
    kind: "WhatsApp",
    agent: "Aisha Salem",
    status: "Due Now",
    dueText: "10 min overdue",
    isOverdue: true,
    propertyInterest: "Reef Luxury 995 DLRC",
    budget: 850000,
    note: "Official PDF brochure and 10/40/50 payment milestone breakdown drafted; send via WhatsApp now.",
  },
  {
    id: "FU-2103",
    lead: "James B.",
    country: "UK",
    phone: "+971 51 637 1842",
    kind: "Meeting",
    agent: "Omar Farooq",
    status: "Due Now",
    dueText: "Due at 2:00 PM today",
    isOverdue: false,
    propertyInterest: "Bayz 102 Business Bay",
    budget: 2500000,
    note: "Wants to bring his business partner; meeting at Business Bay sales pavilion to verify the 1% post-handover plan.",
  },
  {
    id: "FU-2104",
    lead: "Khalid N.",
    country: "Saudi Arabia",
    phone: "+971 51 323 1223",
    kind: "Call",
    agent: "Priya Nair",
    status: "Due Now",
    dueText: "Due today",
    isOverdue: false,
    propertyInterest: "Sobha Orbis Motor City",
    budget: 1950000,
    note: "Verbal EOI offer submitted — needs developer's written unit reservation confirmation today.",
  },
  {
    id: "FU-2105",
    lead: "Elena V.",
    country: "Kazakhstan",
    phone: "+971 56 440 1912",
    kind: "WhatsApp",
    agent: "Saad Khan",
    status: "Due Now",
    dueText: "Due today",
    isOverdue: false,
    propertyInterest: "Address Sky View Downtown",
    budget: 4650000,
    note: "Asked for service charge sheet (AED 38/sq.ft) and title deed transfer timeline.",
  },
  {
    id: "FU-2111",
    lead: "Priya T.",
    country: "India",
    phone: "+971 57 409 1130",
    kind: "Meeting",
    agent: "Priya Nair",
    status: "Completed",
    dueText: "Completed Tue 6 Oct",
    isOverdue: false,
    propertyInterest: "JVC 3BR Apartment",
    budget: 1850000,
    note: "Met at JVC site office; budget confirmed, wants two more secondary units shortlisted.",
  },
  {
    id: "FU-2112",
    lead: "Kenji V.",
    country: "Japan",
    phone: "+971 55 649 1506",
    kind: "WhatsApp",
    agent: "Aisha Salem",
    status: "Completed",
    dueText: "Completed Wed 7 Oct",
    isOverdue: false,
    propertyInterest: "Al Furjan 3BR",
    budget: 2200000,
    note: "Shortlist sent; replied asking for slab progress photos and handover certificate.",
  },
];

function Page() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<string>("All");

  const dueNowCount = useMemo(() => tasks.filter((t) => t.status === "Due Now").length, [tasks]);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Due Now") return t.status === "Due Now";
    if (filter === "Completed") return t.status === "Completed";
    return true;
  });

  const handleWhatsApp = (task: Task) => {
    const text = `Hi ${task.lead.split(" ")[0]}, following up regarding your inquiry for ${task.propertyInterest} (Budget: ${formatAed(task.budget)}). I have the updated documentation ready. When is a good time for a quick 2-minute call?`;
    window.open(`https://wa.me/${task.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
    toast.success(`WhatsApp follow-up dispatched to ${task.lead}`);
  };

  const markCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Completed", dueText: "Completed just now", isOverdue: false } : t))
    );
    toast.success("Follow-up marked as Completed!");
  };

  return (
    <div className="w-full space-y-6 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. CLEAN EXECUTIVE HEADER ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                Speed-To-Lead Queue
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                <AlertTriangle size={14} /> {dueNowCount} Follow-Ups Require Action Today
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Follow-Ups Radar
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Every client call, WhatsApp outreach, and contract follow-up sorted by urgency.
            </p>
          </div>

          <Button
            onClick={() => toast("New task reminder added.")}
            className="h-10 rounded-2xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm"
          >
            <Plus size={15} />
            <span>Add Follow-Up</span>
          </Button>
        </div>
      </section>

      {/* ═══ 2. QUEUE SELECTOR PILLS ═══ */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
        {[
          { id: "All", label: `All Tasks (${tasks.length})` },
          { id: "Due Now", label: `🔥 Due Now (${dueNowCount})` },
          { id: "Completed", label: `✓ Completed (${tasks.filter((t) => t.status === "Completed").length})` },
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

      {/* ═══ 3. BESPOKE HORIZONTAL FOLLOW-UP CARDS (NOT SPREADSHEET TABLE) ═══ */}
      <div className="space-y-3.5">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="group rounded-2xl border border-border/80 bg-card hover:border-primary/60 hover:shadow-md p-4 sm:p-5 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            {/* Identity & Status Badge (Left) */}
            <div className="flex items-center gap-4 min-w-0 lg:min-w-[240px]">
              <div className="size-13 rounded-2xl bg-secondary border border-border/80 flex items-center justify-center font-display font-black text-lg text-foreground shadow-sm">
                {(task.lead.split(" ")[0]?.[0] || "L")}{(task.lead.split(" ")[1]?.[0] || "")}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-foreground font-display group-hover:text-primary transition-colors">
                    {task.lead}
                  </h3>
                  <span className="text-xs text-muted-foreground">({task.country})</span>
                </div>

                <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
                  <span className={`font-bold ${task.isOverdue ? "text-rose-400" : "text-muted-foreground"}`}>
                    {task.dueText}
                  </span>
                  <span>•</span>
                  <span>Channel: <strong className="text-foreground">{task.kind}</strong></span>
                </p>
              </div>
            </div>

            {/* Requirement & Context Note (Middle) */}
            <div className="flex-1 space-y-1 lg:px-4 lg:border-l lg:border-r lg:border-border/60">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-extrabold text-sm text-foreground">
                  {task.propertyInterest}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatAed(task.budget)}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Broker: <strong className="text-foreground">{task.agent}</strong>
                </span>
              </div>

              <p className="text-xs text-muted-foreground italic truncate max-w-xl">
                "{task.note}"
              </p>
            </div>

            {/* Actions Hub (Right) */}
            <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50">
              <button
                type="button"
                onClick={() => handleWhatsApp(task)}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                title="Send WhatsApp follow-up"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </button>

              <a
                href={`tel:${task.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center size-9 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                title="Call client"
              >
                <Phone size={14} />
              </a>

              {task.status !== "Completed" && (
                <button
                  type="button"
                  onClick={() => markCompleted(task.id)}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm transition-all"
                >
                  <Check size={13} />
                  <span>Done</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
