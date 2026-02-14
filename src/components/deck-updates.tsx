"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, RefreshCw } from "lucide-react";

interface HypothesisItem {
  hypothesis: string;
  data: string;
  result: "confirmed" | "revised";
}

interface DeckUpdatesProps {
  items: HypothesisItem[];
}

const resultConfig = {
  confirmed: {
    label: "검증 완료",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  revised: {
    label: "수정 필요",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    icon: RefreshCw,
  },
};

export function DeckUpdates({ items }: DeckUpdatesProps) {
  const confirmed = items.filter((i) => i.result === "confirmed").length;
  const revised = items.filter((i) => i.result === "revised").length;

  return (
    <Card className="min-h-fit overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <CardContent className="p-0">
        {/* 요약 헤더 */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            총 {items.length}건 가설 검증
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              검증 완료 {confirmed}건
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <RefreshCw className="h-3.5 w-3.5 text-amber-500" />
              수정 필요 {revised}건
            </span>
          </div>
        </div>

        {/* 테이블 헤더 */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_120px] gap-4 px-5 sm:px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">가설</p>
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">검증 데이터</p>
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider text-center">결과</p>
        </div>

        {/* 테이블 행 */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((item, index) => {
            const config = resultConfig[item.result];
            const ResultIcon = config.icon;
            return (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px] gap-2 sm:gap-4 px-5 sm:px-6 py-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                {/* 가설 */}
                <div className="min-w-0">
                  <span className="sm:hidden text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">가설</span>
                  <p className="text-sm text-zinc-800 dark:text-zinc-200 break-keep whitespace-normal leading-relaxed">
                    {item.hypothesis}
                  </p>
                </div>
                {/* 검증 데이터 */}
                <div className="min-w-0">
                  <span className="sm:hidden text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">검증 데이터</span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 break-keep whitespace-normal leading-relaxed">
                    {item.data}
                  </p>
                </div>
                {/* 결과 배지 */}
                <div className="flex sm:justify-center items-start sm:items-center">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium shrink-0 ${config.className}`}
                  >
                    <ResultIcon className="h-3 w-3" />
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
