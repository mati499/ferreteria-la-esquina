'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { formatPrice } from '@/lib/utils'
import { useCart, useCartTotal } from '@/store/cart'
import { Mail, Phone, MapPin, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'El nombre es requerido'),
  customerPhone: z.string().min(8, 'Teléfono inválido'),
  customerAddress: z.string().min(5, 'Dirección requerida'),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'OTHER']),
  notes: z.string().optional(),
})

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const total = useCartTotal()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      paymentMethod: 'CASH',
      notes: '',
    },
  })

  if (items.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
          <Link
            href="/catalogo"
            className="mt-6 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Ir al catálogo
          </Link>
        </div>
      </section>
    )
  }

  if (submitted) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <CheckCircle size={48} className="mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold">¡Pedido enviado!</h2>
          <p className="text-muted-foreground mt-2">
            Gracias por tu compra. Nos pondremos en contacto para confirmar tu pedido.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogo"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Seguir comprando
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-input rounded-lg font-medium hover:bg-secondary transition"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    )
  }

  async function handleSubmit(values: z.infer<typeof checkoutSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Crear la orden
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: `FE-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          customer_name: values.customerName,
          customer_phone: values.customerPhone,
          customer_address: values.customerAddress,
          total: total,
          status: 'PENDING',
          payment_method: values.paymentMethod,
          notes: values.notes || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Crear los items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 3. Limpiar carrito
      clearCart()
      window.dispatchEvent(new CustomEvent('cart-updated'))

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido. Intenta nuevamente.')
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Finalizar compra</h1>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail size={16} /> Nombre completo
                  </label>
                  <input
                    {...form.register('customerName')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Juan Pérez"
                  />
                  {form.formState.errors.customerName && (
                    <p className="text-xs text-destructive">{form.formState.errors.customerName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone size={16} /> Teléfono
                  </label>
                  <input
                    {...form.register('customerPhone')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="300 000 0000"
                  />
                  {form.formState.errors.customerPhone && (
                    <p className="text-xs text-destructive">{form.formState.errors.customerPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin size={16} /> Dirección de entrega
                </label>
                <input
                  {...form.register('customerAddress')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Cra 10 # 20-30, Bogotá"
                />
                {form.formState.errors.customerAddress && (
                  <p className="text-xs text-destructive">{form.formState.errors.customerAddress.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CreditCard size={16} /> Método de pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CASH', 'TRANSFER', 'OTHER'] as const).map((method) => {
                    const labels: Record<string, string> = {
                      CASH: 'Efectivo',
                      TRANSFER: 'Transferencia',
                      OTHER: 'Otro',
                    }
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() =>
                          form.setValue('paymentMethod', method as any)
                        }
                        className={`flex items-center justify-between px-3 py-2 rounded-md border text-sm font-medium transition ${
                          form.getValues('paymentMethod') === method
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input hover:bg-secondary'
                        }`}
                      >
                        <span>{labels[method]}</span>
                      </button>
                    )
                  })}
                </div>
                {form.formState.errors.paymentMethod && (
                  <p className="text-xs text-destructive">{form.formState.errors.paymentMethod.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail size={16} /> Notas adicionales (opcional)
                </label>
                <textarea
                  {...form.register('notes')}
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ej: Dejar en la portería..."
                />
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
                  {error}
                </div>
              )}

              <button
                disabled={isSubmitting || items.length === 0}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 2 5.373 2 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  'Confirmar pedido'
                )}
              </button>
            </form>
          </div>

          {/* Resumen */}
          <div className="space-y-6">
            <div className="p-6 border rounded-lg bg-card">
              <h3 className="font-semibold mb-4">Resumen del pedido</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm border-b pb-2">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-secondary">
              <h4 className="font-semibold mb-2">Información importante</h4>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>El stock se confirma al procesar el pedido.</li>
                <li>Te contactaremos por WhatsApp para coordinar la entrega.</li>
                <li>Puedes pagar contra entrega o por transferencia.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
