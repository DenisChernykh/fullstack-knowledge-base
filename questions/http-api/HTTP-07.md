---
id: HTTP-07
category: http-api
frequency: high
week_priority: extended
selection_sources: [roadmap-rest, backend-guide]
projects: [amazing-ekb]
project_evidence: tested-in-repo
---

# Совместимость API

## Вопрос

Как менять API без поломки клиентов; когда нужна новая версия, а когда additive change и deprecation?

## Короткий ответ

Версия нужна не при каждом изменении, а когда старый consumer нельзя сохранить разумной миграцией. Обычно добавление endpoint или необязательного поля обратно совместимо; удаление, переименование, изменение смысла, типа, обязательности, status code или стабильного error code — breaking change. Я предпочитаю сначала additive evolution: сервер начинает отдавать новое необязательное поле, клиенты учатся его понимать, затем старое поле выводится из употребления. OpenAPI фиксирует контракт, generated clients уменьшают ручной drift, а CI сравнивает сгенерированный artifact. Но схема не доказывает поведенческую совместимость, поэтому нужны contract/e2e tests и согласованный rollout производителей и потребителей.

## Разбор

Возможные стратегии — version в URL, header/media type или отдельные операции. URL `/v1` проще видеть и маршрутизировать, но сам префикс не решает миграцию данных и consumers.

На собеседовании важно сначала назвать семантику контракта, затем один пограничный случай и только после этого implementation detail. Поведение фиксируют OpenAPI/contract tests и проверяют реальным HTTP-запросом.

## Пример из моих проектов

В Amazing EKB [`API Versioning Policy`](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/docs/api/versioning-policy.md) фиксирует `/v1`, source of truth и критерии breaking changes. В [`package.json`](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/package.json) `openapi:drift` входит в foundation gate, а тест [`check-openapi-drift.spec.ts`](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/test/unit/scripts/openapi/check-openapi-drift.spec.ts) проверяет этот механизм.

## Частые уточнения

**Добавление поля всегда безопасно?** Только необязательного и если клиенты допускают неизвестные поля. Строгая runtime-схема consumer может его отклонить.

**Как закрепить это в API contract?** Документировать вход, успешный ответ, ошибки и пограничную семантику, затем проверить contract или e2e-тестом.

## Где ошибаются

OpenAPI diff не понимает весь бизнес-смысл. Изменение сортировки, authorization policy или единиц измерения может быть breaking без изменения JSON schema. И нельзя утверждать, что coordinated migration была бесшовной без runtime/consumer evidence.

## Источники

- [Roadmap.sh: REST API questions](https://roadmap.sh/questions/rest-api)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [HTTP Semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
