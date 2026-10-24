---
id: HTTP-06
category: http-api
frequency: high
week_priority: extended
selection_sources: [roadmap-rest, backend-guide]
projects: [amazing-ekb]
project_evidence: implemented
---

# Pagination, filtering и sorting

## Вопрос

Как спроектировать pagination, filtering и sorting; когда offset, а когда cursor?

## Короткий ответ

Я начинаю со стабильного порядка: без явного `ORDER BY` страницы недетерминированы. Для небольшого каталога и перехода на конкретную страницу подходит page/limit или offset/limit, но на больших и быстро меняющихся таблицах offset дорожает и может давать пропуски и дубли. Тогда лучше cursor/keyset pagination по уникальному устойчивому набору полей, например `created_at, id`. Размер страницы ограничиваю сверху, фильтры разрешаю по whitelist и нормализую, а сортировку не подставляю в SQL напрямую из строки клиента. В ответе возвращаю элементы и данные навигации; total count добавляю только если его стоимость и продуктовая польза оправданы.

## Разбор

Offset pagination проста: `LIMIT 20 OFFSET 200`, но база всё равно должна пройти пропущенные строки. При вставках между запросами границы смещаются. Keyset вариант использует условие вида:

На собеседовании важно сначала назвать семантику контракта, затем один пограничный случай и только после этого implementation detail. Поведение фиксируют OpenAPI/contract tests и проверяют реальным HTTP-запросом.

## Пример из моих проектов

В Amazing EKB [`ListPlacesQueryDto`](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/places/presentation/http/dto/list-places-query.dto.ts) валидирует `page`, `pageSize`, `search` и `categoryId`, включая верхний предел page size. [`PlacesController.list`](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/places/presentation/http/places.controller.ts) передаёт нормализованные параметры в use case.

## Частые уточнения

**Почему cursor должен включать `id`?** Поле сортировки часто не уникально; `id` создаёт полный детерминированный порядок и не теряет строки с одинаковым timestamp.

**Как закрепить это в API contract?** Документировать вход, успешный ответ, ошибки и пограничную семантику, затем проверить contract или e2e-тестом.

## Где ошибаются

Keyset не всегда лучше: он неудобен для перехода сразу на страницу 57 и требует согласованного cursor contract. Page pagination Amazing EKB не следует описывать как cursor-based.

## Источники

- [Roadmap.sh: REST API questions](https://roadmap.sh/questions/rest-api)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [HTTP Semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)
- [PostgreSQL: LIMIT and OFFSET](https://www.postgresql.org/docs/current/queries-limit.html)
