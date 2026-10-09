import { createFileRoute } from "@tanstack/react-router";
import { Check, Eye, EyeOff, ImagePlus, Lock, ShieldCheck, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { workspaceHead } from "@/components/app/WorkspacePlaceholder";

export const Route = createFileRoute("/_authenticated/app/my-account")({
  head: () => workspaceHead("My Account"),
  component: Page,
});

// Limits keep the fields honest without touching your database.
const NAME_MAX = 80;
const EMAIL_MAX = 255;
const PHONE_MAX = 20;
const PASS_MAX = 72;
const PASS_MIN = 8;

// Password strength bands for the meter under the Security panel.
const BANDS = ["Too short", "Weak", "Fair", "Strong"] as const;

function strengthOf(pw: string): number {
  if (!pw.length) return 0;
  if (pw.length < PASS_MIN) return 1;
  let score = 1;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return Math.min(score, 4);
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const raw = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return raw.toUpperCase() || "—";
}

function Page() {
  // Section 1 — Personal Details
  const [name, setName] = useState("Adam Rahman");
  const [email, setEmail] = useState("adam.rahman@skylinerealty.ae");
  const [phone, setPhone] = useState("+971 50 447 2210");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  // Section 2 — Security
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [reveal, setReveal] = useState(false);

  // Section 3 — Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);

  const band = strengthOf(newPw);
  const mismatch = !!newPw && !!confirmPw && newPw !== confirmPw;

  // The picked file is read in the browser as a Data URL for preview only.
  function readPhoto(file: File | undefined): void {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(typeof reader.result === "string" ? reader.result : null);
      setPhotoName(file.name);
    };
    reader.onerror = () => toast.error("Couldn't read that file.");
    reader.readAsDataURL(file);
  }

  function save(): void {
    if (!name.trim()) {
      toast.error("Your full name can't be empty.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (phone.trim() && phone.replace(/\D/g, "").length < 7) {
      toast.error("Enter a phone number with at least 7 digits.");
      return;
    }
    if (newPw || confirmPw || currentPw) {
      if (!currentPw) {
        toast.error("Enter your current password to change it.");
        return;
      }
      if (newPw.length < PASS_MIN) {
        toast.error(`New password must be at least ${PASS_MIN} characters.`);
        return;
      }
      if (newPw !== confirmPw) {
        toast.error("New password and confirmation don't match.");
        return;
      }
    }
    toast.success("Account details saved", {
      description: `${name.trim()} · ${email.trim()} · ${BANDS[Math.max(band - 1, 0)] ?? "No"} password change`,
    });
  }

  function discard(): void {
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    toast("Changes cleared on this page");
  }

  return (
    <>
      <section className="a-band a-fade">
        <div>
          <p className="eyebrow-a">SYSTEM</p>
          <h1>My Account</h1>
          <p className="sub">Your profile, sign-in security and the alerts you want to receive.</p>
        </div>
        <div className="a-band-actions">
          <span className="a-chip c-stage">Demo page — nothing is saved</span>
        </div>
      </section>

      {/* 1 — Personal Details */}
      <div className="a-card a-fade" style={{ marginTop: 20 }}>
        <div className="a-card-head">
          <h2>Personal Details</h2>
          <span className="a-count num">Profile</span>
        </div>

        <div className="a-acc-photo">
          <div
            role="button"
            tabIndex={0}
            aria-label="Profile picture — drop an image here, or press Enter to browse"
            className={`a-acc-frame${dragging ? " drag" : ""}`}
            onClick={() => photoRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                photoRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              readPhoto(e.dataTransfer.files?.[0]);
            }}
          >
            {photo ? (
              <img src={photo} alt="Profile picture preview" />
            ) : name.trim() ? (
              <span className="a-acc-initials num">{initialsOf(name)}</span>
            ) : (
              <ImagePlus size={22} />
            )}
          </div>

          <div className="a-acc-meta">
            <b>{photoName ?? "No photo yet"}</b>
            <span className="a-note">
              {photo
                ? "Previewing on this page only — nothing is uploaded."
                : "Drop a PNG or JPG here, or click the frame to browse. Up to 2 MB."}
            </span>
            <span className="a-acc-acts" style={{ marginTop: 4 }}>
              <button type="button" className="a-btn a-btn-line a-btn-sm" onClick={() => photoRef.current?.click()}>
                <Upload size={13} /> {photo ? "Replace photo" : "Choose photo"}
              </button>
              {photo ? (
                <button
                  type="button"
                  className="a-btn a-btn-line a-btn-sm"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoName(null);
                  }}
                >
                  <X size={13} /> Remove
                </button>
              ) : null}
            </span>
          </div>

          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="a-acc-file"
            onChange={(e) => {
              readPhoto(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        <div className="a-deal-fields a-acc-fields" style={{ marginTop: 18 }}>
          <label className="a-deal-span">
            Full Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
              placeholder="e.g. Adam Rahman"
              maxLength={NAME_MAX}
              autoComplete="name"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.slice(0, EMAIL_MAX))}
              placeholder="you@example.com"
              maxLength={EMAIL_MAX}
              autoComplete="email"
            />
          </label>
          <label>
            Phone Number
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.slice(0, PHONE_MAX))}
              placeholder="+971 5x xxx xxxx"
              maxLength={PHONE_MAX}
              autoComplete="tel"
            />
          </label>
        </div>
      </div>

      {/* 2 — Security */}
      <div className="a-card a-fade" style={{ marginTop: 20 }}>
        <div className="a-card-head">
          <h2>Security</h2>
          <span className="a-count num">Password</span>
        </div>

        <div className="a-deal-grid">
          <div className="a-deal-fields a-acc-fields">
            <label className="a-deal-span">
              Current Password
              <input
                type={reveal ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value.slice(0, PASS_MAX))}
                placeholder="Your password today"
                maxLength={PASS_MAX}
                autoComplete="current-password"
              />
            </label>
            <label>
              New Password
              <input
                type={reveal ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value.slice(0, PASS_MAX))}
                placeholder={`At least ${PASS_MIN} characters`}
                maxLength={PASS_MAX}
                autoComplete="new-password"
              />
            </label>
            <label>
              Confirm Password
              <input
                type={reveal ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value.slice(0, PASS_MAX))}
                placeholder="Type it again"
                maxLength={PASS_MAX}
                autoComplete="new-password"
                aria-invalid={mismatch || undefined}
              />
            </label>
            <div className="a-deal-span" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span className="a-acc-meter" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <i key={i} className={band >= i ? "on" : ""} />
                ))}
              </span>
              <button
                type="button"
                className="a-btn a-btn-line a-btn-sm"
                onClick={() => setReveal((v) => !v)}
                aria-pressed={reveal}
              >
                {reveal ? <EyeOff size={13} /> : <Eye size={13} />} {reveal ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="a-deal-sum">
            <h3>Password strength</h3>
            <span className="a-deal-srow">
              <span>Assessment</span>
              <b>{band ? BANDS[Math.min(band, 4) - 1] : "—"}</b>
            </span>
            <span className="a-deal-srow">
              <span>Length</span>
              <b className="num">{newPw.length}</b>
            </span>
            <span className="a-deal-srow">
              <span>Confirmed</span>
              <b>{confirmPw ? (newPw === confirmPw ? "Matches" : "Doesn't match") : "—"}</b>
            </span>
            <p className="a-note" style={{ margin: 0 }}>
              <Lock size={12} style={{ display: "inline", verticalAlign: -1 }} /> Mix upper and lower case, a number and a
              symbol for a strong password.
            </p>
          </div>
        </div>
      </div>

      {/* 3 — Notification Preferences */}
      <div className="a-card a-fade" style={{ marginTop: 20 }}>
        <div className="a-card-head">
          <h2>Notification Preferences</h2>
          <span className="a-count num">2 channels</span>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <div className="a-lst-switch">
            <div>
              <b>Email alerts for new leads</b>
              <small className="a-note" style={{ display: "block" }}>
                A note in your inbox the moment a lead lands in your queue.
              </small>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailAlerts}
              aria-label="Email alerts for new leads"
              className="a-switch"
              onClick={() => setEmailAlerts((v) => !v)}
            >
              <span />
            </button>
          </div>

          <div className="a-lst-switch">
            <div>
              <b>WhatsApp alerts for viewings</b>
              <small className="a-note" style={{ display: "block" }}>
                A message on your phone before every scheduled viewing.
              </small>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={whatsappAlerts}
              aria-label="WhatsApp alerts for viewings"
              className="a-switch"
              onClick={() => setWhatsappAlerts((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>

        <p className="a-mut" style={{ marginTop: 14 }}>
          <ShieldCheck size={13} style={{ display: "inline", verticalAlign: -2 }} /> Both switches stay on this page —
          nothing here is saved to your database, and your real sign-in is unchanged.
        </p>
      </div>

      <div className="a-card a-fade" style={{ marginTop: 20 }}>
        <div className="a-modal-actions" style={{ justifyContent: "space-between" }}>
          <span className="a-note" style={{ alignSelf: "center", margin: 0 }}>
            <Check size={13} style={{ display: "inline", verticalAlign: -2 }} /> {emailAlerts ? "Email alerts on" : "Email alerts off"}
            {" · "}
            {whatsappAlerts ? "WhatsApp alerts on" : "WhatsApp alerts off"}
          </span>
          <span className="a-acc-acts">
            <button type="button" className="a-btn a-btn-line" onClick={discard}>
              Discard
            </button>
            <button type="button" className="a-btn a-btn-gold" onClick={save}>
              <Check size={15} /> Save Changes
            </button>
          </span>
        </div>
      </div>
    </>
  );
}
