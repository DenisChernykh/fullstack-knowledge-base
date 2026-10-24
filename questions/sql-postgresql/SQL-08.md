---
id: SQL-08
category: sql-postgresql
frequency: very-high
week_priority: top-40
selection_sources: [assessment-sql, backend-bank, sql-guide]
---

# Индексы и их цена

## Вопрос

Что такое индекс, когда он ускоряет запрос и какую цену добавляет к INSERT, UPDATE и DELETE?

## Короткий ответ

Индекс — отдельная структура данных, которая помогает находить строки без полного просмотра таблицы. B-tree полезен для равенства, диапазонов и упорядочивания, но не делает любой запрос быстрым автоматически. Индекс занимает место, обновляется при INSERT, UPDATE и DELETE, увеличивает write amplification и требует обслуживания. Его создают под конкретный профиль запросов: predicates, join keys, сортировку и ожидаемую селективность. Затем проверяют фактический план на репрезентативных данных. Если запрос возвращает большую часть таблицы, sequential scan может быть дешевле index scan — это нормальный выбор планировщика.

## Разбор

- Индекс особенно полезен, когда predicate выбирает небольшую долю большой таблицы или поддерживает нужный порядок.
- Каждый дополнительный индекс замедляет writes и увеличивает vacuum/storage cost, поэтому «индексировать всё» нельзя.
- Функция или несовпадающий cast в predicate может не использовать обычный индекс; иногда нужен expression index или изменение запроса.
- Index-only scan зависит не только от listed columns, но и от visibility map. Решение подтверждают EXPLAIN (ANALYZE, BUFFERS).

## Частые уточнения

**Почему PostgreSQL выбирает sequential scan при наличии индекса?** Большая доля результата, маленькая таблица, плохая селективность или стоимость random reads могут сделать его дешевле.

**Какие колонки индексировать?** Те, что участвуют в частых selective predicates, joins и сортировке конкретных запросов.

**Индекс ускоряет UPDATE?** Поиск строк может ускориться, но обслуживание затронутых индексов добавляет стоимость записи.

## Где ошибаются

Нельзя обещать ускорение без плана и данных или оценивать индекс только по одному SELECT, игнорируя writes и storage.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Database Interview Questions](https://pages.hackerrank.com/blog/database-interview-questions-you-should-know)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
