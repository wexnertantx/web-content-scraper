import { createContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/services/supabase'
import { getCurrentUser, loginUser, logoutUser, registerUser } from '@/services/auth'
import type { AppUser } from '@/types/types'
import type { LoginInput, RegisterInput } from '@/services/auth'

export interface AuthContextValue {
  user: AppUser | null
  isLoading: boolean
  register: (input: RegisterInput) => Promise<void>
  login: (input: LoginInput) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false))

    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      getCurrentUser().then(setUser)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  async function register(input: RegisterInput) {
    const registeredUser = await registerUser(input)
    setUser(registeredUser)
  }

  async function login(input: LoginInput) {
    const loggedInUser = await loginUser(input)
    setUser(loggedInUser)
  }

  async function logout() {
    await logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
