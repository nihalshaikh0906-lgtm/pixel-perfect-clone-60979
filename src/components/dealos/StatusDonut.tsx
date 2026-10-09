import { useEffect, useRef, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export type StatusDatum = { name: string; value: number; token: string };

/**
 * Donut for the illustrative workspace mock. Colours are read from the landing
 * page's own semantic tokens at mount time so the chart always matches the
 * theme. Loaded lazily — recharts never enters the server render.
 */
export default function StatusDonut({ data, total, animate = true }: { data: StatusDatum[]; total: number; animate?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState<string[]>([]);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    setColors(data.map((d) => cs.getPropertyValue(d.token).trim() || cs.getPropertyValue('--d-border').trim()));
  }, [data]);
  return (
    <div className="d-donut-wrap" ref={host}>
      {colors.length === data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="67%"
              outerRadius="95%"
              paddingAngle={2}
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={animate}
              animationDuration={900}
            >
              {data.map((d, i) => (
                <Cell key={d.name} fill={colors[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ) : null}
      <span className="d-donut-center">
        <strong>{total}</strong>
        <small>listings</small>
      </span>
    </div>
  );
}
