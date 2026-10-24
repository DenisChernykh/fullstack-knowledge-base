---
id: HTTP-08
category: http-api
frequency: high
week_priority: extended
selection_sources: [roadmap-rest, backend-guide]
projects: [nest-starter]
project_evidence: implemented
---

# HTTP caching и ETag

## Вопрос

Как работают Cache-Control, ETag, If-None-Match и 304 и что именно можно кэшировать?

## Короткий ответ

Кэширование задаётся не самим GET, а директивами `Cache-Control`, validators и правилами shared/private cache. ETag — идентификатор конкретного представления. При повторном GET клиент отправляет `If-None-Match`; если представление не изменилось, сервер возвращает `304` без body. Для конкурентных mutation тот же механизм можно использовать как precondition: клиент читает ETag, отправляет `If-Match`, а сервер изменяет ресурс только если версия совпала; иначе возвращает `412 Precondition Failed`. Strong ETag означает побайтовую эквивалентность представления, weak — семантическую. Я разделяю freshness-кэширование и optimistic concurrency: они связаны validators, но решают разные задачи.

## Разбор

Ключевые элементы:

На собеседовании важно сначала назвать семантику контракта, затем один пограничный случай и только после этого implementation detail. Поведение фиксируют OpenAPI/contract tests и проверяют реальным HTTP-запросом.


- Cache-Control задаёт, кто и сколько может хранить response; private запрещает shared cache использовать персональный ответ.
- ETag — validator конкретного representation. Клиент отправляет If-None-Match, и сервер может вернуть 304 без body.
- Персональные данные, authorization и Vary требуют аккуратного cache key; 304 не означает, что server вообще не выполнял проверку.
## Пример из моих проектов

В Nest Starter [`AdminAccountController`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/presentation/admin-account.controller.ts) возвращает `ETag` при чтении account и требует `If-Match` для изменения status, roles и retire. Application service проверяет precondition перед mutation.

## Частые уточнения

**`304` содержит body?** Нет; клиент использует сохранённое представление и обновляет metadata согласно ответу.

**Как закрепить это в API contract?** Документировать вход, успешный ответ, ошибки и пограничную семантику, затем проверить contract или e2e-тестом.

## Где ошибаются

ETag не является автоматически хешем и не обязан раскрывать version. Нельзя путать `no-cache` с `no-store`, weak ETag использовать для range requests как strong validator или заявлять, что account example реализует полноценный CDN cache.

## Источники

- [Roadmap.sh: REST API questions](https://roadmap.sh/questions/rest-api)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [HTTP Caching, RFC 9111](https://www.rfc-editor.org/rfc/rfc9111)
- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111)
