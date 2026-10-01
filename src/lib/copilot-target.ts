// Where the dossier chat sends each message.
//
// The browser cannot post to this address itself (it lives on another website, so the
// browser blocks the call). The app's own server makes the call instead and hands the
// answer back — see src/routes/api/dossier-copilot.ts.
//
// Set this to an empty string to go back to the built-in assistant.
export const N8N_WEBHOOK_URL = "http://localhost:9099/reply"; // TEMP-MOCK

export function n8nConfigured(): boolean {
  return N8N_WEBHOOK_URL.startsWith("http");
}
