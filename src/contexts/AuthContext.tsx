import { createContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/services/supabase'
import { loginUser, logoutUser, registerUser, toAppUserOrNull } from '@/services/auth'
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
    // onAuthStateChange fires an INITIAL_SESSION event synchronously on
    // subscribe (covering the initial load) and then again on every
    // subsequent event (SIGNED_IN, TOKEN_REFRESHED, SIGNED_OUT, etc). Using
    // the session it hands us directly — rather than re-validating over the
    // network with a separate getUser()/getSession() call — avoids a
    // transient network error clearing `user` and bouncing a signed-in
    // person to /login. This is also the only place `user`/`isLoading` are
    // set from auth state, so there's a single source of truth instead of
    // two independent, racy writes.
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAppUserOrNull(session?.user))
      setIsLoading(false)
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
