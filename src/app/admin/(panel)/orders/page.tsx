'use client'

import { supabase } from '@/lib/supabase'
import { updateOrderStatus } from '@/app/admin/actions'

import { useEffect, useState } from 'react'
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-warning/10 text-warning' },
  CONFIRMED: { label: 'Confirmado', color: 'bg-primary/10 text-primary' },
  PREPARING: { label: 'Preparando', color: 'bg-blue/10 text-blue' },
  READY: { label: 'Listo', color: 'bg-green/10 text-green' },
  DELIVERED: { label: 'Entregado', color: 'bg-success/10 text-success' },
  CANCELLED: { label: 'Cancelado', color: 'bg-destructive/10 text-destructive' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name))')
      .order('created_at', { ascending: false })
    if (!error) setOrders(data || [])
    setLoading(false)
  }

  async function updateStatus(orderId: string, newStatus: string) {
    const { error } = await updateOrderStatus(orderId, newStatus)
    if (error) {
      alert(error)
      return
    }
    loadOrders()
    if (newStatus === 'DELIVERED') {
      setStatusFilter('DELIVERED')
    }
  }

  const filtered =
    statusFilter === 'todos'
      ? orders
      : orders.filter((o) => o.status === statusFilter)

  if (loading) {
    return (
      <div className="py-8 container mx-auto px-4">
        <p className="text-muted-foreground">Cargando pedidos...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">Gestiona los pedidos de los clientes</p>
        </div>
        <div className="flex gap-2">
          {[
            { value: 'todos', label: 'Todos' },
            { value: 'PENDING', label: 'Pendientes' },
            { value: 'CONFIRMED', label: 'Confirmados' },
            { value: 'DELIVERED', label: 'Entregados' },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                statusFilter === s.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b">
              <th className="pb-3 font-medium">Número</th>
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Estado</th>
              <th className="pb-3 font-medium text-right">Total</th>
              <th className="pb-3 font-medium">Fecha</th>
              <th className="pb-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const status = STATUS_CONFIG[o.status] || {
                label: o.status,
                color: 'bg-muted text-muted-foreground',
              }
              return (
                <tr key={o.id} className="border-b hover:bg-secondary/50">
                  <td className="py-4 font-medium">{o.order_number}</td>
                  <td className="py-4">{o.customer_name}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-4 text-right font-medium">
                    ${Number(o.total || 0).toFixed(0)}
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString('es-CO')}
                  </td>
                  <td className="py-4 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none"
                    >
                      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <option key={key} value={key}>
                          {cfg.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No hay pedidos en este estado.
        </div>
      )}
    </div>
  )
}
