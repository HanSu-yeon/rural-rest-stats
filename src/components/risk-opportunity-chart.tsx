"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  LabelList,
} from "recharts";
import { Plane, MapPin, CalendarRange } from "lucide-react";
import type { PieLabelRenderProps } from "recharts/types/polar/Pie";

/* ───── 공항 분포 도넛 차트 ───── */
interface AirportChartProps {
  data: Array<{ name: string; value: number }>;
}

const AIRPORT_COLORS = [
  "#3b82f6",
  "#f97316",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
];

export function AirportDistributionChart({ data }: AirportChartProps) {
  const nonIncheon = data
    .filter((d) => d.name !== "인천공항")
    .reduce((s, d) => s + d.value, 0);

  return (
    <Card className="min-h-fit overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 break-keep">
              <Plane className="h-4 w-4 shrink-0 text-violet-600" />
              2025 입국 공항별 비중
            </CardTitle>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 shrink-0">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-600" />
            <span className="text-xs sm:text-sm font-bold text-violet-700 dark:text-violet-300 whitespace-nowrap">
              인천 외 {nonIncheon.toFixed(1)}%
            </span>
          </div>
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
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: "10px", fontWeight: 700, fill: "#52525b" }}
                    >
                      {props.value}%
                    </text>
                  );
                }}
                labelLine={false}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={AIRPORT_COLORS[i % AIRPORT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _name, props) => [
                  `${value ?? 0}%`,
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
                    style={{
                      backgroundColor: AIRPORT_COLORS[i % AIRPORT_COLORS.length],
                    }}
                  />
                  <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 truncate">
                    {d.name}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-semibold shrink-0 ml-2">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ───── 계절성 관심도 차트 ───── */
interface SeasonalityChartProps {
  data: Array<{ month: string; interest: number }>;
}

export function SeasonalityRiskChart({ data }: SeasonalityChartProps) {
  const maxInterest = Math.max(...data.map((d) => d.interest));
  const minInterest = Math.min(...data.map((d) => d.interest));
  const ratio = maxInterest / (minInterest || 1);

  return (
    <Card className="min-h-fit overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 break-keep">
              <CalendarRange className="h-4 w-4 shrink-0 text-amber-600" />
              2025 월별 관심도 추이
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-1">
              2025.01~12 비수기-피크 편차 분석
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 shrink-0">
            <span className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300 whitespace-nowrap">
              최대/최소 {ratio.toFixed(1)}배
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="month"
              style={{ fontSize: "10px" }}
              tick={{ fill: "#71717a" }}
              interval={0}
            />
            <YAxis
              style={{ fontSize: "10px" }}
              tick={{ fill: "#a1a1aa" }}
              width={36}
              domain={[0, 110]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              formatter={(value) => [`${value ?? 0}%`, "관심도"]}
              contentStyle={{
                fontSize: "12px",
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
              }}
            />
            <ReferenceLine
              y={50}
              stroke="#f59e0b"
              strokeDasharray="5 5"
            />
            <Bar dataKey="interest" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.interest <= 30
                      ? "#ef4444"
                      : entry.interest <= 60
                      ? "#f59e0b"
                      : "#22c55e"
                  }
                />
              ))}
              <LabelList
                dataKey="interest"
                position="top"
                formatter={(v) => `${v}%`}
                style={{ fontSize: "9px", fill: "#71717a", fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
            <p className="text-xs sm:text-sm font-bold text-red-600">1~4월</p>
            <p className="text-[10px] text-zinc-500">비수기 (24~36%)</p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
            <p className="text-xs sm:text-sm font-bold text-amber-600">5~6월</p>
            <p className="text-[10px] text-zinc-500">성장기 (48~67%)</p>
          </div>
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
            <p className="text-xs sm:text-sm font-bold text-green-600">7~10월</p>
            <p className="text-[10px] text-zinc-500">피크 (82~100%)</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50">
          <p className="text-xs text-amber-700 dark:text-amber-300 break-keep leading-relaxed">
            <span className="font-semibold">데이터 시사점:</span> 비수기(1~4월) 관심도가 피크 대비 약 1/4 수준으로, 연간 가동률 안정화가 핵심 과제로 확인됨
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
