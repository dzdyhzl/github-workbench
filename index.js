/**
 * Host half of the GitHub repository workbench bundle.
 *
 * Provides a Typert Remote service (`githubWorkbench`) over the local GitHub
 * CLI plus declined-workspace persistence in ~/.dsh/github-workbench.json.
 * The service extends TypertRemoteService, so the running Gateway resolves
 * its methods conservatively (SRC fallback) and the client half mounts the
 * same endpoints through its generated-shaped contribution.
 */

import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { isAbsolute, join, parse, resolve } from 'node:path'
import { writeFileAtomic, withFileLock } from '@deepseek-ai/dsh-atomic-write'
import { dshHomePath } from '@deepseek-ai/dsh-home-paths'
import { RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'

/** Read-modify-write lock wait for the shared JSON file, in milliseconds. */
const STORE_LOCK_WAIT_MS = 5_000
/** Hard cap for one `gh` invocation; the UI refreshes long pages itself. */
const GH_TIMEOUT_MS = 45_000
/** In-memory output cap per stream of one `gh` invocation. */
const GH_MAX_OUTPUT_BYTES = 8 * 1024 * 1024
/** Environment names that must not reach the `gh` child. */
const SENSITIVE_ENV = /KEY|PASSWORD|SECRET|TOKEN/i
const DSH_ENV_PREFIX = 'DSH_'

/** Host page for a repository card. */
const PAGE_BASE = 'https://github.com'

/** Scrubbed child environment (the harness's own scrub semantics, inlined). */
function scrubbedParentEnv() {
  const env = {}
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined && !SENSITIVE_ENV.test(key) && !key.toUpperCase().startsWith(DSH_ENV_PREFIX)) {
      env[key] = value
    }
  }
  return env
}

/**
 * Fill the standard user-profile environment variables from the OS home
 * directory when the parent environment lacks them.
 *
 * `gh` and `git` locate their configuration (hosts.yml, global gitconfig)
 * through `USERPROFILE`/`APPDATA` on Windows and `HOME` elsewhere. A host
 * launched from a stripped environment (a service, a sandboxed shell) can
 * miss them, which makes `gh auth status` silently answer "not logged in"
 * even though the user IS signed in, and makes git fail with
 * "fatal: $HOME not set". `os.homedir()` keeps working in that case, so it
 * is the reliable source to restore the variables from.
 */
function withProfileEnv(env) {
  let home
  try { home = homedir() } catch { return env }
  if (typeof home !== 'string' || home === '' || !isAbsolute(home)) return env
  if (process.platform === 'win32') {
    const drive = home.slice(0, 2)
    return {
      ...env,
      ...(env.USERPROFILE === undefined ? { USERPROFILE: home } : {}),
      ...(env.HOME === undefined ? { HOME: home } : {}),
      ...(env.HOMEDRIVE === undefined && /^[A-Za-z]:$/.test(drive) ? { HOMEDRIVE: drive } : {}),
      ...(env.HOMEPATH === undefined ? { HOMEPATH: home.slice(2) } : {}),
      ...(env.APPDATA === undefined ? { APPDATA: join(home, 'AppData', 'Roaming') } : {}),
      ...(env.LOCALAPPDATA === undefined ? { LOCALAPPDATA: join(home, 'AppData', 'Local') } : {}),
    }
  }
  return { ...env, ...(env.HOME === undefined ? { HOME: home } : {}) }
}

/**
 * Run one `gh` command to completion with a scrubbed environment.
 * Resolves `{ exitCode, stdout, stderr }`; rejects when `gh` cannot start.
 */
