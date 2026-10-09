import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ImagePlus, Loader2, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { logoDataUrl } from "@/lib/broker";

// Model picker options for the AI section below.
const MODELS = ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini", "o4-mini"];

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Account Settings · PropFlow" },
      { name: "description", content: "Manage your broker profile, company branding and logo used on client documents." },
      { property: "og:title", content: "Account Settings · PropFlow" },
      { property: "og:description", content: "Manage your broker profile, company branding and logo used on client documents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState("");
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "" });
  const [origEmail, setOrigEmail] = useState("");
  const [roundRobin, setRoundRobin] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState("gpt-4o-mini");
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data.user) {
        toast.error(error?.message ?? "Not signed in");
        setLoading(false);
        return;
      }
      const m = (data.user.user_metadata ?? {}) as Record<string, unknown>;
      const s = (k: string) => (typeof m[k] === "string" ? (m[k] as string) : "");
      setUserId(data.user.id);
      setForm({ company: s("company_name"), name: s("first_name") || s("full_name"), email: data.user.email ?? "", phone: s("phone") });
      setOrigEmail(data.user.email ?? "");
      const lp = s("company_logo_path") || null;
      setLogoPath(lp);
      setLogoPreview(await logoDataUrl(lp));
      setLoading(false);
    });
  }, []);

  async function upload(file: File): Promise<void> {
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file."); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Logo must be under 2 MB."); return; }
    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${userId}/logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("broker-logos").upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      setUploading(false);
      { toast.error(`Upload failed: ${error.message}`); return; }
    }
    const { error: e2 } = await supabase.auth.updateUser({ data: { company_logo_path: path } });
    setUploading(false);
    if (e2) { toast.error(e2.message); return; }
    if (logoPath) void supabase.storage.from("broker-logos").remove([logoPath]);
    setLogoPath(path);
    setLogoPreview(URL.createObjectURL(file));
    toast.success("Logo saved");
  }

  async function save(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setSaving(true);
    const emailChanged = form.email.trim() && form.email.trim() !== origEmail;
    const { error } = await supabase.auth.updateUser({
      ...(emailChanged ? { email: form.email.trim() } : {}),
      data: { company_name: form.company.trim(), first_name: form.name.trim(), phone: form.phone.trim() },
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(emailChanged ? "Saved. Check your new inbox to confirm the email change." : "Profile saved");
    router.invalidate();
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/welcome", replace: true });
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-xl px-6 py-10">
        <p className="eyebrow">Account</p>
        <h1 className="mt-1 text-3xl uppercase">Settings</h1>
        <p className="mt-2 text-muted-foreground">Your details appear on every PDF you send to clients.</p>

        {loading ? (
          <div className="mt-10 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading profile…
          </div>
        ) : (
          <form onSubmit={save} className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="grid size-20 place-items-center overflow-hidden rounded-xl border border-border bg-secondary">
                {logoPreview ? <img src={logoPreview} alt="Company logo" className="size-full object-contain" /> : <ImagePlus className="size-6 text-muted-foreground" />}
              </div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary/60">
                  {uploading ? <Loader2 className="size-3.5 animate-spin" /> : null}
                  {logoPath ? "Replace logo" : "Upload logo"}
                </span>
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                <p className="mt-1 text-xs text-muted-foreground">Company logo or photo, PNG or JPG, up to 2 MB.</p>
              </label>
            </div>

            {(
              [
                ["company", "Company name"],
                ["name", "Broker name"],
                ["email", "Email address"],
                ["phone", "Phone number"],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className="block">
                <span className="eyebrow">{label}</span>
                <Input
                  className="mt-1.5"
                  type={k === "email" ? "email" : k === "phone" ? "tel" : "text"}
                  value={form[k]}
                  onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                />
              </label>
            ))}

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null} Save changes
            </Button>
          </form>
        )}

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <p className="eyebrow">Automation</p>

          <div className="mt-5 flex items-center justify-between gap-4 border-b border-border pb-6">
            <p className="text-sm">
              <span className="font-semibold">Round-Robin Website Leads</span> <span className="text-muted-foreground">(auto-assign to active agents)</span>
            </p>
            <Switch checked={roundRobin} onCheckedChange={setRoundRobin} aria-label="Round-Robin Website Leads (auto-assign to active agents)" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <span className="flex items-center justify-between gap-2">
                <span className="eyebrow">OpenAI API Key</span>
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </span>
              <Input
                className="mt-1.5"
                type={showKey ? "text" : "password"}
                autoComplete="off"
                spellCheck={false}
                maxLength={160}
                placeholder="sk-…"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div>
              <span className="eyebrow">Model</span>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="mt-1.5 w-full" aria-label="Model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Nothing here is saved — your AI replies still run on DeepSeek, so this key isn't connected yet.</p>
        </section>

        <div className="mt-8 border-t border-border pt-6">
          <Button variant="outline" onClick={signOut} className="w-full text-xs font-semibold uppercase tracking-wider">
            <LogOut className="size-4" /> Log out
          </Button>
        </div>
      </main>
    </div>
  );
}
