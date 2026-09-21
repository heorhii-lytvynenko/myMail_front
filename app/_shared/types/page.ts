export type PagePropsType<
  T extends {
    params?: Record<string, string>
    searchParams?: Record<string, string | undefined>
  }
> = {
  [K in keyof T]: Promise<T[K]>
}
