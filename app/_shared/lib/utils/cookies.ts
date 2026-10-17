import { Cookies } from 'react-cookie'

const cookieStore = new Cookies()

type GetOptions = Parameters<typeof cookieStore.get>[1]
type SetOptions = Parameters<typeof cookieStore.set>[2]
type RemoveOptions = Parameters<typeof cookieStore.remove>[1]

const defaultOptions: SetOptions = {
  path: '/'
}

export const cookies = {
  get: (name: string, options?: GetOptions): string | null => {
    return cookieStore.get(name, options) ?? null
  },

  set: (name: string, value: string, options?: SetOptions) => {
    cookieStore.set(name, value, {
      ...defaultOptions,
      ...options
    })
  },

  remove: (name: string, options?: RemoveOptions) => {
    cookieStore.remove(name, {
      ...defaultOptions,
      ...options
    })
  }
}
