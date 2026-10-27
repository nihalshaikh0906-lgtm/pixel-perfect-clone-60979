import { ArrowDown, ArrowRight, CalendarDays, Check, ChevronRight, CircleCheck, Building2, FileText, LayoutGrid, MapPin, Plus, Sparkles, Users, Flame, Clock, Copy, Compass, TrendingUp } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CountUp, NearViewport, RevealText, Rise, Scene, TiltCard } from './primitives';
const products = [
 {name:'Every deal. One clear view.',label:'DEAL MANAGEMENT',icon:FileText,body:<><p className="d-demo-tag">Illustrative deal</p><h3>AED 2,150,000</h3><span className="d-chip">Pending · Off-plan</span><dl><div><dt>Deal ID</dt><dd>#5176</dd></div><div><dt>Created by</dt><dd>Saad</dd></div><div><dt>Commission</dt><dd>AED 43,000</dd></div></dl></>},
 {name:'Clarity at every stage.',label:'LIVE PIPELINE',icon:LayoutGrid,body:<div className="d-donut"><div><strong>12</strong><small>active deals</small></div><span className="d-donut-key">New · Viewing · Offer · SPA · Closed</span></div>},
 {name:'The right unit. Instantly.',label:'SMART INVENTORY',icon:Building2,body:<><div className="d-floor-plan"><svg viewBox="0 0 220 120" aria-label="Illustrative floor plan"><path d="M20 10H200V110H20ZM90 10V70H200M20 60H90M145 70V110M90 90V110"/><path d="M30 23h42v23H30zM110 24h66v27h-66zM30 74h39v22H30z" className="d-plan-furniture"/></svg></div><h3>Verdana III · VN03-05</h3><p>3BR Townhouse · 2,123 sqft</p><span className="d-demo-tag">Illustrative unit details</span></>},
 {name:'Never miss a viewing.',label:'CONNECTED CALENDAR',icon:CalendarDays,body:<><div className="d-calendar-label">October 2026 <span>‹ &nbsp; ›</span></div><div className="d-calendar">{['M','T','W','T','F','S','S'].map((v,i)=><small key={'day'+i}>{v}</small>)}{Array.from({length:28},(_,i)=><span key={i} className={[3,7,15,19,25].includes(i)?'selected':''}>{i+1}</span>)}</div><span className="d-chip">Thursday · 3 viewings</span></>},
 {name:'Know your next best move.',label:'LEAD INTELLIGENCE',icon:Users,body:<><div className="d-score"><span className="d-avatar">AK</span><strong>87<span>/100</span></strong></div><h3>Ahmed K.</h3><p>Off-plan · Cash buyer</p><span className="d-chip">AED 1.5–2M</span><p className="d-activity">● WhatsApp · 2h ago</p></>},
 {name:'Search without the tabs.',label:'UNIFIED DATA',icon:MapPin,body:<div className="d-inventory-table"><div><b>Project</b><b>Beds</b><b>Status</b></div>{['Verdana III','Marina Star','Oasis','Dubai Hills','Arjan','Creek'].map((p,i)=><div key={p}><span>{p}</span><span>{i%3+1}BR</span><span className={i%3===0?'d-positive':'d-muted'}>{i%3===0?'Available':i%3===1?'Booked':'Sold'}</span></div>)}</div>},
];
function ProductCard({item,index,progress}:{item:typeof products[number];index:number;progress:ReturnType<typeof useScroll>['scrollYProgress']}){
 const reduce=useReducedMotion(); const rotate=useTransform(progress,[0,.35,.75,1],[-28,-22+index*3,0,0]); const y=useTransform(progress,[0,.4,.8],[100+index*20,20,0]);
 return <motion.div className="d-product-card-motion" style={reduce?{}:{rotate,y}}><TiltCard className="d-product-card"><div className="d-product-label"><item.icon size={17}/><span>{item.label}</span><ArrowRight size={15}/></div><div className="d-product-visual">{item.body}</div><h4>{item.name}</h4></TiltCard></motion.div>;
}
export function Product(){const ref=useRef<HTMLDivElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});return <Scene id="product" pinned={false} height="auto"><div className="d-container" ref={ref}><div className="d-section-heading"><span className="d-pill">Seamless control</span><RevealText>Everything your/brokerage needs.</RevealText><p>From first lead to signed SPA — every step in one flow.</p></div><div className="d-product-grid">{products.map((item,i)=><ProductCard key={item.label} item={item} index={i} progress={scrollYProgress}/>)}</div></div></Scene>;}
interface MarketArea {
  name: string;
  shortName: string;
  x: number;
  y: number;
  tier: 'Prime Luxury' | 'High Yield' | 'Rapid Growth';
  psf: number;
  yld: number;
  rent: number;
  occupancy: string;
  growth: string;
  turnaround: string;
  catalyst: string;
  targetBuyer: string;
  pitchHook: string;
  pinColor: string;
}

