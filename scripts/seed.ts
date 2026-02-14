import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import csvParser from "csv-parser";
import { db } from "../src/app/db";
import {
  touristSpending,
  touristRevenue,
  touristBehavior,
  touristByContinent,
  touristByCountry,
  touristByNationality,
  touristTrend,
  touristByAge,
  touristByGender,
  touristByGenderAge,
  touristByPurpose,
  touristByPurposeSummary,
  touristByTransport,
  touristByTransportSummary,
  koreaImage,
  koreaVisitIntention,
  koreaInterestTrend,
  strategicInsights,
} from "../src/db/schema";

// BOM 제거 헬퍼 (CSV 첫 번째 컬럼 키에 \uFEFF가 붙는 문제 해결)
function stripBomFromKeys(obj: Record<string, string>): Record<string, string> {
  const cleaned: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    cleaned[key.replace(/^\uFEFF/, "")] = obj[key];
  }
  return cleaned;
}

// CSV 파일을 읽고 파싱하는 헬퍼 함수
async function readCSV<T>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data: Record<string, string>) =>
        results.push(stripBomFromKeys(data) as T)
      )
      .on("end", () => resolve(results))
      .on("error", (error: Error) => reject(error));
  });
}

// 숫자 파싱 헬퍼 (과학적 표기법 및 일반 숫자 처리)
function parseNumber(value: string | number): number {
  if (typeof value === "number") return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

// 1. 1인당 관광수입 데이터 시드
async function seedTouristSpending() {
  console.log("🌱 1인당 관광수입 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_1인당 관광수입.csv"
  );
  const rows = await readCSV<{
    기준연월: string;
    "1인당 관광수입(달러)": string;
  }>(filePath);

  const data = rows.map((row) => ({
    yearMonth: row["기준연월"],
    spendingPerPerson: parseNumber(row["1인당 관광수입(달러)"]),
  }));

  await db.insert(touristSpending).values(data);
  console.log(`✅ ${data.length}개의 1인당 관광수입 데이터 시딩 완료`);
}

// 2. 관광수입 총액 데이터 시드
async function seedTouristRevenue() {
  console.log("🌱 관광수입 총액 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_관광수입 .csv"
  );
  const rows = await readCSV<{
    기준연월: string;
    "관광수입(백만달러)": string;
  }>(filePath);

  const data = rows.map((row) => ({
    yearMonth: row["기준연월"],
    revenueMillionUsd: parseNumber(row["관광수입(백만달러)"]),
  }));

  await db.insert(touristRevenue).values(data);
  console.log(`✅ ${data.length}개의 관광수입 총액 데이터 시딩 완료`);
}

// 3. 방한여행 행태 및 만족도 데이터 시드 (핵심: $1,712 지출액, 6.6일 체류)
async function seedTouristBehavior() {
  console.log("🌱 방한여행 행태 및 만족도 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_방한여행 행태 및 만족도 평가.csv"
  );
  const rows = await readCSV<{
    기준년도: string;
    "재방문율(%)": string;
    "체재 기간(일)": string;
    "1인 평균 지출 경비(USS)": string;
    "1일 평균 지출 경비(USS)": string;
    "전반적 만족도(긍정 응답 비율)": string;
    "관광목적 재방문 의향(긍정 응답 비율)": string;
    "타인 추천 의향(긍정 응답 비율)": string;
  }>(filePath);

  const data = rows.map((row) => ({
    year: parseInt(row["기준년도"]),
    revisitRate: parseNumber(row["재방문율(%)"]) || null,
    stayDuration: parseNumber(row["체재 기간(일)"].trim()), // 핵심 지표: 6.6일 (2015년)
    avgSpending: parseNumber(row["1인 평균 지출 경비(USS)"]), // 핵심 지표: $1,712.5 (2015년)
    dailySpending: parseNumber(row["1일 평균 지출 경비(USS)"]) || null,
    satisfaction:
      parseNumber(row["전반적 만족도(긍정 응답 비율)"]) || null,
    revisitIntention:
      parseNumber(row["관광목적 재방문 의향(긍정 응답 비율)"]) || null,
    recommendationIntention:
      parseNumber(row["타인 추천 의향(긍정 응답 비율)"]) || null,
  }));

  await db.insert(touristBehavior).values(data);
  console.log(`✅ ${data.length}개의 방한여행 행태 데이터 시딩 완료`);
  console.log("📊 핵심 지표 확인: 2015년 1인당 지출액 $1,712.5, 체류일 6.6일");
}

// 4. 대륙별 방한관광객 데이터 시드
async function seedTouristByContinent() {
  console.log("🌱 대륙별 방한관광객 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_방한여행 요약(대륙별).csv"
  );
  const rows = await readCSV<{
    대륙: string;
    방한관광객: string;
    "방한관광객 비율": string;
  }>(filePath);

  const data = rows.map((row) => ({
    continent: row["대륙"],
    touristCount: parseNumber(row["방한관광객"]),
    percentage: parseNumber(row["방한관광객 비율"]),
  }));

  await db.insert(touristByContinent).values(data);
  console.log(`✅ ${data.length}개의 대륙별 관광객 데이터 시딩 완료`);
}

// 5. 국가별 방한관광객 데이터 시드
async function seedTouristByCountry() {
  console.log("🌱 국가별 방한관광객 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_글로벌 방한관광객.csv"
  );
  const rows = await readCSV<{
    국가: string;
    "방한 외래관광객": string;
    "전년동기 관광객": string;
    "전년대비 증감률": string;
    구성비: string;
    순위: string;
  }>(filePath);

  const data = rows.map((row) => ({
    country: row["국가"],
    touristCount: parseNumber(row["방한 외래관광객"]),
    previousYearCount: parseNumber(row["전년동기 관광객"]) || null,
    growthRate: parseNumber(row["전년대비 증감률"]) || null,
    percentage: parseNumber(row["구성비"]) || null,
    rank: parseInt(row["순위"]) || null,
  }));

  await db.insert(touristByCountry).values(data);
  console.log(`✅ ${data.length}개의 국가별 관광객 데이터 시딩 완료 (총계 행 포함)`);
}

// 6. 국적별 방한관광객 요약 (Top 5)
async function seedTouristByNationality() {
  console.log("🌱 국적별 방한관광객 요약 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_방한여행 요약(국적별).csv"
  );
  const rows = await readCSV<{
    국적: string;
    방한관광객: string;
  }>(filePath);

  const data = rows.map((row) => ({
    nationality: row["국적"],
    touristCount: parseNumber(row["방한관광객"]),
  }));

  await db.insert(touristByNationality).values(data);
  console.log(`✅ ${data.length}개의 국적별 관광객 요약 데이터 시딩 완료`);
}

// 7. 방한 외래관광객 월별 추이
async function seedTouristTrend() {
  console.log("🌱 방한 외래관광객 월별 추이 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_방한 외래관광객 추이.csv"
  );
  const rows = await readCSV<{
    기준년월: string;
    "방한 외래관광객": string;
    "환율(원)": string;
    "국제유가(달러)": string;
  }>(filePath);

  const data = rows.map((row) => ({
    yearMonth: row["기준년월"],
    touristCount: parseNumber(row["방한 외래관광객"]),
    exchangeRate: parseNumber(row["환율(원)"]) || null,
    oilPrice: parseNumber(row["국제유가(달러)"]) || null,
  }));

  await db.insert(touristTrend).values(data);
  console.log(`✅ ${data.length}개의 월별 추이 데이터 시딩 완료`);
}

// 8. 연령별 관광객 데이터 시드 (샘플 - 202501만)
async function seedTouristByAge() {
  console.log("🌱 연령별 관광객 데이터 시딩 중 (202501 샘플)...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173821_방한 외래관광객 연령별.csv"
  );
  const rows = await readCSV<{
    기준일자: string;
    주요국가대륙명: string;
    국가명: string;
    연령: string;
    인원: string;
    전년동기: string;
    증감률: string;
  }>(filePath);

  // 202501 데이터만 시딩 (데이터가 너무 많으므로)
  const filteredRows = rows.filter((row) => row["기준일자"] === "202501");

  const data = filteredRows.map((row) => ({
    yearMonth: row["기준일자"],
    continent:
      row["주요국가대륙명"] === "대륙전체" ? null : row["주요국가대륙명"],
    country:
      row["국가명"] === "연도" || row["국가명"] === "연도대륙"
        ? null
        : row["국가명"],
    ageGroup: row["연령"],
    count: parseNumber(row["인원"]),
    previousYearCount: parseNumber(row["전년동기"]) || null,
    growthRate: parseNumber(row["증감률"]) || null,
  }));

  await db.insert(touristByAge).values(data);
  console.log(`✅ ${data.length}개의 연령별 관광객 데이터 시딩 완료`);
}

// 9. 성별 관광객 데이터 시드 (샘플 - 202501만)
async function seedTouristByGender() {
  console.log("🌱 성별 관광객 데이터 시딩 중 (202501 샘플)...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173645_방한 외래관광객 성별.csv"
  );
  const rows = await readCSV<{
    기준일자: string;
    주요국가대륙명: string;
    국가명: string;
    성별: string;
    인원: string;
    전년동기: string;
    증감률: string;
  }>(filePath);

  // 202501 데이터만 시딩
  const filteredRows = rows.filter((row) => row["기준일자"] === "202501");

  const data = filteredRows.map((row) => ({
    yearMonth: row["기준일자"],
    continent:
      row["주요국가대륙명"] === "대륙전체" ? null : row["주요국가대륙명"],
    country:
      row["국가명"] === "연도" || row["국가명"] === "연도대륙"
        ? null
        : row["국가명"],
    gender: row["성별"],
    count: parseNumber(row["인원"]),
    previousYearCount: parseNumber(row["전년동기"]) || null,
    growthRate: parseNumber(row["증감률"]) || null,
  }));

  await db.insert(touristByGender).values(data);
  console.log(`✅ ${data.length}개의 성별 관광객 데이터 시딩 완료`);
}

// 10. 성·연령별 관광객 특성
async function seedTouristByGenderAge() {
  console.log("🌱 성·연령별 관광객 특성 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_방한 외래관광객 특성(성·연령별).csv"
  );
  const rows = await readCSV<{
    연령대: string;
    남성: string;
    여성: string;
    "남성(비율)": string;
    "여성(비율)": string;
  }>(filePath);

  const data = rows.map((row) => ({
    ageGroup: row["연령대"],
    maleCount: parseNumber(row["남성"]),
    femaleCount: parseNumber(row["여성"]),
    malePercentage: parseNumber(row["남성(비율)"]) || null,
    femalePercentage: parseNumber(row["여성(비율)"]) || null,
  }));

  await db.insert(touristByGenderAge).values(data);
  console.log(`✅ ${data.length}개의 성·연령별 특성 데이터 시딩 완료`);
}

// 11. 목적별 관광객 데이터 시드 (샘플 - 202501만)
async function seedTouristByPurpose() {
  console.log("🌱 목적별 관광객 데이터 시딩 중 (202501 샘플)...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173836_방한 외래관광객 목적별.csv"
  );
  const rows = await readCSV<{
    기준일자: string;
    주요국가대륙명: string;
    국가명: string;
    목적구분: string;
    인원: string;
    전년동기: string;
    증감률: string;
  }>(filePath);

  // 202501 데이터만 시딩
  const filteredRows = rows.filter((row) => row["기준일자"] === "202501");

  const data = filteredRows.map((row) => ({
    yearMonth: row["기준일자"],
    continent:
      row["주요국가대륙명"] === "대륙전체" ? null : row["주요국가대륙명"],
    country:
      row["국가명"] === "연도" || row["국가명"] === "연도대륙"
        ? null
        : row["국가명"],
    purpose: row["목적구분"],
    count: parseNumber(row["인원"]),
    previousYearCount: parseNumber(row["전년동기"]) || null,
    growthRate: parseNumber(row["증감률"]) || null,
  }));

  await db.insert(touristByPurpose).values(data);
  console.log(`✅ ${data.length}개의 목적별 관광객 데이터 시딩 완료`);
}

// 12. 목적별 관광객 요약
async function seedTouristByPurposeSummary() {
  console.log("🌱 목적별 관광객 요약 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_방한 외래관광객 특성(목적별).csv"
  );
  const rows = await readCSV<{
    목적: string;
    "방한 외래관광객": string;
    "방한 외래관광객(비율)": string;
  }>(filePath);

  const data = rows.map((row) => ({
    purpose: row["목적"],
    touristCount: parseNumber(row["방한 외래관광객"]),
    percentage: parseNumber(row["방한 외래관광객(비율)"]) || null,
  }));

  await db.insert(touristByPurposeSummary).values(data);
  console.log(`✅ ${data.length}개의 목적별 요약 데이터 시딩 완료`);
}

// 13. 교통수단별 관광객 월별
async function seedTouristByTransport() {
  console.log("🌱 교통수단별 관광객 월별 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213180601_방한 외래관광객 교통수단별.csv"
  );
  const rows = await readCSV<{
    기준년월: string;
    인천공항: string;
    김해공항: string;
    김포공항: string;
    제주공항: string;
    기타공항: string;
    부산항구: string;
    인천항구: string;
    제주항구: string;
    기타항구: string;
    환율: string;
    두바이유: string;
  }>(filePath);

  const data = rows.map((row) => ({
    yearMonth: row["기준년월"],
    incheonAirport: parseNumber(row["인천공항"]) || null,
    gimhaeAirport: parseNumber(row["김해공항"]) || null,
    gimpoAirport: parseNumber(row["김포공항"]) || null,
    jejuAirport: parseNumber(row["제주공항"]) || null,
    otherAirports: parseNumber(row["기타공항"]) || null,
    busanPort: parseNumber(row["부산항구"]) || null,
    incheonPort: parseNumber(row["인천항구"]) || null,
    jejuPort: parseNumber(row["제주항구"]) || null,
    otherPorts: parseNumber(row["기타항구"]) || null,
    exchangeRate: parseNumber(row["환율"]) || null,
    oilPrice: parseNumber(row["두바이유"]) || null,
  }));

  await db.insert(touristByTransport).values(data);
  console.log(`✅ ${data.length}개의 교통수단별 월별 데이터 시딩 완료`);
}

// 14. 교통수단별 관광객 요약
async function seedTouristByTransportSummary() {
  console.log("🌱 교통수단별 관광객 요약 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_방한 외래관광객 특성(교통수단별).csv"
  );
  const rows = await readCSV<{
    교통수단: string;
    "방한 외래관광객(명)": string;
    "비중(%)": string;
  }>(filePath);

  const data = rows.map((row) => ({
    transport: row["교통수단"],
    touristCount: parseNumber(row["방한 외래관광객(명)"]),
    percentage: parseNumber(row["비중(%)"]) || null,
  }));

  await db.insert(touristByTransportSummary).values(data);
  console.log(`✅ ${data.length}개의 교통수단별 요약 데이터 시딩 완료`);
}

// 15. 방한 여행 이미지
async function seedKoreaImage() {
  console.log("🌱 방한 여행 이미지 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_방한 여행 이미지.csv"
  );
  const rows = await readCSV<{
    기준연도: string;
    구분: string;
    값: string;
  }>(filePath);

  const data = rows.map((row) => ({
    year: parseInt(row["기준연도"]),
    category: row["구분"],
    value: parseNumber(row["값"]),
  }));

  await db.insert(koreaImage).values(data);
  console.log(`✅ ${data.length}개의 방한 여행 이미지 데이터 시딩 완료`);
}

// 16. 한국여행 경험 및 의향
async function seedKoreaVisitIntention() {
  console.log("🌱 한국여행 경험 및 의향 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_한국여행 경험 및 의향.csv"
  );
  const rows = await readCSV<{
    기준연도: string;
    구분: string;
    "값(%)": string;
  }>(filePath);

  const data = rows.map((row) => ({
    year: parseInt(row["기준연도"]),
    category: row["구분"],
    value: row["값(%)"],
  }));

  await db.insert(koreaVisitIntention).values(data);
  console.log(`✅ ${data.length}개의 한국여행 경험 및 의향 데이터 시딩 완료`);
}

// 17. 방한여행 관심도 추이
async function seedKoreaInterestTrend() {
  console.log("🌱 방한여행 관심도 추이 데이터 시딩 중...");
  const filePath = path.join(
    __dirname,
    "../data/20260213173604_방한여행 관심도 추이.csv"
  );
  const rows = await readCSV<{
    기준연월: string;
    "값(%)": string;
  }>(filePath);

  const data = rows.map((row) => ({
    yearMonth: row["기준연월"],
    interestPercentage: parseNumber(row["값(%)"]),
  }));

  await db.insert(koreaInterestTrend).values(data);
  console.log(`✅ ${data.length}개의 방한여행 관심도 추이 데이터 시딩 완료`);
}

// 18. 전략적 인사이트 시드 (데이터 기반)
async function seedStrategicInsights() {
  console.log("🌱 전략적 인사이트 데이터 시딩 중...");

  const insights = [
    {
      category: "rwa_value",
      title: "아시아권 관광객 집중도 80.5%",
      description:
        "전체 방한 외래관광객의 80.5%가 아시아 대륙 출신으로, 농촌 관광 마케팅은 아시아 시장을 최우선으로 집중해야 합니다.",
      dataSource: "tourist_by_continent",
      priority: 1,
    },
    {
      category: "rwa_value",
      title: "1인당 평균 지출액 $1,712 (6.6일 체류)",
      description:
        "2015년 기준 방한 관광객은 평균 $1,712를 지출하고 6.6일 체류합니다. 농촌 체험 상품 가격 책정 시 이 지표를 참고해야 합니다.",
      dataSource: "tourist_behavior",
      priority: 1,
    },
    {
      category: "target_reality",
      title:
        "Top 5 국가: 중국(549만), 일본(365만), 대만(189만), 미국(148만), 홍콩(62만)",
      description:
        "상위 5개 국가가 전체 방한객의 대부분을 차지합니다. 농촌 관광 콘텐츠는 이들 국가의 언어와 문화적 특성을 반영해야 합니다.",
      dataSource: "tourist_by_nationality",
      priority: 2,
    },
    {
      category: "target_reality",
      title: "관광 목적 방문객 83.5% (1,582만명)",
      description:
        "방한객의 83.5%가 관광 목적으로 입국합니다. 농촌 관광은 이들을 타겟으로 한 레저 및 체험 콘텐츠 개발이 필수입니다.",
      dataSource: "tourist_by_purpose_summary",
      priority: 2,
    },
    {
      category: "marketing_priority",
      title: "인천공항 입국 비중 65.4%",
      description:
        "전체 관광객의 65.4%가 인천공항을 통해 입국합니다. 공항에서 농촌 관광지로의 교통 연계성 강화가 필요합니다.",
      dataSource: "tourist_by_transport_summary",
      priority: 3,
    },
    {
      category: "marketing_priority",
      title: "MZ세대(21~40세) 높은 비중",
      description:
        "21~30세와 31~40세 연령층이 전체 관광객의 상당 부분을 차지합니다. SNS 마케팅과 인스타그래머블 콘텐츠 개발이 효과적입니다.",
      dataSource: "tourist_by_gender_age",
      priority: 3,
    },
    {
      category: "rwa_value",
      title: "여성 관광객 비중 우세",
      description:
        "성별 분석 결과, 여성 관광객 비중이 남성보다 높습니다. 여성 친화적 시설 및 안전 요소를 강조해야 합니다.",
      dataSource: "tourist_by_gender_age",
      priority: 2,
    },
    {
      category: "marketing_priority",
      title: "관광 만족도 93.5%, 재방문 의향 85.6%",
      description:
        "방한 관광객의 전반적 만족도는 93.5%로 매우 높으며, 85.6%가 재방문 의향을 보입니다. 충성 고객 확보 전략이 유효합니다.",
      dataSource: "tourist_behavior",
      priority: 2,
    },
  ];

  await db.insert(strategicInsights).values(insights);
  console.log(`✅ ${insights.length}개의 전략적 인사이트 데이터 시딩 완료`);
}

// 메인 시드 함수
async function main() {
  console.log("🚀 Turso DB 데이터 마이그레이션 시작...\n");

  try {
    await seedTouristSpending(); // 1인당 관광수입
    await seedTouristRevenue(); // 관광수입 총액
    await seedTouristBehavior(); // 방한여행 행태 (핵심: $1,712, 6.6일)
    await seedTouristByContinent(); // 대륙별 관광객
    await seedTouristByCountry(); // 국가별 관광객
    await seedTouristByNationality(); // 국적별 요약
    await seedTouristTrend(); // 월별 추이
    await seedTouristByAge(); // 연령별 (202501)
    await seedTouristByGender(); // 성별 (202501)
    await seedTouristByGenderAge(); // 성·연령별 특성
    await seedTouristByPurpose(); // 목적별 (202501)
    await seedTouristByPurposeSummary(); // 목적별 요약
    await seedTouristByTransport(); // 교통수단별 월별
    await seedTouristByTransportSummary(); // 교통수단별 요약
    await seedKoreaImage(); // 방한 여행 이미지
    await seedKoreaVisitIntention(); // 한국여행 경험 및 의향
    await seedKoreaInterestTrend(); // 방한여행 관심도 추이
    await seedStrategicInsights(); // 전략적 인사이트

    console.log("\n✨ 모든 데이터 마이그레이션 완료!");
    console.log("📊 핵심 지표 확인:");
    console.log("   - 1인당 평균 지출액: $1,712 (2015년)");
    console.log("   - 평균 체류일: 6.6일 (2015년)");
    console.log("   - 아시아권 비중: 80.5%");
  } catch (error) {
    console.error("❌ 시딩 중 오류 발생:", error);
    process.exit(1);
  }
}

main();
