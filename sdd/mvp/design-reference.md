# Referencia de Diseño — Ferretería La Esquina

**Proyecto:** Ferretería La Esquina  
**Documento:** Design Reference (SDD)  
**Versión:** 1.0  
**Estado:** Borrador inicial  
**Base:** `functional-spec.md` (v1.0) y `technical-spec.md` (v1.0)

---

## 1. Objetivo

Definir el sistema de diseño, componentes, pantallas y flujos de navegación para la tienda pública y el panel de administración de Ferretería La Esquina. Sirve como guía visual para el desarrollo frontend.

---

## 2. Sistema de diseño

### 2.1 Paleta de colores

Inspirada en el mundo de la ferretería: confianza, solidez, profesionalismo y cercanía.

| Rol | Color | Hex | Uso |
|-----|-------|-----|-----|
| Primary | Azul ferretería | `#1D4ED8` | Botones principales, enlaces activos, header |
| Primary hover | Azul oscuro | `#1E40AF` | Estados hover de botones |
| Secondary | Gris cemento | `#6B7280` | Texto secundario, bordes sutiles |
| Success | Verde ferretería | `#16A34A` | Estados confirmados, entregados, stock disponible |
| Warning | Naranja advertencia | `#EA580C` | Stock bajo, pedidos pendientes |
| Error | Rojo | `#DC2626` | Pedidos cancelados, errores, eliminar |
| Background | Gris muy claro | `#F9FAFB` | Fondos de página, secciones |
| Surface | Blanco | `#FFFFFF` | Tarjetas, modales, inputs |
| Text | Gris oscuro | `#111827` | Texto principal |
| Text muted | Gris medio | `#6B7280` | Texto secundario, placeholders |

### 2.2 Tipografía

- **Familia principal:** `Inter` (sans-serif) — legible en pantallas pequeñas y moderna.
- **Familia alternativa (títulos):** `Poppins` — opcional para encabezados grandes.

| Elemento | Tamaño | Peso | Uso |
|----------|--------|------|-----|
| H1 | 2.25rem (36px) | 700 | Títulos de página principales |
| H2 | 1.875rem (30px) | 600 | Títulos de sección |
| H3 | 1.5rem (24px) | 600 | Subtítulos |
| Body | 1rem (16px) | 400 | Texto de lectura |
| Caption | 0.875rem (14px) | 400 | Texto pequeño, etiquetas |
| Button | 1rem (16px) | 500 | Texto de botones |

### 2.3 Espaciado y bordes

- **Unidad base:** 4px (escala Tailwind estándar).
- **Border radius:** `8px` (tarjetas, inputs, modales), `6px` (botones pequeños).
- **Sombras:** `0 4px 6px -1px rgba(0,0,0,0.1)` para tarjetas elevadas.

### 2.4 Iconografía

- Conjunto sugerido: **Lucide React** o **Heroicons**.
- Iconos clave: carrito, lupa, usuario, settings, caja, camioneta, WhatsApp, teléfono, calendario, reporte (gráfico), alerta.

---

## 3. Diseño de pantallas — Tienda pública (Comprador)

### 3.1 Header / Navegación

**Elementos:**
- Logo "Ferretería La Esquina" (izquierda).
- Buscador (centro, fijo en desktop; colapsable en mobile).
- Icono carrito con contador (derecha).
- Botón WhatsApp (derecha, color verde, destacado).
- Enlaces: "Catálogo", "Información", "Pedido personalizado".

**Comportamiento:**
- Sticky en scroll.
- Mobile: menú hamburguesa que despliega lateral.

### 3.2 Hero / Información del negocio

**Contenido:**
- Nombre del negocio (grande).
- Dirección, horario de atención, teléfono.
- Botón "Llamar por WhatsApp" (enlace `wa.me`).
- Imagen de referencia del local o productos destacados.

**Ubicación:** Página de inicio y sección accesible desde el header.

### 3.3 Catálogo de productos

