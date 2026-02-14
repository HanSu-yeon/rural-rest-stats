# Turso 데이터베이스 설정 가이드

## 1. Turso CLI 설치 (이미 설치되어 있으면 스킵)

### Windows (PowerShell)
```powershell
iwr https://get.turso.tech/install.ps1 -useb | iex
```

또는 Scoop 사용:
```bash
scoop install turso
```

## 2. 기존 데이터베이스 확인 및 토큰 갱신

```bash
# Turso에 로그인
turso auth login

# 데이터베이스 목록 확인
turso db list

# rural-rest-db가 이미 있다면 토큰만 새로 생성
turso db tokens create rural-rest-db

# 연결 URL 확인
turso db show rural-rest-db --url
```

## 3. .env 파일 업데이트

위에서 받은 URL과 토큰으로 `.env` 파일을 업데이트하세요:

```env
TURSO_CONNECTION_URL=libsql://rural-rest-db-hansu-yeon.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=<새로_생성한_토큰>
```

## 4. 데이터베이스 초기화

```bash
# 스키마 푸시
npm run db:push

# 데이터 시딩
npm run db:seed
```

## 5. 개발 서버 실행

```bash
npm run dev
```

## 문제 해결

### 401 인증 오류
- 토큰이 만료되었을 가능성이 높습니다
- `turso db tokens create rural-rest-db` 명령으로 새 토큰 생성
- `.env` 파일의 `TURSO_AUTH_TOKEN` 업데이트

### 데이터베이스가 없음
```bash
# 새 데이터베이스 생성
turso db create rural-rest-db

# URL과 토큰 확인
turso db show rural-rest-db --url
turso db tokens create rural-rest-db
```

### 연결 실패
- `.env` 파일이 프로젝트 루트에 있는지 확인
- URL이 `libsql://`로 시작하는지 확인
- 토큰에 공백이 없는지 확인
