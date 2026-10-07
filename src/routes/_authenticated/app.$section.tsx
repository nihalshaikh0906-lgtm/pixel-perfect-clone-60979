import { createFileRoute, Link } from "@tanstack/react-router";

const TITLES: Record<string, string> = {
  pipelines: "Pipelines", today: "Today", "off-plan": "Off-plan", ready: "Ready to buy", rentals: "Rentals", areas: "Areas",
  listings: "My listings", market: "Market", updates: "Updates", tools: "Tools", automations: "Automations", settings: "Settings",
};

export const Route = createFileRoute("/_authenticated/app/$section")({
  head: ({ params }) => {
    const t = TITLES[params.section] ?? "Workspace";
    return { meta: [
      { title: `${t} — DealOS Workspace` },
      { name: "description", content: `${t} in your DealOS broker workspace.` },
      { property: "og:title", content: `${t} — DealOS Workspace` },
      { property: "og:description", content: `${t} in your DealOS broker workspace.` },
    ] };
  },
  component: Section,
});

function Section() {
  const { section } = Route.useParams();
  const title = TITLES[section] ?? "Page not found";
  return (
    <section className="a-band a-fade">
      <div>
        <p className="eyebrow-a">Coming soon</p>
        <h1>{title}</h1>
        <p className="sub">This part of the new workspace is being built. Your leads inbox and home are ready to use.</p>
      </div>
      <div className="a-band-actions"><Link to="/app" className="a-btn a-btn-line">Back to home</Link><Link to="/app/leads" search={{ queue: "respond" }} className="a-btn a-btn-ink">Open inbox</Link></div>
    </section>
  );
}
