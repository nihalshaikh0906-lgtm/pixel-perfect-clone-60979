import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight, Info, Mail, MessageCircle, Phone, Plus, Upload,
  Sparkles, Filter, Search, ChevronRight, CheckCircle2, Clock,
  ArrowRight, ShieldCheck, Flame, Star, Compass, Eye
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CsvImporterModal } from "@/components/leads/CsvImporterModal";
import { CompanyLeadBox } from "@/components/leads/CompanyLeadBox";
import { openWhatsApp, getWhatsAppNativeUrl } from "@/lib/whatsapp-send";
import {
  ago, formatAed, LEAD_BY_ID, QUEUES, queueCount, queueLeads,
  SOURCES, wants, priorityOf, type Lead, type LeadType, type Queue
} from "@/lib/demo-leads";

const QIDS: Queue[] = ["respond", "hot", "followup", "nurture", "all"];
type Search = { queue: Queue; q?: string | undefined; lead?: string | undefined };

export const Route = createFileRoute("/_authenticated/app/leads/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    queue: QIDS.includes(s["queue"] as Queue) ? (s["queue"] as Queue) : "respond",
    q: typeof s["q"] === "string" && s["q"] ? (s["q"] as string) : undefined,
    lead: typeof s["lead"] === "string" && s["lead"] ? (s["lead"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Leads Inbox — DealOS Workspace" },
      { name: "description", content: "Executive investor queue sorted by speed-to-lead and conversion probability." },
    ],
  }),
  component: Inbox,
});

const PAGE = 20;

const waMessage = (l: Lead) =>
  `Hi ${l.name.split(" ")[0]}, thanks for your enquiry about ${wants(l)} in ${l.area} (Budget: ${formatAed(l.budget)}). When is a good time for a quick 2-minute overview?`;

const waLink = (l: Lead) => getWhatsAppNativeUrl(l.phone, waMessage(l));

function timeOf(l: Lead) {
  if (l.followUpDueInHours !== null && l.followUpDueInHours <= 0)
    return { text: `${ago(-l.followUpDueInHours || 0.5)} overdue`, late: true };
  return { text: ago(l.receivedHoursAgo), late: l.stage === "New" && l.receivedHoursAgo > 0.1 };
}

