import { Building2, ChartNoAxesCombined, ChevronRight, KeyRound, MapPin, MessageCircle, Percent, Play, Sparkles, Users, X } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import skyline from '@/assets/dealos-dubai.jpg';
import { Dashboard } from './Dashboard';
import { ease, Magnetic } from './primitives';
export const tileIcons = [Users, Building2, MapPin, Sparkles, Percent, KeyRound, ChartNoAxesCombined, MessageCircle];
export function GlassTiles({ compact = false }: { compact?: boolean }) { const reduce = useReducedMotion(); return <div className={`d-tiles ${compact?'compact':''}`} aria-hidden>{tileIcons.map((Icon,i)=><motion.div key={i} className={`d-glass-tile tile-${i}`} initial={{opacity:0,scale:.6}} animate={reduce ? {opacity:1,scale:1} : {opacity:1,scale:1,y:[0,-10,0],rotate:[-3,3,-3]}} transition={{opacity:{delay:.5+i*.07},scale:{delay:.5+i*.07},y:{duration:5+i*.4,repeat:Infinity,ease:'easeInOut'},rotate:{duration:8+i*.2,repeat:Infinity,ease:'easeInOut'}}}><Icon/></motion.div>)}</div>; }
export function Hero() {
 const ref=useRef<HTMLElement>(null); const reduce=useReducedMotion(); const [tour,setTour]=useState(false);
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});
 const opacity=useTransform(scrollYProgress,[0,.45],[1,0]); const y=useTransform(scrollYProgress,[0,.6],[0,-100]);
 const dashboardY=useTransform(scrollYProgress,[0,.65],['8vh','-43vh']); const rotateX=useTransform(scrollYProgress,[0,.6],[24,0]); const scale=useTransform(scrollYProgress,[0,.6],[.9,1]);
 return <section className={`d-hero ${reduce?'d-reduced':''}`} id="hero" data-theme="dark" ref={ref}><div className="d-hero-sticky"><img className="d-hero-photo" src={skyline} width={1920} height={1024} fetchPriority="high" alt="Dubai waterfront and Burj Khalifa at blue hour"/><div className="d-hero-tint"/><motion.div className="d-hero-copy" style={reduce?{}:{opacity,y}}><GlassTiles/><motion.div className="d-hero-text" initial={{opacity:0,y:30,filter:'blur(6px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{duration:1,ease}}><p className="d-glass-pill"><Sparkles size={13}/> All-in-one Broker OS for the UAE <ChevronRight size={13}/></p><h1><span>The Broker OS</span><span>Built on Dubai Data<span className="d-period">.</span></span></h1><p className="d-hero-sub">Leads, property intelligence and your AI assistant.<br className="d-desktop-break"/> One connected workspace. Every deal, a step ahead.</p><div className="d-hero-buttons"><Magnetic className="d-button d-button-white" asChild><Link to="/login" search={{mode:'signup'}}>Start free <ArrowIcon/></Link></Magnetic><Button className="d-button d-button-glass" onClick={()=>setTour(true)}><Play size={14} fill="currentColor"/> Explore the workspace</Button></div><div className="d-trust"><div className="d-avatar-stack">{['SA','AK','MR','JN'].map(v=><span key={v}>{v}</span>)}</div><span>Built by a Dubai broker, for brokers</span></div></motion.div></motion.div><motion.div className="d-hero-dashboard" style={reduce?{}:{y:dashboardY,rotateX,scale}}><Dashboard/></motion.div><span className="d-scroll-hint">SCROLL TO DISCOVER <span>↓</span></span></div><Dialog open={tour} onOpenChange={setTour}><DialogContent className="d-tour-dialog sm:max-w-6xl"><DialogTitle>Inside DealOS <span className="d-demo-tag">Product preview</span></DialogTitle><Dashboard/><p>Explore the connected broker workspace.</p></DialogContent></Dialog></section>;
}
function ArrowIcon(){return <ChevronRight size={15}/>;}
