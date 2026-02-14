"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface NationalityChartProps {
  data: Array<{
    name: string;
    percentage: number;
    count: number;
    growthRate: number | null;
  }>;
}

const COLORS = [
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#a5b4fc",
  "#c4b5fd",
  "#d8b4fe",
  "#f0abfc",
  "#f9a8d4",
  "#fda4af",
  "#fca5a5",
];

export function NationalityChart({ data }: NationalityChartProps) {
  return (
    <Card className="min-h-fit overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-base break-keep">
          2025 국적별 방문객 비중
        </CardTitle>
        <p className="text-xs text-zinc-500 mt-1">상위 10개국 · 단위: % · 전년(2024) 대비 증감률 포함</p>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <XAxis
              type="number"
              domain={[0, "auto"]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={55}
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              formatter={(value) => [`${value ?? 0}%`, "비중"]}
              labelFormatter={(label) => {
                const labelStr = String(label);
                const item = data.find((d) => d.name === labelStr);
                if (!item) return labelStr;
                const growth = item.growthRate;
                const growthStr =
                  growth != null
                    ? growth >= 0
                      ? ` · ▲ ${growth.toFixed(1)}%`
                      : ` · ▼ ${Math.abs(growth).toFixed(1)}%`
                    : "";
                return `${labelStr} (${item.count.toLocaleString()}명${growthStr})`;
              }}
              contentStyle={{
                fontSize: "12px",
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
              }}
            />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
