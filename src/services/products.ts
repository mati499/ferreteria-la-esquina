import { supabase } from '@/lib/supabase'
import type { Product, Category } from '@/lib/supabase'

export async function getProducts(filters?: {
  categoryId?: string
  isActive?: boolean
}) {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false })

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }
  if (filters?.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Product[]
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Product
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Category[]
}

export async function getBusinessConfig() {
  const { data, error } = await supabase
    .from('business_config')
    .select('*')
    .limit(1)
    .single()

  if (error) throw error
  return data
}

export async function createOrder(orderData: {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  total: number
  paymentMethod: string
  notes?: string | null
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
}) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderData.orderNumber,
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_address: orderData.customerAddress,
      total: orderData.total,
      status: 'PENDING',
      payment_method: orderData.paymentMethod,
      notes: orderData.notes || null,
    })
    .select()
    .single()

  if (orderError) throw orderError

  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  return order
}

export async function createCustomOrder(data: {
  description: string
  estimatedQuantity?: number | null
  customerName: string
  customerPhone: string
  notes?: string | null
}) {
  const { data: result, error } = await supabase
    .from('custom_orders')
    .insert({
      description: data.description,
      estimated_quantity: data.estimatedQuantity || null,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      notes: data.notes || null,
      status: 'NEW',
    })
    .select()
    .single()

  if (error) throw error
  return result
}
