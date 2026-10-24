---
id: SEC-03
category: security-auth
frequency: high
week_priority: extended
selection_sources: [backend-bank, security-guide]
projects: [nest-starter]
project_evidence: implemented
---

# Пароли, enumeration и brute force

## Вопрос

Как безопасно хранить и проверять пароли, не раскрывать существование аккаунта и ограничивать brute force?

## Короткий ответ

Пароли храню не шифрованием, а медленным memory-hard password hash — обычно Argon2id — с уникальной salt, которую библиотека включает в encoded hash. Параметры выбираются по latency и памяти на реальном сервере и versioned policy позволяет rehash после успешного login. Для неизвестного email всё равно проверяю dummy hash и возвращаю одинаковую публичную ошибку, чтобы не раскрывать аккаунт по статусу или грубому timing. Rate limit делаю распределённым и одновременно по IP и нормализованному account key, добавляю bounded response floor и security audit. При этом лимит не должен позволять атакующему навсегда заблокировать жертву.

## Разбор

Защита включает:

Security-механизм оценивают по threat model: какой attacker, какой asset и какую границу он закрывает. Затем нужны negative tests и безопасная наблюдаемость, не раскрывающая credential или PII.


- Пароль хэшируют memory-hard алгоритмом вроде Argon2id с уникальной солью; параметры и необходимость rehash хранят вместе с hash.
- Login возвращает одинаковую публичную ошибку для неизвестного пользователя и неверного пароля и ограничивает попытки по нескольким безопасным ключам.
- Reset token одноразовый, случайный, короткоживущий и хранится в виде digest; успешный reset обычно отзывает активные sessions.
## Пример из моих проектов

В Nest Starter [`Argon2PasswordHasher`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/infrastructure/argon2-password.hasher.ts) фиксирует Argon2id policy и `needsRehash`. [`LoginUseCase`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/application/login.use-case.ts) использует dummy hash для неизвестного аккаунта и generic failure. [`RedisLoginRateLimiter`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/infrastructure/redis-login-rate-limiter.ts) ограничивает IP и HMAC account key.

## Частые уточнения

**Зачем pepper?** Отдельный server secret усложняет offline cracking при утечке только базы, но требует безопасного хранения/rotation и не заменяет salt/hash.

**Как проверить эту защиту?** Добавить негативный integration/e2e-сценарий, проверить отказ на server side и убедиться, что response и logs не раскрывают чувствительные данные.

## Где ошибаются

Одинаковый текст ответа не гарантирует отсутствие enumeration: отличаются timing, status, headers, email side effect. Response floor снижает сигнал, но не является математической гарантией.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Backend Interview Questions 2026](https://mortit.com/blog/backend-developer-interview-questions)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP: Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
