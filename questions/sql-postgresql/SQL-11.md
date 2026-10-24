---
id: SQL-11
category: sql-postgresql
frequency: very-high
week_priority: top-40
selection_sources: [assessment-sql, backend-bank, sql-guide]
---

# ACID и границы транзакции

## Вопрос

Что означают свойства ACID и где должна начинаться и заканчиваться транзакция?

## Короткий ответ

Atomicity означает, что изменения транзакции фиксируются вместе либо откатываются. Consistency означает переход между состояниями, удовлетворяющими ограничениям и бизнес-инвариантам; СУБД обеспечивает заявленные constraints, но не придумывает правила приложения. Isolation определяет, как параллельные транзакции видят друг друга. Durability означает, что подтверждённый commit переживает штатно учитываемые сбои согласно настройкам хранения. Транзакцию открывают непосредственно перед связанными database-операциями и завершают сразу после них. Нельзя держать её открытой во время HTTP-вызова, ожидания пользователя или тяжёлого вычисления: это занимает connection, удерживает locks и увеличивает риск конфликтов.

## Разбор

- Application use case определяет атомарную бизнес-границу: например, списать остаток и создать запись операции.
- Транзакция одной БД не делает атомарным сторонний HTTP-вызов; для этого нужны отдельные протоколы и обработка неопределённого результата.
- Rollback откатывает database changes, но не отменяет уже отправленное письмо или внешний платеж.
- Isolation level выбирают по возможным аномалиям, а не как максимальное значение «на всякий случай».

## Частые уточнения

**Где открывать транзакцию в слоистом приложении?** На application boundary, которая знает набор атомарных действий, передавая transaction-aware repositories внутрь.

**Можно ли вызвать внешний API внутри транзакции?** Иногда технически можно, но это удлиняет locks и не даёт общей атомарности; обычно проектируют другой workflow.

**Consistency в ACID гарантирует бизнес-правила?** Только те, которые выражены constraints или корректно реализованы приложением внутри transaction/isolation.

## Где ошибаются

Нельзя расшифровать ACID и на этом закончить ответ. Важно объяснить границу транзакции и не обещать atomicity между PostgreSQL и произвольным внешним сервисом.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Database Interview Questions](https://pages.hackerrank.com/blog/database-interview-questions-you-should-know)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
