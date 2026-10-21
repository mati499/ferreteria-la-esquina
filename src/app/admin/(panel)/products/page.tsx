'use client'

import { supabase } from '@/lib/supabase'
import { supabase as supabaseAdmin } from '@/lib/supabase'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit3, Search } from 'lucide-react'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    if (!error) setProducts(data || [])
    setLoading(false)
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categories?.name?.toLowerCase().includes(search.toLowerCase()),
  )

  async function toggleActive(id: string, current: boolean) {
    await supabase
      .from('products')
      .update({ is_active: !current })
      .eq('id', id)
    loadProducts()
  }

  async function deleteProduct(id: string) {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return
    await supabase.from('products').delete().eq('id', id)
    loadProducts()
  }

  if (loading) {
    return (
      <div className="py-8 container mx-auto px-4">
        <p className="text-muted-foreground">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-muted-foreground">Gestiona el catálogo de productos</p>
        </div>
        <Link
          href="/admin/products/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
        >
          <Plus size={16} /> Nuevo producto
        </Link>
      </div>

      <div className="mb-6 relative">
        <Search size={18} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b">
              <th className="pb-3 font-medium">Producto</th>
              <th className="pb-3 font-medium">Categoría</th>
              <th className="pb-3 font-medium text-right">Precio</th>
              <th className="pb-3 font-medium text-center">Stock</th>
              <th className="pb-3 font-medium text-center">Umbral bajo</th>
              <th className="pb-3 font-medium text-center">Estado</th>
              <th className="pb-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b hover:bg-secondary/50">
                <td className="py-4">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.description || ''}</div>
                </td>
                <td className="py-4">{p.categories?.name || 'Sin categoría'}</td>
                <td className="py-4 text-right font-medium">${Number(p.price || 0).toFixed(0)}</td>
                <td className="py-4 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.stock === 0
                        ? 'bg-destructive/10 text-destructive'
                        : p.low_stock_threshold && p.stock <= p.low_stock_threshold
                          ? 'bg-warning/10 text-warning'
                          : 'bg-success/10 text-success'
                    }`}
                    title={
                      p.low_stock_threshold && p.stock <= p.low_stock_threshold
                        ? `Stock bajo (umbral: ${p.low_stock_threshold})`
                        : ''
                    }
                  >
                    {p.stock}
                    {p.low_stock_threshold && p.stock <= p.low_stock_threshold && p.stock > 0 ? ' ⚠️' : ''}
                  </span>
                </td>
                <td className="py-4 text-center">
                  <span className="text-xs text-muted-foreground">
                    {p.low_stock_threshold ?? 5}
                  </span>
                </td>
                <td className="py-4 text-center">
                  <button
                    onClick={() => toggleActive(p.id, p.is_active)}
                    className="p-1.5 rounded hover:bg-secondary transition"
                    title={p.is_active ? 'Desactivar' : 'Activar'}
                  >
                    {p.is_active ? '✓' : '○'}
                  </button>
                </td>
                <td className="py-4 text-right">
                    <Link
                    href={`/admin/products/${p.id}/editar`}
                    className="text-primary hover:underline text-sm mr-2"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-destructive hover:underline text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No se encontraron productos.
        </div>
      )}
    </div>
  )
}
