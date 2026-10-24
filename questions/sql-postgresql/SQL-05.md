---
id: SQL-05
category: sql-postgresql
frequency: very-high
week_priority: top-40
selection_sources: [assessment-sql, backend-bank, sql-guide]
---

# Ограничения целостности

## Вопрос

Чем отличаются PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL и CHECK?

## Короткий ответ

PRIMARY KEY однозначно идентифицирует строку, не допускает NULL и обычно имеет уникальный индекс. UNIQUE запрещает повтор значений по выбранным колонкам, но поведение нескольких NULL определяется СУБД и настройкой. NOT NULL требует наличие значения. CHECK проверяет условие для самой строки, например amount > 0. FOREIGN KEY обеспечивает ссылочную целостность: значение должно ссылаться на существующий key, если не равно NULL, и задаёт поведение при update/delete. Эти ограничения защищают данные независимо от конкретного API. Application validation даёт удобную ошибку раньше, но не заменяет database constraints при конкуренции и нескольких writers.

## Разбор

- У таблицы один primary key, но может быть несколько candidate keys через UNIQUE. Составной key допустим, если именно комбинация идентифицирует запись.
- FOREIGN KEY может запрещать удаление, каскадировать его или обнулять ссылку; выбор — часть domain policy.
- CHECK не предназначен для произвольной проверки других строк. Межстрочные инварианты обычно требуют уникального/exclusion constraint, транзакции или иной модели.
- Constraint name полезен для стабильного mapping database error в application error.

## Частые уточнения

**Заменяет ли UNIQUE предварительную проверку?** Нет. Проверка улучшает UX, но только constraint атомарно закрывает гонку между двумя writers.

**Всегда ли нужен surrogate id?** Нет. Natural или composite key уместен, если он стабилен и действительно идентифицирует сущность; surrogate key часто упрощает ссылки.

**Когда опасен ON DELETE CASCADE?** Когда удаление родителя не должно автоматически уничтожать большой или юридически значимый набор данных.

## Где ошибаются

Нельзя полагаться только на DTO validation или считать индекс и constraint взаимозаменяемыми понятиями. Ещё одна ошибка — добавлять cascade без анализа полного графа удаления.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Database Interview Questions](https://pages.hackerrank.com/blog/database-interview-questions-you-should-know)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
