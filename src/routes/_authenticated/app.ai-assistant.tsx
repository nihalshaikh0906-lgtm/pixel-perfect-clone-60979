import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/ai-assistant")({
  head: () => workspaceHead("AI Assistant"),
  component: Page,
});

type Msg = { role: "user" | "ai"; text: string };

const SEED: Msg[] = [
  { role: "ai", text: "Good morning. I'm your Investment Engineer — ask me about lead priorities, deal math, or how to position a property for a client." },
  { role: "user", text: "Which leads should I call first today?" },
  { role: "ai", text: "Start with the 4 unassigned website leads — they cool fastest. After that, the 8 overdue follow-ups, beginning with anyone who viewed a property in the last 7 days." },
  { role: "user", text: "Draft a WhatsApp opener for a new off-plan lead." },
  { role: "ai", text: "“Hi {name}, thanks for your enquiry about the new launch. I have the full payment plan and availability sheet — would you like me to send the 2-bedroom options first?” Keep it short, one question, no pressure." },
];

const REPLIES = [
  "Based on your current pipeline, I'd prioritise the overdue follow-ups first — warm leads convert far better than cold ones.",
  "For that budget range, focus on communities with strong rental demand and confirm the service charges before quoting yields.",
  "A good opener is short and specific: reference the exact property they enquired about and ask one simple question.",
  "I'd suggest booking the viewing within 48 hours while interest is high, and sending the brochure beforehand.",
];

function Page() {
  const [msgs, setMsgs] = useState<Msg[]>(SEED);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const replyIdx = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking]);

  const send = () => {
    const text = draft.trim();
    if (!text || thinking) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setDraft("");
    setThinking(true);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: REPLIES[replyIdx.current++ % REPLIES.length] ?? REPLIES[0]! }]);
      setThinking(false);
    }, 900);
  };

  return (
    <div style={{ display: "grid", gap: 20, gridTemplateRows: "auto 1fr", minHeight: "calc(100svh - 140px)" }}>
      <div>
        <p className="eyebrow-a">General</p>
        <h1 style={{ margin: 0, fontSize: 32, display: "flex", alignItems: "center", gap: 10 }}>
          Investment Engineer <Sparkles size={22} style={{ color: "var(--a-gold)" }} />
        </h1>
        <p className="a-note" style={{ margin: "6px 0 0" }}>Your AI copilot for leads, deals and client conversations. Demo conversation — nothing is saved.</p>
      </div>

      <div className="a-card" style={{ padding: 0, display: "grid", gridTemplateRows: "1fr auto", overflow: "hidden" }}>
        <div ref={scrollRef} style={{ overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: 320 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div
                className={m.role === "user" ? "a-chip" : undefined}
                style={m.role === "user"
                  ? { maxWidth: "75%", padding: "10px 14px", borderRadius: 14, background: "var(--a-ink)", color: "var(--a-card)", fontSize: 14, lineHeight: 1.5 }
                  : { maxWidth: "75%", padding: "10px 14px", borderRadius: 14, border: "1px solid var(--a-line)", background: "var(--a-card)", fontSize: 14, lineHeight: 1.5 }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {thinking ? (
            <div style={{ display: "flex" }}>
              <div style={{ padding: "10px 14px", borderRadius: 14, border: "1px solid var(--a-line)", fontSize: 14, color: "var(--a-ink-2)" }}>Thinking…</div>
            </div>
          ) : null}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          style={{ display: "flex", gap: 10, padding: 14, borderTop: "1px solid var(--a-line)", background: "var(--a-card)" }}
        >
          <input
            className="a-input"
            style={{ flex: 1, minWidth: 0 }}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about leads, deals, or client replies…"
            aria-label="Message the AI assistant"
          />
          <button type="submit" className="a-btn a-btn-gold" disabled={!draft.trim() || thinking}>
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
