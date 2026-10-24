# SQL-P04 — Top-N per group

## Задание

Даны `departments(id, name)` и `employees(id, department_id, name, salary)`. Верните сотрудников, чья зарплата входит в две максимальные различные зарплаты отдела. Сотрудников с одинаковой зарплатой включайте всех.

## Решение

```sql
WITH ranked AS (
  SELECT e.*,
         DENSE_RANK() OVER (
           PARTITION BY e.department_id
           ORDER BY e.salary DESC
         ) AS salary_rank
  FROM employees AS e
)
SELECT d.name AS department_name,
       r.id,
       r.name,
       r.salary
FROM ranked AS r
JOIN departments AS d ON d.id = r.department_id
WHERE r.salary_rank <= 2
ORDER BY d.id, r.salary DESC, r.id;
```

## Что объяснить вслух

`DENSE_RANK` ранжирует различные значения без пропусков и сохраняет ties. `ROW_NUMBER` вернул бы ровно две строки и мог случайно отбросить сотрудника с той же зарплатой.
