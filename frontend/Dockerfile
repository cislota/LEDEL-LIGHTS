
# Stage 1: Builder

FROM node:20-alpine AS builder

WORKDIR /app

# Копируем только package файлы для кэширования слоёв
COPY package*.json ./

# Устанавливаем все зависимости (включая devDependencies для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем Next.js приложение
RUN npm run build


# Stage 2: Production Runner

FROM node:20-alpine AS runner

WORKDIR /app

# Переменные окружения для Next.js
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Копируем только необходимые файлы для production
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Устанавливаем только production зависимости
COPY --from=builder /app/node_modules ./node_modules

# Копируем собранное приложение
COPY --from=builder /app/.next ./.next

# Открываем порт
EXPOSE 3000

# Запускаем Next.js в production режиме
CMD ["npm", "start"]
