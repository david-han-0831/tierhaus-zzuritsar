# 티어하우스 공동구매 신청 페이지

후추추님과 티어하우스의 수제간식 공동구매 신청을 위한 웹페이지입니다.

## 주요 기능

- 📱 모바일 반응형 디자인
- 🛒 상품 수량 조절 및 실시간 가격 계산
- 📋 주문자 정보 입력 폼
- 💰 6만원 이상 무료배송 자동 적용
- 📊 Notion 데이터베이스 연동으로 주문 데이터 자동 저장
- 🔔 Slack 알림으로 실시간 주문 접수 알림

## 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경변수들을 설정해주세요:

```env
# Notion 설정
NOTION_SECRET=your_notion_secret_here
NOTION_DATABASE_ID=your_notion_database_id_here

# Slack 웹훅 URL
SLACK_WEBHOOK_URL=your_slack_webhook_url_here
```

### Notion 설정 방법

1. **Notion Integration 생성**
   - [Notion Developers](https://developers.notion.com) 접속
   - "New integration" 클릭
   - Integration 이름 입력 후 생성
   - Internal Integration Token 복사 (NOTION_SECRET으로 사용)

2. **Notion 데이터베이스 설정**
   - 새 Notion 페이지 생성
   - 데이터베이스 추가 (Full page database)
   - 데이터베이스에 다음 속성들 추가:
     - 신청일시 (Date)
     - 성함 (Title)
     - 입금자명 (Text)
     - 연락처 (Phone)
     - 주소 (Text)
     - 배송메시지 (Text)
     - 상품명 (Text)
     - 수량 (Number)
     - 단가 (Number)
     - 소계 (Number)
     - 상품총액 (Number)
     - 배송비 (Number)
     - 총결제금액 (Number)

3. **데이터베이스 권한 설정**
   - 데이터베이스 우상단 "..." 클릭
   - "Add connections" 선택
   - 생성한 Integration 추가

4. **데이터베이스 ID 복사**
   - 데이터베이스 URL에서 ID 부분 복사
   - 예: `https://notion.so/workspace/1234567890abcdef` → `1234567890abcdef`

### Slack 웹훅 설정 방법

1. **Slack 앱 생성**
   - [Slack API](https://api.slack.com/apps) 접속
   - "Create New App" → "From scratch" 선택
   - 앱 이름 입력 후 워크스페이스 선택

2. **Incoming Webhooks 활성화**
   - "Features" → "Incoming Webhooks" 선택
   - "Activate Incoming Webhooks" 토글 ON
   - "Add New Webhook to Workspace" 클릭
   - 알림을 받을 채널 선택
   - Webhook URL 복사 (SLACK_WEBHOOK_URL로 사용)

## 브랜드 컬러

- 메인 컬러: \`#8f001e\` (티어하우스 브랜드 컬러)
- 서브 컬러: 흰색

## 배송 정책

- 기본 배송비: 4,000원
- 6만원 이상 주문 시 무료배송
- 10만원 이상 주문 시 서비스 간식 제공

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Notion API (데이터베이스)
- Slack Webhook (알림)
