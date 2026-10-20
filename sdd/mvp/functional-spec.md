# Especificación Funcional — Ferretería La Esquina

**Proyecto:** Ferretería La Esquina  
**Documento:** Functional Spec (SDD)  
**Versión:** 1.0  
**Estado:** Borrador inicial  
**Fuente:** `provisional.md` (Listado de funcionalidades)

---

## 1. Visión del producto

Ferretería La Esquina es una plataforma de comercio electrónico orientada a la venta de productos de ferretería. Permite a los compradores navegar un catálogo, agregar productos a un carrito, realizar pedidos y contactar al negocio por WhatsApp. Del lado del negocio, un administrador gestiona productos, pedidos, stock, reportes de ventas y la configuración general de la tienda.

---

## 2. Alcance

### Dentro del alcance (MVP)

| Módulo | Actor | Descripción |
|--------|-------|-------------|
| Catálogo de productos | Comprador | Navegar y filtrar productos disponibles. |
| Carrito de compras | Comprador | Agregar, editar cantidades y eliminar productos antes de comprar. |
| Realizar pedidos | Comprador | Finalizar una compra generando un pedido. |
| Integración con WhatsApp | Comprador | Contactar al negocio por WhatsApp para consultas o seguimiento. |
| Información del negocio | Comprador | Ver datos del local (nombre, dirección, horario, contacto). |
| Pedidos personalizados | Comprador | Solicitar productos o cotizaciones a medida. |
| Panel de administración | Admin | Acceder a la consola de gestión del negocio. |
| Gestión de productos (CRUD) | Admin | Crear, leer, actualizar y eliminar productos. |
| Gestión de pedidos | Admin | Ver, aceptar, rechazar y cambiar el estado de los pedidos. |
| Disponibilidad y stock | Admin | Gestionar inventario y disponibilidad de productos. |
| Ventas y reportes | Admin | Consultar métricas de ventas y generar reportes. |
| Configuración del negocio | Admin | Editar información del negocio y ajustes de la tienda. |

### Fuera del alcance (versiones futuras)

- Pagos en línea integrados (tarjeta, transferencia, etc.).
- Envíos y logística con terceros.
- Autenticación de compradores (perfiles, historial de pedidos por usuario).
- Notificaciones push o email automáticas.
- Tienda física multipunto.

---

## 3. Actores

| Actor | Rol | Descripción |
|-------|-----|-------------|
| Comprador | Usuario final | Persona que navega el catálogo, compra y consulta por WhatsApp. |
| Administrador | Usuario interno | Encargado de operar la ferretería: productos, pedidos, stock y configuración. |
| Sistema | Aplicación | Plataforma web que expone la tienda pública y el panel de administración. |

---

## 4. Requerimientos funcionales — Comprador

### 4.1 Catálogo de productos

**RF-C1.** El sistema deberá mostrar un listado de productos disponibles para la venta.  
**RF-C2.** Cada producto deberá mostrar: nombre, descripción, precio, categoría, imagen y stock disponible.  
**RF-C3.** El comprador podrá filtrar productos por categoría.  
**RF-C4.** El comprador podrá buscar productos por nombre o palabra clave.  
**RF-C5.** El comprador podrá ver el detalle de un producto individual.

### 4.2 Carrito de compras

**RF-C6.** El comprador podrá agregar productos al carrito de compras.  
**RF-C7.** El comprador podrá modificar la cantidad de un producto en el carrito.  
**RF-C8.** El comprador podrá eliminar productos del carrito.  
**RF-C9.** El carrito deberá calcular automáticamente el subtotal por producto y el total general.  
**RF-C10.** El carrito deberá persistir durante la sesión de navegación del comprador.

### 4.3 Realizar pedidos

**RF-C11.** El comprador podrá convertir el carrito en un pedido.  
**RF-C12.** Al realizar un pedido, el sistema deberá solicitar: nombre, teléfono, dirección de entrega y método de pago (efectivo/transferencia a definir).  
**RF-C13.** El sistema deberá generar un número de pedido único y un resumen del pedido.  
**RF-C14.** El comprador recibirá una confirmación de que su pedido fue recibido (pendiente de confirmación por el admin).

