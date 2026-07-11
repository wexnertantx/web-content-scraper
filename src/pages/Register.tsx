import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Alert } from '@/components/ui/Alert'

interface RegisterFormValues {
  fullName: string
  email: string
  password: string
}

export function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>()

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null)
    setNotice(null)
    try {
      const { needsEmailConfirmation } = await registerUser(values)
      if (needsEmailConfirmation) {
        setNotice(
          `Account created. Please verify your email — check the inbox for ${values.email} — then log in.`,
        )
        return
      }
      navigate('/dashboard')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <AuthLayout>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Create an account</h1>
          <p className="text-sm text-muted-foreground">Start scraping and organizing web content in minutes.</p>
        </div>

        {submitError && <Alert variant="error">{submitError}</Alert>}
        {notice && <Alert variant="success">{notice}</Alert>}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            {...register('fullName', { required: 'Full name is required.' })}
          />
          {errors.fullName && <p className="text-sm text-error">{errors.fullName.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', {
              required: 'Email is required.',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' },
            })}
          />
          {errors.email && <p className="text-sm text-error">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password', {
              required: 'Password is required.',
              minLength: { value: 6, message: 'Password must be at least 6 characters.' },
            })}
          />
          {errors.password && <p className="text-sm text-error">{errors.password.message}</p>}
        </div>

        <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full">
          Create Account
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary transition-colors duration-150 hover:text-primary/80 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
