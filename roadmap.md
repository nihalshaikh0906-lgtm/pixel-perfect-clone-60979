# Roadmap

- [x] Match final CRM sidebar groups and create all missing placeholder pages without changing the design
- [x] Add and verify the Needs Attention bell dropdown with clearly labelled mock alerts; all 20 destinations, collapse and narrow-screen navigation passed

- [x] Connect New lead to the existing saved-lead form; saved and read back through CRM
- [x] Fit matched-property cards, property photos and map controls to the available screen
- [x] Verify lead creation and property layout with real inventory photos on wide/narrow screens
- [ ] Validate Google Maps rendering on an authorized deployed origin — sandbox Maps checks are unsupported

- [x] Speed up dossier replies by trimming repeated inventory details and overlapping safe request setup
- [x] Remove artificial 60-second chat deadlines so slower real replies are not discarded
- [x] Remove the invented verification badge and Dashboard nav label
- [x] Reduce dossier chat overhead without losing numbered property context
- [x] Only provide dossier PDF after an explicit request or acceptance of an offer
- [x] Hardcode dossier chat to n8n webhook (no env vars) — verified reaching n8n
- [x] Remove burgundy (dark surfaces back to charcoal #17140F)
- [x] AI assistant fixed: AI_MODEL = deepseek-v4-pro, reply confirmed on screen
- [x] n8n production workflow returns replies

## DealOS public experience
- [x] Add and verify illustrative leads trend and deals pipeline charts below the existing dashboard panels; tooltips render and the row stacks at narrow widths
- [x] Remove the custom cursor and reduce scroll/mouse animation overhead while retaining live controls
- [x] Build foundation, hero, product, insights, integrations, tools, workflow and modes from uploaded briefs
- [x] Build proof, pricing, CTA and footer scenes
- [x] Validate reversible scroll, mobile interactions, reduced motion and page rendering
- [x] New login, signup and reset-password pages
- [x] Welcome hero intro animation
- [ ] Connect demo requests — awaiting a real destination; keep preview submission clearly labelled

- [x] Restore charcoal/silk/gold on the public page and verify lighter, faster transitions
- [x] Remove scroll interpolation, isolate page scenes from navigation updates, and shorten text reveals
- [x] Make every landing section scroll normally and replace drag-and-drop with click/tap workflow stages
- [x] Remove full-section scroll animation overhead and automatic portal updates; add keyboard stage navigation
- [x] Restore lively landing previews and richer click-to-run workflow without drag-and-drop
- [x] Verify scrolling, preview interactions and reduced-motion rendering

- [x] Readability pass on /welcome (contrast, min 13px text, no stuck fades, dashboard at real size)
- [x] Broker workspace /app: home, leads inbox, lead detail, placeholders
- [ ] Workspace sections (Pipelines, Today, Off-plan, Ready, Rentals, Areas, Listings, Market, Updates, Tools, Automations, Settings) — placeholders until specified
- [x] Deals workspace page: five-step chevron pipeline, ten-column demo table, search/sort/expand/copy/CSV, phone cards, client mode hides commission; /deals shortcut added

## Current updates
- [ ] Bind Project Details gallery and sidebar to real Supabase media and fields; remove stock photography
- [x] Update landing hero, proof and footer with enterprise CRM positioning
- [x] Add themed monthly calendar alongside the existing Appointments diary and verify date selection (14 rows → 4 on Oct 9 → 14 after reset; isolated page check, external sign-in unavailable)

## Agency assistant and Home
- [x] Personalize full-page AI Assistant with agency profile and existing chat component
- [x] Restore /app Home with exactly five requested sections and no lead tables
- [x] Verify isolated desktop/mobile page layouts, company/fallback title and assistant input; authenticated requests unverified on external Supabase

## Live inventory dashboard
- [x] Fit dashboard metrics within cards; isolated rendered number containment verified
- [x] Replace owner dashboard mock figures with live Supabase inventory totals
- [x] Load all inventory through paginated Offplan, Ready Property and Rentals views
- [x] Verify category mappings and pagination logic; preview compiles without errors
- [ ] Verify signed-in inventory browsing and property drawer end-to-end — external Supabase sessions unavailable to the sandbox
