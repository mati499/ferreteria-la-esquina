# Ferretería La Esquina — MVP

Plataforma de comercio electrónico para ferretería con tienda pública y panel de administración.

## Stack tecnológico

- [Next.js 15 (App Router)](https://nextjs.org) — Frontend + API Routes
- [React.js 19](https://react.dev) — Interfaces y componentes
- [TypeScript (strict)](https://www.typescriptlang.org) — Tipado estático
- [Supabase](https://supabase.com) — Backend administrado (PostgreSQL, Auth, Storage)
- [Tailwind CSS](https://tailwindcss.com) — Estilos
- [Zod](https://zod.dev) — Validación de datos
- [React Hook Form](https://react-hook-form.com) — Formularios
- [Lucide React](https://lucide.dev) — Iconografía
- [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) — Pruebas unitarias y de componentes
- [Playwright](https://playwright.dev) — Pruebas end-to-end

## Requisitos previos

- Node.js 18+
- Una cuenta en [Supabase](https://supabase.com)

## Instalación

```bash
# Clonar el repositorio (o usar los archivos generados)
cd ferreteria-la-esquina

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Configurar las variables en .env.local con tus credenciales de Supabase
```

## Configurar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com).
2. Ejecutar el script `supabase/schema.sql` en el SQL Editor del proyecto.
3. Copiar la URL y la clave pública (anon key) desde Configuración > API a `.env.local`.
4. (Opcional) Crear un usuario administrador en Supabase Auth y asignarle `role = 'admin'` en `user_metadata`.

```sql
-- Ejemplo: asignar rol admin a un usuario existente
update auth.users
set raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', 'admin')
where id = '<user-id>';
```

## Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Pruebas

```bash
# Pruebas unitarias y de componentes (Vitest + RTL)
npm test

# Pruebas end-to-end (Playwright)
npm run test:e2e
```

## Estructura del proyecto

```
src/
├── app/                 # App Router de Next.js
│   ├── (public)/        # Tienda pública
│   └── (admin)/         # Panel de administración
├── components/          # Componentes compartidos
├── lib/                 # Utilidades (Supabase)
├── services/            # Capa de servicios (API)
├── store/               # Estado global (carrito)
├── validations/         # Esquemas Zod
└── tests/               # Pruebas unitarias y E2E
```

## Despliegue

Despliegue recomendado en [Vercel](https://vercel.com) con la integración de Supabase.
