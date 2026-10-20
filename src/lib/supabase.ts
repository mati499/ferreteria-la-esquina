import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          stock: number
          image_url: string | null
          category_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          stock: number
          image_url?: string | null
          category_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          image_url?: string | null
          category_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_address: string
          total: number
          status: string
          payment_method: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_address: string
          total: number
          status?: string
          payment_method: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_phone?: string
          customer_address?: string
          total?: number
          status?: string
          payment_method?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
        }
      }
      custom_orders: {
        Row: {
          id: string
          description: string
          estimated_quantity: number | null
          customer_name: string
          customer_phone: string
          notes: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          description: string
          estimated_quantity?: number | null
          customer_name: string
          customer_phone: string
          notes?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          description?: string
          estimated_quantity?: number | null
          customer_name?: string
          customer_phone?: string
          notes?: string | null
          created_at?: string
        }
      }
      business_config: {
        Row: {
          id: string
          business_name: string
          address: string | null
          phone: string | null
          whatsapp_number: string | null
          schedule: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          business_name: string
          address?: string | null
          phone?: string | null
          whatsapp_number?: string | null
          schedule?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          business_name?: string
          address?: string | null
          phone?: string | null
          whatsapp_number?: string | null
          schedule?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type CustomOrder = Database['public']['Tables']['custom_orders']['Row']
export type BusinessConfig = Database['public']['Tables']['business_config']['Row']
