import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  User, Mail, Phone, ShieldCheck, Lock, Bell, Check,
  Camera, Key, Sparkles, Building2, Award, Eye, EyeOff
} from "lucide-react";
import { toast } from "sonner";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/my-account")({
  head: () => workspaceHead("My Account"),
  component: Page,
});

function Page() {
  // Personal Details
  const [name, setName] = useState("Adam Rahman");
  const [email, setEmail] = useState("adam.rahman@skylinerealty.ae");
  const [phone, setPhone] = useState("+971 50 447 2210");
  const [reraId, setReraId] = useState("BRN-48920");
  const [agency, setAgency] = useState("Skyline Realty LLC · Dubai UAE");
  const [photo, setPhoto] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  // Security
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Notifications
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [instantPings, setInstantPings] = useState(true);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Profile photo must be under 3 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(typeof reader.result === "string" ? reader.result : null);
        toast.success("Profile photo updated.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (newPw && newPw !== confirmPw) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Account profile successfully updated!");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. CLEAN EXECUTIVE PROFILE BANNER ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar with Camera Overlay */}
            <div className="relative group size-20 rounded-2xl bg-secondary border-2 border-border/80 flex items-center justify-center font-display font-black text-2xl text-foreground overflow-hidden shadow-sm">
              {photo ? (
                <img src={photo} alt="Avatar" className="size-full object-cover" />
              ) : (
                <span>{name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}</span>
              )}
              <div
                onClick={() => photoRef.current?.click()}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white"
              >
                <Camera size={20} />
              </div>
              <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-foreground font-display">
                  {name}
                </h1>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400 font-mono">
                  {reraId}
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Building2 size={13} className="text-primary" />
                <span>{agency}</span>
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                RERA Certified Broker · Dubai Land Department Authorized
              </p>
            </div>
          </div>

          <Button onClick={handleSave} className="h-10 px-5 rounded-2xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm shrink-0">
            <Check size={14} />
            <span>Save Profile</span>
          </Button>
        </div>
      </section>

      {/* ═══ 2. PERSONAL DETAILS CARD ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <User size={16} className="text-primary" />
            <h2 className="text-base font-extrabold text-foreground font-display">Personal & Broker Credentials</h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">RERA Synced</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Legal Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Official Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Mobile & WhatsApp</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">RERA Broker Card (BRN)</label>
            <input
              value={reraId}
              onChange={(e) => setReraId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Brokerage Agency Affiliation</label>
            <input
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* ═══ 3. SECURITY & PASSWORD ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-primary" />
            <h2 className="text-base font-extrabold text-foreground font-display">Security & Access Protection</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{showPassword ? "Hide Passwords" : "Show Passwords"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat password"
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>
        </div>
      </section>

      {/* ═══ 4. NOTIFICATION PREFERENCES ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <Bell size={16} className="text-primary" />
          <h2 className="text-base font-extrabold text-foreground font-display">Client & Speed-To-Lead Alerts</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
            <div>
              <p className="text-xs font-bold text-foreground">Instant WhatsApp Lead Dispatches</p>
              <p className="text-[11px] text-muted-foreground">Receive instant ping when an investor registers for off-plan inquiries.</p>
            </div>
            <button
              type="button"
              onClick={() => setWhatsappAlerts(!whatsappAlerts)}
              className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                whatsappAlerts ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
              }`}
            >
              {whatsappAlerts && <Check size={14} />}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
            <div>
              <p className="text-xs font-bold text-foreground">Daily Brokerage Summary & Rent Roll Digest</p>
              <p className="text-[11px] text-muted-foreground">Receive daily 8:00 AM overview of viewings and pending cheques.</p>
            </div>
            <button
              type="button"
              onClick={() => setEmailDigest(!emailDigest)}
              className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                emailDigest ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
              }`}
            >
              {emailDigest && <Check size={14} />}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
