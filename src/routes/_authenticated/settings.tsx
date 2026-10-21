import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Check, ImagePlus, Loader2, LogOut, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { logoDataUrl } from "@/lib/broker";
import { fullSignOut } from "@/lib/auth-role";

// Model picker options for the AI section below.
const MODELS = ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini", "o4-mini"];

// Accent swatches for the Theme picker — fills and checkmark inks live in src/styles.css.
const SWATCHES = [
  "gold", "champagne", "bronze", "silk", "sand", "obsidian", "azure", "cobalt",
  "navy", "teal", "emerald", "sage", "moss", "olive", "amber", "terracotta",
  "rust", "clay", "blush", "plum", "violet", "graphite", "stone", "mist",
];

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Account Settings · DealOS" },
      { name: "description", content: "Manage your broker profile, company branding and logo used on client documents." },
      { property: "og:title", content: "Account Settings · DealOS" },
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
  const [model, setModel] = useState("gpt-4o-mini");
  const [theme, setTheme] = useState("gold");
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [docName, setDocName] = useState("");
  const [docLogo, setDocLogo] = useState<string | null>(null);
  const [docLogoName, setDocLogoName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const docLogoRef = useRef<HTMLInputElement>(null);

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

  // Document Branding: the picked file is read in the browser as a Data URL for preview only.
  function readDocLogo(file: File | undefined): void {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file."); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Logo must be under 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => { setDocLogo(typeof reader.result === "string" ? reader.result : null); setDocLogoName(file.name); };
    reader.onerror = () => toast.error("Couldn't read that file.");
    reader.readAsDataURL(file);
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
    await fullSignOut();
    await queryClient.cancelQueries();
    queryClient.clear();
    router.navigate({ to: "/welcome", replace: true });
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-xl px-6 py-10">
        <p className="eyebrow">Account</p>
        <h1 className="mt-1 text-3xl uppercase">Settings</h1>
        <p className="mt-2 text-muted-foreground">Your details appear on every PDF you send to clients.</p>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <p className="eyebrow">Document Branding</p>
          <p className="mt-2 text-sm text-muted-foreground">The name and mark that sit at the top of your client documents.</p>

          <label className="mt-5 block">
            <span className="eyebrow">Company / Agent Name</span>
            <Input
              className="mt-1.5"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. Skyline Realty"
              autoComplete="off"
            />
          </label>

          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div
              role="button"
              tabIndex={0}
              aria-label="Company logo — drop an image here, or press Enter to browse"
              onClick={() => docLogoRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); docLogoRef.current?.click(); } }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); readDocLogo(e.dataTransfer.files?.[0]); }}
              className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${dragging ? "border-primary/60 bg-primary/5" : "border-border bg-secondary/40 hover:border-primary/60"}`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-card">
                <Upload className="size-4 text-muted-foreground" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">Drop your logo here</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">or click to browse · PNG/JPG, up to 2 MB</span>
              </span>
            </div>

            <input
              ref={docLogoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { readDocLogo(e.target.files?.[0]); e.target.value = ""; }}
            />

            <div className="flex items-center gap-3 justify-self-start sm:justify-self-end">
              <div className="grid size-20 place-items-center overflow-hidden rounded-xl border border-border bg-secondary">
                {docLogo ? <img src={docLogo} alt="Company logo preview" className="size-full object-contain" /> : <ImagePlus className="size-6 text-muted-foreground" />}
              </div>
              {docLogo ? (
                <button
                  type="button"
                  onClick={() => { setDocLogo(null); setDocLogoName(null); }}
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" /> Remove
                </button>
              ) : null}
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {docLogo ? (
              <>
                Previewing <span className="font-semibold text-foreground">{docLogoName}</span>
                {docName.trim() ? <> for <span className="font-semibold text-foreground">{docName.trim()}</span></> : null} — shown on this page only, nothing is uploaded.
              </>
            ) : (
              "Nothing picked yet — the preview stays on this page."
            )}
          </p>
        </section>

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
              <span className="eyebrow">Direct WhatsApp Phone Number</span>
              <Input
                className="mt-1.5 font-mono"
                type="tel"
                placeholder="+971 50 123 4567"
                defaultValue="+971 50 892 4119"
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

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <p className="eyebrow">Theme</p>
          <p className="mt-2 text-sm text-muted-foreground">Pick the accent your workspace opens with.</p>

          <div className="mt-5 grid grid-cols-8 gap-2 sm:grid-cols-12">
            {SWATCHES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTheme(s)}
                aria-label={`Use the ${s} theme`}
                aria-pressed={theme === s}
                className="grid aspect-square place-items-center rounded-md border border-border transition-shadow hover:ring-2 hover:ring-ring hover:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                style={{ background: `var(--sw-${s})`, color: `var(--sw-${s}-ink)` }}
              >
                {theme === s ? <Check className="size-3.5" strokeWidth={3} /> : null}
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Selected: <span className="font-semibold text-foreground">{theme}</span> — the choice stays on this page and doesn't restyle the app yet.
          </p>
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
