---
id: SEC-05
category: security-auth
frequency: very-high
week_priority: top-40
selection_sources: [backend-bank, security-guide, employer-guide]
projects: [nest-starter, amazing-ekb]
project_evidence: implemented
---

# Injection и mass assignment

## Вопрос

Как защищаться от SQL или command injection и mass assignment, в том числе при использовании ORM?

## Короткий ответ

Injection возникает, когда недоверенные данные становятся частью команды, а не параметром. Для SQL использую ORM/query builder или tagged parameterized query; никогда не склеиваю WHERE/ORDER BY из пользовательской строки. Для shell предпочитаю API без shell и массив аргументов. Но ORM не защищает от mass assignment: если передать `request.body` целиком в `update`, клиент может изменить `role`, `ownerId` или status. Поэтому transport DTO запрещает неизвестные поля, use case строит отдельный command, а repository явно перечисляет разрешённые поля и задаёт tenant/actor scope из trusted context. Authorization и database constraints остаются обязательными.

## Разбор

Опасно:

Security-механизм оценивают по threat model: какой attacker, какой asset и какую границу он закрывает. Затем нужны negative tests и безопасная наблюдаемость, не раскрывающая credential или PII.


- Значения передают параметрами, а identifiers и fragments SQL выбирают только из allowlist; конкатенация недоверенного ввода остаётся опасной и с ORM.
- DTO или explicit mapping разрешает изменять только ожидаемые fields, не принимая role, ownerId или status целиком из body.
- Database account получает минимальные privileges, чтобы одна injection не превращалась в полный административный доступ.
## Пример из моих проектов

В Nest Starter глобальный [`ValidationPipe`](/Users/denischernykh/projects/starters/nest-js-starter/src/platform/http/bootstrap/configure-http-application.ts) запрещает лишние поля. [`PrismaAuthRepository`](/Users/denischernykh/projects/starters/nest-js-starter/src/modules/auth/infrastructure/prisma-auth.repository.ts) строит `data` из явно перечисленных application inputs и использует Prisma parameterization. В Amazing EKB request DTO также отделены от repository inputs.

## Частые уточнения

**ORM полностью исключает SQL injection?** Нет: raw/unsafe API, динамические identifiers и ошибочная string interpolation всё ещё опасны.

**Как проверить эту защиту?** Добавить негативный integration/e2e-сценарий, проверить отказ на server side и убедиться, что response и logs не раскрывают чувствительные данные.

## Где ошибаются

Prepared statements защищают структуру запроса от значений, но не исправляют слабую authorization. Запрос `WHERE id = $1` остаётся IDOR, если не проверен tenant/owner.

## Источники

- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Backend Interview Questions 2026](https://mortit.com/blog/backend-developer-interview-questions)
- [Microsoft technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP: SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
