import { createFileRoute } from "@tanstack/react-router";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { useBrokerProfile } from "@/lib/broker";
import {
  Sparkles, Plus, Mic, Send, Paperclip, User, Building2, Users, FileText,
  X, Check, ArrowRight, CornerDownLeft, RefreshCw, Copy, CheckCheck,
  ChevronDown, Flame, ShieldCheck, Zap
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/ai-assistant")({
  head: () => workspaceHead("AI Assistant"),
  component: GeminiAssistantPage,
});

type AttachedItem = {
  id: string;
  type: "lead" | "project" | "agent" | "file";
  label: string;
  sub?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: AttachedItem[];
  timestamp: string;
};

const SAMPLE_LEADS: AttachedItem[] = [
  { id: "lead-1", type: "lead", label: "Michael Thorne", sub: "UK Investor · Budget: AED 1.2M · 1BR DLRC" },
  { id: "lead-2", type: "lead", label: "Dr. Tariq Al-Mansoor", sub: "Saudi HNWI · Budget: AED 3.5M · Luxury Villa" },
  { id: "lead-3", type: "lead", label: "Elena Rostova", sub: "European Buyer · Budget: AED 850K · Studio JVC" },
];

const SAMPLE_PROJECTS: AttachedItem[] = [
  { id: "proj-1", type: "project", label: "Reef Luxury 995 (DLRC)", sub: "From AED 684K · Q4 2026 · 10/40/50 Handover" },
  { id: "proj-2", type: "project", label: "Bayz 102 by Danube", sub: "Business Bay · 1% Monthly Plan · Handover Dec 2028" },
  { id: "proj-3", type: "project", label: "Sobha Orbis (Motor City)", sub: "From AED 980K · 80/20 Payment Plan · 2027 Handover" },
];

const SAMPLE_AGENTS: AttachedItem[] = [
  { id: "agent-1", type: "agent", label: "Aisha Khan", sub: "Top Producer · 14 Deals · Avg speed: 3.2 min" },
  { id: "agent-2", type: "agent", label: "Saad Malik", sub: "Action Needed · 5 Deals · Avg speed: 18.2 min" },
];


