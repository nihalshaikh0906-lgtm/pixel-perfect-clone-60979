# Minimalist luxury typography and lining numerals

## Scope
- Replace the current serif-led hierarchy with a restrained Plus Jakarta Sans system across the app.
- Keep all layouts, data, interactions, and colors unchanged except for the requested text contrast adjustments.
- Apply lining, tabular numerals globally so prices, dates, percentages, clocks, counts, and metrics share a flat baseline.

## Changes
1. Update the global font loading to use Plus Jakarta Sans with the required 400, 500, and 600 weights.
2. Map both body and display typography tokens to Plus Jakarta Sans so existing headings and brand text inherit the new system consistently.
3. Set the base body size to 15px with 1.6 line height, medium UI emphasis, and global `lining-nums tabular-nums` OpenType features.
4. Restyle headings and display text to weights 500–600 with subtle expanded tracking, while keeping small category labels at 11px with restrained uppercase spacing.
5. Add a reusable metric style and apply it to dashboard values, prices, percentages, dates, and prominent numeric fields.
6. Adjust semantic foreground and muted-foreground tokens to Deep Obsidian Slate and Warm Sand Charcoal for clearer contrast.
7. Verify the dashboard and client dossier at desktop and mobile sizes, including numeric alignment and overflow.

## Technical details
- Tailwind v4 tokens remain in `src/styles.css`; no JavaScript Tailwind config will be added.
- Google Fonts remain loaded through the document head, not CSS imports.
- Existing semantic color utilities and components remain authoritative.
