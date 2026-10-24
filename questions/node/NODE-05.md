---
id: NODE-05
category: node
frequency: very-high
week_priority: top-40
selection_sources: [roadmap-node, node-guide, candidate-reports]
projects: [amazing-ekb]
project_evidence: implemented
---

# Node streams и backpressure

## Вопрос

Какие виды Node streams существуют и как работает backpressure?

## Короткий ответ

В Node есть Readable, Writable, Duplex и Transform streams. Они передают данные порциями и позволяют не держать весь объём в памяти. `highWaterMark` — это порог внутреннего buffer, а не жёсткий лимит размера файла. Когда `writable.write(chunk)` возвращает `false`, producer должен остановиться и дождаться `drain`; Readable при `.pipe()` или `pipeline()` делает это автоматически. Для надёжной цепочки я использую Promise-версию `pipeline`, потому что она связывает backpressure, завершение и ошибки всех звеньев. Также различаю byte mode и object mode: в object mode highWaterMark считается объектами, поэтому один огромный объект всё равно может занять много памяти.

## Разбор

Readable может работать в flowing mode (`data`, `.pipe()`) или paused mode (`readable`, async iterator). Смешивать режимы без понимания состояния опасно. Transform одновременно читает и пишет, например для gzip или incremental parser. Duplex имеет независимые стороны чтения и записи.

Практический ответ должен отделять JavaScript execution от работы runtime и ОС. Гипотезу подтверждают минимальным воспроизведением, event-loop delay, profiler или наблюдением очередей, а не общей фразой «Node асинхронный».

## Пример из моих проектов

В Amazing EKB storage port [`PlaceCategoryCoverImageStoragePort`](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/categories/application/ports/place-category-cover-image-storage.port.ts) возвращает Node `Readable`, а [`LocalPlaceCategoryCoverImageStorage.open`](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/categories/infrastructure/storage/local-place-category-cover-image.storage.ts) создаёт `ReadStream` из заранее открытого descriptor. Controller отдаёт его через `StreamableFile`.

## Частые уточнения

**`highWaterMark` ограничивает максимальное потребление памяти?** Нет, это порог buffering/flow control одного stream; общий pipeline и пользовательский код могут хранить больше.

**Как проверить, что bottleneck находится именно здесь?** Снять профиль или метрику event-loop delay, воспроизвести нагрузку и отделить ожидание I/O от CPU и очереди worker pool.

## Где ошибаются

Событие `data` переводит Readable в flowing mode. Если consumer медленный, ручная обработка обязана уважать pause/resume или использовать pipeline. Нельзя считать наличие stream гарантией постоянного малого memory footprint без аудита transforms и buffers.

## Источники

- [Roadmap.sh: Node.js questions](https://roadmap.sh/questions/nodejs)
- [Node.js Interview Questions 2026](https://stackinterview.abhijeetkushwaha.dev/guides/nodejs-interview-questions-2026)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [Node.js v24 API](https://nodejs.org/docs/latest-v24.x/api/)
- [Node.js: Stream API](https://nodejs.org/api/stream.html)
