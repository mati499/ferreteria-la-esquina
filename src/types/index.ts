export type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string | null
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED'

export type CustomOrderStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUOTED'
  | 'COMPLETED'
  | 'CANCELLED'

export interface BusinessConfig {
  id: string
  businessName: string
  address?: string | null
  phone?: string | null
  whatsappNumber?: string | null
  schedule?: string | null
}

export interface ProductWithCategory {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  imageUrl: string | null
  categoryId: string | null
  isActive: boolean
  category?: {
    id: string
    name: string
    slug: string
  }
  createdAt: string
  updatedAt: string
}

export interface OrderWithItems {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  total: number
  status: OrderStatus
  paymentMethod: string
  notes: string | null
  createdAt: string
  updatedAt: string
  items: Array<{
    id: string
    productId: string
    productName: string
    quantity: number
    price: number
  }>
}
