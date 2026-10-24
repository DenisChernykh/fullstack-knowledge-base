---
id: SQL-03
category: sql-postgresql
frequency: high
week_priority: extended
selection_sources: [assessment-sql, backend-bank]
---

# NULL и трёхзначная логика

## Вопрос

Как SQL работает с NULL, почему column = NULL неверно и чем опасен NOT IN с NULL?

## Короткий ответ

NULL означает отсутствующее или неизвестное значение, поэтому сравнение через = или <> не даёт true: результат становится UNKNOWN. Проверяют IS NULL и IS NOT NULL. В WHERE проходят только строки с true, поэтому UNKNOWN отбрасывается. Это особенно важно для NOT IN: если подзапрос содержит хотя бы один NULL, сравнение может стать UNKNOWN для всех кандидатов и вернуть пустой результат. Для anti-join обычно безопаснее NOT EXISTS с коррелированным условием. Агрегаты, кроме COUNT(*), обычно игнорируют NULL; COALESCE подставляет значение, но использовать его нужно осознанно, не смешивая «нет данных» с настоящим нулём.

## Разбор

- SQL использует TRUE, FALSE и UNKNOWN. NOT UNKNOWN остаётся UNKNOWN, поэтому интуиция из boolean JavaScript не всегда работает.
- NULL не равен другому NULL. Для null-safe сравнения в PostgreSQL есть IS DISTINCT FROM и IS NOT DISTINCT FROM.
- NOT EXISTS проверяет отсутствие совпадающей строки и не ломается из-за постороннего NULL в возвращаемой колонке.
- Schema constraints и значение по умолчанию часто лучше бесконтрольного COALESCE в каждом запросе.

## Частые уточнения

**Что вернёт NULL = NULL?** UNKNOWN, а не true. Для проверки используют IS NULL либо null-safe operators.

**Почему NOT EXISTS безопаснее NOT IN?** Он проверяет существование совпадения по predicate; NULL в нерелевантной строке не делает весь результат UNKNOWN.

**COUNT(column) считает NULL?** Нет. COUNT(*) считает строки, COUNT(expression) — только не-NULL результаты expression.

## Где ошибаются

Нельзя автоматически заменять NULL на пустую строку или ноль: это разные состояния предметной области. Опасно также писать NOT IN по nullable column без доказанного ограничения NOT NULL.

## Источники

- [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [PostgreSQL documentation](https://www.postgresql.org/docs/current/)
