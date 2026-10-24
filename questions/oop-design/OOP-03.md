---
id: OOP-03
category: oop-design
frequency: very-high
week_priority: extended
selection_sources: [oop-bank-a, oop-bank-b, oop-bank-c]
---

# Interface и abstract class

## Вопрос

Чем interface отличается от abstract class и когда выбирать каждый вариант?

## Короткий ответ

Interface в TypeScript описывает форму и возможности значения, не создаёт runtime-сущность и позволяет классу реализовать несколько контрактов. Abstract class существует в JavaScript runtime, может иметь constructor, состояние, protected members и готовую реализацию части поведения; наследник может иметь только один базовый класс. Interface выбирают для роли или порта, где важна подменяемость и нет общего состояния. Abstract class уместен, когда реализации действительно образуют одну иерархию и разделяют устойчивый алгоритм или invariants. Если общая реализация — лишь удобный helper, композиция функции или отдельного объекта обычно слабее связывает классы.

## Разбор

- TypeScript interfaces удаляются при компиляции, поэтому сами по себе не являются Nest DI token или значением для instanceof.
- Abstract class может быть DI token и содержать template method, но связывает subclasses с lifecycle базового класса.
- Несколько interfaces позволяют объекту исполнять разные роли без множественного наследования реализации.
- Выбор начинается с domain relationship, а не с желания избежать дублирования нескольких строк.

## Частые уточнения

**Можно ли использовать abstract class как Nest token?** Да, потому что класс существует в runtime; interface потребует отдельный string/symbol/class token.

**Может ли interface содержать implementation?** Нет. Он описывает тип; default behavior дают class, function или composed object.

**Когда abstract class становится проблемой?** Когда subclasses наследуют ненужное состояние, нарушают substitutability или базовый класс часто меняется.

## Где ошибаются

Неверно говорить, что interface — просто abstract class без методов. В TypeScript главное различие включает runtime presence, состояние и ограничения наследования.

## Источники

- [OOP Interview Questions](https://perfectnotes.org/interview-questions/oop/top-50-oop-interview-questions)
- [OOP Interview Questions and Answers](https://interviewkickstart.com/blogs/interview-questions/oops-interview-questions-2)
- [OOP and Design Patterns Interview Questions](https://www.geeksforgeeks.org/interview-prep/design-patterns-best-practices-interview-questions-oops/)
