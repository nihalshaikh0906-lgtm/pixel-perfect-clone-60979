// Lightweight Markdown renderer for AI replies: headings, lists, tables, **bold**.
function inlineBold(s: string) {
  return s.split(/(\*\*[^*]+\*\*)/g).map((part, k) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={k} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={k}>{part}</span>
    ),
  );
}

type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; level: number; text: string }
  | { kind: "ol"; items: { n: string; text: string }[] }
  | { kind: "ul"; items: string[] }
  | { kind: "table"; rows: string[][] };

function cleanInline(s: string) {
  return s.replace(/^#+\s*/, "").replace(/__/g, "");
}

export function ChatText({ text }: { text: string }) {
  const blocks: Block[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || /^-{3,}$/.test(line)) continue;
    const last = blocks[blocks.length - 1];
    if (line.startsWith("|")) {
      const cells = line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
      if (last?.kind === "table") last.rows.push(cells);
      else blocks.push({ kind: "table", rows: [cells] });
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      blocks.push({ kind: "h", level: h[1]!.length, text: h[2] ?? "" });
      continue;
    }
    const m = line.match(/^(\d+)[.)]\s+(.*)$/);
    if (m) {
      if (last?.kind === "ol") last.items.push({ n: m[1] ?? "", text: m[2] ?? "" });
      else blocks.push({ kind: "ol", items: [{ n: m[1] ?? "", text: m[2] ?? "" }] });
      continue;
    }
    const b = line.match(/^[-*•]\s+(.*)$/);
    if (b) {
      if (last?.kind === "ul") last.items.push(b[1] ?? "");
      else blocks.push({ kind: "ul", items: [b[1] ?? ""] });
      continue;
    }
    blocks.push({ kind: "p", text: cleanInline(line) });
  }
  return (
    <div className="space-y-2">
      {blocks.map((b, i) => {
        if (b.kind === "p") return <p key={i}>{inlineBold(b.text)}</p>;
        if (b.kind === "h")
          return b.level === 1 ? (
            <h3 key={i} className="pt-1 text-[15px] font-semibold uppercase tracking-[0.08em]">
              {inlineBold(b.text)}
            </h3>
          ) : (
            <h4 key={i} className="pt-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">
              {inlineBold(b.text)}
            </h4>
          );
        if (b.kind === "ul")
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {b.items.map((it, j) => (
                <li key={j}>{inlineBold(it)}</li>
              ))}
            </ul>
          );
        if (b.kind === "table")
          return (
            <div key={i} className="overflow-x-auto">
              <table className="w-full border-collapse text-[14px]">
                <tbody>
                  {b.rows.map((r, j) => (
                    <tr key={j} className={j === 0 && b.rows.length > 1 ? "font-semibold" : ""}>
                      {r.map((c, k) => (
                        <td key={k} className="metric border border-border px-2 py-1 align-top">
                          {inlineBold(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        return (
          <ol key={i} className="my-3 space-y-3">
            {b.items.map((it, j) => (
              <li key={j} className="flex gap-2.5">
                <span className="metric w-5 shrink-0 text-right font-semibold text-primary">{it.n}.</span>
                <span className="min-w-0">{inlineBold(it.text)}</span>
              </li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}
