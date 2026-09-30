import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Database, Flame, Search, Star, Wallet } from "lucide-react";

import { TopBar } from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { dubaiGreeting, useBroker, useDubaiClock } from "@/lib/broker";
import { aed, beds, initials, timeAgo } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Cockpit · PropFlow" },
      {
        name: "description",
        content: "Live Dubai inventory, hot leads and AI-qualified pipeline in one command hub.",
      },
      { property: "og:title", content: "Cockpit · PropFlow" },
      {
        property: "og:description",
        content: "Live Dubai inventory, hot leads and AI-qualified pipeline in one command hub.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommandHub,
});

type ClientRow = {
  id: string;
  full_name: string;
  purpose: string | null;
  temperature: string | null;
  stage: string | null;
  budget_min_aed: number | null;
  budget_max_aed: number | null;
  notes: string | null;
  last_contact_at: string | null;
};

function useHubData() {
  return useQuery({
    queryKey: ["hub"],
    queryFn: async () => {
      const [unitsCount, latestProject, clients, shortlists, messages, user] = await Promise.all([
        supabase.from("units").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("updated_at").order("updated_at", { ascending: false }).limit(1),
        supabase
          .from("clients")
          .select(
            "id, full_name, purpose, temperature, stage, budget_min_aed, budget_max_aed, notes, last_contact_at",
          )
          .order("last_contact_at", { ascending: false }),
        supabase.from("shortlists").select("id", { count: "exact", head: true }),
        supabase
          .from("messages")
          .select("client_id, body, channel, direction, created_at")
          .order("created_at", { ascending: false })
          .limit(500),
        supabase.auth.getUser(),
      ]);

      const firstError =
        unitsCount.error ?? latestProject.error ?? clients.error ?? shortlists.error ?? messages.error;
      if (firstError) throw new Error(firstError.message);

      const lastMessage = new Map<string, { body: string | null; channel: string | null; created_at: string }>();
      for (const m of messages.data ?? []) {
        if (m.client_id && !lastMessage.has(m.client_id)) {
          lastMessage.set(m.client_id, { body: m.body, channel: m.channel, created_at: m.created_at! });
        }
      }

      return {
        email: user.data.user?.email ?? "",
        units: unitsCount.count ?? 0,
        inventoryUpdatedAt: latestProject.data?.[0]?.updated_at ?? null,
        clients: (clients.data ?? []) as ClientRow[],
        shortlists: shortlists.count ?? 0,
        lastMessage,
      };
    },
  });
}

function Kpi({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Brain;
}) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between">
        <p className="eyebrow">{label}</p>
        <Icon className="size-5 text-primary" />
      </div>
      <p className="mt-4 font-display text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

type Lane = "offplan" | "ready" | "rental";
function laneOf(client: ClientRow): Lane {
  if (client.purpose === "rental") return "rental";
  if (client.purpose === "ready") return "ready";
  return "offplan";
}
const LANE_LABEL: Record<Lane, string> = { offplan: "Off-Plan", ready: "Ready", rental: "Rental" };

type Filter = "all" | Lane | "vip";

type TopMatch = {
  project_name: string | null;
  unit_number: string | null;
  bedrooms: number | null;
  price_aed: number | null;
  score: number | null;
};

