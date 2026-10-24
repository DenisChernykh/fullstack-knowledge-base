---
id: SQL-13
category: sql-postgresql
frequency: high
week_priority: extended
selection_sources: [assessment-sql, backend-bank]
---

# Row locks и deadlock

## Вопрос

Как возникают row locks и deadlock и почему помогает единый порядок захвата блокировок?

## Короткий ответ

Row-level lock возникает при UPDATE, DELETE и явном SELECT ... FOR UPDATE; несовместимая операция другой транзакции ждёт освобождения. Deadlock появляется, когда транзакции удерживают ресурсы и ждут друг друга по циклу, например T1 блокирует A и ждёт B, а T2 блокирует B и ждёт A. PostgreSQL обнаруживает цикл и отменяет одну транзакцию. Риск уменьшают единый порядок захвата locks, короткие транзакции, подходящие индексы и отсутствие внешнего I/O внутри transaction. После deadlock приложение откатывает и при безопасной операции повторяет всю транзакцию с ограничением и backoff.

## Разбор

- FOR UPDATE нужен, когда последующее решение зависит от прочитанного состояния и atomic UPDATE с predicate недостаточно.
- Lock scope зависит от фактических найденных строк; медленный scan и неверный predicate могут держать больше работы и дольше.
- Единый порядок, например всегда меньший account_id первым, разрывает классический цикл при переводе между счетами.
- Lock timeout и statement timeout ограничивают ожидание, но не исправляют неправильный порядок или длинную transaction.

## Частые уточнения

**Чем blocking отличается от deadlock?** Blocking может разрешиться после commit владельца; deadlock образует цикл, который сам не разрешится.

**Что повторять после deadlock?** Всю бизнес-транзакцию после rollback, если operation идемпотентна или ввод остаётся безопасным.

**Всегда ли нужен FOR UPDATE?** Нет. Atomic UPDATE ... WHERE, optimistic version или unique constraint часто проще и короче.

## Где ошибаются

Нельзя лечить deadlock только увеличением timeout или повторять один statement внутри уже aborted transaction.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
