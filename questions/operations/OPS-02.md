---
id: OPS-02
category: operations
frequency: high
week_priority: extended
selection_sources: [linux-interview, backend-guide]
---

# Linux troubleshooting

## Вопрос

Сервис недоступен: в каком порядке проверить process, listening port, HTTP, logs, env, permissions и resources?

## Короткий ответ

Я иду от факта к следующей границе. Сначала проверяю, запущен ли нужный process и какой у него exit/restart status. Затем — слушает ли он ожидаемый address и port, доступен ли локально через curl и не привязан ли только к loopback. После этого смотрю свежие structured logs и correlation ID, effective environment/config, DNS и доступность dependencies, права на файлы/volumes, disk/memory/CPU и последние изменения deployment. SIGTERM даёт приложению шанс завершиться корректно, SIGKILL — нет. Каждую гипотезу подтверждаю командой или метрикой, не перезапуская сервис вслепую и не стирая симптомы.

## Разбор

- Process present не означает ready: проверяют socket через ss/lsof и реальный health endpoint.
- Local success при external failure направляет к bind address, firewall, proxy, DNS или routing.
- Logs читают в нужном временном окне и сверяют version/revision процесса, чтобы не диагностировать старый instance.
- Resource exhaustion и full disk могут проявляться как случайные application errors; permissions проверяют от effective user процесса.

## Частые уточнения

**Чем SIGTERM отличается от SIGKILL?** SIGTERM можно обработать и выполнить graceful shutdown; SIGKILL немедленно останавливает process без cleanup.

**Почему curl localhost недостаточен?** Он не проверяет внешний proxy, TLS, DNS, firewall и bind address, доступный другим hosts.

**Что означает exit code 0?** Процесс завершился успешно по собственному контракту, но это не доказывает, что сервис должен был завершаться или был healthy до этого.

## Где ошибаются

Плохой подход — сразу рестартовать, менять несколько параметров одновременно или считать отсутствие exception в логах доказательством здоровья.

## Источники

- [Linux Interview Questions](https://www.coursera.org/articles/linux-interview-questions)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
