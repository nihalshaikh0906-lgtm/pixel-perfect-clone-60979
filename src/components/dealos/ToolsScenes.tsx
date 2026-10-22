import { ArrowDown, ArrowRight, Building2, Check, ChevronRight, FileText, Globe, KeyRound, Mail, MessageCircle, Play, Plus, RotateCcw, Sparkles, Target, Users, X } from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RevealText, Rise, Scene, TiltCard } from './primitives';
import skyline from '@/assets/dealos-dubai.jpg';
const apps=['Property Finder','Bayut','Dubizzle','WhatsApp','Meta Ads','Google Ads','Calendar','Gmail','Zapier','TikTok','LinkedIn','Mailchimp'];
export function Integrations(){return <Scene id="integrations" pinned height="180vh"><div className="d-integration-stage"><div className="d-orbit-center"><span className="d-pill">Your ecosystem. Connected.</span><RevealText>Connect all/your apps.</RevealText><p>Less switching. More selling.</p><span className="d-demo-tag">Integration concept · availability varies</span></div><div className="d-orbits">{[0,1].map(row=><div key={row} className={`d-orbit orbit-${row}`}>{apps.slice(row*6,row*6+6).map((app,i)=><div className={`d-orbit-position pos-${i}`} key={app}><div className="d-app-logo" tabIndex={0} title={`${app} · illustrative integration`}><span className={`d-app-initial app-${(i+row)%4}`}>{app==='WhatsApp'?<MessageCircle/>:app==='Gmail'?<Mail/>:app.split(' ').map(v=>v[0]).join('').slice(0,2)}</span><small>{app}</small></div></div>)}</div>)}</div><div className="d-mobile-apps">{[0,1].map(row=><div className={`d-logo-marquee row-${row}`} key={row}>{[...apps.slice(row*6,row*6+6),...apps.slice(row*6,row*6+6)].map((v,i)=><span key={i}><b>{v.slice(0,1)}</b>{v}</span>)}</div>)}</div></div></Scene>;}
function Calculator(){const [price,setPrice]=useState(2);const [down,setDown]=useState(20);return <><div className="d-calculator-number">AED {(price*1000000).toLocaleString('en-US')}</div><label>Property price <input aria-label="Property price" type="range" min="1" max="5" step=".1" value={price} onChange={e=>setPrice(Number(e.target.value))}/></label><label>Down payment <span>{down}%</span><input aria-label="Down payment" type="range" min="10" max="50" value={down} onChange={e=>setDown(Number(e.target.value))}/></label><div className="d-calc-results"><div><small>Down payment</small><b>AED {Math.round(price*10000*down).toLocaleString('en-US')}</b></div><div><small>DLD fee · 4%</small><b>AED {(price*40000).toLocaleString('en-US')}</b></div></div></>;}
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
 return <div ref={ref} className="d-portal-status"><Building2 size={24}/><span>Marina listing<small>Simulated sync preview</small></span><Button variant="ghost" size="icon" aria-label="Toggle portal sync preview" aria-pressed={playing} onClick={() => setPlaying(v => !v)} title={playing ? 'Pause preview' : 'Play preview'}>{playing ? <span aria-hidden>Ⅱ</span> : <Play size={14}/>}</Button><AnimatePresence mode="wait"><motion.b key={phase} initial={{opacity:0,y:reduce?0:5}} animate={{opacity:1,y:0}} exit={{opacity:0}} className={phase===2?'d-positive':'d-muted'}>{phase===2?<><Check size={14}/> Synced</>:phase===1?'Syncing':'Draft'}</motion.b></AnimatePresence></div>;
}
const brokerTools = [
  {
    category: "OFF-PLAN",
    title: "Deal Finder",
    description: "1,355+ UAE projects with published payment plans, handover and sale status.",
    badge: "1,355+ Projects",
    icon: Building2,
  },
  {
    category: "READY",
    title: "Ready Properties",
    description: "Your own listings, verified title deeds, statuses, and bulk actions.",
    badge: "Verified Deeds",
    icon: KeyRound,
  },
  {
    category: "DEALS",
    title: "Deals & Commission",
    description: "Track EOI to commission paid, per agent and milestone.",
    badge: "Automated Splits",
    icon: Target,
  },
  {
    category: "INTELLIGENCE",
    title: "AI Copilot",
    description: "A second brain for every client objection and contract comparison.",
    badge: "Instant Intel",
    icon: Sparkles,
  },
  {
    category: "DISTRIBUTION",
    title: "Portal Sync",
    description: "One listing, instant sync across Property Finder, Bayut, and Dubizzle.",
    badge: "1-Click Multi-post",
    icon: Globe,
  },
  {
    category: "PRESENTATION",
    title: "1-Click Client Decks",
    description: "Polished branded investor decks generated in 10 seconds.",
    badge: "White-label PDF",
    icon: FileText,
  },
  {
    category: "ESCROW",
    title: "Satellite Progress",
    description: "DLD construction audit and verified drone satellite timeline.",
    badge: "Milestone Audit",
    icon: Users,
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

  return (
    <Scene id="tools">
      <div className="d-container">
        {/* Section Heading */}
        <div className="d-section-heading text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="d-pill text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
            EVERYTHING A BROKER NEEDS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-display">
            Seven tools, one login.
          </h2>
          <p className="hidden md:block text-sm text-muted-foreground mt-2">
            Hover to pause the carousel.
          </p>
          <p className="block md:hidden text-xs text-muted-foreground mt-2 font-medium">
            Swipe to explore all 7 broker tools · Built for UAE Real Estate
          </p>
        </div>

        {/* Carousel / Cards Track */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 px-4 sm:px-0 no-scrollbar snap-x snap-mandatory scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {brokerTools.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.title}
                  className="w-[82vw] max-w-[320px] sm:w-[310px] shrink-0 snap-center rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-card border border-border/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  style={{ minHeight: "230px", height: "auto" }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                        {t.badge}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider uppercase text-primary block mb-1">
                        {t.category}
                      </span>
                      <h3 className="text-lg font-bold text-foreground font-display">
                        {t.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3 break-words">
                    {t.description}
                  </p>
                </div>
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
                    ? "w-5 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ═══ TRY IT YOURSELF: CALCULATOR ═══ */}
        <div className="mt-14 sm:mt-20 pt-10 border-t border-border/60">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-primary block mb-1">
              TRY IT YOURSELF
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground font-display">
              What does a purchase really cost?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
              Live mortgage &amp; DLD 4% transaction fee calculator with real-time breakdowns.
            </p>
          </div>

          <div className="max-w-lg mx-auto p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-md">
            <Calculator />
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
 return <Scene id="workflow"><div className="d-container"><div className="d-workflow-showcase"><div className="d-section-heading"><span className="d-pill"><Sparkles size={15}/> Your workflow. Your way.</span><RevealText>Make every next step/feel effortless.</RevealText></div><div className="d-workflow-stages" role="tablist" aria-label="Deal workflow stages">{workflowStages.map((item, i) => <Button key={item.name} id={`workflow-tab-${i}`} variant="ghost" role="tab" aria-selected={stage === i} tabIndex={stage === i ? 0 : -1} aria-controls="workflow-stage-panel" onKeyDown={e => { const next = e.key === 'ArrowRight' ? (i + 1) % workflowStages.length : e.key === 'ArrowLeft' ? (i + workflowStages.length - 1) % workflowStages.length : e.key === 'Home' ? 0 : e.key === 'End' ? workflowStages.length - 1 : undefined; if (next === undefined) return; e.preventDefault(); chooseStage(next); document.getElementById(`workflow-tab-${next}`)?.focus(); }} className={stage === i ? 'active' : ''} onClick={() => chooseStage(i)}><item.icon size={18}/><span>{item.name}</span><ArrowRight size={15}/></Button>)}</div><div ref={panel} className="d-workflow-stage-panel" id="workflow-stage-panel" role="tabpanel" aria-labelledby={`workflow-tab-${stage}`}><motion.div key={current.name} className="d-workflow-story" initial={{opacity:0,y:reduce?0:8}} animate={{opacity:1,y:0}} transition={{duration:.2}}><div className="d-workflow-intro"><span className="d-workflow-emblem"><Icon size={32}/></span><h3>{current.title}</h3><div className="d-workflow-play"><Button className="d-button d-button-primary" onClick={() => { if(running){setRunning(false);return;} if(complete){setStep(0);setComplete(false);} setRunning(true); }}><Play size={14}/>{running?'Pause preview':complete?'Replay preview':'Run preview'}</Button><span className="d-demo-tag">Simulated workflow</span></div></div><ol className="d-workflow-timeline">{current.actions.map((action,i) => <li key={action} className={`${i===step?'selected':''} ${complete || i<step?'complete':''}`}><Button variant="ghost" aria-pressed={i===step} onClick={() => { setStep(i);setRunning(false);setComplete(false); }}><span className="d-step-number">{complete || i<step?<Check size={16}/>:i+1}</span><span>{action}<small>{complete || i<step?'Preview completed':i===step && running?'In progress…':i===step?'Ready to go':'Up next'}</small></span>{i===step?<ArrowRight size={16}/>:null}</Button></li>)}</ol></motion.div><div className="d-workflow-progress" role="progressbar" aria-label="Workflow preview progress" aria-valuemin={0} aria-valuemax={3} aria-valuenow={complete?3:step}><span data-progress={complete?3:step}/></div><p className="d-workflow-result" role="status">{complete?'Preview complete — no client actions were sent.':running?`${current.actions[step]} · preview running`:current.name+' · ready for your next move'}</p></div></div></div></Scene>;
}
const modeData=[{name:'Off-plan',title:'The next launch. Your next deal.',benefits:['Developer inventory at your fingertips','Payment schedules, without the spreadsheet','From reservation to signed SPA'],details:[['Project','Verdana III'],['Handover','Q1 2027'],['Payment plan','10 / 30 / 60'],['Construction','68%']],label:'PROJECT INTELLIGENCE'},{name:'Ready',title:'See the value. Make the move.',benefits:['Find the right ready-to-move unit','DLD comparables in one view','Clarity on service charges and value'],details:[['Community','Dubai Marina'],['Area median','AED 1,840 / sqft'],['Comparable sales','12 nearby'],['Service charge','Available in dossier']],label:'RESALE INTELLIGENCE'},{name:'Rentals',title:'Better matches. Happier tenants.',benefits:['Rental benchmarks that make sense','Yield calculations on the spot','Keep every renewal in sight'],details:[['Community','JVC'],['Annual rent','AED 85,000'],['Gross yield','6.8%'],['Renewal','In 60 days']],label:'RENTAL INTELLIGENCE'}];
export function Modes(){const [mode,setMode]=useState(0);const data=modeData[mode] ?? modeData[0];if(!data)return null;return <Scene id="modes"><div className="d-container"><div className="d-section-heading"><span className="d-pill">Built for your business</span><RevealText>One OS./Every deal type.</RevealText><div className="d-mode-toggle" role="tablist" aria-label="Deal type">{modeData.map((v,i)=><Button role="tab" aria-selected={mode===i} key={v.name} variant="ghost" className={mode===i?'active':''} onClick={()=>setMode(i)}>{v.name}</Button>)}</div></div><div className="d-modes-grid"><AnimatePresence mode="wait"><motion.div key={mode} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><h3>{data.title}</h3><ul>{data.benefits.map((v,i)=><motion.li key={v} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*.1}}><CircleCheckIcon/>{v}</motion.li>)}</ul><span className="d-demo-tag">Illustrative property and financial data</span></motion.div></AnimatePresence><motion.div className="d-mode-browser" key={data.name} initial={{opacity:0,rotateY:12}} animate={{opacity:1,rotateY:0}} transition={{duration:.6}}><div className="d-browser-bar"><i/><i/><i/><span>dealos.app / {data.name.toLowerCase()}</span></div><img src={skyline} alt="Dubai waterfront property illustration" loading="lazy" width={1920} height={1024}/><div className="d-mode-detail"><span className="d-eyebrow">{data.label}</span><h3>{data.details[0]?.[1]}</h3><dl>{data.details.slice(1).map(([a,b])=><div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl><span className="d-chip"><Sparkles size={12}/> Built around your client</span></div></motion.div></div></div></Scene>;}
function CircleCheckIcon(){return <Check size={17}/>;}
