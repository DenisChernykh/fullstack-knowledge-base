---
id: SQL-12
category: sql-postgresql
frequency: high
week_priority: top-40
selection_sources: [assessment-sql, backend-bank]
---

# Transaction isolation

## Вопрос

Чем отличаются READ COMMITTED, REPEATABLE READ и SERIALIZABLE и какие аномалии они предотвращают?

## Короткий ответ

В PostgreSQL READ COMMITTED создаёт новый snapshot для каждого statement: повторный SELECT в одной транзакции может увидеть committed изменения. REPEATABLE READ сохраняет один snapshot на транзакцию и предотвращает non-repeatable reads; PostgreSQL также не допускает классические phantoms, но concurrent writers могут привести к serialization failure. SERIALIZABLE отслеживает опасные зависимости и гарантирует результат, эквивалентный некоторому последовательному выполнению, ценой возможного abort. Любой уровень не заменяет constraints и atomic update. Приложение должно уметь безопасно повторить всю транзакцию после serialization/deadlock error, а не отдельный случайный statement.

## Разбор

- READ COMMITTED — default и часто достаточен, если инвариант выражен atomic statement, unique constraint или явной блокировкой.
- REPEATABLE READ полезен для согласованного multi-query чтения, но snapshot не включает commits после первого relevant statement.
- SERIALIZABLE не означает один глобальный lock; PostgreSQL использует Serializable Snapshot Isolation и может отменить одну транзакцию.
- Isolation выбирают по конкретной anomaly: сначала описывают две транзакции и неправильный итог.

## Частые уточнения

**Что видит второй SELECT в READ COMMITTED?** Новый snapshot statement, поэтому он может увидеть изменения, committed после первого SELECT.

**Нужно ли ретраить serialization failure?** Да, повторяют всю transaction boundary с безопасным вводом и ограниченным retry policy.

**Защищает ли REPEATABLE READ от lost update?** Не любое read-modify-write автоматически; нужны atomic update, version check, lock или обработка конфликта.

## Где ошибаются

Нельзя переносить таблицу аномалий другой СУБД на PostgreSQL без оговорки или обещать, что высокий isolation исключает необходимость retry.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
