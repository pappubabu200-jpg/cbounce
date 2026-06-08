import { create } from 'zustand'

interface AuthState {
  user: { id: string; email: string; orgId: string } | null
  credits: number
  plan: string
  setUser: (user: AuthState['user']) => void
  setCredits: (n: number) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  credits: 0,
  plan: 'free',
  setUser: (user) => set({ user }),
  setCredits: (credits) => set({ credits }),
  logout: () => set({ user: null, credits: 0, plan: 'free' }),
}))
