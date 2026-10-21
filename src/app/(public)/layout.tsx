'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { BusinessConfig } from '@/types'
import { cn } from '@/lib/utils'
import { ShoppingCart, Menu, X, Phone, MapPin, Clock } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/info-negocio', label: 'Negocio' },
]

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [config, setConfig] = useState<BusinessConfig | null>(null)

  useEffect(() => {
    // Contador del carrito desde localStorage
    const updateCart = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('cart')
        if (stored) {
          try {
            const items = JSON.parse(stored)
            setCartCount(items.reduce((sum: number, i: any) => sum + i.quantity, 0))
          } catch {
            setCartCount(0)
          }
        } else {
          setCartCount(0)
        }
      }
    }
    updateCart()
    window.addEventListener('cart-updated', updateCart)
    return () => window.removeEventListener('cart-updated', updateCart)
  }, [])

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from('business_config')
        .select('*')
        .limit(1)
        .single()
      if (data) setConfig(data)
    }
    fetchConfig()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              FE
            </div>
            <span className="font-bold text-lg tracking-tight">{config?.business_name || 'Ferretería La Esquina'}</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-primary"
              aria-label="Abrir menú"
            >
              <Menu />
            </button>
            <Link
              href="/carrito"
              className="relative p-2 text-primary hover:bg-accent rounded-full transition"
              aria-label={`Carrito (${cartCount})`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-b bg-background px-4 pb-4">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-lg font-medium hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/carrito"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-lg font-medium hover:text-primary flex items-center gap-2"
              >
                <ShoppingCart size={20} /> Carrito ({cartCount})
              </Link>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 w-full"
            >
              Cerrar menú
            </button>
          </div>
        )}
      </nav>

      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-sm text-muted-foreground">
            <div>
              <h4 className="mb-4 font-semibold">Información</h4>
              <p className="mb-2 flex items-center gap-2">
                <MapPin size={14} /> {config?.address || 'Dirección no disponible'}
              </p>
              <p className="mb-2 flex items-center gap-2">
                <Phone size={14} /> {config?.phone || 'Teléfono no disponible'}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={14} /> {config?.schedule || 'Horario no disponible'}
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Enlaces</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/catalogo" className="hover:text-primary">
                    Catálogo de productos
                  </Link>
                </li>
                <li>
                  <Link href="/pedido-personalizado" className="hover:text-primary">
                    Pedido personalizado
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Contacto por WhatsApp</h4>
              {config?.whatsapp_number ? (
                <a
                  href={`https://wa.me/${config.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone size={16} /> Escríbenos por WhatsApp
                </a>
              ) : (
                <p className="text-muted-foreground">WhatsApp no configurado</p>
              )}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-xs text-muted-foreground">
            {config?.business_name || 'Ferretería La Esquina'}. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
