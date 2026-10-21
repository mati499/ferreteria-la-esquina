import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Truck, Store, Tag, Users, MapPin, Phone, Clock } from 'lucide-react'

const FEATURES = [
  {
    icon: Truck,
    title: 'Envíos rápidos',
    description: 'Llevamos tus productos hasta la puerta de tu casa o taller.',
  },
  {
    icon: Store,
    title: 'Amplio catálogo',
    description: 'Fontanería, eléctrica, pintura, herramientas y más.',
  },
  {
    icon: Tag,
    title: 'Precios justos',
    description: 'Calidad al mejor precio del sector ferretero.',
  },
  {
    icon: Users,
    title: 'Atención personalizada',
    description: 'Te asesoramos para encontrar lo que necesitas.',
  },
]

export default async function HomePage() {
  const { data: config } = await supabase
    .from('business_config')
    .select('*')
    .limit(1)
    .single()

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {config?.business_name || 'Ferretería La Esquina'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas para tu hogar, obra o taller en un solo lugar.
            Compra online y recíbelo donde quieras.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogo"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Ver catálogo
            </Link>
            <Link
              href="/info-negocio"
              className="px-6 py-3 border border-input rounded-lg font-medium hover:bg-secondary transition"
            >
              Info del negocio
            </Link>
          </div>
          {config?.whatsapp_number && (
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${config.whatsapp_number}?text=Hola%20Ferreter%C3%ADa%20La%20Esquina,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20productos`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-success text-success-foreground rounded-lg font-medium hover:bg-success/90 transition"
              >
                <Phone size={18} />
                Escríbenos por WhatsApp
              </a>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border bg-card hover:border-primary/30 transition"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <feature.icon size={20} />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary p-8 rounded-xl border">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">¿Necesitas algo específico?</h2>
            <p className="text-muted-foreground">
              Envíanos un pedido personalizado y nos pondremos en contacto.
            </p>
          </div>
          <Link
            href="/pedido-personalizado"
            className="inline-block px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition"
          >
            Solicitar cotización
          </Link>
        </div>
      </div>

      {config?.whatsapp_number && (
        <a
          href={`https://wa.me/${config.whatsapp_number}?text=Hola%20Ferreter%C3%ADa%20La%20Esquina,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20productos`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-success text-success-foreground rounded-full font-medium shadow-lg hover:bg-success/90 transition transform hover:scale-105"
        >
          <Phone size={20} />
          <span className="hidden sm:inline">Escríbenos por WhatsApp</span>
        </a>
      )}
    </section>
  )
}
