# Especificación Técnica — Ferretería La Esquina

**Proyecto:** Ferretería La Esquina  
**Documento:** Technical Spec (SDD)  
**Versión:** 1.0  
**Estado:** Borrador inicial  
**Base:** `functional-spec.md` (v1.0)

---

## 1. Visión técnica

Plataforma de comercio electrónico para ferretería con tienda pública (comprador) y panel de administración (admin). Arquitectura cliente-servidor con frontend web, backend REST API y base de datos relacional.

---

## 2. Stack tecnológico propuesto

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend + Backend (tienda pública) | Next.js con App Router | Framework fullstack con routing por carpetas, SSR/SSG y API Routes integradas |
| Interfaz y componentes | React.js | Construcción de interfaces reactivas y componentes reutilizables |
| Lenguaje | TypeScript (modo estricto) | Tipado estático, menos errores en tiempo de compilación |
| Backend administrado | Supabase | Backend como servicio: base de datos, auth, storage y APIs autogeneradas |
| Base de datos | PostgreSQL (mediante Supabase) | Relacional, integridad de datos para stock y pedidos |
| Almacenamiento de imágenes | Supabase Storage | Almacenamiento de archivos gestionado por Supabase |
| Autenticación | Supabase Auth | Autenticación gestionada con sesiones, JWT y proveedores sociales |
| Validación de datos | Zod | Esquemas de validación type-safe para formularios y APIs |
| Formularios complejos | React Hook Form | Manejo eficiente de estado y validación en formularios |
| Iconografía | Lucide React | Conjunto de iconos consistentes y ligeros para React |
| Pruebas unitarias y de componentes | Vitest + React Testing Library | Pruebas rápidas de unidades y componentes de React |
| Pruebas de flujos críticos | Playwright | Pruebas end-to-end de flujos críticos (checkout, pedidos, admin) |
| Estilos | Tailwind CSS | Estilos utilitarios, diseño mobile-first y responsivo |
| Integración WhatsApp | Enlaces `wa.me` (MVP) / WhatsApp Business API (futuro) | Sin costo, sin complejidad inicial |
| Despliegue | Vercel + Supabase | Despliegue sencillo y alineado con Next.js y Supabase |

---

## 3. Arquitectura del sistema

```
┌─────────────────┐      Next.js App Router      ┌──────────────────┐
│  Tienda Pública  │ ◄───────────────────────────► │   API Routes   │
│   (Next.js +    │                             │  (Next.js +      │
│   React.js)     │                             │  Supabase Client)│
└─────────────────┘                             └────────┬─────────┘
                                                          │
                           ┌──────────────────────────────┴─────────────────────────────┐
                           │                                                            │
                   ┌───────▼───────┐                                           ┌───────▼───────┐
                   │  Supabase     │                                           │  WhatsApp     │
                   │  (PostgreSQL) │                                           │  (wa.me link) │
                   │  + Supabase   │                                           └───────────────┘
                   │  Auth +       │
                   │  Storage      │
                   └───────┬───────┘
                           │
                   ┌───────▼───────┐
                   │ Panel Admin   │
                   │  (Next.js)    │
                   └───────────────┘
```

- La tienda pública consume las API Routes de Next.js sin autenticación (lectura de catálogo, info del negocio).
- Crear pedidos y pedidos personalizados pueden hacerse sin autenticación (datos de cliente en el cuerpo del request).
- El panel de administración requiere autenticación mediante Supabase Auth (rol `admin`).
- Supabase Storage se utiliza para guardar imágenes de productos cuando corresponda.

---

## 4. Modelo de datos

### Entidades principales

#### `User` (Administrador)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID / Int | PK |
| email | String | Único, login del admin |
| password | String | Gestionado por Supabase Auth (no se almacena en esta tabla) |
| role | Enum | `ADMIN` |
| createdAt | DateTime | |
| updatedAt | DateTime | |

#### `Category`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID / Int | PK |
| name | String | Ej: Fontanería, Eléctrica, Pintura |
| slug | String | Único, para URLs |
| createdAt | DateTime | |

#### `Product`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID / Int | PK |
| name | String | |
| description | Text | |
| price | Decimal | |
| stock | Int | Cantidad disponible |
| imageUrl | String | URL o path de imagen |
| categoryId | FK | Referencia a Category |
| isActive | Boolean | Visible en catálogo |
| createdAt | DateTime | |
| updatedAt | DateTime | |

