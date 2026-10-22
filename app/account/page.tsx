import { AccountPage } from 'app/_features/auth/AccountPage'
export default async function Page({ searchParams }: { searchParams: Promise<{ google?: string }> }) {
  return <AccountPage result={(await searchParams).google} />
}
