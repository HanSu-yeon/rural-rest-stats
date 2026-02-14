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
} from "recharts";

interface AgeChartProps {
  data: Array<{
    age: string;
    count: number;
  }>;
}

export function AgeChart({ data }: AgeChartProps) {
  return (
    <Card className="min-h-fit overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-base break-keep">2025 연령별 방문객 분포</CardTitle>
        <p className="text-xs text-zinc-500 mt-1">
          2025.01 기준 · 단위: 천 명
        </p>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ bottom: 5, left: 0, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="age"
              angle={-25}
              textAnchor="end"
              height={70}
              interval={0}
              style={{ fontSize: "11px" }}
              tick={{ fill: "#71717a", dy: 5 }}
            />
            <YAxis
              style={{ fontSize: "10px" }}
              tick={{ fill: "#a1a1aa" }}
              width={40}
              tickFormatter={(v) => `${v}천`}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              formatter={(value) => [
                `${Number(value ?? 0).toLocaleString()}천 명`,
                "방문객 수",
              ]}
              contentStyle={{
                fontSize: "12px",
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
              }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
