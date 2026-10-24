---
id: TEST-05
category: testing
frequency: high
week_priority: extended
selection_sources: [employer-guide, backend-bank]
---

# Isolation, determinism и flaky tests

## Вопрос

Как обеспечивать isolation тестов, управлять временем и данными и разбирать flaky tests?

## Короткий ответ

Тест должен владеть своим состоянием: отдельной БД/схемой или уникальным namespace, явными fixtures и гарантированным cleanup. Он не должен зависеть от порядка выполнения, часов машины или данных другого теста. При flake я сначала сохраняю seed, timestamps, logs и окружение, затем классифицирую источник: shared state, race, timeout, внешний сервис или недетерминированный генератор. Retry можно использовать только для диагностики; скрывать им нестабильность нельзя. Исправление — убрать uncontrolled dependency либо сделать ожидание condition-based и bounded.

## Разбор

Практические правила:

Для каждого теста формулируют failure mode, реальную границу и то, что намеренно подменено. Это не позволяет выдать наличие зелёного файла теста за доказательство production behavior.


- Каждый тест получает независимые данные и cleanup strategy; shared mutable fixtures и зависимость от порядка suites создают flakiness.
- Clock, random IDs и scheduler передают как controlled dependencies, не ожидая реальные секунды через sleep.
- Flaky test сначала диагностируют и исправляют по evidence; бесконечный retry маскирует race и снижает доверие к CI.
## Частые уточнения

**Когда использовать transaction rollback после каждого теста?** Когда весь код теста использует то же соединение/transaction boundary. Для нескольких connections, background workers и commit semantics этот приём может скрыть реальность.

**Чего этот тест всё равно не доказывает?** Он не доказывает поведение подменённых dependencies, другое окружение и hosted runtime, если эти границы не входят в сценарий.

## Где ошибаются

Случайные UUID уменьшают collisions, но не заменяют ownership и cleanup. `runInBand` может скрыть shared-state race. Автоматический retry, после которого build зелёный, не означает, что проблема исчезла.

## Источники

- [Microsoft technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Planner: integration lifecycle и fixtures](/Users/denischernykh/projects/planner/test/integration/planning/publish-month.integration.spec.ts)
