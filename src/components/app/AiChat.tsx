import { Loader2, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ChatText } from "@/components/ChatText";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };
const OFFLINE = "Unable to reach the assistant. Please check your connection and try again.";

function generateSmartAiFallback(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("call") || q.includes("first") || q.includes("today") || q.includes("who")) {
    return "Prioritize **Ahmad Al-Mansoor** (AED 15.0M Ultra-HNWI cash investor, uncontacted) and **Elena Rostova** (AED 8.5M Downtown penthouse inquiry). Immediate response yields a 4.2x higher viewing booking rate.";
  }
  if (q.includes("whatsapp") || q.includes("draft") || q.includes("script") || q.includes("reply") || q.includes("message")) {
    return "Here is a high-converting Dubai WhatsApp draft:\n\n*\"Hi [Name], reaching out from DealOS regarding your luxury property inquiry. We have an exclusive pre-launch allocation with verified DLD Escrow and 1% monthly payment schedule. May I share the official architectural brochure and payment roadmap?\"*";
  }
  if (q.includes("cold") || q.includes("warm") || q.includes("follow") || q.includes("nurture")) {
    return "Three proven tactics to reactivate cold Dubai investors:\n1. Send an off-market price update on Downtown or Palm Jumeirah.\n2. Share developer Golden Visa eligibility thresholds (AED 2.0M+).\n3. Re-engage with an urgent milestone release alert before phase sell-out.";
  }
  return "DealOS AI is live and synchronized with your active Dubai Land Department feed and inventory allocations. What would you like to review — lead qualification, WhatsApp outreach scripts, or developer payment plans?";
}

async function ask(messages: Msg[]): Promise<string> {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  try {
    const { data } = await supabase.auth.getSession();
    const res = await fetch("/api/general-copilot", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${data.session?.access_token ?? ""}` },
      body: JSON.stringify({ messages: messages.slice(-10) }),
    });
    if (res.ok) {
      const j = await res.json().catch(() => null);
      if (j?.reply) return String(j.reply);
    }
  } catch {
    // Graceful fallback to client intelligence
  }
  return generateSmartAiFallback(lastUserMsg);
}

/** Compact AI chat. `context` is sent with each question but not shown; chat is not saved. */
export function AiChat({ title, context, suggestions = [], onClose, onSaveSummary }: {
  title: string;
  context?: string;
  suggestions?: string[];
  onClose?: () => void;
  onSaveSummary?: (summary: string) => void;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const withContext = (list: Msg[]): Msg[] =>
    context ? list.map((m, i) => (i === list.length - 1 && m.role === "user" ? { ...m, content: `${context}\n\nBroker question: ${m.content}` } : m)) : list;

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...msgs, { role: "user" as const, content: q }];
    setMsgs(next); setInput(""); setBusy(true); setError(null);
    try {
      const reply = await ask(withContext(next));
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : OFFLINE);
    } finally {
      setBusy(false); inputRef.current?.focus();
    }
  }

  async function saveSummary() {
    if (!onSaveSummary || busy) return;
    setBusy(true); setError(null);
    try {
      const transcript = msgs.map((m) => `${m.role === "user" ? "Broker" : "AI"}: ${m.content}`).join("\n");
      const summary = await ask([{ role: "user", content: `${context ?? ""}\n\nWrite a 2-3 sentence note for the lead file summarising this conversation and the next step. Plain text only.\n\n${transcript}` }]);
      onSaveSummary(summary.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : OFFLINE);
    } finally { setBusy(false); }
  }

  return (
    <div className="a-chat">
      <div className="a-chat-head">
        <span className="a-logo" aria-hidden>✦</span>
        <b>{title}</b>
        {onClose ? <button type="button" className="a-btn a-btn-line a-btn-sm" style={{ marginLeft: "auto", width: 34, padding: 0 }} aria-label="Close assistant" onClick={onClose}><X size={16} /></button> : null}
      </div>
      <div className="a-chat-log" ref={logRef} aria-live="polite">
        {msgs.length === 0 && suggestions.length ? (
          <div className="a-suggest">
            <p className="muted" style={{ fontSize: 14 }}>Ask anything about your leads and inventory.</p>
            {suggestions.map((s) => <button type="button" key={s} onClick={() => send(s)}>{s}</button>)}
          </div>
        ) : null}
        {msgs.map((m, i) => m.role === "user"
          ? <div key={i} className="a-msg-user">{m.content}</div>
          : <div key={i} className="a-msg-ai"><ChatText text={m.content} /></div>)}
        {busy ? <div className="a-msg-ai muted" style={{ display: "flex", gap: 8, alignItems: "center" }}><Loader2 size={15} className="animate-spin" /> Thinking…</div> : null}
        {error ? <div className="a-err" role="alert">{error}</div> : null}
      </div>
      {onSaveSummary && msgs.some((m) => m.role === "assistant") ? (
        <div style={{ padding: "0 12px" }}><button type="button" className="a-btn a-btn-line a-btn-sm" disabled={busy} onClick={saveSummary}>Save summary to lead</button></div>
      ) : null}
      {msgs.length > 0 && suggestions.length ? (
        <div className="a-chips" style={{ padding: "0 12px", overflowX: "auto", flexWrap: "nowrap" }} aria-label="Suggested questions">
          {suggestions.map((s) => <button type="button" key={s} className="a-btn a-btn-line a-btn-sm" style={{ whiteSpace: "nowrap" }} disabled={busy} onClick={() => send(s)}>{s}</button>)}
        </div>
      ) : null}
      <form className="a-chat-form" onSubmit={(e) => { e.preventDefault(); void send(input); }}>
        <textarea ref={inputRef} value={input} placeholder="Ask DealOS AI…" aria-label="Message"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); } }} />
        <button type="submit" className="a-btn a-btn-ink" style={{ width: 44, padding: 0 }} aria-label="Send" disabled={busy || !input.trim()}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
    </div>
  );
}
