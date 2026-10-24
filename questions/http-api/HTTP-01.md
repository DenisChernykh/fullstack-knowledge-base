---
id: HTTP-01
category: http-api
frequency: very-high
week_priority: top-40
selection_sources: [roadmap-rest, roadmap-backend, backend-guide]
projects: [nest-starter]
project_evidence: implemented
---

# HTTP request и response

## Вопрос

Из каких частей состоят HTTP request и response и как проходит обычный request-response cycle?

## Короткий ответ

Сначала сервер принимает соединение и разбирает HTTP-заголовки и тело с заданными лимитами и таймаутами. Затем запрос проходит общие middleware: там удобно создать request ID, применить CORS, security headers и логирование. В NestJS после middleware обычно идут guards, затем interceptors до обработчика, pipes для преобразования и валидации аргументов, controller и вызываемые им application services. Ответ проходит обратную часть interceptor. Необработанная ошибка попадает в exception filter. Я стараюсь, чтобы каждая стадия решала одну задачу, а бизнес-правила оставались в use case, а не размазывались по HTTP-конвейеру.

## Разбор

Полезно разделять четыре уровня:

На собеседовании важно сначала назвать семантику контракта, затем один пограничный случай и только после этого implementation detail. Поведение фиксируют OpenAPI/contract tests и проверяют реальным HTTP-запросом.


- Клиент резолвит адрес, устанавливает TCP/TLS-соединение, отправляет method, target, headers и необязательное body.
- Reverse proxy и middleware могут завершить запрос раньше controller; дальше handler вызывает application и infrastructure layers.
- Response состоит из status, headers и body; после отправки клиент ещё может кэшировать результат или повторить запрос по явно заданной политике.
## Пример из моих проектов

В Nest Starter функция [`configureHttpApplication`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/http/bootstrap/configure-http-application.ts) последовательно подключает request context, access log, Helmet, CORS, traffic gate, cookie/body parsing, глобальный `ValidationPipe` и server timeouts. В [`AuthModule`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/composition/auth.module.ts) глобальные guards зарегистрированы в порядке authentication → origin → CSRF → permission. [`ProblemExceptionFilter`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/http/errors/problem-exception.filter.ts) является последней HTTP-границей ошибок.

## Частые уточнения

**Где лучше измерять полную длительность запроса?** В раннем middleware или глобальном interceptor, который видит начало и завершение; важно также обработать ошибку и обрыв соединения.

**Как закрепить это в API contract?** Документировать вход, успешный ответ, ошибки и пограничную семантику, затем проверить contract или e2e-тестом.

## Где ошибаются

Нельзя механически повторять один порядок для всех фреймворков и адаптеров. Также неверно утверждать, что pipes выполняются раньше guards: в стандартном Nest lifecycle guards идут раньше, а pipes подготавливают аргументы непосредственно перед handler.

## Источники

- [Roadmap.sh: REST API questions](https://roadmap.sh/questions/rest-api)
- [Roadmap.sh: Backend questions](https://roadmap.sh/questions/backend)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [HTTP Semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)
- [NestJS: Request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
