import { createFileRoute } from "@tanstack/react-router";
import { AiChat } from "@/components/app/AiChat";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { useBrokerProfile } from "@/lib/broker";
import { Sparkles, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/ai-assistant")({
  head: () => workspaceHead("AI Assistant"),
  component: Page,
});

function Page() {
  const profile = useBrokerProfile();
  const title = `${profile?.company || "Agency"} Strategic Mastermind`;

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-110px)] w-full gap-3 animate-in fade-in-50 duration-200">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Sparkles size={16} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">{title}</h1>
            <p className="text-xs text-muted-foreground">Full-Screen Strategic Real Estate & Portfolio Copilot</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
          <ShieldCheck size={13} /> DLD Verified AI Intelligence
        </span>
      </div>

      <div className="flex-1 min-h-0 w-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm flex flex-col" aria-label={title}>
        <AiChat
          title={title}
          suggestions={[
            "Analyze our top 3 stalled buyer deals and suggest closing strategies",
            "Draft a high-converting WhatsApp VIP pitch for Reef 995 DLRC",
            "What are the best off-plan opportunities for a European investor with 1.5M AED?",
            "Review our speed-to-lead bottlenecks across active brokers",
          ]}
        />
      </div>
    </div>
  );
}
