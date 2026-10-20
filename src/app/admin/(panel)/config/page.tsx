'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { updateBusinessConfig } from '@/app/admin/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { MapPin, Phone, Clock } from 'lucide-react'

const configSchema = z.object({
  businessName: z.string().min(2, 'Nombre requerido'),
  address: z.string().optional(),
  phone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  schedule: z.string().optional(),
})

export default function ConfigPage() {
  const [config, setConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<z.infer<typeof configSchema>>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      businessName: '',
      address: '',
      phone: '',
      whatsappNumber: '',
      schedule: '',
    },
  })

  async function loadConfig() {
    const { data } = await supabase
      .from('business_config')
      .select('*')
      .limit(1)
      .single()
    if (data) {
      setConfig(data)
      form.reset({
        businessName: data.business_name,
        address: data.address || '',
        phone: data.phone || '',
        whatsappNumber: data.whatsapp_number || '',
        schedule: data.schedule || '',
      })
    }
    setIsLoading(false)
  }

  // Minimal useEffect for client-side data loading
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const React = require('react')
  React.useEffect(() => {
    loadConfig()
  }, [])

  async function handleSubmit(values: z.infer<typeof configSchema>) {
    setIsLoading(true)
    try {
      if (!config) {
        throw new Error('No hay configuración existente para actualizar.')
      }

      const { error } = await updateBusinessConfig({
        id: config.id,
        business_name: values.businessName,
        address: values.address || null,
        phone: values.phone || null,
        whatsapp_number: values.whatsappNumber || null,
        schedule: values.schedule || null,
      })

      if (error) throw new Error(error)
      window.alert('Configuración guardada correctamente')
    } catch (err: any) {
      window.alert('Error al guardar: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-8 container mx-auto px-4">
        <p className="text-muted-foreground">Cargando configuración...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Configuración del negocio</h1>
        <p className="text-muted-foreground">
          Administra la información de Ferretería La Esquina.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                    <span>A</span>
                  </span>
                  Nombre del negocio
                </label>
                <input
                  {...form.register('businessName')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ferretería La Esquina"
                />
                {form.formState.errors.businessName && (
                  <p className="text-xs text-destructive">{form.formState.errors.businessName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} /> Dirección
              </label>
              <input
                {...form.register('address')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Cra 10 # 20-30, Bogotá"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone size={16} /> Teléfono
              </label>
              <input
                {...form.register('phone')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="300 000 0000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone size={16} /> Número de WhatsApp
              </label>
              <input
                {...form.register('whatsappNumber')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="573000000000"
              />
              <p className="text-xs text-muted-foreground">
                Se usa para generar enlaces wa.me
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock size={16} /> Horario de atención
              </label>
              <input
                {...form.register('schedule')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Lunes a Viernes 8:00 AM - 6:00 PM"
              />
            </div>
          </div>
        </div>

        <button
          disabled={isLoading}
          className="w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition"
        >
          {isLoading ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </form>
    </div>
  )
}
