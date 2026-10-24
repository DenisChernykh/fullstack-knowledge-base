---
id: OPS-03
category: operations
frequency: high
week_priority: top-40
selection_sources: [docker-interview, ops-guide]
---

# Image, container и virtual machine

## Вопрос

Чем Docker image отличается от container и чем container отличается от virtual machine?

## Короткий ответ

Image — неизменяемый шаблон файловой системы и metadata, собранный из layers. Container — конкретный запущенный или остановленный instance image с writable layer, process namespace, network и resource limits. Несколько containers могут использовать один image, но иметь разные config и volumes. Virtual machine виртуализирует аппаратную среду и запускает отдельное guest kernel; container обычно разделяет kernel host и изолирует processes средствами ОС, поэтому стартует легче, но граница изоляции другая. Данные, которые должны пережить замену container, хранят во внешней БД, volume или другом host-owned storage, а не в его ephemeral writable layer.

## Разбор

- Image content-addressed и переносим как artifact; tag — изменяемая ссылка, digest указывает exact content.
- Container не маленькая VM: главный process и его lifecycle определяют состояние container.
- Namespace изолирует представление ресурсов, cgroups ограничивают consumption; security зависит и от capabilities, mounts и user.
- Удаление container не удаляет named volume автоматически, если команда не попросила этого явно.

## Частые уточнения

**Что меняется внутри running container?** Записи попадают в writable layer и mounts; base image layers остаются неизменными.

**Почему tag latest ненадёжен?** Он может указывать на разное содержимое в разное время; для exact artifact используют digest.

**Когда VM предпочтительнее?** Когда нужна отдельная kernel boundary, другая ОС или более сильная изоляция/управление на этом уровне.

## Где ошибаются

Нельзя говорить, что container не имеет накладных расходов или обеспечивает ту же security boundary, что отдельная VM.

## Источники

- [Docker Interview Questions](https://www.interviewbit.com/docker-interview-questions/)
- [Backend development interview preparation](https://www.coursera.org/resources/back-end-development-interview-prep-guide)
- [Docker documentation](https://docs.docker.com/)