### 4.4 Integración con WhatsApp

**RF-C15.** El sistema deberá proporcionar un botón/enlace de WhatsApp preconfigurado con el número del negocio.  
**RF-C16.** El mensaje de WhatsApp podrá incluir opcionalmente el detalle del carrito o el número de pedido para facilitar el seguimiento.  
**RF-C17.** El comprador podrá iniciar una conversación por WhatsApp desde la tienda pública.

### 4.5 Información del negocio

**RF-C18.** El sistema deberá mostrar una sección o página con la información del negocio: nombre, dirección, horario de atención, teléfono y WhatsApp.  
**RF-C19.** Esta información deberá ser editable desde el panel de administración y reflejarse automáticamente en la tienda pública.

### 4.6 Pedidos personalizados

**RF-C20.** El comprador podrá enviar una solicitud de producto personalizado o cotización a través de un formulario.  
**RF-C21.** La solicitud deberá incluir: descripción del producto necesario, cantidad estimada, datos de contacto y notas adicionales.  
**RF-C22.** El admin recibirá la solicitud para responder por WhatsApp o por el canal definido.

---

## 5. Requerimientos funcionales — Administrador

### 5.1 Panel de administración

**RF-A1.** El admin deberá contar con un panel de acceso restringido para gestionar el negocio.  
**RF-A2.** El panel deberá mostrar un resumen ejecutivo: pedidos pendientes, productos con bajo stock y ventas del día.

### 5.2 Gestión de productos (CRUD)

**RF-A3.** El admin podrá crear nuevos productos (nombre, descripción, precio, categoría, imagen, stock inicial).  
**RF-A4.** El admin podrá editar la información de un producto existente.  
**RF-A5.** El admin podrá eliminar o desactivar productos (baja lógica o física).  
**RF-A6.** El admin podrá listar todos los productos con paginación o búsqueda.

### 5.3 Gestión de pedidos

**RF-A7.** El admin podrá ver la lista de todos los pedidos realizados.  
**RF-A8.** El admin podrá ver el detalle de un pedido (productos, cantidades, total, datos del cliente, estado).  
**RF-A9.** El admin podrá cambiar el estado de un pedido: pendiente, confirmado, en preparación, listo para entrega, entregado, cancelado.  
**RF-A10.** El admin podrá cancelar un pedido y registrar el motivo.

### 5.4 Disponibilidad y stock

**RF-A11.** El admin podrá definir el stock disponible de cada producto.  
**RF-A12.** El sistema deberá descontar automáticamente el stock cuando un pedido es confirmado o entregado (regla a definir en technical-spec).  
**RF-A13.** El admin recibirá alerta o visualizará productos con stock bajo o agotado.  
**RF-A14.** Un producto sin stock no deberá poder agregarse al carrito o deberá marcarse como no disponible.

### 5.5 Ventas y reportes

**RF-A15.** El admin podrá consultar un reporte de ventas por período (día, semana, mes).  
**RF-A16.** El reporte deberá incluir: monto total vendido, cantidad de pedidos y productos más vendidos.  
**RF-A17.** El admin podrá exportar o visualizar los reportes en el panel.

### 5.6 Configuración del negocio

**RF-A18.** El admin podrá editar el nombre del negocio.  
**RF-A19.** El admin podrá editar la dirección, horario de atención, teléfono y número de WhatsApp.  
**RF-A20.** Los cambios de configuración se reflejarán inmediatamente en la tienda pública (sección información del negocio).

---

## 6. Historias de usuario