#### `Order`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID / Int | PK |
| orderNumber | String | Único, secuencial (ej: FE-0001) |
| customerName | String | |
| customerPhone | String | |
| customerAddress | String | |
| total | Decimal | |
| status | Enum | `PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `DELIVERED`, `CANCELLED` |
| paymentMethod | String | `CASH`, `TRANSFER`, `OTHER` |
| notes | Text | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

#### `OrderItem`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID / Int | PK |
| orderId | FK | Referencia a Order |
| productId | FK | Referencia a Product |
| quantity | Int | |
| price | Decimal | Precio unitario al momento de la compra |

#### `CustomOrder` (Pedido personalizado)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID / Int | PK |
| description | Text | Descripción del producto solicitado |
| estimatedQuantity | Int | |
| customerName | String | |
| customerPhone | String | |
| notes | Text | |
| status | Enum | `NEW`, `CONTACTED`, `QUOTED`, `COMPLETED`, `CANCELLED` |
| createdAt | DateTime | |

#### `BusinessConfig`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID / Int | PK (singleton) |
| businessName | String | "Ferretería La Esquina" |
| address | String | |
| phone | String | |
| whatsappNumber | String | Para enlaces wa.me |
| schedule | Text | Horario de atención |
| updatedAt | DateTime | |

### Relaciones

- `Category` 1:N `Product`
- `Product` 1:N `OrderItem`
- `Order` 1:N `OrderItem`
- `User` 1:N `Order` (opcional, para auditoría de quién atendió)
- `BusinessConfig` es una tabla singleton (una sola fila)

---

## 5. Endpoints de la API

### Base URL
```
https://api.ferreterialaesquina.com/api/v1
```

### 5.1 Público (sin autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/products` | Listar productos activos (con paginación y filtro por categoría) |
| GET | `/products/:id` | Detalle de un producto |
| GET | `/categories` | Listar categorías |
| GET | `/business-config` | Información del negocio |
| POST | `/orders` | Crear un pedido (desde carrito) |
| GET | `/orders/:id` | Consultar estado de un pedido (público, por ID) |
| POST | `/custom-orders` | Enviar pedido personalizado |
| GET | `/health` | Health check |

### 5.2 Privado (requiere JWT, rol ADMIN)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Autenticación admin, devuelve token |
| GET | `/admin/products` | Listar todos los productos (incluidos inactivos) |
| POST | `/admin/products` | Crear producto |
| PUT | `/admin/products/:id` | Actualizar producto |
| DELETE | `/admin/products/:id` | Eliminar/desactivar producto |
| GET | `/admin/orders` | Listar pedidos (con filtros por estado, fecha) |
| PUT | `/admin/orders/:id/status` | Cambiar estado de pedido |
| GET | `/admin/stock` | Productos con bajo stock / agotados |
| GET | `/admin/reports/sales` | Reporte de ventas por período |
| GET | `/admin/custom-orders` | Listar pedidos personalizados |
| PUT | `/admin/custom-orders/:id/status` | Actualizar estado de pedido personalizado |
| PUT | `/admin/business-config` | Actualizar configuración del negocio |

---

## 6. Autenticación y autorización

- **Login:** Autenticación mediante Supabase Auth (`signInWithPassword`). Supabase gestiona el hash de contraseñas, las sesiones y la emisión de JWT.
- **Middleware:** Las rutas de `/admin/*` se protegen con `middleware.ts` de Next.js, validando la sesión de Supabase y el rol del usuario.
- **Roles:** En el MVP solo existe `ADMIN`. Se valida que la sesión contenga ese rol (vía claim `role` o metadata de usuario).
- **Expiración:** Sesión y JWT gestionados por Supabase Auth (configurable, recomendado 24 horas).
- **Hash de contraseña:** Gestionado por Supabase Auth (no se almacena ni hashea manualmente en el backend).

---

## 7. Flujos clave

### 7.1 Crear pedido (comprador)

1. Frontend envía `POST /orders` con:
   - `customerName`, `customerPhone`, `customerAddress`
   - `paymentMethod`
   - `items`: array de `{ productId, quantity }`
   - `notes` (opcional)
