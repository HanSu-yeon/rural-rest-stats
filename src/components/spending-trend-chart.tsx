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
  LabelList,
} from "recharts";
import { TrendingUp, ArrowRight } from "lucide-react";

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
              코로나 이후 완전 회복
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
            >
              <LabelList
                dataKey="spending"
                position="top"
                formatter={(v) => `$${Number(v).toLocaleString()}`}
                style={{ fontSize: "9px", fill: "#10b981", fontWeight: 600 }}
                offset={8}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>

        {/* 성장 비교 히어로 */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-50/60 to-emerald-50 dark:from-emerald-900/20 dark:via-emerald-900/10 dark:to-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            {/* 2015 */}
            <div className="text-center shrink-0">
              <p className="text-xl sm:text-2xl font-bold text-zinc-700 dark:text-zinc-200">
                ${firstYear?.spending?.toLocaleString()}
              </p>
              <p className="text-[10px] sm:text-xs text-zinc-400 mt-1">{firstYear?.year}년</p>
            </div>

            {/* 중앙 화살표 + 회복 메시지 */}
            <div className="flex flex-col items-center gap-1 px-2 sm:px-5">
              <div className="flex items-center gap-1.5">
                <div className="hidden sm:block h-px w-6 bg-emerald-400/60" />
                <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
                  <ArrowRight className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="hidden sm:block h-px w-6 bg-emerald-400/60" />
              </div>
              <p className="text-xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight break-keep text-center">
                회복 + 소폭 상회
              </p>
              <p className="text-[10px] sm:text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium break-keep text-center">
                2019년 $1,239 저점 → 2024년 코로나 이전 수준 회복
              </p>
            </div>

            {/* 2024 */}
            <div className="text-center shrink-0">
              <p className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                ${lastYear?.spending?.toLocaleString()}
              </p>
              <p className="text-[10px] sm:text-xs text-zinc-400 mt-1">{lastYear?.year}년</p>
            </div>
          </div>

          {/* 하단 보조 정보 */}
          <div className="mt-5 flex justify-center gap-3 sm:gap-5">
            <div className="px-3 py-1.5 rounded-full bg-white/70 dark:bg-zinc-800/50 border border-emerald-200/50 dark:border-emerald-700/30">
              <span className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400">
                체류기간 {firstYear?.stayDuration}일 → {lastYear?.stayDuration}일 <span className="text-emerald-600 font-semibold">안정 유지</span>
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/70 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/30">
              <span className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400">
                2020~22년 코로나 충격 후 <span className="text-emerald-600 font-semibold">완전 회복</span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
