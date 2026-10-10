import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Building2, Construction, Key, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inventorySummaryOptions, projectPageOptions } from "@/lib/inventory.functions";
import { INVENTORY_PAGE_SIZE } from "@/lib/inventory-category";
import { aed, quarterOf } from "@/lib/format";

const count = (n: number) => n.toLocaleString("en-US");

const CATEGORIES = [
  { key: "offplan", label: "Off-Plan Developments", to: "/app/offplan", Icon: Construction, desc: "Under construction with DLD escrow" },
  { key: "ready", label: "Secondary / Ready Property", to: "/app/listings", Icon: Building2, desc: "Handed over & title deed ready" },
  { key: "rental", label: "Tenancies & Rentals", to: "/app/rentals", Icon: Key, desc: "Ejari registered leasehold assets" },
] as const;

export function OwnerDashboard({ page = 1, onPage }: { page?: number; onPage?: (page: number) => void }) {
  const { data } = useSuspenseQuery(inventorySummaryOptions());
  const { data: projects } = useSuspenseQuery(projectPageOptions(page));

  const metrics = [
    { label: "Master Developments", value: count(data.projects), sub: "Verified Dubai projects", icon: Construction },
    { label: "Indexed Tower Units", value: count(data.units), sub: `${count(data.available)} currently available`, icon: Building2 },
    { label: "Active Live Inventory", value: count(data.available), sub: "Ready for investor matching", icon: ShieldCheck },
    { label: "Total Asset Value", value: aed(data.value), sub: "Aggregated inventory volume", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* ═══ EXECUTIVE BANNER ═══ */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Company Owner View</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">Portfolio Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
            Dubai Executive Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time synchronization across 1,450+ developments and verified escrow accounts.
          </p>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 self-start sm:self-center">
          DLD Registry Connected
        </span>
      </div>

      {/* ═══ METRICS CARDS ═══ */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">{m.label}</span>
                <Icon className="size-4 text-primary" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{m.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ═══ CATEGORY CARDS ═══ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CATEGORIES.map(({ key, label, to, Icon, desc }) => (
          <Link
            key={key}
            to={to}
            className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/50 transition-all hover:shadow-md block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Icon className="size-4" />
                <span>{label}</span>
              </div>
              <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="mt-3 text-2xl font-extrabold text-foreground font-display">
              {count(data.categories[key].units)} Units
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {count(data.categories[key].available)} available · {aed(data.categories[key].value)}
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground/80 border-t border-border/50 pt-2">{desc}</p>
          </Link>
        ))}
      </div>

      {/* ═══ ALL PROJECTS TABLE ═══ */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Dubai Developments Registry</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Master developments active in your DealOS database</p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
            {count(projects.count)} Projects
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="py-3.5 pl-5">Project Name</th>
                <th className="py-3.5">Master Developer</th>
                <th className="py-3.5">Community</th>
                <th className="py-3.5">Target Handover</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 text-right pr-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {projects.rows.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-3.5 pl-5 font-bold text-foreground">
                    <Link to="/app/project/$id" params={{ id: String(p.id) }} className="hover:text-primary transition-colors">
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-3.5 text-muted-foreground text-xs">{p.developer_name ?? "—"}</td>
                  <td className="py-3.5 text-muted-foreground text-xs">{p.district ?? "Dubai"}</td>
                  <td className="py-3.5 font-mono text-xs">{quarterOf(p.handover_date)}</td>
                  <td className="py-3.5">
                    <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground capitalize">
                      {(p.sale_status ?? "Active").replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-5">
                    <Link
                      to="/app/project/$id"
                      params={{ id: String(p.id) }}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View Dossier →
                    </Link>
                  </td>
                </tr>
              ))}
              {!projects.rows.length && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No developments indexed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Page {page} of {Math.max(1, Math.ceil(projects.count / INVENTORY_PAGE_SIZE))}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={page <= 1 || !onPage}
              onClick={() => onPage?.(page - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={page * INVENTORY_PAGE_SIZE >= projects.count || !onPage}
              onClick={() => onPage?.(page + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
