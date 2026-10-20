import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy · DealOS UAE (PDPL Compliant)' },
      {
        name: 'description',
        content: 'DealOS Privacy Policy in accordance with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL) and RERA data governance standards.',
      },
      { property: 'og:title', content: 'Privacy Policy · DealOS UAE' },
      {
        property: 'og:description',
        content: 'Institutional real estate CRM data protection, multi-tenant isolation, and UAE PDPL compliance.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <main className="dealos min-h-screen bg-[#07090e] text-zinc-300">
      <div className="d-legal max-w-4xl mx-auto px-6 py-24 font-sans leading-relaxed">
        <Link
          to="/welcome"
          className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors text-sm mb-8 font-medium"
        >
          ← Return to DealOS Cockpit
        </Link>

        <header className="border-b border-white/10 pb-8 mb-10">
          <div className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold/10 text-gold border border-gold/30">
            UAE PDPL Statutory Notice
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy & Data Governance
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Effective Date: 20 October 2026 · Governing Law: United Arab Emirates Federal Decree-Law No. 45 of 2021
          </p>
        </header>

        <section className="space-y-8 text-sm md:text-base">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Regulatory Framework & Data Controller</h2>
            <p className="text-zinc-300">
              DealOS Technologies LLC (&ldquo;DealOS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the DealOS Real Estate Operating System (dealos.ae) tailored for licensed real estate brokerages, agents, and managing directors operating within Dubai and the wider United Arab Emirates. We are committed to strict compliance with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection (the &ldquo;UAE PDPL&rdquo;) and all guidelines issued by the UAE Data Office and the Dubai Land Department (DLD) / Real Estate Regulatory Agency (RERA).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Roles: Data Controller vs. Data Processor</h2>
            <p className="text-zinc-300 mb-2">
              Under the UAE PDPL, our legal classification varies depending on the personal data being processed:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>
                <strong className="text-white">DealOS as Data Controller:</strong> We act as Data Controller for personal data directly collected from our subscribing agency owners, individual brokers, and website visitors (e.g., account registration details, billing identifiers, RERA Broker Card BRN, Office Registration Number ORN, and inbound demo requests).
              </li>
              <li>
                <strong className="text-white">DealOS as Data Processor:</strong> For client contacts, buyer dossiers, investor portfolios, passport copies, Title Deed records, Form A/B listings, and lead communication logs entered into your DealOS tenant workspace, your brokerage acts as the Data Controller, and DealOS acts solely as the secure Data Processor processing records under your instruction.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. Personal Data Collected</h2>
            <p className="text-zinc-300 mb-2">We process the following categories of data:</p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li><strong className="text-white">Brokerage & Identity Records:</strong> Full legal name, official corporate email, UAE mobile / WhatsApp number, agency trade name, DLD ORN, and RERA broker registration number.</li>
              <li><strong className="text-white">Deal & Inventory Metadata:</strong> Off-plan and secondary listings, price tags, escrow account data, project allocations, and transaction lifecycle logs.</li>
              <li><strong className="text-white">Operational Telemetry:</strong> Log timestamps, IP addresses, browser fingerprint, session activity, and interaction logs with the DealOS Copilot engine.</li>
              <li><strong className="text-white">Demo & Inbound Inquiries:</strong> Contact information submitted via our concierge demo form (persisted securely in encrypted institutional databases).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Strict Multi-Tenant Separation & Non-Co-Mingling Guarantee</h2>
            <p className="text-zinc-300">
              We uphold an inviolable multi-tenant isolation architecture. Your brokerage&rsquo;s private client records, investor contact lists, and unlisted pocket inventory are cryptographically partitioned by agency workspace ID. <strong className="text-gold">We never sell, commercialize, syndicate, or cross-reference your client data with competing brokerages, developers, or marketing networks.</strong> Your client list remains your sole proprietary asset.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Legal Bases for Processing</h2>
            <p className="text-zinc-300 mb-2">We process personal data under the lawful grounds established in Article 4 of the UAE PDPL:</p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li><strong className="text-white">Contractual Performance:</strong> Enabling CRM features, lead allocation, AI unit recommendations, and document generation.</li>
              <li><strong className="text-white">Statutory & Regulatory Obligations:</strong> Ensuring compliance with UAE anti-money laundering (AML), DLD verification, and electronic commercial standards.</li>
              <li><strong className="text-white">Explicit Consent:</strong> Explicit user opt-in provided during account creation and demo submission.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">6. Cloud Infrastructure & Cross-Border Data Transfers</h2>
            <p className="text-zinc-300">
              DealOS relies on SOC2 Type II, ISO/IEC 27001 certified cloud infrastructure with enterprise-grade AES-256 encryption at rest and TLS 1.3 in transit. Any international transfer of telemetry complies strictly with Article 22 and 23 of the UAE PDPL, ensuring an adequate level of data protection equivalent to UAE federal standards.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">7. Data Retention & Permanent Deletion</h2>
            <p className="text-zinc-300">
              Agency data is maintained throughout your active license subscription. Upon account termination or written request from a managing director, DealOS executes complete data extraction and permanent cryptographic erasure within 30 business days, subject to mandatory statutory financial record-keeping laws of the UAE.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">8. Your Statutory Rights Under the UAE PDPL</h2>
            <p className="text-zinc-300 mb-2">As a data subject under UAE law, you possess the rights to:</p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>Request access to your stored personal data.</li>
              <li>Request correction or rectification of incomplete or inaccurate records.</li>
              <li>Request data erasure (&ldquo;Right to be Forgotten&rdquo;) where lawful grounds apply.</li>
              <li>Restrict or object to processing for automated marketing.</li>
              <li>Obtain your data in a structured, portable electronic format.</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h2 className="text-xl font-bold text-white mb-2">9. Data Protection Officer Contact</h2>
            <p className="text-zinc-300">
              To exercise your statutory data protection rights, request compliance documentation, or inquire about our security architecture, contact our Data Protection Office:
            </p>
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
              <p className="text-white font-medium">DealOS Data Protection & Compliance Office</p>
              <p className="text-zinc-400">Email: <a href="mailto:privacy@dealos.ae" className="text-gold hover:underline">privacy@dealos.ae</a></p>
              <p className="text-zinc-400">Corporate Portal: <a href="https://dealos.ae" className="text-gold hover:underline">https://dealos.ae</a></p>
              <p className="text-zinc-400">Jurisdiction: Dubai, United Arab Emirates</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
