'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { addToCart } from '@/store/cart'
import { ShoppingCart, Plus } from 'lucide-react'

interface ProductCardProps {
  product: any
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image_url,
    })
    setAdded(true)
    window.dispatchEvent(new CustomEvent('cart-updated'))
    setTimeout(() => setAdded(false), 1500)
  }

  const isOutOfStock = product.stock === 0

  return (
    <div className="flex flex-col rounded-lg border overflow-hidden bg-card hover:border-primary/30 transition group">
      {product.image_url ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium">Sin stock</span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 bg-secondary flex items-center justify-center text-muted-foreground text-sm">
          Sin imagen
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs text-muted-foreground truncate">
            {product.categories?.name || 'General'}
          </span>
          {isOutOfStock && (
            <span className="text-xs text-destructive font-medium">Sin stock</span>
          )}
        </div>
        <Link
          href={`/producto/${product.id}`}
          className="text-lg font-semibold line-clamp-1 hover:text-primary transition"
        >
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.description || ''}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold">{formatPrice(product.price)}</span>
          {product.stock > 0 && (
            <span className="text-sm text-muted-foreground">
              Stock: {product.stock}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full mt-3 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : added
                ? 'bg-green-600 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {added ? (
            'Agregado'
          ) : isOutOfStock ? (
            'Sin stock'
          ) : (
            <>
              <Plus size={16} /> Agregar
            </>
          )}
        </button>
      </div>
    </div>
  )
}