export function GeminiAssistantPage() {
  const profile = useBrokerProfile();
  const userName = profile?.name?.split(" ")[0] || "Nihal";
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<AttachedItem[]>([]);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "leads" | "projects" | "agents">("all");
  const [isRecording, setIsRecording] = useState(false);
  const [aiModel, setAiModel] = useState<"Pro" | "Fast" | "Audit">("Pro");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleAttachItem = (item: AttachedItem) => {
    if (attachments.some((a) => a.id === item.id)) {
      toast.info(`${item.label} is already attached.`);
      return;
    }
    setAttachments((prev) => [...prev, item]);
    setAttachMenuOpen(false);
    toast.success(`Attached ${item.label} as context`);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const item: AttachedItem = {
        id: `file-${Date.now()}`,
        type: "file",
        label: file.name,
        sub: `${(file.size / 1024).toFixed(0)} KB · ${file.type || "Document"}`,
      };
      setAttachments((prev) => [...prev, item]);
      setAttachMenuOpen(false);
      toast.success(`File ${file.name} uploaded as AI context`);
    }
  };

  const handleSend = (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: prompt,
      attachments: [...attachments],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachments([]);
    setIsTyping(true);

    // Simulate AI response crafted for Dubai Real Estate Context
    setTimeout(() => {
      let responseText = "";
      const attachedLead = userMsg.attachments?.find((a) => a.type === "lead");
      const attachedProj = userMsg.attachments?.find((a) => a.type === "project");

      if (attachedLead && attachedProj) {
        responseText = `### Strategic Investor Match: ${attachedLead.label} ➔ ${attachedProj.label}

**1. Compatibility Score: 96% Match**
* **Investor Profile:** ${attachedLead.sub}
* **Project Specifications:** ${attachedProj.sub}

**2. High-Converting WhatsApp Pitch (1-Click Copy):**
> *"Hi ${attachedLead.label.split(" ")[0]}, following up on our conversation regarding high-yield off-plan opportunities. I secured an exclusive developer allocation for **${attachedProj.label}** that matches your exact criteria with an attractive milestone payment plan. Handover is projected with verified DLD escrow registration. Would you like me to share the complete project dossier and floor plans today?"*

**3. Strategic Key Talking Points:**
* **Escrow Guarantee:** Project is registered under Dubai Land Department (DLD) with approved bank escrow.
* **Capital Appreciation:** Area enjoys 8.2% historical capital yield growth.
* **Next Action:** Recommend issuing an EOI reservation holding slip before developer price revision.`;
      } else if (prompt.toLowerCase().includes("stalled") || prompt.toLowerCase().includes("deals")) {
        responseText = `### Executive Stalled Deals Recovery Plan

We audited **5 buyer deals worth AED 5.8M** currently delayed in negotiation:

1. **Michael Thorne (AED 1.2M - DLRC):**
   * *Stall Reason:* Hesitant on post-handover payment structure.
   * *Solution:* Offer the **Danube 1% monthly** or **Reef 995 10/40/50 plan**. Both provide post-handover flexibility.

2. **Dr. Tariq (AED 3.5M - Luxury Villa):**
   * *Stall Reason:* Awaiting title deed clearance on secondary resale.
   * *Solution:* Pivot to developer-direct off-plan villa with 0% DLD registration fee waiver.

**Action Item:** Dispatched VIP WhatsApp follow-ups to both investors. Estimated recovery timeline: 48-72 hours.`;
      } else {
        responseText = `### DealOS Strategic Copilot Analysis

I've processed your query: **"${prompt}"**

**Key Recommendations:**
1. **Target Opportunity:** Focus on prime Dubai developments with guaranteed rental returns (7-9% net yield) and verified DLD escrow accounts.
2. **Speed-to-Lead Protocol:** Ensure contact within 5 minutes of enquiry to maintain our 92% first-call conversion benchmark.
3. **Collateral Generated:** Ready to draft official RERA Form A/B agreements or custom WhatsApp brochures on your command.

*Would you like me to attach an investor lead or project dossier to take immediate action?*`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex flex-col flex-1 h-[calc(100vh-90px)] w-full overflow-hidden bg-background">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
      />

      {/* Top Header Bar when in conversation mode */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-3 bg-card/40 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-sm font-bold text-foreground">DealOS Mastermind Conversation</h2>
            <span className="text-xs text-muted-foreground">• Model: {aiModel}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setMessages([]); setAttachments([]); }}
              className="h-8 rounded-xl text-xs font-semibold gap-1.5 border-border"
            >
              <RefreshCw size={13} />
              <span>New Prompt</span>
            </Button>
          </div>
        </div>
      )}

      {/* ═══ SCENARIO A: PRISTINE GEMINI ZEN LANDING SCREEN (WHEN NO MESSAGES) ═══ */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full relative">
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="size-96 rounded-full bg-primary/8 blur-3xl opacity-70" />
            <div className="size-80 rounded-full bg-emerald-500/5 blur-3xl opacity-50 ml-20" />
          </div>

          {/* Center Personalized Greeting (Exactly like "Your move, Nihal!") */}
          <div className="text-center mb-8 relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-2">
              <Sparkles size={13} />
              <span>Dubai Real Estate Intelligence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-display">
              Your move, {userName}!
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Ask any strategic question, or tap <strong className="text-foreground">+</strong> to inject investor leads, Dubai projects, or files.
            </p>
          </div>

          {/* ═══ THE GEMINI FLOATING INPUT PILL ═══ */}
          <div className="w-full max-w-2xl relative z-20">
            {/* Context Chips (Show if items are attached) */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 px-1">
                {attachments.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                  >
                    {item.type === "lead" && <User size={13} className="text-amber-400" />}
                    {item.type === "project" && <Building2 size={13} className="text-emerald-400" />}
                    {item.type === "agent" && <Users size={13} className="text-blue-400" />}
                    {item.type === "file" && <Paperclip size={13} className="text-purple-400" />}
                    <span className="truncate max-w-[160px]">{item.label}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(item.id)}
                      className="text-muted-foreground hover:text-foreground ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Floating Capsule Bar */}
            <div className="relative rounded-full border border-border/80 bg-card shadow-lg hover:border-border transition-all duration-200 flex items-center p-2 pl-3">
              {/* Plus Button: Opens Context Attach Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAttachMenuOpen((v) => !v)}
                  className={`size-9 rounded-full flex items-center justify-center transition-all ${
                    attachMenuOpen
                      ? "bg-primary text-primary-foreground rotate-45"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  title="Add context (Leads, Projects, Files, Agents)"
                >
                  <Plus size={20} className="transition-transform duration-200" />
                </button>

                {/* Context Selection Popover */}
                {attachMenuOpen && (
                  <div className="absolute left-0 bottom-12 w-80 rounded-2xl border border-border bg-card p-3 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <span className="text-xs font-bold text-foreground">Attach Context to AI</span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <Paperclip size={12} /> Upload File
                      </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-1 p-0.5 rounded-lg bg-secondary text-[11px] font-medium">
                      {(["all", "leads", "projects", "agents"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSelectedCategory(tab)}
                          className={`flex-1 py-1 rounded capitalize transition-all ${
                            selectedCategory === tab ? "bg-card text-foreground font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Attach Item List */}
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {(selectedCategory === "all" || selectedCategory === "leads") && (
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-0.5">Investor Leads</p>
                          {SAMPLE_LEADS.map((l) => (
                            <button
                              key={l.id}
                              onClick={() => handleAttachItem(l)}
                              className="w-full text-left p-2 rounded-xl hover:bg-secondary/60 transition-colors flex items-center gap-2.5 text-xs"
                            >
                              <User size={14} className="text-amber-400 shrink-0" />
                              <div className="truncate flex-1">
                                <p className="font-bold text-foreground truncate">{l.label}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{l.sub}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {(selectedCategory === "all" || selectedCategory === "projects") && (
                        <div className="pt-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-0.5">Dubai Projects</p>
                          {SAMPLE_PROJECTS.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => handleAttachItem(p)}
                              className="w-full text-left p-2 rounded-xl hover:bg-secondary/60 transition-colors flex items-center gap-2.5 text-xs"
                            >
                              <Building2 size={14} className="text-emerald-400 shrink-0" />
                              <div className="truncate flex-1">
                                <p className="font-bold text-foreground truncate">{p.label}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{p.sub}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {(selectedCategory === "all" || selectedCategory === "agents") && (
                        <div className="pt-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-0.5">Broker Team</p>
                          {SAMPLE_AGENTS.map((a) => (
                            <button
                              key={a.id}
                              onClick={() => handleAttachItem(a)}
                              className="w-full text-left p-2 rounded-xl hover:bg-secondary/60 transition-colors flex items-center gap-2.5 text-xs"
                            >
                              <Users size={14} className="text-blue-400 shrink-0" />
                              <div className="truncate flex-1">
                                <p className="font-bold text-foreground truncate">{a.label}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{a.sub}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                placeholder="Ask DealOS Mastermind..."
                className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />

              {/* Right Controls: Model Picker + Voice + Send */}
              <div className="flex items-center gap-1.5 shrink-0 pr-1">
                {/* Model Selector (Like Gemini "Pro ⌵") */}
                <div className="relative">
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value as typeof aiModel)}
                    className="bg-secondary/60 text-foreground text-xs font-bold rounded-full px-2.5 py-1 border border-border cursor-pointer focus:outline-none"
                  >
                    <option value="Pro">Pro</option>
                    <option value="Fast">Fast</option>
                    <option value="Audit">Audit</option>
                  </select>
                </div>

                {/* Voice Mic Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsRecording((v) => !v);
                    toast.info(isRecording ? "Voice memo stopped" : "Listening for voice memo...");
                  }}
                  className={`size-8 rounded-full flex items-center justify-center transition-colors ${
                    isRecording ? "bg-red-500/20 text-red-400 animate-pulse" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Voice prompt"
                >
                  <Mic size={16} />
                </button>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim() && attachments.length === 0}
                  className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
                  title="Send message"
                >
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ═══ SCENARIO B: EXPANSIVE FULL-SCREEN CONVERSATION VIEW ═══ */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Scrollable Message List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-3xl mx-auto w-full">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 animate-in fade-in-50 duration-200 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="size-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-1">
                    <Sparkles size={16} />
                  </div>
                )}

                <div className={`space-y-2 max-w-[85%] ${m.role === "user" ? "items-end" : ""}`}>
                  {/* Attached Badges on message */}
                  {m.attachments && m.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {m.attachments.map((att) => (
                        <span
                          key={att.id}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold bg-secondary px-2.5 py-0.5 rounded-full border border-border"
                        >
                          {att.type === "lead" && <User size={11} className="text-amber-400" />}
                          {att.type === "project" && <Building2 size={11} className="text-emerald-400" />}
                          {att.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground font-medium rounded-tr-sm"
                        : "bg-card border border-border/80 text-foreground rounded-tl-sm shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  </div>

                  {/* Assistant Footer Actions (Copy to WhatsApp, etc.) */}
                  {m.role === "assistant" && (
                    <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                      <span>{m.timestamp}</span>
                      <span>•</span>
                      <button
                        onClick={() => handleCopy(m.id, m.content)}
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors font-medium"
                      >
                        {copiedId === m.id ? <CheckCheck size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedId === m.id ? "Copied" : "Copy Response"}</span>
                      </button>
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="size-8 rounded-xl bg-secondary border border-border flex items-center justify-center text-xs font-bold text-foreground shrink-0 mt-1 font-display">
                    {userName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-in fade-in-50 duration-150">
                <div className="size-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="rounded-2xl bg-card border border-border/80 px-4 py-3 text-xs text-muted-foreground flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary animate-ping" />
                  <span>DealOS Mastermind is analyzing Dubai inventory and pipeline...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ═══ DOCKED BOTTOM INPUT BAR ═══ */}
          <div className="p-4 border-t border-border/60 bg-card/60 backdrop-blur-md shrink-0">
            <div className="max-w-3xl mx-auto w-full">
              {/* Context Chips (Show if items are attached) */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 px-1">
                  {attachments.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                    >
                      {item.type === "lead" && <User size={13} className="text-amber-400" />}
                      {item.type === "project" && <Building2 size={13} className="text-emerald-400" />}
                      <span className="truncate max-w-[160px]">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(item.id)}
                        className="text-muted-foreground hover:text-foreground ml-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom Capsule Bar */}
              <div className="relative rounded-full border border-border/80 bg-card shadow-lg hover:border-border transition-all duration-200 flex items-center p-2 pl-3">
                <button
                  type="button"
                  onClick={() => setAttachMenuOpen((v) => !v)}
                  className={`size-9 rounded-full flex items-center justify-center transition-all ${
                    attachMenuOpen
                      ? "bg-primary text-primary-foreground rotate-45"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  title="Add context (Leads, Projects, Files, Agents)"
                >
                  <Plus size={20} className="transition-transform duration-200" />
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  placeholder="Ask follow-up or command DealOS..."
                  className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />

                <div className="flex items-center gap-1.5 shrink-0 pr-1">
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!input.trim() && attachments.length === 0}
                    className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