function Inbox() {
  const { queue, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [type, setType] = useState<"All" | LeadType>("All");
  const [source, setSource] = useState("All");
  const [text, setText] = useState(q ?? "");
  const [page, setPage] = useState(0);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importCount, setImportCount] = useState(0);

  useEffect(() => {
    const handleLeadAdded = () => setImportCount((c) => c + 1);
    window.addEventListener("dealos:lead_added", handleLeadAdded);
    return () => window.removeEventListener("dealos:lead_added", handleLeadAdded);
  }, []);

  const isDemo = typeof window !== "undefined" && (localStorage.getItem("dealos_demo_mode") === "true" || localStorage.getItem("dealos_active_email")?.includes("demo"));

  const base = useMemo(() => queueLeads(queue), [queue, importCount]);
  const rows = useMemo(() => {
    const t = text.trim().toLowerCase();
    return base.filter(
      (l) =>
        (type === "All" || l.type === type) &&
        (source === "All" || l.source === source) &&
        (!t ||
          l.name.toLowerCase().includes(t) ||
          l.area.toLowerCase().includes(t) ||
          l.id.toLowerCase().includes(t) ||
          l.country.toLowerCase().includes(t))
    );
  }, [base, type, source, text]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const view = rows.slice(page * PAGE, page * PAGE + PAGE);
  const info = QUEUES.find((x) => x.id === queue);

  const openLead = (l: Lead) => void navigate({ to: "/app/leads/$id", params: { id: l.id } });

  return (
    <div className="relative w-full space-y-7 pb-24 animate-in fade-in-50 duration-200">
      {/* ═══ CLEAN EXECUTIVE HEADER ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/85 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                Executive Action Stream
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> {isDemo ? "1,000 Verified Dubai Investor Leads" : `${rows.length} Investor Leads`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Leads Inbox
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Prioritized by response urgency, budget size, and closing probability. Click any investor to open full client profile.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-primary/30 bg-primary/10 backdrop-blur-sm text-primary hover:bg-primary/20 font-bold text-xs transition-all shadow-sm"
              onClick={() => setIsImportOpen(true)}
            >
              <Upload size={14} />
              <span>Import Leads (CSV)</span>
            </button>

            <Button asChild className="h-10 px-5 rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-2 shadow-sm hover:brightness-105 transition-all">
              <Link to="/app/crm" search={{ action: "add" }}>
                <Plus size={15} />
                <span>New Lead</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ COMPANY IMPORT POOL (FIRST-TO-CLAIM & AGENT TRANSFER) ═══ */}
      <CompanyLeadBox currentAgentName="Tariq Mansoor" />

      {/* ═══ PRIORITY QUEUE TABS (GENEROUS CAPSULE RIBBON) ═══ */}
      <div className="flex flex-wrap items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-card/75 backdrop-blur-md border border-border/80 shadow-sm">
        {QUEUES.map((x) => {
          const active = queue === x.id;
          return (
            <Link
              key={x.id}
              to="/app/leads"
              search={{ queue: x.id }}
              onClick={() => setPage(0)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm ${
                active
                  ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/25 scale-[1.02]"
                  : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/50"
              }`}
            >
              <span>{x.label}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  active ? "bg-black/30 text-white" : "bg-card text-foreground border border-border/70"
                }`}
              >
                {queueCount(x.id).toLocaleString("en-US")}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ═══ STATUS HELPER BANNER (DECENT SPACING) ═══ */}
      {info && (
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground/90 bg-primary/8 border border-primary/25 px-6 py-4 rounded-2xl shadow-sm backdrop-blur-sm">
          <Info size={16} className="text-primary shrink-0" />
          <span>{info.info}</span>
        </div>
      )}

      {/* ═══ FILTER & SEARCH CAPSULE CONTAINER (GENEROUS PADDING & GAPS) ═══ */}
      <div className="p-6 sm:p-7 rounded-3xl bg-card/85 backdrop-blur-xl border border-border/80 shadow-sm space-y-5">
        {/* Type Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-1">Filter:</span>
          {(["All", "Off-plan", "Ready", "Rent"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setPage(0);
              }}
              className={`h-10 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                type === t
                  ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                  : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60"
              }`}
            >
              {t === "All" ? "All types" : t}
            </button>
          ))}

          <select
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setPage(0);
            }}
            className="h-10 px-3.5 rounded-xl border border-border/80 bg-secondary/70 text-foreground text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm ml-auto"
          >
            <option value="All">All Sources ({SOURCES.length})</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Search & Meta Row with Decent Spacing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border/50">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3 text-muted-foreground" />
            <input
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setPage(0);
              }}
              placeholder="Search by name, phone, area, country…"
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/80 bg-background/80 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-xs font-mono font-bold text-muted-foreground">
              Showing {view.length} of {rows.length.toLocaleString("en-US")} leads
            </span>
          </div>
        </div>
      </div>

      {/* ═══ BESPOKE HORIZONTAL INVESTOR PROFILE CARDS (NOT SPREADSHEET TABLE) ═══ */}
      <div className="space-y-3.5">
        {view.map((l) => {
          const t = timeOf(l);
          const p = priorityOf(l);

          return (
            <div
              key={l.id}
              onClick={() => openLead(l)}
              className="group cursor-pointer rounded-2xl border border-border/80 bg-card hover:border-primary/60 hover:shadow-md p-4 sm:p-5 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              {/* Identity & Priority Ring */}
              <div className="flex items-center gap-4 min-w-0 lg:min-w-[240px]">
                <div className="relative flex size-13 shrink-0 items-center justify-center rounded-2xl bg-secondary border border-border/80 font-display font-black text-lg text-foreground shadow-sm">
                  {l.initials}
                  <span
                    className={`absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold text-white ${
                      p === "Hot" ? "bg-rose-500" : p === "Warm" ? "bg-amber-500" : "bg-blue-500"
                    }`}
                  >
                    ★
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-foreground font-display group-hover:text-primary transition-colors">
                      {l.name}
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground">({l.country})</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
                    <span>{l.id}</span>
                    <span>•</span>
                    <span className={t.late ? "text-rose-400 font-bold" : ""}>{t.text}</span>
                    <span>•</span>
                    <span className="text-foreground">{l.source}</span>
                  </p>
                </div>
              </div>

              {/* Requirement & Financial Blueprint */}
              <div className="flex-1 space-y-1.5 lg:px-4 lg:border-l lg:border-r lg:border-border/60">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase font-mono ${
                      l.type === "Off-plan"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                        : l.type === "Ready"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {l.type}
                  </span>

                  <span className="font-extrabold text-sm text-foreground">
                    {wants(l)} in {l.area}
                  </span>

                  <span className="text-muted-foreground text-xs">•</span>

                  <span className="font-mono font-extrabold text-emerald-400 text-sm">
                    {formatAed(l.budget)}
                    {l.type === "Rent" ? "/yr" : ""}
                  </span>

                  <span className="text-xs text-muted-foreground font-mono">({l.payment})</span>
                </div>

                {/* Inbound Message Bubble */}
                <p className="text-xs text-muted-foreground italic truncate max-w-xl">
                  "{l.message}"
                </p>
              </div>

              {/* Action Hub */}
              <div
                className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50"
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={waLink(l)}
                  onClick={(e) => {
                    e.preventDefault();
                    openWhatsApp({ phone: l.phone, text: waMessage(l), recipientName: l.name });
                  }}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                  title="Open WhatsApp chat immediately"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`tel:${l.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center size-9 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                  title="Call lead"
                >
                  <Phone size={14} />
                </a>

                <button
                  type="button"
                  onClick={() => openLead(l)}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  title="Open full client profile"
                >
                  <Eye size={14} className="text-white" />
                  <span>Open Lead ↗</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {rows.length === 0 && (
        <div className="rounded-3xl border border-border/80 bg-card p-10 sm:p-14 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
          <div className="size-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold text-2xl">
            ✨
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-foreground font-display">
              {base.length === 0 ? "Your Client Inbox is Ready" : "No Leads Match These Filters"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {base.length === 0
                ? "This is your private, secure broker workspace. Add your first client manually, import a CSV list, or connect your WhatsApp."
                : "Try clearing search filters or switching between queue tabs to view other leads."}
            </p>
          </div>
          {base.length === 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button asChild className="h-10 px-5 rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-2 shadow-sm">
                <Link to="/app/crm" search={{ action: "add" }}>
                  <Plus size={15} />
                  <span>Add First Client</span>
                </Link>
              </Button>
              <button
                type="button"
                onClick={() => setIsImportOpen(true)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs transition-all shadow-sm"
              >
                <Upload size={14} />
                <span>Import CSV File</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ CLEAN PAGINATION BAR ═══ */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <span className="text-xs font-mono font-bold text-muted-foreground">
          Page {page + 1} of {pages} ({rows.length} total)
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-9 px-3.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-all"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="h-9 px-3.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-all"
            disabled={page >= pages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <CsvImporterModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImportSuccess={() => setImportCount((c) => c + 1)}
      />
    </div>
  );
}
