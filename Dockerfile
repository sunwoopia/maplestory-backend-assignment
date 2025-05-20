FROM node:18

WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

# 패키지 복사 및 설치
COPY pnpm-lock.yaml package.json ./
COPY . .

RUN pnpm install

# 전체 빌드
RUN pnpm build