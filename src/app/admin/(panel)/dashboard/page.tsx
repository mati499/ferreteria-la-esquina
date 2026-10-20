import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, CreditCard, AlertTriangle, DollarSign, Users } from 'lucide-react'

export default async function DashboardPage() {
  const [ordersRes, productsRes, lowStockRes] = await Promise.all([
    supabase
      .from('orders')
      .select('id, order_number, customer_name, status, total')
      .eq('status', 'PENDING'),
    supabase.from('products').select('id').eq('is_active', true),
    supabase.from('products').select('id').lte('stock', 5).eq('is_active', true),
  ])

  const pendingOrders = ordersRes.data || []
  const activeProducts = productsRes.data || []
  const lowStockProducts = lowStockRes.data || []

  const totalSales = pendingOrders.reduce(
    (sum: number, o: any) => sum + Number(o.total || 0),
    0,
  )

  const stats = [
    {
      title: 'Pedidos pendientes',
      value: pendingOrders.length,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Productos activos',
      value: activeProducts.length,
      icon: CreditCard,
      color: 'text-secondary',
      bg: 'bg-secondary/50',
    },
    {
      title: 'Stock bajo',
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: lowStockProducts.length > 0 ? 'text-destructive' : 'text-success',
      bg: lowStockProducts.length > 0 ? 'bg-destructive/10' : 'bg-success/10',
    },
    {
      title: 'Ventas pendientes',
      value: `$${totalSales.toFixed(0)}`,
      icon: DollarSign,
      color: 'text-success',
      bg: 'bg-success/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen del panel de administración</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={cn(stat.bg, stat.color, 'rounded-lg p-3')}>
                <stat.icon size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary hover:bg-secondary/80 cursor-pointer transition">
              <CreditCard size={18} />
              <span>Gestionar productos</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary hover:bg-secondary/80 cursor-pointer transition">
              <Package size={18} />
              <span>Ver pedidos</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary hover:bg-secondary/80 cursor-pointer transition">
              <AlertTriangle size={18} />
              <span>Revisar stock bajo</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-2">Número</th>
                    <th className="pb-2">Cliente</th>
                    <th className="pb-2">Estado</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.slice(0, 5).map((order: any, index: number) => (
                    <tr key={order.id || `order-${index}`} className="border-b">
                      <td className="py-3 font-medium">{order.order_number}</td>
                      <td className="py-3">{order.customer_name}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium">
                        ${Number(order.total || 0).toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
