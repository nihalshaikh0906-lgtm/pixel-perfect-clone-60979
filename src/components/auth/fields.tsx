import { Check, Eye, EyeOff } from "lucide-react";
import { useState, type ReactNode } from "react";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FieldProps = {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; autoComplete?: string; disabled?: boolean;
  error?: string | null | undefined; ok?: boolean | undefined; onBlur?: (() => void) | undefined; right?: ReactNode; hint?: ReactNode;
};

export function Field({ id, label, value, onChange, type = "text", placeholder, autoComplete, disabled, error, ok, onBlur, right, hint }: FieldProps) {
  return (
    <div className={`au-field ${error ? "bad" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="au-input">
        <input
          id={id} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete} disabled={disabled}
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
        />
        {ok && !right ? <span className="au-ok" aria-label="Looks good"><Check size={16} /></span> : null}
        {right}
      </div>
      {hint}
      {error ? <p id={`${id}-err`} className="au-err">{error}</p> : null}
    </div>
  );
}

export function PasswordField(props: Omit<FieldProps, "type" | "right" | "hint">) {
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  return (
    <div onKeyUp={(e) => setCaps(e.getModifierState("CapsLock"))} onKeyDown={(e) => setCaps(e.getModifierState("CapsLock"))}>
      <Field
        {...props}
        type={show ? "text" : "password"}
        right={
          <button type="button" className="au-eye" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((v) => !v)}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        hint={caps ? <span className="au-caps">Caps Lock is on</span> : null}
      />
    </div>
  );
}

export function CheckBox({ checked, onChange, children, id }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; id: string }) {
  return (
    <label className="au-check" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="au-box" aria-hidden><Check size={13} /></span>
      <span>{children}</span>
    </label>
  );
}

/** Reads whether Google sign-in is switched on for this project. */
export async function googleEnabled(): Promise<boolean> {
  try {
    const url = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
    const key = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string | undefined;
    if (!url || !key) return false;
    const r = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
    if (!r.ok) return false;
    const j = (await r.json()) as { external?: { google?: boolean } };
    return !!j.external?.google;
  } catch {
    return false;
  }
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3ZM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Zm-5.6-8a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9l3.3-2.5ZM12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6Z" />
    </svg>
  );
}
