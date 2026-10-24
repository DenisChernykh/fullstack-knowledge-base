---
id: OPS-09
category: operations
frequency: high
week_priority: extended
selection_sources: [backend-bank, backend-guide]
---

# Logs, metrics, traces и request ID

## Вопрос

Чем отличаются logs, metrics и traces и как request ID помогает расследованию?

## Короткий ответ

Logs описывают отдельные события с контекстом, metrics агрегируют измерения во времени и подходят для dashboards и alerts, traces связывают работу одного запроса через несколько операций и сервисов. Request ID — простой correlation key: его возвращают клиенту и добавляют в безопасные logs и span attributes. Он не заменяет trace ID, но помогает начать поиск с пользовательской ошибки. Практически я проектирую их вместе: metric сообщает, что симптом вырос, trace показывает путь задержки, logs дают дискретные причины и решения.

## Разбор

Хорошая observability отвечает на разные вопросы:

Операционное утверждение подтверждают фактической версией процесса или artifact, текущими logs/metrics, health и smoke. Конфигурационный файл описывает contract, но сам по себе не доказывает состоявшийся deploy.


- Logs дают дискретные события с context, metrics показывают агрегированную динамику и alertable symptoms, traces связывают latency нескольких spans.
- Request ID или trace ID проходит через proxy, service, jobs и исходящие calls и добавляется структурированным полем, а не частью свободного текста.
- Нельзя логировать body, token и PII по умолчанию; cardinality labels в metrics также ограничивают.
## Частые уточнения

**Request ID и trace ID — одно и то же?** Нет. Trace ID принадлежит distributed tracing и может включать много spans. Request ID — application-level correlation key; их можно связать, но не смешивать семантически.

**Как доказать итог операции?** Проверить exact version или digest, состояние процесса, readiness, критический smoke и записать результат rollback/recovery, если он потребовался.

## Где ошибаются

«У нас есть logs» не означает observability. Без стабильных полей, retention, поиска и связи с симптомом это просто текст. Нельзя заявлять SLO или alerting только потому, что endpoints health и spans существуют.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [OpenTelemetry: signals](https://opentelemetry.io/docs/concepts/signals/)
