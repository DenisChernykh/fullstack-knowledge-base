---
id: NEST-06
category: nestjs
frequency: very-high
week_priority: top-40
selection_sources: [nest-guide-a, nest-guide-b, candidate-reports]
projects: [nest-starter, amazing-ekb]
project_evidence: implemented
---

# ValidationPipe и DTO

## Вопрос

Как настроить DTO runtime validation и transformation через ValidationPipe и что дают whitelist, forbidNonWhitelisted и transform?

## Короткий ответ

TypeScript проверяет код до запуска и затем стирает типы. JSON из HTTP, env, базы, Redis, очереди или стороннего API в runtime остаётся `unknown`, даже если разработчик написал `as User`. Поэтому на каждой внешней или persistence boundary я сначала декодирую и валидирую значение, а уже после этого превращаю его в trusted type. DTO/class-validator удобны для Nest HTTP, Joi или Zod — для env и произвольных payload, ручной codec — для versioned Redis record. Внутри валидированной границы типы уменьшают количество повторных проверок, но критические доменные инварианты всё равно должны защищаться runtime-кодом и constraints базы.

## Разбор

Опасные конструкции:

Механизм Nest нужно привязать к composition root и request lifecycle: где он регистрируется, в каком scope живёт и какую ошибку или значение видит следующий этап. Это проверяют узким TestingModule или HTTP e2e в зависимости от риска.


- whitelist удаляет поля без validation decorators, forbidNonWhitelisted превращает их в ошибку, transform создаёт DTO/преобразует primitive values по настройкам.
- transform не делает небезопасное значение корректным: после преобразования validators всё равно должны проверить диапазон и формат.
- Глобальный pipe защищает обычные routes, но custom decorators, raw body и manual parsing требуют отдельного аудита.
## Пример из моих проектов

В Nest Starter [`runtime-environment.schema.ts`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/config/runtime-environment.schema.ts) валидирует URL, CIDR, origins, secrets и числовые пределы до сборки runtime config. HTTP DTO проверяются глобальным `ValidationPipe`. В Amazing EKB [`ListPlacesQueryDto`](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/places/presentation/http/dto/list-places-query.dto.ts) выполняет runtime-проверки query.

## Частые уточнения

**Чем `unknown` лучше `any`?** `unknown` заставляет сузить или проверить значение перед использованием; `any` отключает проверку типов.

**Как проверить реальный wiring Nest?** Собрать минимальный TestingModule, а transport/lifecycle поведение подтвердить через поднятое NestApplication и HTTP-запрос.

## Где ошибаются

Нельзя говорить, что decorator DTO автоматически валидирует всё: нужен подключённый pipe, metadata и корректная настройка transformation. `as` и generic parameter у `fetch<T>` не являются валидацией.

## Источники

- [NestJS Interview Questions](https://devencyclopedia.com/blog/nestjs-interview-questions)
- [NestJS interview guide](https://www.tutorialslogic.com/interview-questions/nestjs)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [NestJS documentation](https://docs.nestjs.com/)
- [TypeScript Handbook: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
