'use client'

import Link from 'next/link'

import { useState } from 'react'
import { useCart, useCartTotal } from '@/store/cart'
import { Trash2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const total = useCartTotal()
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mt-2">
            Agrega productos desde el catálogo para comenzar tu compra.
          </p>
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

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Tu carrito</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 p-4 border rounded-lg bg-card"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xs">
                    Sin imagen
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-1.5 border rounded hover:bg-secondary disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="w-8 text-center font-mono text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1.5 border rounded hover:bg-secondary"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Eliminar producto"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 border rounded-lg bg-card">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Envío</span>
                  <span>Por determinar</span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {checkoutError && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
                {checkoutError}
              </div>
            )}

            <button
              onClick={async () => {
                try {
                  // Redirige al checkout
                  window.location.href = '/checkout'
                } catch {
                  setCheckoutError('Error al iniciar el checkout')
                }
              }}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition"
            >
              Proceder al pago
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
