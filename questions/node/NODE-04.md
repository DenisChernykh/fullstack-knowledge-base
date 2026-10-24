---
id: NODE-04
category: node
frequency: very-high
week_priority: top-40
selection_sources: [roadmap-node, node-guide, candidate-reports]
---

# Очереди Node event loop

## Вопрос

В каком порядке выполняются process.nextTick, Promise microtasks, setTimeout и setImmediate и где порядок не гарантирован?

## Короткий ответ

После обычного callback или CommonJS-стека Node опустошает `process.nextTick` queue раньше Promise microtasks, но это не универсальный вывод для top-level ESM: выполнение ES module уже происходит как microtask, поэтому поставленный там Promise может выполниться раньше `nextTick`. `setTimeout(fn, 0)` ждёт timers phase и минимальный порог, а `setImmediate` — check phase; их порядок вне I/O-контекста не гарантирован. Практический вывод важнее заученного вывода: рекурсивный `nextTick` или бесконечная цепочка microtasks может голодать I/O, поэтому эти механизмы не заменяют bounded scheduler или durable queue.

## Разбор

Пример:

Практический ответ должен отделять JavaScript execution от работы runtime и ОС. Гипотезу подтверждают минимальным воспроизведением, event-loop delay, profiler или наблюдением очередей, а не общей фразой «Node асинхронный».


- После текущего JavaScript stack Node дренирует next-tick queue и microtasks; чрезмерная рекурсия nextTick может задержать I/O.
- setTimeout попадает в timers phase после достижения порога, setImmediate — в check phase после poll.
- Из top-level порядок timeout(0) и immediate не гарантирован; внутри I/O callback immediate обычно выполняется раньше следующего timer turn.
## Частые уточнения

**Почему `nextTick` может быть опасен?** Его queue опустошается до продолжения event loop; рекурсивное добавление задерживает timers и I/O.

**Как проверить, что bottleneck находится именно здесь?** Снять профиль или метрику event-loop delay, воспроизвести нагрузку и отделить ожидание I/O от CPU и очереди worker pool.

## Где ошибаются

Не стоит заучивать один вывод timer/immediate как универсальный: он зависит от места планирования и версии runtime. Эта карточка — Node-specific углубление; общая теория Promise уже есть во frontend-базе `/Users/denischernykh/Documents/interview`.

## Источники

- [Roadmap.sh: Node.js questions](https://roadmap.sh/questions/nodejs)
- [Node.js Interview Questions 2026](https://stackinterview.abhijeetkushwaha.dev/guides/nodejs-interview-questions-2026)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [Node.js v24 API](https://nodejs.org/docs/latest-v24.x/api/)
- [Node.js: Understanding `process.nextTick()`](https://nodejs.org/en/learn/asynchronous-work/understanding-processnexttick)
