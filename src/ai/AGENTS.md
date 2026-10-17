# DealOS AI Layer Architecture & Agent Guidelines

## 1. Overview
The AI layer of DealOS V2 powers the broker intelligence copilot (`/api/mastermind`, Mastermind chat). It is specifically engineered for Dubai off-plan and ready property transactions, strictly adhering to RERA compliance, DLD Ejari data integrity, multi-tenant isolation, and privacy standards.

## 2. Core Agents & Roles

### Mastermind (Primary Assistant)
- **Role**: Elite real estate intelligence agent assisting brokers, agents, and institutional investors in Dubai.
- **Tone**: White-glove, executive, concise, fact-grounded.
- **Knowledge Boundaries**:
  - Operates exclusively with verified DealOS database facts, DLD Ejari rental transactions, and live web searches.
  - Zero tolerance for hallucination: never invents views (Burj Khalifa, sea, golf course), maid's rooms, or Airbnb/short-term rental yields.
  - If a field is empty or unavailable, explicitly states: *"No verified data registered in the official dataset."*

## 3. Data Integrity & RERA Compliance Rules

1. **Mandatory Source Labels**:
   - Property specifications, prices, payment plans: `Source: DealOS Database (as provided by developer)`
   - Rental yields / Ejari transactions: `Source: DLD Ejari rental contracts (community median, n = [count])`
2. **The $N \ge 5$ Rule for Medians**:
   - Median rental yields and statistics may ONLY be provided when there are at least 5 registered DLD Ejari contracts ($N \ge 5$).
   - If fewer than 5 contracts exist, the system must output: *"Insufficient official DLD Ejari rental contracts (minimum 5 required) to show a reliable rental yield."*
3. **Golden Visa UAE-Only Rule**:
   - The UAE Golden Visa threshold applies exclusively to properties inside the United Arab Emirates valued at $\ge$ AED 2,000,000.
   - For properties outside the UAE (e.g. Bali, Phuket, Baku, London, Oman), the assistant must explicitly clarify: *"Not applicable. This project is located outside the UAE. The UAE Golden Visa is strictly for property within the United Arab Emirates."*
   - Golden Visa qualification within the UAE is always presented as *indicative* and subject to official DLD and ICP approval.
4. **No Investment or Financial Advice**:
   - Never promise capital appreciation, guaranteed returns, or risk-free investment.
   - All yield numbers are indicative gross historical yields.
5. **Closest Options Fallback**:
   - When user search parameters (budget, bedrooms, area) yield 0 exact results, the model must not state a dead end or hallucinate false matches.
   - It activates `closest.ts` to retrieve and present the closest alternatives, explicitly disclosing: *"No exact match found for your criteria. Here are the closest available options..."*

## 4. Security & Privacy Hardening

1. **Lead PII Protection**:
   - Private lead personal data (phone numbers, email addresses, passport/ID numbers, payment credentials, personal notes) is scrubbed by `guard.ts` before reaching the model context.
   - The model only receives operational preferences (budget, bedroom count, preferred areas, investment purpose).
2. **Multi-Tenant Boundary Enforcement**:
   - Every tool call requires a verified tenant context (`org_id` / `company_id`).
   - Private listings, leads, deals, and appointments are strictly scoped to the requesting organization.
   - Queries attempting to access another organization's records fail closed and return zero results or an access denied error.
3. **Prompt Injection & Instruction Shielding**:
   - `guard.ts` intercepts adversarial prompts (jailbreaks, "ignore previous instructions", role spoofing).
   - Tool results (database text, developer descriptions, web snippets) are sanitized to neutralize injected instructions from overriding system rules or exfiltrating data.
4. **Startup Configuration Validation**:
   - Startup validation in `mastermind.server.ts` guarantees `MASTERMIND_BASE_URL`, `MASTERMIND_API_KEY`, and model ID are present and well-formed.
   - Error messages report environment variable *names only*, never leaking credential values.
