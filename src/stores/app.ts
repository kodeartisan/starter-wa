import type { License } from '@/types'
import { create } from 'zustand'

interface AppState {
  isReady: boolean
  setIsReady: (isReady: boolean) => void
  profile: any
  setProfile: (profile: any) => void
  license?: License | null
  setLicense: (license: any) => void
  groups: any[]
  setGroups: (groups: []) => void
  isLoading: boolean
  setIsLoading: (state: boolean) => void
  activeChat: any
  setActiveChat: (chat: any) => void
}

export const useAppStore = create<AppState>((set) => ({
  isReady: false,
  setIsReady: (isReady: boolean) => set({ isReady }),
  license: null,
  setLicense: (license: any) => set({ license: license }),
  groups: [],
  setGroups: (groups: []) => set({ groups }),
  profile: {},
  setProfile: (profile: any) => set({ profile }),
  isLoading: false,
  setIsLoading: (state: any) => set({ isLoading: state }),
  activeChat: {},
  setActiveChat: (chat: any) => set({ activeChat: chat }),
}))