**Layout:** Grid responsivo (1 columna mobile, 2 tablet, 3-4 desktop).

**Tarjeta de producto:**
- Imagen del producto (ratio 1:1, placeholder si no hay).
- Nombre (título).
- Categoría (badge pequeño).
- Precio (texto grande, negrita).
- Badge de stock: "Disponible" (verde) / "Sin stock" (gris).
- Botón "Agregar al carrito" o "Sin stock" (deshabilitado).

**Filtros:**
- Barra lateral o superior con:
  - Buscador por nombre.
  - Filtro por categoría (dropdown o chips).
  - Ordenamiento (precio ascendente/descendente, nombre).

### 3.4 Detalle de producto

**Secciones:**
- Imagen principal (grande) + miniaturas opcionales.
- Nombre, precio, descripción.
- Selector de cantidad (input numérico, mín 1).
- Stock disponible.
- Botón "Agregar al carrito".
- Botón WhatsApp con mensaje prellenado: "Hola, me interesa el producto [Nombre]".

### 3.5 Carrito de compras

**Vista:**
- Lista de ítems con:
  - Imagen pequeña.
  - Nombre.
  - Precio unitario.
  - Selector de cantidad (+ / -).
  - Botón eliminar (icono papelera, rojo sutil).
  - Subtotal por ítem.
- Resumen:
  - Subtotal.
  - Envío (a definir, MVP: gratis o a convenir).
  - Total.
- Botón principal: "Realizar pedido" (color primary).
- Botón secundario: "Seguir comprando".
- Enlace WhatsApp para consultar el carrito.

**Estado vacío:** Ilustración o mensaje "Tu carrito está vacío" + botón "Ver catálogo".

### 3.6 Checkout / Realizar pedido

**Formulario (una sola página):**
- Nombre completo.
- Teléfono.
- Dirección de entrega.
- Método de pago (radio buttons): Efectivo / Transferencia.
- Notas adicionales (opcional).
- Resumen del pedido (derecha o abajo en mobile).
- Botón "Confirmar pedido".

**Después de enviar:**
- Pantalla de confirmación con `orderNumber` (ej: FE-0001).
- Mensaje: "Tu pedido ha sido recibido. Pronto nos contactaremos por WhatsApp."
- Botón: "Contactar por WhatsApp" (mensaje prellenado con el número de pedido).
- Botón: "Volver al inicio".

### 3.7 Pedido personalizado

**Formulario:**
- Descripción del producto necesario (textarea).
- Cantidad estimada.
- Nombre.
- Teléfono.
- Notas adicionales.
- Botón "Enviar solicitud".

**Confirmación:** Mensaje de éxito + opción de abrir WhatsApp directamente.

---

## 4. Diseño de pantallas — Panel de administración (Admin)

### 4.1 Login

- Campo email.
- Campo contraseña.
- Botón "Ingresar".
- Enlace "Olvidé mi contraseña" (futuro, no funcional MVP).

### 4.2 Dashboard (Inicio)

**Tarjetas resumen (KPIs):**
- Pedidos pendientes (número + badge).
- Ventas del día (monto).
- Productos con bajo stock (número + alerta naranja).
- Total de pedidos (mes).

**Lista rápida:**
- Últimos 5 pedidos (número, cliente, estado, monto).
- Accesos directos: "Gestionar productos", "Ver pedidos", "Configurar negocio".

### 4.3 Gestión de productos (CRUD)

**Listado:**
- Tabla con: Imagen, Nombre, Categoría, Precio, Stock, Estado (activo/inactivo), Acciones.
- Buscador por nombre.
- Filtro por categoría.
- Botón "Nuevo producto" (flotante o superior).

**Formulario producto (modal o página):**
- Nombre.
- Descripción.
- Precio.
- Categoría (dropdown).
- Stock inicial.
- Imagen (subida o URL).
- Activo/Inactivo (toggle).
- Botones: Guardar / Cancelar.

### 4.4 Gestión de pedidos

