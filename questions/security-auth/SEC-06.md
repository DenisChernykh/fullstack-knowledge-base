---
id: SEC-06
category: security-auth
frequency: high
week_priority: extended
selection_sources: [backend-bank, security-guide]
---

# OAuth 2.0 и OpenID Connect

## Вопрос

Чем OAuth 2.0 отличается от OpenID Connect и чем access token отличается от ID token?

## Короткий ответ

OAuth 2.0 — framework делегированной authorization: client получает access token с ограниченным scope для вызова resource server. Он сам по себе не определяет вход пользователя и формат identity. OpenID Connect добавляет поверх OAuth authentication layer, ID token и UserInfo, чтобы client мог установить identity пользователя. Access token предназначен API и проверяется resource server; ID token предназначен конкретному client и сообщает результат authentication. Нельзя отправлять ID token вместо access token в произвольный API. Для browser/public client обычно используют Authorization Code с PKCE, проверяя issuer, audience, signature, state и nonce по назначению.

## Разбор

- Роли OAuth: resource owner, client, authorization server и resource server. Client credentials flow не представляет пользователя.
- Scope ограничивает разрешённые операции, но конкретная ownership/business authorization всё равно выполняется API.
- ID token — утверждение для client; access token может быть JWT или opaque и не обязан быть читаемым client.
- PKCE связывает authorization request и token exchange, state защищает flow от подмены, nonce связывает OIDC response.

## Частые уточнения

**JWT обязателен для OAuth?** Нет. Access token может быть opaque, а authorization server предоставляет introspection или другую проверку.

**Можно ли использовать ID token для API?** Нет, если API не является его audience и contract не определяет это явно. Обычно API принимает access token.

**Что проверяет resource server в JWT?** Подпись, issuer, audience, срок действия и необходимые claims/scopes согласно contract.

## Где ошибаются

Частые ошибки — называть OAuth протоколом authentication, путать ID и access token и считать наличие scope полной заменой business authorization.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Backend Interview Questions 2026](https://mortit.com/blog/backend-developer-interview-questions)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
