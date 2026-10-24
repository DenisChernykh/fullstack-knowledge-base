---
id: SQL-14
category: sql-postgresql
frequency: very-high
week_priority: top-40
selection_sources: [assessment-sql, backend-bank, sql-guide]
---

# Проблема N+1

## Вопрос

Что такое N+1 в ORM и как исправить его через join, eager loading или batching?

## Короткий ответ

N+1 возникает, когда сначала загружают N родительских строк одним запросом, а затем для каждой выполняют отдельный запрос связей: всего 1+N round trips. На малых данных это незаметно, но latency и нагрузка растут с N. Исправление зависит от нужной формы: JOIN возвращает одну SQL-выборку, eager loading ORM может выполнить join или несколько batched запросов, DataLoader группирует keys, aggregate query сразу считает итог. Нужно следить за размножением строк и объёмом payload: один огромный join не всегда лучше двух ограниченных запросов. Проблему подтверждают SQL logs, query count и trace, а не только чтение ORM-кода.

## Разбор

- Типичный сигнал — число запросов линейно растёт с размером списка при неизменном endpoint.
- JOIN для нескольких one-to-many relations может создать cartesian multiplication; batching иногда лучше по памяти и payload.
- Pagination должна применяться к правильной сущности: join до LIMIT может изменить количество родителей.
- После исправления проверяют query count, latency и explain plans на реалистичной cardinality.

## Частые уточнения

**Как обнаружить N+1?** Включить SQL logging/tracing и сравнить query count при 1, 10 и 100 родителях.

**JOIN всегда лучше batching?** Нет. Несколько коллекций могут размножить строки; два batched запроса иногда дешевле и яснее.

**Что делает DataLoader?** Собирает keys в пределах request/batch window и выполняет один групповой запрос, затем сопоставляет результаты.

## Где ошибаются

Нельзя бездумно заменять N+1 на один гигантский JOIN или считать ORM include гарантией одного SQL statement без просмотра logs.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Database Interview Questions](https://pages.hackerrank.com/blog/database-interview-questions-you-should-know)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
