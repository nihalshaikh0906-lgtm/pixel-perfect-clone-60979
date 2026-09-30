import { Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { aed, quarterOf } from "@/lib/format";

type Step = { step?: unknown; percent?: unknown; stage?: unknown };
type Plan = { name?: unknown; post_handover?: unknown; steps?: Step[] };
type Phase = "booking" | "construction" | "handover" | "post";

const PHASE_LABEL: Record<Phase, string> = {
  booking: "Booking / Down Payment",
  construction: "During Construction",
  handover: "On Handover",
  post: "Post-Handover",
};

function phaseOf(step: Step, index: number): Phase {
  const t = `${String(step.stage ?? "")} ${String(step.step ?? "")}`.toLowerCase();
  if (t.includes("post")) return "post";
  if (t.includes("handover") || t.includes("completion") || t.includes("key")) return "handover";
  if (index === 0 || t.includes("book") || t.includes("down") || t.includes("sign") || t.includes("reserv"))
    return "booking";
  return "construction";
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

export function PaymentPlanModal({
  open,
  onOpenChange,
  plans,
  price,
  handover,
  projectName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: Plan[];
  price: number | null;
  handover: string | null;
  projectName: string;
}) {
  const [planIndex, setPlanIndex] = useState(0);
  const plan = plans[planIndex];

  const base = useMemo(
    () =>
      (plan?.steps ?? []).map((s, i) => ({
        name: String(s.step ?? `Step ${i + 1}`),
        percent: Number(s.percent) || 0,
        phase: phaseOf(s, i),
      })),
    [plan],
  );
  const baseDown = base.filter((s) => s.phase === "booking").reduce((a, s) => a + s.percent, 0);
  const [down, setDown] = useState<number | null>(null);
  const downPct = down ?? baseDown;

  // Raising the down payment reduces construction installments proportionally.
  const steps = useMemo(() => {
    const constr = base.filter((s) => s.phase === "construction").reduce((a, s) => a + s.percent, 0);
    const delta = downPct - baseDown;
    const factor = constr > 0 ? Math.max(0, (constr - delta) / constr) : 1;
    return base.map((s) => {
      if (s.phase === "booking")
        return { ...s, percent: baseDown > 0 ? round((s.percent / baseDown) * downPct) : downPct };
      if (s.phase === "construction") return { ...s, percent: round(s.percent * factor) };
      return s;
    });
  }, [base, baseDown, downPct]);

  const total = (p: Phase) => round(steps.filter((s) => s.phase === p).reduce((a, s) => a + s.percent, 0));
  const constrTotal = base.filter((s) => s.phase === "construction").reduce((a, s) => a + s.percent, 0);
  const maxDown = Math.min(100, Math.round(baseDown + constrTotal));
  const amount = (pct: number) => (price ? aed((price * pct) / 100) : "—");

  async function copySchedule() {
    const lines = [
      `${projectName} — ${String(plan?.name ?? "Payment plan")}`,
      price ? `Price: ${aed(price)}` : null,
      `Handover: ${quarterOf(handover)}`,
      "",
      ...steps.map((s) => `• ${s.name}: ${s.percent}%${price ? ` (${amount(s.percent)})` : ""}`),
    ].filter((l) => l !== null);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success("Payment schedule copied");
    } catch {
      toast.error("Could not copy the schedule");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setDown(null);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Payment Plan · {projectName}</DialogTitle>
        </DialogHeader>

        {!plan ? (
          <p className="text-sm text-muted-foreground">No payment plan on file for this project.</p>
        ) : (
          <div className="space-y-6">
            {plans.length > 1 ? (
              <div className="flex flex-wrap gap-2">
                {plans.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPlanIndex(i);
                      setDown(null);
                    }}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      i === planIndex ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                    }`}
                  >
                    {String(p.name ?? `Plan ${i + 1}`)}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Unit price", value: aed(price) },
                { label: "Down payment", value: `${total("booking")}% · ${amount(total("booking"))}` },
                { label: "During construction", value: `${total("construction")}%` },
                { label: "Post-handover", value: `${total("post")}%` },
              ].map((m) => (
                <div key={m.label} className="panel p-3">
                  <p className="eyebrow">{m.label}</p>
                  <p className="mt-1 font-display text-lg font-semibold">{m.value}</p>
                </div>
              ))}
            </div>

            {maxDown > baseDown ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Adjust client's down payment</span>
                  <span className="font-semibold text-primary">{downPct}%</span>
                </div>
                <Slider
                  min={Math.round(baseDown)}
                  max={maxDown}
                  step={1}
                  value={[downPct]}
                  onValueChange={(v) => setDown(v[0] ?? baseDown)}
                />
              </div>
            ) : null}

            <ol className="relative space-y-4 border-l border-primary/40 pl-6">
              {steps.map((s, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 flex size-4 items-center justify-center rounded-full border border-primary bg-background">
                    <span className="size-1.5 rounded-full bg-primary" />
                  </span>
                  <p className="eyebrow">{PHASE_LABEL[s.phase]}</p>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm">
                      <span className="font-semibold">{s.percent}%</span>
                      <span className="text-muted-foreground"> • {amount(s.percent)}</span>
                      {s.phase === "handover" ? (
                        <span className="text-muted-foreground"> • {quarterOf(handover)}</span>
                      ) : null}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Button onClick={copySchedule} className="w-full">
              <Copy className="size-4" /> Copy Payment Schedule for WhatsApp
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
