'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { updateProduct, uploadProductImage, deleteProductImage } from '@/app/admin/actions'
import { ArrowLeft, Trash2, Image as ImageIcon } from 'lucide-react'
import { ImageUpload } from '@/components/products/image-upload'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'

const productSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Precio inválido'),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Stock inválido'),
  category_id: z.string().optional(),
  is_active: z.boolean(),
})

export default function EditProductClient({ productId }: { productId: string }) {
  const [categories, setCategories] = useState<any[]>([])
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      is_active: true,
    },
  })

  useEffect(() => {
    loadData()
  }, [productId])

  async function loadData() {
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('*').eq('id', productId).single(),
    ])
    setCategories(catRes.data || [])
    if (prodRes.data) {
      setProduct(prodRes.data)
      setImageUrl(prodRes.data.image_url || null)
      form.reset({
        name: prodRes.data.name,
        description: prodRes.data.description || '',
        price: prodRes.data.price?.toString() || '',
        stock: prodRes.data.stock?.toString() || '',
        category_id: prodRes.data.category_id || '',
        is_active: prodRes.data.is_active,
      })
    }
    setIsLoading(false)
  }

  async function handleSubmit(values: z.infer<typeof productSchema>) {
    setIsSubmitting(true)
    try {
      const { error } = await updateProduct({
        id: productId,
        name: values.name,
        description: values.description || null,
        price: Number(values.price),
        stock: Number(values.stock),
        image_url: imageUrl,
        category_id: values.category_id || null,
        is_active: values.is_active,
      })

      if (error) throw new Error(error)
      window.location.href = '/admin/products'
    } catch (err: any) {
      setIsSubmitting(false)
      alert('Error al actualizar producto: ' + err.message)
    }
  }

  async function deleteProduct() {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return
    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      window.location.href = '/admin/products'
    }
  }

  if (isLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Cargando producto...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Volver a productos
        </Link>
        <h1 className="text-2xl font-bold">Editar producto</h1>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del producto</label>
              <input
                {...form.register('name')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ej: Llave inglesa 12 pulgadas"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <select
                {...form.register('category_id')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon size={16} /> Imagen del producto
              </label>
              <ImageUpload
                productId={productId}
                currentUrl={imageUrl}
                onChange={setImageUrl}
                uploadAction={uploadProductImage}
                removeAction={deleteProductImage}
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Precio (COP)</label>
              <input
                {...form.register('price')}
                type="number"
                min="0"
                step="100"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="0"
              />
              {form.formState.errors.price && (
                <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Stock</label>
              <input
                {...form.register('stock')}
                type="number"
                min="0"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="0"
              />
              {form.formState.errors.stock && (
                <p className="text-xs text-destructive">{form.formState.errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                {...form.register('description')}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe el producto..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <input
                  type="checkbox"
                  {...form.register('is_active')}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                ¿Producto activo (visible en catálogo)?
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting} className="w-auto">
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
          <Button variant="destructive" onClick={deleteProduct} className="w-auto">
            Eliminar producto
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = '/admin/products')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
