'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'
import { browserSupabase } from '@/lib/supabase/browser'
import { LogOut, Menu, X, Store, CreditCard, Package, BarChart3, Settings, AlertTriangle, Layers } from 'lucide-react'
const ADMIN_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Store },
  { href: '/admin/products', label: 'Productos', icon: CreditCard },
  { href: '/admin/categorias', label: 'Categorías', icon: Layers },
  { href: '/admin/orders', label: 'Pedidos', icon: Package },
  { href: '/admin/stock', label: 'Stock', icon: AlertTriangle },
  { href: '/admin/config', label: 'Configuración', icon: Settings },
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    browserSupabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    const { data: authListener } = browserSupabase.auth.onAuthStateChange((event: any, session: any) => {
      setUser(session?.user ?? null)
    })
    return () => {
      authListener?.subscription?.unsubscribe?.()
    }
  }, [])

  const handleLogout = async () => {
    await browserSupabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 flex-col border-r">
        <div className="p-6 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            FE
          </div>
          <span className="font-bold text-lg">Admin</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon as any
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition hover:bg-secondary hover:text-primary"
              >
                <Icon size={18} />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen((o) => !o)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
                aria-label="Menú"
              >
                <Menu size={24} />
              </button>
              <span className="font-semibold">Panel de Administración</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:text-sm text-muted-foreground">
                {user?.email || 'Usuario'}
              </span>
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                {user?.email?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-end" onClick={() => setIsOpen(false)}>
          <div className="w-64 bg-background border-l shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-semibold">Menú</span>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {ADMIN_LINKS.map((link) => {
                const Icon = link.icon as any
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition"
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="mt-4 w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition"
              >
                <LogOut size={18} /> Cerrar sesión
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
