---
id: SQL-06
category: sql-postgresql
frequency: very-high
week_priority: extended
selection_sources: [assessment-sql, backend-bank, sql-guide]
---

# Связи между таблицами

## Вопрос

Как спроектировать one-to-one, one-to-many и many-to-many связи?

## Короткий ответ

One-to-many задаётся foreign key на стороне many: каждый order хранит customer_id. One-to-one — это foreign key с UNIQUE, часто primary key дочерней таблицы одновременно является foreign key на родителя. Many-to-many требует junction table с двумя foreign keys и обычно составным UNIQUE или primary key, запрещающим дубли пары; дополнительные свойства связи, например role или added_at, живут там же. Сначала определяют обязательность и жизненный цикл: nullable ли ссылка, можно ли удалить родителя, должна ли история сохраниться. ORM relation — лишь отображение; реальную целостность задают database constraints и выбранная политика удаления.

## Разбор

- Кардинальность выражают не названием relation, а foreign key, unique constraints и NULL policy.
- Junction table становится полноценной сущностью, когда у связи есть собственные атрибуты или lifecycle.
- Двунаправленная навигация в ORM не означает два foreign keys. Источник истины связи должен быть один.
- Cascade выбирают по domain ownership: агрегатные дочерние данные можно удалить, независимую историю — чаще запрещают или архивируют.

## Частые уточнения

**Как обеспечить one-to-one?** Добавить UNIQUE на foreign key дочерней таблицы либо сделать её primary key одновременно foreign key.

**Что положить в primary key junction table?** Часто пару foreign keys; отдельный id нужен, если на запись ссылаются другие таблицы или у связи самостоятельный lifecycle.

**Можно ли хранить список IDs в JSON?** Можно, но теряются обычные foreign keys и удобные relational queries; это должно быть осознанным компромиссом.

## Где ошибаются

Частая ошибка — объявить one-to-one только в ORM без UNIQUE constraint или сделать два независимых foreign keys для одной связи.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Database Interview Questions](https://pages.hackerrank.com/blog/database-interview-questions-you-should-know)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
