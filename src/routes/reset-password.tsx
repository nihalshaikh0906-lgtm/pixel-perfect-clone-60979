import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AuthShell, Logo } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/fields";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password · DealOS" },
      { name: "description", content: "Choose a new password for your DealOS broker account." },
      { property: "og:title", content: "Set a new password · DealOS" },
      { property: "og:description", content: "Securely reset your DealOS password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const router = useRouter();
  const [ready, setReady] = useState<"checking" | "yes" | "no">("checking");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let alive = true;
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (alive && session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) setReady("yes");
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      if (data.session) setReady("yes");
      else setTimeout(() => { if (alive) setReady((r) => (r === "checking" ? "no" : r)); }, 1500);
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const okLen = pw.length >= 8;
  const match = pw === pw2;
  const valid = okLen && match && ready === "yes";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setState("loading"); setError(null);
    const { error: err } = await supabase.auth.updateUser({ password: pw });
    if (err) { setState("idle"); setError(err.message); return; }
    setState("success");
    await new Promise((r) => setTimeout(r, 600));
    setLeaving(true);
    await new Promise((r) => setTimeout(r, 400));
    await router.invalidate();
    void router.navigate({ to: "/app", replace: true });
  }

  return (
    <AuthShell leaving={leaving} sections={false}>
      <Logo size={40} />
      <h1>Set a new password</h1>
      <p className="au-sub">Choose a password with at least 8 characters.</p>
      {ready === "no" ? (
        <>
          <p className="au-msg bad" role="alert">This reset link is invalid or has expired. Request a new one from the login page.</p>
          <div className="au-alt"><Link to="/login" search={{ mode: undefined }} className="au-link">Back to login</Link></div>
        </>
      ) : (
        <form className="au-stack" onSubmit={onSubmit} noValidate>
          <PasswordField id="pw" label="New password" autoComplete="new-password" placeholder="••••••••" value={pw} onChange={setPw} disabled={state !== "idle"}
            onBlur={() => setTouched(true)} error={touched && pw && !okLen ? "Password must be at least 8 characters." : null} />
          <PasswordField id="pw2" label="Confirm password" autoComplete="new-password" placeholder="••••••••" value={pw2} onChange={setPw2} disabled={state !== "idle"}
            error={touched && pw2 && !match ? "Passwords don’t match." : null} />
          <button type="submit" className={`au-btn au-btn-ink ${state === "success" ? "success" : ""}`} disabled={!valid || state !== "idle"}>
            {ready === "checking" ? <><Loader2 size={18} className="au-spin" /> Checking link…</> : state === "loading" ? <><Loader2 size={18} className="au-spin" /> Saving…</> : state === "success" ? <><Check size={18} /> Password updated</> : "Save new password"}
          </button>
          {error ? <p className="au-msg bad" role="alert" style={{ margin: 0 }}>{error}</p> : null}
        </form>
      )}
    </AuthShell>
  );
}
