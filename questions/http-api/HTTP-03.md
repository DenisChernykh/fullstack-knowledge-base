---
id: HTTP-03
category: http-api
frequency: very-high
week_priority: top-40
selection_sources: [roadmap-rest, roadmap-backend, backend-guide]
projects: [planner]
project_evidence: implemented
---

# Семантика HTTP-методов

## Вопрос

Чем отличаются GET, POST, PUT, PATCH и DELETE; какие методы safe или idempotent и что это меняет при retry?

## Короткий ответ

Безопасный метод по семантике не должен менять желаемое состояние ресурса: это прежде всего GET, HEAD и OPTIONS. Идемпотентный метод может менять состояние, но повтор одного и того же запроса должен приводить к тому же итоговому состоянию; PUT и DELETE по контракту идемпотентны, POST — не обязательно. При этом сетевой повтор никогда нельзя считать «тем же самым» только по payload. Для денежной или другой важной команды я принимаю отдельный idempotency key, связываю его с актором и типом команды, сохраняю fingerprint запроса и результат в одной транзакции с эффектом. Повтор возвращает сохранённый результат, а тот же ключ с другим payload даёт конфликт.

## Разбор

«Идемпотентный» не значит «ответ всегда побайтно одинаков». Повторный DELETE может сначала вернуть `204`, а затем `404`, хотя желаемое состояние — ресурс отсутствует — не изменилось. Побочные эффекты вроде access log или метрик тоже допустимы.

На собеседовании важно сначала назвать семантику контракта, затем один пограничный случай и только после этого implementation detail. Поведение фиксируют OpenAPI/contract tests и проверяют реальным HTTP-запросом.

## Пример из моих проектов

В Planner [`DurableCommandExecutor.execute`](/Users/denischernykh/projects/planner/src/shared/application/durable-command.executor.ts) строит ключ из actor scope, типа команды и `commandId`, вычисляет fingerprint, берёт блокировку receipt и выполняет эффект с записью результата внутри одной database transaction. Повтор с тем же fingerprint возвращает completed receipt, с другим — `CommandFingerprintConflictError`.

## Частые уточнения

**Где хранить idempotency key?** Рядом с источником истины операции; для транзакционной команды — обычно в той же базе и транзакции.

**Как закрепить это в API contract?** Документировать вход, успешный ответ, ошибки и пограничную семантику, затем проверить contract или e2e-тестом.

## Где ошибаются

Нельзя говорить, что PUT всегда безопасен или POST всегда неидемпотентен. Safe и idempotent — разные свойства, а фактическая гарантия определяется контрактом и реализацией. Idempotency receipt также не контролирует произвольные побочные эффекты стороннего API.

## Источники

- [Roadmap.sh: REST API questions](https://roadmap.sh/questions/rest-api)
- [Roadmap.sh: Backend questions](https://roadmap.sh/questions/backend)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [HTTP Semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 9110: Safe Methods and Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#name-methods)
