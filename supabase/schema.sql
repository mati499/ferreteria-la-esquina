-- Esquema de base de datos para Supabase — Ferretería La Esquina
-- Ejecutar en el SQL Editor de Supabase

-- Habilitar extensiones
create extension if not exists "uuid-ossp";

-- Tabla: categorías
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla: productos
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  stock integer not null default 0,
  image_url text,
  category_id uuid references categories(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla: pedidos
create table orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  total numeric(10,2) not null default 0,
  status text not null default 'PENDING' check (status in ('PENDING','CONFIRMED','PREPARING','READY','DELIVERED','CANCELLED')),
  payment_method text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla: items de pedido
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete restrict not null,
  quantity integer not null check (quantity > 0),
  price numeric(10,2) not null
);

-- Tabla: pedidos personalizados
create table custom_orders (
  id uuid default uuid_generate_v4() primary key,
  description text not null,
  estimated_quantity integer,
  customer_name text not null,
  customer_phone text not null,
  notes text,
  status text not null default 'NEW' check (status in ('NEW','CONTACTED','QUOTED','COMPLETED','CANCELLED')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla: configuración del negocio (singleton)
create table business_config (
  id uuid default uuid_generate_v4() primary key,
  business_name text not null default 'Ferretería La Esquina',
  address text,
  phone text,
  whatsapp_number text,
  schedule text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices para rendimiento
create index idx_products_category_id on products(category_id);
create index idx_products_is_active on products(is_active);
create index idx_orders_status on orders(status);
create index idx_orders_created_at on orders(created_at);
create index idx_order_items_order_id on order_items(order_id);
create index idx_custom_orders_status on custom_orders(status);

-- ==========================================
-- SUPABASE STORAGE: Bucket de imágenes
-- ==========================================
-- Crear bucket público para imágenes de productos
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Políticas de Storage
-- Permitir lectura pública de imágenes
create policy "Product images are publicly accessible" on storage.objects
  for select using (bucket_id = 'product-images');

-- Permitir a autenticados subir imágenes
create policy "Authenticated users can upload product images" on storage.objects
  for insert with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Permitir a autenticados actualizar sus propias imágenes
create policy "Authenticated users can update product images" on storage.objects
  for update using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Permitir a autenticados eliminar imágenes
create policy "Authenticated users can delete product images" on storage.objects
  for delete using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Row Level Security (RLS)
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table custom_orders enable row level security;
alter table business_config enable row level security;

-- Políticas públicas de lectura (categorías y productos activos)
create policy "Categorías visibles públicamente" on categories
  for select using (true);

create policy "Productos activos visibles públicamente" on products
  for select using (is_active = true);

create policy "Configuración del negocio visible públicamente" on business_config
  for select using (true);

-- Políticas para pedidos: crear sin auth, leer propios
create policy "Crear pedidos sin autenticación" on orders
  for insert with check (true);

create policy "Leer pedidos propios" on orders
  for select using (true); -- MVP: cualquier persona puede consultar por ID

create policy "Crear order_items sin autenticación" on order_items
  for insert with check (true);

create policy "Crear custom_orders sin autenticación" on custom_orders
  for insert with check (true);

-- El claim "role" del JWT es authenticated/anon. El rol de la app está en la metadata.
create or replace function public.is_app_admin()
returns boolean
language sql
stable
as $$
  select
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    or auth.jwt() -> 'user_metadata' ->> 'role' = 'admin';
$$;

-- Políticas de administrador (requieren rol admin via auth)
create policy "Admin gestiona categorías" on categories
  for all
  using (public.is_app_admin())
  with check (public.is_app_admin());

create policy "Admin gestiona productos" on products
  for all
  using (public.is_app_admin())
  with check (public.is_app_admin());

create policy "Admin gestiona pedidos" on orders
  for all
  using (public.is_app_admin())
  with check (public.is_app_admin());

create policy "Admin gestiona order_items" on order_items
  for all
  using (public.is_app_admin())
  with check (public.is_app_admin());

create policy "Admin gestiona custom_orders" on custom_orders
  for all
  using (public.is_app_admin())
  with check (public.is_app_admin());

create policy "Admin gestiona business_config" on business_config
  for all
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- Trigger para actualizar updated_at en products
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();

create trigger update_business_config_updated_at
  before update on business_config
  for each row
  execute function update_updated_at_column();

-- ==========================================
-- DATOS INICIALES (MVP)
-- ==========================================

-- Categoría por defecto
insert into categories (name, slug)
values ('General', 'general')
on conflict (slug) do nothing;

-- Configuración del negocio por defecto
insert into business_config (business_name, address, phone, whatsapp_number, schedule)
values (
  'Ferretería La Esquina',
  'Cra 10 # 20-30, Bogotá, Colombia',
  '+57 300 000 0000',
  '573000000000',
  'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 9:00 AM - 1:00 PM'
)
on conflict (id) do nothing;
