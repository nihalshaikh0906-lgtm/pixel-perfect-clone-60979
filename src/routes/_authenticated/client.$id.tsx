import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, CalendarCheck, CheckSquare, Flame, Loader2, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PropertyPackDrawer } from "@/components/PropertyPackDrawer";
import { TopBar } from "@/components/TopBar";
import { UnitCard, type MatchRow } from "@/components/UnitCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { endMeeting } from "@/lib/assistant.functions";
import { aed, quarterOf, timeAgo } from "@/lib/format";

function mergeUnits(prev: MatchRow[], add: MatchRow[]) {
  const seen = new Set(prev.map((u) => u.unit_id));
  return [...prev, ...add.filter((u) => !seen.has(u.unit_id))];
}

export const Route = createFileRoute("/_authenticated/client/$id")({
  head: () => ({
    meta: [
      { title: "Client dossier · Deal OS" },
      {
        name: "description",
        content: "Client profile, AI unit recommendations and the Investment Engineer chat.",
      },
      { property: "og:title", content: "Client dossier · Deal OS" },
      {
        property: "og:description",
        content: "Client profile, AI unit recommendations and the Investment Engineer chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dossier,
});

type ChatMessage = { role: "user" | "assistant"; content: string; at: string };

function Dossier() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const wrapUp = useServerFn(endMeeting);

  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [aiUnits, setAiUnits] = useState<MatchRow[] | null>(null);
  const [openUnit, setOpenUnit] = useState<MatchRow | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const clientQuery = useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const [client, messages, followups, meetings] = await Promise.all([
        supabase.from("clients").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("messages")
          .select("*")
          .eq("client_id", id)
          .order("created_at", { ascending: false }),
        supabase.from("followups").select("*").eq("client_id", id).order("due_at"),
        supabase
          .from("meetings")
          .select("*")
          .eq("client_id", id)
          .order("starts_at", { ascending: false }),
      ]);
      const firstError = client.error ?? messages.error ?? followups.error ?? meetings.error;
      if (firstError) throw new Error(firstError.message);
      return {
        client: client.data,
        messages: messages.data ?? [],
        followups: followups.data ?? [],
        meetings: meetings.data ?? [],
      };
    },
  });

  const matchQuery = useQuery({
    queryKey: ["match", id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("match_client", { p_client_id: id, p_limit: 4 });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as MatchRow[];
    },
  });

  // Session context: every unit shown this session (Top 4 + AI-found), packs cached once.
  const [sessionUnits, setSessionUnits] = useState<MatchRow[]>([]);
  useEffect(() => {
    if (matchQuery.data) setSessionUnits((prev) => mergeUnits(prev, matchQuery.data));
  }, [matchQuery.data]);

  const packQueries = useQueries({
    queries: sessionUnits.map((u) => ({
      queryKey: ["pack", u.project_id, u.unit_id],
      staleTime: Infinity,
      gcTime: Infinity,
      queryFn: async () => {
        const { data, error } = await supabase.rpc("get_property_pack", {
          p_project_id: u.project_id,
          p_unit_id: u.unit_id,
        });
        if (error) throw new Error(error.message);
        return data;
      },
    })),
  });

  function buildContext() {
    return sessionUnits
      .map((u, i) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pack = packQueries[i]?.data as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const plan = Array.isArray(pack?.payment_plans) ? pack.payment_plans[0] : null;
        const steps = Array.isArray(plan?.steps)
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            plan.steps.map((s: any) => `${s.step} ${s.percent}%`).join(", ")
          : "unknown";
        const docs = Array.isArray(pack?.documents)
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [...new Set(pack.documents.map((d: any) => d.type))].join(", ") || "none"
          : "unknown";
        return `${i + 1}. ${u.project_name} (${u.developer ?? "?"}) project_id=${u.project_id} unit_id=${u.unit_id} | ${u.district ?? "?"} | ${u.bedrooms ?? "?"}BR | ${u.size_sqft ?? "?"} sqft | AED ${u.price_aed ?? "?"} | handover ${quarterOf(u.handover_date)} | match ${Math.round(u.score ?? 0)}% | plan: ${plan?.name ?? "?"}: ${steps} | docs: ${docs}`;
      })
      .join("\n");
  }

  async function fetchRows(refs: { project_id: number; unit_id: number; score: number }[]) {
    const { data } = await supabase
      .from("units")
      .select("id, project_id, bedrooms, size_sqft, price_aed, projects(name, developer_name, district, handover_date, cover_image_url)")
      .in("id", refs.map((r) => r.unit_id));
    return (data ?? []).map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = (u as any).projects ?? {};
      return {
        unit_id: Number(u.id),
        project_id: Number(u.project_id),
        project_name: p.name ?? null,
        developer: p.developer_name ?? null,
        district: p.district ?? null,
        price_aed: u.price_aed as number | null,
        bedrooms: u.bedrooms as number | null,
        size_sqft: u.size_sqft as number | null,
        handover_date: p.handover_date ?? null,
        cover_image_url: p.cover_image_url ?? null,
        score: refs.find((r) => r.unit_id === Number(u.id))?.score ?? 0,
      } as MatchRow;
    });
  }

  const [pending, setPending] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [askError, setAskError] = useState<Error | null>(null);

  async function ask(question: string) {
    setPending(true);
    setStreaming(false);
    setAskError(null);
    const history = [...chat, { role: "user" as const, content: question }]
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));
    try {
      const { data: sess } = await supabase.auth.getSession();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${sess.session?.access_token ?? ""}`,
        },
        body: JSON.stringify({ client_id: id, messages: history, context: buildContext() }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => null);
        throw new Error(`Error ${res.status}: ${j?.error ?? res.statusText}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let started = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (!line.trim()) continue;
          const ev = JSON.parse(line);
          if (ev.type === "text") {
            if (!started) {
              started = true;
              setStreaming(true);
              setChat((prev) => [...prev, { role: "assistant", content: "", at: new Date().toISOString() }]);
            }
            setChat((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = { ...last, content: last.content + ev.delta };
              return next;
            });
          } else if (ev.type === "units") {
            const rows = await fetchRows(ev.units);
            if (rows.length) {
              setAiUnits(rows);
              setSessionUnits((prev) => mergeUnits(prev, rows));
            }
          } else if (ev.type === "error") {
            throw new Error(ev.message);
          }
        }
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setAskError(err);
      toast.error(err.message);
    } finally {
      setPending(false);
      setStreaming(false);
    }
  }

  const askMutation = { isPending: pending && !streaming, error: askError };

  const endMeetingMutation = useMutation({
    mutationFn: async () =>
      wrapUp({
        data: { client_id: id, messages: chat.map((m) => ({ role: m.role, content: m.content })) },
      }),
    onSuccess: async () => {
      toast.success("Meeting saved with AI summary");
      await queryClient.invalidateQueries({ queryKey: ["client", id] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const client = clientQuery.data?.client;
  const units = aiUnits ?? matchQuery.data ?? [];

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat, pending]);

  function send() {
    const question = input.trim();
    if (!question || pending) return;
    setChat((prev) => [...prev, { role: "user", content: question, at: new Date().toISOString() }]);
    setInput("");
    void ask(question);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar
        back
        title={
          <span>
            {client?.full_name ?? "Client"}{" "}
            <span className="text-muted-foreground">· {client?.source ?? "lead"}</span>
          </span>
        }
        subtitle={`${client?.purpose ?? "off-plan"} lead · ${client?.stage ?? "new"}`}
        right={
          client?.temperature === "hot" ? (
            <span className="flex items-center gap-1 rounded-full border border-hot/50 bg-hot/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-hot">
              <Flame className="size-3.5" /> Hot
            </span>
          ) : null
        }
      />

      {clientQuery.error ? (
        <p className="m-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {(clientQuery.error as Error).message}
        </p>
      ) : null}

      <div className="grid flex-1 gap-6 px-6 py-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* Left: profile + recommendations */}
        <div className="space-y-6">
          <section className="panel p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="size-4 text-primary" /> AI Client Summary
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Field label="Budget" value={`${aed(client?.budget_min_aed)} – ${aed(client?.budget_max_aed)}`} />
              <Field label="Nationality" value={client?.nationality ?? "—"} />
              <Field label="Intent" value={client?.purpose ?? "—"} />
              <Field label="Areas" value={(client?.preferred_areas ?? []).join(", ") || client?.preferred_location || "—"} />
              <Field label="Handover before" value={quarterOf(client?.handover_before)} />
              <Field label="Payment" value={client?.payment_preference ?? "—"} />
              <Field label="Phone" value={client?.phone ?? "—"} />
            </dl>
            {client?.notes ? (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{client.notes}</p>
            ) : null}
            {client?.ai_summary ? (
              <p className="mt-4 whitespace-pre-line rounded-lg border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
                {client.ai_summary}
              </p>
            ) : null}
          </section>

          <section>
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">AI Recommendations</h2>
              <span className="eyebrow">{aiUnits ? "From AI answer" : "Top 4 matches"}</span>
            </div>
            {matchQuery.isLoading ? (
              <p className="mt-4 text-sm text-muted-foreground">Scoring inventory…</p>
            ) : null}
            {matchQuery.error ? (
              <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {(matchQuery.error as Error).message}
              </p>
            ) : null}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {units.map((row) => (
                <UnitCard key={row.unit_id} row={row} onOpen={setOpenUnit} />
              ))}
            </div>
          </section>

          <section className="panel p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <CheckSquare className="size-4 text-primary" /> Follow-ups & meetings
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {(clientQuery.data?.followups ?? []).map((f) => (
                <li key={f.id} className="flex justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2">
                  <span className={f.done ? "line-through text-muted-foreground" : ""}>{f.title}</span>
                  <span className="text-muted-foreground">{timeAgo(f.due_at)}</span>
                </li>
              ))}
              {(clientQuery.data?.meetings ?? []).map((m) => (
                <li key={m.id} className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <CalendarCheck className="size-3.5" /> {timeAgo(m.starts_at)}
                  </p>
                  <p className="mt-1 whitespace-pre-line">{m.ai_summary ?? m.summary}</p>
                </li>
              ))}
              {!clientQuery.data?.followups.length && !clientQuery.data?.meetings.length ? (
                <li className="text-muted-foreground">Nothing scheduled yet.</li>
              ) : null}
            </ul>
          </section>

          <section className="panel p-5">
            <h2 className="text-lg font-semibold">Message history</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {(clientQuery.data?.messages ?? []).map((m) => (
                <li key={m.id} className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
                  <p className="eyebrow">
                    {m.channel} · {m.direction} · {timeAgo(m.created_at)}
                  </p>
                  <p className="mt-1">{m.body}</p>
                </li>
              ))}
              {!clientQuery.data?.messages.length ? (
                <li className="text-muted-foreground">No messages yet.</li>
              ) : null}
            </ul>
          </section>
        </div>

        {/* Right: AI chat */}
        <div className="panel flex h-[calc(100dvh-9rem)] min-h-[420px] flex-col self-start lg:sticky lg:top-24">
          <div ref={messagesRef} className="flex-1 space-y-5 overflow-y-auto p-6">
            {chat.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ask the Investment Engineer anything about this client. It only answers from your
                live inventory.
              </p>
            ) : null}
            {chat.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </span>
                <div
                  className={`max-w-[78%] rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "border-primary/40 bg-primary/15"
                      : "border-border bg-secondary/45"
                  }`}
                >
                  <p className="eyebrow mb-1">
                    {m.role === "user" ? "You" : "Investment Engineer"} ·{" "}
                    {new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="whitespace-pre-line">
                    {m.content.split(/(\*\*[^*]+\*\*)/g).map((part, k) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={k} className="font-semibold text-foreground">
                          {part.slice(2, -2)}
                        </strong>
                      ) : (
                        <span key={k}>{part}</span>
                      ),
                    )}
                  </p>
                </div>
              </div>
            ))}
            {askMutation.isPending ? (
              <p className="flex items-center gap-2 text-sm text-primary">
                <Loader2 className="size-4 animate-spin" /> Scanning inventory…
              </p>
            ) : null}
            {askMutation.error ? (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {(askMutation.error as Error).message}
              </p>
            ) : null}
          </div>

          <div className="space-y-3 border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="ml-2 size-4 shrink-0 text-primary" />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask the Investment Engineer anything about this client…"
                className="border-0 bg-transparent focus-visible:ring-0"
              />
              <Button size="icon" onClick={send} disabled={askMutation.isPending}>
                <Send className="size-4" />
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full"
              onClick={() => endMeetingMutation.mutate()}
              disabled={endMeetingMutation.isPending}
            >
              {endMeetingMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              End Meeting &amp; Save AI Summary
            </Button>
          </div>
        </div>
      </div>

      <PropertyPackDrawer
        unit={openUnit}
        clientId={id}
        clientPhone={client?.phone ?? null}
        onClose={() => setOpenUnit(null)}
      />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
