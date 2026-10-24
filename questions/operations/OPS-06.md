---
id: OPS-06
category: operations
frequency: high
week_priority: top-40
selection_sources: [ops-guide, backend-guide]
projects: [nest-starter]
project_evidence: deployment-contract
---

# CI/CD и границы доказательств

## Вопрос

Чем отличаются build, release и deploy, какие этапы нужны в CI/CD и что green pipeline не доказывает?

## Короткий ответ

Build превращает исходники в проверяемый artifact. Release делает конкретную версию доступной для развёртывания — например публикует image и связывает его с commit. Deploy устанавливает этот artifact в окружение и переводит трафик. CI обычно выполняет install из lockfile, lint/typecheck, tests, build и проверки artifact; CD продвигает уже проверенный artifact, а не пересобирает другой. Green CI доказывает только выполненные шаги и их inputs: он не доказывает доступность production, успешные migrations или пользовательский путь. После deploy нужны version check, readiness и smoke; для отказа — явный rollback или roll-forward.

## Разбор

- Один immutable artifact уменьшает расхождение между stage и production; environment-specific config подаётся runtime.
- Нужно читать фактические jobs и artifacts: workflow file сам по себе не доказывает состоявшийся run.
- Deploy gate проверяет exact version, migration result и readiness до допуска в traffic.
- Rollback приложения не всегда откатывает schema/data, поэтому миграции проектируют совместимыми и имеют отдельный recovery plan.

## Пример из моих проектов

В [Nest Starter workflow](/Users/denischernykh/projects/starters/nest-js-starter/.github/workflows/stage-image.yml) code gate отделён от публикации и проверки image. Это contract в repository; текущий hosted run и production rollout этой ссылкой не подтверждаются.

## Частые уточнения

**Почему нельзя пересобрать image на production?** Получится другой непроверенный artifact; пропадает связь с CI evidence.

**Что доказывает successful test job?** Только результат конкретной команды на конкретном commit/environment, а не работу hosted system.

**Rollback всегда безопасен?** Нет. Новая версия могла изменить schema или данные; нужна совместимость или отдельное восстановление.

## Где ошибаются

Нельзя смешивать наличие workflow, публикацию artifact, deploy и реальный smoke в одно утверждение «у нас CI/CD работает».

## Источники

- [Backend development interview preparation](https://www.coursera.org/resources/back-end-development-interview-prep-guide)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
