FROM imbios/bun-node:1.1-22-alpine

RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY package*.json bun.lockb ./
COPY .env ./
COPY ./public ./public/
COPY ./src ./src/
COPY ./auth.config.ts ./
COPY tsconfig.json ./
COPY .prettierrc ./
COPY .eslintrc.json ./
COPY ./next.config.js ./
COPY ./tailwind.config.ts ./
COPY ./postcss.config.js ./


RUN bun install
RUN bun graphql:codegen
RUN bun prisma:generate
RUN bun prisma:migrate-deploy

RUN bun run build

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

ENTRYPOINT [ "bun", "run", "start" ]

