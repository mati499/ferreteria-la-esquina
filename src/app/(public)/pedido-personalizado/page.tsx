'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { AlertCircle, CheckCircle, FileText, Phone } from 'lucide-react'

const customOrderSchema = z.object({
  description: z
    .string()
    .min(10, 'Describe qué necesitas (mínimo 10 caracteres)'),
  estimatedQuantity: z
    .string()
    .refine((val) => !val || !isNaN(Number(val)), 'Cantidad inválida')
    .optional(),
  customerName: z.string().min(2, 'El nombre es requerido'),
  customerPhone: z.string().min(8, 'Teléfono inválido'),
  notes: z.string().optional(),
})

export default function CustomOrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof customOrderSchema>>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      description: '',
      estimatedQuantity: '',
      customerName: '',
      customerPhone: '',
      notes: '',
    },
  })

  if (submitted) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <CheckCircle size={48} className="mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold">¡Solicitud recibida!</h2>
          <p className="text-muted-foreground mt-2">
            Hemos recibido tu pedido personalizado. Te contactaremos pronto por WhatsApp.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogo"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Volver al catálogo
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-input rounded-lg font-medium hover:bg-secondary transition"
            >
              Inicio
            </Link>
          </div>
        </div>
      </section>
    )
  }

  async function handleSubmit(values: z.infer<typeof customOrderSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('custom_orders')
        .insert({
          description: values.description,
          estimated_quantity: values.estimatedQuantity
            ? Number(values.estimatedQuantity)
            : null,
          customer_name: values.customerName,
          customer_phone: values.customerPhone,
          notes: values.notes || null,
          status: 'NEW',
        })

      if (insertError) throw insertError

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Error al enviar la solicitud. Intenta nuevamente.')
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-lg">
          <h1 className="text-2xl font-bold mb-6">Pedido personalizado</h1>
          <p className="text-muted-foreground mb-6">
            ¿No encuentras lo que buscas? Cuéntanos qué necesitas y te haremos una cotización.
          </p>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText size={16} /> Descripción del producto
              </label>
              <textarea
                {...form.register('description')}
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ej: Necesito una llave inglesa de 12 pulgadas, marca X, para trabajo de fontanería"
              />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Cantidad estimada (opcional)
              </label>
              <input
                {...form.register('estimatedQuantity')}
                type="number"
                min={1}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ej: 5"
              />
              {form.formState.errors.estimatedQuantity && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.estimatedQuantity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone size={16} /> Teléfono de contacto
              </label>
              <input
                {...form.register('customerPhone')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="300 000 0000"
              />
              {form.formState.errors.customerPhone && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.customerPhone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tu nombre
              </label>
              <input
                {...form.register('customerName')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Juan Pérez"
              />
              {form.formState.errors.customerName && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.customerName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Notas adicionales (opcional)
              </label>
              <textarea
                {...form.register('notes')}
                rows={3}
                className="flex min-h-[64px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ej: Necesito entrega el viernes..."
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
                {error}
              </div>
            )}

            <button
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar cotización'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
