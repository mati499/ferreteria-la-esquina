# Ferretería La Esquina — Instrucciones de despliegue y Supabase

## 1. Configurar Supabase (obligatorio)

### Crear proyecto
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea un nuevo proyecto llamado "ferreteria-la-esquina"
3. Espera a que se provisione la base de datos

### Obtener credenciales
1. En tu proyecto, ve a **Configuración > API**
2. Copia:
   - `URL pública` → `NEXT_PUBLIC_SUPABASE_URL`
   - `clave pública (anon)` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `clave de rol de servicio` → `SUPABASE_SERVICE_ROLE_KEY`
3. Pégalas en `.env.local`

### Ejecutar el esquema de base de datos
1. En Supabase, ve a **SQL Editor**
2. Copia y pega todo el contenido de `supabase/schema.sql`
3. Haz clic en **Ejecutar**

Esto creará:
- Todas las tablas (categorías, productos, pedidos, order_items, custom_orders, business_config)
- Row Level Security (RLS) con políticas públicas y de admin
- Bucket de Storage `product-images` para imágenes de productos
- Datos iniciales (categoría "General", configuración del negocio)

### Crear usuario administrador
1. En Supabase, ve a **Authentication > Users**
2. Crea un usuario (o invítalo por email)
3. Copia su `user.id`
4. En SQL Editor, ejecuta:

```sql
update auth.users
set raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', 'admin')
where id = '<tu-user-id>';
```

### Configurar Storage
1. Ve a **Storage > Buckets**
2. Crea un bucket llamado `product-images`
3. Marcalo como **Público**
4. Las políticas ya están creadas en `schema.sql`

---

## 2. Ejecutar en desarrollo

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno (si no lo has hecho)
cp .env.example .env.local

# Editar .env.local con tus credenciales de Supabase
# (usar tu editor favorito, ej: notepad .env.local)

# Ejecutar
npm run dev

# Abrir en http://localhost:3000
```

---

## 3. Desplegar en Producción (Vercel)

### Opción A: CLI de Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Autenticar
vercel login

# Desplegar
vercel --prod
```

### Opción B: Git + Vercel Dashboard
1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa el repositorio
4. Agrega las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Despliega

---

## 4. Estructura final del proyecto

```
ferreteria-la-esquina/
├── supabase/
│   └── schema.sql          # Esquema SQL + Storage + RLS + datos iniciales
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── middleware.ts   # Protege rutas /admin
│   │   ├── (public)/       # Tienda pública
│   │   │   ├── page.tsx
│   │   │   ├── catalogo/
│   │   │   ├── product/[id]/
│   │   │   ├── carrito/
│   │   │   ├── checkout/
│   │   │   ├── info-negocio/
│   │   │   └── pedido-personalizado/
│   │   └── (admin)/        # Panel admin
│   │       ├── layout.tsx
│   │       ├── login/
│   │       ├── dashboard/
│   │       ├── products/
│   │       ├── orders/
│   │       ├── stock/
│   │       └── config/
│   ├── components/
│   │   ├── products/
│   │   │   ├── product-card.tsx
│   │   │   └── image-upload.tsx   # Subida a Supabase Storage
│   │   └── ui/
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── supabase/browser.ts
│   │   ├── supabase/middleware.ts
│   │   └── utils.ts
│   ├── services/
│   │   └── products.ts
│   ├── store/
│   │   └── cart.ts (Zustand + localStorage)
│   ├── types/
│   │   └── index.ts
│   ├── validations/
│   │   └── zod/
│   └── tests/
│       ├── setup.ts
│       ├── example.test.tsx
│       └── e2e/
│           └── example.spec.ts
├── setup.sh                # Setup Linux/Mac
├── setup.ps1               # Setup Windows
├── deploy.sh               # Despliegue Vercel (CLI)
├── deploy.ps1              # Despliegue Vercel (PowerShell)
├── vercel.json             # Config de Vercel
├── .env.example            # Variables de entorno (ejemplo)
├── .env.local              # Variables de entorno (tuyas)
├── README.md
└── package.json
```

---

## 5. Stack tecnológico implementado

| Capa | Tecnología |
|------|-----------|
| Frontend + Backend | Next.js 15 (App Router) |
| Interfaz | React.js 18 |
| Tipado | TypeScript (strict) |
| Backend / DB / Auth / Storage | Supabase |
| Estilos | Tailwind CSS |
| Validación | Zod |
| Formularios | React Hook Form |
| Iconos | Lucide React |
| Estado | Zustand |
| Pruebas unitarias | Vitest + React Testing Library |
| Pruebas E2E | Playwright |
| Despliegue | Vercel |

---

## 6. Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm test             # Pruebas unitarias (Vitest)
npm run test:e2e     # Pruebas end-to-end (Playwright)
```
