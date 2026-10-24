---
id: NEST-08
category: nestjs
frequency: very-high
week_priority: extended
selection_sources: [nest-guide-a, nest-guide-b, candidate-reports]
projects: [nest-starter, planner]
project_evidence: tested-in-repo
---

# Circular dependencies

## Вопрос

Откуда берутся circular dependencies, когда допустим forwardRef и почему обычно лучше изменить module boundary?

## Короткий ответ

Цикл обычно показывает, что границы ответственности выбраны неудачно: модуль A знает внутренности B, а B — внутренности A, либо два services координируют один общий процесс. `forwardRef` может разорвать техническую проблему загрузки, но сохраняет архитектурную связанность и усложняет initialization/tests. Я сначала выделяю orchestration use case выше обоих модулей, переношу общий value/contract в нейтральный слой или публикую узкий port/public API. Межмодульный import должен идти через стабильную границу, а domain/application не должны зависеть от presentation/infrastructure. Эти правила лучше проверять статически в CI, иначе случайный import быстро размывает структуру.

## Разбор

Типичные причины циклов:

Механизм Nest нужно привязать к composition root и request lifecycle: где он регистрируется, в каком scope живёт и какую ошибку или значение видит следующий этап. Это проверяют узким TestingModule или HTTP e2e в зависимости от риска.


- Цикл появляется, когда modules импортируют друг друга или providers одновременно требуют concrete implementation соседа.
- forwardRef откладывает resolution token, но сохраняет архитектурную взаимозависимость и усложняет порядок initialization.
- Чаще цикл разрывают application event, третьим orchestration module, переносом общего contract или изменением ownership use case.
## Пример из моих проектов

В Nest Starter [`.dependency-cruiser.cjs`](/Users/denischernykh/projects/starters/nest-js-starter/.dependency-cruiser.cjs) запрещает circular imports и направления domain/application/presentation/infrastructure, а `architecture:check` подключён в [`package.json`](/Users/denischernykh/projects/starters/nest-js-starter/package.json). Аналогичная архитектурная проверка есть в Planner.

## Частые уточнения

**Когда `forwardRef` допустим?** Как локальная временная мера или для действительно взаимного framework graph после явного анализа; долгосрочно лучше устранить цикл ответственности.

**Как проверить реальный wiring Nest?** Собрать минимальный TestingModule, а transport/lifecycle поведение подтвердить через поднятое NestApplication и HTTP-запрос.

## Где ошибаются

Отсутствие import cycle не гарантирует хорошую архитектуру. Можно создать god-module без циклов. И `forwardRef` не делает dependency lazy в бизнес-смысле — он лишь помогает container разрешить ссылки.

## Источники

- [NestJS Interview Questions](https://devencyclopedia.com/blog/nestjs-interview-questions)
- [NestJS interview guide](https://www.tutorialslogic.com/interview-questions/nestjs)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [NestJS documentation](https://docs.nestjs.com/)
- [NestJS: Circular dependency](https://docs.nestjs.com/fundamentals/circular-dependency)
