import { ArrowDown, ArrowRight, Building2, Check, ChevronLeft, ChevronRight, FileText, Globe, KeyRound, Mail, MessageCircle, Pause, Play, Plus, RotateCcw, Sparkles, Target, Users, X } from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RevealText, Rise, Scene, TiltCard } from './primitives';
import { PhysicalDealCalculator } from './FloatingDealCalculator';
import skyline from '@/assets/dealos-dubai.jpg';
const apps=['Property Finder','Bayut','Dubizzle','WhatsApp','Meta Ads','Google Ads','Calendar','Gmail','Zapier','TikTok','LinkedIn','Mailchimp'];
export function Integrations(){return <Scene id="integrations" pinned height="180vh"><div className="d-integration-stage"><div className="d-orbit-center"><span className="d-pill">Your ecosystem. Connected.</span><RevealText>Connect all/your apps.</RevealText><p>Less switching. More selling.</p><span className="d-demo-tag">Integration concept · availability varies</span></div><div className="d-orbits">{[0,1].map(row=><div key={row} className={`d-orbit orbit-${row}`}>{apps.slice(row*6,row*6+6).map((app,i)=><div className={`d-orbit-position pos-${i}`} key={app}><div className="d-app-logo" tabIndex={0} title={`${app} · illustrative integration`}><span className={`d-app-initial app-${(i+row)%4}`}>{app==='WhatsApp'?<MessageCircle/>:app==='Gmail'?<Mail/>:app.split(' ').map(v=>v[0]).join('').slice(0,2)}</span><small>{app}</small></div></div>)}</div>)}</div><div className="d-mobile-apps">{[0,1].map(row=><div className={`d-logo-marquee row-${row}`} key={row}>{[...apps.slice(row*6,row*6+6),...apps.slice(row*6,row*6+6)].map((v,i)=><span key={i}><b>{v.slice(0,1)}</b>{v}</span>)}</div>)}</div></div></Scene>;}
function Satellite(){const [split,setSplit]=useState(50);return <div className="d-satellite"><img src={skyline} alt="Illustrative Dubai waterfront" width={1920} height={1024} loading="lazy"/><div className="d-satellite-before" style={{clipPath:`inset(0 ${100-split}% 0 0)`}}><img src={skyline} alt="Desaturated comparison preview" width={1920} height={1024} loading="lazy"/></div><span className="d-before-label">2024</span><span className="d-after-label">2026</span><input type="range" min="5" max="95" value={split} onChange={e=>setSplit(Number(e.target.value))} aria-label="Construction comparison divider"/><div className="d-satellite-divider" style={{left:`${split}%`}}><span>↔</span></div><small>Illustrative comparison, not historical imagery</small></div>;}
function PortalPreview() {
 const ref = useRef<HTMLDivElement>(null);
 const visible = useInView(ref);
 const reduce = useReducedMotion();
 const [playing, setPlaying] = useState(true);
 const [phase, setPhase] = useState(0);
 useEffect(() => {
  if (!visible || !playing || reduce) return;
  const timer = setInterval(() => setPhase(v => (v + 1) % 3), 2200);
  return () => clearInterval(timer);
 }, [visible, playing, reduce]);
 return <div ref={ref} className="d-portal-status"><Building2 size={24}/><span>Marina listing<small>Simulated sync preview</small></span><Button variant="ghost" size="icon" aria-label="Toggle portal sync preview" aria-pressed={playing} onClick={() => setPlaying(v => !v)} title={playing ? 'Pause preview' : 'Play preview'}>{playing ? <Pause size={14}/> : <Play size={14} className="fill-current"/>}</Button><AnimatePresence mode="wait"><motion.b key={phase} initial={{opacity:0,y:reduce?0:5}} animate={{opacity:1,y:0}} exit={{opacity:0}} className={phase===2?'d-positive':'d-muted'}>{phase===2?<><Check size={14}/> Synced</>:phase===1?'Syncing':'Draft'}</motion.b></AnimatePresence></div>;
}
const brokerTools = [
  {
    category: "OFF-PLAN",
    title: "Deal Finder",
    description: "1,355+ UAE off-plan projects with published payment plans, escrow numbers, and handover dates.",
    badge: "1,355+ Projects",
    metric: "80/20 & Post-Handover",
    icon: Building2,
    colors: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-500 dark:text-blue-400",
      badge: "bg-blue-500/15 text-blue-500 dark:text-blue-400 border-blue-500/30",
      glow: "rgba(59, 130, 246, 0.15)",
    },
  },
  {
    category: "READY",
    title: "Ready Properties",
    description: "Verified title deeds, direct landlord inventory, instantaneous DLD sales comparables, and bulk actions.",
    badge: "Verified Deeds",
    metric: "Zero Duplicate Units",
    icon: KeyRound,
    colors: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-500 dark:text-emerald-400",
      badge: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/30",
      glow: "rgba(16, 185, 129, 0.15)",
    },
  },
  {
    category: "DEALS",
    title: "Deals & Commission",
    description: "Track deals from initial EOI to developer tranche payout with automated split aging calculations.",
    badge: "Automated Splits",
    metric: "AED 1.45M Tracked",
    icon: Target,
    colors: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-500 dark:text-amber-400",
      badge: "bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30",
      glow: "rgba(245, 158, 11, 0.15)",
    },
  },
  {
    category: "INTELLIGENCE",
    title: "AI Copilot & Voice",
    description: "Instant Dubai investor objection solver, contract cross-examiner, and voice-to-CRM transcription.",
    badge: "Instant Intel",
    metric: "Sub-45s Briefs ⚡",
    icon: Sparkles,
    colors: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-500 dark:text-purple-400",
      badge: "bg-purple-500/15 text-purple-500 dark:text-purple-400 border-purple-500/30",
      glow: "rgba(168, 85, 247, 0.15)",
    },
  },
  {
    category: "DISTRIBUTION",
    title: "Portal Multi-Sync",
    description: "One listing input, instantaneous live broadcast across Property Finder, Bayut, and Dubizzle.",
    badge: "1-Click Multi-post",
    metric: "Real-Time Portal API",
    icon: Globe,
    colors: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      text: "text-cyan-500 dark:text-cyan-400",
      badge: "bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 border-cyan-500/30",
      glow: "rgba(6, 182, 212, 0.15)",
    },
  },
  {
    category: "PRESENTATION",
    title: "Live Deal Rooms",
    description: "Polished, branded interactive web links and WhatsApp briefs generated in 10 seconds for HNWIs.",
    badge: "Interactive Rooms",
    metric: "4.8x Conversion Rate",
    icon: FileText,
    colors: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      text: "text-rose-500 dark:text-rose-400",
      badge: "bg-rose-500/15 text-rose-500 dark:text-rose-400 border-rose-500/30",
      glow: "rgba(244, 63, 94, 0.15)",
    },
  },
  {
    category: "ESCROW",
    title: "Satellite Progress",
    description: "Official DLD construction percentage audit, drone tracking timelines, and escrow release status.",
    badge: "DLD Verified",
    metric: "100% Escrow Active",
    icon: Users,
    colors: {
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
      text: "text-indigo-500 dark:text-indigo-400",
      badge: "bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border-indigo-500/30",
      glow: "rgba(99, 102, 241, 0.15)",
    },
  },
];

