export function workspaceHead(title: string) {
  const description = `${title} in your DealOS CRM workspace.`;
  return { meta: [
    { title: `${title} — DealOS CRM` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — DealOS CRM` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] };
}

export function WorkspacePlaceholder({ title, group }: { title: string; group: string }) {
  return (
    <section className="a-band a-fade">
      <div>
        <p className="eyebrow-a">{group}</p>
        <h1>{title}</h1>
        <p className="sub">Coming soon</p>
      </div>
    </section>
  );
}