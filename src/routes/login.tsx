import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AuthShell, Logo } from "@/components/auth/AuthShell";
import { CheckBox, EMAIL_RE, Field, GoogleIcon, PasswordField, googleEnabled } from "@/components/auth/fields";
import { supabase } from "@/integrations/supabase/client";
import { setRemember } from "@/lib/remember";

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({ mode: s["mode"] === "signup" ? ("signup" as const) : undefined }),
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
    if (data.session) throw redirect({ to: "/app", replace: true });
  },
  component: LoginPage,
});

function friendly(msg: string) {
  return /invalid login credentials/i.test(msg) ? "Email or password is incorrect" : msg;
}

function LoginPage() {
  const router = useRouter();
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
  const [magic, setMagic] = useState<"idle" | "loading" | "sent">("idle");

  useEffect(() => { void googleEnabled().then(setGoogle); }, []);

  const emailOk = EMAIL_RE.test(email.trim());
  const pwOk = password.length >= 8;
  const busy = state !== "idle";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailOk || !pwOk || busy) return;
    setState("loading"); setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (err) {
      setState("idle"); setError(friendly(err.message)); setShake((v) => v + 1);
      return;
    }
    setRemember(remember);
    setState("success");
    await new Promise((r) => setTimeout(r, 450));
    setLeaving(true);
    await new Promise((r) => setTimeout(r, 400));
    await router.invalidate();
    void router.navigate({ to: "/app", replace: true });
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
    <AuthShell leaving={leaving}>
      <Logo size={40} />
      <h1>Login to your workspace</h1>
      <p className="au-sub">Enter your details to access your leads, units and market data.</p>

      {google ? (
        <>
          <button type="button" className="au-btn au-btn-line" onClick={() => void withGoogle()} disabled={busy}><GoogleIcon /> Continue with Google</button>
          <div className="au-or">or</div>
        </>
      ) : null}

      <form key={shake} className={`au-stack ${shake ? "au-shake" : ""}`} onSubmit={onSubmit} noValidate>
        <Field
          id="email" label="Email" type="email" autoComplete="email" placeholder="you@agency.ae"
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
          <CheckBox id="remember" checked={remember} onChange={setRem}>Remember me</CheckBox>
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
                  <Field id="reset-email" label="Email" type="email" autoComplete="email" placeholder="you@agency.ae" value={resetEmail} onChange={setResetEmail} error={resetErr} disabled={!forgot} />
                  <button type="button" className="au-btn au-btn-line" onClick={() => void sendReset()} disabled={!forgot || resetState === "loading"}>
                    {resetState === "loading" ? <Loader2 size={18} className="au-spin" /> : null} Send reset link
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className={`au-btn au-btn-ink ${state === "success" ? "success" : ""}`} disabled={!emailOk || !pwOk || busy}>
          {state === "loading" ? <><Loader2 size={18} className="au-spin" /> Logging in…</> : state === "success" ? <><Check size={18} /> Welcome back</> : "Log in"}
        </button>
        {error ? <p className="au-msg bad" role="alert" style={{ margin: 0 }}>{error}</p> : null}
        {magic === "sent" ? <p className="au-msg good" role="status" style={{ margin: 0 }}>Check your inbox — we sent a login link to {email.trim()}.</p> : null}
      </form>

      <div className="au-alt">
        <span>New to DealOS? <Link to="/signup" className="au-link">Create an account</Link></span>
        <button type="button" className="au-link" onClick={() => void sendMagic()} disabled={magic === "loading"}>
          {magic === "loading" ? "Sending…" : "Send me a magic link instead"}
        </button>
      </div>
    </AuthShell>
  );
}
