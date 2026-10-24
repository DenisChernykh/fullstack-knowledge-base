---
id: OOP-05
category: oop-design
frequency: high
week_priority: extended
selection_sources: [oop-bank-a, oop-bank-b]
---

# Overriding, overloading и polymorphism

## Вопрос

Чем overriding отличается от overloading и как через них проявляется polymorphism?

## Короткий ответ

Overriding — subclass предоставляет свою реализацию метода с совместимым контрактом базового типа; выбор реализации происходит по фактическому объекту в runtime. Overloading — несколько сигнатур одного имени для разных форм вызова. В TypeScript overload signatures существуют на уровне типов, но обычно ведут к одной JavaScript implementation, которая сама различает arguments. Поэтому это не то же самое, что runtime method overloading в некоторых языках. Polymorphism чаще проявляется через overriding или несколько объектов, реализующих один interface. Overload улучшает API одного значения, но не заменяет подменяемость разных реализаций.

## Разбор

- Override обязан сохранять ожидания caller: не усиливать preconditions и не ослаблять обещанный результат.
- TypeScript implementation signature должна покрывать все overload signatures, но снаружи видны объявленные overloads.
- Union argument иногда проще overloads, особенно когда return type не зависит от точной формы входа.
- Structural typing позволяет polymorphism без общей inheritance hierarchy.

## Частые уточнения

**Есть ли настоящая перегрузка методов в JavaScript?** Обычно нет: последнее определение заменит предыдущее, а различение аргументов выполняет одна функция. TypeScript overloads — compile-time signatures.

**Что делает override некорректным?** Новые исключения, более строгие требования или поведение, нарушающее контракт базового типа.

## Где ошибаются

Не следует утверждать, что TypeScript создаёт несколько runtime-методов по overload signatures. И overriding — не просто метод с тем же именем, а сохранение совместимого контракта.

## Источники

- [OOP Interview Questions](https://perfectnotes.org/interview-questions/oop/top-50-oop-interview-questions)
- [OOP Interview Questions and Answers](https://interviewkickstart.com/blogs/interview-questions/oops-interview-questions-2)
