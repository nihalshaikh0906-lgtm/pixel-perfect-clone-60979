import { ArrowDownLeft, ArrowUpRight, Bell, Building2, CalendarDays, ChartNoAxesCombined, ChevronDown, Command, Download, House, LayoutGrid, Mail, MessageCircle, Search, Settings, Sparkles, Users } from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CountUp } from './primitives';
type Kpi = { label: string; value: number; change: string; detail: string; suffix?: string; decimals?: number };
const kpis: Kpi[] = [
  { label: 'Leads', value: 1248, change: '+15%', detail: 'Buy 732 / Rent 516' },
  { label: 'Listings', value: 534, change: '−6%', detail: 'Sale 286 / Rent 248' },
  { label: 'Portal leads', value: 216, change: '+15%', detail: 'Property Finder 98 · Bayut 74' },
  { label: 'Deals', value: 35, change: '+11%', detail: 'Off-plan 10 · Ready 15 · Rent 10' },
  { label: 'Viewings', value: 143, change: '−9%', detail: 'This week 31' },
  { label: 'Pipeline', value: 48.2, change: '+12%', detail: 'AED · Active opportunities', decimals: 2, suffix: 'M' },
  { label: 'Commission forecast', value: 1.36, change: '+22%', detail: 'AED · This quarter', decimals: 2, suffix: 'M' },
  { label: 'Overdue Follow-Ups', value: 18, change: '−12%', detail: 'Oldest waiting 6 days' },
  { label: "Today's Viewings", value: 7, change: '+25%', detail: 'Confirmations pending 3' },
  { label: 'Deals Closed (Month)', value: 12, change: '+20%', detail: 'Off-plan 7 · Ready 5' },
  { label: 'Sales Value', value: 42.6, change: '+18%', detail: 'AED · 12 transactions closed', decimals: 2, suffix: 'M' },
  { label: 'Commission (Month)', value: 1.82, change: '+24%', detail: 'AED · Across 9 agents', decimals: 2, suffix: 'M' },
  { label: 'Collected (Month)', value: 1.24, change: '+11%', detail: 'AED · Outstanding 580K', decimals: 2, suffix: 'M' },
  { label: 'Featured Listings', value: 26, change: '+8%', detail: 'Portal boosts live 14' },
  { label: 'Portal Views', value: 8420, change: '+15%', detail: 'Finder 4.9K · Bayut 3.5K' },
  { label: 'Won Leads', value: 96, change: '+14%', detail: '7.7% of 1248 leads' },
  { label: 'Agent Payouts Due', value: 3, change: '−8%', detail: 'AED 312K payable Friday' },
  { label: 'Total Enquiries', value: 412, change: '+19%', detail: 'Calls 148 · WhatsApp 196' },
  { label: 'Rent Arrears', value: 0.46, change: '−9%', detail: 'AED · Across 14 tenancies', decimals: 2, suffix: 'M' },
  { label: 'Balance Due', value: 2.15, change: '+7%', detail: 'AED · 6 instalments due', decimals: 2, suffix: 'M' },
  { label: 'Active Agents', value: 34, change: '+3%', detail: 'Top producer: Saad · AED 4.2M' },
];
const insights = ["12 leads match Verdana III’s new launch", "3 hot clients haven’t replied in 5 days", 'Reportage Hills prices +8.4% YoY'];
export function Dashboard() {
 const [insight,setInsight]=useState(0);
 const ref=useRef<HTMLDivElement>(null);const visible=useInView(ref);const reduce=useReducedMotion();
 const [playing,setPlaying]=useState(true);
 useEffect(()=>{ if(!visible || !playing || reduce)return; const t=setInterval(()=>setInsight(v=>(v+1)%3),4000); return ()=>clearInterval(t); },[visible,playing,reduce]);
 return <div ref={ref} className="d-dashboard" aria-label="Illustrative DealOS dashboard"><aside className="d-dashboard-sidebar"><div className="d-dash-logo"><LogoMark size={28}/></div>{[LayoutGrid,Users,Building2,ChartNoAxesCombined,CalendarDays,MessageCircle,Mail,House,Settings].map((Icon,i)=><span className={i===0?'active':''} key={i}><Icon size={18}/></span>)}</aside><div className="d-dashboard-main"><div className="d-dashboard-bar"><span>Home <span className="d-muted">› Dashboard</span></span><DashSearch/><CalendarDays size={16}/><Bell size={16}/><span className="d-avatar">S</span></div><div className="d-dashboard-heading"><div><p className="d-eyebrow">YOUR WORKSPACE, IN SYNC</p><h3>Good evening, Saad <span>✦</span></h3></div><span className="d-demo-tag">Illustrative workspace</span><span className="d-filter">This month <ChevronDown size={12}/></span><Download size={16}/></div><div className="d-insight"><Sparkles size={19}/><div><small>YOUR AI BRIEFING</small><AnimatePresence mode="wait"><motion.p key={insight} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}}>{insights[insight]}</motion.p></AnimatePresence></div><Button variant="ghost" size="icon" aria-label={playing?"Pause workspace preview":"Play workspace preview"} title={playing?"Pause workspace preview":"Play workspace preview"} aria-pressed={playing} onClick={()=>setPlaying(v=>!v)}>{playing?<span aria-hidden>Ⅱ</span>:<ArrowUpRight size={18}/>}</Button></div><div className="d-kpis">{kpis.map(({label,value,change,detail,suffix,decimals},i)=><div className={`d-kpi kpi-${i}`} key={label} title={`${label}: illustrative monthly data`}><div className="d-kpi-label">{label}<span className={change.startsWith('−')?'d-negative':'d-positive'}>{change.startsWith('−')?<ArrowDownLeft size={10}/>:<ArrowUpRight size={10}/>} {change}</span></div><strong><CountUp value={value} decimals={decimals ?? 0} suffix={suffix ?? ''}/></strong><svg viewBox="0 0 180 42" className="d-spark" aria-hidden><motion.path d={i%2?'M0 32 L18 24 L36 28 L54 14 L72 18 L90 8 L108 14 L126 5 L144 8 L180 2':'M0 36 L20 27 L40 32 L60 22 L80 23 L100 14 L120 17 L140 6 L160 12 L180 3'} fill="none" stroke="currentColor" strokeWidth="2" initial={{pathLength:0}} whileInView={{pathLength:1}} transition={{duration:1.6}}/></svg><small>{detail}</small></div>)}</div><div className="d-dashboard-bottom"><div><span className="d-eyebrow">RECENT ACTIVITY</span><h4>Your next opportunity is already here.</h4></div><div className="d-mini-lead"><span className="d-avatar">AK</span><span>Ahmed K.<small>Off-plan · Cash buyer</small></span><span className="d-positive">87% match</span></div></div></div></div>;
}

const dashQs:[string,string][]=[['Which leads need a follow-up today?','Illustrative: 3 warm leads have no reply in 48h.'],['Summarise this week\'s pipeline','Illustrative: pipeline moved forward across viewings and offers.'],['Draft a WhatsApp for a new lead','Illustrative: a short, friendly intro message is ready to edit.']];
function DashSearch(){const [open,setOpen]=useState(false);const [ans,setAns]=useState<string|null>(null);return <span className="d-dashboard-search d-dash-search-wrap" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node)){setOpen(false);setAns(null);}}}><button type="button" className="d-dash-search-btn" aria-expanded={open} onClick={()=>setOpen(v=>!v)}><Search size={13}/> Ask DealOS AI… <Command size={12}/></button>{open?<span className="d-dash-suggest" role="menu">{ans?<span className="d-dash-answer">{ans}</span>:dashQs.map(([q,a])=><button type="button" role="menuitem" key={q} onClick={()=>setAns(a)}>{q}</button>)}</span>:null}</span>;}