const areas: readonly MarketArea[] = [
  {
    name: 'Downtown Dubai',
    shortName: 'Downtown',
    x: 475,
    y: 92,
    tier: 'Prime Luxury',
    psf: 2650,
    yld: 5.4,
    rent: 170000,
    occupancy: '92.1%',
    growth: '+18% YoY',
    turnaround: '16 days',
    catalyst: 'Direct Burj Khalifa corridor with unmatched global capital prestige.',
    targetBuyer: 'Global Trophy Collectors & Multinational Executives',
    pitchHook: 'Iconic Downtown trophy asset with 18% YoY capital growth and premier executive leasing.',
    pinColor: '#818CF8',
  },
  {
    name: 'Dubai Marina',
    shortName: 'Marina',
    x: 120,
    y: 210,
    tier: 'Prime Luxury',
    psf: 2150,
    yld: 6.1,
    rent: 145000,
    occupancy: '94.6%',
    growth: '+14% YoY',
    turnaround: '14 days',
    catalyst: 'Waterfront promenade with high holiday-let premiums and liquid resale.',
    targetBuyer: 'European Holiday-Home Investors & Waterfront Buyers',
    pitchHook: 'Waterfront prime with proven 6.1% net yield and high short-let occupancy.',
    pinColor: '#38BDF8',
  },
  {
    name: 'Jumeirah Village Circle',
    shortName: 'JVC',
    x: 255,
    y: 230,
    tier: 'High Yield',
    psf: 1180,
    yld: 7.9,
    rent: 78000,
    occupancy: '97.4%',
    growth: '+22% YoY',
    turnaround: '11 days',
    catalyst: 'Dubai\'s highest rental transaction volume with non-stop tenant queue.',
    targetBuyer: 'UK/GCC High-Yield Buy-to-Let Investors',
    pitchHook: 'Cash flow leader yielding 7.9% gross ROI with 97.4% occupancy and 11-day leasing turnaround.',
    pinColor: '#10B981',
  },
  {
    name: 'Business Bay',
    shortName: 'Business Bay',
    x: 420,
    y: 140,
    tier: 'Prime Luxury',
    psf: 1980,
    yld: 6.6,
    rent: 120000,
    occupancy: '93.8%',
    growth: '+16% YoY',
    turnaround: '15 days',
    catalyst: 'Dubai Canal financial district with walk-to-work executive density.',
    targetBuyer: 'Corporate Professionals & Medium-Term Leasers',
    pitchHook: 'Canal-front corporate hub combining 6.6% rental yield with rapid resale liquidity.',
    pinColor: '#F59E0B',
  },
  {
    name: 'Dubai Hills Estate',
    shortName: 'Dubai Hills',
    x: 340,
    y: 180,
    tier: 'Prime Luxury',
    psf: 2050,
    yld: 5.8,
    rent: 155000,
    occupancy: '95.2%',
    growth: '+17% YoY',
    turnaround: '13 days',
    catalyst: 'Championship golf course, King\'s Hospital, and top British schools.',
    targetBuyer: 'Affluent Expat Families & Long-Term Wealth Preservers',
    pitchHook: 'Premier master community delivering 17% YoY appreciation and multi-year family tenancies.',
    pinColor: '#A78BFA',
  },
  {
    name: 'Arjan (Barsha South)',
    shortName: 'Arjan',
    x: 255,
    y: 300,
    tier: 'Rapid Growth',
    psf: 1090,
    yld: 8.1,
    rent: 72000,
    occupancy: '96.2%',
    growth: '+25% YoY',
    turnaround: '12 days',
    catalyst: 'Lowest entry price in new Dubai, Miracle Garden corridor, new metro line.',
    targetBuyer: 'First-Time Investors & Capital Growth Focused Portfolios',
    pitchHook: 'Sub-AED 1.1k/sqft entry price producing 8.1% gross yield and 25% capital appreciation.',
    pinColor: '#14B8A6',
  },
  {
    name: 'Dubai Investments Park',
    shortName: 'DIP',
    x: 140,
    y: 345,
    tier: 'High Yield',
    psf: 820,
    yld: 8.6,
    rent: 58000,
    occupancy: '95.8%',
    growth: '+19% YoY',
    turnaround: '13 days',
    catalyst: 'Direct proximity to Al Maktoum Airport & Expo City industrial expansion.',
    targetBuyer: 'Corporate Workforce Housing & Pure Cash-Flow Portfolios',
    pitchHook: '8.6% gross yield with continuous corporate workforce tenancy and zero downtime.',
    pinColor: '#F43F5E',
  },
  {
    name: 'Palm Jumeirah',
    shortName: 'Palm',
    x: 120,
    y: 150,
    tier: 'Prime Luxury',
    psf: 3450,
    yld: 5.2,
    rent: 280000,
    occupancy: '93.5%',
    growth: '+21% YoY',
    turnaround: '18 days',
    catalyst: 'World-famous archipelago with international celebrity and ultra-HNWI demand.',
    targetBuyer: 'Ultra-HNWIs & Global Waterfront Collectors',
    pitchHook: 'Global icon with 21% YoY appreciation and ultra-prime beachfront rental yields.',
    pinColor: '#06B6D4',
  },
  {
    name: 'Dubai South',
    shortName: 'Dubai South',
    x: 200,
    y: 425,
    tier: 'Rapid Growth',
    psf: 940,
    yld: 7.4,
    rent: 62000,
    occupancy: '94.1%',
    growth: '+28% YoY',
    turnaround: '14 days',
    catalyst: 'AED 128B Al Maktoum Airport expansion anchor zone.',
    targetBuyer: 'Aviation Infrastructure & 10-Year Growth Investors',
    pitchHook: 'Ground-floor entry in Dubai\'s largest aviation and economic megaproject.',
    pinColor: '#EC4899',
  },
  {
    name: 'Dubai Creek Harbour',
    shortName: 'Creek Harbour',
    x: 520,
    y: 150,
    tier: 'Prime Luxury',
    psf: 1420,
    yld: 7.1,
    rent: 98000,
    occupancy: '95.0%',
    growth: '+20% YoY',
    turnaround: '12 days',
    catalyst: 'Emaar\'s next-generation Downtown with wildlife sanctuary marina views.',
    targetBuyer: 'Modern Urban Waterfront Enthusiasts & Emaar Brand Loyalists',
    pitchHook: 'Modern master development delivering 7.1% yield and 20% YoY value escalation.',
    pinColor: '#3B82F6',
  },
] as const;

