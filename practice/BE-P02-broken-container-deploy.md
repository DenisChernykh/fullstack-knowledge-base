# BE-P02 — Контейнер прошёл CI, но unhealthy

## Ограничение

45 минут. Диагноз должен опираться на наблюдения, а не на случайный набор правок.

## Симптом

Image успешно собран. Container запущен, но Compose показывает `unhealthy`, а `curl localhost:8080/health` с host не отвечает.

## Фрагменты

```dockerfile
FROM node:24 AS build
WORKDIR /app
COPY . .
RUN pnpm build

FROM node:24-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD ["node", "dist/main.js"]
```

```yaml
services:
  api:
    image: interview-api
    ports: ["8080:3000"]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
```

Приложение слушает `127.0.0.1:3000`, а runtime image не содержит `curl` и production dependencies.

## Ожидаемый разбор

- Приложение внутри container должно слушать `0.0.0.0:3000`.
- Healthcheck выполняется внутри container и обращается к container port 3000.
- Проверяющая команда должна реально присутствовать в runtime либо healthcheck использует доступный Node script.
- Runtime получает production dependencies или self-contained build artifact и запускается non-root.
- После исправления проверяются container health, host curl, exact image/version и logs.
- Rollback возвращает явно известный предыдущий artifact; изменение schema/data рассматривается отдельно.
