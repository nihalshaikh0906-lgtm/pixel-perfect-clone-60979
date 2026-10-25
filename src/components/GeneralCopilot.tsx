import { Loader2, MessageSquare, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ChatText } from "@/components/ChatText";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };
const ENDPOINT = (import.meta.env["VITE_GENERAL_CHAT_ENDPOINT"] as string | undefined) || "/api/general-copilot";
const OFFLINE = "Unable to reach assistant service. Please check connection.";

/** Floating bottom-right general AI chat, available on every signed-in page. */
export function GeneralCopilot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    setError(null);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 60000);
    try {
      const { data } = await supabase.auth.getSession();
      const res = await fetch(ENDPOINT, {
        method: "POST",
        signal: ctrl.signal,
        headers: { "content-type": "application/json", authorization: `Bearer ${data.session?.access_token ?? ""}` },
        body: JSON.stringify({ channel: "general_copilot", message: text, messages: next.slice(-10) }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) throw new Error(j?.error ?? OFFLINE);
      const reply = typeof j === "string" ? j : (j?.reply ?? j?.message ?? j?.text ?? "");
      if (!reply) throw new Error(OFFLINE);
      setMsgs((m) => [...m, { role: "assistant", content: String(reply) }]);
    } catch (e) {
      const msg = e instanceof Error && e.name !== "AbortError" && !/fetch/i.test(e.message) ? e.message : OFFLINE;
      setError(msg);
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open DealOS Copilot"
        className="fixed right-6 bottom-6 z-40 flex size-12 sm:size-14 items-center justify-center rounded-full border border-primary/40 bg-[#0B0F19] text-primary shadow-2xl hover:border-primary hover:bg-primary hover:text-white transition-all hover:scale-105 cursor-pointer"
      >
        <MessageSquare className="size-5" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-md [&>button]:hidden border-l border-border/80">
          <SheetHeader className="flex-row items-center justify-between border-b border-border/80 bg-card px-5 py-4">
            <div>
              <SheetTitle className="text-[13px] uppercase tracking-[0.18em] text-foreground font-mono font-bold">DealOS Copilot</SheetTitle>
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-mono">Ask anything</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="size-5" />
            </button>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 text-[15px] leading-[1.6]">
            {msgs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Market trends, a client email, a listing description, a negotiation strategy — ask me anything.
              </p>
            ) : null}
            {msgs.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="ml-auto max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground font-medium">
                  {m.content}
                </div>
              ) : (
                <div key={i} className="max-w-full text-foreground bg-card p-3 rounded-2xl border border-border/80">
                  <ChatText text={m.content} />
                </div>
              ),
            )}
            {busy ? (
              <span className="shimmer-text inline-flex items-center gap-2 rounded-full border border-primary/40 px-3 py-1 text-xs font-medium text-primary">
                <Loader2 className="size-3 animate-spin text-primary" /> DealOS is thinking…
              </span>
            ) : null}
            {error ? (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="flex items-end gap-2 border-t border-border p-4 bg-card/60">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Ask DealOS Copilot…"
              rows={2}
              className="min-h-0 resize-none bg-background border-border/80 text-foreground"
            />
            <Button size="icon" onClick={send} disabled={busy || !input.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer" aria-label="Send">
              <Send className="size-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
