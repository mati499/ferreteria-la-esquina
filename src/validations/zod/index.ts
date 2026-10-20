import * as z from 'zod'

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'El nombre es requerido'),
  customerPhone: z.string().min(8, 'Teléfono inválido'),
  customerAddress: z.string().min(5, 'Dirección requerida'),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'OTHER']),
  notes: z.string().optional(),
})

export const customOrderSchema = z.object({
  description: z
    .string()
    .min(10, 'Describe qué necesitas (mínimo 10 caracteres)'),
  estimatedQuantity: z
    .string()
    .refine((val) => !val || !isNaN(Number(val)), 'Cantidad inválida')
    .optional(),
  customerName: z.string().min(2, 'El nombre es requerido'),
  customerPhone: z.string().min(8, 'Teléfono inválido'),
  notes: z.string().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type CustomOrderFormData = z.infer<typeof customOrderSchema>
