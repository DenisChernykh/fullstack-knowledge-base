---
id: OOP-09
category: oop-design
frequency: high
week_priority: extended
selection_sources: [oop-bank-a, oop-bank-b]
---

# Strategy, Factory и Observer

## Вопрос

Какую проблему решают Strategy, Factory и Observer и когда pattern только усложняет код?

## Короткий ответ

Strategy инкапсулирует взаимозаменяемый алгоритм, например разные правила расчёта тарифа. Factory сосредотачивает выбор и создание подходящей реализации, когда caller не должен знать детали construction. Observer позволяет подписчикам реагировать на событие publisher, но требует ясной семантики ошибок, порядка и lifecycle подписки. Pattern оправдан повторяющейся проблемой и реальной вариативностью. Если сегодня есть один простой if и неизвестно, появится ли второй алгоритм, hierarchy из interfaces, registry и factories может быть дороже. Сначала называют ось изменения, затем выбирают минимальную форму pattern.

## Разбор

- Strategy заменяет conditional по типу алгоритма на polymorphic contract, когда варианты растут независимо.
- Factory отделяет construction/configuration от использования, но не должна становиться глобальным service locator.
- Observer внутри процесса не является durable message broker: событие может потеряться при падении процесса.
- В TypeScript pattern часто реализуется простой function или object map без классов.

## Частые уточнения

**Чем Strategy отличается от Factory?** Strategy выполняет выбранный алгоритм; Factory выбирает или создаёт объект. Они могут использоваться вместе.

**Observer гарантирует доставку?** Нет. Базовый in-process observer требует отдельной политики ошибок и не переживает restart.

**Когда достаточно функции?** Когда стратегия не имеет состояния/lifecycle и единая function signature полностью выражает контракт.

## Где ошибаются

Нельзя узнавать pattern только по названию класса. И не стоит вводить pattern без сформулированной проблемы, которую он упрощает.

## Источники

- [OOP Interview Questions](https://perfectnotes.org/interview-questions/oop/top-50-oop-interview-questions)
- [OOP Interview Questions and Answers](https://interviewkickstart.com/blogs/interview-questions/oops-interview-questions-2)
