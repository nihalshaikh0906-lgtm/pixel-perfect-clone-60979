import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { FileText, ImagePlus, Loader2, Settings, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { logoDataUrl, useBrokerProfile } from "@/lib/broker";
import { fullSignOut } from "@/lib/auth-role";

const INPUT =
  "w-full rounded-t-md border-b border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary";
const ZONE =
  "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card p-6 text-center text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary hover:bg-secondary/50 cursor-pointer";

export function ProfileWidget() {
  const profile = useBrokerProfile();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  if (!profile) return null;
  async function logout() {
    await fullSignOut();
    await queryClient.cancelQueries();
    queryClient.clear();
    router.navigate({ to: "/welcome", replace: true });
  }
  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 hidden sm:flex items-center gap-3 rounded-full border border-border bg-card/90 p-2 pr-4 shadow-md backdrop-blur-md">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3"
      >
        <span className="grid size-10 place-items-center rounded-full border border-border bg-secondary text-sm font-bold text-foreground">
          {profile.name.slice(0, 2)}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">{profile.name}</span>
        <Settings size={14} className="text-muted-foreground" />
      </button>
      <button type="button" onClick={logout} className="border-l border-border pl-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground">
        Log out
      </button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-border bg-background p-8 shadow-2xl [&>button]:hidden">
          <AccountForm onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function AccountForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoRef = useRef<HTMLInputElement>(null);
  const tplRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<"logo" | "tpl" | null>(null);
  const [userId, setUserId] = useState("");
  const [origEmail, setOrigEmail] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", instagram: "" });
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [templates, setTemplates] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data.user) { toast.error(error?.message ?? "Not signed in"); setLoading(false); return; }
      const m = (data.user.user_metadata ?? {}) as Record<string, unknown>;
      const s = (k: string) => (typeof m[k] === "string" ? (m[k] as string) : "");
      setUserId(data.user.id);
      setOrigEmail(data.user.email ?? "");
      setForm({ name: s("first_name") || s("full_name"), email: data.user.email ?? "", phone: s("phone"), company: s("company_name"), instagram: s("instagram_handle") });
      const lp = s("company_logo_path") || null;
      setLogoPath(lp);
      setTemplates(Array.isArray(m["pdf_template_paths"]) ? (m["pdf_template_paths"] as string[]) : []);
      setLoading(false);
      setLogoPreview(await logoDataUrl(lp));
    });
  }, []);

  async function uploadLogo(file: File): Promise<void> {
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file."); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Logo must be under 2 MB."); return; }
    setBusy("logo");
    const path = `${userId}/logo-${Date.now()}.${file.name.split(".").pop() || "png"}`;
    const { error } = await supabase.storage.from("broker-logos").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { setBusy(null); { toast.error(`Upload failed: ${error.message}`); return; } }
    const { error: e2 } = await supabase.auth.updateUser({ data: { company_logo_path: path } });
    setBusy(null);
    if (e2) { toast.error(e2.message); return; }
    if (logoPath) void supabase.storage.from("broker-logos").remove([logoPath]);
    setLogoPath(path);
    setLogoPreview(URL.createObjectURL(file));
    toast.success("Logo saved");
  }

  async function uploadTemplate(file: File): Promise<void> {
    if (file.size > 10 * 1024 * 1024) { toast.error("Template must be under 10 MB."); return; }
    setBusy("tpl");
    const safe = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `${userId}/templates/${Date.now()}-${safe}`;
    const { error } = await supabase.storage.from("broker-logos").upload(path, file, { contentType: file.type || "application/octet-stream" });
    if (error) { setBusy(null); { toast.error(`Upload failed: ${error.message}`); return; } }
    const next = [...templates, path];
    const { error: e2 } = await supabase.auth.updateUser({ data: { pdf_template_paths: next } });
    setBusy(null);
    if (e2) { toast.error(e2.message); return; }
    setTemplates(next);
    toast.success("Template uploaded");
  }

  async function save(): Promise<void> {
    setSaving(true);
    const email = form.email.trim();
    const emailChanged = email && email !== origEmail;
    const { error } = await supabase.auth.updateUser({
      ...(emailChanged ? { email } : {}),
      data: {
        first_name: form.name.trim(),
        phone: form.phone.trim(),
        company_name: form.company.trim(),
        instagram_handle: form.instagram.trim().replace(/^@/, ""),
      },
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(emailChanged ? "Saved. Check your new inbox to confirm the email change." : "Profile saved");
    router.invalidate();
    onClose();
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/welcome", replace: true });
  }

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={`${INPUT} mt-1`} />
    </label>
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <DialogTitle className="text-2xl uppercase">Broker Profile &amp; Preferences</DialogTitle>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
          <X size={18} />
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-16"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <p className="eyebrow text-primary">Personal details</p>
              {field("First name", "name")}
              {field("Email", "email", "email")}
              {field("Phone number", "phone", "tel")}
            </div>
            <div className="space-y-4">
              <p className="eyebrow text-primary">Brand details</p>
              {field("Company name", "company")}
              {field("Instagram handle", "instagram")}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <DropZone
              onFile={uploadLogo}
              inputRef={logoRef}
              accept="image/*"
              busy={busy === "logo"}
            >
              {logoPreview ? <img src={logoPreview} alt="Company logo" className="h-12 max-w-full object-contain" /> : <ImagePlus size={20} />}
              Upload Company Logo
            </DropZone>
            <DropZone
              onFile={uploadTemplate}
              inputRef={tplRef}
              accept="application/pdf,image/*"
              busy={busy === "tpl"}
            >
              <FileText size={20} />
              Upload AI PDF Templates / Letterheads
              {templates.length ? <span className="normal-case tracking-normal text-foreground">{templates.length} uploaded</span> : null}
            </DropZone>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button type="button" onClick={signOut} className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground">
              Log out
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function DropZone({
  onFile, inputRef, accept, busy, children,
}: {
  onFile: (f: File) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  busy: boolean;
  children: React.ReactNode;
}) {
  const [over, setOver] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      className={`${ZONE} ${over ? "border-primary bg-secondary/50" : ""}`}
    >
      {busy ? <Loader2 size={20} className="animate-spin" /> : children}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
      />
    </div>
  );
}
