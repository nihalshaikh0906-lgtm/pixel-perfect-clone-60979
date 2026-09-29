import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { quarterOf } from "@/lib/format";

type Section = { title: string; bullets: { text: string; items: string[] }[] };

const clean = (s: string) =>
  s.replace(/\*\*|__|[#*`]+/g, "").replace(/\s+/g, " ").replace(/^[-•–\s]+/, "").trim();

function toBullets(body: string) {
  const sentences = body
    .split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9"“(])/)
    .map(clean)
    .filter((s) => s.length > 1);
  return sentences.map((s) => {
    const parts = s.split(/,\s*|;\s*/).map((p) => p.replace(/\.$/, "").trim()).filter(Boolean);
    // Long comma lists (amenities etc.) → lead text + chips
    if (parts.length >= 4 && parts.every((p) => p.length <= 60)) {
      const first = parts[0] ?? "";
      const colon = first.indexOf(":");
      if (colon > 0) {
        return { text: first.slice(0, colon + 1), items: [first.slice(colon + 1).trim(), ...parts.slice(1)].filter(Boolean) };
      }
      return { text: "", items: parts };
    }
    return { text: s, items: [] };
  });
}

export function parseOverview(raw: string): Section[] {
  const chunks = raw.split(/#{3,6}\s*/);
  const sections: Section[] = [];
  chunks.forEach((chunk, i) => {
    const trimmed = chunk.trim();
    if (!trimmed) return;
    let title = "Overview";
    let body = trimmed;
    if (i > 0 || raw.trimStart().startsWith("#")) {
      const nl = trimmed.indexOf("\n");
      title = clean(nl >= 0 ? trimmed.slice(0, nl) : trimmed);
      body = nl >= 0 ? trimmed.slice(nl + 1) : "";
    }
    const bullets = toBullets(body).filter((b) => b.text || b.items.length);
    if (bullets.length || title) sections.push({ title: title || "Details", bullets });
  });
  return sections.filter((s) => s.bullets.length);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PackOverview({ overview, project }: { overview: string; project: any }) {
  const [expanded, setExpanded] = useState(false);
  const sections = parseOverview(overview);
  const visible = expanded ? sections : sections.slice(0, 2);

  const facts = [
    ["Developer", project?.developer_name],
    ["District", project?.district],
    ["Handover", project?.handover_date ? quarterOf(project.handover_date) : null],
    ["Construction", project?.build_progress_pct != null ? `${project.build_progress_pct}%` : null],
    ["Service charge", project?.service_charge],
    ["Floors", project?.floors_text],
    ["Furnishing", project?.furnishing],
  ].filter(([, v]) => v != null && String(v).trim() !== "");

  return (
    <div className="max-w-prose space-y-5 text-sm leading-[1.6]">
      {facts.length ? (
        <div className="panel p-4">
          <p className="mb-2 font-semibold text-foreground">Key facts</p>
          <ul className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
            {facts.map(([label, value]) => (
              <li key={label} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  <span className="text-muted-foreground">{label}: </span>
                  <span className="font-medium">{String(value)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {visible.map((s, i) => (
        <div key={i} className="space-y-2">
          <h4 className="font-semibold text-foreground">{s.title}</h4>
          <ul className="space-y-2 text-muted-foreground">
            {s.bullets.map((b, j) => (
              <li key={j} className="flex gap-2">
                <span className="mt-0 text-primary">•</span>
                <div className="space-y-1.5">
                  {b.text ? <p>{b.text}</p> : null}
                  {b.items.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {b.items.map((it, k) => (
                        <span key={k} className="rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-xs">
                          {it}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {sections.length > 2 ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          {expanded ? "Show less" : `Show more (${sections.length - 2})`}
          <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      ) : null}
    </div>
  );
}
