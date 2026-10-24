# SQL-P02 — Дубли и HAVING

## Задание

Таблица `users(id, email, created_at)`. Найдите дубли email после `lower(trim(email))`, игнорируя `NULL`. Верните нормализованный email, количество и минимальный `created_at`; только группы больше одной строки.

## Решение

```sql
SELECT lower(trim(email)) AS normalized_email,
       COUNT(*) AS duplicate_count,
       MIN(created_at) AS first_seen_at
FROM users
WHERE email IS NOT NULL
GROUP BY lower(trim(email))
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, normalized_email;
```

## Что объяснить вслух

`WHERE` отбрасывает строки до группировки, `HAVING` фильтрует готовые группы. Для защиты новых записей одного отчёта недостаточно: после очистки данных нужен unique expression index на ту же нормализованную форму.
