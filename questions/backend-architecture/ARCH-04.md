---
id: ARCH-04
category: backend-architecture
frequency: very-high
week_priority: extended
selection_sources: [backend-bank, backend-guide, roadmap-backend]
projects: [amazing-ekb, planner]
project_evidence: implemented
---

# Cache и source of truth

## Вопрос

Когда нужен cache, что считать source of truth и как решать проблему устаревших данных?

## Короткий ответ

Source of truth — система, чьё durable состояние решает конфликт и из которой можно восстановить производные представления. Кэш ускоряет чтение, но не становится вторым равноправным владельцем данных. Я определяю key/version/TTL, invalidation после commit, поведение при miss и outage, защиту от stampede и допустимую stale-границу. Для correctness-critical решения перечитываю authoritative store; событие или Redis notification служит подсказкой, а не доказательством. Если invalidation потерялась, TTL или version check возвращают систему к истине. Write-through/cache-aside выбираю по потоку, но DB commit и cache update не называю атомарными без специального протокола.

## Разбор

Cache-aside:

Архитектурный выбор должен следовать из нагрузки, consistency, failure model и ownership. Полезно назвать простейший допустимый вариант, цену более сложного решения и наблюдение, после которого стоит эволюционировать.


- При cache-aside чтение сначала проверяет cache, при miss загружает source of truth и заполняет cache с TTL.
- После mutation cache удаляют или обновляют; порядок важен, потому что stale reader может снова записать старое значение.
- Cache key включает tenant, параметры и версию representation, а метрики hit rate и stale/error behavior показывают реальную пользу.
## Пример из моих проектов

В Amazing EKB PostgreSQL хранит authoritative import operation и version, а Redis update bus лишь ускоряет уведомление; HTTP/SSE path перечитывает durable operation: [redis-place-import-update.bus.ts](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/place-imports/infrastructure/events/redis-place-import-update.bus.ts) и [prisma-place-import.repository.ts](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/place-imports/infrastructure/repositories/prisma-place-import.repository.ts). Это реализованное разделение source of truth и cache/update channel, но не доказательство production latency.

## Частые уточнения

**Как избежать cache stampede?** TTL jitter, single-flight/lock, stale-while-revalidate и ограничение concurrency — по цене stale/нагрузки.

**Какой критерий заставит изменить это решение?** Измеримый рост нагрузки, новый consistency requirement, независимый lifecycle команды или повторяющийся failure mode, который текущая граница не выдерживает.

## Где ошибаются

Нельзя говорить «Redis всегда кэш». TTL не обеспечивает строгую consistency, только ограничивает stale window. Pub/sub notification может потеряться, поэтому correctness не должен зависеть от её гарантированной доставки.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [Roadmap.sh: Backend questions](https://roadmap.sh/questions/backend)
- [AWS: Caching best practices](https://aws.amazon.com/caching/best-practices/)
