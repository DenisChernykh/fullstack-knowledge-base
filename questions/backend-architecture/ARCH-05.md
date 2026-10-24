---
id: ARCH-05
category: backend-architecture
frequency: high
week_priority: extended
selection_sources: [backend-bank, backend-guide]
projects: [planner, amazing-ekb]
project_evidence: implemented
---

# Stateless backend и масштабирование

## Вопрос

Что означает stateless backend, почему это облегчает горизонтальное масштабирование и где хранить sessions и shared state?

## Короткий ответ

После запуска нескольких instances process memory перестаёт быть общей: in-memory flags, EventEmitter, session cache и счётчики относятся только к одному процессу. Requests одного пользователя могут попасть в разные replicas, а workers конкурируют за общие jobs. Поэтому authoritative state выносят в PostgreSQL, Redis или broker, а ограничения concurrency и rate limit задают на shared уровне, не через `concurrency=1` в каждом worker. Deploy, readiness и graceful shutdown также должны учитывать одновременную работу нескольких версий. Конкретный механизм координации выбирают только после формулировки инварианта.

## Разбор

Типичные ошибки перехода 1 → N:

Архитектурный выбор должен следовать из нагрузки, consistency, failure model и ownership. Полезно назвать простейший допустимый вариант, цену более сложного решения и наблюдение, после которого стоит эволюционировать.


- Process-local memory нельзя использовать как общий session store или глобальный limiter, если запросы распределяются между replicas.
- Shared state выносят в подходящее хранилище, а API instance делает заменяемым: config приходит извне, локальный диск не является source of truth.
- После масштабирования проверяют database pool, background jobs, cron ownership, readiness и graceful termination нескольких instances.
## Пример из моих проектов

Amazing EKB задаёт общий для очереди concurrency limit через [place-import-global-concurrency.service.ts](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/place-imports/infrastructure/queue/place-import-global-concurrency.service.ts), потому что локальный limit одного worker не ограничивает другие replicas. Это конкретный пример shared coordination; он не доказывает горизонтальную масштабируемость всего приложения.

## Частые уточнения

**Почему local `concurrency: 1` недостаточно?** Каждая из N replicas запускает по одной job, итого N. Нужен queue-level limit или shared lease.

**Какой критерий заставит изменить это решение?** Измеримый рост нагрузки, новый consistency requirement, независимый lifecycle команды или повторяющийся failure mode, который текущая граница не выдерживает.

## Где ошибаются

Нельзя заявлять горизонтальную масштабируемость, проверив только stateless HTTP. Shared PostgreSQL может стать bottleneck, а sticky sessions способны лишь скрыть зависимость от process-local state.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [The Twelve-Factor App: Processes](https://12factor.net/processes)
