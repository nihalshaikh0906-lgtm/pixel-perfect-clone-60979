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
