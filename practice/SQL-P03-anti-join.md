# SQL-P03 — Anti-join и NULL

## Задание

Даны `users(id, name)` и `subscriptions(id, user_id, status, ends_at)`. На дату `2026-08-14` найдите пользователей без активной подписки. Активная подписка имеет `status = 'active'` и `ends_at IS NULL OR ends_at > '2026-08-14'`.

## Решение

```sql
SELECT u.id, u.name
FROM users AS u
WHERE NOT EXISTS (
  SELECT 1
  FROM subscriptions AS s
  WHERE s.user_id = u.id
    AND s.status = 'active'
    AND (s.ends_at IS NULL OR s.ends_at > DATE '2026-08-14')
)
ORDER BY u.id;
```

## Что объяснить вслух

`NOT EXISTS` выражает отсутствие совпадения и не получает ловушку `NOT IN`, когда подзапрос возвращает `NULL`. Нужно отдельно уточнить, включается ли весь день окончания в бизнес-правило.
