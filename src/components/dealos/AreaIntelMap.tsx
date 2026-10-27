import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Building2, ShieldCheck, ArrowRight, Sparkles, Flame, Users, Clock, Copy, Check, Compass } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export interface CommunityIntel {
  name: string;
  shortName: string;
  x: number;
  y: number;
  sale: number;
  rent: number;
  yld: number;
  occupancy: string;
  growth: string;
  category: 'Prime Waterfront' | 'Trophy Luxury' | 'High Yield' | 'Commercial' | 'Growth Hotspot';
  turnaround: string;
  targetBuyer: string;
  catalyst: string;
  pitchHook: string;
  unitsCount: string;
  pinColor: string;
  glowColor: string;
  badgeColor: string;
}

// Curated Dubai Real Estate Intelligence Data
export const DUBAI_COMMUNITIES: CommunityIntel[] = [
  {
    name: 'Dubai Marina',
    shortName: 'Marina',
    x: 125,
    y: 205,
    sale: 2150,
    rent: 145000,
    yld: 6.1,
    occupancy: '94.6%',
    growth: '+14% YoY',
    category: 'Prime Waterfront',
    turnaround: '14 days',
    targetBuyer: 'European HNWIs & Holiday-Home Investors',
    catalyst: 'Waterfront promenade, high holiday-let premiums and global brand equity.',
    pitchHook: 'Waterfront prime with proven 6.1% gross yield and high short-let liquidity.',
    unitsCount: '4,120 Units',
    pinColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    badgeColor: 'bg-sky-500/15 text-sky-500 dark:text-sky-400 border-sky-500/30',
  },
  {
    name: 'Downtown Dubai',
    shortName: 'Downtown',
    x: 470,
    y: 95,
    sale: 2650,
    rent: 170000,
    yld: 5.4,
    occupancy: '92.1%',
    growth: '+18% YoY',
    category: 'Trophy Luxury',
    turnaround: '16 days',
    targetBuyer: 'Global Trophy Collectors & Corporate Executives',
    catalyst: 'Burj Khalifa & Dubai Mall corridor; unmatched global capital preservation.',
    pitchHook: 'Prestigious Downtown address delivering 18% YoY capital growth and institutional tenants.',
    unitsCount: '2,890 Units',
    pinColor: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.45)',
    badgeColor: 'bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border-indigo-500/30',
  },
  {
    name: 'Jumeirah Village Circle',
    shortName: 'JVC',
    x: 255,
    y: 235,
    sale: 1180,
    rent: 78000,
    yld: 7.9,
    occupancy: '97.4%',
    growth: '+22% YoY',
    category: 'High Yield',
    turnaround: '11 days',
    targetBuyer: 'UK/GCC Buy-to-Let Yield Seekers',
    catalyst: 'Dubai\'s #1 transaction volume hub with non-stop tenant queue.',
    pitchHook: 'High cash flow powerhouse with 7.9% gross ROI and 97.4% occupancy rate.',
    unitsCount: '8,450 Units',
    pinColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
  {
    name: 'Business Bay',
    shortName: 'Business Bay',
    x: 410,
    y: 150,
    sale: 1980,
    rent: 120000,
    yld: 6.6,
    occupancy: '93.8%',
    growth: '+16% YoY',
    category: 'Commercial',
    turnaround: '15 days',
    targetBuyer: 'Corporate Professionals & Medium-Term Leasers',
    catalyst: 'Dubai Water Canal expansion and Downtown financial spillover.',
    pitchHook: 'Canal-front corporate hub combining 6.6% rental yield with rapid resale liquidity.',
    unitsCount: '3,780 Units',
    pinColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  {
    name: 'Arjan (Barsha South)',
    shortName: 'Arjan',
    x: 270,
    y: 305,
    sale: 1090,
    rent: 72000,
    yld: 8.1,
    occupancy: '96.2%',
    growth: '+25% YoY',
    category: 'Growth Hotspot',
    turnaround: '12 days',
    targetBuyer: 'First-Time Investors & Capital Growth Focused Buyers',
    catalyst: 'Miracle Garden corridor, new metro expansion, lowest entry price in new Dubai.',
    pitchHook: 'Under-AED 1.1k/sqft entry price producing 8.1% gross yield and 25% YoY capital growth.',
    unitsCount: '5,210 Units',
    pinColor: '#14B8A6',
    glowColor: 'rgba(20, 184, 166, 0.45)',
    badgeColor: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
  },
  {
    name: 'Dubai Investments Park',
    shortName: 'DIP',
    x: 140,
    y: 350,
    sale: 820,
    rent: 58000,
    yld: 8.6,
    occupancy: '95.8%',
    growth: '+19% YoY',
    category: 'High Yield',
    turnaround: '13 days',
    targetBuyer: 'Corporate Accommodation & Pure Cash-Flow Portfolios',
    catalyst: 'Direct proximity to Al Maktoum Airport & Expo City expansion.',
    pitchHook: 'Unmatched 8.6% gross yield with heavy demand from Expo City logistics workforce.',
    unitsCount: '1,940 Units',
    pinColor: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    badgeColor: 'bg-rose-500/15 text-rose-500 dark:text-rose-400 border-rose-500/30',
  },
];

type CategoryFilter = 'all' | 'high-yield' | 'prime' | 'growth';

export function AreaIntelMap({ onOpenPitch }: { onOpenPitch?: () => void }) {
  const [active, setActive] = useState<string>('JVC');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [copied, setCopied] = useState(false);

  const filteredCommunities = DUBAI_COMMUNITIES.filter((c) => {
    if (categoryFilter === 'high-yield') return c.yld >= 7.5;
    if (categoryFilter === 'prime') return c.category === 'Prime Waterfront' || c.category === 'Trophy Luxury';
    if (categoryFilter === 'growth') return c.category === 'Growth Hotspot' || c.growth.includes('25%') || c.growth.includes('22%');
    return true;
  });

  const current = DUBAI_COMMUNITIES.find((p) => p.shortName === active || p.name === active) ?? DUBAI_COMMUNITIES[2]!;

  const handleCopyPitch = () => {
    if (navigator?.clipboard) {
      void navigator.clipboard.writeText(current.pitchHook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="d-panel d-area-intel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-xl space-y-4">
      {/* Header and Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              LIVE DLD RENTAL YIELD RADAR
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-foreground font-display mt-0.5">
            Dubai Community Heat Map &amp; Investor Intelligence
          </h4>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Compass size={13} className="text-primary" />
          <span>25.2048° N, 55.2708° E · Q4 2026 Feed</span>
        </div>
      </div>

      {/* Filter Tabs & Community Selector */}
      <div className="flex flex-col gap-2.5 w-full">
        {/* Category Filter Chips - Clean 2x2 grid on mobile, 4-column on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-secondary/60 border border-border/50 text-[11px] w-full">
          {(
            [
              ['all', 'All Areas (6)'],
              ['high-yield', 'High Yield (>7.5%)'],
              ['prime', 'Prime & Luxury'],
              ['growth', 'Highest Growth'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategoryFilter(key)}
              className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer text-center truncate ${
                categoryFilter === key
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Community Quick Selector - smoothly touch-scrollable without clipping */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 w-full max-w-full scrollbar-none no-scrollbar touch-pan-x">
          {filteredCommunities.map((c) => {
            const isSelected = c.shortName === current.shortName;
            return (
              <button
                key={c.shortName}
                type="button"
                onClick={() => setActive(c.shortName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap active:scale-95 border shrink-0 ${
                  isSelected
                    ? `${c.badgeColor} shadow-sm ring-1 ring-primary/40`
                    : 'bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground border-border/50'
                }`}
              >
                <span>{c.shortName}</span>
                <span className="text-[10px] opacity-90 font-mono ml-1 font-bold">({c.yld}%)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* SVG Dubai Heatmap (7 cols) */}
        <div className="lg:col-span-7 relative rounded-2xl bg-secondary/30 border border-border/60 overflow-hidden min-h-[330px] flex items-center justify-center p-2">
          <svg viewBox="0 0 600 460" className="w-full h-auto select-none" role="img" aria-label="Interactive Dubai area heatmap">
            <defs>
              {/* Radial heat glow for each community */}
              {DUBAI_COMMUNITIES.map((c) => (
                <radialGradient key={`grad-${c.shortName}`} id={`glow-${c.shortName}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={c.pinColor} stopOpacity="0.65" />
                  <stop offset="45%" stopColor={c.pinColor} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={c.pinColor} stopOpacity="0" />
                </radialGradient>
              ))}
              {/* Water Gradient */}
              <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            {/* Arabian Gulf Water */}
            <path fill="url(#seaGrad)" d="M0 0H600L520 60 400 110 330 170 220 215 150 300 80 330 0 430Z" />
            
            {/* Palm Jumeirah Silhouette */}
            <path
              className="fill-sky-500/20 stroke-sky-500/40 stroke-1"
              d="M100 240 C105 220, 115 210, 125 215 C135 210, 145 220, 140 240 C135 245, 115 245, 100 240 Z"
            />
            <text x="120" y="235" textAnchor="middle" className="text-[7px] font-mono fill-sky-400/80 font-bold">Palm</text>

            {/* Coastline */}
            <path className="fill-secondary/50 stroke-border/50 stroke-[1.5px]" d="M600 0L520 60 400 110 330 170 220 215 150 300 80 330 0 430V460H600Z" />

            {/* Highways (Sheikh Zayed Road E11 & Al Khail Road E44) */}
            <path className="fill-none stroke-border/70 stroke-[3px]" d="M80 450L120 340 240 250 350 175 475 110 590 45" />
            <path className="fill-none stroke-border/50 stroke-[2px] stroke-dashed" d="M200 460L250 330 370 250 580 190" />
            <text x="510" y="70" className="text-[8px] font-mono fill-muted-foreground/80 font-semibold select-none">E11 (Sheikh Zayed)</text>
            <text x="390" y="240" className="text-[8px] font-mono fill-muted-foreground/80 font-semibold select-none">E44 (Al Khail)</text>

            {/* Glowing Heat Halos */}
            {DUBAI_COMMUNITIES.map((p) => {
              const isSelected = p.shortName === current.shortName;
              return (
                <circle
                  key={`halo-${p.shortName}`}
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? 64 : 44}
                  fill={`url(#glow-${p.shortName})`}
                  className={`pointer-events-none transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-60'}`}
                />
              );
            })}

            {/* Interactive Pins */}
            {DUBAI_COMMUNITIES.map((p) => {
              const isSelected = p.shortName === current.shortName;
              return (
                <g
                  key={p.shortName}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => setActive(p.shortName)}
                >
                  {/* Ripple pulse on active */}
                  {isSelected && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={32}
                      fill={p.pinColor}
                      className="opacity-25 animate-ping pointer-events-none"
                    />
                  )}

                  {/* Marker Base */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 20 : 14}
                    fill={p.pinColor}
                    fillOpacity={isSelected ? 0.35 : 0.2}
                    stroke={p.pinColor}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all duration-200"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 6 : 4.5}
                    fill={p.pinColor}
                  />

                  {/* Yield Label Tag */}
                  <rect
                    x={p.x - 22}
                    y={p.y + 14}
                    width={44}
                    height={16}
                    rx={5}
                    fill="var(--card, #FFFFFF)"
                    stroke={isSelected ? p.pinColor : "var(--border, #E2E8F0)"}
                    strokeWidth={isSelected ? 1.5 : 1}
                    className="shadow-xs"
                  />
                  <text
                    x={p.x}
                    y={p.y + 25.5}
                    textAnchor="middle"
                    fill={isSelected ? p.pinColor : "currentColor"}
                    className={`text-[9.5px] font-mono font-black ${isSelected ? 'font-black' : 'fill-foreground'}`}
                  >
                    {p.yld}%
                  </text>

                  {/* Community Name Label */}
                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    fill={isSelected ? p.pinColor : "currentColor"}
                    className={`text-[11px] font-display ${
                      isSelected ? 'font-black drop-shadow-sm' : 'font-bold fill-muted-foreground'
                    }`}
                  >
                    {p.shortName}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic Detail Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.shortName}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="p-4 sm:p-5 rounded-2xl bg-secondary/40 border border-border/80 space-y-4 shadow-md h-full flex flex-col justify-between"
            >
              {/* Card Title & Category */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {current.category}
                    </span>
                    <h4 className="text-xl font-black text-foreground font-display leading-tight">
                      {current.name}
                    </h4>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-mono font-black px-2.5 py-1 rounded-full border shadow-xs shrink-0 ${current.badgeColor}`}>
                    <Flame size={12} />
                    <span>{current.yld}% Yield</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {current.catalyst}
                </p>
              </div>

              {/* 4 Micro Stat Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Sale Price */}
                <div className="p-2.5 rounded-xl bg-background border border-border/70 shadow-2xs">
                  <span className="text-[9.5px] font-mono text-muted-foreground font-bold uppercase tracking-wider block">
                    Avg Sale Price
                  </span>
                  <span className="text-sm font-black text-foreground font-mono mt-0.5 block">
                    AED {current.sale.toLocaleString()} <small className="text-[10px] text-muted-foreground font-normal">/ sqft</small>
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">{current.growth}</span>
                </div>

                {/* Gross Yield */}
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 shadow-2xs">
                  <span className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                    Gross ROI Yield
                  </span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                    {current.yld.toFixed(1)}% <small className="text-[10px] text-muted-foreground font-normal">annually</small>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">vs 6.2% Dubai avg</span>
                </div>

                {/* Annual Rent */}
                <div className="p-2.5 rounded-xl bg-background border border-border/70 shadow-2xs">
                  <span className="text-[9.5px] font-mono text-muted-foreground font-bold uppercase tracking-wider block">
                    Median Rent
                  </span>
                  <span className="text-sm font-black text-foreground font-mono mt-0.5 block">
                    AED {current.rent.toLocaleString()} <small className="text-[10px] text-muted-foreground font-normal">/ yr</small>
                  </span>
                  <span className="text-[10px] text-blue-500 font-semibold">{current.occupancy} occupancy</span>
                </div>

                {/* Lease Turnaround */}
                <div className="p-2.5 rounded-xl bg-background border border-border/70 shadow-2xs">
                  <span className="text-[9.5px] font-mono text-muted-foreground font-bold uppercase tracking-wider block">
                    Tenant Turnaround
                  </span>
                  <span className="text-sm font-black text-foreground font-mono mt-0.5 block">
                    {current.turnaround}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">listing to signed Ejari</span>
                </div>
              </div>

              {/* Brief Intelligence Box: Target Buyer + Pitch Hook */}
              <div className="p-3 rounded-xl bg-background/80 border border-border/70 space-y-2 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Users size={12} className="text-primary" />
                    <span>Primary Buyer Persona</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground mt-0.5">
                    {current.targetBuyer}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Sparkles size={11} /> READY PITCH HOOK
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPitch}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      {copied ? <><Check size={11} className="text-emerald-500" /> Copied</> : <><Copy size={11} /> Copy hook</>}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic mt-1 line-clamp-2">
                    “{current.pitchHook}”
                  </p>
                </div>
              </div>

              {/* Action Strip */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Building2 size={14} className="text-primary" />
                  <span>Verified Units:</span>
                  <strong className="text-foreground font-mono">{current.unitsCount}</strong>
                </div>

                <Link
                  to="/welcome"
                  onClick={(e) => {
                    if (onOpenPitch) {
                      e.preventDefault();
                      onOpenPitch();
                    }
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  <span>Pitch this area</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
