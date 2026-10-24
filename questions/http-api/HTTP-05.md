---
id: HTTP-05
category: http-api
frequency: very-high
week_priority: top-40
selection_sources: [roadmap-rest, roadmap-backend, backend-guide]
projects: [nest-starter, amazing-ekb]
project_evidence: implemented
---

# Валидация HTTP-входа

## Вопрос

Что и где валидировать в path params, query и body и почему TypeScript не защищает runtime boundary?

## Короткий ответ

HTTP boundary должна считать недоверенными body, path, query, headers и файлы. Сначала я ограничиваю объём и допустимый media type, затем преобразую только явно разрешённые значения и проверяю DTO: тип, формат, диапазон, длину, enum и отсутствие неизвестных полей. Но DTO отвечает только за форму запроса. Бизнес-инварианты — например, можно ли публиковать именно эту версию плана — проверяет application/domain layer, а уникальность и гонки окончательно защищают constraints и транзакции базы. TypeScript-интерфейс здесь ничего не гарантирует, потому что после компиляции тип исчезает.

## Разбор

Полезный порядок защиты:

На собеседовании важно сначала назвать семантику контракта, затем один пограничный случай и только после этого implementation detail. Поведение фиксируют OpenAPI/contract tests и проверяют реальным HTTP-запросом.


- Path params проверяют на формат identifier, query — на типы, диапазоны, whitelist сортировки и лимиты, body — на shape и бизнес-допустимые значения.
- Неизвестные поля лучше отклонять или удалять по согласованной политике, чтобы избежать mass assignment и тихих опечаток.
- После DTO validation application layer всё равно проверяет authorization и domain invariants, а БД — конкурентные constraints.
## Пример из моих проектов

В Nest Starter [`configureHttpApplication`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/http/bootstrap/configure-http-application.ts) задаёт body limits и глобальный `ValidationPipe` с `whitelist`, `forbidNonWhitelisted`, `forbidUnknownValues` и без неявного conversion. В Amazing EKB [`ListPlacesQueryDto`](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/places/presentation/http/dto/list-places-query.dto.ts) явно ограничивает page/pageSize/search. Это transport validation; доменные проверки всё равно выполняются ниже.

## Частые уточнения

**Почему не доверять сгенерированному TypeScript client?** Клиент можно обойти, он может быть устаревшим, а TypeScript не валидирует runtime JSON.

**Как закрепить это в API contract?** Документировать вход, успешный ответ, ошибки и пограничную семантику, затем проверить contract или e2e-тестом.

## Где ошибаются

Нельзя считать `class-validator` полной защитой: он не заменяет лимиты до парсинга, авторизацию, SQL constraints и проверку файлов по содержимому. Также опасно возвращать в ошибке весь исходный body.

## Источники

- [Roadmap.sh: REST API questions](https://roadmap.sh/questions/rest-api)
- [Roadmap.sh: Backend questions](https://roadmap.sh/questions/backend)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [HTTP Semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)
- [NestJS: Validation](https://docs.nestjs.com/techniques/validation)
