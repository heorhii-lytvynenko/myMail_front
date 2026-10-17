export const revalidateApi = {
  tags: (tags: string[]) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/revalidate?tags=${tags.join(',')}`,
      { method: 'GET' }
    )
  }
}
