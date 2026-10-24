# SQL-P01 — LEFT JOIN и агрегаты

## Задание

Даны таблицы:

```sql
customers(id bigint primary key, name text not null);
orders(id bigint primary key, customer_id bigint not null, status text not null,
       total numeric(12,2) not null, created_at timestamptz not null);
```

Верните `customer_id`, `name`, количество и сумму оплаченных заказов за июль 2026 года. В результате должны остаться клиенты без заказов с нулевыми значениями. Сортировка: сумма по убыванию, затем `customer_id`.

## Решение

```sql
SELECT c.id AS customer_id,
       c.name,
       COUNT(o.id) AS paid_orders,
       COALESCE(SUM(o.total), 0) AS paid_total
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
 AND o.status = 'paid'
 AND o.created_at >= TIMESTAMPTZ '2026-07-01 00:00:00+00'
 AND o.created_at <  TIMESTAMPTZ '2026-08-01 00:00:00+00'
GROUP BY c.id, c.name
ORDER BY paid_total DESC, c.id;
```

## Что объяснить вслух

- Фильтры правой таблицы стоят в `ON`, иначе клиенты без заказов исчезнут.
- Полуоткрытый диапазон не зависит от длины месяца и не теряет дробные секунды.
- `COUNT(o.id)`, а не `COUNT(*)`, возвращает ноль без совпадения.
