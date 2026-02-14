import "dotenv/config";
import { db } from "../src/app/db";
import { touristByCountry } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  // 이미 총계 행이 있는지 확인
  const existing = await db
    .select()
    .from(touristByCountry)
    .where(eq(touristByCountry.country, "총계"));

  if (existing.length > 0) {
    console.log("⚠️ 총계 행이 이미 존재합니다:", existing[0]);
    return;
  }

  // CSV 원본 데이터: 총계,1.8938339E7,1.6371455E7,15.7,0.0,0
  await db.insert(touristByCountry).values({
    country: "총계",
    touristCount: 18938339,
    previousYearCount: 16371455,
    growthRate: 15.7,
    percentage: 0,
    rank: 0,
  });

  console.log("✅ 총계 행 추가 완료!");
  console.log("   - 2025년 방문객: 18,938,339명 (약 1,894만)");
  console.log("   - 2024년 방문객: 16,371,455명 (약 1,637만)");
  console.log("   - 전년 대비 성장률: +15.7%");
}

main().catch(console.error);
