import { createFileRoute } from "@tanstack/react-router";
import { AiChat } from "@/components/app/AiChat";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { useBrokerProfile } from "@/lib/broker";

export const Route = createFileRoute("/_authenticated/app/ai-assistant")({
  head: () => workspaceHead("AI Assistant"),
  component: Page,
});

function Page() {
  const profile = useBrokerProfile();
  const title = `${profile?.company || "Agency"} AI Assistant`;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <section className="a-band a-fade">
        <div className="min-w-0">
          <p className="eyebrow-a">GENERAL</p>
          <h1 className="break-words">{title}</h1>
        </div>
      </section>
      <section className="a-card flex h-[calc(100svh-280px)] min-h-[420px] min-w-0 flex-col overflow-hidden" aria-label={title}>
        <AiChat
          title={title}
          suggestions={[
            "Help me prioritize today's follow-ups.",
            "Draft a WhatsApp opener for a new enquiry.",
            "What should I confirm before a property viewing?",
          ]}
        />
      </section>
    </div>
  );
}
