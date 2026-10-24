---
id: ARCH-02
category: backend-architecture
frequency: very-high
week_priority: top-40
selection_sources: [backend-bank, backend-guide, roadmap-backend]
projects: [planner, nest-starter]
project_evidence: implemented
---

# Монолит и микросервисы

## Вопрос

Чем монолит отличается от микросервисов и какие новые проблемы создаёт переход к микросервисам?

## Короткий ответ

Модульный монолит — один deployable и обычно один процесс, но бизнес-возможности разделены явными границами, публичными API и направлением зависимостей. Микросервисы имеют независимые runtime/deploy границы и общаются по сети; часто каждый владеет своими данными. Они дают независимое масштабирование и автономию команд, но добавляют latency, частичные отказы, versioned contracts, observability, delivery и сложность согласованности. Я начинаю с модульного монолита, если одна команда и один темп релизов. Вынос оправдан измеримым давлением — независимым scaling, ownership/compliance или конфликтом release cadence — и только после того, как логическая граница уже устойчива.

## Разбор

Признаки здорового модульного монолита:

Архитектурный выбор должен следовать из нагрузки, consistency, failure model и ownership. Полезно назвать простейший допустимый вариант, цену более сложного решения и наблюдение, после которого стоит эволюционировать.


- Модульный монолит держит один deployable и process, но запрещает feature-модулям обращаться к чужим внутренним таблицам и services напрямую.
- Микросервисы добавляют network latency, partial failures, versioned contracts, распределённую наблюдаемость и отдельную эксплуатацию данных.
- Переход оправдан независимым lifecycle, масштабированием или ownership команды, а не размером repository сам по себе.
## Пример из моих проектов

Planner — один NestJS backend с модулями `auth`, `workspace`, `planning`, `tracking`, отдельными composition слоями и общими platform capabilities: [modules](/Users/denischernykh/projects/planner/src/modules) и [API composition root](/Users/denischernykh/projects/planner/src/bootstrap/api/api.module.ts). Это пример модульного монолита в локальном checkout, а не микросервисной production-системы.

## Частые уточнения

**Какой модуль вы вынесли бы первым?** Тот, у которого стабильный контракт, отдельный data ownership и реальная причина — например, независимая нагрузка или команда. Не самый большой каталог по числу файлов.

**Какой критерий заставит изменить это решение?** Измеримый рост нагрузки, новый consistency requirement, независимый lifecycle команды или повторяющийся failure mode, который текущая граница не выдерживает.

## Где ошибаются

Нельзя называть папки «микросервисами». Микросервисы не являются автоматическим признаком зрелости и не гарантируют масштабирование. И не стоит обещать простой future extraction, если data ownership и contracts не определены.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [Roadmap.sh: Backend questions](https://roadmap.sh/questions/backend)
- [Martin Fowler: Monolith First](https://martinfowler.com/bliki/MonolithFirst.html)
