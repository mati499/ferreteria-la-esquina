'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export type ProductInput = {
  name: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  category_id: string | null
  is_active: boolean
  low_stock_threshold?: number
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Tenés que iniciar sesión.')
  }

  const role = String(user.app_metadata?.role ?? user.user_metadata?.role ?? '').toLowerCase()
  if (role !== 'admin') {
    throw new Error('Este usuario no tiene rol de administrador.')
  }
}

function asId(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    throw new Error('Producto inválido.')
  }
  return id
}

export async function createProduct(input: ProductInput) {
  try {
    await requireAdmin()

    const name = input.name?.trim()
    if (!name || name.length < 2) {
      return { error: 'Nombre requerido.' }
    }

    const price = Number(input.price)
    const stock = Number(input.stock)
    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(stock) || stock < 0) {
      return { error: 'Precio o stock inválido.' }
    }

    const supabase = createServiceClient()
    const { error } = await supabase.from('products').insert({
      name,
      description: input.description?.trim() || null,
      price,
      stock: Math.trunc(stock),
      image_url: input.image_url || null,
      category_id: input.category_id || null,
      is_active: Boolean(input.is_active),
      low_stock_threshold: input.low_stock_threshold ?? 5,
    })

    if (error) return { error: error.message }
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al crear producto.' }
  }
}

export type ProductUpdateInput = {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  category_id: string | null
  is_active: boolean
  low_stock_threshold?: number
}

export async function updateProduct(input: ProductUpdateInput) {
  try {
    await requireAdmin()

    if (!/^[0-9a-f-]{36}$/i.test(input.id)) {
      return { error: 'Producto inválido.' }
    }

    const name = input.name?.trim()
    if (!name || name.length < 2) {
      return { error: 'Nombre requerido.' }
    }

    const price = Number(input.price)
    const stock = Number(input.stock)
    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(stock) || stock < 0) {
      return { error: 'Precio o stock inválido.' }
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('products')
      .update({
        name,
        description: input.description?.trim() || null,
        price,
        stock: Math.trunc(stock),
        image_url: input.image_url || null,
        category_id: input.category_id || null,
        is_active: Boolean(input.is_active),
        low_stock_threshold: input.low_stock_threshold ?? 5,
      })
      .eq('id', input.id)

    if (error) return { error: error.message }
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al actualizar producto.' }
  }
}

export type BusinessConfigInput = {
  id: string
  business_name: string
  address: string | null
  phone: string | null
  whatsapp_number: string | null
  schedule: string | null
}

export async function updateBusinessConfig(input: BusinessConfigInput) {
  try {
    await requireAdmin()

    if (!/^[0-9a-f-]{36}$/i.test(input.id)) {
      return { error: 'Configuración inválida.' }
    }

    const name = input.business_name?.trim()
    if (!name || name.length < 2) {
      return { error: 'Nombre del negocio requerido.' }
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('business_config')
      .update({
        business_name: name,
        address: input.address || null,
        phone: input.phone || null,
        whatsapp_number: input.whatsapp_number || null,
        schedule: input.schedule || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.id)

    if (error) return { error: error.message }
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error al guardar configuración.' }
  }
}

export async function uploadProductImage(formData: FormData) {
  await requireAdmin()

  const file = formData.get('file') as File
  const productId = formData.get('productId') as string | null

  if (!file) {
    return { error: 'No se recibió el archivo.' }
  }

  const folder = productId || 'temp'
  const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')
  const fileName = `${folder}/${Date.now()}-${safeName}`

  const supabase = createServiceClient()
  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) return { error: error.message }

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)

  return { error: null, url: urlData.publicUrl }
}

export async function deleteProductImage(formData: FormData) {
  await requireAdmin()

  const path = formData.get('path') as string

  if (!path) {
    return { error: 'No se recibió la ruta de la imagen.' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase.storage.from('product-images').remove([path])

  if (error) return { error: error.message }
  return { error: null }
}

export type CategoryInput = {
  id?: string
  name: string
  slug: string
}

export async function createCategory(input: CategoryInput) {
  await requireAdmin()

  const name = input.name?.trim()
  if (!name || name.length < 2) {
    return { error: 'Nombre de categoría requerido.' }
  }

  const slug = input.slug?.trim() || name.toLowerCase().replace(/\s+/g, '-')

  const supabase = createServiceClient()
  const { error } = await supabase.from('categories').insert({
    name,
    slug,
  })

  if (error) return { error: error.message }
  return { error: null }
}

export async function updateCategory(input: CategoryInput) {
  await requireAdmin()

  if (!input.id || !/^[0-9a-f-]{36}$/i.test(input.id)) {
    return { error: 'Categoría inválida.' }
  }

  const name = input.name?.trim()
  if (!name || name.length < 2) {
    return { error: 'Nombre de categoría requerido.' }
  }

  const slug = input.slug?.trim() || name.toLowerCase().replace(/\s+/g, '-')

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('categories')
    .update({ name, slug })
    .eq('id', input.id)

  if (error) return { error: error.message }
  return { error: null }
}

export async function deleteCategory(id: string) {
  await requireAdmin()

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return { error: 'Categoría inválida.' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) return { error: error.message }
  return { error: null }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  await requireAdmin()

  if (!/^[0-9a-f-]{36}$/i.test(orderId)) {
    return { error: 'Pedido inválido.' }
  }

  const validStatuses = [
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'DELIVERED',
    'CANCELLED',
  ]
  if (!validStatuses.includes(newStatus)) {
    return { error: 'Estado inválido.' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)

  if (error) return { error: error.message }
  return { error: null }
}
