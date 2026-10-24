---
id: OPS-07
category: operations
frequency: high
week_priority: extended
selection_sources: [docker-interview, backend-guide]
---

# Миграции при deploy

## Вопрос

В каком порядке выполнять database migrations и запуск приложения и как сохранить совместимость старой и новой версии?

## Короткий ответ

Migration запускаю отдельным one-shot процессом из того же immutable image до переключения нового API, с отдельными правами и явным exit code. Для zero/low-downtime изменений применяю expand–migrate–contract: сначала добавляю совместимую схему, затем выкатываю код с dual-read/write или backfill, и только после исчезновения старых версий удаляю старое поле. API startup не должен самовольно мигрировать БД при каждом replica start. Rollback приложения допустим только если предыдущая версия читает новую схему; автоматический down migration опасен потерей данных.

## Разбор

Deployment sequence:

Операционное утверждение подтверждают фактической версией процесса или artifact, текущими logs/metrics, health и smoke. Конфигурационный файл описывает contract, но сам по себе не доказывает состоявшийся deploy.


- Сначала применяют backward-compatible изменение schema, которое понимает старая версия; destructive cleanup откладывают до завершения перехода.
- Migration выполняет отдельный шаг/роль один раз, после успеха новая версия проходит readiness и получает traffic.
- При долгом backfill нужны batches, progress и restartability; rollback приложения не должен зависеть от уже удалённой колонки.
## Частые уточнения

**Почему не запускать migration в entrypoint каждой replica?** Реплики могут конкурировать, readiness смешивается с DDL, а частичный сбой усложняет диагностику и rollback.

**Как доказать итог операции?** Проверить exact version или digest, состояние процесса, readiness, критический smoke и записать результат rollback/recovery, если он потребовался.

## Где ошибаются

Факт применения migration не доказывает успешный backfill и совместимость всех consumers. Down migration может формально выполниться и потерять данные. Нельзя считать локальный Compose rehearsal доказательством production locks, объёма или backup restore.

## Источники

- [Docker Interview Questions](https://www.interviewbit.com/docker-interview-questions/)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
- [Nest starter: deployment runbook](/Users/denischernykh/projects/starters/nest-js-starter/docs/runbooks/deployment.md)
