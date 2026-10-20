import { supabase } from '@/lib/supabase'
import { Phone, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Información del Negocio | Ferretería La Esquina',
}

export default async function BusinessInfoPage() {
  const { data: config } = await supabase
    .from('business_config')
    .select('*')
    .limit(1)
    .single()

  if (!config) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Cargando información...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">{config.business_name}</h1>
          <p className="text-muted-foreground mt-2">
            Tu ferretería de confianza para el hogar, la obra y el taller.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl border bg-card text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <MapPin size={20} />
            </div>
            <h3 className="font-semibold">Dirección</h3>
            <p className="text-sm text-muted-foreground">
              {config.address || 'No disponible'}
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-card text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <Phone size={20} />
            </div>
            <h3 className="font-semibold">Teléfono</h3>
            <p className="text-sm text-muted-foreground">
              {config.phone || 'No disponible'}
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-card text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <Clock size={20} />
            </div>
            <h3 className="font-semibold">Horario</h3>
            <p className="text-sm text-muted-foreground">
              {config.schedule || 'No disponible'}
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-secondary p-8 rounded-xl border">
          <h2 className="text-xl font-bold mb-4">Contacto por WhatsApp</h2>
          <p className="text-muted-foreground mb-4">
            ¿Tienes alguna pregunta sobre nuestros productos o precios?
            Escríbenos directamente por WhatsApp.
          </p>
          {config.whatsappNumber ? (
            <a
              href={`https://wa.me/${config.whatsappNumber}?text=Hola%20Ferreter%C3%ADa%20La%20Esquina,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20productos`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
            >
              <Phone size={18} />
              Escríbenos por WhatsApp
            </a>
          ) : (
            <p className="text-muted-foreground">WhatsApp no configurado</p>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="px-6 py-3 border border-input rounded-lg font-medium hover:bg-secondary transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  )
}
