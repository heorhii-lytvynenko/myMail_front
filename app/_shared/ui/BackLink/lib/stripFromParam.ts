export const stripFromParam = (href: string) => {
  const [path, q = ''] = href.split('?')
  const params = new URLSearchParams(q)

  params.delete('from')
  const qs = params.toString()

  return `${path}${qs ? `?${qs}` : ''}`
}
