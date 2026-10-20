'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/products/product-card'
import { Loader2 } from 'lucide-react'

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  async function loadData() {
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
    ])
    setCategories(catRes.data || [])
    setProducts(prodRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredProducts =
    selectedCategory === null || selectedCategory === 'todos'
      ? products
      : products.filter((p) => p.category_id === selectedCategory)

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Catálogo de productos</h1>
            <p className="text-muted-foreground">
              Explora nuestros productos disponibles
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 size={24} className="mb-4 animate-spin" />
              Cargando productos...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron productos en esta categoría.
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
