import { expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { proxy } from '../proxy'

it.each([['/pl/login', 'pl'], ['/ua/register', 'ua'], ['/login', 'en'], ['/invalid/login', 'en']])('derives locale from the actual path %s', (path, expected) => {
  const response = proxy(new NextRequest(`https://frontend.example${path}`, { headers: { 'x-mymail-locale': 'untrusted' } }))
  expect(response.headers.get('x-middleware-request-x-mymail-locale')).toBe(expected)
})
