---
id: NODE-07
category: node
frequency: high
week_priority: extended
selection_sources: [roadmap-node, node-guide]
---

# Async I/O, workers и процессы

## Вопрос

Когда нужен worker_threads, child_process или несколько процессов, а когда достаточно async I/O?

## Короткий ответ

Для сетевого и database I/O обычно достаточно async API: пока операция ждёт, event loop обслуживает другие запросы. `worker_threads` нужны для CPU-heavy JavaScript — парсинга, расчётов, compression — когда работа блокирует loop и её можно передать с приемлемой стоимостью копирования или через shared memory. Отдельные процессы/контейнеры дают более сильную изоляцию памяти, crashes, deployment и scaling; это хороший выбор для HTTP API и фонового BullMQ worker. Они общаются через Redis, queue, database или IPC, а не общую память. Я сначала измеряю event-loop lag/CPU и определяю failure boundary, а уже потом выбираю механизм параллелизма.

## Разбор

Сравнение:

Практический ответ должен отделять JavaScript execution от работы runtime и ОС. Гипотезу подтверждают минимальным воспроизведением, event-loop delay, profiler или наблюдением очередей, а не общей фразой «Node асинхронный».


- Async I/O подходит, когда основное время уходит на ожидание socket или БД и JavaScript callback короткий.
- worker_threads используют для CPU-heavy JavaScript с возможностью передавать/разделять память; нужно учитывать serialization и coordination cost.
- child_process даёт отдельный process и isolation, а несколько service processes также позволяют использовать несколько CPU cores и независимо перезапускаться.
## Частые уточнения

**Почему не worker thread для database query?** Ожидание I/O уже неблокирующее; thread добавит overhead, не ускорив саму базу.

**Как проверить, что bottleneck находится именно здесь?** Снять профиль или метрику event-loop delay, воспроизвести нагрузку и отделить ожидание I/O от CPU и очереди worker pool.

## Где ошибаются

Несколько Node-процессов не делят singleton/ALS/in-memory cache. Нельзя полагаться на локальный mutex или event emitter для глобальной координации. И BullMQ worker — не worker thread.

## Источники

- [Roadmap.sh: Node.js questions](https://roadmap.sh/questions/nodejs)
- [Node.js Interview Questions 2026](https://stackinterview.abhijeetkushwaha.dev/guides/nodejs-interview-questions-2026)
- [Node.js v24 API](https://nodejs.org/docs/latest-v24.x/api/)
- [Node.js: Worker threads](https://nodejs.org/api/worker_threads.html)
