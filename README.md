# Rural Rest Stats Dashboard

한국 관광 통계로 검증된 Rural Rest의 RWA 가치와 투자 기회를 시각화하는 대시보드입니다.

## 🎯 주요 기능

### 1. 핵심 RWA 지표
- **1인당 평균 지출액**: $1,712 (2015년 기준)
- **평균 체류 기간**: 6.6일
- **높은 만족도와 재방문 의향**: 96.5% / 92.3%

### 2. 타겟 시장 분석
- **대륙별 분포**: 아시아권 80.5% 집중
- **연령별 분포**: MZ세대(20-40대) 핵심 타겟

### 3. 전략적 인사이트
- RWA 가치 증명 데이터
- 타겟 고객 실체 확인
- 데이터 기반 마케팅 우선순위

## 🚀 시작하기

### 1. 필수 요구사항
- Node.js 20 이상
- Turso 계정 (무료 플랜 가능)

### 2. Turso 데이터베이스 설정

```bash
# Turso CLI 설치 (Windows)
scoop install turso

# 또는 PowerShell에서
iwr https://get.turso.tech/install.ps1 -useb | iex

# 로그인
turso auth login

# 데이터베이스 생성
turso db create rural-rest-db

# 연결 URL과 토큰 생성
turso db show rural-rest-db --url
turso db tokens create rural-rest-db
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 아래 내용을 입력하세요:

```env
TURSO_CONNECTION_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

### 4. 의존성 설치

```bash
npm install
```

### 5. 데이터베이스 스키마 푸시

```bash
npm run db:push
```

### 6. 데이터 시딩

```bash
npm run db:seed
```

이 명령은 다음 CSV 파일들을 읽어서 데이터베이스에 삽입합니다:
- `data/20260213173604_1인당 관광수입.csv`
- `data/20260213173604_방한여행 행태 및 만족도 평가.csv`
- `data/20260213173604_방한여행 요약(대륙별).csv`
- `data/20260213173821_방한 외래관광객 연령별.csv`

### 7. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어서 대시보드를 확인하세요.

## 📊 데이터 출처

- 한국관광공사 관광지식정보시스템 (2015-2025)
- 방한 외래관광객 통계
- 관광객 행태 및 만족도 조사

## 🛠️ 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **데이터베이스**: Turso (libSQL)
- **ORM**: Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS
- **차트**: Recharts
- **타입스크립트**: TypeScript 5

## 📁 프로젝트 구조

```
rural-rest-stats/
├── src/
│   ├── app/
│   │   ├── db/           # 데이터베이스 연결
│   │   ├── page.tsx      # 메인 대시보드
│   │   └── layout.tsx    # 레이아웃
│   ├── components/       # UI 컴포넌트
│   │   ├── ui/           # shadcn/ui 컴포넌트
│   │   ├── metric-card.tsx
│   │   ├── insight-card.tsx
│   │   ├── continent-chart.tsx
│   │   └── age-chart.tsx
│   ├── db/
│   │   └── schema.ts     # DB 스키마
│   └── lib/
│       └── utils.ts      # 유틸리티
├── scripts/
│   └── seed.ts           # 데이터 시딩 스크립트
├── data/                 # CSV 데이터 파일
└── drizzle.config.ts     # Drizzle 설정
```

## 🎨 대시보드 구성

### 1. Hero Section
- 프로젝트 타이틀과 메인 메시지

### 2. 핵심 RWA 지표 (Metric Cards)
- 1인당 평균 지출액 ($1,712)
- 평균 체류 기간 (6.6일)
- 만족도 (96.5%)
- 재방문 의향 (92.3%)

### 3. 차트
- **대륙별 관광객 분포** (Pie Chart)
  - 아시아권 80.5% 강조
- **연령별 관광객 분포** (Bar Chart)
  - MZ세대 집중 시각화

### 4. 전략적 인사이트 (Insight Cards)
- RWA 가치 증명
- 타겟 실체 확인
- 마케팅 우선순위 제시

## 📝 주요 인사이트

### RWA 가치
- 높은 1인당 지출액 ($1,712)과 긴 체류 기간(6.6일)은 안정적인 수익 창출 가능
- 높은 만족도(96.5%)와 재방문 의향(92.3%)은 지속 가능한 비즈니스 모델 증명

### 타겟 실체
- 아시아권 80.5%: 명확한 타겟 시장 존재
- MZ세대(20-40대) 집중: 'Real Local' 경험 수요층과 완벽히 부합

### 마케팅 우선순위
- 한국어학과 타겟팅: 아시아권 대학 MOU 체결 전략 유효
- 자매결연 도시 협력: 지자체 예산 활용 가능한 즉시 실행 채널

## 🔗 관련 문서

- [12_PITCH_DECK_v2.md](./12_PITCH_DECK_v2.md): Rural Rest 피치덱
- [13_GUEST_ACQUISITION_CHANNELS.md](./13_GUEST_ACQUISITION_CHANNELS.md): 투숙객 유치 전략

## 📧 문의

투자 문의 및 데이터 관련 질문은 이슈를 남겨주세요.

---

**Built with ❤️ for Rural Rest Investors**
