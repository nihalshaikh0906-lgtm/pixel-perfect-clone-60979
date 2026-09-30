import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { setRemember } from "@/lib/remember";

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({ mode: s["mode"] === "signup" ? ("signup" as const) : undefined }),
  head: () => ({
    meta: [
      { title: "Sign in · PropFlow" },
      { name: "description", content: "Broker sign-in for the Real Estate AI Deal OS command hub." },
      { property: "og:title", content: "Sign in · PropFlow" },
      {
        property: "og:description",
        content: "Broker sign-in for the Real Estate AI Deal OS command hub.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/" });
  },
  component: LoginPage,
});

const COUNTRY_CODES = ["+971", "+966", "+974", "+965", "+968", "+973", "+91", "+44", "+1", "+7", "+86"];

function LoginPage() {
  const router = useRouter();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [remember, setRem] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    if (mode === "signup") {
      const digits = phone.replace(/[^\d]/g, "");
      if (digits.length < 6) {
        setLoading(false);
        setError("Please enter a valid phone number.");
        return;
      }
      const { data, error: e } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            first_name: firstName.trim().toUpperCase(),
            full_name: (username.trim() || firstName.trim()).toUpperCase(),
            phone: `${code} ${digits}`,
            instagram_handle: instagram.trim().replace(/^@/, "") || null,
          },
        },
      });
      setLoading(false);
      if (e) return setError(e.message);
      if (!data.session) {
        setInfo("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
        return;
      }
    } else {
      const { error: e } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (e) return setError(e.message);
    }
    setRemember(remember);
    await router.invalidate();
    router.navigate({ to: "/", replace: true });
  }

  const signup = mode === "signup";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel w-full max-w-md p-8">
        <p className="eyebrow">PropFlow · Private Access</p>
        <h1 className="mt-3 text-2xl font-semibold uppercase tracking-wider">
          {signup ? "Broker registration" : "Broker sign-in"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {signup ? "Create your broker profile." : "Use the credentials for your inventory workspace."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {signup ? (
            <div className="space-y-2">
              <Label htmlFor="first" className="eyebrow">First name</Label>
              <Input id="first" required maxLength={60} value={firstName} onChange={(e) => setFirstName(e.target.value.toUpperCase())} className="uppercase" placeholder="NIHAL" />
            </div>
          ) : null}
          {signup ? (
            <div className="space-y-2">
              <Label htmlFor="username" className="eyebrow">Username (what we should call you - optional)</Label>
              <Input
                id="username"
                maxLength={60}
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                className="uppercase"
                placeholder="NIHAL SHAIKH"
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email" className="eyebrow">Email ID</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="broker@agency.ae" />
          </div>
          {signup ? (
            <div className="space-y-2">
              <Label htmlFor="phone" className="eyebrow">Phone number</Label>
              <div className="flex gap-2">
                <select
                  aria-label="Country code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <Input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="50 123 4567" />
              </div>
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="password" className="eyebrow">Password</Label>
            <Input id="password" type="password" autoComplete={signup ? "new-password" : "current-password"} required minLength={signup ? 8 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {signup ? (
            <div className="space-y-2">
              <Label htmlFor="ig" className="eyebrow">Instagram (optional)</Label>
              <div className="flex items-center rounded-md border border-input pl-3">
                <span className="text-sm text-muted-foreground">@</span>
                <Input id="ig" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="border-0 shadow-none focus-visible:ring-0" placeholder="nihal.realty" />
              </div>
            </div>
          ) : null}

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={remember} onChange={(e) => setRem(e.target.checked)} className="size-4 accent-primary" />
            Remember my session (stay logged in automatically)
          </label>

          {error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          ) : null}
          {info ? <p className="rounded-md border border-primary/40 bg-secondary px-3 py-2 text-sm">{info}</p> : null}

          <Button type="submit" className="w-full uppercase tracking-wider" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
            {signup ? "Create account" : "Enter Command Hub"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => { setMode(signup ? "signin" : "signup"); setError(null); }}
          className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {signup ? "Already registered? Sign in" : "New broker? Create an account"}
        </button>
      </div>
    </div>
  );
}
