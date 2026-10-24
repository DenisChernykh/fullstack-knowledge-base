---
id: NEST-04
category: nestjs
frequency: very-high
week_priority: top-40
selection_sources: [nest-guide-a, nest-guide-b, candidate-reports]
projects: [nest-starter]
project_evidence: implemented
---

# Nest request lifecycle

## Вопрос

Назовите реальный request lifecycle Nest: middleware, guards, interceptors, pipes, handler и filters.

## Короткий ответ

На входе Nest сначала пропускает запрос через middleware, затем guards, затем pre-handler часть interceptors, потом pipes для параметров и controller handler с providers. Ответ идёт обратно через post-handler часть interceptors. Если ошибка не обработана внутри, exception filter строит HTTP-ответ. Middleware подходит для низкоуровневого request context и логирования, guard — для решения «можно ли вызвать handler», pipe — для преобразования и валидации конкретного аргумента, interceptor — для сквозного поведения вокруг вызова, filter — для проекции ошибки. Я не помещаю бизнес-операцию в guard или interceptor, чтобы use case можно было вызвать не только через HTTP.

## Разбор

Внутри одного вида важна область регистрации: global → controller → route. Interceptor выполняется «стеком»: вход в порядке регистрации, выход — в обратном. Pipes применяются к аргументам handler после допуска guard. Filters не являются универсальным `finally`; они ловят исключения в зоне Nest и должны учитывать уже отправленный response.

Механизм Nest нужно привязать к composition root и request lifecycle: где он регистрируется, в каком scope живёт и какую ошибку или значение видит следующий этап. Это проверяют узким TestingModule или HTTP e2e в зависимости от риска.

## Пример из моих проектов

Nest Starter регистрирует transport middleware и `ValidationPipe` в [`configureHttpApplication`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/http/bootstrap/configure-http-application.ts). В [`AuthModule`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/composition/auth.module.ts) `APP_GUARD` идут authentication, browser origin, CSRF, permission, после них подключён `AuthRequestInterceptor`. Ошибки завершает [`ProblemExceptionFilter`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/http/errors/problem-exception.filter.ts).

## Частые уточнения

**Можно ли изменить ответ в interceptor?** Да, через RxJS pipeline, например `map`, но публичную форму лучше менять осознанно, чтобы не скрыть контракт controller.

**Как проверить реальный wiring Nest?** Собрать минимальный TestingModule, а transport/lifecycle поведение подтвердить через поднятое NestApplication и HTTP-запрос.

## Где ошибаются

Неверно ставить pipes до guards или считать filter заменой обработчика ошибок на уровне process/socket. Также нельзя рассчитывать на principal в permission guard, если порядок authentication не закреплён композицией и тестами.

## Источники

- [NestJS Interview Questions](https://devencyclopedia.com/blog/nestjs-interview-questions)
- [NestJS interview guide](https://www.tutorialslogic.com/interview-questions/nestjs)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [NestJS documentation](https://docs.nestjs.com/)
- [NestJS: Request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
