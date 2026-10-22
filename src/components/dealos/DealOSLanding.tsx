import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hero } from './Hero';
import { InteractiveDeviceShowcase } from './InteractiveDeviceShowcase';
import { Product, Insights } from './ProductScenes';
import { Integrations, Tools, Workflow, Modes } from './ToolsScenes';
import { Proof, Pricing, CTA, Footer } from './FinalScenes';
import { Magnetic } from './primitives';
const scenes=['Hero','Product','Insights','Integrations','Tools','Workflow','Modes','Proof','Pricing','CTA'];
const LandingScenes = memo(function LandingScenes() { return <><Hero/><InteractiveDeviceShowcase/><Product/><Insights/><Integrations/><Tools/><Workflow/><Modes/><Proof/><Pricing/><CTA/><Footer/></>; });
export function DealOSLanding(){const reduce=useReducedMotion();const {scrollYProgress}=useScroll();const [scrolled,setScrolled]=useState(false);const [dark,setDark]=useState(true);const [active,setActive]=useState('Hero');const [menu,setMenu]=useState(false);const [intro,setIntro]=useState<'full'|'quick'|'done'>('full');
  useEffect(() => {
    setIntro('full');
    const t = setTimeout(() => setIntro('done'), 800);
    const onScroll = () => { if (window.scrollY > 20) setIntro('done'); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
 useEffect(()=>{let frame=0;const elements=scenes.map(name=>({name,el:document.getElementById(name.toLowerCase())}));const update=()=>{frame=0;setScrolled(window.scrollY>40);let selected='Hero';let theme=true;for(const {name,el} of elements){if(el&&el.getBoundingClientRect().top<window.innerHeight*.4){selected=name;theme=el.dataset['theme']==='dark';}}setActive(selected);setDark(theme);};const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};window.addEventListener('scroll',onScroll,{passive:true});update();return()=>{window.removeEventListener('scroll',onScroll);cancelAnimationFrame(frame);};},[]);
 const go=(id:string)=>{setMenu(false);document.getElementById(id)?.scrollIntoView({behavior:reduce?'instant':'smooth'});};
 return <main className={`dealos ${scrolled?"is-scrolled":""}`} data-intro={intro}><motion.div className="d-scroll-progress" style={{scaleX:scrollYProgress}}/><header className={`d-navbar ${scrolled?'scrolled':''} ${dark?'on-dark':''}`}><Link to="/welcome" className="d-brand" aria-label="DealOS home"><Logo variant="dark" size={30}/></Link><nav aria-label="Main navigation">{[['Product','product'],['Data','insights'],['AI','tools'],['Integrations','integrations'],['Pricing','pricing']].map(([label,id])=><Button key={id} variant="ghost" className="d-nav-link" onClick={()=>go(id ?? "product")}>{label}</Button>)}</nav><div className="d-nav-actions"><Button asChild variant="ghost" className="d-login"><Link to="/login" search={{mode:undefined}}>Login <span>↗</span></Link></Button><Magnetic className="d-button d-button-primary" onClick={()=>go('cta')}>Book a demo <span>↗</span></Magnetic><Button variant="ghost" size="icon" className="d-mobile-menu-button" aria-label={menu?'Close menu':'Open menu'} onClick={()=>setMenu(v=>!v)}>{menu?<X size={19}/>:<Menu size={19}/>}</Button></div></header>{menu?<div className="d-mobile-menu">{scenes.slice(1).map(name=><Button key={name} variant="ghost" onClick={()=>go(name.toLowerCase())}>{name}</Button>)}<Link to="/login" search={{mode:undefined}}>Login ↗</Link></div>:null}<aside className={`d-dot-nav ${dark?'on-dark':''}`} aria-label="Scene navigation">{scenes.map(name=><Button key={name} variant="ghost" className={active===name?'active':''} aria-label={`Go to ${name}`} aria-current={active===name?'step':undefined} onClick={()=>go(name.toLowerCase())}><span/>{active===name?<small>{name}</small>:null}</Button>)}</aside><LandingScenes/></main>;
}
