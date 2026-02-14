"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Globe } from "lucide-react";
import type { PieLabelRenderProps } from "recharts/types/polar/Pie";

interface ContinentChartProps {
  data: Array<{ name: string; value: number; count: number }>;
}

const COLORS = ["#3b82f6", "#f97316", "#8b5cf6", "#06b6d4", "#ec4899"];

export function ContinentChart({ data }: ContinentChartProps) {
  const asia = data.find((d) => d.name === "아시아");

  return (
    <Card className="min-h-fit overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 break-keep">
              <Globe className="h-4 w-4 shrink-0 text-blue-600" />
              2025 대륙별 방문객 비중
            </CardTitle>
          </div>
          {asia && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 shrink-0">
              <span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                아시아 {asia.value}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-5">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={(props: PieLabelRenderProps) => {
                  const cx = Number(props.cx ?? 0);
                  const cy = Number(props.cy ?? 0);
                  const midAngle = Number(props.midAngle ?? 0);
                  const oR = Number(props.outerRadius ?? 0);
                  const RADIAN = Math.PI / 180;
                  const radius = oR + 16;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return Number(props.value ?? 0) >= 1 ? (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: "10px", fontWeight: 700, fill: "#52525b" }}
                    >
                      {props.value}%
                    </text>
                  ) : null;
                }}
                labelLine={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _name, props) => [
                  `${value ?? 0}% (${((props as { payload: { count: number } }).payload.count).toLocaleString()}명)`,
                  (props as { payload: { name: string } }).payload.name,
                ]}
                contentStyle={{
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "1px solid #e4e4e7",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="w-full space-y-1.5">
            {data.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 truncate">
                    {d.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] text-zinc-400">
                    {d.count.toLocaleString()}명
                  </span>
                  <span className="text-xs sm:text-sm font-semibold w-12 text-right">
                    {d.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
