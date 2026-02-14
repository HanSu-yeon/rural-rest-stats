# WSL 환경 설정 가이드

WSL(Windows Subsystem for Linux) 환경에서 프로젝트를 실행하는 경우, Windows에서 설치한 `node_modules`는 사용할 수 없습니다. 아래 단계를 따라주세요.

## 1. WSL 터미널에서 node_modules 재설치

```bash
cd /mnt/c/Users/tndus/Desktop/04.side-projects/rural-rest-stats

# 기존 node_modules 및 lock 파일 삭제
rm -rf node_modules package-lock.json

# Linux용 패키지 설치
npm install
```

## 2. Turso 토큰 갱신

현재 `.env` 파일의 토큰이 만료되었을 가능성이 높습니다. 새 토큰을 받아야 합니다.

### Option 1: Turso CLI 사용 (권장)

```bash
# Turso CLI 설치 (WSL/Linux)
curl -sSfL https://get.tur.so/install.sh | bash

# 로그인
turso auth login

# 토큰 생성
turso db tokens create rural-rest-db

# 토큰을 복사해서 .env 파일에 붙여넣기
nano .env
```

### Option 2: Turso 웹 대시보드 사용

1. https://turso.tech 에 로그인
2. `rural-rest-db` 데이터베이스 선택
3. "Generate Token" 버튼 클릭
4. 생성된 토큰을 복사해서 `.env` 파일에 붙여넣기

```bash
nano .env
```

`.env` 내용:
```env
TURSO_CONNECTION_URL=libsql://rural-rest-db-hansu-yeon.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=<새로운_토큰_여기에_붙여넣기>
```

## 3. 데이터베이스 설정

```bash
# 스키마 푸시
npm run db:push

# 데이터 시딩
npm run db:seed
```

## 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어서 대시보드를 확인하세요.

## 문제 해결

### esbuild 플랫폼 오류
- Windows에서 설치한 node_modules를 WSL에서 사용하면 발생
- 해결: WSL에서 `rm -rf node_modules package-lock.json && npm install` 실행

### 401 인증 오류
- 토큰이 만료됨
- 해결: 위의 "Turso 토큰 갱신" 섹션 참고

### 파일이 사용 중 (Device or resource busy)
- Windows와 WSL 간 파일 시스템 충돌
- 해결: 
  1. 모든 Node 프로세스 종료: `pkill -f node`
  2. Windows에서도 종료: 작업 관리자에서 Node 프로세스 종료
  3. 다시 시도

## 권장사항

WSL 환경에서 작업하는 경우:
- 항상 WSL 터미널에서 `npm install`, `npm run` 명령 실행
- Windows 터미널(PowerShell, CMD)에서는 실행하지 않기
- 또는 Windows에서만 작업하고 WSL은 사용하지 않기
