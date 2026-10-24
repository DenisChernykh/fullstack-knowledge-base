---
id: NEST-01
category: nestjs
frequency: very-high
week_priority: extended
selection_sources: [nest-guide-a, nest-guide-b, candidate-reports]
---

# NestJS поверх Express или Fastify

## Вопрос

Что NestJS добавляет поверх Express или Fastify и когда эта структура оправдана?

## Короткий ответ

Express и Fastify прежде всего дают HTTP transport, routing и middleware-модель. NestJS добавляет поверх выбранного adapter модульную структуру, dependency injection container, decorators, единый lifecycle для guards, pipes, interceptors и exception filters, а также интеграции для тестирования и других transport. Это снижает разнобой в большой кодовой базе и делает зависимости явнее. Цена — дополнительные abstractions, metadata и правила framework. Для маленького одноразового handler Nest может быть избыточен; для долгоживущего сервиса с несколькими модулями, общей политикой валидации и командой разработчиков структура обычно окупается.

## Разбор

- Nest не заменяет Node runtime и HTTP adapter: по умолчанию он использует Express, альтернативно Fastify.
- Framework задаёт composition root через modules/providers и стандартные места для cross-cutting concerns.
- DI упрощает подмену ports в unit-тесте, но не гарантирует хорошую архитектуру: в provider всё ещё можно сложить весь бизнес-код.
- Выбор оценивают по сложности приложения и команды, а не по обещанию автоматической производительности.

## Частые уточнения

**Можно ли сменить Express на Fastify без изменений?** Adapter abstraction помогает, но код, зависящий от Express Request/Response или middleware, придётся адаптировать.

**Nest подходит только для REST?** Нет. Он поддерживает WebSockets, microservice transports, GraphQL и standalone application context.

## Где ошибаются

Не стоит называть Nest отдельным web server или обещать, что DI автоматически делает код чистым. Также неверно выбирать его только потому, что decorators похожи на другой framework.

## Источники

- [NestJS Interview Questions](https://devencyclopedia.com/blog/nestjs-interview-questions)
- [NestJS interview guide](https://www.tutorialslogic.com/interview-questions/nestjs)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [NestJS documentation](https://docs.nestjs.com/)
