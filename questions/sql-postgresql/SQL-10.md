---
id: SQL-10
category: sql-postgresql
frequency: high
week_priority: top-40
selection_sources: [assessment-sql, backend-bank]
---

# EXPLAIN ANALYZE

## Вопрос

Как по EXPLAIN ANALYZE понять, почему запрос медленный?

## Короткий ответ

EXPLAIN показывает оценочный план, а EXPLAIN ANALYZE действительно выполняет запрос и добавляет фактические строки, время и loops. План читают от дочерних узлов к родителям: какой scan выбран, насколько estimated rows отличаются от actual, сколько раз выполняется inner node, где filter удаляет много строк, есть ли дорогая sort/hash и какие buffers прочитаны. Cost — не миллисекунды. Практично использовать EXPLAIN (ANALYZE, BUFFERS) на безопасном SELECT или внутри откатываемой транзакции для writes. Сначала находят bottleneck и ошибку оценки, затем меняют запрос, статистику или индекс и повторяют измерение.

## Разбор

- Большой разрыв estimated/actual rows может указывать на устаревшую статистику, skew, корреляцию columns или выражение, которое planner плохо оценивает.
- Actual time одного node нужно читать вместе с loops; inner index scan, выполненный тысячи раз, может быть настоящей ценой nested loop.
- BUFFERS отличает чтение страниц от CPU/processing и показывает shared hits/reads, но cache state влияет на повторный запуск.
- EXPLAIN ANALYZE выполняет statement, поэтому опасный write нельзя запускать на production без контролируемой транзакции и понимания side effects.

## Частые уточнения

**Почему estimate отличается от actual?** Статистика может быть устаревшей или не отражать зависимость и skew; помогают ANALYZE, extended statistics или другая форма запроса.

**Что означает loops?** Сколько раз node выполнялся; приблизительную суммарную цену оценивают с учётом повторов.

**Добавление индекса завершает оптимизацию?** Нет. Нужно повторно снять план и проверить latency/rows/buffers на репрезентативных данных.

## Где ошибаются

Нельзя искать «самую большую цифру» без дерева и loops, считать cost временем или запускать EXPLAIN ANALYZE для изменяющего production-запроса без защиты.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