export function Tools() {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const idx = Math.round(scrollLeft / (clientWidth * 0.8));
    setActiveIdx(Math.min(Math.max(idx, 0), brokerTools.length - 1));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -340 : 340;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <Scene id="tools">
      <div className="d-container">
        {/* Section Heading with Left/Right Interactive Gliders */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="max-w-2xl text-left">
            <span className="d-pill text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              EVERYTHING A BROKER NEEDS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-display">
              Seven tools, one login.
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              Hover to pause · Glides seamlessly across all UAE property workflows.
            </p>
          </div>

          {/* Desktop Arrow Glider Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="size-11 rounded-2xl bg-secondary/80 hover:bg-secondary text-foreground border border-border flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs hover:border-primary/40"
              aria-label="Previous tool card"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="size-11 rounded-2xl bg-secondary/80 hover:bg-secondary text-foreground border border-border flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs hover:border-primary/40"
              aria-label="Next tool card"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel / Cards Track */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 px-2 sm:px-1 no-scrollbar snap-x snap-mandatory scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {brokerTools.map((t) => {
              const Icon = t.icon;
              const { colors } = t;

              return (
                <motion.div
                  key={t.title}
                  whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
                  whileTap={{ scale: 0.98 }}
                  className="d-tools-carousel-card w-[84vw] max-w-[340px] sm:w-[330px] shrink-0 snap-center rounded-3xl p-6 sm:p-7 bg-card/90 backdrop-blur-xl border border-border/80 shadow-md hover:shadow-2xl transition-all flex flex-col justify-between overflow-hidden cursor-pointer group relative"
                  style={{ minHeight: "310px", height: "auto" }}
                >
                  {/* Subtle ambient corner glow on hover */}
                  <div
                    className="absolute -top-12 -right-12 size-36 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                    style={{ background: colors.glow }}
                  />

                  <div className="space-y-3 relative z-10 text-left">
                    <div className="flex items-center justify-between">
                      {/* Animated Floating Icon Container */}
                      <div className={`size-12 rounded-2xl ${colors.bg} ${colors.text} border ${colors.border} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1`}>
                        <Icon size={22} />
                      </div>

                      {/* Pill Badge */}
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${colors.badge} shadow-xs`}>
                        {t.badge}
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className={`text-[11px] font-mono font-black tracking-wider uppercase ${colors.text} block mb-1`}>
                        {t.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-foreground font-display tracking-tight group-hover:text-primary transition-colors">
                        {t.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 break-words font-sans">
                      {t.description}
                    </p>
                  </div>

                  {/* Bottom Highlight Strip with Live Metric & Interactive Arrow */}
                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs relative z-10">
                    <span className="font-mono text-[11px] font-bold text-foreground/80 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {t.metric}
                    </span>
                    <span className="text-primary font-bold text-xs inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Swipe Dot Indicators */}
          <div className="flex sm:hidden justify-center items-center gap-1.5 mt-4">
            {brokerTools.map((_, i) => (
              <span
                key={i}
                className={`transition-all rounded-full ${
                  activeIdx === i
                    ? "w-6 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ═══ DUBAI DEAL CALCULATOR & REAL-TIME MORTGAGE ═══ */}
        <div className="mt-14 sm:mt-20 pt-10 border-t border-border/60">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-primary block mb-1">
              LIVE DUBAI PROPERTY CALCULATOR
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground font-display">
              What does a Dubai deal really cost?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
              Live physical calculator with real-time DLD 4%, 20% down payment, 25-year mortgage EMI, and instant AI executive summary.
            </p>
          </div>

          <div className="flex justify-center px-2">
            <PhysicalDealCalculator embedded />
          </div>
        </div>
      </div>
    </Scene>
  );
}
const workflowStages = [
 { name: 'Capture', icon: Users, title: 'Every enquiry, in one place.', actions: ['Capture leads', 'Qualify lead', 'Assign agent'] },
 { name: 'Connect', icon: MessageCircle, title: 'Keep the conversation moving.', actions: ['Follow up', 'Schedule viewing', 'Share brochure'] },
 { name: 'Close', icon: KeyRound, title: 'Move from interest to agreement.', actions: ['Send payment plan', 'Book EOI', 'Sign SPA'] },
 { name: 'Track', icon: Target, title: 'Stay on top of every deal.', actions: ['Track commission', 'Review KPIs', 'Export reports'] },
];
export function Workflow() {
 const [stage, setStage] = useState(0);
 const [step, setStep] = useState(0);
 const [running, setRunning] = useState(false);
 const [complete, setComplete] = useState(false);
 const panel = useRef<HTMLDivElement>(null);
 const visible = useInView(panel);
 const reduce = useReducedMotion();
 useEffect(() => {
  if (visible && !running && !complete && step === 0) {
   const t = setTimeout(() => setRunning(true), 600);
   return () => clearTimeout(t);
  }
 }, [visible]);
 useEffect(() => {
  if (!running || !visible) return;
  const timer = setTimeout(() => {
   if (step < 2) setStep(v => v + 1);
   else { setRunning(false); setComplete(true); }
  }, 850);
  return () => clearTimeout(timer);
 }, [running, step, visible]);
 const chooseStage = (next: number) => { setStage(next); setStep(0); setRunning(false); setComplete(false); };
 const current = workflowStages[stage];
 if (!current) return null;
 const Icon = current.icon;
 return <Scene id="workflow"><div className="d-container"><div className="d-workflow-showcase"><div className="d-section-heading"><span className="d-pill"><Sparkles size={15}/> Your workflow. Your way.</span><RevealText>Make every next step/feel effortless.</RevealText></div><div className="d-workflow-stages" role="tablist" aria-label="Deal workflow stages">{workflowStages.map((item, i) => <Button key={item.name} id={`workflow-tab-${i}`} variant="ghost" role="tab" aria-selected={stage === i} tabIndex={stage === i ? 0 : -1} aria-controls="workflow-stage-panel" onKeyDown={e => { const next = e.key === 'ArrowRight' ? (i + 1) % workflowStages.length : e.key === 'ArrowLeft' ? (i + workflowStages.length - 1) % workflowStages.length : e.key === 'Home' ? 0 : e.key === 'End' ? workflowStages.length - 1 : undefined; if (next === undefined) return; e.preventDefault(); chooseStage(next); document.getElementById(`workflow-tab-${next}`)?.focus(); }} className={stage === i ? 'active' : ''} onClick={() => chooseStage(i)}><item.icon size={18}/><span>{item.name}</span><ArrowRight size={15}/></Button>)}</div><div ref={panel} className="d-workflow-stage-panel" id="workflow-stage-panel" role="tabpanel" aria-labelledby={`workflow-tab-${stage}`}><motion.div key={current.name} className="d-workflow-story" initial={{opacity:0,y:reduce?0:8}} animate={{opacity:1,y:0}} transition={{duration:.2}}><div className="d-workflow-intro"><span className="d-workflow-emblem"><Icon size={32}/></span><h3>{current.title}</h3><div className="d-workflow-play"><Button className="d-button d-button-primary" onClick={() => { if(running){setRunning(false);return;} if(complete){setStep(0);setComplete(false);} setRunning(true); }}>{running ? <Pause size={14}/> : <Play size={14} className="fill-current"/>}{running?'Pause preview':complete?'Replay preview':'Run preview'}</Button><span className="d-demo-tag">Simulated workflow</span></div></div><ol className="d-workflow-timeline">{current.actions.map((action,i) => <li key={action} className={`${i===step?'selected':''} ${complete || i<step?'complete':''}`}><Button variant="ghost" aria-pressed={i===step} onClick={() => { setStep(i);setRunning(false);setComplete(false); }}><span className="d-step-number">{complete || i<step?<Check size={16}/>:i+1}</span><span>{action}<small>{complete || i<step?'Preview completed':i===step && running?'In progress…':i===step?'Ready to go':'Up next'}</small></span>{i===step?<ArrowRight size={16}/>:null}</Button></li>)}</ol></motion.div><div className="d-workflow-progress" role="progressbar" aria-label="Workflow preview progress" aria-valuemin={0} aria-valuemax={3} aria-valuenow={complete?3:step}><span data-progress={complete?3:step}/></div><p className="d-workflow-result" role="status">{complete?'Preview complete — no client actions were sent.':running?`${current.actions[step]} · preview running`:current.name+' · ready for your next move'}</p></div></div></div></Scene>;
}
const modeData=[{name:'Off-plan',title:'The next launch. Your next deal.',benefits:['Developer inventory at your fingertips','Payment schedules, without the spreadsheet','From reservation to signed SPA'],details:[['Project','Verdana III'],['Handover','Q1 2027'],['Payment plan','10 / 30 / 60'],['Construction','68%']],label:'PROJECT INTELLIGENCE'},{name:'Ready',title:'See the value. Make the move.',benefits:['Find the right ready-to-move unit','DLD comparables in one view','Clarity on service charges and value'],details:[['Community','Dubai Marina'],['Area median','AED 1,840 / sqft'],['Comparable sales','12 nearby'],['Service charge','Available in property overview']],label:'RESALE INTELLIGENCE'},{name:'Rentals',title:'Better matches. Happier tenants.',benefits:['Rental benchmarks that make sense','Yield calculations on the spot','Keep every renewal in sight'],details:[['Community','JVC'],['Annual rent','AED 85,000'],['Gross yield','6.8%'],['Renewal','In 60 days']],label:'RENTAL INTELLIGENCE'}];
export function Modes(){const [mode,setMode]=useState(0);const data=modeData[mode] ?? modeData[0];if(!data)return null;return <Scene id="modes"><div className="d-container"><div className="d-section-heading"><span className="d-pill">Built for your business</span><RevealText>One OS./Every deal type.</RevealText><div className="d-mode-toggle" role="tablist" aria-label="Deal type">{modeData.map((v,i)=><Button role="tab" aria-selected={mode===i} key={v.name} variant="ghost" className={mode===i?'active':''} onClick={()=>setMode(i)}>{v.name}</Button>)}</div></div><div className="d-modes-grid"><AnimatePresence mode="wait"><motion.div key={mode} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><h3>{data.title}</h3><ul>{data.benefits.map((v,i)=><motion.li key={v} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*.1}}><CircleCheckIcon/>{v}</motion.li>)}</ul><span className="d-demo-tag">Illustrative property and financial data</span></motion.div></AnimatePresence><motion.div className="d-mode-browser" key={data.name} initial={{opacity:0,rotateY:12}} animate={{opacity:1,rotateY:0}} transition={{duration:.6}}><div className="d-browser-bar"><i/><i/><i/><span>dealos.app / {data.name.toLowerCase()}</span></div><img src={skyline} alt="Dubai waterfront property illustration" loading="lazy" width={1920} height={1024}/><div className="d-mode-detail"><span className="d-eyebrow">{data.label}</span><h3>{data.details[0]?.[1]}</h3><dl>{data.details.slice(1).map(([a,b])=><div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl><span className="d-chip"><Sparkles size={12}/> Built around your client</span></div></motion.div></div></div></Scene>;}
function CircleCheckIcon(){return <Check size={17}/>;}
