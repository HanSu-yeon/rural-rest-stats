import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 1인당 관광수입 월별 (핵심 지표: $1,712 평균 지출액)
export const touristSpending = sqliteTable("tourist_spending", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  yearMonth: text("year_month").notNull(),
  spendingPerPerson: real("spending_per_person").notNull(), // 달러
});

// 관광수입 총액 월별
export const touristRevenue = sqliteTable("tourist_revenue", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  yearMonth: text("year_month").notNull(),
  revenueMillionUsd: real("revenue_million_usd").notNull(), // 백만달러
});

// 방한여행 행태 및 만족도 연도별 (핵심 지표: 6.6일 평균 체류)
export const touristBehavior = sqliteTable("tourist_behavior", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  year: integer("year").notNull().unique(),
  revisitRate: real("revisit_rate"), // 재방문율 %
  stayDuration: real("stay_duration").notNull(), // 체재 기간(일) - 핵심지표
  avgSpending: real("avg_spending").notNull(), // 1인 평균 지출 경비 (USS) - 핵심지표
  dailySpending: real("daily_spending"), // 1일 평균 지출 경비 (USS)
  satisfaction: real("satisfaction"), // 전반적 만족도 (긍정 응답 비율)
  revisitIntention: real("revisit_intention"), // 관광목적 재방문 의향 (긍정 응답 비율)
  recommendationIntention: real("recommendation_intention"), // 타인 추천 의향 (긍정 응답 비율)
});

// 대륙별 방한관광객 (핵심 지표: 아시아권 80.5%)
export const touristByContinent = sqliteTable("tourist_by_continent", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  continent: text("continent").notNull().unique(),
  touristCount: real("tourist_count").notNull(),
  percentage: real("percentage").notNull(),
});

// 국가별 방한관광객 (글로벌 데이터)
export const touristByCountry = sqliteTable("tourist_by_country", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  country: text("country").notNull().unique(),
  touristCount: real("tourist_count").notNull(),
  previousYearCount: real("previous_year_count"),
  growthRate: real("growth_rate"),
  percentage: real("percentage"),
  rank: integer("rank"),
});

// 국적별 방한관광객 요약 (top 5)
export const touristByNationality = sqliteTable("tourist_by_nationality", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nationality: text("nationality").notNull().unique(),
  touristCount: real("tourist_count").notNull(),
});

// 방한 외래관광객 월별 추이
export const touristTrend = sqliteTable("tourist_trend", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  yearMonth: text("year_month").notNull().unique(),
  touristCount: real("tourist_count").notNull(),
  exchangeRate: real("exchange_rate"), // 원/미국달러
  oilPrice: real("oil_price"), // 달러/배럴
});

// 연령별 관광객 (상세 데이터)
export const touristByAge = sqliteTable("tourist_by_age", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  yearMonth: text("year_month").notNull(),
  continent: text("continent"),
  country: text("country"),
  ageGroup: text("age_group").notNull(),
  count: real("count").notNull(),
  previousYearCount: real("previous_year_count"),
  growthRate: real("growth_rate"),
});

// 성별 관광객 (상세 데이터)
export const touristByGender = sqliteTable("tourist_by_gender", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  yearMonth: text("year_month").notNull(),
  continent: text("continent"),
  country: text("country"),
  gender: text("gender").notNull(), // 남성, 여성, 승무원
  count: real("count").notNull(),
  previousYearCount: real("previous_year_count"),
  growthRate: real("growth_rate"),
});

// 성·연령별 관광객 특성
export const touristByGenderAge = sqliteTable("tourist_by_gender_age", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ageGroup: text("age_group").notNull().unique(),
  maleCount: real("male_count").notNull(),
  femaleCount: real("female_count").notNull(),
  malePercentage: real("male_percentage"),
  femalePercentage: real("female_percentage"),
});

// 목적별 관광객 (상세 데이터)
export const touristByPurpose = sqliteTable("tourist_by_purpose", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  yearMonth: text("year_month").notNull(),
  continent: text("continent"),
  country: text("country"),
  purpose: text("purpose").notNull(), // 관광, 상용, 공용, 유학연수, 기타
  count: real("count").notNull(),
  previousYearCount: real("previous_year_count"),
  growthRate: real("growth_rate"),
});

// 목적별 관광객 요약
export const touristByPurposeSummary = sqliteTable("tourist_by_purpose_summary", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  purpose: text("purpose").notNull().unique(),
  touristCount: real("tourist_count").notNull(),
  percentage: real("percentage"),
});

// 교통수단별 관광객 (월별)
export const touristByTransport = sqliteTable("tourist_by_transport", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  yearMonth: text("year_month").notNull(),
  incheonAirport: real("incheon_airport"),
  gimhaeAirport: real("gimhae_airport"),
  gimpoAirport: real("gimpo_airport"),
  jejuAirport: real("jeju_airport"),
  otherAirports: real("other_airports"),
  busanPort: real("busan_port"),
  incheonPort: real("incheon_port"),
  jejuPort: real("jeju_port"),
  otherPorts: real("other_ports"),
  exchangeRate: real("exchange_rate"),
  oilPrice: real("oil_price"),
});

// 교통수단별 관광객 요약
export const touristByTransportSummary = sqliteTable("tourist_by_transport_summary", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  transport: text("transport").notNull().unique(),
  touristCount: real("tourist_count").notNull(),
  percentage: real("percentage"),
});

// 방한여행 이미지
export const koreaImage = sqliteTable("korea_image", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  year: integer("year").notNull(),
  category: text("category").notNull(), // 한국 국가 이미지, 관광목적지로서 한국 인지도, 관광목적지로서 한국 선호도
  value: real("value").notNull(),
});

// 한국여행 경험 및 의향
export const koreaVisitIntention = sqliteTable("korea_visit_intention", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  year: integer("year").notNull(),
  category: text("category").notNull(), // 전 생애 한국여행 경험, 향후 3년 내 한국방문 예상시기, 향후 3년 내 한국여행 의향
  value: text("value").notNull(),
});

// 방한여행 관심도 추이
export const koreaInterestTrend = sqliteTable("korea_interest_trend", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  yearMonth: text("year_month").notNull().unique(),
  interestPercentage: real("interest_percentage").notNull(),
});

// 데이터 기반 인사이트 (자동 생성된 전략적 인사이트)
export const strategicInsights = sqliteTable("strategic_insights", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(), // 'rwa_value', 'target_reality', 'marketing_priority'
  title: text("title").notNull(),
  description: text("description").notNull(),
  dataSource: text("data_source"),
  priority: integer("priority").default(1),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});
