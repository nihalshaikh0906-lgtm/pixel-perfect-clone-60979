import { createFileRoute } from "@tanstack/react-router";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { useBrokerProfile } from "@/lib/broker";
import {
  Sparkles, Plus, Mic, Send, Paperclip, User, Building2, Users, FileText,
  X, Check, ArrowRight, RefreshCw, Copy, CheckCheck,
  ChevronDown, Flame, ShieldCheck, Zap, MessageSquare, BookOpen, Clock,
  Search, ArrowLeft, Layers
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
  date?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: AttachedItem[];
  timestamp: string;
};

const LIBRARY_LEADS: AttachedItem[] = [
  { id: "lead-1", type: "lead", label: "Michael Thorne (UK Investor)", sub: "Budget: AED 1,200,000 · 1BR DLRC · High Priority", date: "9 Oct, 14:02" },
  { id: "lead-2", type: "lead", label: "Dr. Tariq Al-Mansoor", sub: "Budget: AED 3,500,000 · Luxury Villa · Qualified HNWI", date: "9 Oct, 13:56" },
  { id: "lead-3", type: "lead", label: "Elena Rostova (European Buyer)", sub: "Budget: AED 850,000 · Studio JVC · Fast Cash Buyer", date: "8 Oct, 18:20" },
  { id: "lead-4", type: "lead", label: "Saad Al-Ghamdi (Saudi Investor)", sub: "Budget: AED 2,400,000 · 2BR Business Bay · Off-Plan Plan", date: "8 Oct, 11:45" },
  { id: "lead-5", type: "lead", label: "Chloe Martin (French Expat)", sub: "Budget: AED 1,800,000 · 2BR Dubai Marina · Resale or Handover", date: "7 Oct, 16:30" },
];

const RECENT_CHATS = [
  "Dubai Real Estate Investment Advisor",
  "Michael Thorne DLRC Match",
  "UAE 11-Day Lookbook Itinerary",
  "High-Yield Off-Plan Portfolio Strategy",
  "Danube vs Sobha Payment Plan Analysis",
];

