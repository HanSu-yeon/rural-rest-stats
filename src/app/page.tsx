import { db } from "@/app/db";
import {
  touristBehavior,
  touristByContinent,
  touristByCountry,
  touristByAge,
  touristByGenderAge,
  touristTrend,
  touristByTransportSummary,
  koreaInterestTrend,
} from "@/db/schema";
import { isNull, and } from "drizzle-orm";
import { MetricCard } from "@/components/metric-card";
import { NationalityChart } from "@/components/nationality-chart";
import { AgeChart } from "@/components/age-chart";
import { ContinentChart } from "@/components/continent-chart";
import { GenderAgeChart } from "@/components/gender-age-chart";
import { SpendingTrendChart } from "@/components/spending-trend-chart";
import {
  AirportDistributionChart,
  SeasonalityRiskChart,
} from "@/components/risk-opportunity-chart";

export default async function Home() {
  // ─── 데이터 쿼리 ───────────────────────────────────────
  const allBehavior = await db
    .select()
    .from(touristBehavior)
    .orderBy(touristBehavior.year);

  const behavior2015 = allBehavior.find((b) => b.year === 2015);
  const behavior2024 = allBehavior.find((b) => b.year === 2024);

  const continentData = await db.select().from(touristByContinent);
  const countryData = await db.select().from(touristByCountry);

  const ageData = await db
    .select()
    .from(touristByAge)
    .where(and(isNull(touristByAge.country), isNull(touristByAge.continent)));

  const genderAgeData = await db.select().from(touristByGenderAge);
  const interestData = await db.select().from(koreaInterestTrend);
  const trendData = await db.select().from(touristTrend);
  const transportSummary = await db.select().from(touristByTransportSummary);

  // ─── 데이터 가공 ───────────────────────────────────────

  const continentChartData = continentData
    .filter((c) => c.continent !== "기타" && c.continent !== "교포")
    .map((c) => ({
      name: c.continent,
      value: c.percentage,
      count: Math.round(c.touristCount),
    }));

  // 국적별 방문객 비중 (상위 10개국)
  const nationalityChartData = countryData
    .filter((c) => c.percentage != null && c.percentage > 0)
    .sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0))
    .slice(0, 10)
    .map((c) => ({
      name: c.country,
      percentage: Math.round((c.percentage ?? 0) * 10) / 10,
      count: Math.round(c.touristCount),
      growthRate: c.growthRate,
    }));

  const ageChartData = ageData
    .filter((a) => a.ageGroup !== "승무원" && a.ageGroup !== "전체")
    .map((a) => ({
      age: a.ageGroup,
      count: Math.round(a.count / 1000),
    }));

  const totalAge = ageData.find((a) => a.ageGroup === "전체");
  const mzGroups = ageData.filter(
    (a) => a.ageGroup.includes("20") || a.ageGroup.includes("30")
  );
  const mzCount = mzGroups.reduce((sum, a) => sum + a.count, 0);
  const totalCount = totalAge?.count ?? 1;
  const mzPercent = (mzCount / totalCount) * 100;

  const totalMale = genderAgeData.reduce((s, g) => s + g.maleCount, 0);
  const totalFemale = genderAgeData.reduce((s, g) => s + g.femaleCount, 0);
  const femalePercent = (totalFemale / (totalMale + totalFemale)) * 100;

  const ageGroupOrder: Record<string, number> = {
    "20세이하": 0, "20세 이하": 0,
    "21~30세": 1,
    "31~40세": 2,
    "41~50세": 3,
    "51~60세": 4,
    "61세이상": 5, "61세 이상": 5,
  };

  const genderAgeChartData = genderAgeData
    .filter((g) => g.ageGroup !== "전체" && g.ageGroup !== "승무원")
    .map((g) => ({
      ageGroup: g.ageGroup,
      male: Math.round(g.maleCount / 10000),
      female: Math.round(g.femaleCount / 10000),
      malePercent: g.malePercentage ?? 0,
      femalePercent: g.femalePercentage ?? 0,
    }))
    .sort((a, b) => (ageGroupOrder[a.ageGroup] ?? 99) - (ageGroupOrder[b.ageGroup] ?? 99));

  const allSegments = genderAgeData
    .filter((g) => g.ageGroup !== "전체" && g.ageGroup !== "승무원")
    .flatMap((g) => [
      { label: `${g.ageGroup} 남성`, count: g.maleCount, percent: g.malePercentage ?? 0 },
      { label: `${g.ageGroup} 여성`, count: g.femaleCount, percent: g.femalePercentage ?? 0 },
    ]);
  const topSegment = allSegments.reduce(
    (max, s) => (s.count > max.count ? s : max),
    allSegments[0] ?? { label: "21~30세 여성", count: 0, percent: 19.1 }
  );

  const spendingTrendData = allBehavior.map((b) => ({
    year: b.year,
    spending: b.avgSpending,
    stayDuration: b.stayDuration,
  }));

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];
  const interestChartData = interestData.map((d, i) => ({
    month: monthNames[i] || d.yearMonth,
    interest: d.interestPercentage,
  }));

  const airportData = transportSummary
    .filter((t) => t.transport.includes("공항"))
    .map((t) => ({
      name: t.transport,
      value: t.percentage ?? 0,
    }))
    .sort((a, b) => b.value - a.value);

  // 총계 행에서 정확한 YoY 성장률 산출 (글로벌 방한관광객 CSV 기준)
  const totalRow = countryData.find((c) => c.country === "총계");
  const totalVisitors = totalRow?.touristCount ?? trendData.reduce((s, t) => s + t.touristCount, 0);
  const totalVisitorsFormatted = `${(totalVisitors / 10000).toFixed(0)}만`;
  const prevYearVisitors = totalRow?.previousYearCount ?? 0;
  const hasYoyData = prevYearVisitors > 0;
  const yoyGrowthNum = hasYoyData
    ? ((totalVisitors - prevYearVisitors) / prevYearVisitors) * 100
    : null;
  const yoyGrowth = yoyGrowthNum !== null ? Math.abs(yoyGrowthNum).toFixed(1) : null;
  const yoyPositive = yoyGrowthNum !== null ? yoyGrowthNum >= 0 : null;

  // ─── 가설 검증 데이터 ──────────────────────────────────
  const hypothesisItems = [
    {
      hypothesis: "농촌 숙소의 1인당 수익이 프리미엄 시장을 지탱할 수 있는가",
      data: `[2024] $${behavior2024?.avgSpending?.toLocaleString() ?? "1,877"} (코로나 이전 $1,712 수준 회복 + 소폭 상회)`,
      result: "confirmed" as const,
    },
    {
      hypothesis: "게스트 체류 기간이 자산 가동률을 뒷받침하는가",
      data: `[2015→2024] 평균 ${behavior2015?.stayDuration ?? 6.6}일 → ${behavior2024?.stayDuration ?? 6.7}일 (안정적 유지)`,
      result: "confirmed" as const,
    },
    {
      hypothesis: "만족도와 재방문율이 반복 수익 구조를 형성하는가",
      data: `[2015→2024] 만족도 93.5→${behavior2024?.satisfaction ?? 96.5}% (+3.0%p), 재방문 의향 85.6→${behavior2024?.revisitIntention ?? 92.3}% (+6.7%p)`,
      result: "confirmed" as const,
    },
    {
      hypothesis: "2030세대가 핵심 타겟으로 유효한가",
      data: `[2025] 2030세대 비중 ${mzPercent.toFixed(1)}%, 21~30세 여성 ${topSegment?.percent ?? 19.1}% (단일 최대)`,
      result: "confirmed" as const,
    },
    {
      hypothesis: "아시아 시장 집중 전략이 데이터에 부합하는가",
      data: `[2025] 아시아 비중 80.5%, 대만 ▲ 28.3% 성장 (189만명, 3위)`,
      result: "confirmed" as const,
    },
    ...(hasYoyData && yoyGrowth ? [{
      hypothesis: "인바운드 시장이 성장 추세에 있는가",
      data: `[2025 vs 2024] 전년 대비 ${yoyPositive ? "▲" : "▼"} ${yoyGrowth}% 성장, 총 ${totalVisitorsFormatted}명`,
      result: "confirmed" as const,
    }] : []),
    {
      hypothesis: "연중 안정적 수요를 기대할 수 있는가",
      data: `[2025] 비수기 관심도 24% vs 피크 100% — 계절 편차 약 4배`,
      result: "revised" as const,
    },
    {
      hypothesis: "인천공항 외 접근 경로가 존재하는가",
      data: `[2025] 비인천 공항 입국 비중 22.1% (김해·제주·김포 합산)`,
      result: "confirmed" as const,
    },
  ];

  // ─── 렌더링 ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      {/* ━━━ 헤더 ━━━ */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6TTM2IDI0djJIMnYtMmgzNHpNMzYgMTR2Mkgydi0yaDM0ek0zNiA0djJIMlY0aDM0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4">
                <span className="text-[10px] sm:text-xs text-blue-200">수익성: 2015~2024 추이</span>
                <span className="text-[10px] sm:text-xs text-blue-300/60">|</span>
                <span className="text-[10px] sm:text-xs text-blue-200">방문객·시장: 2025 연간</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight break-keep">
                Rural Rest
                <span className="block text-xl sm:text-2xl md:text-3xl font-normal text-blue-200 mt-2 break-keep">
                  방한관광 공공 데이터 기반 실증 분석
                </span>
              </h1>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-wrap shrink-0">
              <div className="px-3 sm:px-5 py-2 sm:py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-xl sm:text-2xl font-bold">${behavior2024?.avgSpending?.toLocaleString() ?? "1,877"}</p>
                <p className="text-[9px] sm:text-[10px] text-blue-200 mt-0.5">1인당 지출 (2024)</p>
              </div>
              <div className="px-3 sm:px-5 py-2 sm:py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-emerald-400/30">
                <p className="text-xl sm:text-2xl font-bold text-emerald-300">{behavior2024?.satisfaction ?? 96.5}%</p>
                <p className="text-[9px] sm:text-[10px] text-emerald-200 mt-0.5">종합 만족도 (2024)</p>
              </div>
              <div className="px-3 sm:px-5 py-2 sm:py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-emerald-400/30">
                <p className="text-xl sm:text-2xl font-bold text-emerald-300">{behavior2024?.revisitIntention ?? 92.3}%</p>
                <p className="text-[9px] sm:text-[10px] text-emerald-200 mt-0.5">재방문 의향 (2024)</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-20 sm:space-y-24">

        {/* ═══ 섹션 1: 수익성 지표 ═══ */}
        <section>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 rounded-full bg-emerald-500" />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                수익성 지표
              </h2>
            </div>
            <p className="text-sm text-zinc-500 ml-4 break-keep">
              방한여행 행태 및 만족도 조사 (2015~2024) 10개년 추이 분석
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            <MetricCard
              title="1인당 지출 (Per-guest Yield)"
              subtitle="2024년 기준"
              value={`$${behavior2024?.avgSpending?.toLocaleString() ?? "1,877"}`}
              description="2019년 $1,239 저점 대비 코로나 이전 수준 회복"
              icon="DollarSign"
              highlight={true}
            />
            <MetricCard
              title="종합 만족도 (Satisfaction)"
              subtitle="2015년 93.5% → 2024년"
              value={`${behavior2024?.satisfaction ?? 96.5}%`}
              description="10년간 +3.0%p 실질 개선"
              icon="ThumbsUp"
              highlight={true}
              trend={{
                value: "3.0%p (93.5% → 96.5%)",
                positive: true,
              }}
            />
            <MetricCard
              title="재방문 의향 (Revisit Intent)"
              subtitle="2015년 85.6% → 2024년"
              value={`${behavior2024?.revisitIntention ?? 92.3}%`}
              description="10년간 +6.7%p — 가장 큰 개선 폭"
              icon="UserCheck"
              highlight={true}
              trend={{
                value: "6.7%p (85.6% → 92.3%)",
                positive: true,
              }}
            />
            <MetricCard
              title="평균 체류 기간 (Avg. Stay)"
              subtitle="2024년 기준"
              value={`${behavior2024?.stayDuration ?? 6.7}일`}
              description="2015년 6.6일 대비 안정적 유지"
              icon="CalendarClock"
            />
          </div>

          <SpendingTrendChart data={spendingTrendData} />
        </section>

        {/* ═══ 섹션 2: 방문객 세그먼트 분석 ═══ */}
        <section>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 rounded-full bg-blue-500" />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                방문객 세그먼트 분석
              </h2>
            </div>
            <p className="text-sm text-zinc-500 ml-4 break-keep">
              2025년 연간 국적별 · 연령별 · 성별 방문객 구성 데이터
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
            <ContinentChart data={continentChartData} />
            <NationalityChart data={nationalityChartData} />
            <AgeChart data={ageChartData} />
          </div>

          <GenderAgeChart
            data={genderAgeChartData}
            topSegment={topSegment?.label ?? "21~30세 여성"}
            topSegmentPercent={topSegment?.percent ?? 19.1}
            femalePercent={femalePercent}
            malePercent={100 - femalePercent}
          />
        </section>

        {/* ═══ 섹션 3: 인바운드 시장 성장 추이 ═══ */}
        <section>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 rounded-full bg-teal-500" />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                인바운드 시장 성장 추이
              </h2>
            </div>
            <p className="text-sm text-zinc-500 ml-4 break-keep">
              2025년 연간 방문객 수, 관심도 추이, 입국 경로, 계절성 데이터
            </p>
          </div>

          {/* 핵심 수치 카드 */}
          <div className={`grid grid-cols-1 ${hasYoyData ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4 sm:gap-6 mb-10`}>
            <MetricCard
              title="연간 방문객 수 (Annual Visitors)"
              subtitle="2025년 누적"
              value={totalVisitorsFormatted + "명"}
              icon="UserCheck"
            />
            {hasYoyData && yoyGrowth && (
              <MetricCard
                title="전년 대비 성장률 (YoY Growth)"
                subtitle="2025년 연간 (vs 2024)"
                value={`${yoyPositive ? "▲" : "▼"} ${yoyGrowth}%`}
                description={`${(prevYearVisitors / 10000).toFixed(0)}만 → ${totalVisitorsFormatted}명`}
                icon="DollarSign"
                highlight={true}
              />
            )}
            <MetricCard
              title="여성 방문객 비중 (Female Ratio)"
              subtitle="2025년 연간"
              value={`${femalePercent.toFixed(1)}%`}
              description={`21~30세 여성이 ${topSegment?.percent ?? 19.1}%로 최대 세그먼트`}
              icon="UserCheck"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-10">
            {airportData.length > 0 && (
              <AirportDistributionChart data={airportData} />
            )}
            <SeasonalityRiskChart data={interestChartData} />
          </div>
        </section>


        {/* ━━━ 하단 출처 ━━━ */}
        <footer className="pt-10 pb-6 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600">
            출처: 한국관광 데이터랩 통계 기반 분석
          </p>
        </footer>
      </div>
    </div>
  );
}
