---
id: NEST-03
category: nestjs
frequency: very-high
week_priority: top-40
selection_sources: [nest-guide-a, nest-guide-b, candidate-reports]
---

# Dependency injection и provider tokens

## Вопрос

Как работает DI в Nest; зачем tokens и чем useClass, useValue, useFactory и useExisting отличаются?

## Короткий ответ

Nest container создаёт providers и разрешает constructor dependencies по token. Класс может быть token сам по себе, но для интерфейса TypeScript нужен runtime token — class, string или symbol, потому что interface исчезает после компиляции. useClass связывает token с создаваемым классом, useValue — с готовым объектом, useFactory вычисляет provider и может получать другие зависимости, useExisting создаёт alias на уже зарегистрированный provider. Provider должен быть доступен в текущем module или экспортирован импортируемым module. Это wiring-механизм; жизненный цикл дополнительно определяется scope.

## Разбор

- Constructor injection делает обязательные зависимости видимыми и позволяет container проверить граф при bootstrap.
- Symbol token уменьшает риск случайного совпадения строк. Абстрактный класс также может быть runtime token, если это оправдано контрактом.
- useFactory подходит для конфигурации и условного wiring; тяжёлую бизнес-логику в factory прятать не стоит.
- useExisting переиспользует тот же instance, тогда как useClass создаёт instance указанного класса для данного registration.

## Частые уточнения

**Почему нельзя inject TypeScript interface?** Interface отсутствует в emitted JavaScript, поэтому container не получает runtime token.

**Чем useExisting отличается от useClass?** useExisting alias-ит уже созданный provider; useClass регистрирует класс как реализацию token и создаёт отдельный instance согласно scope.

**Где регистрировать внешний client?** В infrastructure/platform module, экспортируя узкий token или adapter тем feature modules, которым он нужен.

## Где ошибаются

Частая ошибка — экспортировать всё из каждого module и превращать DI graph в глобальный service locator. Нельзя также путать token с TypeScript generic: generic не существует в runtime.

## Источники

- [NestJS Interview Questions](https://devencyclopedia.com/blog/nestjs-interview-questions)
- [NestJS interview guide](https://www.tutorialslogic.com/interview-questions/nestjs)
- [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/)
- [NestJS documentation](https://docs.nestjs.com/)
