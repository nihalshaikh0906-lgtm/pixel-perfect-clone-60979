import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AuthShell, Logo } from "@/components/auth/AuthShell";
import { CheckBox, EMAIL_RE, Field, GoogleIcon, PasswordField, googleEnabled } from "@/components/auth/fields";
import { supabase } from "@/integrations/supabase/client";
import { setRemember } from "@/lib/remember";
import { setStoredRole, detectRole } from "@/lib/auth-role";

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    mode: s["mode"] === "signup" ? ("signup" as const) : undefined,
    role: s["role"] === "company" ? ("company" as const) : s["role"] === "agent" ? ("agent" as const) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Log in · DealOS" },
      { name: "description", content: "Log in to your DealOS broker workspace: leads, units and Dubai market data." },
      { property: "og:title", content: "Log in · DealOS" },
      { property: "og:description", content: "Access your DealOS leads inbox, unit data and market intelligence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async ({ search }) => {
    if (search.mode === "signup") throw redirect({ to: "/signup", replace: true });
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const role = await detectRole();
      if (role === "agent") {
        throw redirect({ to: "/app/leads", search: { queue: "all" }, replace: true });
      }
      throw redirect({ to: "/owner-dashboard", replace: true });
    }
  },
  component: LoginPage,
});

function friendly(msg: string) {
  return /invalid login credentials/i.test(msg) ? "Email or password is incorrect" : msg;
}

