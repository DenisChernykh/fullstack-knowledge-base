---
id: SEC-07
category: security-auth
frequency: high
week_priority: extended
selection_sources: [backend-bank, security-guide]
projects: [nest-starter]
project_evidence: implemented
---

# Secrets, PII и безопасные логи

## Вопрос

Как хранить secrets и не допустить утечки credentials или PII через конфигурацию, ошибки и логи?

## Короткий ответ

Secret не храню в Git, image, frontend bundle или обычном config artifact: runtime получает его из secret manager или host-owned environment с минимальными правами. При старте проверяю наличие, формат и длину, но никогда не печатаю значение. В structured logs использую allowlist полей: event, module, result code, duration, request ID; email/IP при необходимости HMAC-псевдонимизирую, а password, cookie, Authorization, token, DSN и raw request body запрещаю. Неизвестную ошибку сериализую безопасно: type и ограниченные очищенные stack frames, без message/cause наружу. Redaction — последняя страховка, а не разрешение сначала логировать всё.

## Разбор

Жизненный цикл secret включает creation, distribution, use, rotation и revocation. Разные назначения должны иметь разные keys: session digest, CSRF, rate-limit pseudonymization и webhook signing нельзя бездумно обслуживать одним secret. Rotation требует key IDs или переходного окна и понимания, какие данные подписаны старым key.

Security-механизм оценивают по threat model: какой attacker, какой asset и какую границу он закрывает. Затем нужны negative tests и безопасная наблюдаемость, не раскрывающая credential или PII.

## Пример из моих проектов

В Nest Starter [`runtime-environment.schema.ts`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/config/runtime-environment.schema.ts) декодирует secret как canonical 32-byte base64url и fail-fast отклоняет неверный env. [`serializeSafeError`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/logging/safe-error.serializer.ts) удаляет labelled secrets, bearer credentials и sensitive URLs, ограничивает текст и stack frames.

## Частые уточнения

**Можно ли хранить secret в `.env`?** Локально — в ignored файле с правами; production лучше передавать через secret store/host environment, не запекать в image или Compose в Git.

**Как проверить эту защиту?** Добавить негативный integration/e2e-сценарий, проверить отказ на server side и убедиться, что response и logs не раскрывают чувствительные данные.

## Где ошибаются

Regex redaction не гарантирует нахождение всех секретов и может быть обойдена необычным форматом. Надёжнее не помещать чувствительное значение в log event вообще. Валидация длины secret не доказывает его случайность.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Backend Interview Questions 2026](https://mortit.com/blog/backend-developer-interview-questions)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