function CommandHub() {
  const { data, isLoading, error } = useHubData();
  const name = useBroker();
  const clock = useDubaiClock();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const clients = data?.clients ?? [];
  const pipeline = clients
    .filter((c) => !["won", "lost"].includes(c.stage ?? ""))
    .reduce((sum, c) => sum + (Number(c.budget_max_aed) || 0), 0);
  const hot = clients.filter((c) => c.temperature === "hot").length;

  const matches = useQueries({
    queries: clients.map((c) => ({
      queryKey: ["top-match", c.id],
      staleTime: 5 * 60_000,
      queryFn: async (): Promise<TopMatch | null> => {
        const { data: rows, error: e } = await supabase.rpc("match_client", {
          p_client_id: c.id,
          p_limit: 1,
        });
        if (e) throw new Error(e.message);
        return ((rows ?? [])[0] as TopMatch | undefined) ?? null;
      },
    })),
  });
  const matchById = new Map(clients.map((c, i) => [c.id, matches[i]]));

  const isVip = (c: ClientRow) => (Number(c.budget_max_aed) || 0) >= 2_000_000;
  const counts = {
    all: clients.length,
    offplan: clients.filter((c) => laneOf(c) === "offplan").length,
    ready: clients.filter((c) => laneOf(c) === "ready").length,
    rental: clients.filter((c) => laneOf(c) === "rental").length,
    vip: clients.filter(isVip).length,
  };
  const pills: { key: Filter; label: string }[] = [
    { key: "all", label: `All Leads (${counts.all})` },
    { key: "offplan", label: `Off-Plan (${counts.offplan})` },
    { key: "ready", label: `Ready (${counts.ready})` },
    { key: "rental", label: `Rental (${counts.rental})` },
    { key: "vip", label: `VIP Golden Visa · AED 2M+ (${counts.vip})` },
  ];

  const q = search.trim().toLowerCase();
  const rows = clients.filter((c) => {
    if (filter === "vip" ? !isVip(c) : filter !== "all" && laneOf(c) !== filter) return false;
    if (!q) return true;
    const m = matchById.get(c.id)?.data;
    return (
      c.full_name.toLowerCase().includes(q) || (m?.project_name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-[1500px] px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h1 className="font-display text-5xl font-semibold">
                {clock ? dubaiGreeting(clock.hour) : "Welcome"}
                {name ? `, ${name.split(" ")[0]}` : ""}
              </h1>
              {clock ? (
                <span className="text-sm tabular-nums text-muted-foreground">
                  GST {clock.label} • Dubai
                </span>
              ) : null}
            </div>
            <p className="mt-4 font-light text-muted-foreground">
              {clients.length} active leads in your book • {hot} flagged hot by the AI. Market scan
              updated {timeAgo(data?.inventoryUpdatedAt)}.
            </p>
          </div>
          <div className="panel flex items-center gap-3 px-5 py-4">
            <Database className="size-5 text-primary" />
            <div>
              <p className="font-semibold">Inventory sync</p>
              <p className="text-sm text-muted-foreground">
                {(data?.units ?? 0).toLocaleString("en-US")} units · updated{" "}
                {timeAgo(data?.inventoryUpdatedAt)}
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <p className="mt-8 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {(error as Error).message}
          </p>
        ) : null}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Active pipeline" value={aed(pipeline)} sub="Sum of open client budgets" icon={Wallet} />
          <Kpi
            label="AI brain status"
            value="Online"
            sub={`${(data?.units ?? 0).toLocaleString("en-US")} units indexed`}
            icon={Brain}
          />
          <Kpi label="Hot leads today" value={String(hot)} sub="Temperature = hot" icon={Flame} />
          <Kpi label="Shortlists" value={String(data?.shortlists ?? 0)} sub="Units saved for clients" icon={Star} />
        </div>

        <section className="panel mt-8 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">Client Pipeline</h2>
              <p className="text-sm text-muted-foreground">Every lead with its best-matched unit</p>
            </div>
            <label className="flex w-full items-center gap-2 rounded-full border border-primary/40 bg-card px-4 py-2 sm:w-72">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search client or project"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {pills.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setFilter(p.key)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  filter === p.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-5 divide-y divide-border">
            {isLoading ? <p className="py-4 text-sm text-muted-foreground">Loading leads…</p> : null}
            {!isLoading && rows.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">No leads match this view.</p>
            ) : null}
            {rows.map((client) => {
              const message = data?.lastMessage.get(client.id);
              const mq = matchById.get(client.id);
              const m = mq?.data;
              const score = m?.score != null ? Math.min(99, Math.round(m.score)) : 0;
              return (
                <Link
                  key={client.id}
                  to="/client/$id"
                  params={{ id: client.id }}
                  className="grid gap-4 rounded-xl px-3 py-4 transition-colors hover:bg-secondary/50 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
                >
                  <div className="flex min-w-0 gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                      {initials(client.full_name)}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold">{client.full_name}</p>
                        <span className="rounded-full border border-primary/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-primary">
                          {LANE_LABEL[laneOf(client)]}
                        </span>
                        {client.temperature === "hot" ? (
                          <span className="flex items-center gap-1 rounded-full border border-hot/50 bg-hot/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-hot">
                            <Flame className="size-3" /> Hot
                          </span>
                        ) : (
                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                            {client.temperature ?? "warm"}
                          </span>
                        )}
                        {message?.channel ? (
                          <span className="text-xs capitalize text-muted-foreground">{message.channel}</span>
                        ) : null}
                      </div>
                      <p className="text-sm font-medium">
                        {aed(client.budget_min_aed)} – {aed(client.budget_max_aed)}
                      </p>
                      {client.notes || message?.body ? (
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {client.notes ?? message?.body}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      {mq?.isLoading ? (
                        <p className="text-sm text-muted-foreground">Matching inventory…</p>
                      ) : mq?.error ? (
                        <p className="truncate text-sm text-destructive">{(mq.error as Error).message}</p>
                      ) : m ? (
                        <>
                          <p className="truncate text-sm font-semibold">
                            {m.project_name ?? "Project"}
                            {m.unit_number ? ` • ${m.unit_number}` : ""}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {beds(m.bedrooms)} • {aed(m.price_aed)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">No matching unit yet</p>
                      )}
                    </div>
                    {m && score > 0 ? (
                      <span className="shrink-0 rounded-full border border-primary px-2.5 py-1 text-xs font-semibold text-primary">
                        {score}% Match
                      </span>
                    ) : null}
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                      View Dossier <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
