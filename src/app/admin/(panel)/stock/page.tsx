'use client'

import { supabase } from '@/lib/supabase'
import { updateProduct } from '@/app/admin/actions'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function StockPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    loadLowStock()
  }, [])

  async function loadLowStock() {
    // Traer todos los productos activos con su umbral individual
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (!error) {
      // Filtrar en cliente: stock <= low_stock_threshold (o 5 por defecto si no tiene umbral)
      const lowStock = (data || []).filter(
        (p: any) => p.stock <= (p.low_stock_threshold ?? 5),
      )
      // Ordenar por stock ascendente
      lowStock.sort((a: any, b: any) => a.stock - b.stock)
      setProducts(lowStock)
    }
    setLoading(false)
  }

  async function updateStock(id: string, currentStock: number, addStock: number) {
    const newStock = currentStock + addStock
    if (newStock === currentStock) return
    setSaving(id)
    try {
      // Traer el producto completo para pasar todos los campos requeridos por updateProduct
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      const { error } = await updateProduct({
        id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: newStock,
        image_url: product.image_url,
        category_id: product.category_id,
        is_active: product.is_active,
        low_stock_threshold: product.low_stock_threshold ?? 5,
      })

      if (error) throw error
      loadLowStock()
    } catch (err: any) {
      alert('Error al actualizar stock: ' + err.message)
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="py-8 container mx-auto px-4">
        <p className="text-muted-foreground">Cargando stock...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Control de stock</h1>
        <p className="text-muted-foreground">
          Productos con stock bajo o igual a su umbral configurado que requieren atención.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            ¡Excelente! No hay productos con bajo stock.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="pb-3 font-medium">Producto</th>
                <th className="pb-3 font-medium">Categoría</th>
                <th className="pb-3 font-medium text-center">Stock actual</th>
                <th className="pb-3 font-medium text-center">Umbral</th>
                <th className="pb-3 font-medium text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-secondary/50">
                  <td className="py-4 font-medium">{p.name}</td>
                  <td className="py-4">{p.categories?.name || 'Sin categoría'}</td>
                  <td className="py-4 text-center font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.stock === 0
                          ? 'bg-destructive/10 text-destructive'
                          : p.low_stock_threshold && p.stock <= p.low_stock_threshold
                            ? 'bg-warning/10 text-warning'
                            : 'bg-success/10 text-success'
                      }`}
                      title={
                        p.low_stock_threshold
                          ? `Umbral: ${p.low_stock_threshold}`
                          : 'Umbral por defecto: 5'
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-xs text-muted-foreground">
                      {p.low_stock_threshold ?? 5}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    {saving === p.id ? (
                      <span className="text-xs text-muted-foreground animate-pulse">
                        Guardando…
                      </span>
                    ) : (
                      <input
                        type="number"
                        min={0}
                        defaultValue={p.stock}
                        className="w-20 h-8 rounded-md border border-input bg-background px-2 py-1 text-sm text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onBlur={(e) => {
                          const val = Number(e.target.value)
                          if (!isNaN(val)) updateStock(p.id, p.stock, val)
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
