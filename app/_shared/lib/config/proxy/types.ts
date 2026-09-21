import type { NextRequest, NextResponse } from 'next/server'

export type ProxyNext = (
  request: NextRequest,
  response: NextResponse
) => Promise<NextResponse>

export type ProxyHandler = (
  request: NextRequest,
  response: NextResponse,
  next: ProxyNext
) => Promise<NextResponse>
