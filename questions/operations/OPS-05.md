---
id: OPS-05
category: operations
frequency: high
week_priority: extended
selection_sources: [docker-interview, ops-guide]
projects: [planner]
project_evidence: implemented
---

# Compose, networks, volumes и config

## Вопрос

Что описывают Docker Compose networks, volumes, ports, environment и healthcheck?

## Короткий ответ

Compose описывает набор services и их runtime wiring. Внутри общей network сервисы находят друг друга по service name и container port; ports публикуют container port на host и не нужны для каждого внутреннего соединения. Named volume хранит данные вне writable layer container, bind mount связывает конкретный host path. environment передаёт runtime config, но не делает значение безопасным secret. depends_on задаёт порядок и при условии service_healthy может дождаться healthcheck, однако не заменяет retries приложения. Healthcheck проверяет конкретный сигнал работоспособности container, а не автоматически весь пользовательский путь.

## Разбор

- Connection string из API к postgres использует hostname postgres и container port, а не localhost host machine.
- Volume lifecycle отделён от container; перед удалением или миграцией данных нужно знать точный owner и backup policy.
- Bind mounts удобны локально, но делают deployment зависимым от host paths и permissions.
- Compose file — модель одного окружения; наличие файла не доказывает production orchestration или запущенный stack.

## Пример из моих проектов

В [Planner Compose](/Users/denischernykh/projects/planner/docker-compose.yml) API, PostgreSQL, Redis и одноразовый migrator связаны service names и healthchecks. Это локальный runtime contract, а не доказательство production deployment.

## Частые уточнения

**Почему localhost не ведёт к соседнему service?** Внутри container localhost означает тот же container; сосед доступен по имени в общей network.

**Чем volume отличается от bind mount?** Volume управляется Docker, bind mount указывает конкретный host path и наследует его структуру/permissions.

**depends_on гарантирует готовность БД?** Только при настроенном condition и healthcheck; приложение всё равно должно переживать временную недоступность.

## Где ошибаются

Нельзя хранить secret прямо в committed Compose или считать открытый host port обязательным для связи containers.

## Источники

- [Docker Interview Questions](https://www.interviewbit.com/docker-interview-questions/)
- [Backend development interview preparation](https://www.coursera.org/resources/back-end-development-interview-prep-guide)
- [Docker documentation](https://docs.docker.com/)
