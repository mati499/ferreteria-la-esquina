'use client'

import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Plus, Minus, AlertCircle } from 'lucide-react'
import { addToCart } from '@/store/cart'
import { useState, useEffect } from 'react'

export default function ProductDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single()

      if (error) {
        setError('Producto no encontrado')
        return
      }
      setProduct(data)
    }
    loadProduct()
  }, [id])

  function handleAddToCart() {
    if (!product) return
    if (product.stock < quantity) {
      setError('No hay suficiente stock disponible')
      return
    }
    setError(null)
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.image_url,
    })
    window.dispatchEvent(new CustomEvent('cart-updated'))
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-destructive" />
        <h2 className="text-xl font-semibold">{error}</h2>
        <a
          href="/catalogo"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Volver al catálogo
        </a>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Cargando producto...</p>
      </div>
    )
  }

  const isOutOfStock = product.stock === 0

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="flex flex-col items-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full max-w-md rounded-xl border object-cover"
              />
            ) : (
              <div className="w-full max-w-md h-64 rounded-xl border border-dashed flex items-center justify-center text-muted-foreground text-sm">
                Sin imagen
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">
                {product.categories?.name || 'General'}
              </span>
              <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
              <p className="text-muted-foreground mt-2">
                {product.description || 'Sin descripción disponible'}
              </p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.stock > 0 ? (
                  <span className="text-sm text-muted-foreground">
                    Stock: {product.stock} unidades
                  </span>
                ) : (
                  <span className="text-sm text-destructive font-medium">
                    Sin stock disponible
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 border rounded-lg hover:bg-secondary disabled:opacity-50"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 text-center font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3 py-2 border rounded-lg hover:bg-secondary disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                <ShoppingCart size={18} />
                {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