const areaOf = (n: string): MarketArea => areas.find((a) => a.name === n || a.shortName === n) ?? areas[0];
const tabs = ['Prices', 'Rental yield', 'Supply', 'Off-plan launches'];

export function Insights() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [area, setArea] = useState('JVC');
  const [copied, setCopied] = useState(false);

  const current = areaOf(area);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      void navigator.clipboard.writeText(current.pitchHook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Scene id="insights" transition="circle">
      <div className="d-container">
        <div className="d-section-heading">
          <span className="d-pill">Clean insights</span>
          <RevealText>Understand your market./See the bigger picture.</RevealText>
          <p>DLD transactions, rental yields, and community velocity — turned into live intelligence.</p>
        </div>

        <div className="d-insights-grid">
          {/* Left Column: Macro Trend Analytics */}
          <Rise className="d-chart-panel">
            <div className="d-tabs" role="tablist" aria-label="Market insights">
              {tabs.map((t, i) => (
                <Button
                  key={t}
                  variant="ghost"
                  role="tab"
                  aria-selected={tab === i}
                  onClick={() => setTab(i)}
                  className={tab === i ? 'active' : ''}
                >
                  {t}
                </Button>
              ))}
            </div>
            <p className="d-eyebrow">
              {tab === 0 ? 'MEDIAN PRICE PER SQFT' : tab === 1 ? 'GROSS RENTAL YIELD' : tab === 2 ? 'UPCOMING HANDOVERS' : 'LAUNCH ACTIVITY'} · Q4 2026 BENCHMARK
            </p>
            <h3>{tab === 0 ? 'AED 1,840' : tab === 1 ? '6.8%' : tab === 2 ? '2026–2030' : 'A market in motion'}</h3>
            <p>Dubai market macro overview</p>

            <div className="d-main-chart" key={tab}>
              {tab === 0 ? (
                <svg viewBox="0 0 420 220" aria-label="Illustrative price trend">
                  <path className="d-grid-lines" d="M0 45H420M0 100H420M0 155H420M0 210H420" />
                  <motion.path
                    className="d-chart-line"
                    d="M0 190C50 180 65 160 100 165S165 90 210 105S260 75 300 90S360 35 420 20"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2 }}
                  />
                </svg>
              ) : (
                <div className={`d-bars ${tab === 2 ? 'vertical' : ''}`}>
                  {(tab === 1 ? [55, 78, 62, 88, 70] : tab === 2 ? [45, 70, 100, 80, 55] : [30, 90, 65, 45, 80]).map((v, i) => (
                    <div className="d-bar-row" key={i}>
                      <span>{tab === 2 ? 2026 + i : ['Marina', 'JVC', 'Hills', 'Arjan', 'Creek'][i]}</span>
                      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="d-bar" style={{ width: `${v}%` }} />
                      <small>{tab === 1 ? (v / 10).toFixed(1) + '%' : v}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="d-chart-axis">
              {['2021', '2022', '2023', '2024', '2025', '2026'].map((v) => (
                <span key={v}>{v}</span>
              ))}
            </div>
            <p className="d-demo-tag">Aggregated DLD market figures · Live investor radar</p>
          </Rise>

          {/* Right Column: Upgraded Dubai Heat Map & Brief Intelligence */}
          <NearViewport className="d-map-preview relative flex flex-col justify-between overflow-hidden">
            {/* Top Area Quick Selector Bar */}
            <div className="p-3 bg-card/85 backdrop-blur-md border-b border-border/60 z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {areas.slice(0, 7).map((a) => {
                  const isSel = a.shortName === current.shortName;
                  return (
                    <button
                      key={a.shortName}
                      type="button"
                      onClick={() => setArea(a.shortName)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
                        isSel
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{a.shortName}</span>
                      <span className="text-[10px] opacity-80 font-mono ml-1">({a.yld}%)</span>
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0 hidden sm:inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE HEATMAP
              </span>
            </div>

            {/* SVG Interactive Map */}
            <div className="relative w-full h-[320px] sm:h-[360px] overflow-hidden bg-sky-500/5">
              <svg viewBox="0 0 600 480" role="img" aria-label="Interactive Dubai area heatmap" className="w-full h-full select-none">
                <defs>
                  {/* Heat glow gradients for each area */}
                  {areas.map((a) => (
                    <radialGradient key={`grad-${a.shortName}`} id={`ins-glow-${a.shortName}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={a.pinColor} stopOpacity="0.65" />
                      <stop offset="50%" stopColor={a.pinColor} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={a.pinColor} stopOpacity="0" />
                    </radialGradient>
                  ))}
                  {/* Arabian Gulf Water Gradient */}
                  <linearGradient id="gulfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.08" />
                  </linearGradient>
                </defs>

                {/* Arabian Gulf Water */}
                <path fill="url(#gulfGrad)" d="M0 0H600L520 60 400 110 330 170 220 215 150 300 80 330 0 430Z" />

                {/* Palm Jumeirah Stylized Frond Marker */}
                <path
                  className="fill-sky-500/25 stroke-sky-400/50 stroke-1"
                  d="M100 240 C105 220, 115 210, 125 215 C135 210, 145 220, 140 240 C135 245, 115 245, 100 240 Z"
                />

                {/* Coastline */}
                <path className="d-map-land fill-secondary/50 stroke-border/50" d="M600 0L520 60 400 110 330 170 220 215 150 300 80 330 0 430V500H600Z" />

                {/* Main Highways (Sheikh Zayed Road E11 & Al Khail Road E44) */}
                <path className="fill-none stroke-border/70 stroke-[3.5px]" d="M80 470L120 340 240 250 350 175 475 110 590 45" />
                <path className="fill-none stroke-border/50 stroke-[2px] stroke-dashed" d="M200 490L250 330 370 250 580 190" />
                <path className="fill-none stroke-border/40 stroke-[1.5px]" d="M40 350L400 430 600 390" />

                {/* Dynamic Glowing Heat Halos */}
                {areas.map((a) => {
                  const isSel = a.shortName === current.shortName;
                  return (
                    <circle
                      key={`halo-${a.shortName}`}
                      cx={a.x}
                      cy={a.y}
                      r={isSel ? 58 : 38}
                      fill={`url(#ins-glow-${a.shortName})`}
                      className={`pointer-events-none transition-all duration-300 ${isSel ? 'opacity-100' : 'opacity-50'}`}
                    />
                  );
                })}

                {/* Interactive Area Markers */}
                {areas.map((a) => {
                  const isSel = a.shortName === current.shortName;
                  return (
                    <g
                      key={a.name}
                      tabIndex={0}
                      role="button"
                      aria-label={`${a.name}: ${a.yld}% yield`}
                      className="cursor-pointer outline-none transition-transform duration-200"
                      onClick={() => setArea(a.shortName)}
                      onMouseEnter={() => setArea(a.shortName)}
                    >
                      {/* Active Ripple */}
                      {isSel && (
                        <circle
                          cx={a.x}
                          cy={a.y}
                          r={28}
                          fill={a.pinColor}
                          className="opacity-30 animate-ping pointer-events-none"
                        />
                      )}

                      {/* Pin Outer Ring */}
                      <circle
                        cx={a.x}
                        cy={a.y}
                        r={isSel ? 18 : 12}
                        fill={a.pinColor}
                        fillOpacity={isSel ? 0.4 : 0.2}
                        stroke={a.pinColor}
                        strokeWidth={isSel ? 2.5 : 1.5}
                      />
                      {/* Center Dot */}
                      <circle
                        cx={a.x}
                        cy={a.y}
                        r={isSel ? 5.5 : 4}
                        fill={a.pinColor}
                      />

                      {/* Yield Pill Tag right below pin */}
                      <rect
                        x={a.x - 20}
                        y={a.y + 12}
                        width={40}
                        height={15}
                        rx={4}
                        fill="var(--card, #FFFFFF)"
                        stroke={isSel ? a.pinColor : 'var(--border, #E2E8F0)'}
                        strokeWidth={isSel ? 1.5 : 1}
                        className="shadow-2xs"
                      />
                      <text
                        x={a.x}
                        y={a.y + 22.5}
                        textAnchor="middle"
                        fill={isSel ? a.pinColor : 'currentColor'}
                        className={`text-[9px] font-mono font-black ${isSel ? 'font-black' : 'fill-foreground'}`}
                      >
                        {a.yld}%
                      </text>

                      {/* Area Name */}
                      <text
                        x={a.x}
                        y={a.y - 10}
                        textAnchor="middle"
                        fill={isSel ? a.pinColor : 'currentColor'}
                        className={`text-[11px] font-display ${
                          isSel ? 'font-black drop-shadow-sm' : 'font-bold fill-muted-foreground'
                        }`}
                      >
                        {a.shortName}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Floating Intelligence Briefing Card */}
            <div className="p-3.5 sm:p-4 bg-card/95 backdrop-blur-xl border-t border-border/70 z-10 space-y-2.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.shortName}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  className="space-y-2.5"
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-foreground font-display">
                        {current.name}
                      </span>
                      <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25">
                        {current.tier}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                      <Flame size={12} />
                      <span>{current.yld}% Yield</span>
                    </div>
                  </div>

                  {/* 4 Brief Stats Pillars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-secondary/50 border border-border/50">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase font-bold block">
                        Avg Sale Price
                      </span>
                      <strong className="text-foreground font-mono text-xs block mt-0.5">
                        AED {current.psf.toLocaleString()} <small className="text-[9px] text-muted-foreground font-normal">/sqft</small>
                      </strong>
                      <span className="text-[9px] text-emerald-500 font-extrabold">{current.growth}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold block">
                        Gross Yield
                      </span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-xs block mt-0.5">
                        {current.yld.toFixed(1)}% <small className="text-[9px] text-muted-foreground font-normal">ROI</small>
                      </strong>
                      <span className="text-[9px] text-muted-foreground">vs 6.2% avg</span>
                    </div>

                    <div className="p-2 rounded-lg bg-secondary/50 border border-border/50">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase font-bold block">
                        Annual Rent
                      </span>
                      <strong className="text-foreground font-mono text-xs block mt-0.5">
                        AED {current.rent.toLocaleString()}
                      </strong>
                      <span className="text-[9px] text-blue-500 font-bold">{current.occupancy} occ.</span>
                    </div>

                    <div className="p-2 rounded-lg bg-secondary/50 border border-border/50">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase font-bold block">
                        Lease Turnaround
                      </span>
                      <strong className="text-foreground font-mono text-xs block mt-0.5">
                        {current.turnaround}
                      </strong>
                      <span className="text-[9px] text-muted-foreground">to signed Ejari</span>
                    </div>
                  </div>

                  {/* Concise Brief Intelligence & Ready Pitch Snippet */}
                  <div className="p-2.5 rounded-xl bg-background border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5 max-w-lg">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <Users size={11} className="text-primary" />
                        <span>Target Buyer:</span>
                        <span className="text-foreground font-semibold lowercase first-letter:uppercase">{current.targetBuyer}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic line-clamp-1">
                        “{current.pitchHook}”
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all cursor-pointer shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-emerald-500" />
                          <span>Copied Pitch</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Pitch</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </NearViewport>
        </div>

        <div className="d-stats-strip">
          {[
            [70000, 'Units Tracked'],
            [1800, 'Projects Cataloged'],
            [300, 'Developers Verified'],
          ].map(([v, label]) => (
            <div key={label}>
              <CountUp value={Number(v)} suffix="+" />
              <span>{label}</span>
            </div>
          ))}
          <div>
            <strong>Daily</strong>
            <span>Data-first intelligence</span>
          </div>
        </div>
        <p className="d-demo-note">Product preview · displayed figures represent curated DLD intelligence benchmarks.</p>
      </div>
    </Scene>
  );
}
