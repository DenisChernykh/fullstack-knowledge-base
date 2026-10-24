---
id: ARCH-03
category: backend-architecture
frequency: very-high
week_priority: top-40
selection_sources: [backend-bank, backend-guide, roadmap-backend]
projects: [amazing-ekb]
project_evidence: implemented
---

# Синхронная обработка и очередь

## Вопрос

Когда операцию выполнять синхронно в HTTP-запросе, а когда выносить в очередь или background job?

## Короткий ответ

Синхронный путь выбираю, когда вызывающему нужен результат прямо сейчас, работа короткая и укладывается в общий latency/availability budget. Очередь нужна для долгой, retryable, сглаживаемой нагрузки или изоляции нестабильной интеграции: HTTP-команда быстро фиксирует operation и возвращает `202`, worker обрабатывает её позже. Но очередь добавляет eventual consistency, duplicate delivery, backlog, отмену, progress API, DLQ/recovery и отдельную эксплуатацию. Поэтому я сначала определяю пользовательский контракт и failure model, затем выбираю механизм; простой CRUD не отправляю в queue только ради «масштабируемости».

## Разбор

Синхронная операция имеет одну временную цепочку: client ждёт, timeout должен быть меньше upstream budget, а сбой можно сразу вернуть. Хорошо подходит для validation/query/небольшой транзакции.

Архитектурный выбор должен следовать из нагрузки, consistency, failure model и ownership. Полезно назвать простейший допустимый вариант, цену более сложного решения и наблюдение, после которого стоит эволюционировать.

## Пример из моих проектов

Amazing EKB выносит долгий браузерный импорт из HTTP-запроса в BullMQ: endpoint создаёт operation, а [worker service](/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex/src/modules/place-imports/application/services/process-place-import.service.ts) обрабатывает её асинхронно. Это локально реализованная граница HTTP/background job, а не доказательство production throughput.

## Частые уточнения

**Что вернуть клиенту при enqueue?** Обычно `202 Accepted` и durable operation URL/id, а не обещание завершения. Если результат уже готов — возможен идемпотентный replay terminal state.

**Какой критерий заставит изменить это решение?** Измеримый рост нагрузки, новый consistency requirement, независимый lifecycle команды или повторяющийся failure mode, который текущая граница не выдерживает.

## Где ошибаются

Queue не делает обработку автоматически однократной и не сокращает фактическое время работы. `202` без endpoint состояния — неполный продуктовый контракт. Нельзя полагаться только на in-memory timer для восстановления committed work.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [Roadmap.sh: Backend questions](https://roadmap.sh/questions/backend)
- [AWS Prescriptive Guidance: Asynchronous messaging](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/asynchronous-messaging.html)
