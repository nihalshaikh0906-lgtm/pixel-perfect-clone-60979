import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

import { AuthShell, Logo } from "@/components/auth/AuthShell";
import { CheckBox, EMAIL_RE, Field, PasswordField } from "@/components/auth/fields";
import { supabase } from "@/integrations/supabase/client";
import { setRemember } from "@/lib/remember";
import { isPlanId, type PlanId } from "@/lib/pricing";

export const Route = createFileRoute("/signup")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): { plan?: PlanId } => (isPlanId(s["plan"]) ? { plan: s["plan"] } : {}),
  head: () => ({
    meta: [
      { title: "Create your account · DealOS" },
      { name: "description", content: "Create your DealOS broker account and start working your Dubai leads today." },
      { property: "og:title", content: "Create your account · DealOS" },
      { property: "og:description", content: "Start free with the broker OS built on Dubai data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/app", replace: true });
  },
  component: SignupPage,
});

function SignupPage() {
  const router = useRouter();
  const { plan } = Route.useSearch();
  const [f, setF] = useState({ name: "", agency: "", phone: "", email: "", password: "" });
  const [terms, setTerms] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const set = (k: keyof typeof f) => (v: string) => { setF((p) => ({ ...p, [k]: v })); setError(null); };
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));
  const digits = f.phone.replace(/\D/g, "");
  const ok = {
    name: f.name.trim().length >= 2,
    phone: digits.length >= 7,
    email: EMAIL_RE.test(f.email.trim()),
    password: f.password.length >= 8,
  };
  const valid = ok.name && ok.phone && ok.email && ok.password && terms;
  const busy = state !== "idle";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, password: true });
    if (!valid || busy) return;
    setState("loading"); setError(null); setInfo(null);
    const name = f.name.trim();
    const { data, error: err } = await supabase.auth.signUp({
      email: f.email.trim(),
      password: f.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: name,
          first_name: name.split(/\s+/)[0],
          company: f.agency.trim() || null,
          phone: f.phone.trim(),
          selected_plan: plan ?? null,
          trial_ends_at: new Date(Date.now() + 14 * 86_400_000).toISOString(),
        },
      },
    });
    if (err) { setState("idle"); setError(err.message); setShake((v) => v + 1); return; }
    if (!data.session) {
      setState("idle");
      setInfo(`Account created. We sent a confirmation link to ${f.email.trim()} — confirm it, then log in.`);
      return;
    }
    setRemember(true);
    setState("success");
    await new Promise((r) => setTimeout(r, 450));
    setLeaving(true);
    await new Promise((r) => setTimeout(r, 400));
    await router.invalidate();
    void router.navigate({ to: "/app/ai-assistant", replace: true });
  }

  return (
    <AuthShell leaving={leaving} sections={false}>
      <Logo size={40} />
      <h1>Create your workspace</h1>
      <p className="au-sub">Set up your broker account in under a minute.</p>
      <form key={shake} className={`au-stack ${shake ? "au-shake" : ""}`} onSubmit={onSubmit} noValidate>
        <Field id="name" label="Full name" autoComplete="name" placeholder="Nihal Shaikh" value={f.name} onChange={set("name")} onBlur={blur("name")} disabled={busy}
          ok={!!touched["name"] && ok.name} error={touched["name"] && !ok.name ? "Please enter your name." : null} />
        <Field id="agency" label="Agency (optional)" autoComplete="organization" placeholder="Your brokerage" value={f.agency} onChange={set("agency")} disabled={busy} />
        <Field id="phone" label="Phone" type="tel" autoComplete="tel" placeholder="+971 50 123 4567" value={f.phone} onChange={set("phone")} onBlur={blur("phone")} disabled={busy}
          ok={!!touched["phone"] && ok.phone} error={touched["phone"] && f.phone && !ok.phone ? "Please enter a valid phone number." : null} />
        <Field id="email" label="Email" type="email" autoComplete="email" placeholder="you@agency.ae" value={f.email} onChange={set("email")} onBlur={blur("email")} disabled={busy}
          ok={!!touched["email"] && ok.email} error={touched["email"] && f.email && !ok.email ? "That doesn’t look like an email address." : null} />
        <PasswordField id="password" label="Password" autoComplete="new-password" placeholder="At least 8 characters" value={f.password} onChange={set("password")} onBlur={blur("password")} disabled={busy}
          error={touched["password"] && f.password && !ok.password ? "Password must be at least 8 characters." : null} />
        <CheckBox id="terms" checked={terms} onChange={setTerms}>
          I accept the <Link to="/terms" className="au-link">Terms</Link> and <Link to="/privacy" className="au-link">Privacy Policy</Link>
        </CheckBox>
        <button type="submit" className={`au-btn au-btn-ink ${state === "success" ? "success" : ""}`} disabled={!valid || busy}>
          {state === "loading" ? <><Loader2 size={18} className="au-spin" /> Creating account…</> : state === "success" ? <><Check size={18} /> Welcome to DealOS</> : "Create account"}
        </button>
        {error ? <p className="au-msg bad" role="alert" style={{ margin: 0 }}>{error}</p> : null}
        {info ? <p className="au-msg good" role="status" style={{ margin: 0 }}>{info}</p> : null}
      </form>
      <div className="au-alt"><span>Already have an account? <Link to="/login" search={{ mode: undefined }} className="au-link">Log in</Link></span></div>
    </AuthShell>
  );
}
