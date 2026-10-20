'use client'

import { supabase } from '@/lib/supabase'

import { useEffect, useState } from 'react'
import { AlertTriangle, Package, Truck } from 'lucide-react'

export default function StockPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLowStock()
  }, [])

  async function loadLowStock() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .lte('stock', 10)
      .eq('is_active', true)
      .order('stock', { ascending: true })
    if (!error) setProducts(data || [])
    setLoading(false)
  }

  async function updateStock(id: string, newStock: number) {
    await supabase.from('products').update({ stock: newStock }).eq('id', id)
    loadLowStock()
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
          Productos con bajo stock (≤ 10 unidades) que requieren atención.
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
                          : p.stock <= 5
                            ? 'bg-warning/10 text-warning'
                            : 'bg-success/10 text-success'
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <input
                      type="number"
                      min={0}
                      defaultValue={p.stock}
                      className="w-20 h-8 rounded-md border border-input bg-background px-2 py-1 text-sm text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onBlur={(e) => {
                        const val = Number(e.target.value)
                        if (!isNaN(val)) updateStock(p.id, val)
                      }}
                    />
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
