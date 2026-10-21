'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  productId?: string
  currentUrl?: string | null
  onChange: (url: string | null) => void
  className?: string
  uploadAction?: (formData: FormData) => Promise<{ error?: string | null; url?: string | null }>
  removeAction?: (formData: FormData) => Promise<{ error?: string | null }>
}

export function ImageUpload({
  productId,
  currentUrl,
  onChange,
  className,
  uploadAction,
  removeAction,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)

  const uploadImage = useCallback(
    async (file: File) => {
      setUploading(true)
      try {
        // Subida directa vía API Route (evita límites de Server Action de Next.js)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('productId', productId || '')

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await res.json()

        if (!res.ok || result.error) {
          throw new Error(result.error || 'Error al subir la imagen')
        }

        if (result.url) {
          setPreview(result.url)
          onChange(result.url)
        }
      } catch (err: any) {
        console.error('Error subiendo imagen:', err)
        alert('Error al subir la imagen: ' + err.message)
      } finally {
        setUploading(false)
      }
    },
    [productId, onChange]
  )

  const removeImage = useCallback(() => {
    if (currentUrl) {
      // Extraer el path del nombre de archivo desde la URL pública
      const urlParts = currentUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const folder = productId || 'temp'
      const path = `${folder}/${fileName}`

      if (removeAction) {
        const formData = new FormData()
        formData.append('path', path)
        removeAction(formData)
          .then((result) => {
            if (result.error) {
              alert('Error al eliminar la imagen: ' + result.error)
            }
          })
      } else {
        supabase.storage.from('product-images').remove([path])
      }
    }
    setPreview(null)
    onChange(null)
  }, [currentUrl, productId, supabase, removeAction, onChange])

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Vista previa"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <button
            onClick={removeImage}
            className="absolute -right-2 -top-2 bg-destructive text-white rounded-full p-1.5 hover:bg-destructive/90 transition opacity-0 group-hover:opacity-100"
            aria-label="Eliminar imagen"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : null}

      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition">
        <label className="flex flex-col items-center gap-3 cursor-pointer">
          <Upload size={24} className="text-muted-foreground group-hover:text-primary transition" />
          <span className="text-sm text-muted-foreground">
            {preview ? 'Cambiar imagen' : 'Subir imagen del producto'}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const maxSize = 10 * 1024 * 1024 // 10 MB
              if (file.size > maxSize) {
                alert(`La imagen es demasiado grande (${Math.round(file.size / 1024 / 1024)}MB). Máximo permitido: 10MB.`)
                return
              }
              uploadImage(file)
            }}
          />
        </label>
        {uploading && (
          <div className="flex flex-col items-center gap-2">
            <RefreshCw size={20} className="animate-spin" />
            <span className="text-xs text-muted-foreground">
              Subiendo imagen...
            </span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Máximo 10MB. Formatos: JPG, PNG, WEBP.
        </p>
      </div>
    </div>
  )
}
