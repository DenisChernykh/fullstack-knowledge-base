---
id: SQL-15
category: sql-postgresql
frequency: very-high
week_priority: extended
selection_sources: [assessment-sql, backend-bank, sql-guide]
---

# Реляционная БД, document и key-value

## Вопрос

Когда выбирать реляционную БД, а когда document или key-value storage?

## Короткий ответ

Реляционная БД подходит, когда важны связи, constraints, транзакции, разнообразные запросы и согласованная модель данных. Document storage удобен для агрегатов с изменяемой вложенной структурой, которые обычно читаются целиком и редко требуют join между коллекциями. Key-value даёт простой доступ по ключу и хорошо работает для cache, session или lookup, но не заменяет произвольные relational queries. Выбор делают по access patterns, consistency, объёму, latency и операционной компетенции, а не по ярлыку «NoSQL быстрее». Часто PostgreSQL уже покрывает relational данные, JSON и индексы достаточно хорошо, чтобы не добавлять вторую систему без измеримой причины.

## Разбор

- Сначала выписывают операции чтения/записи, инварианты, требуемые транзакции, рост данных и failure model.
- Document model снижает стоимость сборки одного агрегата, но дублирование усложняет cross-document consistency.
- Key-value storage оптимизирует конкретный lookup; secondary indexes и сложные фильтры могут потребовать другой модели.
- Polyglot persistence оправдана, когда выгода превышает стоимость backup, monitoring, migrations и обучения команды.

## Частые уточнения

**Когда MongoDB лучше PostgreSQL JSONB?** Когда document access patterns доминируют, независимые документы масштабируются естественно и команда готова к её consistency/operations модели.

**Redis — основная БД или cache?** Он может быть обоими, но durability, eviction, backup и data model должны соответствовать роли; по умолчанию cache не source of truth.

**Нужно ли выбирать одну БД навсегда?** Нет, но миграция дорога. Начинают с самого простого решения, которое закрывает известные требования.

## Где ошибаются

Нельзя сравнивать целые классы БД только по скорости или схеме. «Schema-less» не означает отсутствие структуры: контракт просто контролируется иначе.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Database Interview Questions](https://pages.hackerrank.com/blog/database-interview-questions-you-should-know)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
