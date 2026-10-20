import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms of Service · DealOS Institutional Broker OS' },
      {
        name: 'description',
        content: 'DealOS Terms of Service for real estate brokerages, managing directors, and commercial software licenses in Dubai and the UAE.',
      },
      { property: 'og:title', content: 'Terms of Service · DealOS UAE' },
      {
        property: 'og:description',
        content: 'Commercial subscription terms, agency licensing, data ownership, and governing law for DealOS.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: Terms,
});

function Terms() {
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
            Commercial SaaS License Agreement
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Effective Date: 20 October 2026 · Governing Law: Emirate of Dubai, United Arab Emirates
          </p>
        </header>

        <section className="space-y-8 text-sm md:text-base">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Scope and Acceptance of Terms</h2>
            <p className="text-zinc-300">
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between DealOS Technologies LLC (&ldquo;DealOS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) and the business entity or individual (&ldquo;Client&rdquo;, &ldquo;Brokerage&rdquo;, &ldquo;You&rdquo;) subscribing to or accessing the DealOS operating system located at dealos.ae and related mobile or cloud applications. By creating an account, initiating a subscription, or accessing the platform, you represent that you have the legal authority to bind yourself or your real estate agency to these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Eligibility & Regulatory Registration</h2>
            <p className="text-zinc-300">
              DealOS is engineered exclusively for professionals within the real estate and property development sectors. By using DealOS within the United Arab Emirates, you warrant that you are a registered real estate broker holding a valid RERA Broker ID (BRN) or represent an agency holding a valid Dubai Land Department Office Registration Number (ORN) or corresponding UAE municipal real estate trade license.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. Commercial Subscriptions & UAE VAT Billing</h2>
            <p className="text-zinc-300 mb-2">
              Access to DealOS is provided on an institutional subscription basis. Available tiers include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li><strong className="text-white">Individual Broker License:</strong> AED 129 billed monthly, with discounted tiers available for 3-month (AED 349), 6-month (AED 629), and annual commitments (AED 1,099/yr).</li>
              <li><strong className="text-white">Enterprise & Multi-Seat Agency Licensing:</strong> Tailored agency deployments including Owner Overwatch, Developer Commission Debt Ledgers, custom white-label portals, and dedicated SLA support.</li>
              <li><strong className="text-white">Taxes:</strong> All fees are stated in United Arab Emirates Dirham (AED) and are subject to 5% UAE Value Added Tax (VAT) pursuant to UAE Federal Decree-Law No. 8 of 2017 where applicable.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Absolute Client Data Ownership</h2>
            <p className="text-zinc-300">
              <strong className="text-gold">You retain 100% sole, exclusive, and unencumbered ownership of all customer records, investor dossiers, buyer leads, transaction logs, and proprietary listings uploaded to DealOS.</strong> DealOS acquires no title, copyright, or ownership over your brokerage&rsquo;s client data. We will never sell, lease, disclose, or transfer your leads to any third party, portal, or competitor.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Portability & Export Guarantee</h2>
            <p className="text-zinc-300">
              You are entitled to export your complete lead database, client records, and transaction histories in standard machine-readable formats (e.g., CSV, JSON) at any time through the DealOS dashboard, with zero lock-in or artificial technical hurdles.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">6. Acceptable Use and Platform Security</h2>
            <p className="text-zinc-300 mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>Reverse engineer, decompile, or extract the source code or proprietary AI logic of DealOS.</li>
              <li>Use the platform to distribute unsolicited spam or conduct misleading real estate advertising prohibited by RERA regulations.</li>
              <li>Share individual seat credentials outside your authorized agency staff.</li>
              <li>Circumvent or compromise multi-tenant tenant isolation mechanisms or rate limits.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">7. Service Availability & Enterprise SLA</h2>
            <p className="text-zinc-300">
              DealOS targets a 99.9% uptime across all production CRM and Copilot endpoints. Scheduled maintenance windows are communicated in advance. DealOS is hosted on enterprise-tier resilient cloud infrastructure with redundant automated backups.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">8. Limitation of Liability</h2>
            <p className="text-zinc-300">
              To the maximum extent permitted by UAE law, DealOS shall not be liable for any indirect, consequential, or punitive damages, or loss of profits arising out of property market fluctuations, developer delays, or transactional disputes between brokers and property buyers. DealOS&rsquo;s aggregate liability under any claim shall not exceed the total fees paid by the client in the 12 months preceding the claim.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h2 className="text-xl font-bold text-white mb-2">9. Governing Law and Dubai Jurisdiction</h2>
            <p className="text-zinc-300">
              These Terms are governed by and construed in accordance with the laws of the Emirate of Dubai and the applicable Federal Laws of the United Arab Emirates. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent Courts of Dubai (or DIFC Courts where agreed in enterprise contracts).
            </p>
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
              <p className="text-white font-medium">DealOS Legal & Enterprise Contracts</p>
              <p className="text-zinc-400">Email: <a href="mailto:legal@dealos.ae" className="text-gold hover:underline">legal@dealos.ae</a></p>
              <p className="text-zinc-400">Headquarters: Business Bay, Dubai, United Arab Emirates</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
