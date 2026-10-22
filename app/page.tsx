import { redirect } from 'next/navigation'
import { getCurrentUser } from './_features/auth/session'

export default async function HomePage() {
  redirect(await getCurrentUser() ? '/account' : '/login')
}
