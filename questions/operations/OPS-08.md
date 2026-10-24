---
id: OPS-08
category: operations
frequency: high
week_priority: extended
selection_sources: [docker-interview, backend-guide]
projects: [planner]
project_evidence: implemented
---

# Health, graceful shutdown и rollback

## Вопрос

Чем startup, readiness и liveness отличаются друг от друга и как проверить deploy и выполнить rollback?

## Короткий ответ

Startup сообщает, завершил ли процесс долгий запуск. Readiness отвечает, можно ли сейчас направлять ему новый трафик. Liveness отвечает, застрял ли процесс настолько, что его нужно перезапустить; она не должна падать из-за каждой краткой недоступности внешней зависимости. При shutdown instance сначала перестаёт быть ready, прекращает принимать новые запросы и в ограниченный срок завершает активные. Deploy допускают в traffic только после readiness и smoke exact version. Если smoke не прошёл, фиксируют неудачную версию и явно возвращают предыдущий совместимый artifact или делают roll-forward. Rollback кода не отменяет migrations и изменения данных.

## Разбор

- Слишком агрессивная liveness может устроить restart loop и усугубить outage. Readiness защищает traffic, не обязательно убивая process.
- Graceful drain имеет timeout: после него orchestrator может завершить process принудительно.
- Smoke проверяет критический публичный или внутренний путь и идентичность версии, а не только TCP connection.
- Recovery plan отдельно учитывает application artifact, schema compatibility, data и external side effects.

## Пример из моих проектов

В Planner есть отдельные [startup, readiness и liveness endpoints](/Users/denischernykh/projects/planner/src/platform/http/health/health.controller.ts) и bounded graceful shutdown. Это локально реализованный runtime contract; автоматический hosted rollback не подтверждён.

## Частые уточнения

**Должна ли liveness проверять PostgreSQL?** Обычно нет: временная проблема БД не лечится перезапуском всех instances. Зависимость может влиять на readiness.

**Когда instance убрать из traffic?** До начала drain и при потере способности корректно обслуживать запросы.

**Что проверить после rollback?** Фактически запущенную version, readiness, smoke и совместимость данных/schema.

## Где ошибаются

Нельзя делать один endpoint для всех probes без осознанной семантики или считать rollback простым возвратом старого tag.

## Источники

- [Docker Interview Questions](https://www.interviewbit.com/docker-interview-questions/)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [Docker documentation](https://docs.docker.com/)
