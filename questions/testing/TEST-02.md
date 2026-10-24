---
id: TEST-02
category: testing
frequency: very-high
week_priority: top-40
selection_sources: [employer-guide, backend-bank, assessment-platform]
---

# Mock или реальная инфраструктура

## Вопрос

Когда достаточно mock, а когда нужен реальный PostgreSQL или Redis?

## Короткий ответ

Mock подходит, когда я проверяю собственное решение: порядок вызовов, branching, retry budget или реакцию на заранее определённый ответ порта. Но mock не воспроизводит SQL planner, constraints, transaction isolation, row locks, Redis Lua atomicity, TTL и reconnect behavior. Если риск находится в семантике хранилища, я использую реальную pinned dependency, обычно через Testcontainers. Хорошая схема — быстрый unit на orchestration плюс несколько focused integration tests на механизм, а не попытка заменить один уровень другим.

## Разбор

Перед подменой задаю вопрос: «Какой компонент является предметом теста?»

Для каждого теста формулируют failure mode, реальную границу и то, что намеренно подменено. Это не позволяет выдать наличие зелёного файла теста за доказательство production behavior.


- Mock подходит, когда важен вызов собственного collaborator, а его реальная семантика не является предметом теста.
- PostgreSQL нужен для SQL, constraints, transactions, isolation и driver mapping; Redis — для TTL, atomic commands и multi-instance behavior.
- Fake должен явно документировать отличия, иначе зелёный unit test может скрыть несовместимость с реальной dependency.
## Частые уточнения

**Почему не делать все тесты с containers?** Они дороже, медленнее и хуже локализуют чистую логику. Нужен focused набор вокруг storage-specific risks.

**Чего этот тест всё равно не доказывает?** Он не доказывает поведение подменённых dependencies, другое окружение и hosted runtime, если эти границы не входят в сценарий.

## Где ошибаются

Нельзя говорить «integration test с Prisma», если PostgreSQL заменён объектом с `jest.fn()`. И наоборот, запуск container сам по себе не делает тест полезным: нужны assertions на реальный инвариант и управляемое начальное состояние.

## Источники

- [Microsoft technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [HackerRank interview question types](https://support.hackerrank.com/articles/9999244916-question-types-in-hackerrank-interviews)
- [Planner: unit orchestration](/Users/denischernykh/projects/planner/test/unit/shared/application/command-executor.spec.ts)
