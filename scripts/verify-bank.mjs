import { access, readFile, readdir } from 'node:fs/promises'
import { constants as fsConstants } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const CATEGORY_CONTRACT = {
  'http-api': { prefix: 'HTTP', total: 8 },
  node: { prefix: 'NODE', total: 7 },
  nestjs: { prefix: 'NEST', total: 9 },
  'sql-postgresql': { prefix: 'SQL', total: 15 },
  'oop-design': { prefix: 'OOP', total: 10 },
  'backend-architecture': { prefix: 'ARCH', total: 6 },
  'security-auth': { prefix: 'SEC', total: 7 },
  testing: { prefix: 'TEST', total: 5 },
  operations: { prefix: 'OPS', total: 9 },
}

export const TOP_40_IDS = [
  'HTTP-01', 'HTTP-02', 'HTTP-03', 'HTTP-04', 'HTTP-05',
  'NODE-02', 'NODE-03', 'NODE-04', 'NODE-05',
  'NEST-02', 'NEST-03', 'NEST-04', 'NEST-05', 'NEST-06', 'NEST-09',
  'SQL-01', 'SQL-02', 'SQL-05', 'SQL-07', 'SQL-08', 'SQL-10', 'SQL-11', 'SQL-12', 'SQL-14',
  'OOP-01', 'OOP-04', 'OOP-06', 'OOP-08',
  'ARCH-01', 'ARCH-02', 'ARCH-03', 'ARCH-06',
  'SEC-01', 'SEC-02', 'SEC-05',
  'TEST-01', 'TEST-02',
  'OPS-01', 'OPS-03', 'OPS-06',
]

export const SOURCE_FAMILIES = new Set([
  'roadmap-rest', 'roadmap-node', 'roadmap-backend', 'backend-bank', 'backend-guide',
  'node-guide', 'candidate-reports', 'nest-guide-a', 'nest-guide-b', 'assessment-sql',
  'sql-guide', 'oop-bank-a', 'oop-bank-b', 'oop-bank-c', 'security-guide',
  'employer-guide', 'assessment-platform', 'ops-guide', 'docker-interview',
  'git-interview', 'linux-interview', 'market-signal',
])

export const PROJECT_VALUES = new Set([
  'planner', 'amazing-ekb', 'amazing-backend', 'amazing-admin', 'amazing-frontend',
  'nest-starter', 'react-starter',
])

export const EVIDENCE_VALUES = new Set([
  'implemented', 'tested-in-repo', 'deployment-contract', 'known-gap',
])

export const PROJECT_SNAPSHOTS = {
  planner: { path: '/Users/denischernykh/projects/planner', branch: 'main', commit: 'fb4c6e3' },
  'amazing-backend': { path: '/Users/denischernykh/projects/pet/amazing-ekb-hub/backend-codex', branch: 'stage', commit: '04661c9' },
  'amazing-admin': { path: '/Users/denischernykh/projects/pet/amazing-ekb-hub/admin-codex', branch: 'stage', commit: '2703a2d' },
  'amazing-frontend': { path: '/Users/denischernykh/projects/pet/amazing-ekb-hub/frontend-codex', branch: 'stage', commit: 'fccaacc8' },
  'nest-starter': { path: '/Users/denischernykh/projects/starters/nest-js-starter', branch: 'stage', commit: 'a0c8e80' },
  'react-starter': { path: '/Users/denischernykh/projects/starters/react-starter', branch: 'stage', commit: '258b4e0' },
  'frontend-interview': { path: '/Users/denischernykh/Documents/interview', branch: 'main', commit: '1fe3fdc' },
}

const BASE_HEADINGS = [
  '## Вопрос',
  '## Короткий ответ',
  '## Разбор',
  '## Частые уточнения',
  '## Где ошибаются',
  '## Источники',
]

const PROJECT_HEADING = '## Пример из моих проектов'

