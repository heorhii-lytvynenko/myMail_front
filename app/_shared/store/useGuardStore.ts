import { create } from 'zustand'

type GuardType =
  | 'guest'
  | 'private'
  | 'onboarding-completed'
  | 'onboarding-route'

interface GuardStore {
  guardsToSkip: GuardType[]
  setQuardsToSkip: (guardsToSkip: GuardType[]) => void
}

export const useGuardStore = create<GuardStore>((set) => ({
  guardsToSkip: [],
  setQuardsToSkip: (guardsToSkip) => set({ guardsToSkip })
}))