| ID | Como | Quiero | Para |
|----|------|--------|------|
| HU-01 | Comprador | Ver el catálogo de productos | Saber qué vende la ferretería |
| HU-02 | Comprador | Buscar y filtrar productos | Encontrar rápidamente lo que necesito |
| HU-03 | Comprador | Agregar productos al carrito | Seleccionar lo que quiero comprar |
| HU-04 | Comprador | Modificar cantidades en el carrito | Ajustar mi compra antes de pagar |
| HU-05 | Comprador | Realizar un pedido | Comprar los productos seleccionados |
| HU-06 | Comprador | Contactar por WhatsApp | Hacer consultas o seguir mi pedido |
| HU-07 | Comprador | Ver información del negocio | Conocer la ubicación y horario |
| HU-08 | Comprador | Solicitar un pedido personalizado | Conseguir productos que no están en catálogo |
| HU-09 | Admin | Ingresar al panel de administración | Gestionar la ferretería |
| HU-10 | Admin | Crear, editar y eliminar productos | Mantener el catálogo actualizado |
| HU-11 | Admin | Ver y gestionar pedidos | Atender las compras de los clientes |
| HU-12 | Admin | Controlar el stock | Evitar vender productos sin disponibilidad |
| HU-13 | Admin | Ver reportes de ventas | Conocer el desempeño del negocio |
| HU-14 | Admin | Configurar datos del negocio | Mostrar información correcta a los clientes |

---

## 7. Criterios de aceptación (resumen)

- **Catálogo:** Se listan al menos 1 producto; se puede filtrar por categoría y buscar por nombre.
- **Carrito:** Agregar, editar cantidad y eliminar funciona; el total se recalcula correctamente.
- **Pedido:** Al finalizar compra se genera un número de pedido y se muestra resumen con datos del cliente.
- **WhatsApp:** El enlace abre WhatsApp con el número del negocio y mensaje prellenado opcional.
- **Info del negocio:** Se muestra nombre, dirección, horario y contacto; editable desde admin.
- **Pedido personalizado:** Formulario envía solicitud con datos de contacto y descripción.
- **Panel admin:** Acceso restringido; muestra resumen de pedidos pendientes y bajo stock.
- **CRUD productos:** Alta, modificación, baja y listado de productos funcionan.
- **Gestión pedidos:** Cambio de estados (pendiente → confirmado → entregado / cancelado).
- **Stock:** Producto sin stock no se puede comprar; admin visualiza bajo stock.
- **Reportes:** Se visualizan ventas por período y productos más vendidos.
- **Configuración:** Cambiar datos del negocio se refleja en la tienda pública.

---

## 8. Reglas de negocio

| ID | Regla |
|----|-------|
| RB-01 | Solo un admin puede gestionar productos, pedidos y configuración. |
| RB-02 | Un pedido recién creado queda en estado `pendiente` hasta que el admin lo confirme. |
| RB-03 | El stock se reserva o descuenta al confirmar el pedido (detalle en technical-spec). |
| RB-04 | Un producto con stock 0 se marca como no disponible para la venta. |
| RB-05 | El número de pedido es único y secuencial. |
| RB-06 | Los cambios en configuración del negocio aplican en tiempo real a la tienda pública. |

---

## 9. Requerimientos no funcionales (alto nivel)

- **Disponibilidad:** La tienda pública debe estar disponible 24/7.
- **Usabilidad:** Interfaz intuitiva para compradores sin requerir registro previo para comprar.
- **Seguridad:** El panel de administración requiere autenticación.
- **Rendimiento:** Carga del catálogo en menos de 3 segundos.
- **Escalabilidad:** Soporte para al menos 1,000 productos y 500 pedidos en el MVP.
- **Responsividad:** La tienda pública debe funcionar en dispositivos móviles.

---

## 10. Pendientes para la siguiente fase (Technical Spec)

- Definir stack tecnológico (frontend, backend, base de datos).
- Diseño del modelo de datos (usuarios, productos, pedidos, ítems de pedido, configuración).
- Endpoints de la API y autenticación del admin.
- Flujo de descuento de stock y estados de pedido.
- Integración técnica con WhatsApp (API o enlace directo `wa.me`).
- Despliegue y variables de entorno.
