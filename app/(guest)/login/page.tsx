import { AuthPage } from 'app/_features/auth/AuthPage'
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  return <AuthPage mode="login" reason={(await searchParams).reason} />
}
