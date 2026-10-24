---
id: TEST-01
category: testing
frequency: very-high
week_priority: top-40
selection_sources: [employer-guide, backend-bank, assessment-platform]
---

# Уровни тестирования по риску

## Вопрос

Как выбирать между unit, integration, contract и e2e-тестами по модели риска?

## Короткий ответ

Я начинаю не с фиксированной «пирамиды», а с возможного отказа и границы, на которой он возникает. Чистую бизнес-логику быстро проверяю unit-тестом. SQL, транзакции, Redis и сериализацию — integration-тестом с реальной зависимостью. Протокол внешнего сервиса или стабильную схему — contract-тестом. E2E оставляю для критичных пользовательских путей и проверки полной сборки приложения. Один риск иногда требует нескольких уровней: unit локализует ошибку, а integration или e2e доказывает корректность реального wiring.

## Разбор

Полезная последовательность выбора:

Для каждого теста формулируют failure mode, реальную границу и то, что намеренно подменено. Это не позволяет выдать наличие зелёного файла теста за доказательство production behavior.


- Unit проверяет чистую логику и orchestration через узкие collaborators; integration — реальную границу БД, Redis или filesystem.
- Contract фиксирует ожидания между consumer/provider, а e2e проверяет собранный transport path с настоящим bootstrap.
- Один критичный риск может требовать двух уровней, но бездумно копировать одинаковый сценарий во все suites не нужно.
## Частые уточнения

**Нужно ли дублировать один сценарий на всех уровнях?** Нет. Дублирование оправдано только для разных failure modes: например, unit проверяет решение application layer, integration — транзакционность, e2e — HTTP mapping.

**Чего этот тест всё равно не доказывает?** Он не доказывает поведение подменённых dependencies, другое окружение и hosted runtime, если эти границы не входят в сценарий.

## Где ошибаются

Нельзя говорить «unit быстрые, e2e медленные — значит делаем пирамиду» без связи с риском. Mock PostgreSQL не доказывает locks или isolation, а supertest без браузера не доказывает пользовательский UI. Наличие файлов тестов также не означает, что они запускались на текущем commit.

## Источники

- [Microsoft technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [HackerRank interview question types](https://support.hackerrank.com/articles/9999244916-question-types-in-hackerrank-interviews)
- [Planner: unit-конфигурация](/Users/denischernykh/projects/planner/jest.unit.config.mjs)
