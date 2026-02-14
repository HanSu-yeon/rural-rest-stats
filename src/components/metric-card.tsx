"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  CalendarClock,
  ThumbsUp,
  UserCheck,
} from "lucide-react";

const iconMap = {
  DollarSign,
  CalendarClock,
  ThumbsUp,
  UserCheck,
} as const;

export type MetricIconName = keyof typeof iconMap;

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  description?: string;
  icon?: MetricIconName;
  trend?: {
    value: string;
    positive: boolean;
  };
  highlight?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  description,
  icon,
  trend,
  highlight = false,
}: MetricCardProps) {
  const Icon = icon ? iconMap[icon] : null;

  return (
    <Card
      className={`min-h-fit overflow-hidden ${
        highlight
          ? "border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
          : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400 break-keep whitespace-normal leading-snug">
            {title}
          </CardTitle>
          {Icon && (
            <Icon className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 break-keep">
            {subtitle}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl sm:text-3xl font-bold break-all">{value}</div>
        {description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed break-keep whitespace-normal">
            {description}
          </p>
        )}
        {trend && (
          <div
            className={`flex items-center gap-1 mt-2 text-xs sm:text-sm font-medium ${
              trend.positive
                ? "text-red-600 dark:text-red-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          >
            <span className="shrink-0">{trend.positive ? "▲" : "▼"}</span>
            <span className="break-keep">{trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
