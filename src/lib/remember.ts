import { supabase } from "@/integrations/supabase/client";

const LS = "propflow.ephemeral";
const SS = "propflow.tab-session";

/** Call right after a successful sign-in. */
export function setRemember(remember: boolean) {
  if (remember) localStorage.removeItem(LS);
  else localStorage.setItem(LS, "1");
  sessionStorage.setItem(SS, "1");
}

/** If the broker chose not to be remembered and this is a new browser session, sign out. */
export async function enforceRemember() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(LS) === "1" && !sessionStorage.getItem(SS)) {
    localStorage.removeItem(LS);
    await supabase.auth.signOut();
  }
  sessionStorage.setItem(SS, "1");
}
