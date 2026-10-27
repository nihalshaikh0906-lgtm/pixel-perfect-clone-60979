import { memo } from 'react';
import { TrendingUp, ShieldCheck, Zap, Building2, Flame } from 'lucide-react';

interface TickerItem {
  id: string;
  type: 'deal' | 'escrow' | 'sla' | 'yield';
  tag: string;
  headline: string;
  sub: string;
  metric: string;
  highlight?: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
  {
    id: '1',
    type: 'deal',
    tag: 'DLD VERIFIED',
    headline: 'Dubai Hills Estate · 4BR Villa',
    sub: 'Off-Plan Allocation',
    metric: 'AED 12,400,000',
    highlight: true,
  },
  {
    id: '2',
    type: 'yield',
    tag: 'YIELD RADAR',
    headline: 'Palm Jumeirah Waterfront',
    sub: 'Projected Gross Yield',
    metric: '7.4% ROI',
  },
  {
    id: '3',
    type: 'sla',
    tag: 'SPEED TO LEAD',
    headline: 'WhatsApp Investor Dispatch',
    sub: 'Platform Avg Response Time',
    metric: '42 seconds ⚡',
    highlight: true,
  },
  {
    id: '4',
    type: 'escrow',
    tag: 'ESCROW ACTIVE',
    headline: 'Creek Waters 2 · Emaar',
    sub: 'Official DLD Escrow Account',
    metric: '100% Compliant',
  },
  {
    id: '5',
    type: 'deal',
    tag: 'DLD VERIFIED',
    headline: 'Downtown Dubai · 2BR Opera District',
    sub: 'Secondary Resale',
    metric: 'AED 4,850,000',
  },
  {
    id: '6',
    type: 'escrow',
    tag: 'MILESTONE SYNC',
    headline: 'Sobha Hartland 2 · 3BR Lagoon',
    sub: 'Payment Plan 80/20',
    metric: '34,850 Units Live',
    highlight: true,
  },
];

export const LiveDubaiMarketTicker = memo(function LiveDubaiMarketTicker() {
  // Double the array for seamless infinite marquee loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full relative overflow-hidden py-3 border-y border-border/50 bg-background/60 backdrop-blur-md select-none group">
      {/* Soft gradient edge masks */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Hardware-accelerated 60fps marquee track */}
      <div className="flex w-max animate-ticker group-hover:[animation-play-state:paused] will-change-transform">
        {items.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="flex items-center gap-3 px-5 py-1.5 border-r border-border/40 whitespace-nowrap text-xs transition-colors hover:bg-secondary/40 rounded-lg cursor-default"
          >
            {/* Category Tag with Distinct High-Contrast Color Coding */}
            <div className="flex items-center gap-1.5">
              {item.type === 'deal' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {item.tag}
                </span>
              )}
              {item.type === 'yield' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <TrendingUp size={11} className="text-amber-400" />
                  {item.tag}
                </span>
              )}
              {item.type === 'sla' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-teal-500/15 text-teal-400 border border-teal-500/30">
                  <Zap size={11} className="text-teal-400" />
                  {item.tag}
                </span>
              )}
              {item.type === 'escrow' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <ShieldCheck size={11} className="text-blue-400" />
                  {item.tag}
                </span>
              )}
            </div>

            {/* Bold Headline */}
            <span className="font-extrabold text-foreground tracking-tight">
              {item.headline}
            </span>

            {/* Subtle sub-context */}
            <span className="text-muted-foreground text-[11px] hidden sm:inline font-medium">
              ({item.sub})
            </span>

            {/* Highlighted Metric Badge */}
            <span
              className={`font-mono font-black text-xs px-2.5 py-0.5 rounded-lg border shadow-xs ${
                item.type === 'deal'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : item.type === 'yield'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : item.type === 'sla'
                  ? 'bg-teal-500/15 text-teal-400 border-teal-500/30'
                  : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
              }`}
            >
              {item.metric}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
