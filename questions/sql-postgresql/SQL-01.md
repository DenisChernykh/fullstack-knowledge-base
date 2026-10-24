---
id: SQL-01
category: sql-postgresql
frequency: very-high
week_priority: top-40
selection_sources: [assessment-sql, backend-bank, sql-guide]
projects: [planner, amazing-ekb]
project_evidence: implemented
---

# JOIN и кардинальность

## Вопрос

Чем INNER JOIN отличается от LEFT JOIN и почему фильтр правой таблицы в WHERE может изменить результат?

## Короткий ответ

`INNER JOIN` оставляет только строки, для которых нашлась пара с обеих сторон. `LEFT JOIN` сохраняет все строки слева и подставляет `NULL`, если пары справа нет; `RIGHT JOIN` симметричен ему, но обычно запрос проще прочитать после перестановки таблиц. `FULL JOIN` сохраняет несовпавшие строки с обеих сторон, а `CROSS JOIN` строит декартово произведение. Выбор определяется не «скоростью вида JOIN», а требуемой семантикой результата. Я сначала формулирую, какая таблица задаёт множество результата, затем условие связи и только после этого думаю о плане, индексах и объёме промежуточных строк.

## Разбор

Связь задаётся условием `ON`, а фильтрация итоговых строк — `WHERE`. Для внешнего соединения это принципиально:

SQL-ответ подтверждают не интуицией ORM, а минимальным запросом, constraints и фактическим планом на репрезентативных данных. Для concurrency отдельно формулируют две параллельные транзакции и ожидаемый observable result.


- Условие принадлежности пары задаётся в ON. Для LEFT JOIN predicate правой таблицы в WHERE удалит NULL-строки и изменит семантику.
- Связь one-to-many размножает левую строку; это решают требуемой aggregation или EXISTS, а не случайным DISTINCT.
- Физический nested loop, hash join или merge join выбирает planner; логический тип JOIN не обещает конкретную скорость.
## Пример из моих проектов

В Planner чтение месяца собирает согласованный header и связанные publication-данные в persistence-слое. Это хороший пример, где `LEFT JOIN` нужен для различения состояний «месяца нет», «есть draft» и «есть активная публикация», а не просто для склейки таблиц: [prisma-tracking-read.persistence.ts](/Users/denischernykh/projects/planner/src/modules/tracking/infrastructure/prisma-tracking-read.persistence.ts).

## Частые уточнения

**Почему после `LEFT JOIN` строк стало больше?** Потому что каждой левой строке соответствует несколько правых. Нужно уточнить требуемую гранулярность: агрегировать, выбрать одну запись или вернуть все пары.

**Как доказать это на PostgreSQL?** Собрать минимальную schema/data fixture, выполнить запрос или две транзакции и при необходимости сравнить EXPLAIN (ANALYZE, BUFFERS).

## Где ошибаются

Нельзя говорить, что `INNER JOIN` всегда быстрее `LEFT JOIN`: производительность зависит от данных, статистики, индексов и плана. `DISTINCT` не лечит неверно заданную кардинальность. И не стоит утверждать, что Prisma relation include всегда выполняется одним join-запросом без проверки сгенерированного SQL.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Database Interview Questions](https://pages.hackerrank.com/blog/database-interview-questions-you-should-know)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
- [PostgreSQL: Table Expressions and Joined Tables](https://www.postgresql.org/docs/current/queries-table-expressions.html)
