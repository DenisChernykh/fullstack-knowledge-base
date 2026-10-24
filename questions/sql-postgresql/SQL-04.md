---
id: SQL-04
category: sql-postgresql
frequency: high
week_priority: extended
selection_sources: [assessment-sql, backend-bank]
---

# Window functions и top-N

## Вопрос

Чем window functions отличаются от GROUP BY и как получить top-N строк внутри каждой группы?

## Короткий ответ

GROUP BY схлопывает несколько строк в одну строку группы. Window function вычисляет значение по набору связанных строк, но сохраняет каждую исходную строку. Окно задаётся через OVER: PARTITION BY разделяет группы, ORDER BY задаёт порядок внутри них. Для top-N per group обычно вычисляют ROW_NUMBER, RANK или DENSE_RANK в CTE, а затем фильтруют rank снаружи. ROW_NUMBER выбирает ровно N строк, RANK оставляет пропуски после ties, DENSE_RANK ранжирует разные значения без пропусков. Window function выполняется после WHERE, поэтому alias ранга обычно нельзя фильтровать в том же query level.

## Разбор

- SUM(amount) GROUP BY customer возвращает одну строку на customer; SUM(amount) OVER (PARTITION BY customer) повторяет итог рядом с каждой операцией.
- Frame важен для накопительных расчётов: ORDER BY без явного frame может включать peers с тем же значением.
- Top-N с ties выбирает RANK или DENSE_RANK согласно требованию; «ровно N строк» — ROW_NUMBER с детерминированным tie-breaker.
- Для производительности проверяют сортировку, partition cardinality и индекс, но индекс не устраняет любую window sort автоматически.

## Частые уточнения

**Чем RANK отличается от DENSE_RANK?** После ties RANK оставляет пропуски в номерах, DENSE_RANK — нет.

**Почему нельзя написать WHERE row_number() <= 2?** WHERE логически выполняется до window functions; используют subquery или CTE.

**Как получить ровно две строки на группу?** ROW_NUMBER с полным детерминированным ORDER BY и фильтр rn <= 2.

## Где ошибаются

Нельзя выбирать ROW_NUMBER, если бизнес-требование просит сохранить всех с одинаковым значением. И не стоит путать PARTITION BY с GROUP BY: окно не схлопывает строки.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
