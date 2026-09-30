import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Database, Flame, Star, Target, Wallet } from "lucide-react";

import { TopBar } from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { aed, initials, timeAgo } from "@/lib/format";

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

function columnOf(client: ClientRow) {
  if (client.purpose === "rental") return "rental";
  if (client.purpose === "ready") return "ready";
  return "offplan";
}

const COLUMNS = [
  { key: "offplan", title: "Off-Plan Leads", subtitle: "Launch & payment-plan buyers" },
  { key: "rental", title: "Rental Leads", subtitle: "Lease & relocation demand" },
  { key: "ready", title: "Ready Properties Leads", subtitle: "Vacant, transfer-ready stock" },
] as const;

function CommandHub() {
  const { data, isLoading, error } = useHubData();

  const clients = data?.clients ?? [];
  const pipeline = clients
    .filter((c) => !["won", "lost"].includes(c.stage ?? ""))
    .reduce((sum, c) => sum + (Number(c.budget_max_aed) || 0), 0);
  const hot = clients.filter((c) => c.temperature === "hot").length;

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-[1500px] px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl font-semibold">
              {greeting()}
              {data?.email ? "," : "."}
            </h1>
            {data?.email ? (
              <p className="mt-2 font-display text-2xl text-primary">{data.email}</p>
            ) : null}
            <p className="mt-4 text-muted-foreground">
              {clients.length} live leads in your book · {hot} flagged hot by the AI. Start with the
              hot board.
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
          <Kpi
            label="Active pipeline"
            value={aed(pipeline)}
            sub="Sum of open client budgets"
            icon={Wallet}
          />
          <Kpi
            label="AI brain status"
            value="Online"
            sub={`${(data?.units ?? 0).toLocaleString("en-US")} units indexed`}
            icon={Brain}
          />
          <Kpi label="Hot leads today" value={String(hot)} sub="Temperature = hot" icon={Flame} />
          <Kpi
            label="Shortlists"
            value={String(data?.shortlists ?? 0)}
            sub="Units saved for clients"
            icon={Star}
          />
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-3">
          {COLUMNS.map((column) => {
            const rows = clients.filter((c) => columnOf(c) === column.key);
            return (
              <section key={column.key} className="panel p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{column.title}</h2>
                    <p className="text-sm text-muted-foreground">{column.subtitle}</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                    <Target className="size-3.5" />
                    {rows.length}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading leads…</p>
                  ) : null}
                  {!isLoading && rows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No leads in this lane yet.</p>
                  ) : null}
                  {rows.map((client) => {
                    const message = data?.lastMessage.get(client.id);
                    return (
                      <Link
                        key={client.id}
                        to="/client/$id"
                        params={{ id: client.id }}
                        className="block rounded-xl border border-border bg-secondary/35 p-4 transition-all hover:-translate-y-0.5 hover:bg-secondary/60 hover:glow-ring"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex size-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
                            {initials(client.full_name)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">{client.full_name}</p>
                            <p className="truncate text-sm text-muted-foreground">
                              {client.stage ?? "new"} · {client.purpose ?? "off-plan"}
                            </p>
                          </div>
                          {client.temperature === "hot" ? (
                            <span className="flex items-center gap-1 rounded-full border border-hot/50 bg-hot/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-hot">
                              <Flame className="size-3" /> Hot
                            </span>
                          ) : (
                            <span className="rounded-full border border-border px-2.5 py-1 text-xs uppercase tracking-wider text-muted-foreground">
                              {client.temperature ?? "warm"}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-sm">
                          <span className="text-muted-foreground">Budget</span>
                          <span className="font-medium">
                            {aed(client.budget_min_aed)} – {aed(client.budget_max_aed)}
                          </span>
                        </div>

                        {client.notes ? (
                          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                            {client.notes}
                          </p>
                        ) : null}

                        {message ? (
                          <p className="mt-3 truncate text-xs text-muted-foreground">
                            {message.channel ?? "message"} · {timeAgo(message.created_at)} ·{" "}
                            {message.body}
                          </p>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
