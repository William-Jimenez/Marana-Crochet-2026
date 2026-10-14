# 🧶 Maraña Crochet 2026 - Conexión con XAMPP, MySQL y PHP

Esta guía explica paso a paso cómo está configurada y cómo funciona la conexión entre este sitio web, **PHP** y la base de datos **MySQL** en **XAMPP**.

---

## 🚀 Arquitectura de la Conexión

1. **Base de Datos MySQL (XAMPP)**:
   - Nombre de la base de datos: `marana_crochet`
   - Motor: InnoDB / UTF-8 (`utf8mb4_unicode_ci`)
   - Tablas creadas:
     - `usuarios`: Administradores y clientes (Sofía Rodríguez, Valentina Admin).
     - `productos`: Catálogo artesanal, stock, alertas de inventario mínimo, precios e imágenes.
     - `pedidos`: Órdenes de compra, subtotales, descuentos, estados de pago y despacho.
     - `pedido_items`: Detalle de productos comprados en cada orden.
     - `cotizaciones`: Solicitudes de diseño a medida (HU-35).
     - `resenas`: Calificaciones y opiniones de clientes con cálculo automático de promedio de estrellas.
     - `proveedores`: Proveedores de hilos, lanas, vellón y empaques.
     - `clases_virtuales`: Cursos de crochet con progreso modular por lección.
     - `cupones`: Cupones de descuento activos y vencidos.

2. **Backend en PHP (`/backend`)**:
   - Conexión mediante **PDO** (`backend/config/db.php`) con manejo de errores, transacciones y soporte de cabeceras **CORS**.
   - API REST estructurada en formato JSON:
     - `api/status.php`: Comprueba el estado de la conexión a MySQL y cuenta de registros.
     - `api/products.php`: Obtener catálogo, crear productos y actualizar stock en tiempo real.
     - `api/orders.php`: Guardar pedidos, registrar comprobantes de pago y cambiar estados.
     - `api/quotes.php`: Crear y gestionar cotizaciones personalizadas.
     - `api/reviews.php`: Registrar y listar reseñas.
     - `api/suppliers.php`: Gestión de proveedores.
     - `api/classes.php`: Gestión de cursos virtuales y progreso.
     - `api/coupons.php`: Consulta y validación de cupones.
     - `api/auth.php`: Autenticación y registro de usuarios.
   - Panel de control web y diagnóstico interactivo: `backend/index.php`.
   - Script de instalación y sembrador automático: `backend/setup.php`.
   - Script SQL completo: `backend/database.sql`.

3. **Frontend React + Vite (`/src`)**:
   - Servicio API (`src/services/api.ts`): Cliente HTTP tipado en TypeScript.
   - Contexto global (`src/context/AppContext.tsx`): Sincronización automática con MySQL, persistencia bidireccional y funcionamiento resiliente en caso de desconexión.
   - Indicador en tiempo real en el Navbar: Muestra el estado `🟢 MySQL Conectado (XAMPP)` y un modal de diagnóstico detallado.

---

## 🛠️ Cómo Iniciar y Probar la Conexión en 3 Pasos

### Paso 1: Iniciar MySQL en el Panel de XAMPP
1. Abre la aplicación **XAMPP Control Panel**.
2. En la fila **MySQL**, haz clic en el botón **Start**.
3. *(Opcional)* Si vas a servir el backend con Apache, haz clic también en **Start** en **Apache**.

### Paso 2: Inicializar la Base de Datos (Si aún no se ha hecho)
Puedes inicializar la base de datos de cualquiera de estas formas:
- **Opción A (Terminal)**:
  ```powershell
  npm run setup:db
  ```
  *(Crea automáticamente la base de datos `marana_crochet`, todas las tablas y los datos de prueba).*

- **Opción B (phpMyAdmin)**:
  1. Entra a `http://localhost/phpmyadmin` en tu navegador.
  2. Haz clic en la pestaña **Importar** (Import).
  3. Selecciona el archivo `backend/database.sql` y presiona **Importar**.

### Paso 3: Iniciar el Servidor PHP y el Frontend
Abre dos terminales (o dos pestañas de consola):

- **Terminal 1 - Servidor API PHP:**
  ```powershell
  npm run server:php
  ```
  *(Inicia el servidor PHP en `http://127.0.0.1:8000`).*

- **Terminal 2 - Sitio Web React:**
  ```powershell
  npm run dev
  ```
  *(Inicia la aplicación en `http://localhost:3000`).*

---

## 🔍 Comprobación y Visualización en phpMyAdmin

1. Abre tu navegador e ingresa a: **`http://localhost/phpmyadmin`**
2. En la columna izquierda verás la base de datos **`marana_crochet`**.
3. Al hacer clic podrás examinar:
   - Tabla `productos`: Verás los 6 productos iniciales con sus stocks y precios.
   - Tabla `pedidos`: Verás los pedidos demostrativos `MAR-2026-1042` y `MAR-2026-0988`.
   - Cuando hagas una compra en la tienda, verás cómo se inserta la nueva fila en `pedidos` y se descuenta el stock en `productos`.

---

## 🌐 Panel Web de Diagnóstico de la API
Puedes abrir directamente en el navegador:
👉 **`http://localhost:8000/`** (o `http://localhost:8000/index.php`)

Allí encontrarás un panel visual con el estado de la conexión MySQL, número de registros por tabla y enlaces de prueba para cada endpoint del API.
