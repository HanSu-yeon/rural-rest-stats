"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface SpendingTrendChartProps {
  data: Array<{
    year: number;
    spending: number;
    stayDuration: number;
  }>;
}

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  const firstYear = data[0];
  const lastYear = data[data.length - 1];
  const growthRate = firstYear
    ? (((lastYear.spending - firstYear.spending) / firstYear.spending) * 100).toFixed(1)
    : "0";

  return (
    <Card className="min-h-fit overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg break-keep">
              1인당 지출액 연도별 추이 (2015~2024)
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-1">
              방한여행 행태 및 만족도 조사 · 단위: USD
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 shrink-0">
            <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
              ${firstYear?.spending?.toLocaleString()} → ${lastYear?.spending?.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="year"
              style={{ fontSize: "10px" }}
              tick={{ fill: "#71717a" }}
              tickFormatter={(v) => `${v}년`}
            />
            <YAxis
              style={{ fontSize: "10px" }}
              tick={{ fill: "#a1a1aa" }}
              width={44}
              domain={[500, 2200]}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
            />
            <Tooltip
              cursor={{ stroke: "#d4d4d8", strokeWidth: 1, fill: "rgba(0,0,0,0.02)" }}
              formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, "1인당 지출"]}
              labelFormatter={(label) => `${label}년`}
              contentStyle={{
                fontSize: "12px",
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
              }}
            />
            <ReferenceLine
              y={1712}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{
                value: "기준값 $1,712",
                position: "right",
                fill: "#10b981",
                fontSize: 10,
              }}
            />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#spendingGradient)"
              dot={{ r: 3, fill: "#10b981" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
            <p className="text-base sm:text-lg font-bold text-emerald-600">${firstYear?.spending?.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500">{firstYear?.year}년</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
            <p className="text-base sm:text-lg font-bold text-emerald-600">${lastYear?.spending?.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500">{lastYear?.year}년</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
            <p className="text-base sm:text-lg font-bold text-emerald-600">
              {Number(growthRate) >= 0 ? "▲" : "▼"} {Math.abs(Number(growthRate))}%
            </p>
            <p className="text-[10px] text-zinc-500">누적 변동률</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700">
            <p className="text-base sm:text-lg font-bold text-zinc-600 dark:text-zinc-300 break-keep">회복 확인</p>
            <p className="text-[10px] text-zinc-500">2020~22년</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
