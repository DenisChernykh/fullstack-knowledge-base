---
id: SQL-02
category: sql-postgresql
frequency: very-high
week_priority: top-40
selection_sources: [assessment-sql, backend-bank, sql-guide]
---

# GROUP BY, агрегаты и HAVING

## Вопрос

Как работают GROUP BY и агрегатные функции и чем WHERE отличается от HAVING?

## Короткий ответ

WHERE фильтрует исходные строки до группировки, GROUP BY объединяет оставшиеся строки по ключам, агрегаты вроде COUNT, SUM и AVG вычисляют значение для каждой группы, а HAVING фильтрует уже сформированные группы. Поэтому условие по обычной колонке обычно ставят в WHERE, а условие COUNT(*) > 5 — в HAVING. В SELECT без window functions можно выводить только grouping keys и агрегаты. COUNT(*) считает строки, COUNT(column) пропускает NULL. Чтобы сохранить сущности без дочерних строк, часто нужен LEFT JOIN, условие правой таблицы в ON и аккуратный COUNT(right.id).

## Разбор

- Логический порядок полезно проговаривать так: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Реальный план может выполнять оптимизации иначе, сохраняя семантику.
- WHERE уменьшает набор до агрегации и обычно лучше использует индекс. HAVING нужен для predicates по результату агрегата.
- После LEFT JOIN COUNT(*) даст минимум одну строку на левую запись, а COUNT(right.id) даст ноль при отсутствии совпадения.
- Если нужны и детальные строки, и агрегат без схлопывания, рассматривают window function.

## Частые уточнения

**Почему колонку нельзя просто добавить в SELECT?** Потому что для группы нет единственного значения этой колонки. Её нужно включить в GROUP BY или агрегировать.

**Чем COUNT(*) отличается от COUNT(column)?** COUNT(*) считает строки, COUNT(column) — только строки, где expression не NULL.

**Можно ли использовать alias SELECT в HAVING?** Это зависит от СУБД и контекста; в переносимом SQL лучше повторить expression или использовать подзапрос/CTE.

## Где ошибаются

Частые ошибки — переносить фильтр правой таблицы из ON в WHERE при LEFT JOIN, использовать HAVING вместо обычного WHERE и скрывать неверную группировку через случайный MIN или MAX.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Database Interview Questions](https://pages.hackerrank.com/blog/database-interview-questions-you-should-know)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
