# Plan de Desarrollo — Ferretería La Esquina

**Proyecto:** Ferretería La Esquina  
**Documento:** Development Plan (SDD)  
**Versión:** 1.0  
**Estado:** Borrador inicial  
**Base:** `functional-spec.md`, `technical-spec.md`, `design-reference.md` (v1.0)

---

## 1. Objetivo

Definir la hoja de ruta, fases, tareas, entregables y cronograma para entregar el MVP de la plataforma de comercio electrónico de Ferretería La Esquina (tienda pública + panel de administración).

---

## 2. Alcance del MVP

**Incluido:**
- Tienda pública: catálogo, carrito, pedido, WhatsApp, info del negocio, pedido personalizado.
- Panel admin: login, gestión de productos (CRUD), gestión de pedidos, stock, reportes de ventas, configuración del negocio.

**Excluido (post-MVP):**
- Pagos en línea integrados.
- Autenticación de compradores (perfiles de usuario).
- Envíos con terceros y logística.
- Notificaciones automáticas (email/push).
- Tiendas físicas multipunto.

---

## 3. Metodología

- Enfoque incremental por fases.
- Cada fase culmina con un entregable verificable.
- Reuniones de sincronía semanales (opcional, según equipo).
- Criterio de "Definition of Done" (DoD) por tarea.

---

## 4. Fases del proyecto

| Fase | Nombre | Duración estimada | Objetivo principal |
|------|--------|-------------------|--------------------|
| 1 | Setup y base de datos | 1 semana | Entorno, backend base, modelo de datos, autenticación admin |
| 2 | API pública y pedidos | 1.5 semanas | Catálogo, carrito, creación de pedidos, info del negocio |
| 3 | Panel de administración | 2 semanas | Login, CRUD productos, gestión pedidos, stock, configuración |
| 4 | Frontend tienda pública | 1.5 semanas | Pantallas públicas, carrito, checkout, WhatsApp, pedido personalizado |
| 5 | Integración y pruebas | 1 semana | Conectar frontend + backend, pruebas end-to-end, ajustes |
| 6 | Despliegue y entrega | 0.5 semanas | Deploy, variables de entorno, documentación final, handover |

**Duración total estimada:** ~7.5 semanas (menos de 2 meses).

---

## 5. Desglose de tareas por fase

### Fase 1 — Setup y base de datos (Semana 1)

| ID | Tarea | Descripción | Entregable |
|----|-------|-------------|------------|
| 1.1 | Repositorio y entorno | Crear repositorios (backend, frontend), configurar TypeScript, ESLint, Prettier. | Repositorios listos |
| 1.2 | Base de datos | Configurar PostgreSQL, definir schema con Prisma, crear migraciones. | DB funcionando |
| 1.3 | Modelo de datos | Implementar entidades: User, Category, Product, Order, OrderItem, CustomOrder, BusinessConfig. | Schema completo |
| 1.4 | Autenticación admin | Endpoint login, hash de contraseña (bcrypt), emisión y validación de JWT. | Middleware de auth |
| 1.5 | Seed de datos | Cargar categorías y productos de ejemplo para pruebas. | Datos de prueba |

**DoD Fase 1:** Backend arranca, DB conectada, se puede crear un admin y obtener token JWT.

---

### Fase 2 — API pública y pedidos (Semanas 2-3)

| ID | Tarea | Descripción | Entregable |
|----|-------|-------------|------------|
| 2.1 | Endpoints productos | GET /products (listado, filtro categoría, paginación), GET /products/:id, GET /categories. | API productos |
| 2.2 | Info del negocio | GET /business-config, PUT /admin/business-config. | Config pública |
| 2.3 | Crear pedido | POST /orders con validación de stock, generación de orderNumber, creación de OrderItem. | API pedidos |
| 2.4 | Consultar pedido | GET /orders/:id (público, estado del pedido). | Consulta pública |
| 2.5 | Pedido personalizado | POST /custom-orders, guardado con status NEW. | API custom orders |
| 2.6 | Health check | GET /health para monitoreo. | Endpoint salud |

