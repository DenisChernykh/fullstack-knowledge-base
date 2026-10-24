---
id: TEST-04
category: testing
frequency: high
week_priority: extended
selection_sources: [employer-guide, backend-bank]
---

# Тестирование внешних интеграций

## Вопрос

Как тестировать внешнюю HTTP-интеграцию, её protocol contract и ошибочные ответы?

## Короткий ответ

Я разделяю собственную orchestration, wire contract и реальный provider smoke. Contract-тест запускает настоящий adapter против контролируемого HTTP fake и фиксирует URL, method, headers, body, redirects, timeouts, size limits и error mapping. Он не должен подменять сам adapter, иначе протокол не проверяется. Отдельно нужны негативные cases: malformed response, replay, timeout, invalid signature и ambiguous failure. Небольшой sandbox smoke полезен для проверки provider reality, но его нестабильность и credentials не должны превращать каждый PR в случайный внешний тест.

## Разбор

Для интеграции сначала задают:

Для каждого теста формулируют failure mode, реальную границу и то, что намеренно подменено. Это не позволяет выдать наличие зелёного файла теста за доказательство production behavior.


- Сначала фиксируют outbound request: URL, method, headers, timeout и body; затем классифицируют success, retryable и terminal responses.
- Stub server проверяет protocol ближе к реальности, contract fixture защищает schema, а небольшой sandbox smoke подтверждает provider integration отдельно.
- Обязательно тестируют timeout, malformed body, rate limit, partial response и безопасное логирование без secrets.
## Частые уточнения

**Чем contract-тест отличается от mock unit-теста?** Contract вызывает реальный serialization/adapter code и проверяет wire-level ожидания. Unit mock часто подменяет adapter уже готовым result.

**Чего этот тест всё равно не доказывает?** Он не доказывает поведение подменённых dependencies, другое окружение и hosted runtime, если эти границы не входят в сценарий.

## Где ошибаются

Fixture легко устаревает вместе с нашими предположениями. Поэтому нельзя говорить, что contract test доказывает актуальность внешнего сервиса навсегда. Нельзя также логировать raw token, provider secret или полный unexpected body.

## Источники

- [Microsoft technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
- [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions)
- [Planner: OIDC ceremony contract](/Users/denischernykh/projects/planner/test/contract/auth/telegram-oidc.contract.spec.ts)
