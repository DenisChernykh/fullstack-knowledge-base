---
id: OOP-08
category: oop-design
frequency: very-high
week_priority: top-40
selection_sources: [oop-bank-a, oop-bank-b, oop-bank-c]
---

# Dependency Inversion и Dependency Injection

## Вопрос

Чем Dependency Inversion отличается от Dependency Injection и как DI улучшает тестируемость?

## Короткий ответ

Dependency Inversion — принцип: high-level business policy не должна зависеть от деталей БД или HTTP; обе стороны зависят от abstraction, определённой со стороны потребности policy. Dependency Injection — техника передачи collaborator снаружи через constructor, factory или parameter вместо создания внутри. Можно использовать DI container и всё равно зависеть от конкретного PrismaRepository — injection есть, inversion слабая. Тестируемость улучшается, потому что use case получает clock, repository или gateway как явные зависимости и в unit-тесте можно передать controlled fake. Но не каждую чистую функцию нужно превращать в provider.

## Разбор

- Port обычно принадлежит application/domain side, потому что именно потребитель формулирует необходимый контракт.
- Constructor injection подходит для обязательных долгоживущих dependencies; method parameter — для данных конкретного вызова.
- Service locator скрывает зависимости и усложняет reasoning, даже если технически достаёт их из container.
- Fake должен сохранять важную семантику; для SQL и transactions всё равно нужен integration test.

## Частые уточнения

**DI требует framework?** Нет. Объекты можно собрать вручную в composition root.

**Interface обязателен для каждой зависимости?** Нет. Он нужен при полезной boundary или подменяемости, а не ради формального покрытия класса.

**Почему DI помогает тесту?** Тест контролирует collaborator и наблюдает взаимодействие без скрытого создания сети, времени или БД.

## Где ошибаются

Частая ошибка — объявить constructor injection доказательством DIP. Нужно показать направление зависимости и место контракта.

## Источники

- [OOP Interview Questions](https://perfectnotes.org/interview-questions/oop/top-50-oop-interview-questions)
- [OOP Interview Questions and Answers](https://interviewkickstart.com/blogs/interview-questions/oops-interview-questions-2)
- [OOP and Design Patterns Interview Questions](https://www.geeksforgeeks.org/interview-prep/design-patterns-best-practices-interview-questions-oops/)
