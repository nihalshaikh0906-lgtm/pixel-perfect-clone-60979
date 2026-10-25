import { createFileRoute } from '@tanstack/react-router';
import { DealOSLanding } from '@/components/dealos/DealOSLanding';
export const Route = createFileRoute('/welcome')({
  head: () => ({ meta: [
    { title: 'DealOS — The Broker OS built on Dubai data' },
    { name: 'description', content: 'A connected workspace for Dubai real-estate brokers. Explore lead management, property intelligence, AI-assisted client profiles and presentation decks.' },
    { property: 'og:title', content: 'DealOS — The Broker OS built on Dubai data' },
    { property: 'og:description', content: 'Your clients, property intelligence and next opportunity. One broker workspace built around Dubai.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: DealOSLanding,
});
