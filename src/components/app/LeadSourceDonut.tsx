import { useEffect, useRef, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export type SourceDatum = { name: string; value: number; token: string };

/**
 * Donut for the Owner Dashboard's illustrative lead-source mock. Slice colours
 * are read from the app's own semantic tokens at mount time, so the chart always
 * matches the theme and no colour value is hard-coded here. Loaded lazily —
 * recharts never enters the server render.
 */
export default function LeadSourceDonut({
  data,
  total,
  animate = true,
}: {
  data: SourceDatum[];
  total: number;
  animate?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    setColors(data.map((d) => cs.getPropertyValue(d.token).trim() || cs.getPropertyValue("--a-line").trim()));
  }, [data]);

  return (
    <div className="od-donut-wrap" ref={host}>
      {colors.length === data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="66%"
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
      <span className="od-donut-center">
        <strong className="num">{total.toLocaleString("en-US")}</strong>
        <small>leads</small>
      </span>
    </div>
  );
}
