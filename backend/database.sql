-- Base de Datos para Maraña Crochet (XAMPP / MySQL / PHP)
-- Autor: William Jiménez / Proyecto Maraña Crochet 2026
-- Compatible con MySQL 5.7+, MySQL 8.0+ y MariaDB en XAMPP

CREATE DATABASE IF NOT EXISTS `marana_crochet` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `marana_crochet`;

-- --------------------------------------------------------
-- 1. Tabla: usuarios
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `rol` ENUM('visitor', 'customer', 'admin') NOT NULL DEFAULT 'customer',
  `telefono` VARCHAR(50) DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `ciudad` VARCHAR(100) DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Tabla: productos
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `productos` (
  `id` VARCHAR(50) NOT NULL,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `nombre` VARCHAR(200) NOT NULL,
  `categoria` ENUM('amigurumis', 'prendas', 'accesorios', 'kits_patrones') NOT NULL,
  `precio` DECIMAL(12,2) NOT NULL,
  `precio_original` DECIMAL(12,2) DEFAULT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `min_stock_alert` INT NOT NULL DEFAULT 2,
  `rating` DECIMAL(3,1) NOT NULL DEFAULT 5.0,
  `review_count` INT NOT NULL DEFAULT 0,
  `imagen_url` TEXT NOT NULL,
  `descripcion` TEXT NOT NULL,
  `detalles` TEXT DEFAULT NULL, -- JSON array
  `es_destacado` TINYINT(1) NOT NULL DEFAULT 0,
  `ventas_count` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Tabla: pedidos
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` VARCHAR(50) NOT NULL,
  `usuario_id` VARCHAR(50) DEFAULT NULL,
  `cliente_nombre` VARCHAR(150) NOT NULL,
  `cliente_email` VARCHAR(150) NOT NULL,
  `cliente_telefono` VARCHAR(50) NOT NULL,
  `direccion_envio` VARCHAR(255) NOT NULL,
  `ciudad_envio` VARCHAR(100) NOT NULL,
  `notas_envio` TEXT DEFAULT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  `descuento` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `cupon_codigo` VARCHAR(50) DEFAULT NULL,
  `costo_envio` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(12,2) NOT NULL,
  `metodo_pago` ENUM('transfer', 'cash') NOT NULL DEFAULT 'transfer',
  `estado_pago` ENUM('pending_verification', 'verified', 'rejected') NOT NULL DEFAULT 'pending_verification',
  `estado_pedido` ENUM('pending', 'in_preparation', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  `banco_nombre` VARCHAR(100) DEFAULT NULL,
  `numero_comprobante` VARCHAR(100) DEFAULT NULL,
  `imagen_comprobante` TEXT DEFAULT NULL,
  `fecha_comprobante` DATETIME DEFAULT NULL,
  `motivo_rechazo` TEXT DEFAULT NULL,
  `es_calificado` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Tabla: pedido_items
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedido_items` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `pedido_id` VARCHAR(50) NOT NULL,
  `producto_id` VARCHAR(50) NOT NULL,
  `nombre_producto` VARCHAR(200) NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(12,2) NOT NULL,
  `imagen_url` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_pedido_items` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Tabla: cotizaciones
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cotizaciones` (
  `id` VARCHAR(50) NOT NULL,
  `usuario_id` VARCHAR(50) DEFAULT NULL,
  `cliente_nombre` VARCHAR(150) NOT NULL,
  `cliente_email` VARCHAR(150) NOT NULL,
  `cliente_telefono` VARCHAR(50) NOT NULL,
  `tipo_articulo` VARCHAR(200) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `dimensiones` VARCHAR(100) NOT NULL,
  `colores_preferidos` VARCHAR(200) NOT NULL,
  `imagen_referencia` TEXT DEFAULT NULL,
  `estado` ENUM('pending', 'quoted', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  `precio_cotizado` DECIMAL(12,2) DEFAULT NULL,
  `dias_estimados` INT DEFAULT NULL,
  `nota_admin` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Tabla: resenas
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `resenas` (
  `id` VARCHAR(50) NOT NULL,
  `producto_id` VARCHAR(50) NOT NULL,
  `nombre_producto` VARCHAR(200) NOT NULL,
  `pedido_id` VARCHAR(50) DEFAULT NULL,
  `cliente_nombre` VARCHAR(150) NOT NULL,
  `rating` INT NOT NULL,
  `comentario` TEXT NOT NULL,
  `fecha` VARCHAR(50) NOT NULL,
  `aprobado` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Tabla: proveedores
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `proveedores` (
  `id` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(200) NOT NULL,
  `contacto` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(50) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `categoria` VARCHAR(150) NOT NULL,
  `dias_entrega` INT NOT NULL DEFAULT 3,
  `ultimo_reabastecimiento` DATE DEFAULT NULL,
  `notas` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. Tabla: clases_virtuales
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `clases_virtuales` (
  `id` VARCHAR(50) NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `nivel` VARCHAR(50) NOT NULL,
  `duracion` VARCHAR(50) NOT NULL,
  `lecciones_count` INT NOT NULL DEFAULT 6,
  `instructor` VARCHAR(150) NOT NULL,
  `imagen_url` TEXT NOT NULL,
  `descripcion` TEXT NOT NULL,
  `rating` DECIMAL(3,1) NOT NULL DEFAULT 5.0,
  `estudiantes_count` INT NOT NULL DEFAULT 0,
  `inscrito` TINYINT(1) NOT NULL DEFAULT 0,
  `modulos` TEXT DEFAULT NULL, -- JSON array
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Tabla: cupones
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cupones` (
  `codigo` VARCHAR(50) NOT NULL,
  `descuento_porcentaje` INT NOT NULL,
  `compra_minima` DECIMAL(12,2) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- DATOS INICIALES (SEED DATA)
-- --------------------------------------------------------

-- Usuarios predeterminados (SENA / Demostración)
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `telefono`, `direccion`, `ciudad`) VALUES
('usr-customer-1', 'Sofía Rodríguez', 'sofia.crochet@gmail.com', '123456', 'customer', '+57 315 889 4421', 'Carrera 43A # 18 Sur - 45, Apto 502', 'Medellín, Antioquia'),
('usr-admin-1', 'Valentina (Administradora Maraña)', 'admin@maranacrochet.co', 'admin123', 'admin', '+57 300 123 4567', 'Taller Maraña Calle 10 # 35-12', 'Medellín, Antioquia')
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);

-- Productos del catálogo
INSERT INTO `productos` (`id`, `sku`, `nombre`, `categoria`, `precio`, `precio_original`, `stock`, `min_stock_alert`, `rating`, `review_count`, `imagen_url`, `descripcion`, `detalles`, `es_destacado`, `ventas_count`) VALUES
('prod-1', 'AMI-SPID-01', 'Amigurumi Maraña Arañita Kawaii', 'amigurumis', 45000.00, 52000.00, 6, 2, 4.9, 18, '/src/assets/images/product_amigurumi_spider_1791404966002.jpg', 'La mascota oficial de Maraña Crochet tejida completamente a mano con hilo de algodón mercerizado hipoalergénico. Ojos con detalles bordados y relleno siliconado de alta densidad.', '["Material: 100% hilo de algodon mercerizado","Medidas: 16 cm de alto x 18 cm de ancho","Relleno: Vellon siliconado hipoalergenico antialergico","Cuidado: Lavado suave a mano con agua fria y jabon neutro","Tiempo de confeccion artesanal: 7 horas por pieza"]', 1, 42),
('prod-2', 'PRE-CARD-02', 'Cardigan Granny Violeta & Lavanda', 'prendas', 135000.00, 155000.00, 2, 2, 5.0, 9, '/src/assets/images/product_crochet_cardigan_1791404974680.jpg', 'Cardigan oversize artesanal confeccionado con 36 motivos granny squares únicos en tonos malva, lavanda y lila. Textura suave, peso liviano y botones de madera natural.', '["Composicion: Mezcla de algodon y lana merino ultrasuave","Talla: Unica holgada (se adapta de S a L)","Largo: 62 cm | Ancho de pecho: 58 cm","Terminaciones: Punos y pretina elastica en punto relieve","Fabricacion: 100% a mano por artesanas colombianas"]', 1, 15),
('prod-3', 'ACC-TOTE-03', 'Bolso Tote Bag Floral Maraña', 'accesorios', 68000.00, NULL, 5, 2, 4.8, 14, '/src/assets/images/product_crochet_tote_1791404983608.jpg', 'Bolso tote espacioso y resistente tejido con hilo macramé de algodón. Asas reforzadas de doble lazada capaces de soportar libros, cuadernos y tus proyectos de tejido.', '["Dimensiones: 38 cm de alto x 35 cm de base","Asas: Caida de 28 cm para colgar comodamente al hombro","Forro interno: Lona cruda natural con bolsillo interno","Cierre: Broche imantado metalico discreto"]', 1, 31),
('prod-4', 'AMI-BUNN-04', 'Conejito Amigurumi Lila con Overol', 'amigurumis', 52000.00, NULL, 1, 2, 4.9, 12, '/src/assets/images/hero_crochet_showcase_1791404957378.jpg', 'Tierno conejito de orejas caídas con su propio overol removible tejido en punto garbanzo. Ideal para regalo de nacimiento o coleccionistas de amigurumis.', '["Ojos de seguridad con traba interna antidesprendimiento","Altura aproximada: 24 cm","Incluye mini accesorio zanahoria tejida"]', 0, 28),
('prod-5', 'ACC-BUCK-05', 'Gorro Bucket Hat Pastel Vintage', 'accesorios', 42000.00, NULL, 0, 2, 4.7, 8, '/src/assets/images/product_crochet_cardigan_1791404974680.jpg', 'Gorro pesquero retro con diseño de ondas en degrade lila y crema. Respirable, fresco para el sol y fácilmente plegable para llevar en cualquier bolso.', '["Circunferencia: 56 - 58 cm estandar","Material: 100% Algodon peinado fresco","Borde acampanado con rigidez natural tejida"]', 0, 19),
('prod-6', 'KIT-INIC-06', 'Kit de Iniciación al Crochet Maraña', 'kits_patrones', 59000.00, 70000.00, 8, 2, 5.0, 22, '/src/assets/images/hero_crochet_showcase_1791404957378.jpg', 'El kit perfecto para empezar a tejer hoy mismo. Contiene 3 ovillos de lana premium, 2 ganchillos ergonómicos, marcadores de puntos, aguja lanera y acceso al patrón digital guiado en video.', '["3 ovillos de 100g en colores combinados de la marca","2 ganchillos de aluminio con mango de silicona (3.5mm y 4.0mm)","6 marcadores de punto corazon + cinta metrica retractil","Codigo QR con acceso al curso virtual para principiantes"]', 1, 64)
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);

-- Pedidos demostrativos
INSERT INTO `pedidos` (`id`, `usuario_id`, `cliente_nombre`, `cliente_email`, `cliente_telefono`, `direccion_envio`, `ciudad_envio`, `notas_envio`, `subtotal`, `descuento`, `cupon_codigo`, `costo_envio`, `total`, `metodo_pago`, `estado_pago`, `estado_pedido`, `banco_nombre`, `numero_comprobante`, `imagen_comprobante`, `fecha_comprobante`, `es_calificado`, `created_at`) VALUES
('MAR-2026-1042', 'usr-customer-1', 'Sofía Rodríguez', 'sofia.crochet@gmail.com', '+57 315 889 4421', 'Carrera 43A # 18 Sur - 45, Apto 502', 'Medellín, Antioquia', 'Dejar en portería con vigilancia', 45000.00, 4500.00, 'MARANA10', 8000.00, 48500.00, 'transfer', 'pending_verification', 'pending', 'Nequi', 'NEQ-83749219', '/src/assets/images/hero_crochet_showcase_1791404957378.jpg', '2026-04-06 14:30:00', 0, '2026-04-06 14:20:00'),
('MAR-2026-0988', 'usr-customer-1', 'Sofía Rodríguez', 'sofia.crochet@gmail.com', '+57 315 889 4421', 'Carrera 43A # 18 Sur - 45, Apto 502', 'Medellín, Antioquia', NULL, 68000.00, 0.00, NULL, 8000.00, 76000.00, 'transfer', 'verified', 'delivered', 'Bancolombia', 'BCOL-992144', '/src/assets/images/product_crochet_tote_1791404983608.jpg', '2026-03-24 10:15:00', 0, '2026-03-24 10:00:00')
ON DUPLICATE KEY UPDATE `cliente_nombre`=VALUES(`cliente_nombre`);

-- Items de los pedidos
INSERT INTO `pedido_items` (`pedido_id`, `producto_id`, `nombre_producto`, `cantidad`, `precio_unitario`, `imagen_url`) VALUES
('MAR-2026-1042', 'prod-1', 'Amigurumi Maraña Arañita Kawaii', 1, 45000.00, '/src/assets/images/product_amigurumi_spider_1791404966002.jpg'),
('MAR-2026-0988', 'prod-3', 'Bolso Tote Bag Floral Maraña', 1, 68000.00, '/src/assets/images/product_crochet_tote_1791404983608.jpg');

-- Cotizaciones personalizadas
INSERT INTO `cotizaciones` (`id`, `usuario_id`, `cliente_nombre`, `cliente_email`, `cliente_telefono`, `tipo_articulo`, `descripcion`, `dimensiones`, `colores_preferidos`, `estado`, `created_at`) VALUES
('COT-2026-01', 'usr-customer-1', 'Sofía Rodríguez', 'sofia.crochet@gmail.com', '+57 315 889 4421', 'Amigurumi de Mascota Personalizado', 'Quiero un perrito Schnauzer gris con bigote blanco y collar lila con dije de estrella.', '20 cm de alto aproximado', 'Gris jaspeado, blanco invierno, lila pastel', 'pending', '2026-04-05 11:15:00')
ON DUPLICATE KEY UPDATE `tipo_articulo`=VALUES(`tipo_articulo`);

-- Reseñas de clientes
INSERT INTO `resenas` (`id`, `producto_id`, `nombre_producto`, `pedido_id`, `cliente_nombre`, `rating`, `comentario`, `fecha`, `aprobado`) VALUES
('rev-1', 'prod-1', 'Amigurumi Maraña Arañita Kawaii', 'MAR-2026-0850', 'Mariana Duque', 5, '¡Es la cosita más tierna del mundo! Los ojitos bordados y la textura del algodón son inmejorables. Llegó con un olor delicioso a lavanda.', 'Hace 3 días', 1),
('rev-2', 'prod-2', 'Cardigan Granny Violeta & Lavanda', 'MAR-2026-0812', 'Camila Ospina', 5, 'La calidad del tejido es nivel obra de arte. Se nota que tardaron muchas horas haciéndolo a mano. Muy calientito y los colores son idénticos a la foto.', 'Hace 1 semana', 1)
ON DUPLICATE KEY UPDATE `comentario`=VALUES(`comentario`);

-- Proveedores de insumos
INSERT INTO `proveedores` (`id`, `nombre`, `contacto`, `telefono`, `email`, `categoria`, `dias_entrega`, `ultimo_reabastecimiento`, `notas`) VALUES
('sup-1', 'Hilanderías del Valle S.A.S.', 'Carlos Medina', '+57 312 458 9210', 'pedidos@hilanderiasvalle.co', 'Hilos y Lanas 100% Algodón', 3, '2026-03-28', 'Proveedor principal de ovillos algodón mercerizado calibre 4. Descuento del 10% por bultos de 50 unidades.'),
('sup-2', 'Insumos Craft & Botonería Medellín', 'Gloria Restrepo', '+57 301 784 1123', 'gloria@craftmedellin.com', 'Ojos de Seguridad, Agujas y Relleno Siliconado', 2, '2026-04-01', 'Entrega rápida en moto. Los ojos de seguridad de 10mm y 12mm tienen traba certificada.'),
('sup-3', 'Empaques Biodegradables Ecopack', 'Andrés Morales', '+57 320 994 3318', 'ventas@ecopack.co', 'Cajas kraft, papel seda y stickers de Maraña', 5, '2026-03-15', 'Impresión ecológica con tintas de soja de la marca Maraña.')
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);

-- Clases Virtuales
INSERT INTO `clases_virtuales` (`id`, `titulo`, `nivel`, `duracion`, `lecciones_count`, `instructor`, `imagen_url`, `descripcion`, `rating`, `estudiantes_count`, `inscrito`, `modulos`) VALUES
('class-1', 'Taller Cero a Cien: Domina los Puntos Básicos del Crochet', 'Principiante', '3h 45m', 6, 'Valentina (Creadora Maraña)', '/src/assets/images/hero_crochet_showcase_1791404957378.jpg', 'Aprende desde la tensión correcta del hilo, cadenetas, punto bajo, punto alto y cómo leer diagramas internacionales sin frustrarte.', 4.9, 142, 1, '[{"id":"m1","title":"1. Materiales, calibres y como sostener el ganchillo","duration":"25 min","completed":true},{"id":"m2","title":"2. Nudo corredizo y cadeneta con tension pareja","duration":"35 min","completed":true},{"id":"m3","title":"3. Punto bajo y punto deslizado en muestras planas","duration":"40 min","completed":false},{"id":"m4","title":"4. Punto alto, varetas y aumentos/disminuciones","duration":"45 min","completed":false},{"id":"m5","title":"5. Como rematar y esconder colas de hilo limpiamente","duration":"30 min","completed":false},{"id":"m6","title":"6. Proyecto final: Tu primer posavasos hexagonal","duration":"50 min","completed":false}]'),
('class-2', 'Masterclass: Creación de Amigurumis Sin Costuras Visibles', 'Intermedio', '4h 15m', 8, 'Valentina (Creadora Maraña)', '/src/assets/images/product_amigurumi_spider_1791404966002.jpg', 'Técnicas avanzadas para amigurumis impecables: anillo mágico reforzado, disminución invisible, bordado de expresiones kawaii y cambio de color perfecto.', 5.0, 98, 0, '[{"id":"m21","title":"1. El anillo magico que nunca se abre","duration":"20 min","completed":false},{"id":"m22","title":"2. Disminucion invisible perfecta","duration":"30 min","completed":false},{"id":"m23","title":"3. Tecnicas de relleno ergonomico sin grumos","duration":"35 min","completed":false},{"id":"m24","title":"4. Expresion facial: bordado de ojos y mejillas","duration":"40 min","completed":false},{"id":"m25","title":"5. Montaje de extremidades en una sola pieza","duration":"60 min","completed":false}]')
ON DUPLICATE KEY UPDATE `titulo`=VALUES(`titulo`);

-- Cupones de descuento
INSERT INTO `cupones` (`codigo`, `descuento_porcentaje`, `compra_minima`, `descripcion`, `activo`) VALUES
('MARANA10', 10, 40000.00, '10% de descuento en tu primera compra artesanal', 1),
('LANITA20', 20, 100000.00, '20% especial en pedidos superiores a $100.000 COP', 1),
('EXPIRED15', 15, 30000.00, 'Cupón de temporada navideña (Expirado)', 0)
ON DUPLICATE KEY UPDATE `descuento_porcentaje`=VALUES(`descuento_porcentaje`);
