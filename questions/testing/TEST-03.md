---
id: TEST-03
category: testing
frequency: high
week_priority: extended
selection_sources: [employer-guide, backend-bank]
---

# TestingModule и HTTP e2e

## Вопрос

Как тестировать Nest service или controller через TestingModule и чем такой тест отличается от e2e через HTTP?

## Короткий ответ

TestingModule собирает контролируемую часть Nest dependency graph: можно зарегистрировать тестируемый provider и подменить его dependencies через useValue/useFactory, затем получить instance и вызвать метод напрямую. Это удобно для unit/component test wiring и поведения service или controller без сети. HTTP e2e создаёт NestApplication, применяет реальные global pipes, guards, filters и adapter routing, затем вызывает endpoint через HTTP client. Он доказывает больше про transport contract, но медленнее и хуже локализует ошибку. Если риск в SQL, одного TestingModule с mock repository недостаточно — нужен integration test с реальной БД.

## Разбор

- Для service test импортируют минимальный module или перечисляют providers, чтобы случайно не поднять всю инфраструктуру.
- Controller test с прямым вызовом не проверяет route decorator, serialization, guard order или ValidationPipe.
- HTTP e2e должен использовать тот же bootstrap configuration, иначе тест и production app расходятся.
- Override provider полезен для внешнего API, но подмена не должна скрыть тот failure mode, ради которого написан тест.

## Частые уточнения

**Нужно ли тестировать private methods?** Обычно нет. Проверяют наблюдаемое поведение публичной границы; сложную private-логику лучше выделить в отдельный компонент.

**Supertest делает тест полностью e2e?** Только внутри поднятого процесса. Реальность БД, сети и внешних сервисов зависит от конфигурации dependencies.

**Что проверить у controller unit test?** Mapping input в use case и ожидаемого результата/ошибки, не повторяя бизнес-логику service.

## Где ошибаются

Нельзя называть любой TestingModule e2e или считать mock repository доказательством SQL, transactions и constraints.

## Источники

- [Microsoft technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
