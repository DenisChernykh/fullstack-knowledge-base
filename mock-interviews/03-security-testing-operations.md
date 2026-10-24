# security testing operations

Отвечайте без открытия карточек. После mock переходите по ссылкам и отмечайте только конкретные пробелы.

1. [Чем authentication отличается от authorization и как связаны RBAC и ownership check?](../questions/security-auth/SEC-01.md)
2. [Когда выбрать server-side session, а когда JWT, и какие компромиссы у обоих подходов?](../questions/security-auth/SEC-02.md)
3. [Как безопасно хранить и проверять пароли, не раскрывать существование аккаунта и ограничивать brute force?](../questions/security-auth/SEC-03.md)
4. [Как связаны Same-Origin Policy, CORS, CSRF и XSS и за какую часть отвечает backend?](../questions/security-auth/SEC-04.md)
5. [Как защищаться от SQL или command injection и mass assignment, в том числе при использовании ORM?](../questions/security-auth/SEC-05.md)
6. [Как выбирать между unit, integration, contract и e2e-тестами по модели риска?](../questions/testing/TEST-01.md)
7. [Когда достаточно mock, а когда нужен реальный PostgreSQL или Redis?](../questions/testing/TEST-02.md)
8. [Как тестировать внешнюю HTTP-интеграцию, её protocol contract и ошибочные ответы?](../questions/testing/TEST-04.md)
9. [Чем merge отличается от rebase и когда использовать revert, reset, restore или reflog?](../questions/operations/OPS-01.md)
10. [Чем Docker image отличается от container и чем container отличается от virtual machine?](../questions/operations/OPS-03.md)
11. [Чем отличаются build, release и deploy, какие этапы нужны в CI/CD и что green pipeline не доказывает?](../questions/operations/OPS-06.md)
12. [Чем startup, readiness и liveness отличаются друг от друга и как проверить deploy и выполнить rollback?](../questions/operations/OPS-08.md)
