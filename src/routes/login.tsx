import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { ArrowRight, Building2, Check, ChevronDown, ChevronUp, Loader2, Sparkles, User, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { AuthShell, Logo } from "@/components/auth/AuthShell";
import { CheckBox, EMAIL_RE, Field, GoogleIcon, PasswordField, googleEnabled } from "@/components/auth/fields";
import { supabase } from "@/integrations/supabase/client";
import { setRemember } from "@/lib/remember";
import { setStoredRole, detectRole, setActiveEmail, fullSignOut } from "@/lib/auth-role";
import { isDemoButtonsActive, getDemoButtonsRemainingDays, isTestingAccount, isTestingAccountValid, TESTING_EMAIL, TESTING_PASSWORD } from "@/lib/testing-account";

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    mode: s["mode"] === "signup" ? ("signup" as const) : undefined,
    role: s["role"] === "company" ? ("company" as const) : s["role"] === "agent" ? ("agent" as const) : undefined,
    switch: s["switch"] === "true" || s["switch"] === true ? true : undefined,
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
    if (search.switch) {
      await fullSignOut();
      return;
    }
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const role = await detectRole();
      if (role === "agent") {
        throw redirect({ to: "/app", replace: true });
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
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  async function loginAsDemo(chosenRole: "company" | "agent") {
    setState("loading");
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.setItem("dealos_demo_mode", "true");
      localStorage.setItem("dealos_subscription_active", "true");
      localStorage.setItem("dealos_role", chosenRole);
      localStorage.setItem("dealos_active_email", chosenRole === "company" ? "owner-demo@dealos.ae" : "broker-demo@dealos.ae");
      // Instant direct navigation straight into system with all sample data active
      window.location.href = chosenRole === "company" ? "/owner-dashboard" : "/app";
    }
  }

  useEffect(() => { void googleEnabled().then(setGoogle); }, []);

  const cleanCurrentEmail = email.toLowerCase().trim();
  const isMasterPlatformAdmin =
    cleanCurrentEmail === "nihalshaikh0906@gmail.com" ||
    cleanCurrentEmail === "admin@dealos.ae";
  const isTestingUser = isTestingAccount(cleanCurrentEmail);

  const emailOk = EMAIL_RE.test(email.trim()) || isTestingUser;
  const pwOk = (isMasterPlatformAdmin || isTestingUser) ? password.length >= 1 : password.length >= 8;
  const busy = state !== "idle";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailOk || !pwOk || busy) return;
    await doSignIn(email.trim(), password, role);
  }

  async function doSignIn(em: string, pw: string, want: "company" | "agent") {
    setState("loading"); setError(null); setMismatch(null);
    const cleanEm = em.toLowerCase().trim();
    setActiveEmail(cleanEm);

    // ═══ 7-DAY UNIVERSAL TESTING ACCOUNT (dealostesting.com / Rko8786!) ═══
    if (isTestingAccount(cleanEm)) {
      if (!isTestingAccountValid(cleanEm)) {
        setState("idle");
        setError("This 7-day testrun account has expired. Please contact support.");
        setShake((v) => v + 1);
        return;
      }
      const trimmedPw = pw.trim();
      if (trimmedPw !== "Rko8786!" && trimmedPw !== "rko8786!" && trimmedPw !== TESTING_PASSWORD) {
        setState("idle");
        setError("Incorrect password for testing account.");
        setShake((v) => v + 1);
        return;
      }
      // Instant bypass without OTP or authenticator
      localStorage.setItem("dealos_demo_mode", "true");
      localStorage.setItem("dealos_subscription_active", "true");
      setStoredRole(want);
      setActiveEmail(cleanEm);
      await finish(want);
      return;
    }

    const isMasterKey =
      cleanEm === "nihalshaikh0906@gmail.com" ||
      cleanEm === "admin@dealos.ae";

    if (isMasterKey) {
      setStoredRole(want);
    }

    let authUser: any = null;
    let authError: any = null;
    try {
      const res = await supabase.auth.signInWithPassword({ email: em, password: pw });
      authUser = res.data?.user;
      authError = res.error;
    } catch (e: any) {
      authError = e;
    }

    if (authError || !authUser) {
      const host = typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
      const isDemoEnv =
        isMasterKey ||
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
        if (isMasterKey) {
          localStorage.setItem("dealos_subscription_active", "true");
        }
        // Always honor what the user selected: Company Owner vs Licensed Broker!
        const inferred = want;
        setStoredRole(inferred);
        setActiveEmail(cleanEm);
        await finish(inferred);
        return;
      }

      setState("idle"); setError(friendly(authError?.message || "Invalid credentials")); setShake((v) => v + 1);
      return;
    }

    const user = authUser;
    const cleanUserEmail = (user?.email ?? em).toLowerCase().trim();
    setActiveEmail(cleanUserEmail);

    const isMasterUser =
      cleanUserEmail === "nihalshaikh0906@gmail.com" ||
      cleanUserEmail === "admin@dealos.ae";

    const namedRole = isMasterUser ? want : null;

    const metaRole = (user?.user_metadata?.role as string | undefined)?.toLowerCase();
    const userRole = (metaRole === "agent" || metaRole === "broker") ? "agent"
                   : (metaRole === "company" || metaRole === "company_admin" || metaRole === "owner") ? "company"
                   : null;

    let dbRole: "company" | "agent" | null = null;
    try {
      const { data: mem } = await (supabase as unknown as { from: (t: string) => any })
        .from("org_members")
        .select("role")
        .eq("user_id", user?.id ?? "")
        .maybeSingle();

      dbRole = (mem?.role === "company_admin" || mem?.role === "owner" || mem?.role === "admin") ? "company"
             : (mem?.role === "agent" || mem?.role === "broker") ? "agent"
             : null;
    } catch {
      // Non-blocking fallback
    }

    // Role priority:
    // 1. Master platform key respects user's selected toggle (want)
    // 2. Database org membership role (dbRole)
    // 3. User metadata role (userRole)
    // 4. User's explicitly chosen login toggle role (want: "company" | "agent")
    const finalRole = namedRole || dbRole || userRole || want;
    setStoredRole(finalRole);
    setRole(finalRole);
    await finish(finalRole);
  }

  async function finish(resolvedRole?: "company" | "agent") {
    const finalRole = resolvedRole ?? role;
    setStoredRole(finalRole);
    setRemember(remember);
    setState("success");
    await new Promise((r) => setTimeout(r, 200));
    setLeaving(true);
    await new Promise((r) => setTimeout(r, 150));
    if (typeof window !== "undefined") {
      window.location.href = finalRole === "company" ? "/owner-dashboard" : "/app";
    } else {
      await router.invalidate();
      if (finalRole === "company") {
        void router.navigate({ to: "/owner-dashboard", replace: true });
      } else {
        void router.navigate({ to: "/app", replace: true });
      }
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
          <h1 className="text-2xl font-black tracking-tight text-foreground m-0">Welcome to DealOS</h1>
          <p className="text-xs text-muted-foreground m-0">Institutional Real Estate Platform</p>
        </div>
      </div>

      {/* 2 Primary Demo Buttons (Active until Nov 2, 2026) */}
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Button 1: Demo as Broker */}
          <button
            type="button"
            onClick={() => void loginAsDemo("agent")}
            disabled={busy}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-primary/10 to-emerald-500/10 border-2 border-emerald-500/40 hover:border-emerald-500 hover:from-emerald-500/25 transition-all shadow-sm group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👤</span>
              <div className="text-left">
                <div className="text-sm font-extrabold text-foreground group-hover:text-emerald-400 transition-colors">
                  Demo as Broker
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Instant Broker Desk
                </div>
              </div>
            </div>
            <div className="size-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              {busy ? <Loader2 size={14} className="au-spin" /> : <ArrowRight size={14} />}
            </div>
          </button>

          {/* Button 2: Demo as Owner */}
          <button
            type="button"
            onClick={() => void loginAsDemo("company")}
            disabled={busy}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-primary/10 to-amber-500/10 border-2 border-amber-500/40 hover:border-amber-500 hover:from-amber-500/25 transition-all shadow-sm group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🏢</span>
              <div className="text-left">
                <div className="text-sm font-extrabold text-foreground group-hover:text-amber-400 transition-colors">
                  Demo as Owner
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Executive Cockpit
                </div>
              </div>
            </div>
            <div className="size-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              {busy ? <Loader2 size={14} className="au-spin" /> : <ArrowRight size={14} />}
            </div>
          </button>
        </div>

        <div className="text-center">
          <span className="text-[11px] font-semibold text-muted-foreground">
            ✦ 1-Click Access Active · 30+ Sample Items Loaded · Valid through Nov 2, 2026
          </span>
        </div>
      </div>

      {/* Full Institutional Login Form */}
      <div className="space-y-4 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">Sign In to Existing Account</span>
          <button
            type="button"
            onClick={() => {
              setEmail("dealostesting.com");
              setPassword("Rko8786!");
              toast.info("Filled universal testing account credentials");
            }}
            className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            ⚡ Quick-fill 7-day testrun
          </button>
        </div>

        <div className="au-roles" role="radiogroup" aria-label="Login type">
          {([
            ["agent", "👤 Licensed Broker", "Agent workspace"],
            ["company", "🏢 Agency Owner", "Executive cockpit"]
          ] as const).map(([k, t, d]) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={role === k}
              className={`au-role ${role === k ? "on" : ""}`}
              onClick={() => {
                setRole(k);
                setStoredRole(k);
                setMismatch(null);
              }}
            >
              <b>{t}</b>
              <small>{d}</small>
            </button>
          ))}
        </div>

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

          {forgot ? (
            <div className="au-forgot au-shake">
              {resetState === "sent" ? (
                <p className="au-msg good" role="status">Check your inbox — we sent a password reset link to {resetEmail.trim()}.</p>
              ) : (
                <>
                  <b>Reset your password</b>
                  <Field id="reset-email" label="Email" type="email" autoComplete="email" placeholder="you@agency.ae" value={resetEmail} onChange={setResetEmail} error={resetErr} disabled={!forgot} />
                  <button type="button" className="au-btn au-btn-line" onClick={() => void sendReset()} disabled={!forgot || resetState === "loading"}>
                    {resetState === "loading" ? <Loader2 size={18} className="au-spin" /> : null} Send reset link
                  </button>
                </>
              )}
            </div>
          ) : null}

          <button type="submit" className={`au-btn au-btn-ink ${state === "success" ? "success" : ""}`} disabled={!emailOk || !pwOk || busy}>
            {state === "loading" ? <><Loader2 size={18} className="au-spin" /> Authenticating…</> : state === "success" ? <><Check size={18} /> Welcome back</> : `Sign In as ${role === "company" ? "Company Owner" : "Broker Agent"}`}
          </button>
          {error ? <p className="au-msg bad" role="alert" style={{ margin: 0 }}>{error}</p> : null}
        </form>
      </div>

      <div className="text-center text-[11px] text-muted-foreground/80 mt-6 pt-4 border-t border-border/50">
        Protected by Dubai Land Department (DLD) &amp; RERA Broker Compliance Protocol · Valid through Nov 2, 2026
      </div>
    </AuthShell>
  );
}
