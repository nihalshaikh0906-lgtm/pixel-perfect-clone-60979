import { useState } from 'react';

// Illustrative market heatmap — demo figures only, not live valuations.
const SPOTS = [
  { name: 'Dubai Marina', x: 120, y: 210, sale: 2150, rent: 145000, yld: 6.1, badge: 'Hot Market' },
  { name: 'Downtown', x: 470, y: 95, sale: 2650, rent: 170000, yld: 5.4, badge: 'Hot Market' },
  { name: 'JVC', x: 255, y: 235, sale: 1180, rent: 78000, yld: 7.9, badge: 'Underrated' },
  { name: 'Arjan', x: 270, y: 305, sale: 1090, rent: 72000, yld: 8.1, badge: 'Underrated' },
  { name: 'DIP', x: 140, y: 350, sale: 820, rent: 58000, yld: 8.6, badge: 'Underrated' },
  { name: 'Business Bay', x: 410, y: 150, sale: 1980, rent: 120000, yld: 6.6, badge: 'Hot Market' },
] as const;

export function AreaIntelMap() {
  const [active, setActive] = useState<string>('JVC');
  const s = SPOTS.find((p) => p.name === active) ?? SPOTS[0];
  return (
    <div className="d-panel d-area-intel">
      <div className="d-panel-head"><span className="d-eyebrow">MARKET HEATMAP</span><h4>Dubai Area Intel (Market Heatmap)</h4></div>
      <div className="d-area-map">
        <svg viewBox="0 0 600 460" role="img" aria-label="Illustrative Dubai area heatmap">
          <path className="d-map-water" d="M0 0H600L520 60 400 110 330 170 220 215 150 300 80 330 0 430Z" />
          <path className="d-map-land" d="M600 0L520 60 400 110 330 170 220 215 150 300 80 330 0 430V460H600Z" />
          <path className="d-map-road" d="M80 450L120 340 240 250 350 175 475 110 590 45M200 460L250 330 370 250 580 190" />
          {SPOTS.map((p) => (
            <g key={p.name} className={`d-area-dot ${p.badge === 'Hot Market' ? 'hot' : 'under'}${p.name === active ? ' active' : ''}`} tabIndex={0} role="button" aria-label={`${p.name}: ${p.yld}% yield`}
              onMouseEnter={() => setActive(p.name)} onFocus={() => setActive(p.name)} onClick={() => setActive(p.name)}>
              <circle cx={p.x} cy={p.y} r={p.name === active ? 30 : 22} />
              <circle className="d-map-pin" cx={p.x} cy={p.y} r={5} />
              <text x={p.x} y={p.y + 42} textAnchor="middle">{p.name}</text>
            </g>
          ))}
        </svg>
        <div className="d-area-tip" aria-live="polite" key={s.name}>
          <div className="d-area-tip-head"><h4>{s.name}</h4><span className={`d-tip-badge ${s.badge === 'Hot Market' ? 'prime' : 'emerging'}`}>{s.badge}</span></div>
          <dl className="d-tip-stats">
            <div><dt>Avg Sale Price</dt><dd>AED {s.sale.toLocaleString('en-US')} / sqft</dd></div>
            <div><dt>Avg Annual Rent</dt><dd>AED {s.rent.toLocaleString('en-US')}</dd></div>
            <div><dt>Rental Yield</dt><dd className="d-positive">{s.yld.toFixed(1)}%</dd></div>
          </dl>
          <small>Illustrative demo data</small>
        </div>
      </div>
    </div>
  );
}
