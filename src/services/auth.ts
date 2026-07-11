import { supabase } from '@/services/supabase'
import type { AppUser } from '@/types/types'

export interface RegisterInput {
  fullName: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

interface SupabaseUserLike {
  id: string
  email?: string | null
  user_metadata?: Record<string, unknown>
}

function toAppUser(user: SupabaseUserLike): AppUser {
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: (user.user_metadata?.full_name as string | undefined) ?? '',
  }
}

export function toAppUserOrNull(user: SupabaseUserLike | null | undefined): AppUser | null {
  return user ? toAppUser(user) : null
}

export interface RegisterResult {
  user: AppUser | null
  needsEmailConfirmation: boolean
}

export async function registerUser({ fullName, email, password }: RegisterInput): Promise<RegisterResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

  if (error) throw new Error(error.message || 'Could not create your account. Please try again.')
  if (!data.user) throw new Error('Registration failed. Please try again.')

  // When email confirmation is enabled, signUp creates the user but returns no
  // session — the account isn't usable until the email is verified. Surface
  // that instead of treating them as signed in, which would drop them into the
  // app where every authenticated call fails with "You must be signed in."
  if (!data.session) {
    return { user: null, needsEmailConfirmation: true }
  }

  return { user: toAppUser(data.user), needsEmailConfirmation: false }
}

export async function loginUser({ email, password }: LoginInput): Promise<AppUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.code === 'email_not_confirmed') {
      throw new Error(`Please verify your email — check the inbox for ${email} for your confirmation link.`)
    }
    throw new Error('Invalid email or password.')
  }
  if (!data.user) throw new Error('Login failed. Please try again.')

  return toAppUser(data.user)
}

export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error('Could not sign out. Please try again.')
}
