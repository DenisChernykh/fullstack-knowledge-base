---
id: ARCH-01
category: backend-architecture
frequency: high
week_priority: top-40
selection_sources: [backend-bank, backend-guide]
projects: [planner]
project_evidence: implemented
---

# Controller, service и repository

## Вопрос

За что должны отвечать controller, application/service layer и repository в слоистом backend?

## Короткий ответ

Controller — HTTP-адаптер: читает уже провалидированные параметры, получает principal, вызывает application API и преобразует результат в transport DTO/status/headers. Use case выражает конкретное действие пользователя: проверяет authorization и бизнес-предусловия, управляет транзакционной границей через port, вызывает domain logic и возвращает framework-free результат. Repository скрывает детали хранения и реализует узкий persistence port: запросы, блокировки, mapping и atomic update. Я избегаю и «толстого controller» с SQL, и огромного service на сотни несвязанных методов. Правило простое: смена HTTP на worker не должна переписывать бизнес-команду, а смена Prisma не должна менять controller.

## Разбор

Controller может знать Nest decorators, request/response DTO и public error metadata. Application layer может знать actor, command, ports и application errors, но не Express `Response`. Domain содержит инварианты и value objects без Nest/Prisma. Infrastructure реализует repository/adapter и переводит driver failures в ограниченный набор ошибок.

Архитектурный выбор должен следовать из нагрузки, consistency, failure model и ownership. Полезно назвать простейший допустимый вариант, цену более сложного решения и наблюдение, после которого стоит эволюционировать.

## Пример из моих проектов

В Planner [`PlanningController`](/Users/denischernykh/projects/planner/src/modules/planning/presentation/planning.controller.ts) является HTTP boundary. [`PublishMonthCommand.execute`](/Users/denischernykh/projects/planner/src/modules/planning/application/publish-month.command.ts) собирает trusted command и вызывает [`PublicationPersistencePort.publish`](/Users/denischernykh/projects/planner/src/modules/planning/application/publication-persistence.port.ts). [`PrismaPublicationPersistence`](/Users/denischernykh/projects/planner/src/modules/planning/infrastructure/prisma-publication.persistence.ts) реализует транзакционные SQL/Prisma детали.

## Частые уточнения

**Где проверять authorization?** Transport guard проверяет общий доступ/permission, а object-level и бизнес-authorization — use case рядом с загружаемыми данными.

**Какой критерий заставит изменить это решение?** Измеримый рост нагрузки, новый consistency requirement, независимый lifecycle команды или повторяющийся failure mode, который текущая граница не выдерживает.

## Где ошибаются

Не нужно создавать три класса для тривиального read без пользы. Но прямой вызов Prisma из каждого controller быстро смешивает transport, authorization и persistence и усложняет тестирование переходов состояния.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [NestJS: Controllers](https://docs.nestjs.com/controllers)
