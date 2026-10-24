import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test, { after } from 'node:test'

import {
  CATEGORY_CONTRACT,
  TOP_40_IDS,
  parseQuestion,
  verifyBank,
  verifyProjects,
} from './verify-bank.mjs'

const tempRoots = new Set()

after(async () => {
  await Promise.all([...tempRoots].map((root) => rm(root, { recursive: true, force: true })))
})

function card({
  id = 'HTTP-01',
  category = 'http-api',
  frequency = 'high',
  weekPriority = TOP_40_IDS.includes(id) ? 'top-40' : 'extended',
  selectionSources = ['roadmap-rest', 'backend-guide'],
  projects = [],
  evidence,
} = {}) {
  const short = Array(60).fill('содержательное').join(' ')
  const projectMetadata = projects.length
    ? `\nprojects: [${projects.join(', ')}]\nproject_evidence: ${evidence ?? 'implemented'}`
    : ''
  const projectSection = projects.length
    ? '\n\n## Пример из моих проектов\n\nПример подтверждён [локальным файлом](/tmp/example.ts). Он не выдаётся за production experience.'
    : ''
  return `---
id: ${id}
category: ${category}
frequency: ${frequency}
week_priority: ${weekPriority}
selection_sources: [${selectionSources.join(', ')}]${projectMetadata}
---

# Обычная частотная тема

## Вопрос

Как объяснить обычную частотную тему на backend-собеседовании?

## Короткий ответ

${short}

## Разбор

${Array(55).fill('подробный').join(' ')}. Этот разбор описывает механизм, границы применения, компромиссы и наблюдаемый результат без выдуманного production-опыта.${projectSection}

## Частые уточнения

**Какой первый уточняющий вопрос?** Первый короткий и содержательный ответ.

**Какой второй уточняющий вопрос?** Второй короткий и содержательный ответ.

## Где ошибаются

Нельзя подменять общий ответ случайным примером из проекта или неподтверждённым утверждением.

## Источники

- [Первый независимый источник](https://example.com/one)
- [Второй независимый источник](https://example.org/two)
`
}

async function tempRoot() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'frequency-interview-bank-'))
  tempRoots.add(root)
  return root
}

async function put(root, relative, content) {
  const target = path.join(root, relative)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, content)
}

function expectedInventory() {
  return Object.entries(CATEGORY_CONTRACT).flatMap(([category, contract]) =>
    Array.from({ length: contract.total }, (_, index) => ({
      id: `${contract.prefix}-${String(index + 1).padStart(2, '0')}`,
      category,
    })),
  )
}

async function fullBank(root) {
  const inventory = expectedInventory()
  const all = []
  const top = []
  const sql = []
  const ops = []
  for (const item of inventory) {
    const relative = `questions/${item.category}/${item.id}.md`
    const isTop = TOP_40_IDS.includes(item.id)
    const selection = isTop
      ? ['roadmap-rest', 'roadmap-backend', 'backend-guide']
      : ['roadmap-rest', 'backend-guide']
    await put(root, relative, card({
      ...item,
      frequency: isTop ? 'very-high' : 'high',
      selectionSources: selection,
    }))
    const link = `- [${item.id}](../${relative})`
    all.push(link)
    if (isTop) top.push(link)
    if (item.category === 'sql-postgresql') sql.push(link)
    if (item.category === 'operations') ops.push(link)
  }

  await put(root, 'README.md', '# Test bank\n')
  await put(root, 'study-routes/top-40.md', `# TOP-40\n\n${top.join('\n')}\n`)
  await put(root, 'study-routes/week-plan.md', `# Week\n\n${top.join('\n')}\n`)
  await put(root, 'study-routes/backend-first.md', `# Backend\n\n${all.join('\n')}\n`)
  await put(root, 'study-routes/sql-first.md', `# SQL\n\n${sql.join('\n')}\n`)
  await put(root, 'study-routes/deployment-and-ops.md', `# OPS\n\n${ops.join('\n')}\n`)
  await put(root, 'study-routes/by-project.md', '# Projects\n')
  await put(root, 'study-routes/role-context.md', '# Role context\n\n## 1. First\n\nPrompt.\n\n## 2. Second\n\nPrompt.\n\n## 3. Third\n\nPrompt.\n')
  const practiceLinks = []
  for (const relative of [
    'practice/SQL-P01-left-join-aggregation.md',
    'practice/SQL-P02-duplicates-having.md',
    'practice/SQL-P03-anti-join.md',
    'practice/SQL-P04-top-n-per-group.md',
    'practice/BE-P01-secure-nest-endpoint.md',
    'practice/BE-P02-broken-container-deploy.md',
  ]) {
    await put(root, relative, '# Practice\n')
    practiceLinks.push(`- [Practice](../${relative})`)
  }
  practiceLinks.push('- [Frontend one](/Users/denischernykh/Documents/interview/one.md)')
  practiceLinks.push('- [Frontend two](/Users/denischernykh/Documents/interview/two.md)')
  await put(root, 'study-routes/practice.md', `# Practice\n\n${practiceLinks.join('\n')}\n`)
  for (const [index, file] of [
    '01-backend-fundamentals.md',
    '02-sql-oop-architecture.md',
    '03-security-testing-operations.md',
    '04-mixed-interview.md',
  ].entries()) {
    const start = index * 12
    const selected = [...all.slice(start, start + 12)]
    while (selected.length < 12) selected.push(all[selected.length])
    await put(root, `mock-interviews/${file}`, `# Mock\n\n${selected.join('\n')}\n`)
  }
  await put(root, 'docs/question-selection.md', `# Selection\n\n${all.join('\n')}\n`)
  await put(root, 'docs/project-evidence.md', '# Evidence\n')
  await put(root, 'docs/sources.md', '# Sources\n')
}

