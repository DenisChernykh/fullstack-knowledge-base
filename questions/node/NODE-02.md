---
id: NODE-02
category: node
frequency: very-high
week_priority: top-40
selection_sources: [roadmap-node, node-guide, candidate-reports]
projects: [amazing-ekb]
project_evidence: implemented
---

# Event loop и блокирующий код

## Вопрос

Почему Node называют single-threaded и как event loop и non-blocking I/O позволяют обслуживать много запросов; что блокирует процесс?

## Короткий ответ

JavaScript callback в одном Node-процессе обычно выполняется на одном event-loop thread. Масштабирование по I/O достигается не параллельным выполнением JS, а тем, что сетевые операции, таймеры и часть filesystem/crypto работы ожидаются вне основного стека, после чего callbacks ставятся в очереди. Пока один callback считает большой JSON, синхронно хеширует, выполняет сложный regex или вызывает `readFileSync`, другие запросы этого процесса не получают JS-время. Поэтому I/O делаю асинхронным, CPU-heavy работу дроблю, выношу в worker thread/процесс или специализированный сервис и измеряю event-loop lag, а не предполагаю производительность по слову «async».

## Разбор

Event loop проходит фазы timers, pending callbacks, poll, check и close callbacks; Promise microtasks выполняются между переходами и после callback. libuv thread pool обслуживает не весь JavaScript, а конкретные API, например часть fs, DNS, crypto и zlib.

Практический ответ должен отделять JavaScript execution от работы runtime и ОС. Гипотезу подтверждают минимальным воспроизведением, event-loop delay, profiler или наблюдением очередей, а не общей фразой «Node асинхронный».

## Пример из моих проектов

В Amazing EKB тяжёлая browser/import работа запускается отдельным entrypoint [`bootstrap/place-import-worker/main.ts`](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/bootstrap/place-import-worker/main.ts), а API собирается отдельно в [`bootstrap/api/configure-api.ts`](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/bootstrap/api/configure-api.ts). Это изолирует lifecycle и сбой worker от HTTP-процесса.

## Частые уточнения

**`async` функция автоматически выполняется в другом потоке?** Нет. Синхронная часть выполняется на текущем JS thread; `await` только отдаёт управление, пока Promise ожидается.

**Как проверить, что bottleneck находится именно здесь?** Снять профиль или метрику event-loop delay, воспроизвести нагрузку и отделить ожидание I/O от CPU и очереди worker pool.

## Где ошибаются

Node не «однопоточный целиком»: runtime и библиотеки используют системные потоки. Но это не делает CPU-heavy JS неблокирующим. Раздельный импорт-worker Amazing EKB нельзя называть реализацией `worker_threads`.

## Источники

- [Roadmap.sh: Node.js questions](https://roadmap.sh/questions/nodejs)
- [Node.js Interview Questions 2026](https://stackinterview.abhijeetkushwaha.dev/guides/nodejs-interview-questions-2026)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [Node.js v24 API](https://nodejs.org/docs/latest-v24.x/api/)
- [Node.js: The event loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
