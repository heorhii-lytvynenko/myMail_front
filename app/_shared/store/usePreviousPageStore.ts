import { create } from 'zustand'

interface PreviousPageType {
  scrollY: number
  href: string
  restore?: boolean
}

interface PreviousPageStore {
  pages: Record<string, PreviousPageType>
  savePreviousPage: (key: string, page: PreviousPageType) => void
  getPreviousPage: (key: string) => PreviousPageType | undefined
  updatePreviousPage: (key: string, page: Partial<PreviousPageType>) => void
  removePreviousPage: (key: string) => void
}

export const usePreviousPageStore = create<PreviousPageStore>((set, get) => ({
  pages: {},

  savePreviousPage: (key, page) => {
    set((state) => ({ pages: { ...state.pages, [key]: page } }))
  },

  getPreviousPage: (key) => get().pages[key],

  updatePreviousPage: (key, update) => {
    set((state) => {
      const existing = state.pages[key]

      if (!existing) {
        return state
      }

      return {
        pages: { ...state.pages, [key]: { ...existing, ...update } }
      }
    })
  },

  removePreviousPage: (key) => {
    set((state) => {
      const newPages = { ...state.pages }

      delete newPages[key]

      return { pages: newPages }
    })
  }
}))
