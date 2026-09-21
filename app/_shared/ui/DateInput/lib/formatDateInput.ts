export const formatDateInput = (digits: string) => {
  const clean = digits.replace(/\D/g, '').slice(0, 8)

  if (clean.length < 4) return clean
  if (clean.length === 4) return `${clean}-`
  if (clean.length < 6) return `${clean.slice(0, 4)}-${clean.slice(4)}`
  if (clean.length === 6) return `${clean.slice(0, 4)}-${clean.slice(4)}-`

  return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6)}`
}
