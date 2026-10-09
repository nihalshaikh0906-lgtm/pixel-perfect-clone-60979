<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use Plus Jakarta Sans for both display and body typography, with lining tabular numerals globally, to keep the luxury interface restrained and numeric baselines uniform.

- Private listings are JSON files at broker-logos/{userId}/listings/{id}.json — external DB tables must not be added.
- All AI writing (chat, news summaries, market reports) goes through DeepSeek via deal-os.server (aiWrite/streamChat) — user asked for DeepSeek everywhere.
- News = Firecrawl search (gateway) + DeepSeek summary, cached per Dubai day in memory — no news table exists.
- Property tour links are resolved only in src/lib/youtube.ts (findTourUrl/youtubeEmbed) and rendered by ProjectTourModal — packs expose `videos`/`tours` arrays, so never assume a dedicated youtube_url column exists.

- Keep DealOS public landing components and semantic token overrides scoped under `.dealos`; this preserves the authenticated PropFlow visual system.
- Lazy-load illustrative dashboard Recharts panels after visibility, with stable chart heights and landing-token colours; this keeps the initial render light and chart styling consistent.
- Use lightweight scroll-linked opacity and transforms, pause offscreen ambient animation, and avoid artificial loading delays; this preserves reversible transitions without expensive blur or clipping.
- Drive landing scroll effects directly from scroll progress without spring interpolation or animated section scaling/radii, and avoid global pointer tracking; this reduces per-frame work and settling lag.
- Use native page scrolling, memoized landing scenes, and visibility-gated CSS tile motion; this keeps input immediate and prevents navigation updates from rerendering the whole page.
- Keep landing scenes in normal document flow and use tab-selected workflow stages instead of a drag builder; this preserves uninterrupted scrolling and keyboard/touch interaction.
- Animate individual landing reveals rather than scroll-transforming entire sections; autoplay illustrative portal and workspace previews only in view with pause controls and reduced-motion support to keep the restored live landing inexpensive.
- Keep public demo booking explicitly non-transmitting until a real destination is configured; this prevents false delivery confirmations.

- The /app broker workspace lives under src/routes/_authenticated/app*, styled by src/components/app/app.css scoped to .dapp; demo leads come only from src/lib/demo-leads.ts so they can later be swapped for real tables, and every count is derived from that data.
- Matched units on lead pages come from the real search_units RPC, never from demo data, so prices and projects are never invented.

- Reuse UnitCard and PropertyPackDrawer for matched-property inspection; demo lead IDs must never be written to the clients-backed shortlists table.
- New lead actions open the existing CRM creation form so saved leads have one persistence path.
- Final CRM navigation preserves existing dashboard, leads and properties pages; missing sections use explicit authenticated leaf routes and the shared WorkspacePlaceholder to retain workspace styling.
- Client dossier shortlists read the existing shortlists table through RLS and refresh after saving; property cards share the recommendation inspection flow.

- Company/agent roles live in org_members (separate from profiles) and are checked via my_org()/is_org_admin() security-definer functions; avoids RLS recursion and role spoofing. New tables are now allowed by the user.

- Keep the Appointments calendar and diary in the canonical /app/appointments leaf; /appointments redirects there so both entry points share the same filters and layout.

- Render /app as the five-section broker Home without redirecting to the CRM table; the owner dashboard remains a separate destination.
- The full-page agency assistant reuses the existing AiChat and its established transport unchanged, rather than introducing duplicate chat primitives or a new provider integration.
- Dashboard inventory totals and category views read existing Supabase projects/units through authenticated server functions; scan summary rows in bounded batches and paginate displayed rows so no default row limit silently truncates inventory.
- Categorize units by their stored listing_type, mapping secondary sales to Ready Property and keeping rental and unknown types separate; never infer rental stock or agency revenue from unit prices.
