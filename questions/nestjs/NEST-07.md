---
id: NEST-07
category: nestjs
frequency: high
week_priority: extended
selection_sources: [nest-guide-a, nest-guide-b]
---

# Provider scopes

## Вопрос

Какие provider scopes есть в Nest и почему REQUEST scope может распространяться по dependency graph?

## Короткий ответ

По умолчанию Nest provider — singleton: один instance живёт в application context, поэтому он должен быть stateless или владеть явно process-wide resource. Request-scoped provider создаётся для каждого входящего запроса; если singleton зависит от request-scoped provider, scope может подняться по графу и увеличить число allocations и стоимость DI. Transient создаёт отдельный instance для каждого consumer. Request scope полезен для действительно request-owned mutable state, но простой request ID часто можно передавать через явный request context, оставляя services singleton. Данные одного пользователя нельзя сохранять в mutable field singleton.

## Разбор

Примеры:

Механизм Nest нужно привязать к composition root и request lifecycle: где он регистрируется, в каком scope живёт и какую ошибку или значение видит следующий этап. Это проверяют узким TestingModule или HTTP e2e в зависимости от риска.


- DEFAULT scope создаёт singleton на application context; REQUEST — instance на запрос; TRANSIENT — отдельный instance для каждого consumer.
- Если singleton зависит от request-scoped provider, он также становится request-scoped по цепочке, что увеличивает allocations.
- Request scope выбирают для настоящего request-owned state, а не как универсальный способ передать пару полей контекста.
## Частые уточнения

**Можно ли хранить текущего пользователя в поле singleton service?** Нет: конкурентные запросы перезапишут друг друга. Передавать principal явно или использовать корректный request context.

**Как проверить реальный wiring Nest?** Собрать минимальный TestingModule, а transport/lifecycle поведение подтвердить через поднятое NestApplication и HTTP-запрос.

## Где ошибаются

Request scope не «запрещён» и не обязательно медленный для любого сервиса; цена зависит от графа и нагрузки. Также singleton provider может безопасно владеть connection pool, но не данными текущего запроса.

## Источники

- [NestJS Interview Questions](https://devencyclopedia.com/blog/nestjs-interview-questions)
- [NestJS interview guide](https://www.tutorialslogic.com/interview-questions/nestjs)
- [NestJS documentation](https://docs.nestjs.com/)
- [NestJS: Injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
