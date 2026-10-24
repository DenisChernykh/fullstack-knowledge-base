---
id: OOP-06
category: oop-design
frequency: very-high
week_priority: top-40
selection_sources: [oop-bank-a, oop-bank-b, oop-bank-c]
---

# Принципы SOLID

## Вопрос

Что означает каждый принцип SOLID и как выглядит реальное нарушение SRP или DIP?

## Короткий ответ

SRP: у модуля одна связная причина изменения, а не обязательно один метод. OCP: новое поведение по возможности добавляется через стабильную extension boundary без переписывания проверенного ядра. LSP: реализация сохраняет контракт базового типа. ISP: потребители зависят от узких нужных им возможностей. DIP: high-level policy зависит от abstraction, а конкретная инфраструктура подключается снаружи. Например, use case, который сам создаёт PrismaClient, отправляет HTTP и форматирует ответ, нарушает SRP и DIP. Выделение repository и notification ports помогает только если границы отражают разные причины изменения, а не дробят код механически.

## Разбор

- SRP оценивают по владельцам и причинам изменения: бизнес-правило, HTTP representation и storage schema меняются независимо.
- OCP не требует plugin system заранее; сначала нужен реальный axis of variation.
- LSP запрещает subtype неожиданно бросать UnsupportedOperation для обещанной базовой операции.
- DIP — архитектурное направление зависимости; DI container лишь один способ собрать реализации.

## Частые уточнения

**Один класс на одну ответственность?** Не обязательно. Responsibility — связная причина изменения, а не число методов или строк.

**Чем DIP отличается от DI?** DIP говорит, куда направлены зависимости; DI передаёт конкретные зависимости объекту и может использоваться без хорошего DIP.

**Как SOLID может навредить?** Если создавать interfaces, factories и layers без реальной вариативности, код становится сложнее и хуже читается.

## Где ошибаются

Нельзя отвечать только расшифровкой букв. Нужен пример изменения и границы. Опасна и обратная крайность — объявлять любой import нарушением DIP.

## Источники

- [OOP Interview Questions](https://perfectnotes.org/interview-questions/oop/top-50-oop-interview-questions)
- [OOP Interview Questions and Answers](https://interviewkickstart.com/blogs/interview-questions/oops-interview-questions-2)
- [OOP and Design Patterns Interview Questions](https://www.geeksforgeeks.org/interview-prep/design-patterns-best-practices-interview-questions-oops/)