**DoD Fase 2:** Se puede crear un pedido desde la API y consultar su estado; el catálogo responde correctamente.

---

### Fase 3 — Panel de administración (Semanas 4-5)

| ID | Tarea | Descripción | Entregable |
|----|-------|-------------|------------|
| 3.1 | Login admin | Página de login, conexión con JWT, redirección si está autenticado. | Pantalla login |
| 3.2 | Dashboard | Tarjetas KPI (pedidos pendientes, ventas, bajo stock), lista de últimos pedidos. | Dashboard |
| 3.3 | CRUD productos | Listado, crear, editar, eliminar/desactivar producto, subir imagen. | Gestión productos |
| 3.4 | Gestión pedidos | Listado con filtros, detalle, cambio de estados (PENDING → CONFIRMED → ... → DELIVERED/CANCELLED). | Gestión pedidos |
| 3.5 | Stock | Vista de productos con bajo stock, ajuste manual de stock. | Control stock |
| 3.6 | Reportes | Ventas por período, productos más vendidos (tabla simple). | Reportes ventas |
| 3.7 | Configuración negocio | Editar nombre, dirección, teléfono, WhatsApp, horario. | Config negocio |

**DoD Fase 3:** Admin puede gestionar productos, pedidos, stock y configuración sin errores.

---

### Fase 4 — Frontend tienda pública (Semanas 6-7)

| ID | Tarea | Descripción | Entregable |
|----|-------|-------------|------------|
| 4.1 | Header y navegación | Logo, buscador, carrito con contador, botón WhatsApp. | Header compartido |
| 4.2 | Catálogo | Grid de productos, filtros por categoría, buscador. | Catálogo |
| 4.3 | Detalle producto | Imagen, descripción, precio, cantidad, agregar al carrito, WhatsApp. | Detalle producto |
| 4.4 | Carrito | Agregar, editar cantidad, eliminar, resumen total, estado vacío. | Carrito |
| 4.5 | Checkout | Formulario de datos cliente, método de pago, resumen, botón confirmar. | Checkout |
| 4.6 | Confirmación de pedido | Pantalla con orderNumber, mensaje éxito, botón WhatsApp. | Confirmación |
| 4.7 | Info del negocio | Página/sección con datos del negocio y botón WhatsApp. | Info negocio |
| 4.8 | Pedido personalizado | Formulario y confirmación de envío. | Pedido personalizado |
| 4.9 | Estado carrito persistente | LocalStorage o contexto para mantener carrito entre recargas. | Persistencia carrito |

**DoD Fase 4:** Un comprador puede navegar, agregar al carrito, hacer checkout y recibir confirmación sin errores.

---

### Fase 5 — Integración y pruebas (Semana 8)

| ID | Tarea | Descripción | Entregable |
|----|-------|-------------|------------|
| 5.1 | Conectar frontend y backend | Ajustar URLs de API, manejo de errores, estados de carga. | Integración completa |
| 5.2 | Pruebas funcionales | Verificar cada requisito del functional-spec (catálogo, carrito, pedido, admin). | Reporte de pruebas |
| 5.3 | Pruebas de stock | Validar que no se pueda comprar sin stock y que se descuente al confirmar. | Casos de stock |
| 5.4 | Pruebas WhatsApp | Validar enlaces wa.me con número y mensaje prellenado. | Enlaces WhatsApp |
| 5.5 | Ajustes y correcciones | Fix de bugs críticos encontrados en pruebas. | Versión estable |
| 5.6 | Documentación técnica | README con instrucciones de instalación, variables de entorno, endpoints. | Docs entregables |

**DoD Fase 5:** Sistema funcionando end-to-end, bugs críticos resueltos, documentación lista.

---

### Fase 6 — Despliegue y entrega (Semana 9, media)

