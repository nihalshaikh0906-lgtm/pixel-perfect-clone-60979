import { createFileRoute } from "@tanstack/react-router";
import { Check, Eye, EyeOff, Plug, RotateCcw, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => workspaceHead("System Settings"),
  component: Page,
});

// Starting values for the agency defaults; every field on this page is page-local.
const DEFAULTS = { commission: "5", split: "40", vat: "5" };
const DEFAULT_MODEL = "gpt-4o";
const DEFAULT_FALLBACK = "Aisha";
const HOLD = "Nobody — hold in the queue";

// Agent picker options, taken from the team already shown across the workspace demo pages.
const AGENTS = ["Adam Rahman", DEFAULT_FALLBACK, "Saad", "Omar", "Priya Nair", "Rania Haddad"];
const MODELS = [DEFAULT_MODEL, "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini", "o4-mini"];
const KEY_MAX = 120;
const KEY_MIN = 20;

// Percent helper: blank or junk input reads as NaN so the summary can show a dash instead of a guess.
function pct(value: string): number {
  const n = Number(value.trim());
  return value.trim() !== "" && Number.isFinite(n) ? n : NaN;
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${Number.isInteger(n) ? n : n.toFixed(2)}%`;
}

function Page() {
  // Panel 1 — Agency Defaults
  const [commission, setCommission] = useState(DEFAULTS.commission);
  const [split, setSplit] = useState(DEFAULTS.split);
  const [vat, setVat] = useState(DEFAULTS.vat);

  // Panel 2 — Lead Routing
  const [roundRobin, setRoundRobin] = useState(true);
  const [fallback, setFallback] = useState(DEFAULT_FALLBACK);

  // Panel 3 — Integrations
  const [apiKey, setApiKey] = useState("");
  const [reveal, setReveal] = useState(false);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [waOn, setWaOn] = useState(false);

  const c = pct(commission);
  const sp = pct(split);
  const v = pct(vat);
  const ratesOk = [c, sp, v].every((n) => Number.isFinite(n) && n >= 0 && n <= 100);
  const agentShare = ratesOk ? (c * sp) / 100 : NaN;
  const agencyShare = ratesOk ? c - agentShare : NaN;

  const idx = AGENTS.indexOf(fallback);
  const nextInLine = roundRobin && idx >= 0 ? AGENTS[(idx + 1) % AGENTS.length] ?? DEFAULT_FALLBACK : "—";

  const connectWa = () => {
    const goingOn = !waOn;
    setWaOn(goingOn);
    toast(goingOn ? "WhatsApp Business connected (demo)" : "WhatsApp Business disconnected (demo)", {
      description: goingOn
        ? "Nothing is sent — this only marks the panel as connected on this page."
        : "The workspace stops showing WhatsApp as connected.",
    });
  };

  const save = () => {
    if (!ratesOk) {
      toast.error("Check the percentages", {
        description: "Commission, agent split and VAT must be numbers from 0 to 100.",
      });
      return;
    }
    const key = apiKey.trim();
    if (key && key.length < KEY_MIN) {
      toast.error("That API key looks too short", {
        description: "Paste the full key, or leave the field empty to keep using DeepSeek.",
      });
      return;
    }
    toast.success("Configuration saved", {
      description: `${fmt(c)} commission · ${fmt(sp)} to the agent · VAT ${fmt(v)} · ${
        roundRobin ? "round-robin on" : "manual routing"
      } · ${model}`,
    });
  };

  const restore = () => {
    setCommission(DEFAULTS.commission);
    setSplit(DEFAULTS.split);
    setVat(DEFAULTS.vat);
    setRoundRobin(true);
    setFallback(DEFAULT_FALLBACK);
    setApiKey("");
    setReveal(false);
    setModel(DEFAULT_MODEL);
    setWaOn(false);
    toast("Defaults restored on this page", { description: "Nothing was written to your database." });
  };

  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">SYSTEM</p>
          <h1>System Settings</h1>
          <p className="sub">
            Agency-wide defaults, how new leads get routed, and the services this workspace talks to.
          </p>
        </div>
        <div className="a-band-actions">
          <span className="a-chip c-cold">Admin only</span>
          <span className="a-chip c-stage">Demo page — nothing is saved</span>
        </div>
      </section>

      <div className="a-row3 a-sys-panels a-fade" style={{ marginTop: 20 }}>
        <div className="a-card">
          <div className="a-card-head">
            <h2>Agency Defaults</h2>
            <span className="a-count num">3 values</span>
          </div>
          <div className="a-sys-fields">
            <label>
              Default Commission %
              <input
                type="number"
                min={0}
                max={100}
                step={0.5}
                inputMode="decimal"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                aria-label="Default commission percent"
              />
            </label>
            <label>
              Default Agent Split %
              <input
                type="number"
                min={0}
                max={100}
                step={5}
                inputMode="decimal"
                value={split}
                onChange={(e) => setSplit(e.target.value)}
                aria-label="Default agent split percent"
              />
            </label>
            <label>
              Tax/VAT %
              <input
                type="number"
                min={0}
                max={100}
                step={0.25}
                inputMode="decimal"
                value={vat}
                onChange={(e) => setVat(e.target.value)}
                aria-label="Tax VAT percent"
              />
            </label>
          </div>
          <div className="a-deal-sum" style={{ marginTop: 14 }}>
            <h3>How a sale splits</h3>
            <span className="a-deal-srow">
              <span>Commission</span>
              <b className="num">
                {fmt(c)}
                <em>of sale price</em>
              </b>
            </span>
            <span className="a-deal-srow">
              <span>Agent share</span>
              <b className="num">
                {fmt(sp)}
                <em>of commission</em>
              </b>
            </span>
            <span className="a-deal-srow">
              <span>Agent gets</span>
              <b className="num">
                {fmt(agentShare)}
                <em>of sale price</em>
              </b>
            </span>
            <span className="a-deal-srow total">
              <span>Agency keeps</span>
              <b className="num">
                {fmt(agencyShare)}
                <em>of sale price</em>
              </b>
            </span>
            <span className="a-deal-srow">
              <span>Tax/VAT</span>
              <b className="num">
                {fmt(v)}
                <em>on commission</em>
              </b>
            </span>
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-head">
            <h2>Lead Routing</h2>
            <span className="a-count num">{AGENTS.length} agents</span>
          </div>
          <div className="a-lst-switch">
            <div>
              <b>Round-Robin Lead Assignment</b>
              <small className="a-note" style={{ display: "block" }}>
                New website leads go to the next agent in line, one by one.
              </small>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={roundRobin}
              aria-label="Round-Robin Lead Assignment"
              className="a-switch"
              onClick={() => setRoundRobin((prev) => !prev)}
            >
              <span />
            </button>
          </div>
          <div className="a-sys-fields" style={{ marginTop: 14 }}>
            <label>
              Default Fallback Agent
              <select value={fallback} onChange={(e) => setFallback(e.target.value)} aria-label="Default fallback agent">
                {AGENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
                <option value={HOLD}>{HOLD}</option>
              </select>
            </label>
          </div>
          <div className="a-deal-sum" style={{ marginTop: 14 }}>
            <h3>Routing preview</h3>
            <span className="a-deal-srow">
              <span>Mode</span>
              <b>{roundRobin ? "Round-robin" : "Manual assignment"}</b>
            </span>
            <span className="a-deal-srow">
              <span>Next in line</span>
              <b>{nextInLine}</b>
            </span>
            <span className="a-deal-srow">
              <span>If nobody is free</span>
              <b>{fallback}</b>
            </span>
            <span className="a-deal-srow total">
              <span>Team size</span>
              <b className="num">{AGENTS.length}</b>
            </span>
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-head">
            <h2>Integrations</h2>
            <span className="a-count num">{waOn ? "2 services" : "1 service"}</span>
          </div>
          <div className="a-sys-fields">
            <label>
              OpenAI API Key
              <span className="a-sys-key">
                <input
                  type={reveal ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  maxLength={KEY_MAX}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="OpenAI API key"
                />
                <button
                  type="button"
                  className="a-btn a-btn-line a-btn-sm a-sys-eye"
                  onClick={() => setReveal((prev) => !prev)}
                  aria-label={reveal ? "Hide API key" : "Show API key"}
                >
                  {reveal ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </span>
            </label>
            <label>
              AI Model
              <select value={model} onChange={(e) => setModel(e.target.value)} aria-label="AI model">
                {MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="a-note" style={{ marginTop: 10 }}>
            A key typed here stays on this page — your live AI replies still run through DeepSeek.
          </p>
          <div className="a-lst-switch" style={{ marginTop: 14 }}>
            <div>
              <b>WhatsApp Business API</b>
              <small className="a-note" style={{ display: "block" }}>
                Viewing reminders and brochures sent from the workspace.
              </small>
            </div>
            <span className="a-acc-acts">
              <span className={`a-chip ${waOn ? "c-ok" : "c-cold"}`}>{waOn ? "Connected" : "Not connected"}</span>
              <button
                type="button"
                className={`a-btn a-btn-sm ${waOn ? "a-btn-line" : "a-btn-gold"}`}
                onClick={connectWa}
              >
                {waOn ? <X size={14} /> : <Plug size={14} />} {waOn ? "Disconnect" : "Connect"}
              </button>
            </span>
          </div>
        </div>
      </div>

      <div className="a-card a-fade" style={{ marginTop: 20 }}>
        <p className="a-mut" style={{ marginTop: 0 }}>
          <ShieldCheck size={13} style={{ display: "inline", verticalAlign: -2 }} /> These settings stay on this page —
          nothing here is written to your database, and no service is contacted.
        </p>
        <div className="a-modal-actions" style={{ justifyContent: "space-between" }}>
          <span className="a-note" style={{ alignSelf: "center", margin: 0 }}>
            <Check size={13} style={{ display: "inline", verticalAlign: -2 }} /> {fmt(c)} commission · {fmt(sp)} to the
            agent · VAT {fmt(v)} · {roundRobin ? "round-robin on" : "manual routing"} · {model}
          </span>
          <span className="a-acc-acts">
            <button type="button" className="a-btn a-btn-line" onClick={restore}>
              <RotateCcw size={14} /> Restore defaults
            </button>
            <button type="button" className="a-btn a-btn-gold" onClick={save}>
              <Check size={15} /> Save Configuration
            </button>
          </span>
        </div>
      </div>
    </>
  );
}
