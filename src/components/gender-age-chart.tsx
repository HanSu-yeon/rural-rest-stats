"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
  LabelList,
} from "recharts";

interface GenderAgeChartProps {
  data: Array<{
    ageGroup: string;
    male: number;
    female: number;
    malePercent: number;
    femalePercent: number;
  }>;
  topSegment: string;
  topSegmentPercent: number;
  femalePercent: number;
  malePercent: number;
}

export function GenderAgeChart({
  data,
  topSegment,
  topSegmentPercent,
  femalePercent,
  malePercent,
}: GenderAgeChartProps) {
  const genderDonutData = [
    { name: "여성", value: Math.round(femalePercent * 10) / 10 },
    { name: "남성", value: Math.round(malePercent * 10) / 10 },
  ];

  return (
    <Card className="min-h-fit overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg break-keep">
              2025 성별 × 연령별 분포
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-1">
              2025년 연간 누적 · 단위: 만 명
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 shrink-0">
            <span className="text-xs sm:text-sm font-bold text-pink-700 dark:text-pink-300 whitespace-nowrap">
              {topSegment} {topSegmentPercent}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {/* 상단: 성별 비중 도넛 + 스택 바 차트 */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
          {/* 성별 비중 도넛 */}
          <div className="w-full lg:w-[200px] shrink-0">
            <div className="relative">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={genderDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    label={({ cx, cy, midAngle, outerRadius: oR, value, name }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = oR + 14;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{ fontSize: "10px", fontWeight: 700, fill: name === "여성" ? "#ec4899" : "#60a5fa" }}
                        >
                          {value}%
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    <Cell fill="#ec4899" />
                    <Cell fill="#60a5fa" />
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value ?? 0}%`, name as string]}
                    contentStyle={{
                      fontSize: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {femalePercent.toFixed(1)}%
                </span>
                <span className="text-[10px] text-zinc-500">여성</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                <span className="text-[10px] text-zinc-500">여성 {femalePercent.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="text-[10px] text-zinc-500">남성 {malePercent.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* 연령별 스택 바 차트 */}
          <div className="w-full min-w-0">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis
                  dataKey="ageGroup"
                  style={{ fontSize: "10px" }}
                  tick={{ fill: "#71717a" }}
                  interval={0}
                />
                <YAxis
                  style={{ fontSize: "10px" }}
                  tick={{ fill: "#a1a1aa" }}
                  width={36}
                  tickFormatter={(v) => `${v}만`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  formatter={(value, name) => [
                    `${Number(value ?? 0).toLocaleString()}만 명`,
                    name === "male" ? "남성" : "여성",
                  ]}
                  contentStyle={{
                    fontSize: "12px",
                    borderRadius: "8px",
                    border: "1px solid #e4e4e7",
                  }}
                />
                <Legend
                  formatter={(value) => (value === "male" ? "남성" : "여성")}
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px" }}
                />
                <Bar dataKey="male" stackId="a" radius={[0, 0, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`male-${index}`}
                      fill={entry.ageGroup === "21~30세" ? "#60a5fa" : "#93c5fd"}
                    />
                  ))}
                </Bar>
                <Bar dataKey="female" stackId="a" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`female-${index}`}
                      fill={entry.ageGroup === "21~30세" ? "#ec4899" : "#f9a8d4"}
                    />
                  ))}
                  <LabelList
                    valueAccessor={(entry: { male: number; female: number }) =>
                      entry.male + entry.female
                    }
                    position="top"
                    formatter={(v) => `${v}만`}
                    style={{ fontSize: "10px", fill: "#71717a", fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 하단 세그먼트 요약 */}
        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="text-center p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800">
            <p className="text-base sm:text-lg font-bold text-pink-600 dark:text-pink-400">19.1%</p>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 break-keep">21~30세 여성</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800">
            <p className="text-base sm:text-lg font-bold text-pink-600 dark:text-pink-400">12.9%</p>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 break-keep">31~40세 여성</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">8.9%</p>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 break-keep">31~40세 남성</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
