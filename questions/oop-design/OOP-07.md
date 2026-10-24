---
id: OOP-07
category: oop-design
frequency: high
week_priority: extended
selection_sources: [oop-bank-a, oop-bank-b]
---

# Cohesion и coupling

## Вопрос

Что такое cohesion и coupling и почему желательно высокое cohesion и низкое coupling?

## Короткий ответ

Cohesion показывает, насколько элементы модуля работают над одной связной задачей. Coupling показывает, сколько внешних деталей модуль должен знать и насколько изменения одной части распространяются на другие. Хороший feature module содержит близкие use cases и правила — high cohesion — и взаимодействует с БД, HTTP или соседним feature через узкие контракты — low coupling. Это не означает нулевые зависимости: система должна сотрудничать. Цель — сделать необходимые связи явными и стабильными. God service имеет низкую cohesion, а module, импортирующий внутренние classes пяти соседей, — высокий coupling.

## Разбор

- Temporal cohesion «эти функции запускаются при старте» обычно слабее domain cohesion «они управляют заказом».
- Coupling усиливают shared mutable state, concrete imports, knowledge of schema и порядок скрытых side effects.
- Узкий contract уменьшает blast radius, но слишком много крошечных interfaces создают navigation cost.
- Метрики imports могут подсказать проблему, но архитектурный смысл важнее числа зависимостей.

## Частые уточнения

**Всегда ли fewer dependencies лучше?** Нет. Нужные явные зависимости лучше скрытого global state или service locator.

**Как повысить cohesion?** Группировать код вокруг одной capability и отделять транспорт, persistence и несвязанные use cases.

## Где ошибаются

Нельзя путать cohesion с «всё лежит в одном файле», а coupling — с самим фактом вызова другого модуля. Оценивают смысл и стабильность границы.

## Источники

- [OOP Interview Questions](https://perfectnotes.org/interview-questions/oop/top-50-oop-interview-questions)
- [OOP Interview Questions and Answers](https://interviewkickstart.com/blogs/interview-questions/oops-interview-questions-2)