2. Backend valida que los productos existan, estén activos y tengan stock suficiente.
3. Crea `Order` con estado `PENDING` y `orderNumber` secuencial.
4. Crea `OrderItem` para cada producto.
5. **No descuenta stock aún** (se descuenta al confirmar, ver regla RB-03).
6. Devuelve `orderNumber` y `total`.

### 7.2 Confirmar pedido (admin)

1. Admin abre panel, ve pedidos `PENDING`.
2. Admin selecciona pedido y cambia estado a `CONFIRMED` vía `PUT /admin/orders/:id/status`.
3. Backend descuenta el stock de cada producto según los `OrderItem`.
4. Si algún producto se queda en 0, se marca `isActive = false` o se deja visible pero sin stock.

### 7.3 Pedido personalizado

1. Comprador envía `POST /custom-orders` con descripción, cantidad estimada y contacto.
2. Se crea registro con status `NEW`.
3. Admin lo ve en panel y puede cambiar a `CONTACTED`, `QUOTED`, etc.
4. Admin contacta al comprador por WhatsApp usando el número registrado.

### 7.4 Integración WhatsApp

- Se genera enlace: `https://wa.me/<whatsappNumber>?text=<mensajeCodificado>`
- El mensaje puede incluir el `orderNumber` o detalle del carrito.
- En el MVP no se usa WhatsApp Business API (no hay webhooks ni envío automático de plantillas).

---

## 8. Reglas técnicas de negocio

| ID | Regla |
|----|-------|
| RT-01 | El stock se descuenta solo cuando el pedido pasa a `CONFIRMED` o `DELIVERED` (definir en implementación, recomendado `CONFIRMED`). |
| RT-02 | Un producto con `stock = 0` no se puede agregar al carrito (validación en backend al crear orden). |
| RT-03 | El `orderNumber` tiene formato `FE-XXXX` (secuencial, relleno con ceros). |
| RT-04 | Solo productos con `isActive = true` aparecen en el catálogo público. |
| RT-05 | Los precios en `OrderItem` se congelan al momento de crear el pedido (no cambian si editas el producto después). |
| RT-06 | `BusinessConfig` es una sola fila; el frontend la consume para mostrar info del negocio y generar enlaces de WhatsApp. |

---

## 9. Consideraciones no funcionales

- **Seguridad:** Contraseñas hasheadas, JWT con expiración, validación de entrada en todos los endpoints, CORS restringido al dominio del frontend.
- **Rendimiento:** Consultas indexadas en `product.categoryId`, `order.status`, `order.createdAt`.
- **Escalabilidad:** Diseñado para 1,000 productos y 500 pedidos en MVP; paginación en listados.
- **Responsividad:** Frontend mobile-first con Tailwind CSS.
- **Disponibilidad:** Health check endpoint para monitoreo.

---

## 10. Variables de entorno (.env)

```
NEXT_PUBLIC_SUPABASE_URL="https://<proyecto>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-public-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
SUPABASE_JWT_SECRET="<jwt-secret>"
FRONTEND_URL="https://ferreterialaesquina.com"
WHATSAPP_DEFAULT_NUMBER="573000000000"
```

---

## 11. Estructura de carpetas sugerida (backend)

```
src/
├── app/
│   └── api/
│       ├── products/
│       ├── orders/
│       ├── custom-orders/
│       └── auth/
├── lib/
│   └── supabase.ts
├── components/
├── services/
├── validations/
│   └── zod/
├── middleware.ts
├── .env
├── package.json
└── tsconfig.json
```

---

## 12. Estructura de carpetas sugerida (frontend)

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── catalog/
│   │   ├── product/[id]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── business-info/
│   │   └── custom-order/
│   └── (admin)/
│       ├── login/
│       ├── dashboard/
│       ├── products/
│       ├── orders/
│       ├── stock/
│       ├── reports/
│       └── config/
├── components/
├── lib/
│   └── supabase.ts
├── services/
├── store/
├── validations/
│   └── zod/
├── .env
├── package.json
└── tsconfig.json
```

---

## 13. Pendientes para la siguiente fase (Design Reference)

- Wireframes y mockups de pantallas (catálogo, carrito, checkout, panel admin).
- Sistema de diseño: colores, tipografía, componentes reutilizables.
- Flujo de navegación entre pantallas.
