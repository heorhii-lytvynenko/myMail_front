import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import net from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

// Exercise the actual production Next.js server without contacting any backend.
const reservation = net.createServer()
reservation.listen(0, '127.0.0.1')
await once(reservation, 'listening')
const port = reservation.address().port
await new Promise(resolve => reservation.close(resolve))
const origin = `http://127.0.0.1:${port}`
const server = spawn(process.execPath, [fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url)), 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, BACKEND_URL: 'https://backend.example', GOOGLE_INTEGRATION_ENABLED: 'false', BACKEND_LOGOUT_ENABLED: 'false' },
})
const stopped = once(server, 'exit')
let startup = ''
server.stdout.on('data', value => { startup = (startup + value).slice(-3000) })
server.stderr.on('data', value => { startup = (startup + value).slice(-3000) })
let checks = 0
async function request(path, options = {}) {
  return fetch(origin + path, { ...options, redirect: 'manual', signal: AbortSignal.timeout(5000) })
}
async function check(name, run) { await run(); checks++; console.log(`PASS ${name}`) }
try {
  let ready = false
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await request('/login')).status === 200) { ready = true; break } } catch { /* Wait for the local server to bind. */ }
    if (server.exitCode !== null) break
    await delay(100)
  }
  assert.ok(ready, `Local production server did not start. ${startup}`)
  for (const [path, language, text] of [['/login', 'en', 'Welcome back'], ['/register', 'en', 'Create your account'], ['/pl/login', 'pl', 'Witaj ponownie'], ['/pl/register', 'pl', 'Utwórz konto'], ['/ua/register', 'uk', 'Створіть обліковий запис']]) {
    await check(`server-rendered form and language ${path}`, async () => {
      const response = await request(path)
      assert.equal(response.status, 200)
      const html = await response.text()
      assert.ok(html.includes(`<html lang="${language}">`))
      assert.ok(html.includes(text))
    })
  }
  for (const [path, target] of [['/', '/login'], ['/account', '/login'], ['/pl/account', '/pl/login']]) {
    await check(`unauthenticated redirect ${path}`, async () => {
      const response = await request(path)
      assert.equal(response.status, 307)
      assert.equal(new URL(response.headers.get('location'), origin).pathname, target)
    })
  }
  await check('missing session returns uncached 401', async () => {
    const response = await request('/api/auth/session')
    assert.equal(response.status, 401)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  })
  await check('registration validation rejects before backend access', async () => {
    const response = await request('/api/auth/register', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'review@example.com', password: 'short', confirmPassword: 'short' }) })
    assert.equal(response.status, 400)
    assert.equal((await response.json()).code, 'VALIDATION_ERROR')
  })
  await check('cross-origin login rejected', async () => {
    assert.equal((await request('/api/auth/login', { method: 'POST', headers: { Origin: 'https://attacker.example' }, body: '{}' })).status, 403)
  })
  await check('Google feature remains safely disabled', async () => {
    assert.equal((await request('/api/integrations/google/connect', { method: 'POST', headers: { Origin: origin } })).status, 503)
  })
  await check('local logout works without a backend', async () => {
    const response = await request('/api/auth/logout', { method: 'POST', headers: { Origin: origin } })
    assert.equal(response.status, 200)
    assert.ok(response.headers.get('set-cookie').includes('Max-Age=0'))
  })
  console.log(`${checks} production-server smoke checks passed.`)
} finally {
  server.kill()
  await stopped
}
