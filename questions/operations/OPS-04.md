---
id: OPS-04
category: operations
frequency: high
week_priority: extended
selection_sources: [docker-interview, backend-guide]
projects: [planner, nest-starter]
project_evidence: implemented
---

# Production Dockerfile basics

## Вопрос

Как работают Dockerfile layers, cache и multi-stage build и зачем запускать runtime не от root?

## Короткий ответ

Каждая build instruction создаёт cacheable слой или metadata; изменение раннего слоя инвалидирует последующие, поэтому lockfile копируют и устанавливают dependencies до копирования часто меняющегося source. Multi-stage build отделяет compiler, dev dependencies и build tools от runtime: финальный stage получает только артефакт и нужные production dependencies. Это уменьшает image и поверхность атаки, но COPY --from всё равно нужно проверять. Runtime запускают непривилегированным пользователем и дают запись только в необходимые каталоги. Dependencies устанавливают из lockfile, secrets не помещают в ARG или layers, а .dockerignore исключает лишний context.

## Разбор

- Cache ускоряет повторную сборку, но корректность важнее: dependency layer должен зависеть от manifest и lockfile.
- Multi-stage не требует публикации промежуточных stages и позволяет разным stages иметь разные tools.
- USER non-root снижает последствия компрометации, но не отменяет опасные mounts, capabilities и уязвимости host.
- CMD/ENTRYPOINT должны передавать signals приложению; shell wrapper не должен случайно становиться непрозрачным PID 1.

## Пример из моих проектов

В [Planner Dockerfile](/Users/denischernykh/projects/planner/Dockerfile) build и runtime разделены, а runtime запускается от пользователя node. В [Nest Starter Dockerfile](/Users/denischernykh/projects/starters/nest-js-starter/Dockerfile) тот же принцип дополнен отдельными dependency/build stages. Это подтверждает repository contract, но не состояние опубликованного production image.

## Частые уточнения

**Почему не копировать весь repository до install?** Любое изменение source инвалидирует dependency cache и замедляет сборку.

**Можно ли передать secret через ARG?** Не следует: он может остаться в metadata или cache. Используют BuildKit secret или исключают secret из build.

**Multi-stage гарантирует маленький image?** Нет. Финальный COPY может перенести лишние файлы; размер и contents нужно проверять.

## Где ошибаются

Неверно считать Alpine, multi-stage или USER автоматической гарантией security. Это отдельные меры с совместимостью и ограничениями.

## Источники

- [Docker Interview Questions](https://www.interviewbit.com/docker-interview-questions/)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [Docker documentation](https://docs.docker.com/)
