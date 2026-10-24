---
id: NEST-09
category: nestjs
frequency: very-high
week_priority: top-40
selection_sources: [nest-guide-a, nest-guide-b, candidate-reports]
projects: [nest-starter, planner]
project_evidence: implemented
---

# Ошибки и exception filters

## Вопрос

Как централизованно маппить ошибки в HTTP и где проходит граница ожидаемой и неожиданной ошибки?

## Короткий ответ

Я не бросаю `HttpException` из домена. Domain и application layer используют ограниченный набор typed errors со стабильным внутренним code и безопасными данными. На HTTP boundary mapper проецирует известную ошибку в согласованный error response и status. Неизвестная ошибка становится общим `500`, но оригинал с cause попадает во внутренний structured log после redaction. Exception filter — единая последняя точка формирования ответа, но он не должен угадывать бизнес-смысл по тексту сообщения. Ошибки зависимостей классифицирую явно: временная недоступность может стать `503`, конфликт revision — `409/412`, а programmer error не превращаю в «validation failed».

## Разбор

Хорошая error model отделяет:

Механизм Nest нужно привязать к composition root и request lifecycle: где он регистрируется, в каком scope живёт и какую ошибку или значение видит следующий этап. Это проверяют узким TestingModule или HTTP e2e в зависимости от риска.


- Expected application errors имеют стабильный code и безопасные данные; mapper задаёт status и публичное тело.
- Programmer error или неизвестный exception получает общий 500, а подробный cause остаётся только в redacted structured log.
- Filter не должен сравнивать тексты сообщений: mapping опирается на тип или стабильный error code и покрывается HTTP e2e-тестом.
## Пример из моих проектов

В Nest Starter [`ProblemExceptionFilter`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/http/errors/problem-exception.filter.ts) является общей RFC 9457 границей, а [`HttpProblemRegistry`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/http/errors/http-problem.registry.ts) агрегирует module mappings. В Planner [`ApiModule.forRoot`](/Users/denischernykh/projects/planner/src/bootstrap/api/api.module.ts) явно передаёт core/auth/planning/tracking contributions.

## Частые уточнения

**Нужно ли логировать каждый `404` как error?** Обычно нет: ожидаемые client outcomes дают метрику/access log; unexpected `5xx` требуют error record.

**Как проверить реальный wiring Nest?** Собрать минимальный TestingModule, а transport/lifecycle поведение подтвердить через поднятое NestApplication и HTTP-запрос.

## Где ошибаются

Нельзя отдавать `error.message` неизвестной ошибки клиенту. И не всякая ошибка базы — `503`: unique conflict, serialization failure и connection outage имеют разную семантику.

## Источники

- [NestJS Interview Questions](https://devencyclopedia.com/blog/nestjs-interview-questions)
- [NestJS interview guide](https://www.tutorialslogic.com/interview-questions/nestjs)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [NestJS documentation](https://docs.nestjs.com/)
- [NestJS: Exception filters](https://docs.nestjs.com/exception-filters)
