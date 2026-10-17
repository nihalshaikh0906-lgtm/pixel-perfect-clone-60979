import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  User, Mail, Phone, ShieldCheck, Lock, Bell, Check,
  Camera, Key, Sparkles, Building2, Award, Eye, EyeOff,
  Crown, FileText, Download, Upload, AlertTriangle, Globe, MapPin
} from "lucide-react";
import { toast } from "sonner";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/my-account")({
  head: () => workspaceHead("My Account · Skyline Luxury Real Estate"),
  validateSearch: (s: Record<string, unknown>) => ({
    role: typeof s["role"] === "string" ? s["role"] : undefined,
  }),
  component: MyAccountPage,
});

export function MyAccountPage() {
  const search = Route.useSearch();
  const [accountView, setAccountView] = useState<"owner" | "broker">(
    search.role === "owner" ? "owner" : "owner" // default to owner if requested or general
  );

  // ═══ COMPANY OWNER & AGENCY ENTITY CREDENTIALS ═══
  const [ownerName, setOwnerName] = useState("Adam Rahman");
  const [ownerTitle, setOwnerTitle] = useState("Managing Director & Principal Broker");
  const [agencyLegalName, setAgencyLegalName] = useState("Skyline Luxury Real Estate LLC");
  const [dldOrn, setDldOrn] = useState("ORN-28941");
  const [tradeLicense, setTradeLicense] = useState("TL-894210-DXB");
  const [taxRegNumber, setTaxRegNumber] = useState("TRN-100489201900003");
  const [corporateAddress, setCorporateAddress] = useState("Suite 3402, Marina Plaza, Dubai Marina, UAE");
  const [corporateEmail, setCorporateEmail] = useState("adam.rahman@skylinerealty.ae");
  const [corporatePhone, setCorporatePhone] = useState("+971 4 398 2000");
  const [corporateMobile, setCorporateMobile] = useState("+971 50 447 2210");
  const [photo, setPhoto] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  // Executive Security & Controls
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [ipWhitelisting, setIpWhitelisting] = useState(false);
  const [maskClientPhone, setMaskClientPhone] = useState(true);
  const [restrictDataExport, setRestrictDataExport] = useState(true);

  // Executive Notifications
  const [dealCloseWhatsApp, setDealCloseWhatsApp] = useState(true);
  const [morningDigest, setMorningDigest] = useState(true);
  const [agingAlerts, setAgingAlerts] = useState(true);

  // ═══ BROKER PERSONAL CREDENTIALS ═══
  const [brokerReraId, setBrokerReraId] = useState("BRN-48920");
  const [brokerPersonalPhone, setBrokerPersonalPhone] = useState("+971 50 447 2210");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (search.role === "owner") {
      setAccountView("owner");
    }
  }, [search.role]);

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
        toast.success("Executive profile photo updated.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (accountView === "owner") {
      if (!ownerName.trim() || !agencyLegalName.trim()) {
        toast.error("Name and Agency Legal Name cannot be empty.");
        return;
      }
      toast.success("Company Owner & ORN Agency Profile successfully saved!");
    } else {
      if (!ownerName.trim()) {
        toast.error("Name cannot be empty.");
        return;
      }
      if (newPw && newPw !== confirmPw) {
        toast.error("New passwords do not match.");
        return;
      }
      toast.success("Broker personal profile successfully updated!");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. VIEW SWITCHER BANNER ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar with Camera */}
            <div className="relative group size-20 rounded-2xl bg-secondary border-2 border-border/80 flex items-center justify-center font-display font-black text-2xl text-foreground overflow-hidden shadow-sm shrink-0">
              {photo ? (
                <img src={photo} alt="Avatar" className="size-full object-cover" />
              ) : (
                <span>{ownerName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}</span>
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
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-foreground font-display">
                  {ownerName}
                </h1>
                {accountView === "owner" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/40 px-2.5 py-0.5 text-xs font-bold text-amber-300 font-mono">
                    <Crown size={12} className="text-amber-400" /> Company Owner
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400 font-mono">
                    {brokerReraId}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Building2 size={13} className="text-primary" />
                <span>{agencyLegalName} · {dldOrn}</span>
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                {accountView === "owner"
                  ? "Dubai Land Department Verified Brokerage Principal & Managing Partner"
                  : "RERA Certified Licensed Real Estate Broker · Dubai"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-secondary/80 p-1 rounded-2xl border border-border/80">
              <button
                type="button"
                onClick={() => setAccountView("owner")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  accountView === "owner"
                    ? "bg-amber-500 text-zinc-950 font-black shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Crown size={13} />
                <span>Owner Credentials</span>
              </button>
              <button
                type="button"
                onClick={() => setAccountView("broker")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  accountView === "broker"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User size={13} />
                <span>Personal Broker</span>
              </button>
            </div>

            <Button onClick={handleSave} className="h-10 px-5 rounded-2xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm">
              <Check size={14} />
              <span>Save Account</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 2. OWNER VIEW OR BROKER VIEW ═══ */}
      {accountView === "owner" ? (
        <div className="space-y-6">
          {/* Agency & Commercial DLD Entity */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-amber-400" />
                <h2 className="text-base font-extrabold text-foreground font-display">
                  Agency Commercial Registration & DLD ORN
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <ShieldCheck size={12} /> DLD Active License
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Managing Director / Owner Name
                </label>
                <input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Executive Designation
                </label>
                <input
                  value={ownerTitle}
                  onChange={(e) => setOwnerTitle(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Registered Agency Legal Entity
                </label>
                <input
                  value={agencyLegalName}
                  onChange={(e) => setAgencyLegalName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  DLD Office Registration Number (ORN)
                </label>
                <input
                  value={dldOrn}
                  onChange={(e) => setDldOrn(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Dubai Economy Commercial License (DET)
                </label>
                <input
                  value={tradeLicense}
                  onChange={(e) => setTradeLicense(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Federal Tax Authority (TRN - 5% VAT)
                </label>
                <input
                  value={taxRegNumber}
                  onChange={(e) => setTaxRegNumber(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Corporate Headquarters Address
                </label>
                <input
                  value={corporateAddress}
                  onChange={(e) => setCorporateAddress(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Executive Corporate Email
                </label>
                <input
                  value={corporateEmail}
                  onChange={(e) => setCorporateEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Direct Executive Mobile (+971)
                </label>
                <input
                  value={corporateMobile}
                  onChange={(e) => setCorporateMobile(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
          </section>

          {/* Official Agency Stamp & Digital Seal */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-amber-400" />
                <h2 className="text-base font-extrabold text-foreground font-display">
                  Official Agency Stamp & Digital Seal for DLD Contracts
                </h2>
              </div>
              <span className="text-xs font-mono text-muted-foreground">Form A / Form F / NOC</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-secondary/20 border border-border/60">
              {/* Seal Preview */}
              <div className="size-28 rounded-full border-4 border-amber-500/60 bg-amber-500/5 flex flex-col items-center justify-center p-2 text-center shadow-inner shrink-0 rotate-[-4deg]">
                <ShieldCheck size={20} className="text-amber-400 mb-0.5" />
                <p className="text-[8px] font-black uppercase text-amber-300 leading-tight">SKYLINE LUXURY</p>
                <p className="text-[7px] font-mono text-amber-400/80 font-bold">ORN-28941</p>
                <p className="text-[6px] text-amber-400/60 uppercase">DUBAI · UAE</p>
              </div>

              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-foreground">Verified Digital Brokerage Seal</h3>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  This digital seal is automatically stamped onto all official DLD Form A agreements, Form F MOUs, and developer commission recovery demand letters generated in the system.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Select new high-resolution transparent PNG seal")}
                    className="h-8 rounded-xl text-xs font-bold gap-1.5"
                  >
                    <Upload size={13} />
                    <span>Upload New Stamp</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.success("Agency Seal Vector downloaded")}
                    className="h-8 rounded-xl text-xs font-bold gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Download size={13} />
                    <span>Download Vector</span>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Executive Security & Data Controls */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Lock size={16} className="text-primary" />
              <h2 className="text-base font-extrabold text-foreground font-display">
                Executive Agency Security & Data Anti-Poaching Controls
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
                <div>
                  <p className="text-xs font-bold text-foreground">Enforce Two-Factor Authentication (2FA) for All Brokers</p>
                  <p className="text-[11px] text-muted-foreground">Requires SMS/Authenticator 6-digit OTP verification upon agent login.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnforce2FA(!enforce2FA)}
                  className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                    enforce2FA ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
                  }`}
                >
                  {enforce2FA && <Check size={14} />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
                <div>
                  <p className="text-xs font-bold text-foreground">Anti-Poaching Client Masking</p>
                  <p className="text-[11px] text-muted-foreground">Masks investor phone numbers from junior agents until deal reaches qualified token stage.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaskClientPhone(!maskClientPhone)}
                  className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                    maskClientPhone ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
                  }`}
                >
                  {maskClientPhone && <Check size={14} />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
                <div>
                  <p className="text-xs font-bold text-foreground">Restrict CSV Client Exports to Owner & Directors Only</p>
                  <p className="text-[11px] text-muted-foreground">Blocks individual agents from downloading agency customer database.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRestrictDataExport(!restrictDataExport)}
                  className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                    restrictDataExport ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
                  }`}
                >
                  {restrictDataExport && <Check size={14} />}
                </button>
              </div>
            </div>
          </section>

          {/* Executive Notifications */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Bell size={16} className="text-primary" />
              <h2 className="text-base font-extrabold text-foreground font-display">
                Executive Owner WhatsApp & Velocity Pings
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
                <div>
                  <p className="text-xs font-bold text-foreground">Instant WhatsApp Ping on Major Deals (&gt; AED 5,000,000)</p>
                  <p className="text-[11px] text-muted-foreground">Direct notification to owner's WhatsApp when high-value Form F is logged.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDealCloseWhatsApp(!dealCloseWhatsApp)}
                  className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                    dealCloseWhatsApp ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
                  }`}
                >
                  {dealCloseWhatsApp && <Check size={14} />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
                <div>
                  <p className="text-xs font-bold text-foreground">Daily 8:30 AM Executive Performance & Speed-to-Lead Digest</p>
                  <p className="text-[11px] text-muted-foreground">Summary of active broker response times, incoming pipeline, and viewings.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMorningDigest(!morningDigest)}
                  className={`size-6 rounded-lg border flex items-center justify-center transition-all ${
                    morningDigest ? "bg-emerald-600 border-emerald-500 text-white" : "border-border bg-card"
                  }`}
                >
                  {morningDigest && <Check size={14} />}
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* ═══ BROKER PERSONAL VIEW ═══ */
        <div className="space-y-6">
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-primary" />
                <h2 className="text-base font-extrabold text-foreground font-display">
                  Personal Broker Credentials
                </h2>
              </div>
              <span className="text-xs text-muted-foreground font-mono">BRN-48920</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Broker Legal Name
                </label>
                <input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  RERA Broker Card (BRN)
                </label>
                <input
                  value={brokerReraId}
                  onChange={(e) => setBrokerReraId(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Direct Broker Mobile (+971)
                </label>
                <input
                  value={brokerPersonalPhone}
                  onChange={(e) => setBrokerPersonalPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Direct Outreach Email
                </label>
                <input
                  value={corporateEmail}
                  onChange={(e) => setCorporateEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </section>

          {/* Security & Password */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-primary" />
                <h2 className="text-base font-extrabold text-foreground font-display">
                  Security & Password
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Current Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