| ID | Tarea | Descripción | Entregable |
|----|-------|-------------|------------|
| 6.1 | Despliegue backend | Desplegar API en Render/Railway o similar. | URL de API |
| 6.2 | Despliegue frontend | Desplegar tienda y admin en Vercel/Netlify o similar. | URLs públicas |
| 6.3 | Variables de producción | Configurar DATABASE_URL, JWT_SECRET, WHATSAPP_DEFAULT_NUMBER, etc. | Entorno productivo |
| 6.4 | Smoke test en producción | Verificar que endpoints y pantallas principales funcionen en prod. | Validación prod |
| 6.5 | Handover | Entregar código, credenciales, documentación y acceso al cliente. | Proyecto entregado |

---

## 6. Cronograma resumido (9 semanas)

```
Semana 1  : Fase 1 - Setup y base de datos
Semana 2  : Fase 2 - API pública y pedidos (parte 1)
Semana 3  : Fase 2 - API pública y pedidos (parte 2)
Semana 4  : Fase 3 - Panel admin (parte 1)
Semana 5  : Fase 3 - Panel admin (parte 2)
Semana 6  : Fase 4 - Frontend tienda (parte 1)
Semana 7  : Fase 4 - Frontend tienda (parte 2)
Semana 8  : Fase 5 - Integración y pruebas
Semana 9  : Fase 6 - Despliegue y entrega (media semana)
```

---

## 7. Priorización MoSCoW (para ajustes de alcance)

| Categoría | Ítems |
|-----------|-------|
| **Must have** | Catálogo, carrito, crear pedido, panel admin login, CRUD productos, gestión pedidos, stock básico, WhatsApp enlace, info negocio, pedido personalizado. |
| **Should have** | Filtros por categoría, reportes de ventas simples, dashboard con KPIs, persistencia de carrito. |
| **Could have** | Pagos en línea, autenticación de comprador, exportar CSV, gráfico de ventas. |
| **Won't have (MVP)** | Envíos con terceros, notificaciones push/email, tiendas multipunto, suscripciones. |

---

## 8. Riesgos y mitigaciones

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Retraso en definiciones del negocio (horario, WhatsApp, precios) | Medio | Media | Definir BusinessConfig temprano (Fase 1) y dejar campos abiertos. |
| Problemas con imágenes de productos | Bajo | Media | Usar placeholders y permitir URL externa como fallback. |
| WhatsApp Business API no disponible | Bajo | Baja | Usar enlaces `wa.me` directo (ya planeado en MVP). |
| Escasez de tiempo del desarrollador | Alto | Media | Priorizar Must Have; dejar Could Have para versiones futuras. |
| Cambios en stack tecnológico | Medio | Baja | Mantener decisiones tomadas en technical-spec sin cambios a mitad de camino. |

---

## 9. Criterios de definición de listo (DoD)

Una tarea se considera completada cuando:
- El código está implementado y revisado.
- Pasó pruebas funcionales manuales (o automatizadas si aplica).
- No hay bloqueadores ni bugs críticos abiertos.
- Está documentado (README o comentarios) si es necesario.
- Se desplegó en entorno de pruebas (staging) cuando aplica.

---

## 10. Entregables finales

1. Código fuente del backend (Node.js + Express + Prisma + PostgreSQL).
2. Código fuente del frontend (React + Vite + Tailwind CSS).
3. Base de datos desplegada con schema y seed.
4. Variables de entorno configuradas.
5. URLs de producción (API, tienda pública, panel admin).
6. Documentación técnica (README, endpoints, credenciales de acceso).
7. Este conjunto de documentos SDD (functional, technical, design, development plan).

---

## 11. Próximos pasos inmediatos

1. Revisar y validar este `development-plan.md` con el equipo/cliente.
2. Asignar responsables por fase.
3. Iniciar Fase 1 (setup y base de datos).
4. Programar reuniones de seguimiento semanales.
