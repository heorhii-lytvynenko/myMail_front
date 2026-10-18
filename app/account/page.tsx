import { redirect } from 'next/navigation'
import { getCurrentUser } from 'app/_features/auth/session'
import { LogoutButton } from 'app/_features/auth/LogoutButton'
import { ConnectGoogleButton } from '@features/google-integration'
export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return <main className="login-page"><section className="login-panel auth-panel">
    <span className="login-kicker">myMail</span><h1 className="login-title">You’re logged in</h1>
    <p className="login-copy">Welcome, {user.email}.</p>
    <ConnectGoogleButton /><LogoutButton />
  </section></main>
}
