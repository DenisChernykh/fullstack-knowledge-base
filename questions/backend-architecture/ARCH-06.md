---
id: ARCH-06
category: backend-architecture
frequency: very-high
week_priority: top-40
selection_sources: [backend-bank, backend-guide, roadmap-backend]
---

# Timeout, retry, backoff и idempotency

## Вопрос

Как связаны timeout, retry, exponential backoff и idempotency; какие операции нельзя слепо повторять?

## Короткий ответ

Сначала задаю общий deadline операции, затем меньшие bounded timeouts для connection, request и отдельных попыток. Retry разрешаю только для классифицированных transient failures и только если операция идемпотентна или имеет idempotency key. Между попытками использую exponential backoff с jitter, чтобы множество клиентов не повторяло запрос одновременно. Есть max attempts, max delay и retry budget; `Retry-After` учитывается. Не повторяю validation/auth/business conflicts и обычно не ретраю неизвестный non-idempotent effect. Observability должна различать attempt и итог операции. Таймаут не означает, что сервер отменил работу, поэтому результат после timeout может быть неопределённым и требовать status lookup/reconciliation.

## Разбор

Пример full jitter:

Архитектурный выбор должен следовать из нагрузки, consistency, failure model и ownership. Полезно назвать простейший допустимый вариант, цену более сложного решения и наблюдение, после которого стоит эволюционировать.


- Timeout ограничивает ожидание одной попытки и должен укладываться в общий request budget.
- Retry разрешён только для временных ошибок и безопасной операции; exponential backoff с jitter уменьшает синхронные повторные пики.
- Idempotency защищает бизнес-эффект повторяемой команды, но не отменяет лимит попыток, deadline и наблюдаемость окончательного отказа.
## Частые уточнения

**Какие HTTP-коды ретраить?** Обычно 429 с `Retry-After`, часть 502/503/504 и сетевые ошибки; конкретный контракт важнее общего списка. 400/401/403/semantic 409 обычно terminal.

**Какой критерий заставит изменить это решение?** Измеримый рост нагрузки, новый consistency requirement, независимый lifecycle команды или повторяющийся failure mode, который текущая граница не выдерживает.

## Где ошибаются

Timeout не отменяет удалённую операцию автоматически. Retry без budget ухудшает outage. Нельзя использовать backoff как замену backpressure или повторять deterministic error.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [Roadmap.sh: Backend questions](https://roadmap.sh/questions/backend)
- [AWS Builders' Library: Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
