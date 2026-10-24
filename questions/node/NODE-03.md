---
id: NODE-03
category: node
frequency: very-high
week_priority: top-40
selection_sources: [roadmap-node, node-guide, candidate-reports]
---

# libuv, OS и worker pool

## Вопрос

Какова роль libuv, операционной системы и worker pool; какие операции действительно идут в pool?

## Короткий ответ

JavaScript callback выполняется на event-loop thread, но ожидание работы организуют разные механизмы. Сетевые сокеты обычно обслуживаются неблокирующими возможностями ОС и уведомляют event loop о готовности. Ограниченный libuv worker pool используется для операций, которым нужен blocking system call или отдельная работа: многие filesystem API, dns.lookup, часть crypto и zlib. Поэтому фраза «весь I/O идёт в thread pool» неверна. Если забить pool дорогими crypto или файловыми операциями, связанные запросы начнут ждать; увеличение UV_THREADPOOL_SIZE не лечит CPU-bound JavaScript на основном потоке.

## Разбор

- Event loop координирует готовые callbacks, а не выполняет каждую внешнюю операцию сам.
- TCP/UDP обычно опираются на epoll, kqueue или IOCP; filesystem не имеет одинаково удобного async-интерфейса на всех ОС, поэтому libuv применяет pool.
- Pool общий внутри процесса для соответствующих API. Длинная задача может задержать другие операции из этой же группы.
- CPU-heavy JavaScript нужно разбивать, переносить в worker_threads, отдельный процесс или внешний worker, а не рассчитывать на libuv автоматически.

## Частые уточнения

**fetch или HTTP-запрос занимают поток pool?** Обычно ожидание сокета обслуживает ОС, а не отдельный worker на весь запрос. DNS-резолвинг может использовать разные пути в зависимости от API.

**Когда менять UV_THREADPOOL_SIZE?** После измерений, если bottleneck действительно в pool-backed операциях. Это capacity tuning, а не универсальное ускорение Node.

**Поможет ли pool синхронному JSON.parse большого payload?** Нет. JSON.parse выполняет JavaScript на основном потоке и блокирует event loop.

## Где ошибаются

Типичные ошибки — считать pool исполнителем любого I/O, путать libuv workers с worker_threads и обещать, что async автоматически делает CPU-работу неблокирующей.

## Источники

- [Roadmap.sh: Node.js questions](https://roadmap.sh/questions/nodejs)
- [Node.js Interview Questions 2026](https://stackinterview.abhijeetkushwaha.dev/guides/nodejs-interview-questions-2026)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [Node.js v24 API](https://nodejs.org/docs/latest-v24.x/api/)
