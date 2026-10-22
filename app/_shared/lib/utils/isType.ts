export const isType = {
  array: (v: unknown): v is unknown[] => {
    return Array.isArray(v)
  },

  object: (v: unknown): v is Record<string, unknown> => {
    return (
      typeof v === 'object' &&
      v !== null &&
      !Array.isArray(v) &&
      !(v instanceof Function)
    )
  },

  function: (v: unknown): v is (...args: unknown[]) => unknown => {
    return typeof v === 'function'
  },

  string: (v: unknown): v is string => {
    return typeof v === 'string'
  },

  number: (v: unknown): v is number => {
    return typeof v === 'number' && !Number.isNaN(v)
  },

  undefined: (v: unknown): v is undefined => {
    return v === undefined
  },

  null: (v: unknown): v is null => {
    return v === null
  },

  nil: (v: unknown): v is null | undefined => {
    return v === null || v === undefined
  },

  file: (v: unknown): v is File => {
    return v instanceof File
  },

  blob: (v: unknown): v is Blob => {
    return v instanceof Blob
  },

  fileOrBlob: (v: unknown): v is File | Blob => {
    return v instanceof File || v instanceof Blob
  }
}
