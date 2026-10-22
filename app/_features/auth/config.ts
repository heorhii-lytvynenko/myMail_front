import 'server-only'

function origin(value: string | undefined, name: string): string {
  if (!value) throw new Error(`${name} must be configured.`)
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash ||
      (process.env.NODE_ENV === 'production' && url.protocol !== 'https:')) {
    throw new Error(`${name} must be an HTTPS origin in production, without a path or credentials.`)
  }
  return url.origin
}

export function backendUrl(path: string): string {
  const base = process.env.BACKEND_URL ||
    (process.env.NODE_ENV !== 'production' ? 'http://localhost:8080' : undefined)
  return `${origin(base, 'BACKEND_URL')}${path}`
}

export function frontendOrigin(): string {
  return origin(process.env.FRONTEND_URL, 'FRONTEND_URL')
}

export function googleIntegrationEnabled(): boolean {
  return process.env.GOOGLE_INTEGRATION_ENABLED === 'true'
}
