---
id: NEST-05
category: nestjs
frequency: very-high
week_priority: top-40
selection_sources: [nest-guide-a, nest-guide-b, candidate-reports]
---

# Middleware, guard, pipe, interceptor и filter

## Вопрос

Когда использовать middleware, guard, pipe, interceptor и exception filter? Приведите по одному примеру.

## Короткий ответ

Middleware работает до route context и подходит для transport-level подготовки, например request ID или базового логирования. Guard решает, можно ли выполнять handler: authentication, role или ownership precondition. Pipe валидирует и преобразует конкретные arguments. Interceptor оборачивает выполнение handler и удобен для timing, response mapping или cache, потому что видит поток до и после. Exception filter превращает выброшенную ошибку в transport response. Выбор определяется ответственностью, а не желанием поместить всю cross-cutting логику в один interceptor. Бизнес-правило, которому нужны данные и транзакция, обычно остаётся в application service.

## Разбор

- Middleware ближе к Express/Fastify pipeline и не знает metadata конкретного handler так удобно, как guard/interceptor.
- Guard возвращает boolean или бросает exception; он выполняется до pipes, поэтому не должен рассчитывать на уже преобразованный DTO.
- Pipe работает с route argument и может вернуть преобразованное значение либо остановить запрос validation exception.
- Interceptor использует Observable pipeline и выполняет post-handler часть в обратном порядке; filter применяется при исключении.

## Частые уточнения

**Где проверять ownership?** Простая проверка по уже доступному контексту может быть guard, но запрос данных и бизнес-инвариант часто лучше выполнять в application layer.

**Где добавить request ID?** Обычно в middleware или adapter hook как можно раньше, затем передать через request context и логи.

**Можно ли валидировать body в guard?** Технически можно, но pipe лучше выражает validation/transformation arguments и сохраняет ясный lifecycle.

## Где ошибаются

Нельзя считать эти механизмы взаимозаменяемыми или ожидать, что pipe уже отработал внутри guard. Ещё одна ошибка — выполнять в interceptor скрытую бизнес-транзакцию, которую невозможно увидеть из use case.

## Источники

- [NestJS Interview Questions](https://devencyclopedia.com/blog/nestjs-interview-questions)
- [NestJS interview guide](https://www.tutorialslogic.com/interview-questions/nestjs)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [NestJS documentation](https://docs.nestjs.com/)
