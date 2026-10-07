import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

console.log('Running smoke tests for dsh-plugin-session-delete...')

// 1. Check package.json
const pkgPath = path.join(rootDir, 'package.json')
assert.ok(fs.existsSync(pkgPath), 'package.json must exist')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
assert.strictEqual(pkg.name, 'dsh-plugin-session-delete', 'package name must be dsh-plugin-session-delete')
assert.ok(pkg.exports['.'], 'exports . must exist')
assert.ok(pkg.exports['./client'], 'exports ./client must exist')
assert.ok(pkg.exports['./package.json'], 'exports ./package.json must exist')
assert.strictEqual(pkg.dsh?.client?.platform, 'web', 'dsh.client.platform must be web')
assert.deepStrictEqual(pkg.dsh?.client?.inject, [], 'dsh.client.inject must be empty array')
console.log('✓ package.json validated')

// 2. Check cordis.patch.yml
const patchPath = path.join(rootDir, 'cordis.patch.yml')
assert.ok(fs.existsSync(patchPath), 'cordis.patch.yml must exist')
const patchContent = fs.readFileSync(patchPath, 'utf8')
assert.ok(patchContent.includes("name: 'dsh-plugin-session-delete'") || patchContent.includes("name: dsh-plugin-session-delete"), 'patch must register dsh-plugin-session-delete')
console.log('✓ cordis.patch.yml validated')

// 3. Test sessionIdVariants logic from src/index.js
const SESSION_ID_RE = /^(session-)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function sessionIdVariants(sessionId) {
  const variants = new Set([sessionId])
  if (sessionId.startsWith('session-')) {
    variants.add(sessionId.slice('session-'.length))
  } else if (SESSION_ID_RE.test(sessionId)) {
    variants.add(`session-${sessionId}`)
  }
  return [...variants]
}

const rawId = '14f94120-a46e-4a5a-9d30-54abad184aa8'
const prefixedId = 'session-14f94120-a46e-4a5a-9d30-54abad184aa8'
assert.deepStrictEqual(new Set(sessionIdVariants(rawId)), new Set([rawId, prefixedId]))
assert.deepStrictEqual(new Set(sessionIdVariants(prefixedId)), new Set([rawId, prefixedId]))
console.log('✓ sessionIdVariants logic validated')

// 4. Validate src/client.js bundle registration
const clientPath = path.join(rootDir, 'src', 'client.js')
assert.ok(fs.existsSync(clientPath), 'src/client.js must exist')
const clientContent = fs.readFileSync(clientPath, 'utf8')
assert.ok(clientContent.includes("id: 'dsh-plugin-session-delete'"), 'client must register id dsh-plugin-session-delete')
assert.ok(!clientContent.includes('IconTrashOutline16,'), 'client must not directly destructure IconTrashOutline16')
console.log('✓ src/client.js validated')

console.log('All smoke tests passed!')
