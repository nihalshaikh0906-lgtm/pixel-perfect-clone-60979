import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Building2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@tanstack/react-router';

// Real-time market data across key Dubai real estate sectors
const DUBAI_COMMUNITIES = [
  {
    name: 'Dubai Marina',
    x: 120,
    y: 210,
    sale: 2150,
    rent: 145000,
    yld: 6.1,
    badge: 'High Liquidity',
    unitsCount: '4,120 Units',
    growth: '+14% YoY',
    highlight: 'Waterfront prime',
    badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    pinColor: '#38BDF8',
  },
  {
    name: 'Downtown',
    x: 470,
    y: 95,
    sale: 2650,
    rent: 170000,
    yld: 5.4,
    badge: 'Trophy Capital',
    unitsCount: '2,890 Units',
    growth: '+18% YoY',
    highlight: 'Burj Khalifa views',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    pinColor: '#818CF8',
  },
  {
    name: 'JVC',
    x: 255,
    y: 235,
    sale: 1180,
    rent: 78000,
    yld: 7.9,
    badge: 'High Yield Radar',
    unitsCount: '8,450 Units',
    growth: '+22% YoY',
    highlight: 'High rental demand',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    pinColor: '#34D399',
  },
  {
    name: 'Business Bay',
    x: 410,
    y: 150,
    sale: 1980,
    rent: 120000,
    yld: 6.6,
    badge: 'Commercial Hub',
    unitsCount: '3,780 Units',
    growth: '+16% YoY',
    highlight: 'Canal front living',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    pinColor: '#FBBF24',
  },
  {
    name: 'Arjan',
    x: 270,
    y: 305,
    sale: 1090,
    rent: 72000,
    yld: 8.1,
    badge: 'Investor Sweet Spot',
    unitsCount: '5,210 Units',
    growth: '+25% YoY',
    highlight: 'Lowest entry price',
    badgeColor: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    pinColor: '#2DD4BF',
  },
  {
    name: 'DIP',
    x: 140,
    y: 350,
    sale: 820,
    rent: 58000,
    yld: 8.6,
    badge: 'Maximum Yield',
    unitsCount: '1,940 Units',
    growth: '+19% YoY',
    highlight: 'Industrial & logistics boom',
    badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    pinColor: '#FB7185',
  },
] as const;

export function AreaIntelMap() {
  const [active, setActive] = useState<string>('JVC');
  const current = DUBAI_COMMUNITIES.find((p) => p.name === active) ?? DUBAI_COMMUNITIES[0]!;

  return (
    <div className="d-panel d-area-intel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-xl space-y-4">
      {/* Header and Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-400 block">
            ● DLD YIELD RADAR
          </span>
          <h4 className="text-base sm:text-lg font-bold text-foreground font-display mt-0.5">
            Dubai Community Heat Map &amp; Gross Yields
          </h4>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Tap pins or pills to inspect live yields
        </span>
      </div>

      {/* Mobile-Friendly Fast Community Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {DUBAI_COMMUNITIES.map((c) => {
          const isSelected = c.name === active;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => setActive(c.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap active:scale-95 border ${
                isSelected
                  ? `${c.badgeColor} shadow-md`
                  : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border-border/50'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-[10px] opacity-90 font-mono ml-1.5 font-bold">({c.yld}%)</span>
            </button>
          );
        })}
      </div>

      {/* Map & Card Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* SVG Interactive Map (7 cols) */}
        <div className="lg:col-span-7 relative rounded-2xl bg-secondary/30 border border-border/60 overflow-hidden min-h-[300px] flex items-center justify-center">
          <svg viewBox="0 0 600 460" className="w-full h-auto select-none" role="img" aria-label="Interactive Dubai area heatmap">
            {/* Water */}
            <path className="fill-sky-500/15" d="M0 0H600L520 60 400 110 330 170 220 215 150 300 80 330 0 430Z" />
            {/* Coastline */}
            <path className="fill-secondary/50 stroke-border/40" d="M600 0L520 60 400 110 330 170 220 215 150 300 80 330 0 430V460H600Z" />
            {/* Highways */}
            <path className="fill-none stroke-border/60 stroke-[4px]" d="M80 450L120 340 240 250 350 175 475 110 590 45M200 460L250 330 370 250 580 190" />

            {/* Interactive Community Pins */}
            {DUBAI_COMMUNITIES.map((p) => {
              const isSelected = p.name === active;
              return (
                <g
                  key={p.name}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => setActive(p.name)}
                >
                  {/* Ping animation on active pin */}
                  {isSelected && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={36}
                      fill={p.pinColor}
                      className="opacity-20 animate-ping pointer-events-none"
                    />
                  )}
                  {/* Outer circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 26 : 18}
                    fill={isSelected ? p.pinColor : 'currentColor'}
                    stroke={isSelected ? p.pinColor : 'currentColor'}
                    className={
                      isSelected
                        ? 'fill-opacity-30 stroke-opacity-90 stroke-2 shadow-lg'
                        : 'fill-primary/20 stroke-primary/60 stroke-1 hover:fill-primary/40'
                    }
                  />
                  {/* Center pin dot */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 7 : 5}
                    fill={isSelected ? p.pinColor : 'currentColor'}
                    className={isSelected ? '' : 'fill-primary'}
                  />
                  {/* Label */}
                  <text
                    x={p.x}
                    y={p.y + 36}
                    textAnchor="middle"
                    fill={isSelected ? p.pinColor : 'currentColor'}
                    className={`text-[12px] font-bold ${
                      isSelected ? 'font-black drop-shadow-sm' : 'fill-muted-foreground'
                    }`}
                  >
                    {p.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic Detail Card (5 cols) */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="p-4 sm:p-5 rounded-2xl bg-secondary/50 border border-border/80 space-y-3.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black text-foreground font-display">
                    {current.name}
                  </h4>
                  <span className="text-xs text-muted-foreground font-medium block mt-0.5">
                    {current.highlight}
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-full border shadow-xs ${current.badgeColor}`}>
                  {current.badge}
                </span>
              </div>

              {/* 3 Metric Rows */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-background border border-border/70 shadow-xs">
                  <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase tracking-wider block">
                    Avg Sale Price
                  </span>
                  <span className="text-base font-black text-foreground font-mono mt-0.5 block">
                    AED {current.sale.toLocaleString()} <small className="text-xs text-muted-foreground font-normal">/ sqft</small>
                  </span>
                  <span className="text-[10px] text-emerald-500 font-extrabold">{current.growth}</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 shadow-xs">
                  <span className="text-[10px] font-mono text-emerald-500 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                    Gross Rental Yield
                  </span>
                  <span className="text-base font-black text-emerald-500 dark:text-emerald-400 font-mono mt-0.5 block">
                    {current.yld.toFixed(1)}% <small className="text-xs text-muted-foreground font-normal">ROI</small>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">Dubai benchmark</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-between text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <Building2 size={15} className="text-blue-400" />
                  <span className="text-muted-foreground font-medium">Active Catalog:</span>
                  <strong className="text-foreground font-black font-mono">{current.unitsCount}</strong>
                </div>
                <Link
                  to="/demo"
                  className="text-xs font-bold text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore units</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