test('parseQuestion reads frequency metadata and arrays', () => {
  const parsed = parseQuestion(card())
  assert.equal(parsed.metadata.id, 'HTTP-01')
  assert.equal(parsed.metadata.frequency, 'high')
  assert.deepEqual(parsed.metadata.selection_sources, ['roadmap-rest', 'backend-guide'])
  assert.deepEqual(parsed.errors, [])
})

test('allow-incomplete accepts a valid frequency-first card', async () => {
  const root = await tempRoot()
  await put(root, 'questions/http-api/HTTP-01.md', card())
  const result = await verifyBank(root, { allowIncomplete: true })
  assert.deepEqual(result.errors, [])
})

test('very-high requires three independent source families', async () => {
  const root = await tempRoot()
  await put(root, 'questions/http-api/HTTP-01.md', card({ frequency: 'very-high' }))
  const result = await verifyBank(root, { allowIncomplete: true })
  assert.ok(result.errors.some((error) => error.includes('requires at least 3 source families')))
})

test('rejects duplicate or unknown source families', async () => {
  const root = await tempRoot()
  await put(root, 'questions/http-api/HTTP-01.md', card({ selectionSources: ['roadmap-rest', 'roadmap-rest', 'unknown'] }))
  const result = await verifyBank(root, { allowIncomplete: true })
  assert.ok(result.errors.some((error) => error.includes('duplicate selection source family')))
  assert.ok(result.errors.some((error) => error.includes('unknown selection source unknown')))
})

test('project evidence and optional project section are coupled', async () => {
  const root = await tempRoot()
  const broken = card().replace('selection_sources:', 'project_evidence: implemented\nselection_sources:')
  await put(root, 'questions/http-api/HTTP-01.md', broken)
  const result = await verifyBank(root, { allowIncomplete: true })
  assert.ok(result.errors.some((error) => error.includes('project_evidence requires projects')))
})

test('accepts a project example only when metadata and local link exist', async () => {
  const root = await tempRoot()
  await put(root, 'questions/http-api/HTTP-01.md', card({ projects: ['planner'] }))
  const result = await verifyBank(root, { allowIncomplete: true })
  assert.deepEqual(result.errors, [])
})

test('rejects project-shaped specialist question titles', async () => {
  const root = await tempRoot()
  await put(root, 'questions/http-api/HTTP-01.md', card().replace('# Обычная частотная тема', '# Transactional outbox'))
  const result = await verifyBank(root, { allowIncomplete: true })
  assert.ok(result.errors.some((error) => error.includes('specialist project-shaped topic')))
})

test('strict mode accepts the exact 76-card inventory and TOP-40', async () => {
  const root = await tempRoot()
  await fullBank(root)
  const result = await verifyBank(root)
  assert.deepEqual(result.errors, [])
  assert.equal(result.questions.length, 76)
})

test('strict mode rejects an incomplete TOP-40 route', async () => {
  const root = await tempRoot()
  await fullBank(root)
  await put(root, 'study-routes/top-40.md', '# TOP-40\n')
  const result = await verifyBank(root)
  assert.ok(result.errors.some((error) => error.includes('top-40.md: question links do not match')))
})

test('strict mode rejects an empty SQL route', async () => {
  const root = await tempRoot()
  await fullBank(root)
  await put(root, 'study-routes/sql-first.md', '# SQL\n')
  const result = await verifyBank(root)
  assert.ok(result.errors.some((error) => error.includes('sql-first.md: question links do not match')))
})

test('mock interview must contain twelve questions and no answer sections', async () => {
  const root = await tempRoot()
  await fullBank(root)
  await put(root, 'mock-interviews/01-backend-fundamentals.md', '# Mock\n\n## Короткий ответ\n')
  const result = await verifyBank(root)
  assert.ok(result.errors.some((error) => error.includes('expected 12 question links')))
  assert.ok(result.errors.some((error) => error.includes('exposes answer sections')))
})

test('practice route must link two existing frontend tasks', async () => {
  const root = await tempRoot()
  await fullBank(root)
  await put(root, 'study-routes/practice.md', '# Practice\n')
  const result = await verifyBank(root)
  assert.ok(result.errors.some((error) => error.includes('expected two frontend interview links')))
})

test('verifyProjects reports a missing checkout path', async () => {
  const root = await tempRoot()
  const result = await verifyProjects(root, {
    missing: { path: path.join(root, 'does-not-exist'), branch: 'main', commit: 'deadbee' },
  })
  assert.ok(result.errors.some((error) => error.includes('project path is missing')))
})

test('category contract totals 76 and canonical TOP-40 contains 40 unique IDs', () => {
  assert.equal(Object.values(CATEGORY_CONTRACT).reduce((sum, item) => sum + item.total, 0), 76)
  assert.equal(TOP_40_IDS.length, 40)
  assert.equal(new Set(TOP_40_IDS).size, 40)
})