export function GeminiAssistantPage() {
  const profile = useBrokerProfile();
  const userName = profile?.name?.split(" ")[0] || "Nihal";
  
  // Navigation inside AI Assistant: "chat" or "library"
  const [activeView, setActiveView] = useState<"chat" | "library">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<AttachedItem[]>([]);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiModel, setAiModel] = useState<"Pro" | "Fast" | "Audit">("Pro");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [libraryFilter, setLibraryFilter] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleStartNewChat = () => {
    setMessages([]);
    setAttachments([]);
    setInput("");
    setActiveView("chat");
    toast.success("Started a new clean chat");
  };

  const handleAddLeadToChat = (lead: AttachedItem) => {
    if (attachments.some((a) => a.id === lead.id)) {
      toast.info(`${lead.label} is already in chat context.`);
    } else {
      setAttachments((prev) => [...prev, lead]);
      toast.success(`Added ${lead.label} to chat context!`);
    }
    setActiveView("chat");
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
        date: "Just now",
      };
      setAttachments((prev) => [...prev, item]);
      setAttachMenuOpen(false);
      toast.success(`File ${file.name} uploaded to chat`);
    }
  };

  const handleSend = () => {
    const prompt = input.trim();
    if (!prompt && attachments.length === 0) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: prompt || "Analyze attached context",
      attachments: [...attachments],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachments([]);
    setIsTyping(true);

    // AI contextual response
    setTimeout(() => {
      let responseText = "";
      const attachedLead = userMsg.attachments?.find((a) => a.type === "lead");

      if (attachedLead) {
        responseText = `### Strategic Analysis for ${attachedLead.label}

**1. Investor Profile Breakdown:**
* **Details:** ${attachedLead.sub}
* **Status:** Verified DLD Investor Lead · Fast Response Required

**2. Best Matching Dubai Developments:**
* **Reef Luxury 995 (DLRC):** 1BR from AED 684,000 · 10/40/50 Handover Q4 2026. Perfect budget fit with 8.4% projected net rental yield.
* **Bayz 102 by Danube (Business Bay):** Flexible 1% monthly post-handover plan for investor cash-flow optimization.

**3. Direct WhatsApp Follow-up Message (1-Click Copy):**
> *"Hi ${attachedLead.label.split(" ")[0]}, hope you're having a productive week! I just reviewed exclusive allocations that align with your search criteria in Dubai. We have 2 prime options with flexible developer payment plans and verified DLD escrow. Would 3:00 PM today suit you for a quick 2-minute overview?"*

*Would you like me to prepare an official EOI reservation slip or draft an Ejari/SPA contract review?*`;
      } else {
        responseText = `### DealOS Strategic Intelligence Response

I've analyzed your query: **"${prompt}"**

* **Market Overview:** Dubai real estate market continues strong momentum with 1,450+ active developments and high capital growth.
* **Recommended Next Step:** Click the **+** button or open the **Library** to attach an investor lead or project document to tailor the exact strategy.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 850);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied response to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLeads = LIBRARY_LEADS.filter(
    (l) => l.label.toLowerCase().includes(libraryFilter.toLowerCase()) || (l.sub && l.sub.toLowerCase().includes(libraryFilter.toLowerCase()))
  );

  return (
    <div className="relative flex h-[calc(100vh-80px)] w-full overflow-hidden bg-background">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
      />

      {/* ═══ 1. GEMINI SUB-SIDEBAR (MATCHING USER SCREENSHOT 1) ═══ */}
      <aside className="w-64 border-r border-border/70 bg-card/50 backdrop-blur-sm flex flex-col shrink-0">
        {/* Top View Selector: [Chat] | [Library] */}
        <div className="p-3 border-b border-border/60">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-secondary/80 text-xs font-bold">
            <button
              onClick={() => setActiveView("chat")}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeView === "chat" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare size={14} />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveView("library")}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeView === "library" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen size={14} />
              <span>Library</span>
            </button>
          </div>
        </div>

        {/* Action Buttons: New Chat & Leads */}
        <div className="p-3 space-y-1.5">
          <button
            onClick={handleStartNewChat}
            className="w-full h-10 rounded-xl border border-border/80 bg-card hover:bg-secondary transition-all px-3.5 flex items-center gap-2.5 text-xs font-bold text-foreground shadow-sm"
          >
            <Plus size={16} className="text-primary" />
            <span>New chat</span>
          </button>

          <button
            onClick={() => setActiveView("library")}
            className="w-full h-10 rounded-xl hover:bg-secondary/60 transition-all px-3.5 flex items-center gap-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Layers size={16} />
            <span>Leads & Documents</span>
          </button>
        </div>

        {/* Recent Chats List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">Recent</p>
          {RECENT_CHATS.map((title, i) => (
            <button
              key={title}
              onClick={() => {
                setActiveView("chat");
                toast.info(`Opened "${title}"`);
              }}
              className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors truncate flex items-center gap-2"
            >
              <Clock size={13} className="shrink-0 opacity-60" />
              <span className="truncate">{title}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Sparkles size={12} className="text-primary" /> DealOS AI
          </span>
          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-mono">Pro Model</span>
        </div>
      </aside>

      {/* ═══ 2. MAIN VIEW AREA ═══ */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* VIEW A: LIBRARY / LEADS VIEW (MATCHING USER SCREENSHOTS 2 & 3) */}
        {activeView === "library" ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-display">Library</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select any investor lead or document to add directly into your chat.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={libraryFilter}
                  onChange={(e) => setLibraryFilter(e.target.value)}
                  placeholder="Filter leads..."
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-card text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Documents Section (Clean rounded cards like Gemini Screenshot 2) */}
            <div className="space-y-3 pt-2">
              <h2 className="text-sm font-bold text-foreground">Documents & Leads</h2>
              
              <div className="space-y-2.5">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="group rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm p-4 hover:border-primary/50 hover:bg-card transition-all duration-200 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="size-10 rounded-xl bg-secondary/80 border border-border/80 flex items-center justify-center text-primary shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-foreground truncate">{lead.label}</h3>
                        <p className="text-xs text-muted-foreground truncate">{lead.sub}</p>
                        <span className="text-[10px] text-muted-foreground/80 mt-0.5 block">{lead.date}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAddLeadToChat(lead)}
                      className="rounded-xl text-xs font-bold gap-1.5 bg-primary text-primary-foreground shrink-0 shadow-sm"
                    >
                      <Plus size={14} />
                      <span>Add to Chat</span>
                    </Button>
                  </div>
                ))}

                {filteredLeads.length === 0 && (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    No leads found matching your search.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW B: CHAT VIEW (ZEN BLANK OR ACTIVE CONVERSATION) */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {messages.length === 0 ? (
              /* PURE ZEN BLANK SCREEN */
              <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-3xl mx-auto w-full relative">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="size-96 rounded-full bg-primary/5 blur-3xl opacity-70" />
                </div>

                <div className="text-center mb-8 relative z-10 space-y-2">
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-display">
                    Your move, {userName}!
                  </h1>
                </div>

                {/* Floating Capsule Bar */}
                <div className="w-full max-w-2xl relative z-20">
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 px-1">
                      {attachments.map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                        >
                          <User size={13} className="text-amber-400" />
                          <span className="truncate max-w-[180px]">{item.label}</span>
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

                  <div className="relative rounded-full border border-border/80 bg-card shadow-lg hover:border-border transition-all duration-200 flex items-center p-2 pl-3">
                    <button
                      type="button"
                      onClick={() => setAttachMenuOpen((v) => !v)}
                      className={`size-9 rounded-full flex items-center justify-center transition-all ${
                        attachMenuOpen ? "bg-primary text-primary-foreground rotate-45" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                      title="Add context (Leads, Files, Projects)"
                    >
                      <Plus size={20} />
                    </button>

                    {/* Popover */}
                    {attachMenuOpen && (
                      <div className="absolute left-0 bottom-12 w-72 rounded-2xl border border-border bg-card p-3 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150 space-y-2">
                        <p className="text-xs font-bold text-foreground pb-1 border-b border-border/60">Attach to Chat</p>
                        <button
                          onClick={() => { setActiveView("library"); setAttachMenuOpen(false); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-secondary transition-colors flex items-center gap-2 text-xs font-medium"
                        >
                          <User size={14} className="text-amber-400" />
                          <span>Select from Leads Library</span>
                        </button>
                        <button
                          onClick={() => { fileInputRef.current?.click(); setAttachMenuOpen(false); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-secondary transition-colors flex items-center gap-2 text-xs font-medium"
                        >
                          <Paperclip size={14} className="text-purple-400" />
                          <span>Upload File / Document</span>
                        </button>
                      </div>
                    )}

                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                      placeholder="Ask DealOS Mastermind..."
                      className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />

                    <div className="flex items-center gap-1.5 shrink-0 pr-1">
                      <select
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value as typeof aiModel)}
                        className="bg-secondary/60 text-foreground text-xs font-bold rounded-full px-2.5 py-1 border border-border cursor-pointer focus:outline-none"
                      >
                        <option value="Pro">Pro</option>
                        <option value="Fast">Fast</option>
                        <option value="Audit">Audit</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => { setIsRecording((v) => !v); toast.info(isRecording ? "Stopped voice" : "Listening..."); }}
                        className={`size-8 rounded-full flex items-center justify-center transition-colors ${
                          isRecording ? "bg-red-500/20 text-red-400 animate-pulse" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Mic size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={!input.trim() && attachments.length === 0}
                        className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
                      >
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ACTIVE FULL-SCREEN CONVERSATION */
              <div className="flex-1 flex flex-col h-full overflow-hidden">
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
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-1.5">
                            {m.attachments.map((att) => (
                              <span
                                key={att.id}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-secondary px-2.5 py-0.5 rounded-full border border-border"
                              >
                                <User size={11} className="text-amber-400" />
                                {att.label}
                              </span>
                            ))}
                          </div>
                        )}

                        <div
                          className={`rounded-2xl p-4 text-sm leading-relaxed ${
                            m.role === "user"
                              ? "bg-primary text-primary-foreground font-medium rounded-tr-sm"
                              : "bg-card border border-border/80 text-foreground rounded-tl-sm shadow-sm"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        </div>

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
                        <span>DealOS AI is analyzing lead context and Dubai inventory...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* DOCKED BOTTOM INPUT BAR */}
                <div className="p-4 border-t border-border/60 bg-card/60 backdrop-blur-md shrink-0">
                  <div className="max-w-3xl mx-auto w-full">
                    {attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2 px-1">
                        {attachments.map((item) => (
                          <span
                            key={item.id}
                            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                          >
                            <User size={13} className="text-amber-400" />
                            <span className="truncate max-w-[180px]">{item.label}</span>
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

                    <div className="relative rounded-full border border-border/80 bg-card shadow-lg hover:border-border transition-all duration-200 flex items-center p-2 pl-3">
                      <button
                        type="button"
                        onClick={() => setActiveView("library")}
                        className="size-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                        title="Add context from Leads Library"
                      >
                        <Plus size={20} />
                      </button>

                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                        placeholder="Ask follow-up about this lead..."
                        className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={!input.trim() && attachments.length === 0}
                        className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
                      >
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