const REQUIRED_NAVIGATION = [
  'README.md',
  'study-routes/top-40.md',
  'study-routes/week-plan.md',
  'study-routes/sql-first.md',
  'study-routes/backend-first.md',
  'study-routes/deployment-and-ops.md',
  'study-routes/practice.md',
  'study-routes/by-project.md',
  'study-routes/role-context.md',
  'mock-interviews/01-backend-fundamentals.md',
  'mock-interviews/02-sql-oop-architecture.md',
  'mock-interviews/03-security-testing-operations.md',
  'mock-interviews/04-mixed-interview.md',
  'practice/SQL-P01-left-join-aggregation.md',
  'practice/SQL-P02-duplicates-having.md',
  'practice/SQL-P03-anti-join.md',
  'practice/SQL-P04-top-n-per-group.md',
  'practice/BE-P01-secure-nest-endpoint.md',
  'practice/BE-P02-broken-container-deploy.md',
  'docs/question-selection.md',
  'docs/project-evidence.md',
  'docs/sources.md',
]

const MOCK_FILES = [
  'mock-interviews/01-backend-fundamentals.md',
  'mock-interviews/02-sql-oop-architecture.md',
  'mock-interviews/03-security-testing-operations.md',
  'mock-interviews/04-mixed-interview.md',
]

const BANNED_CANONICAL_PATTERNS = [
  /transactional outbox/i,
  /\bCQRS\b/i,
  /\bfencing\b/i,
  /advisory locks?/i,
  /AsyncLocalStorage/i,
  /signed cache invalidation/i,
  /OCI provenance/i,
  /partial[- ]deploy/i,
  /exactly[- ]once/i,
]

async function listMarkdownFiles(directory) {
  const files = []
  let entries
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch (error) {
    if (error?.code === 'ENOENT') return files
    throw error
  }
  for (const entry of entries) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await listMarkdownFiles(target)))
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(target)
  }
  return files.sort()
}

function parseArray(value, file, key, errors) {
  if (!value?.startsWith('[') || !value.endsWith(']')) {
    errors.push(`${file}: ${key} must be a one-line bracket array`)
    return []
  }
  const body = value.slice(1, -1).trim()
  return body ? body.split(',').map((item) => item.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean) : []
}

export function parseQuestion(content, file = '<memory>') {
  const errors = []
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) return { metadata: {}, body: content, errors: [`${file}: missing front matter`] }
  const metadata = {}
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator < 1) {
      errors.push(`${file}: invalid front matter line: ${line}`)
      continue
    }
    const key = line.slice(0, separator).trim()
    const raw = line.slice(separator + 1).trim()
    metadata[key] = ['selection_sources', 'projects'].includes(key)
      ? parseArray(raw, file, key, errors)
      : raw.replace(/^['"]|['"]$/g, '')
  }
  return { metadata, body: content.slice(match[0].length), errors }
}

function markdownLinks(content) {
  return [...content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1].trim())
}

function stripLineSuffix(target) {
  return target.replace(/:\d+(?::\d+)?$/, '')
}

