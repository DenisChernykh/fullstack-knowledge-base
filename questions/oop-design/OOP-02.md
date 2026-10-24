---
id: OOP-02
category: oop-design
frequency: very-high
week_priority: extended
selection_sources: [oop-bank-a, oop-bank-b, oop-bank-c]
---

# Abstraction и encapsulation

## Вопрос

Чем abstraction отличается от encapsulation?

## Короткий ответ

Abstraction отвечает на вопрос, какой существенный контракт видит потребитель, не заставляя его знать детали. Encapsulation отвечает, где находятся состояние и правила и как запретить обход инвариантов. Например, интерфейс FileStorage с put/get — abstraction над S3 и локальным диском. Класс или module, который не отдаёт наружу mutable credentials, соединение и внутренние retry counters, обеспечивает encapsulation. Они связаны, но не тождественны: можно создать красивый interface, за которым публичное mutable состояние ломает encapsulation; можно хорошо спрятать состояние внутри класса, но предоставить слишком сложный и неудачный abstraction.

## Разбор

- Abstraction уменьшает число концепций, которые должен держать в голове caller. Она может быть interface, функция, protocol или module API.
- Encapsulation устанавливает границу изменения: потребитель вызывает операцию, а компонент сам сохраняет допустимое состояние.
- Private fields помогают, но не спасают, если наружу возвращается mutable reference на внутреннюю коллекцию.
- Хорошая граница скрывает нестабильную деталь и оставляет доменно понятный контракт.

## Частые уточнения

**Interface всегда является хорошей abstraction?** Нет. Он может просто повторять методы конкретной библиотеки и протекать деталями, не упрощая потребителя.

**Достаточно ли private полей для encapsulation?** Нет. Важно контролировать все пути изменения и не отдавать изменяемые внутренние структуры.

## Где ошибаются

Частая ошибка — говорить, что abstraction «скрывает реализацию», а encapsulation «тоже скрывает реализацию», не объясняя различие контракта и защиты состояния.

## Источники

- [OOP Interview Questions](https://perfectnotes.org/interview-questions/oop/top-50-oop-interview-questions)
- [OOP Interview Questions and Answers](https://interviewkickstart.com/blogs/interview-questions/oops-interview-questions-2)
- [OOP and Design Patterns Interview Questions](https://www.geeksforgeeks.org/interview-prep/design-patterns-best-practices-interview-questions-oops/)
