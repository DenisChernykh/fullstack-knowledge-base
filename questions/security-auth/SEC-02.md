---
id: SEC-02
category: security-auth
frequency: very-high
week_priority: top-40
selection_sources: [backend-bank, security-guide, employer-guide]
projects: [nest-starter, planner]
project_evidence: implemented
---

# Server session и JWT

## Вопрос

Когда выбрать server-side session, а когда JWT, и какие компромиссы у обоих подходов?

## Короткий ответ

Для браузерного внутреннего сервиса я обычно выбираю opaque random session token в HttpOnly cookie, а session record храню в Redis. Сервер легко отзывает одну или все sessions, обновляет idle timeout и загружает свежие permissions; цена — общая session storage и её доступность. JWT полезен между сервисами или там, где verifier должен автономно проверять подписанные claims, но token до `exp` остаётся действительным, если нет denylist/version check, сложнее немедленно отозвать права, а payload не зашифрован. JWT не отменяет CSRF при cookie transport и не должен храниться в `localStorage` как универсальное решение. Выбор зависит от threat model, topology и требований к revocation.

## Разбор

Opaque session flow:

Security-механизм оценивают по threat model: какой attacker, какой asset и какую границу он закрывает. Затем нужны negative tests и безопасная наблюдаемость, не раскрывающая credential или PII.


- Opaque session хранит состояние и revocation server-side, а browser получает случайный token в защищённой cookie.
- JWT позволяет resource server проверять подписанные claims без lookup, но revocation и изменение permissions становятся сложнее до истечения token.
- В обоих случаях нужны expiry, rotation/revocation policy, защита transport и корректное хранение token на клиенте.
## Пример из моих проектов

В Nest Starter [`RedisSessionStore`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/infrastructure/redis-session.store.ts) выдаёт opaque token, хранит digest-addressed record с idle и absolute expiry и поддерживает revocation. [`AuthCookieAdapter`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/presentation/auth-cookie.adapter.ts) устанавливает host-only HttpOnly/SameSite cookie. В Planner используется та же server-side session модель.

## Частые уточнения

**Почему не хранить raw token в Redis key?** При утечке key listing он сам станет credential; keyed digest снижает этот риск.

**Как проверить эту защиту?** Добавить негативный integration/e2e-сценарий, проверить отказ на server side и убедиться, что response и logs не раскрывают чувствительные данные.

## Где ошибаются

JWT не является шифрованием: payload base64url-кодирован и читаем. Opaque session тоже не автоматически безопасна — нужны entropy, expiry, fixation protection, cookie policy, shared store и fail-closed handling.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Backend Interview Questions 2026](https://mortit.com/blog/backend-developer-interview-questions)
- [Microsoft technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP: Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
