---
id: SEC-04
category: security-auth
frequency: high
week_priority: extended
selection_sources: [backend-bank, security-guide]
projects: [nest-starter, planner]
project_evidence: implemented
---

# SOP, CORS, CSRF и XSS

## Вопрос

Как связаны Same-Origin Policy, CORS, CSRF и XSS и за какую часть отвечает backend?

## Короткий ответ

Same-Origin Policy ограничивает чтение ответов и доступ между origins в браузере. CORS — серверное разрешение ослабить это ограничение для выбранных origins; он не является authentication и не запрещает сервер-сервер запрос. CSRF заставляет браузер отправить cookie на unsafe request с чужого сайта, поэтому я проверяю exact Origin/Referer, требую custom session-bound CSRF token и ограничиваю content type, а cookie задаю SameSite. XSS — выполнение чужого script в доверенном origin; оно может выполнять действия от имени пользователя и читать всё, кроме HttpOnly credential, поэтому нужны escaping, безопасные DOM/API, CSP и отсутствие опасного raw HTML. Эти меры дополняют, а не заменяют друг друга.

## Разбор

Credentialed CORS нельзя сочетать с `Access-Control-Allow-Origin: *`: нужен exact origin и `Vary: Origin` при динамическом ответе. Но даже запрещённый CORS не всегда мешает браузеру отправить «simple» request — он главным образом блокирует чтение response, поэтому CSRF остаётся.

Security-механизм оценивают по threat model: какой attacker, какой asset и какую границу он закрывает. Затем нужны negative tests и безопасная наблюдаемость, не раскрывающая credential или PII.

## Пример из моих проектов

В Nest Starter [`createCorsOptions`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/http/bootstrap/cors-options.ts) разрешает credentialed запросы только exact origins. [`BrowserOriginGuard`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/presentation/browser-origin.guard.ts) для unsafe requests требует JSON и trusted origin, а [`SessionCsrfGuard`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/presentation/session-csrf.guard.ts) проверяет session-bound token constant-time. Cookie attributes принадлежат [`AuthCookieAdapter`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/presentation/auth-cookie.adapter.ts).

## Частые уточнения

**Защитит ли CORS от curl?** Нет. CORS исполняется браузером; сервер обязан сам проверять authentication/authorization.

**Как проверить эту защиту?** Добавить негативный integration/e2e-сценарий, проверить отказ на server side и убедиться, что response и logs не раскрывают чувствительные данные.

## Где ошибаются

Origin allowlist нельзя проверять через `endsWith('example.com')`: это допускает чужие hosts. CSRF не относится к bearer token в Authorization header, который браузер сам не прикладывает, но XSS всё равно может его украсть из JS storage.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Backend Interview Questions 2026](https://mortit.com/blog/backend-developer-interview-questions)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [MDN: Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
