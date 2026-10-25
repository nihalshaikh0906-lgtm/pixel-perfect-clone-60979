/**
 * 7-Day Universal Testing Access Configuration
 * Active account for full system test-run across both Owner Cockpit and Broker Desk.
 */

export const TESTING_EMAIL = "dealostesting.com";
export const TESTING_PASSWORD = "Rko8786!";

// Exactly 7 days from now (Expires at end of Nov 1, 2026 UAE time)
export const TESTING_EXPIRY_TIMESTAMP = new Date("2026-11-01T23:59:59+04:00").getTime();

export function isTestingAccount(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return (
    clean === "dealostesting.com" ||
    clean === "test@dealostesting.com" ||
    clean === "admin@dealostesting.com" ||
    clean === "dealostesting@gmail.com" ||
    clean === "dealostesting@dealos.ae" ||
    clean.includes("dealostesting")
  );
}

export function isTestingAccountValid(email?: string | null): boolean {
  if (!isTestingAccount(email)) return false;
  return Date.now() <= TESTING_EXPIRY_TIMESTAMP;
}

export function getTestingAccountRemainingDays(): number {
  const diff = TESTING_EXPIRY_TIMESTAMP - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
