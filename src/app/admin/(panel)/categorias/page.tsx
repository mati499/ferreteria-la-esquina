'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/app/admin/actions'
import { Plus, Trash2, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    if (!error) setCategories(data || [])
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const res = await createCategory({ name: formName, slug: formSlug })
    if (res.error) {
      alert(res.error)
      return
    }
    setFormName('')
    setFormSlug('')
    loadCategories()
  }

  async function handleUpdate(e: React.FormEvent, id: string) {
    e.preventDefault()
    const res = await updateCategory({ id, name: formName, slug: formSlug })
    if (res.error) {
      alert(res.error)
      return
    }
    setEditing(null)
    setFormName('')
    setFormSlug('')
    loadCategories()
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return
    const res = await deleteCategory(id)
    if (res.error) {
      alert(res.error)
      return
    }
    loadCategories()
  }

  if (loading) {
    return (
      <div className="py-8 container mx-auto px-4">
        <p className="text-muted-foreground">Cargando categorías...</p>
      </div>
    )
  }

  const editingCat = categories.find((c) => c.id === editing)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="text-muted-foreground">
            Administra las categorías de productos de la ferretería.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm text-primary hover:underline"
        >
          ← Volver a productos
        </Link>
      </div>

      {editing ? (
        <div className="bg-card border rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="font-semibold mb-4">Editar categoría</h2>
          <form onSubmit={(e) => handleUpdate(e, editing!)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL amigable)</label>
              <input
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit">Guardar cambios</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(null)
                  setFormName('')
                  setFormSlug('')
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <form onSubmit={handleCreate} className="bg-card border rounded-xl p-6 mb-8 shadow-sm space-y-4">
            <h2 className="font-semibold">Nueva categoría</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Ej: Fontanería"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <input
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="ej: fontaneria"
                  required
                />
              </div>
              <Button type="submit">Crear categoría</Button>
            </div>
          </form>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="pb-3 font-medium">Nombre</th>
                  <th className="pb-3 font-medium">Slug</th>
                  <th className="pb-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b hover:bg-secondary/50">
                    <td className="py-4 font-medium">{cat.name}</td>
                    <td className="py-4 text-muted-foreground">{cat.slug}</td>
                    <td className="py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditing(cat.id)
                          setFormName(cat.name)
                          setFormSlug(cat.slug)
                        }}
                      >
                        <Edit3 size={14} className="mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {categories.length === 0 && !editing && (
        <div className="text-center py-12 text-muted-foreground">
          <Plus size={24} className="mx-auto mb-2 opacity-50" />
          <p>No hay categorías creadas aún.</p>
        </div>
      )}
    </div>
  )
}
