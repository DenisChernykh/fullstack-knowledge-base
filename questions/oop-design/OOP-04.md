---
id: OOP-04
category: oop-design
frequency: very-high
week_priority: top-40
selection_sources: [oop-bank-a, oop-bank-b, oop-bank-c]
---

# Композиция и наследование

## Вопрос

Почему композицию часто предпочитают наследованию и когда наследование всё же оправдано?

## Короткий ответ

Inheritance связывает subclass с устройством и lifecycle base class. Изменение protected behavior может неожиданно сломать всю иерархию, а наследник иногда перестаёт быть корректной заменой базового типа. Composition собирает объект из небольших collaborators с явными контрактами: стратегию retries, repository, clock или formatter можно заменить независимо. Поэтому для отношения «использует» выбирают композицию. Inheritance оправдано при настоящем устойчивом is-a, общей семантике и соблюдении Liskov substitution, например специализированные неизменяемые типы одного framework contract. Повтор нескольких строк кода сам по себе не доказывает необходимость базового класса.

## Разбор

- Composition позволяет менять behavior через injected strategy, не размножая комбинации subclasses.
- Inheritance часто раскрывает protected internals и создаёт fragile base class problem.
- Substitutability проверяется поведением: consumer базового типа не должен знать конкретного subtype и получать новые неожиданные preconditions.
- Delegation может добавить немного boilerplate, но делает зависимости и возможности объекта явными.

## Частые уточнения

**Inheritance всегда плохо?** Нет. Оно полезно для устойчивой таксономии и framework extension points, если контракт действительно substitutable.

**Что выбрать для разных алгоритмов расчёта?** Обычно Strategy через composition: общий caller получает объект с единым методом расчёта.

**Mixin — композиция?** Это механизм повторного использования, но часто копирует проблемы множественного наследования и требует осторожности.

## Где ошибаются

Нельзя отвечать лозунгом «composition всегда лучше». Нужно назвать цену coupling и условие, при котором inheritance остаётся корректным.

## Источники

- [OOP Interview Questions](https://perfectnotes.org/interview-questions/oop/top-50-oop-interview-questions)
- [OOP Interview Questions and Answers](https://interviewkickstart.com/blogs/interview-questions/oops-interview-questions-2)
- [OOP and Design Patterns Interview Questions](https://www.geeksforgeeks.org/interview-prep/design-patterns-best-practices-interview-questions-oops/)