function runGh(args, timeoutMs = GH_TIMEOUT_MS) {
  return new Promise((resolvePromise, reject) => {
    let child
    try {
      child = spawn('gh', args, {
        env: { ...withProfileEnv(scrubbedParentEnv()), GH_PROMPT_DISABLED: '1', GH_NO_UPDATE_NOTIFIER: '1', GH_PAGER: '', NO_COLOR: '1', CLICOLOR: '0' },
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    } catch (error) {
      reject(new Error(`gh could not start: ${error?.message ?? String(error)}`))
      return
    }
    const out = []
    const err = []
    let outBytes = 0
    let errBytes = 0
    let settled = false
    const settle = (fn, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      fn(value)
    }
    const timer = setTimeout(() => {
      try { child.kill('SIGKILL') } catch {}
      settle(reject, new Error(`gh ${args[0]} timed out after ${timeoutMs}ms`))
    }, timeoutMs)
    child.stdout.on('data', chunk => {
      outBytes += chunk.length
      if (outBytes <= GH_MAX_OUTPUT_BYTES) out.push(chunk)
    })
    child.stderr.on('data', chunk => {
      errBytes += chunk.length
      if (errBytes <= GH_MAX_OUTPUT_BYTES) err.push(chunk)
    })
    child.on('error', error => settle(reject, new Error(`gh could not start: ${error.message}`)))
    child.on('close', exitCode => {
      const text = chunks => Buffer.concat(chunks).toString('utf8').replace(/\r\n/g, '\n').replace(/\n$/, '')
      if (exitCode === null) {
        settle(reject, new Error(`gh ${args[0]} exited without a status (terminated)`))
        return
      }
      settle(resolvePromise, { exitCode, stdout: text(out), stderr: text(err) })
    })
  })
}

function ghFailure(action, result) {
  const line = (result.stderr || result.stdout || '').split('\n').find(part => part.trim() !== '') ?? ''
  throw new RemoteError('github-workbench/gh-failed', `gh ${action} failed: ${line || `exit ${result.exitCode}`}`, { action })
}

async function ghJson(args) {
  const result = await runGh(args)
  if (result.exitCode !== 0) ghFailure(args.join(' '), result)
  try {
    return JSON.parse(result.stdout)
  } catch (error) {
    throw new RemoteError('github-workbench/gh-failed', `gh output was not JSON: ${error.message}`, { action: args.join(' ') })
  }
}

/** Return a case-insensitive GitHub owner/repository key, or null for other origins. */
function classifyOrigin(raw) {
  const value = raw.trim()
  const scp = /^(?:git@)?github\.com:([^/].*)$/i.exec(value)
  let path = scp?.[1]
  if (path === undefined) {
    let url
    try { url = new URL(value) } catch { return null }
    if (!['http:', 'https:', 'ssh:', 'git:', 'git+ssh:'].includes(url.protocol)) return null
    const host = url.hostname.toLowerCase()
    if (host !== 'github.com' && !(host === 'ssh.github.com' && url.protocol === 'ssh:')) return null
    path = url.pathname.replace(/^\//, '')
  }
  const match = /^([\w.-]+)\/([\w.-]+)\/?$/.exec(path)
  if (match === null) return null
  const name = match[2].replace(/\.git$/i, '')
  if (name === '') return null
  return `${match[1]}/${name}`.toLowerCase()
}

/**
 * Canonical compare key for a declined-workspace path (stable across drive
 * letter case and separators on Windows).
 */
function canonicalPath(raw) {
  const value = resolve(String(raw))
  const parsed = parse(value)
  return process.platform === 'win32'
    ? parsed.root.toUpperCase() + value.slice(parsed.root.length).replace(/[\\/]+$/, '')
    : value.replace(/\/+$/, '')
}

/** The persisted store's on-disk location (fixed by the accepted scope). */
function storePath() {
  return dshHomePath('github-workbench.json')
}

function readStore() {
  const file = storePath()
  if (!existsSync(file)) return { declined: {} }
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8'))
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return { declined: {} }
    const declined = parsed.declined !== null && typeof parsed.declined === 'object' && !Array.isArray(parsed.declined)
      ? parsed.declined
      : {}
    return { declined }
  } catch {
    // A malformed store must not erase user data; report it and refuse edits
    // until the user fixes or deletes the file.
    return { declined: {}, malformed: true }
  }
}

function normalizeAccountKey(account) {
  const key = String(account ?? '').trim()
  return key === '' ? '' : key.toLowerCase()
}

function sanitizeRow(row) {
  return {
    ...(typeof row?.path === 'string' ? { path: row.path } : {}),
    ...(typeof row?.declinedAt === 'string' ? { declinedAt: row.declinedAt } : {}),
    ...(typeof row?.remark === 'string' ? { remark: row.remark } : {}),
  }
}

function listDeclined(store, accountKey) {
  const rows = store.declined[accountKey]
  return Array.isArray(rows) ? rows.filter(row => row !== null && typeof row === 'object').map(sanitizeRow) : []
}

/**
 * The remote service behind the workbench page. Methods marked through
 * `markRemote` (the plain-JavaScript shape of the `@Remote` decorator) export
 * themselves to the Typert Gateway; the running Gateway resolves their
 * descriptors conservatively (SRC) at call time.
 */

const REMOTE_METHOD_DESCRIPTOR = '@deepseek-ai/dsh-typert-protocol/remote-methods'

/** Record one method as a direct Remote invocation (plain-JS decorator shape). */
function markRemote(target, method) {
  const existing = Object.getOwnPropertyDescriptor(target, REMOTE_METHOD_DESCRIPTOR)?.value
  const previous = existing !== null && typeof existing === 'object' && Array.isArray(existing.methods) ? existing.methods : []
  Object.defineProperty(target, REMOTE_METHOD_DESCRIPTOR, {
    configurable: true,
    value: Object.freeze({
      version: 1,
      methods: Object.freeze([...previous, Object.freeze({ method, invocation: Object.freeze({ kind: 'direct' }) })]),
    }),
  })
}

export class GithubWorkbenchService extends TypertRemoteService {
  static inject = ['subprocess']

  constructor(ctx) {
    super(ctx, 'githubWorkbench')
    this.subprocess = ctx.subprocess
  }

  // ---------------------------------------------------------------- status

  /** Detect gh availability and enumerate signed-in accounts. */
  async status() {
    try {
      const result = await runGh(['auth', 'status', '--json', 'hosts'], 15_000)
      if (result.exitCode !== 0) {
        return { ghAvailable: true, signedIn: false, accounts: [], activeAccount: null, diagnostic: firstLine(result.stderr) || firstLine(result.stdout) }
      }
      const parsed = parseAuthStatus(result.stdout)
      return {
        ghAvailable: true,
        signedIn: parsed.accounts.length > 0,
        accounts: parsed.accounts,
        activeAccount: parsed.active,
        diagnostic: null,
      }
    } catch (error) {
      return { ghAvailable: false, signedIn: false, accounts: [], activeAccount: null, diagnostic: error.message }
    }
  }

  /** Switch the active gh account after the client confirmed. */
  async switchAccount(account) {
    const login = String(account ?? '').trim()
    if (login === '') throw new RemoteError('github-workbench/invalid-account', 'an account login is required', {})
    const result = await runGh(['auth', 'switch', '-u', login, '-h', 'github.com'], 30_000)
    if (result.exitCode !== 0) ghFailure(`auth switch -u ${login}`, result)
    return { switched: login }
  }

  // ------------------------------------------------------------ repositories

  /** Read one page of the active account's personal/collaborator/org repos. */
  async repositories(page, perPage) {
    const size = clampPage(perPage)
    const index = clampPage(page) || 1
    const data = await ghJson([
      'api',
      `user/repos?per_page=${String(size)}&page=${String(index)}&affiliation=owner,collaborator,organization_member&sort=updated`,
    ])
    if (!Array.isArray(data)) {
      throw new RemoteError('github-workbench/gh-failed', 'gh api returned a non-list answer', { action: 'user/repos' })
    }
    const repositories = data.filter(item => item !== null && typeof item === 'object').map(item => ({
      fullName: typeof item.full_name === 'string' ? item.full_name : '',
      owner: typeof item.owner?.login === 'string' ? item.owner.login : '',
      name: typeof item.name === 'string' ? item.name : '',
      url: typeof item.html_url === 'string' ? item.html_url : `${PAGE_BASE}/${item.full_name ?? ''}`,
      private: item.private === true,
      visibility: typeof item.visibility === 'string' ? item.visibility.toUpperCase() : (item.private === true ? 'PRIVATE' : 'PUBLIC'),
      updatedAt: typeof item.updated_at === 'string' ? item.updated_at : null,
      pushedAt: typeof item.pushed_at === 'string' ? item.pushed_at : null,
      affiliation: typeof item.affiliation === 'string' ? item.affiliation : '',
      permissions: item.permissions !== null && typeof item.permissions === 'object'
        ? { admin: item.permissions.admin === true, maintain: item.permissions.maintain === true, push: item.permissions.push === true }
        : undefined,
    }))
    return { repositories, page: index, perPage: size }
  }

  /** Check whether `<account>/<name>` already exists (for the create form). */
  async repositoryExists(account, name) {
    const owner = String(account ?? '').trim()
    const repo = String(name ?? '').trim()
    if (owner === '' || repo === '' || /[^\w.-]/.test(repo)) {
      throw new RemoteError('github-workbench/invalid-repository', 'a repository owner and a plain repository name are required', {})
    }
    const result = await runGh(['repo', 'view', `${owner}/${repo}`, '--json', 'name'], 20_000)
    return { exists: result.exitCode === 0 }
  }

  /**
   * Create the repository for a local directory. Returns the created repo and
   * the exact git commands the workspace still needs; this plugin never
   * stages, commits, or pushes on its own.
   */
  async createRepository(request) {
    const cwd = String(request?.cwd ?? '').trim()
    const name = String(request?.name ?? '').trim()
    const description = typeof request?.description === 'string' ? request.description.trim() : ''
    const visibility = request?.visibility === 'public' ? 'public' : 'private'
    const link = request?.link !== false
    if (!isAbsolute(cwd) || !existsSync(cwd)) {
      throw new RemoteError('github-workbench/invalid-workspace', `the workspace directory does not exist: ${cwd}`, { path: cwd })
    }
    if (name === '' || /[^\w.-]/.test(name)) {
      throw new RemoteError('github-workbench/invalid-repository', 'the repository name must be a plain GitHub repository name', { name })
    }
    const whoami = await ghJson(['api', 'user', '--jq', '.login'])
    const owner = typeof whoami === 'string' ? whoami.trim() : ''
    if (owner === '') throw new RemoteError('github-workbench/gh-failed', 'gh api user returned no login', { action: 'api user' })
    const exists = await this.repositoryExists(owner, name)
    if (exists.exists) {
      throw new RemoteError('github-workbench/repository-exists', `repository ${owner}/${name} already exists; rename the new repository or link the existing one as origin`, { owner, name })
    }
    const args = ['repo', 'create', name, '--disable-wiki', visibility === 'public' ? '--public' : '--private']
    if (description !== '') args.push('--description', description)
    if (link) args.push('--source', cwd, '--remote', 'origin')
    const created = await ghJson(args)
    const url = typeof created?.html_url === 'string' && created.html_url !== ''
      ? created.html_url
      : `${PAGE_BASE}/${owner}/${name}`
    return {
      owner,
      name,
      url,
      linked: link,
      followUp: link
        ? ['git push -u origin main  # after your first commit']
        : [
            `git remote add origin ${url}.git`,
            'git push -u origin main  # after your first commit',
          ],
    }
  }

  /** Local git facts for the linked-workspace badges. */
  async localOrigins(workspaces) {
    const list = Array.isArray(workspaces)
      ? workspaces.filter(item => item !== null && typeof item === 'object'
        && typeof item.workspaceId === 'string' && typeof item.path === 'string')
      : []
    if (list.length === 0) return { origins: [] }
    const origins = await Promise.all(list.map(async item => {
      const origin = await originOfWorkspace(item.path)
      return { workspaceId: item.workspaceId, origin, linked: origin !== null }
    }))
    return { origins }
  }

  /**
   * Point a workspace's `origin` at an existing repository without staging,
   * committing, or pushing; the response names the exact next command.
   */
  async linkExisting(request) {
    const cwd = String(request?.cwd ?? '').trim()
    const owner = String(request?.owner ?? '').trim()
    const name = String(request?.name ?? '').trim()
    if (!isAbsolute(cwd) || !existsSync(cwd)) {
      throw new RemoteError('github-workbench/invalid-workspace', `the workspace directory does not exist: ${cwd}`, { path: cwd })
    }
    if (owner === '' || name === '' || /[^\w.-]/.test(name)) {
      throw new RemoteError('github-workbench/invalid-repository', 'a repository owner and a plain repository name are required', {})
    }
    const url = `${PAGE_BASE}/${owner}/${name}.git`
    const existing = await run(['git', '-C', cwd, 'remote', 'get-url', 'origin'])
    if (existing !== null) {
      const removed = await run(['git', '-C', cwd, 'remote', 'remove', 'origin'])
      if (removed === null) {
        throw new RemoteError('github-workbench/git-failed', `could not replace the existing origin of ${cwd}`, { path: cwd })
      }
    }
    const added = await run(['git', '-C', cwd, 'remote', 'add', 'origin', url])
    if (added === null) {
      throw new RemoteError('github-workbench/git-failed', `git remote add origin failed for ${cwd}`, { path: cwd })
    }
    return { owner, name, url, linked: true, followUp: ['git push -u origin main  # after your first commit'] }
  }

  /**
   * Change a repository's visibility after the client confirmed. The newer
   * gh CLI refuses `repo edit --visibility` without the consequences flag;
   * pass it unconditionally (old versions ignore unknown flags badly only
   * for removed flags, and this one is additive since gh 2.56).
   */
  async setVisibility(request) {
    const owner = String(request?.owner ?? '').trim()
    const name = String(request?.name ?? '').trim()
    const visibility = request?.visibility === 'public' ? 'public'
      : request?.visibility === 'private' ? 'private' : ''
    if (owner === '' || name === '' || /[^\w.-]/.test(name)) {
      throw new RemoteError('github-workbench/invalid-repository', 'a repository owner and a plain repository name are required', {})
    }
    if (visibility === '') {
      throw new RemoteError('github-workbench/invalid-visibility', 'visibility must be \'public\' or \'private\'', { visibility: String(request?.visibility ?? '') })
    }
    const result = await runGh(['repo', 'edit', `${owner}/${name}`, '--visibility', visibility, '--accept-visibility-change-consequences'], 30_000)
    if (result.exitCode !== 0) ghFailure(`repo edit ${owner}/${name}`, result)
    return { owner, name, visibility }
  }

  // ------------------------------------------------------------- declined

  /** Read one account's declined workspaces. */
  async declinedList(account) {
    const key = normalizeAccountKey(account)
    const store = readStore()
    if (store.malformed) {
      throw new RemoteError('github-workbench/store-malformed', `${storePath()} is not valid JSON; fix or delete the file before editing declined workspaces`, {})
    }
    return { account: key, rows: listDeclined(store, key), storePath: storePath() }
  }

  /** Update one row's remark. */
  async declinedSetRemark(account, path, remark) {
    const key = normalizeAccountKey(account)
    const target = canonicalPath(path)
    const text = String(remark ?? '')
    return await this.mutateStore(store => {
      const rows = listDeclined(store, key)
      const row = rows.find(candidate => canonicalPath(candidate.path) === target)
      if (row === undefined) {
        throw new RemoteError('github-workbench/not-found', 'the declined workspace is no longer recorded', { path: String(path) })
      }
      row.remark = text
      return { ...store, declined: { ...store.declined, [key]: rows } }
    })
  }

  /** Remove one declined row after the client confirmed. */
  async declinedRemove(account, path) {
    const key = normalizeAccountKey(account)
    const target = canonicalPath(path)
    return await this.mutateStore(store => {
      const rows = listDeclined(store, key)
      const kept = rows.filter(candidate => canonicalPath(candidate.path) !== target)
      if (kept.length === rows.length) {
        throw new RemoteError('github-workbench/not-found', 'the declined workspace is no longer recorded', { path: String(path) })
      }
      return { ...store, declined: { ...store.declined, [key]: kept } }
    })
  }

  /** Serialized read-modify-write on the shared JSON file. */
  async mutateStore(change) {
    const file = storePath()
    const result = await withFileLock(file, async () => {
      const store = readStore()
      if (store.malformed) {
        throw new RemoteError('github-workbench/store-malformed', `${file} is not valid JSON; fix or delete the file before editing declined workspaces`, {})
      }
      const next = change(store)
      await writeFileAtomic(file, `${JSON.stringify(next, null, 2)}\n`, { mode: 0o600 })
      return next
    }, { waitMs: STORE_LOCK_WAIT_MS })
    return { storePath: file }
  }
}

function clampPage(value) {
  const size = Number(value)
  return Number.isFinite(size) && size >= 1 ? Math.min(Math.floor(size), 400) : 0
}

function firstLine(text) {
  const line = String(text ?? '').split('\n').find(part => part.trim() !== '')
  return line === undefined ? null : line
}

/** Parse `gh auth status --json hosts`. */
function parseAuthStatus(stdout) {
  let parsed
  try {
    parsed = JSON.parse(stdout)
  } catch {
    return { accounts: [], active: null }
  }
  const accounts = []
  let active = null
  for (const host of parsed?.hosts?.['github.com'] ?? []) {
    if (host === null || typeof host !== 'object' || host.state !== 'success') continue
    if (typeof host.login !== 'string' || host.login === '') continue
    accounts.push({
      login: host.login,
      active: host.active === true,
      protocol: typeof host.gitProtocol === 'string' ? host.gitProtocol : null,
    })
    if (host.active === true && active === null) active = host.login
  }
  return { accounts, active }
}

/** Read the `remote origin` URL of a workspace without spawning a shell. */
async function originOfWorkspace(path) {
  const directory = String(path ?? '').trim()
  if (directory === '' || !isAbsolute(directory)) return null
  const result = await run(['git', '-C', directory, 'remote', 'get-url', 'origin'])
  if (result === null) return null
  return classifyOrigin(result)
}

/** spawn helper that resolves null instead of throwing when git is absent. */
function run(argv) {
  return new Promise(resolvePromise => {
    let child
    try {
      child = spawn(argv[0], argv.slice(1), {
        env: withProfileEnv(scrubbedParentEnv()),
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    } catch {
      resolvePromise(null)
      return
    }
    const out = []
    const err = []
    let settled = false
    const finish = value => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolvePromise(value)
    }
    const timer = setTimeout(() => {
      try { child.kill('SIGKILL') } catch {}
      finish(null)
    }, 10_000)
    child.stdout.on('data', chunk => out.push(chunk))
    child.stderr.on('data', chunk => err.push(chunk))
    child.on('error', () => finish(null))
    child.on('close', exitCode => {
      if (exitCode !== 0) {
        finish(null)
        return
      }
      finish(Buffer.concat(out).toString('utf8').trim())
    })
  })
}

markRemote(GithubWorkbenchService.prototype, 'status')
markRemote(GithubWorkbenchService.prototype, 'switchAccount')
markRemote(GithubWorkbenchService.prototype, 'repositories')
markRemote(GithubWorkbenchService.prototype, 'createRepository')
markRemote(GithubWorkbenchService.prototype, 'linkExisting')
markRemote(GithubWorkbenchService.prototype, 'setVisibility')
markRemote(GithubWorkbenchService.prototype, 'localOrigins')
markRemote(GithubWorkbenchService.prototype, 'declinedList')
markRemote(GithubWorkbenchService.prototype, 'declinedSetRemark')
markRemote(GithubWorkbenchService.prototype, 'declinedRemove')

export default GithubWorkbenchService