**Listado:**
- Tabla con: Número de pedido, Cliente, Fecha, Total, Estado (badge de color), Acciones.
- Filtros por estado y rango de fechas.
- Botón "Ver detalle".

**Detalle de pedido:**
- Datos del cliente (nombre, teléfono, dirección).
- Lista de productos con cantidades y precios.
- Total.
- Método de pago.
- Selector de estado: Pendiente → Confirmado → En preparación → Listo para entrega → Entregado / Cancelado.
- Botón "Guardar cambios".
- Botón WhatsApp para contactar al cliente (número prellenado).

### 4.5 Stock y disponibilidad

**Vista:**
- Lista de productos con stock bajo (umbral configurable, ej: < 5).
- Indicador visual rojo para stock 0.
- Botón "Ajustar stock" por producto (modal rápido).
- Exportar reporte (CSV, futuro).

### 4.6 Ventas y reportes

**Filtros:**
- Rango de fechas (desde / hasta).
- Botón "Generar reporte".

**Visualización:**
- Total vendido en el período.
- Cantidad de pedidos.
- Ticket promedio.
- Top 5 productos más vendidos (tabla simple).
- Gráfico de barras simple (ventas por día/semana) — opcional en MVP, puede ser tabla.

### 4.7 Configuración del negocio

**Formulario:**
- Nombre del negocio.
- Dirección.
- Teléfono.
- Número de WhatsApp.
- Horario de atención (texto libre o selectores de hora).
- Botón "Guardar cambios".

**Vista previa:** Mensaje "Estos datos se muestran en la tienda pública".

---

## 5. Componentes UI reutilizables

| Componente | Descripción | Estados |
|------------|-------------|---------|
| Button | Botón principal y secundario | Default, Hover, Active, Disabled, Loading |
| Input | Campo de texto con label | Default, Focus, Error, Disabled |
| Badge | Etiqueta de estado (stock, pedido) | Verde, Naranja, Rojo, Gris, Azul |
| Card | Contenedor de producto o información | Default, Hover |
| Modal | Ventana emergente (formularios, confirmaciones) | Abierto, Cerrado |
| Table | Tabla de datos (pedidos, productos) | Con paginación, sin resultados |
| Navbar | Navegación superior | Desktop, Mobile (hamburguesa) |
| Footer | Pie de página con contacto y WhatsApp | Estático |
| WhatsAppButton | Botón flotante o fijo para WhatsApp | Default, Hover |
| Loader | Indicador de carga | Spinner |
| EmptyState | Pantalla vacía (sin productos, sin pedidos) | Ilustración + texto + acción |

---

## 6. Flujo de navegación

### Tienda pública
```
Inicio → Catálogo → (filtro/búsqueda) → Detalle producto → Carrito → Checkout → Confirmación
                                    ↘
                                     WhatsApp (consulta)
```

### Panel admin
```
Login → Dashboard → Productos (CRUD) / Pedidos (gestión) / Stock / Reportes / Configuración
```

---

## 7. Responsive design

| Breakpoint | Comportamiento |
|------------|----------------|
| < 640px (mobile) | Grid 1 columna, menú hamburguesa, formularios apilados, botones full-width |
| 640px–1024px (tablet) | Grid 2 columnas, menú horizontal reducido |
| > 1024px (desktop) | Grid 3-4 columnas, menú completo, sidebar opcional en admin |

---

## 8. Accesibilidad (baseline)

- Contraste mínimo WCAG AA entre texto y fondo.
- Navegación por teclado (Tab) en todos los formularios.
- Labels asociados a inputs (`htmlFor` / `aria-label`).
- Imágenes con `alt` descriptivo.
- Botones con tipo y texto claro (no solo iconos sin etiqueta).

---

## 9. Pendientes para la siguiente fase (Development Plan)

- Diseños finales en Figma (wireframes de alta fidelidad).
- Definición de componentes exactos y biblioteca UI.
- Flujo de animaciones y transiciones (si aplica).
- Definición de imágenes y assets del negocio (logo, fotos de productos).
