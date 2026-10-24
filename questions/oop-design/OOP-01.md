---
id: OOP-01
category: oop-design
frequency: very-high
week_priority: top-40
selection_sources: [oop-bank-a, oop-bank-b, oop-bank-c]
---

# Четыре принципа OOP

## Вопрос

Назовите четыре основных принципа OOP и приведите практический пример каждого.

## Короткий ответ

Обычно называют encapsulation, abstraction, inheritance и polymorphism. Encapsulation удерживает состояние и правила его изменения за публичным контрактом. Abstraction оставляет потребителю существенные операции и скрывает детали реализации. Inheritance создаёт отношение «является» и повторно использует поведение базового типа, хотя композиция часто безопаснее. Polymorphism позволяет работать через общий контракт с разными реализациями. Например, use case принимает PaymentGateway, а adapters StripeGateway и FakeGateway реализуют один метод pay. При этом интерфейс — abstraction, скрытые credentials и invariants — encapsulation, подмена adapters — polymorphism; наследование здесь вообще может не понадобиться.

## Разбор

- Encapsulation — не просто private keyword: объект должен не позволять обойти инвариант через другой публичный путь.
- Abstraction отвечает, что умеет компонент; implementation — как он это делает.
- Inheritance полезно при устойчивом отношении is-a и соблюдении Liskov substitution, но создаёт сильную связь с базовым классом.
- Polymorphism возможен через inheritance, interfaces и duck/structural typing; вызывающий код не ветвится по конкретному классу.

## Частые уточнения

**Чем encapsulation отличается от сокрытия данных?** Сокрытие — механизм ограничения доступа, encapsulation — объединение состояния и правил так, чтобы сохранять инварианты.

**Возможен ли polymorphism без inheritance?** Да. В TypeScript разные объекты могут удовлетворять одному interface или структурному контракту.

**Всегда ли OOP требует классов?** Нет. Ключевые идеи контрактов и инкапсуляции можно реализовать модулями, closures и объектами.

## Где ошибаются

Слабый ответ — только перечислить четыре слова. Не нужно также натягивать все четыре принципа на один класс или представлять inheritance обязательным способом переиспользования.

## Источники

- [OOP Interview Questions](https://perfectnotes.org/interview-questions/oop/top-50-oop-interview-questions)
- [OOP Interview Questions and Answers](https://interviewkickstart.com/blogs/interview-questions/oops-interview-questions-2)
- [OOP and Design Patterns Interview Questions](https://www.geeksforgeeks.org/interview-prep/design-patterns-best-practices-interview-questions-oops/)