async function pathExists(target) {
  try {
    await access(target, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}

async function validateLinks(rootDir, file, content, errors, { includeAbsolute = false } = {}) {
  for (const rawTarget of markdownLinks(content)) {
    if (/^(https?:|mailto:)/.test(rawTarget) || rawTarget.startsWith('#')) continue
    const withoutAnchor = decodeURIComponent(rawTarget.split('#')[0])
    if (!withoutAnchor) continue
    if (path.isAbsolute(withoutAnchor) && !includeAbsolute) continue
    const resolved = stripLineSuffix(path.isAbsolute(withoutAnchor)
      ? withoutAnchor
      : path.resolve(path.dirname(file), withoutAnchor))
    if (!(await pathExists(resolved))) errors.push(`${path.relative(rootDir, file)}: broken link ${rawTarget}`)
  }
}

function sectionMap(body) {
  const sections = new Map()
  for (const match of body.matchAll(/(?:^|\n)## ([^\n]+)\r?\n\r?\n([\s\S]*?)(?=\r?\n## |$)/g)) {
    sections.set(`## ${match[1].trim()}`, match[2].trim())
  }
  return sections
}

function validateHeadings(body, file, metadata, errors) {
  const actual = [...body.matchAll(/^## .+$/gm)].map((match) => match[0].trim())
  const expected = BASE_HEADINGS.slice()
  if (metadata.projects?.length) expected.splice(3, 0, PROJECT_HEADING)
  if (actual.join('\n') !== expected.join('\n')) {
    errors.push(`${file}: H2 headings must exactly match the required ordered list`)
  }
  const sections = sectionMap(body)
  for (const heading of expected) {
    const content = sections.get(heading) ?? ''
    if (content.length < 20) errors.push(`${file}: section ${heading} is too short`)
  }
  const short = sections.get('## Короткий ответ') ?? ''
  const wordCount = short.split(/\s+/).filter(Boolean).length
  if (wordCount < 45 || wordCount > 120) errors.push(`${file}: short answer must contain 45..120 words, got ${wordCount}`)
  const detail = sections.get('## Разбор') ?? ''
  const detailWords = detail.split(/\s+/).filter(Boolean).length
  if (detailWords < 45) errors.push(`${file}: analysis must contain at least 45 words, got ${detailWords}`)
  const followups = sections.get('## Частые уточнения') ?? ''
  const followupCount = [...followups.matchAll(/^\*\*[^\n]*\?\*\*/gm)].length
  if (followupCount < 2 || followupCount > 3) errors.push(`${file}: follow-up section must contain 2..3 bold questions, got ${followupCount}`)
  const sources = sections.get('## Источники') ?? ''
  if (markdownLinks(sources).length < 2) errors.push(`${file}: sources section must contain at least two links`)
  if (metadata.projects?.length) {
    const project = sections.get(PROJECT_HEADING) ?? ''
    if (!markdownLinks(project).some((link) => path.isAbsolute(link.split('#')[0].replace(/:\d+(?::\d+)?$/, '')))) {
      errors.push(`${file}: project example must contain an absolute local link`)
    }
    const sentences = [...project.matchAll(/[.!?](?:\s|$)/g)].length
    if (sentences < 2 || sentences > 4) errors.push(`${file}: project example must contain 2..4 sentences, got ${sentences}`)
  }
}

function expectedIds() {
  return Object.entries(CATEGORY_CONTRACT).flatMap(([category, contract]) =>
    Array.from({ length: contract.total }, (_, index) => ({
      id: `${contract.prefix}-${String(index + 1).padStart(2, '0')}`,
      category,
    })),
  )
}

function sameIds(actual, expected) {
  return actual.slice().sort().join('\n') === expected.slice().sort().join('\n')
}

async function routeQuestionIds(routePath, byFile, rootDir, errors) {
  const content = await readFile(routePath, 'utf8')
  const ids = []
  for (const target of markdownLinks(content)) {
    if (/^(https?:|mailto:|#)/.test(target)) continue
    const withoutAnchor = decodeURIComponent(target.split('#')[0])
    if (path.isAbsolute(withoutAnchor)) continue
    const question = byFile.get(path.resolve(path.dirname(routePath), withoutAnchor))
    if (question) ids.push(question.metadata.id)
  }
  if (new Set(ids).size !== ids.length) errors.push(`${path.relative(rootDir, routePath)}: duplicate question links`)
  return ids
}

function validateMetadata(question, relative, errors) {
  const { metadata, body } = question
  const contract = CATEGORY_CONTRACT[metadata.category]
  if (!contract) errors.push(`${relative}: invalid category ${metadata.category}`)
  if (!['very-high', 'high'].includes(metadata.frequency)) errors.push(`${relative}: invalid frequency ${metadata.frequency}`)
  if (!['top-40', 'extended'].includes(metadata.week_priority)) errors.push(`${relative}: invalid week_priority ${metadata.week_priority}`)
  if (!Array.isArray(metadata.selection_sources)) errors.push(`${relative}: selection_sources must be an array`)
  const sourceCount = metadata.selection_sources?.length ?? 0
  const requiredSources = metadata.frequency === 'very-high' ? 3 : 2
  if (sourceCount < requiredSources) errors.push(`${relative}: ${metadata.frequency} requires at least ${requiredSources} source families`)
  if (new Set(metadata.selection_sources ?? []).size !== sourceCount) errors.push(`${relative}: duplicate selection source family`)
  for (const source of metadata.selection_sources ?? []) {
    if (!SOURCE_FAMILIES.has(source)) errors.push(`${relative}: unknown selection source ${source}`)
    if (PROJECT_VALUES.has(source) || /planner|amazing|starter|project/i.test(source)) {
      errors.push(`${relative}: project cannot be a selection source`)
    }
  }
  const projects = metadata.projects ?? []
  for (const project of projects) if (!PROJECT_VALUES.has(project)) errors.push(`${relative}: invalid project ${project}`)
  if (projects.length && !EVIDENCE_VALUES.has(metadata.project_evidence)) errors.push(`${relative}: invalid or missing project_evidence`)
  if (!projects.length && metadata.project_evidence) errors.push(`${relative}: project_evidence requires projects`)
  if (!projects.length && body.includes(PROJECT_HEADING)) errors.push(`${relative}: project section requires projects metadata`)
  const expectedTop = TOP_40_IDS.includes(metadata.id)
  if ((metadata.week_priority === 'top-40') !== expectedTop) errors.push(`${relative}: week_priority disagrees with canonical TOP-40`)
  const prompt = `${body.match(/^# ([^\n]+)/m)?.[1] ?? ''}\n${sectionMap(body).get('## Вопрос') ?? ''}`
  for (const pattern of BANNED_CANONICAL_PATTERNS) {
    if (pattern.test(prompt)) errors.push(`${relative}: specialist project-shaped topic is forbidden in canonical title/question`)
  }
}

export async function verifyProjects(rootDir, snapshots = PROJECT_SNAPSHOTS) {
  const errors = []
  const warnings = []
  for (const [name, snapshot] of Object.entries(snapshots)) {
    if (!(await pathExists(snapshot.path))) {
      errors.push(`${name}: project path is missing: ${snapshot.path}`)
      continue
    }
    try {
      const head = execFileSync('git', ['-C', snapshot.path, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim()
      const branch = execFileSync('git', ['-C', snapshot.path, 'branch', '--show-current'], { encoding: 'utf8' }).trim()
      const dirty = execFileSync('git', ['-C', snapshot.path, 'status', '--short'], { encoding: 'utf8' }).trim()
      if (head !== snapshot.commit) warnings.push(`${name}: HEAD changed from ${snapshot.commit} to ${head}`)
      if (branch && branch !== snapshot.branch) warnings.push(`${name}: branch changed from ${snapshot.branch} to ${branch}`)
      if (dirty) warnings.push(`${name}: checkout has local changes; links were checked without modifying it`)
    } catch (error) {
      errors.push(`${name}: cannot inspect git state: ${error.message}`)
    }
  }
  const markdownFiles = [
    ...(await listMarkdownFiles(path.join(rootDir, 'questions'))),
    ...(await listMarkdownFiles(path.join(rootDir, 'study-routes'))),
    ...(await listMarkdownFiles(path.join(rootDir, 'practice'))),
    ...(await listMarkdownFiles(path.join(rootDir, 'docs'))),
    path.join(rootDir, 'README.md'),
  ]
  for (const file of markdownFiles) {
    if (!(await pathExists(file))) continue
    await validateLinks(rootDir, file, await readFile(file, 'utf8'), errors, { includeAbsolute: true })
  }
  return { errors, warnings }
}

export async function verifyBank(rootDir, { allowIncomplete = false } = {}) {
  const errors = []
  const questionFiles = await listMarkdownFiles(path.join(rootDir, 'questions'))
  const questions = []
  const byId = new Map()
  const byFile = new Map()

  for (const file of questionFiles) {
    const relative = path.relative(rootDir, file)
    const content = await readFile(file, 'utf8')
    const parsed = parseQuestion(content, relative)
    errors.push(...parsed.errors)
    validateMetadata(parsed, relative, errors)
    validateHeadings(parsed.body, relative, parsed.metadata, errors)
    await validateLinks(rootDir, file, content, errors)
    if (byId.has(parsed.metadata.id)) errors.push(`${relative}: duplicate id ${parsed.metadata.id}`)
    byId.set(parsed.metadata.id, parsed)
    byFile.set(path.resolve(file), parsed)
    questions.push({ ...parsed, file })
  }

  if (allowIncomplete) return { errors, questions }

  const expected = expectedIds()
  if (questions.length !== 76) errors.push(`expected 76 question cards, got ${questions.length}`)
  if (!sameIds(questions.map((item) => item.metadata.id), expected.map((item) => item.id))) errors.push('question IDs do not match the canonical 76-card inventory')
  for (const item of expected) {
    const question = byId.get(item.id)
    if (question && question.metadata.category !== item.category) errors.push(`${item.id}: expected category ${item.category}`)
  }

  for (const relative of REQUIRED_NAVIGATION) {
    const file = path.join(rootDir, relative)
    if (!(await pathExists(file))) {
      errors.push(`missing required file ${relative}`)
      continue
    }
    await validateLinks(rootDir, file, await readFile(file, 'utf8'), errors)
  }

  const routeExpectations = {
    'study-routes/top-40.md': TOP_40_IDS,
    'study-routes/week-plan.md': TOP_40_IDS,
    'study-routes/backend-first.md': expected.map((item) => item.id),
    'study-routes/sql-first.md': expected.filter((item) => item.category === 'sql-postgresql').map((item) => item.id),
    'study-routes/deployment-and-ops.md': expected.filter((item) => item.category === 'operations').map((item) => item.id),
    'study-routes/by-project.md': questions.filter((item) => item.metadata.projects?.length).map((item) => item.metadata.id),
    'docs/question-selection.md': expected.map((item) => item.id),
  }
  for (const [relative, expectedRouteIds] of Object.entries(routeExpectations)) {
    const file = path.join(rootDir, relative)
    if (!(await pathExists(file))) continue
    const actual = await routeQuestionIds(file, byFile, rootDir, errors)
    if (!sameIds(actual, expectedRouteIds)) errors.push(`${relative}: question links do not match the required inventory`)
  }

  for (const relative of MOCK_FILES) {
    const file = path.join(rootDir, relative)
    if (!(await pathExists(file))) continue
    const content = await readFile(file, 'utf8')
    const ids = await routeQuestionIds(file, byFile, rootDir, errors)
    if (ids.length !== 12) errors.push(`${relative}: expected 12 question links, got ${ids.length}`)
    if (/^## (Короткий ответ|Разбор|Источники)$/m.test(content)) errors.push(`${relative}: mock interview exposes answer sections`)
  }

  const practiceFiles = await listMarkdownFiles(path.join(rootDir, 'practice'))
  if (practiceFiles.length !== 6) errors.push(`expected 6 local practice files, got ${practiceFiles.length}`)
  const practiceRoute = path.join(rootDir, 'study-routes/practice.md')
  if (await pathExists(practiceRoute)) {
    const links = markdownLinks(await readFile(practiceRoute, 'utf8'))
    const externalFrontend = links.filter((link) => link.startsWith('/Users/denischernykh/Documents/interview/'))
    if (externalFrontend.length !== 2) errors.push('study-routes/practice.md: expected two frontend interview links')
    const linkedPractice = links
      .filter((link) => !/^(https?:|mailto:|#)/.test(link) && !path.isAbsolute(link))
      .map((link) => path.resolve(path.dirname(practiceRoute), decodeURIComponent(link.split('#')[0])))
      .filter((file) => file.startsWith(`${path.join(rootDir, 'practice')}${path.sep}`))
    if (!sameIds(linkedPractice, practiceFiles)) {
      errors.push('study-routes/practice.md: must link all six local practice files exactly once')
    }
  }

  const roleContext = path.join(rootDir, 'study-routes/role-context.md')
  if (await pathExists(roleContext)) {
    const content = await readFile(roleContext, 'utf8')
    const prompts = [...content.matchAll(/^## \d+\./gm)].length
    if (prompts !== 3) errors.push(`study-routes/role-context.md: expected 3 context prompts, got ${prompts}`)
    if (/^frequency:/m.test(content)) errors.push('study-routes/role-context.md: context prompts must not have a frequency rank')
  }

  const topCount = questions.filter((item) => item.metadata.week_priority === 'top-40').length
  if (topCount !== 40) errors.push(`expected 40 top-40 cards, got ${topCount}`)
  return { errors, questions }
}

async function cli() {
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const args = new Set(process.argv.slice(2))
  if (args.has('--projects')) {
    const result = await verifyProjects(rootDir)
    for (const warning of result.warnings) console.warn(`WARN: ${warning}`)
    if (result.errors.length) {
      for (const error of result.errors) console.error(`ERROR: ${error}`)
      process.exitCode = 1
      return
    }
    console.log(`Local evidence: ${Object.keys(PROJECT_SNAPSHOTS).length} checkouts and absolute links verified`)
    return
  }
  const result = await verifyBank(rootDir, { allowIncomplete: args.has('--allow-incomplete') })
  if (result.errors.length) {
    for (const error of result.errors) console.error(`ERROR: ${error}`)
    process.exitCode = 1
    return
  }
  console.log(`Question bank: ${result.questions.length} cards verified`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await cli()
