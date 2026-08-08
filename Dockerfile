FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]