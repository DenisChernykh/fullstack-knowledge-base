---
id: NEST-02
category: nestjs
frequency: very-high
week_priority: top-40
selection_sources: [nest-guide-a, nest-guide-b, candidate-reports]
projects: [nest-starter, planner]
project_evidence: implemented
---

# Modules, controllers и providers

## Вопрос

Как связаны module, controller и provider; что означают imports, controllers, providers и exports?

## Короткий ответ

Module задаёт границу композиции: какие providers и controllers принадлежат capability, что модуль импортирует и что экспортирует наружу. Provider — объект, factory или value, которым управляет Nest container. Зависимости лучше принимать в constructor, а реализацию инфраструктуры связывать с application port через token: use case зависит от `SESSION_STORE` или repository interface, а module решает, будет это Redis, Prisma или test double. Это упрощает тестирование и сохраняет направление зависимостей. Но DI не должна скрывать случайный service locator: composition root должен быть читаемым, exports — минимальными, а бизнес-код не должен получать весь container.

## Разбор

Основные формы provider:

Механизм Nest нужно привязать к composition root и request lifecycle: где он регистрируется, в каком scope живёт и какую ошибку или значение видит следующий этап. Это проверяют узким TestingModule или HTTP e2e в зависимости от риска.


- controllers перечисляются отдельно и принимают transport input; providers создаются DI container и содержат services/adapters.
- imports делают exports другого module доступными, а exports формируют публичный API текущего module.
- Provider, который просто объявлен в соседнем module, не становится глобальным; его нужно экспортировать и импортировать через явную границу.
## Пример из моих проектов

В Nest Starter [`AuthModule`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/composition/auth.module.ts) связывает `PASSWORD_HASHER` с `Argon2PasswordHasher`, `SESSION_STORE` с `RedisSessionStore`, а `AUTH_PERSISTENCE` с `PrismaAuthRepository`; runtime config передаётся через factories. В Planner [`ApiModule.forRoot`](/Users/denischernykh/projects/planner/src/bootstrap/api/api.module.ts) является composition root модулей и platform capabilities.

## Частые уточнения

**Почему interface не может быть injection token?** Он существует только при type checking и стирается из JavaScript output.

**Как проверить реальный wiring Nest?** Собрать минимальный TestingModule, а transport/lifecycle поведение подтвердить через поднятое NestApplication и HTTP-запрос.

## Где ошибаются

Не каждая зависимость требует interface и token. Абстракция ради абстракции усложняет навигацию. Также `private` в TypeScript constructor не делает provider недоступным другим modules, если он экспортирован.

## Источники

- [NestJS Interview Questions](https://devencyclopedia.com/blog/nestjs-interview-questions)
- [NestJS interview guide](https://www.tutorialslogic.com/interview-questions/nestjs)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [NestJS documentation](https://docs.nestjs.com/)
- [NestJS: Providers](https://docs.nestjs.com/providers)
