---
id: NODE-01
category: node
frequency: high
week_priority: extended
selection_sources: [roadmap-node, node-guide]
---

# Node.js и browser runtime

## Вопрос

Что такое Node.js и чем его runtime отличается от browser runtime?

## Короткий ответ

Node.js — JavaScript runtime на V8 для выполнения кода вне браузера. Язык и Promise-модель знакомы frontend-разработчику, но окружение другое: вместо DOM и Web APIs доступны файловая система, процессы, TCP/HTTP, streams, worker threads и модульная система Node. Глобальные объекты и модель безопасности также отличаются: серверный процесс обычно имеет доступ к файловой системе и секретам, поэтому недоверенный код опаснее. Node хорошо подходит для I/O-нагруженных сервисов, но выполнение JavaScript на основном потоке остаётся последовательным, и CPU-тяжёлая работа может блокировать обработку остальных запросов.

## Разбор

- V8 выполняет JavaScript, а Node добавляет C/C++ bindings, libuv, стандартные модули и процессный lifecycle.
- В браузере код ограничен sandbox и политиками origin; в Node права определяются пользователем ОС, контейнером и конфигурацией процесса.
- Часть Web APIs теперь доступна и в Node, например fetch, URL и Web Streams, но это не делает окружения одинаковыми.
- При выборе Node оценивают профиль нагрузки: ожидание сети и БД масштабируется хорошо, длительные вычисления требуют вынесения или распараллеливания.

## Частые уточнения

**Есть ли в Node DOM?** Нет, DOM не является частью Node. Его можно эмулировать библиотекой, но это не встроенная browser-среда.

**Node действительно однопоточный?** JavaScript конкретного isolate обычно выполняется на одном потоке, но runtime использует OS async I/O, libuv worker pool и может создавать workers или процессы.

## Где ошибаются

Нельзя говорить, что Node — это «JavaScript без браузера» и игнорировать процесс, права ОС и серверные API. Также неверно заключать, что однопоточный JavaScript означает один поток во всём runtime.

## Источники

- [Roadmap.sh: Node.js questions](https://roadmap.sh/questions/nodejs)
- [Node.js Interview Questions 2026](https://stackinterview.abhijeetkushwaha.dev/guides/nodejs-interview-questions-2026)
- [Node.js v24 API](https://nodejs.org/docs/latest-v24.x/api/)