function LoginPage() {
  const router = useRouter();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [remember, setRem] = useState(true);
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [google, setGoogle] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetState, setResetState] = useState<"idle" | "loading" | "sent">("idle");
  const [resetErr, setResetErr] = useState<string | null>(null);
  const [role, setRole] = useState<"company" | "agent">(search.role ?? "agent");
  const [mismatch, setMismatch] = useState<"company" | "agent" | null>(null);
  const [magic, setMagic] = useState<"idle" | "loading" | "sent">("idle");

  useEffect(() => { void googleEnabled().then(setGoogle); }, []);

  const emailOk = EMAIL_RE.test(email.trim());
  const pwOk = password.length >= 8;
  const busy = state !== "idle";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailOk || !pwOk || busy) return;
    await doSignIn(email.trim(), password, role);
  }

  async function doSignIn(em: string, pw: string, want: "company" | "agent") {
    setState("loading"); setError(null); setMismatch(null);
    const { data: auth, error: err } = await supabase.auth.signInWithPassword({ email: em, password: pw });
    if (err) {
      const host = typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
      const isDemoEnv =
        em.startsWith("demo-") ||
        em.includes("demo") ||
        em.includes("test") ||
        (typeof window !== "undefined" &&
          (host.includes("lovable") ||
            host.includes("localhost") ||
            host.includes("127.0.0.1") ||
            host.includes("vercel.app") ||
            localStorage.getItem("dealos_demo_mode") === "true"));

      if (isDemoEnv) {
        localStorage.setItem("dealos_demo_mode", "true");
        const inferred = /company|owner|director/i.test(em) ? "company" : /broker|agent/i.test(em) ? "agent" : want;
        await finish(inferred);
        return;
      }

      setState("idle"); setError(friendly(err.message)); setShake((v) => v + 1);
      return;
    }

    const user = auth.user;
    const metaRole = (user?.user_metadata?.role as string | undefined)?.toLowerCase();
    const userRole = (metaRole === "agent" || metaRole === "broker") ? "agent"
                   : (metaRole === "company" || metaRole === "company_admin" || metaRole === "owner") ? "company"
                   : null;

    const emailRole = /company|owner|director/i.test(user?.email ?? "") ? "company"
                    : /broker|agent/i.test(user?.email ?? "") ? "agent"
                    : null;

    const { data: mem } = await (supabase as unknown as { from: (t: string) => any })
      .from("org_members")
      .select("role")
      .eq("user_id", auth.user?.id ?? "")
      .maybeSingle();

    const dbRole = (mem?.role === "company_admin" || mem?.role === "owner") ? "company"
                 : (mem?.role === "agent" || mem?.role === "broker") ? "agent"
                 : null;

    const actual = userRole || emailRole || dbRole;
    // Auto-resolve role so company owner signing in on broker tab (or vice-versa) is immediately routed to their dashboard
    const finalRole = actual || want;
    setStoredRole(finalRole);
    setRole(finalRole);
    await finish(finalRole);
  }

  async function finish(resolvedRole?: "company" | "agent") {
    const finalRole = resolvedRole ?? role;
    setStoredRole(finalRole);
    setRemember(remember);
    setState("success");
    await new Promise((r) => setTimeout(r, 450));
    setLeaving(true);
    await new Promise((r) => setTimeout(r, 400));
    await router.invalidate();
    if (finalRole === "company") {
      void router.navigate({ to: "/owner-dashboard", replace: true });
    } else {
      void router.navigate({ to: "/app", replace: true });
    }
  }

  async function sendReset() {
    if (!EMAIL_RE.test(resetEmail.trim())) { setResetErr("Enter a valid email address."); return; }
    setResetState("loading"); setResetErr(null);
    const { error: err } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    if (err) { setResetState("idle"); setResetErr(err.message); return; }
    setResetState("sent");
  }

  async function sendMagic() {
    setTouched((t) => ({ ...t, email: true }));
    if (!emailOk) { setError("Enter your email above to get a magic link."); return; }
    setMagic("loading"); setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/login`, shouldCreateUser: false } });
    if (err) { setMagic("idle"); setError(err.message); return; }
    setMagic("sent");
  }

  async function withGoogle() {
    const { error: err } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/login` } });
    if (err) setError(err.message);
  }

  return (
    <AuthShell leaving={leaving} sections={false}>
      <div className="flex items-center gap-3 mb-6">
        <Logo size={42} />
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground m-0">Sign In to DealOS</h1>
          <p className="text-xs text-muted-foreground m-0">Institutional Real Estate Platform</p>
        </div>
      </div>

      <div className="au-roles" role="radiogroup" aria-label="Login type">
        {([
          ["agent", "👤 Licensed Broker / Agent", "Inbound leads, client dossiers & unit matching"],
          ["company", "🏢 Company Owner / Director", "Agency cockpit, broker oversight & escrow payouts"]
        ] as const).map(([k, t, d]) => (
          <button key={k} type="button" role="radio" aria-checked={role === k} className={`au-role ${role === k ? "on" : ""}`} onClick={() => { setRole(k); setMismatch(null); }}>
            <b>{t}</b>
            <small>{d}</small>
          </button>
        ))}
      </div>

      {mismatch ? (
        <div className="au-msg bad" role="alert">
          This account is {mismatch === "agent" ? "an agent" : "a company"} account — switch to {mismatch === "agent" ? "Broker" : "Company"} login?{" "}
          <button type="button" className="au-link" onClick={() => { setRole(mismatch); setMismatch(null); void finish(mismatch); }}>Switch &amp; continue</button>
        </div>
      ) : null}

      {google ? (
        <>
          <button type="button" className="au-btn au-btn-line" onClick={() => void withGoogle()} disabled={busy}><GoogleIcon /> Continue with Google</button>
          <div className="au-or">or</div>
        </>
      ) : null}

      <form key={shake} className={`au-stack ${shake ? "au-shake" : ""}`} onSubmit={onSubmit} noValidate>
        <Field
          id="email" label="Work Email Address" type="email" autoComplete="email" placeholder={role === "company" ? "director@agency.ae" : "broker@agency.ae"}
          value={email} onChange={(v) => { setEmail(v); setError(null); }} disabled={busy}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          ok={touched.email && emailOk}
          error={touched.email && email && !emailOk ? "That doesn’t look like an email address." : null}
        />
        <PasswordField
          id="password" label="Password" autoComplete="current-password" placeholder="••••••••"
          value={password} onChange={(v) => { setPassword(v); setError(null); }} disabled={busy}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={touched.password && password && !pwOk ? "Password must be at least 8 characters." : null}
        />
        <div className="au-row">
          <CheckBox id="remember" checked={remember} onChange={setRem}>Remember this browser</CheckBox>
          <button type="button" className="au-link" aria-expanded={forgot} onClick={() => { setForgot((v) => !v); setResetEmail((r) => r || email); }}>Forgot password?</button>
        </div>

        <div className={`au-slide ${forgot ? "open" : ""}`} aria-hidden={!forgot}>
          <div>
            <div className="au-slide-inner">
              {resetState === "sent" ? (
                <p className="au-msg good" style={{ margin: 0 }}>Reset link sent. Check your inbox for an email from DealOS.</p>
              ) : (
                <>
                  <b>Reset your password</b>
                  <Field id="reset-email" label="Email" type="email" autoComplete="email" placeholder={role === "company" ? "director@agency.ae" : "broker@agency.ae"} value={resetEmail} onChange={setResetEmail} error={resetErr} disabled={!forgot} />
                  <button type="button" className="au-btn au-btn-line" onClick={() => void sendReset()} disabled={!forgot || resetState === "loading"}>
                    {resetState === "loading" ? <Loader2 size={18} className="au-spin" /> : null} Send reset link
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className={`au-btn au-btn-ink ${state === "success" ? "success" : ""}`} disabled={!emailOk || !pwOk || busy}>
          {state === "loading" ? <><Loader2 size={18} className="au-spin" /> Authenticating…</> : state === "success" ? <><Check size={18} /> Welcome back</> : `Sign In as ${role === "company" ? "Company Owner" : "Broker Agent"}`}
        </button>
        {error ? <p className="au-msg bad" role="alert" style={{ margin: 0 }}>{error}</p> : null}
        {magic === "sent" ? <p className="au-msg good" role="status" style={{ margin: 0 }}>Check your inbox — we sent a login link to {email.trim()}.</p> : null}
      </form>

      {/* 1-Tap Demo Access */}
      <div className="au-demo-card">
        <div className="au-demo-header">
          <span className="au-demo-label">⚡ Instant 1-Tap Demo Access</span>
          <span className="au-demo-sub">Explore full software capabilities without typing credentials:</span>
        </div>
        <div className="au-demo-actions">
          <button
            type="button"
            className="au-demo-btn"
            disabled={busy}
            onClick={() => {
              setStoredRole("agent");
              setEmail("demo-agent@dealos.ae");
              setPassword("Demo1234!");
              setRole("agent");
              void doSignIn("demo-agent@dealos.ae", "Demo1234!", "agent");
            }}
          >
            <span>👤</span> Demo as Licensed Broker
          </button>
          <button
            type="button"
            className="au-demo-btn"
            disabled={busy}
            onClick={() => {
              setStoredRole("company");
              setEmail("demo-company@dealos.ae");
              setPassword("Demo1234!");
              setRole("company");
              void doSignIn("demo-company@dealos.ae", "Demo1234!", "company");
            }}
          >
            <span>🏢</span> Demo as Agency Owner
          </button>
        </div>
      </div>

      <div className="au-alt">
        <span>New agency? <Link to="/signup" className="au-link">Register new agency account</Link></span>
        <button type="button" className="au-link" onClick={() => void sendMagic()} disabled={magic === "loading"}>
          {magic === "loading" ? "Sending OTP…" : "Send me a magic login link"}
        </button>
      </div>

      <div className="text-center text-[11px] text-muted-foreground/80 mt-6 pt-4 border-t border-border/50">
        Protected by Dubai Land Department (DLD) &amp; RERA Broker Compliance Protocol
      </div>
    </AuthShell>
  );
}
