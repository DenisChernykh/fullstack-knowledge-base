# Project evidence для необязательных примеров

Проверено 2026-08-14. Этот файл не определяет состав вопросов: сначала тема должна пройти независимый frequency-отбор, и только потом к ней можно подобрать короткий пример. Наличие source, test или workflow не подтверждает production traffic, текущий hosted run или фактическую нагрузку.

## Статусы

- `implemented` — механизм найден в текущем checkout;
- `tested-in-repo` — рядом существует проверяющий repository test, свежий запуск не подразумевается;
- `deployment-contract` — есть Docker/workflow/config contract, но hosted execution не подтверждён;
- `known-gap` — пример используется только как честное ограничение.

Если прямого примера нет, секция просто отсутствует. Специальный статус `no-direct-example` не используется.

## Проверенные checkout

| Проект | Ветка | Commit | Граница |
| --- | --- | --- | --- |
| Planner | `main` | `fb4c6e3` | Локальный source/test/runtime contract; production pipeline не подтверждён |
| Amazing EKB backend | `stage` | `04661c9` | Source inspection; production host не проверялся |
| Amazing EKB admin | `stage` | `2703a2d` | Source inspection без свежего browser run |
| Amazing EKB frontend | `stage` | `fccaacc8` | Source inspection; чужое dirty state не изменялось |
| Nest Starter | `stage` | `a0c8e80` | Source/test/workflow contract; hosted run не подтверждён |
| React Starter | `stage` | `258b4e0` | Source/test/workflow contract; hosted deployment не подтверждён |
| Frontend Interview | `main` | `1fe3fdc` | Только ссылки на существующую теорию и livecoding; dirty state не изменялось |

## Planner

Естественные примеры для общих тем:

- HTTP bootstrap и validation: [configure-http-application.ts](/Users/denischernykh/projects/planner/src/platform/http/bootstrap/configure-http-application.ts).
- Controller → application command → persistence: [planning.controller.ts](/Users/denischernykh/projects/planner/src/modules/planning/presentation/planning.controller.ts), [publish-month.command.ts](/Users/denischernykh/projects/planner/src/modules/planning/application/publish-month.command.ts), [prisma-publication.persistence.ts](/Users/denischernykh/projects/planner/src/modules/planning/infrastructure/prisma-publication.persistence.ts).
- Модульный монолит и composition root: [modules](/Users/denischernykh/projects/planner/src/modules), [api.module.ts](/Users/denischernykh/projects/planner/src/bootstrap/api/api.module.ts).
- Unit/integration/e2e boundaries: [jest.unit.config.mjs](/Users/denischernykh/projects/planner/jest.unit.config.mjs), [jest.integration.config.mjs](/Users/denischernykh/projects/planner/jest.integration.config.mjs), [jest.e2e.config.mjs](/Users/denischernykh/projects/planner/jest.e2e.config.mjs).
- Multi-stage image, Compose и health: [Dockerfile](/Users/denischernykh/projects/planner/Dockerfile), [docker-compose.yml](/Users/denischernykh/projects/planner/docker-compose.yml), [health.controller.ts](/Users/denischernykh/projects/planner/src/platform/http/health/health.controller.ts).

Допустимая формулировка: «механизм реализован в локальном checkout». Нельзя превращать эти ссылки в утверждение о production deployment или нагрузке.

## Amazing EKB

- Долгая операция вынесена из HTTP в BullMQ worker: [process-place-import.service.ts](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/place-imports/application/services/process-place-import.service.ts).
- PostgreSQL остаётся source of truth, Redis используется для быстрых уведомлений: [prisma-place-import.repository.ts](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/place-imports/infrastructure/repositories/prisma-place-import.repository.ts), [redis-place-import-update.bus.ts](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/place-imports/infrastructure/events/redis-place-import-update.bus.ts).
- Общий queue concurrency задаётся отдельно от одного worker: [place-import-global-concurrency.service.ts](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/place-imports/infrastructure/queue/place-import-global-concurrency.service.ts).

Эти примеры подтверждают конкретные границы кода, но не production throughput и не исправность текущего hosted deployment.

## Nest Starter

- Authentication и permission guards: [authentication.guard.ts](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/presentation/authentication.guard.ts), [permission.guard.ts](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/presentation/permission.guard.ts).
- Opaque server sessions: [redis-session.store.ts](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/infrastructure/redis-session.store.ts).
- Runtime validation и безопасное HTTP wiring: [configure-http-application.ts](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/http/bootstrap/configure-http-application.ts).
- Multi-stage Dockerfile: [Dockerfile](/Users/denischernykh/projects/starters/nest-js-starter/Dockerfile).
- CI image contract: [stage-image.yml](/Users/denischernykh/projects/starters/nest-js-starter/.github/workflows/stage-image.yml).

Workflow и Dockerfile доказывают repository contract. Они не доказывают, что сейчас существует зелёный hosted run или production rollout.

## Frontend Interview

Frontend-вопросы не копируются. В practical route используются только две существующие задачи:

- [GroupBy / KeyBy](/Users/denischernykh/Documents/interview/tasks/by-priority/30-js-core-group-by-key-by/README.md);
- [Flatten Tree](/Users/denischernykh/Documents/interview/tasks/by-priority/27-js-core-flatten-tree/README.md).
