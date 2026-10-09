import { useId } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const leads = [24, 28, 21, 33, 30, 26, 35, 38, 29, 32, 41, 36, 34, 44, 39, 48, 42, 37, 46, 51, 43, 49, 55, 47, 52, 58, 50, 61, 54, 64].map((value, i) => ({ day: i + 1, leads: value }));
const stages = [
  { name: 'New', value: 320, token: '--d-indigo' },
  { name: 'Contacted', value: 224, token: '--d-soft' },
  { name: 'Qualified', value: 112, token: '--d-mint' },
  { name: 'Won', value: 35, token: '--d-positive' },
];

function ChartTooltip({ active, payload, label, daily = false }: { active?: boolean; payload?: ReadonlyArray<{ value?: number | string; payload?: { name?: string } }>; label?: string | number; daily?: boolean }) {
  const item = payload?.[0];
  if (!active || !item) return null;
  return <div className="d-chart-tooltip"><small>{daily ? `Day ${label}` : item.payload?.name}</small><strong>{item.value} {daily ? 'leads' : 'deals'}</strong></div>;
}

export default function LeadPipelineCharts({ animate = true }: { animate?: boolean }) {
  const gradientId = `leads-${useId().replace(/:/g, '')}`;
  return <>
    <div className="d-panel">
      <div className="d-panel-head"><span className="d-eyebrow">LAST 30 DAYS</span><h4>Leads Overview</h4></div>
      <div className="d-dash-chart" role="img" aria-label={`Mock daily leads over 30 days, from 24 to 64; ${leads.reduce((sum, day) => sum + day.leads, 0)} total leads`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={leads} margin={{ top: 10, right: 12, bottom: 0, left: -18 }} accessibilityLayer>
            <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--d-indigo)" stopOpacity={0.24}/><stop offset="100%" stopColor="var(--d-indigo)" stopOpacity={0.02}/></linearGradient></defs>
            <CartesianGrid stroke="var(--d-border)" strokeDasharray="3 5" vertical={false}/>
            <XAxis dataKey="day" ticks={[1, 7, 14, 21, 30]} tickFormatter={day => `Day ${day}`} tick={{ fill: 'var(--d-soft)', fontSize: 12 }} axisLine={false} tickLine={false} tickMargin={9}/>
            <YAxis tick={{ fill: 'var(--d-soft)', fontSize: 12 }} axisLine={false} tickLine={false} width={48} domain={[0, 80]} ticks={[0, 20, 40, 60, 80]}/>
            <Tooltip content={<ChartTooltip daily/>} cursor={{ stroke: 'var(--d-border)' }}/>
            <Area type="monotone" dataKey="leads" name="Leads" stroke="var(--d-indigo)" strokeWidth={2} fill={`url(#${gradientId})`} isAnimationActive={animate} animationDuration={650}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="d-panel">
      <div className="d-panel-head"><span className="d-eyebrow">CONVERSION STAGES</span><h4>Deals Pipeline</h4></div>
      <div className="d-dash-chart" role="img" aria-label="Mock deals pipeline: New 320, Contacted 224, Qualified 112, Won 35">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stages} layout="vertical" margin={{ top: 4, right: 32, bottom: 0, left: 0 }} accessibilityLayer>
            <XAxis type="number" hide domain={[0, 360]}/>
            <YAxis type="category" dataKey="name" width={78} tick={{ fill: 'var(--d-soft)', fontSize: 12 }} axisLine={false} tickLine={false}/>
            <Tooltip content={<ChartTooltip/>} cursor={false}/>
            <Bar dataKey="value" name="Deals" barSize={24} radius={[0, 4, 4, 0]} isAnimationActive={animate} animationDuration={650}>
              {stages.map(stage => <Cell key={stage.name} fill={`var(${stage.token})`}/>)}
              <LabelList dataKey="value" position="right" fill="var(--d-ink)" fontSize={12}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </>;
}