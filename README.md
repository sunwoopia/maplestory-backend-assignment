# 🗺️ Maplestory-Backend-Assignment

메이플스토리 월드 백엔드 과제용 NestJS 모노레포 프로젝트입니다. Gateway, Auth, Event 세 개의 마이크로서비스로 구성되어 있으며, Docker + pnpm 기반으로 누구나 쉽게 실행할 수 있도록 설계하였습니다.

---

## 🚀 기술 스택

- Node.js 18
- NestJS (Monorepo)
- MongoDB
- pnpm
- Docker & Docker Compose

---

## 📁 폴더 구조

```bash
maplestory-backend-assignment/
├── apps/
│   ├── auth/        # 인증 서비스
│   ├── gateway/     # API 게이트웨이
│   └── event/       # 이벤트/보상 관리
├── libs/            # 공통 라이브러리
├── .env             # 환경 변수 설정 (로컬에서 직접 작성)
├── Dockerfile       # 공통 Docker 빌드 파일
├── docker-compose.yml
├── package.json     # 루트 실행 스크립트
└── pnpm-lock.yaml
```

---

## ⚙️ .env 설정 방법

`.env` 파일은 아래 내용을 참고하여 **루트에 직접 생성**해주세요:

```env
# 서버별 포트
AUTH_PORT=5001
GATEWAY_PORT=5002
EVENT_PORT=5003

# MongoDB URI
MONGO_URI=mongodb://root:secret@localhost:27017/auth-db?authSource=admin

# 서비스별 내부 접근 URL (Docker Compose 기준)
AUTH_SERVER_URL=http://auth-server:5001
EVENT_SERVER_URL=http://event-server:5003

# JWT 설정
JWT_SECRET=dev-secret-maple-jwt-2025
```

---

## 🧪 실행 방법

```bash
# 1. Repository Clone
git clone https://github.com/sunwoopia/maplestory-backend-assignment.git
cd maplestory-backend-assignment

# 2. .env 파일 생성 (위 내용 복사해서 작성)

# 3. 도커 실행
docker-compose up --build
```

서비스는 아래 주소에서 접근 가능하고 GateWay Server에 요청을 통해 다른 서비스에 접근 가능합니다.

- Auth Server: http://localhost:5001
- Gateway Server: http://localhost:5002
- Event Server: http://localhost:5003
- MongoDB: localhost:27017

---

## 🏗️ 설계 배경 및 구성 설명

- **MSA + Monorepo + pnpm**: 각 서비스는 `apps/` 하위에 구성되며, 의존성 관리와 실행을 루트에서 통합합니다.
- **포트 구성**: auth/gateway/event를 각각 5001/5002/5003 포트로 분리하고, 내부 접근 주소도 환경변수로 통일했습니다.

---

## 🧩 데이터 스키마 구조

### 🔐 User (인증 서버) - 기본적인 유저의 인증 및 권한의 역할만을 사용하기 위해 우선 Email, Password, Role 3가지로만 구분

| 필드명   | 타입                              | 설명 |
|----------|-----------------------------------|------|
| email    | string (unique)                   | 이메일 |
| password | string                            | 비밀번호 |
| role     | 'User' \| 'Operator' \| 'Auditor' \| 'Admin' (optional) | 역할 |

---

### 🧠 UserActivity (이벤트 서버) - 유저가 하는 활동을 기록 Metrics를 사용하여 유동적인 유저 조건을 추가 가능하게 설계

| 필드명   | 타입              | 설명 |
|----------|-------------------|------|
| userId   | string (unique)   | 사용자 ID |
| metrics  | Record<string, any> | 조건별 활동 기록 (ex: loginCount 등) |

> `metrics`는 `Event.conditions`와 연동되어, 이벤트 조건 달성 여부를 평가하는 기준으로 사용됩니다.

---

### 🎁 RewardDefinition - 기본적인 보상의 정보

| 필드명   | 타입                              | 설명 |
|----------|-----------------------------------|------|
| name     | string                            | 보상 이름 |
| type     | 'coupon' \| 'cash' \| 'points' \| 'item' | 보상 종류 |
| value    | string                            | 보상 값 |
| method   | 'auto' \| 'manual'                | 지급 방식 (기본값: manual) |

---

### 📦 Event - 이벤트의 정보를 가지고 있으며 상태와 달성 조건, 연결된 보상을 포함함

| 필드명      | 타입                  | 설명 |
|-------------|-----------------------|------|
| title       | string                | 이벤트 제목 |
| description | string (optional)     | 설명 |
| rewardType  | string                | 보상 타입 |
| rewardValue | string (optional)     | 보상 값 |
| startDate   | Date (optional)       | 시작일 |
| endDate     | Date (optional)       | 종료일 |
| createdBy   | string                | 작성자 ID |
| status      | 'pending' \| 'active' \| 'ended' | 상태 |
| conditions  | Array<{ key, operator, value }> | 달성 조건 |
| reward      | ObjectId → RewardDefinition 참조 | 연결된 보상 정의 |

---

### 📝 RewardRequest - 보상 요청 - 이벤트와 보상 종류의 대한 정보를 담은 보상 요청

| 필드명             | 타입                                         | 설명 |
|--------------------|----------------------------------------------|------|
| userId             | string                                       | 사용자 ID |
| eventId            | string                                       | 이벤트 ID |
| rewardDefinitionId | ObjectId → RewardDefinition 참조             | 요청한 보상 |
| status             | 'Pending' \| 'OnHold' \| 'Approved' \| 'Rejected' | 상태 |
| processedBy        | string (optional)                            | 처리자 |
| processedAt        | Date (optional)                              | 처리 시각 |
| reason             | string (optional)                            | 거절 사유 등 |

---

## 🔗 서비스 간 관계도

```plaintext
[User]
   ├── 인증 및 로그인 → [Auth Server]
   ├── 활동 기록     → [UserActivity] ← 조건 평가 ← [Event]
   └── 보상 신청     → [RewardRequest] ────────▶ [RewardDefinition]

[Event]
   ├── 조건 정의 + 보상 연결 → [RewardDefinition]
   └── 유저 대상 이벤트 제공

[Gateway Server]
   └─ API 요청 인증 및 라우팅 처리
```

---

## 📮 문의

과제 관련 질문은 sunrain1223@gmail.com을 통해 부탁드립니다.
