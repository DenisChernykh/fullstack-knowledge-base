---
id: OPS-01
category: operations
frequency: high
week_priority: top-40
selection_sources: [git-interview, backend-guide]
---

# Git merge, rebase и recovery

## Вопрос

Чем merge отличается от rebase и когда использовать revert, reset, restore или reflog?

## Короткий ответ

Merge создаёт commit, соединяющий две истории, и сохраняет исходную топологию. Rebase переносит commits на новую базу и переписывает их hashes, поэтому удобен для локальной ветки, но опасен для уже опубликованной общей истории. Revert добавляет новый commit, отменяющий выбранные изменения, и подходит для shared branch. Reset двигает branch pointer и в режимах mixed/hard меняет index или working tree; для опубликованной истории требует особой осторожности. Restore возвращает содержимое файлов из index или commit, не двигая branch. Reflog помогает найти прежние локальные значения refs после ошибочного reset или rebase.

## Разбор

- Перед recovery смотрят git status, log --graph и diff, затем определяют: нужно сохранить историю или переписать только локальную работу.
- Конфликт — не выбор «ours/theirs» вслепую: нужно восстановить итоговое намерение обеих сторон и запустить проверки.
- Rebase делает линейную историю, но каждый перенесённый commit новый. Force push допустим только по согласованной политике и лучше с --force-with-lease.
- Reflog локален и не является backup remote repository.

## Частые уточнения

**Как отменить опубликованный commit?** Обычно git revert, чтобы сохранить общую историю и явно добавить обратное изменение.

**Чем reset --soft отличается от --hard?** Soft двигает HEAD, сохраняя index и working tree; hard приводит оба к target и может уничтожить незакоммиченные изменения.

**Зачем --force-with-lease?** Он откажется перезаписать remote ref, если тот изменился не так, как ожидал локальный клиент.

## Где ошибаются

Нельзя советовать reset --hard или force push как обычное исправление shared branch. Сначала определяют точные refs и сохраняют незакоммиченную работу.

## Источники

- [Git Interview Questions](https://www.indeed.com/career-advice/interviewing/git-interview-questions)
- [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide)
- [Pro Git](https://git-scm.com/book/en/v2)
