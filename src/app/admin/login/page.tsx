'use client'

import { useEffect, useState } from 'react'
import { browserSupabase } from '@/lib/supabase/browser'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Mail, Lock, AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña demasiado corta'),
})

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('error') === 'rol') {
      setError('Este usuario no tiene rol de administrador.')
    }
  }, [])

  async function handleSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await browserSupabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (authError) {
        const message = /invalid login credentials/i.test(authError.message)
          ? 'Correo o contraseña incorrectos.'
          : authError.message || 'Error al iniciar sesión'
        setError(message)
        return
      }

      const role = String(
        data.user?.app_metadata?.role ?? data.user?.user_metadata?.role ?? '',
      ).toLowerCase()

      if (role !== 'admin') {
        setError('Este usuario no tiene rol de administrador.')
        return
      }

      window.location.href = '/admin/dashboard'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-4">
            FE
          </div>
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="text-muted-foreground">Panel de administración</p>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive text-destructive text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail size={16} /> Correo electrónico
              </label>
              <input
                {...form.register('email')}
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="admin@ferreteria.com"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock size={16} /> Contraseña
              </label>
              <input
                {...form.register('password')}
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          ¿No tienes acceso? Contacta al administrador del negocio.
        </p>
      </div>
    </div>
  )
}
