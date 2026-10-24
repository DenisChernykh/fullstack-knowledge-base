---
id: SEC-01
category: security-auth
frequency: very-high
week_priority: top-40
selection_sources: [backend-bank, security-guide, employer-guide]
projects: [nest-starter]
project_evidence: implemented
---

# Authentication, authorization и ownership

## Вопрос

Чем authentication отличается от authorization и как связаны RBAC и ownership check?

## Короткий ответ

Authentication отвечает «кто делает запрос» и создаёт свежий principal из действующей session. Authorization отвечает «может ли этот principal выполнить конкретное действие над конкретным объектом». В RBAC роли — это управляемые наборы permissions; endpoint лучше требовать permission вроде `auth.accounts.manage`, а не проверять строку `admin`, иначе роль проникает во весь код. Global guard проверяет общую permission, а use case — object-level и бизнес-правила: tenant membership, владение ресурсом, запрет одобрить собственную заявку. Я придерживаюсь deny by default, загружаю permissions из актуального server-side состояния и не доверяю ролям, присланным клиентом или сохранённым в UI.

## Разбор

Последовательность обычно такая:

Security-механизм оценивают по threat model: какой attacker, какой asset и какую границу он закрывает. Затем нужны negative tests и безопасная наблюдаемость, не раскрывающая credential или PII.


- Authentication восстанавливает principal; authorization проверяет действие над конкретным resource в server-side boundary.
- RBAC связывает роли с permissions, но ownership и tenant membership часто требуют проверки данных, которой нет в одной роли.
- Default deny и централизованная policy уменьшают риск endpoint, случайно оставшегося без guard.
## Пример из моих проектов

В Nest Starter [`AuthenticationGuard`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/presentation/authentication.guard.ts) восстанавливает principal из opaque session. [`PermissionGuard`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/presentation/permission.guard.ts) читает permission metadata и требует все permissions. [`AuthModule.forRoot`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/composition/auth.module.ts) получает product-owned immutable role catalog.

## Частые уточнения

**Почему permission лучше role в decorator?** Роли меняются организационно, а capability endpoint стабильнее. Одна permission может входить в несколько ролей.

**Как проверить эту защиту?** Добавить негативный integration/e2e-сценарий, проверить отказ на server side и убедиться, что response и logs не раскрывают чувствительные данные.

## Где ошибаются

Наличие global permission guard не предотвращает IDOR, если use case не проверяет доступ к конкретному resource. Также нельзя считать скрытую кнопку в UI authorization.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Backend Interview Questions 2026](https://mortit.com/blog/backend-developer-interview-questions)
- [Microsoft technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
