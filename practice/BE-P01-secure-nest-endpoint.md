# BE-P01 — Исправить небезопасный Nest endpoint

## Ограничение

45 минут. Можно писать псевдокод repository, но границы и SQL должны быть явными.

## Дано

```ts
@Post('transfers')
async create(@Body() body: any) {
  return this.db.query(
    `INSERT INTO transfers(user_id, target_id, amount)
     VALUES ('${body.userId}', '${body.targetId}', ${body.amount}) RETURNING *`,
  )
}
```

## Задание

Исправьте endpoint так, чтобы identity брался из аутентифицированного context, DTO проходил runtime validation, SQL был параметризован, а authorization и transaction boundary находились в понятном месте. Добавьте один integration test с PostgreSQL.

## Ожидаемый разбор

1. Controller принимает validated DTO и authenticated actor, но не доверяет `userId` из body.
2. Application service проверяет право actor выполнять перевод и открывает короткую транзакцию.
3. Repository использует параметры `$1/$2/$3` или безопасный ORM API.
4. Database constraints защищают положительную сумму, foreign keys и необходимые uniqueness/invariants.
5. Integration test доказывает rollback или отсутствие записи при запрещённой операции.

Idempotency key — хороший follow-up, но не обязательное условие базового решения.
