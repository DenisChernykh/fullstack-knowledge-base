---
id: NODE-06
category: node
frequency: high
week_priority: extended
selection_sources: [roadmap-node, node-guide]
---

# CommonJS и ESM

## Вопрос

Чем CommonJS отличается от ESM и как Node выбирает module system?

## Короткий ответ

CommonJS загружает модули через require и экспортирует через module.exports; исторически он синхронный и использует собственные правила разрешения. ESM — стандарт ECMAScript с import/export, статически анализируемыми зависимостями, URL-семантикой и поддержкой top-level await. Node выбирает режим по расширению .mjs/.cjs, ближайшему package.json с полем type и другим правилам определения формата. Смешивание возможно, но interop не полностью симметричен: named exports из CommonJS определяются эвристически, require не может синхронно загрузить произвольный ESM-граф с top-level await. В новом проекте лучше выбрать один основной формат и явно настроить TypeScript и package exports.

## Разбор

- В package с type=module файлы .js трактуются как ESM; с type=commonjs или без явного режима — по правилам CommonJS и syntax detection актуальной версии Node.
- .mjs всегда ESM, .cjs всегда CommonJS. TypeScript module и moduleResolution должны соответствовать фактическому runtime.
- ESM не предоставляет __dirname напрямую; используют import.meta.url и fileURLToPath. CommonJS использует require.cache, а ESM имеет отдельный loader/cache.
- Проблемы чаще возникают не в синтаксисе, а на границе build output, package exports, test runner и библиотек разного формата.

## Частые уточнения

**Можно ли импортировать CommonJS из ESM?** Да, default import обычно получает module.exports; named imports зависят от доступного статического анализа и не всегда надёжны.

**Зачем поле exports?** Оно задаёт публичные entry points и может разделять import/require условия, не раскрывая внутреннюю структуру package.

## Где ошибаются

Неверно утверждать, что ESM всегда асинхронный, а CommonJS всегда несовместим с ESM. Следует объяснять конкретную границу и учитывать настройки Node, TypeScript и package.json.

## Источники

- [Roadmap.sh: Node.js questions](https://roadmap.sh/questions/nodejs)
- [Node.js Interview Questions 2026](https://stackinterview.abhijeetkushwaha.dev/guides/nodejs-interview-questions-2026)
- [Node.js v24 API](https://nodejs.org/docs/latest-v24.x/api/)
