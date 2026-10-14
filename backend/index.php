<?php
/**
 * Maraña Crochet 2026 - Aplicación Web Completa en PHP & MySQL (XAMPP)
 * 
 * Este archivo es el punto de entrada principal del sitio web cuando se accede
 * a través de Apache en XAMPP: http://localhost/marana-crochet/
 */

header("Content-Type: text/html; charset=UTF-8");
require_once __DIR__ . '/config/db.php';

// Obtener datos iniciales directamente desde MySQL mediante PDO
$dbConnected = false;
$dbError = null;
$products = [];
$orders = [];
$quotes = [];
$reviews = [];
$classes = [];
$suppliers = [];
$coupons = [];

try {
    $pdo = getDBConnection();
    $dbConnected = true;

    // Productos
    $pStmt = $pdo->query("SELECT * FROM productos ORDER BY es_destacado DESC, created_at DESC");
    while ($row = $pStmt->fetch()) {
        $row['detalles'] = !empty($row['detalles']) ? json_decode($row['detalles'], true) : [];
        $products[] = $row;
    }

    // Pedidos con items
    $oStmt = $pdo->query("SELECT * FROM pedidos ORDER BY created_at DESC");
    $ordersRaw = $oStmt->fetchAll();
    $itemsStmt = $pdo->query("SELECT * FROM pedido_items");
    $itemsByOrder = [];
    while ($item = $itemsStmt->fetch()) {
        $itemsByOrder[$item['pedido_id']][] = $item;
    }
    foreach ($ordersRaw as $ord) {
        $ord['items'] = $itemsByOrder[$ord['id']] ?? [];
        $orders[] = $ord;
    }

    // Cotizaciones
    $quotes = $pdo->query("SELECT * FROM cotizaciones ORDER BY created_at DESC")->fetchAll();

    // Reseñas
    $reviews = $pdo->query("SELECT * FROM resenas ORDER BY created_at DESC")->fetchAll();

    // Clases virtuales
    $cStmt = $pdo->query("SELECT * FROM clases_virtuales ORDER BY created_at ASC");
    while ($c = $cStmt->fetch()) {
        $c['modulos'] = !empty($c['modulos']) ? json_decode($c['modulos'], true) : [];
        $classes[] = $c;
    }

    // Proveedores
    $suppliers = $pdo->query("SELECT * FROM proveedores ORDER BY created_at DESC")->fetchAll();

    // Cupones
    $coupons = $pdo->query("SELECT * FROM cupones WHERE activo = 1")->fetchAll();

} catch (Exception $e) {
    $dbConnected = false;
    $dbError = $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maraña Crochet 2026 - Tienda Artesanal en PHP & MySQL</title>
  
  <!-- Tailwind CSS CDN para renderizado instantáneo en Apache -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  <!-- Google Fonts: Playfair Display + Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            serif: ['"Playfair Display"', 'Georgia', 'serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          },
          colors: {
            marana: {
              50: '#FAF8F5',
              100: '#F3EFEA',
              200: '#E8E1D9',
              600: '#7E22CE',
              700: '#6B21A8',
              800: '#581C87',
              900: '#3B0764',
            }
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #FAF8F5; }
    .font-display { font-family: 'Playfair Display', Georgia, serif; }
    .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); }
  </style>
</head>
<body class="text-stone-800 min-h-screen flex flex-col antialiased">

  <!-- ======================================================== -->
  <!-- 1. TOP BANNER RBAC & ESTADO MYSQL (XAMPP)                -->
  <!-- ======================================================== -->
  <div class="bg-marana-900 text-purple-100 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-purple-800">
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>
          Simulador RBAC: Estás como 
          <strong id="roleLabel" class="text-white font-semibold capitalize">Visitante</strong>
        </span>
      </div>

      <!-- Badge de Estado MySQL en XAMPP -->
      <button onclick="openDbModal()" class="px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer <?= $dbConnected ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900' : 'bg-amber-950/80 text-amber-300 border border-amber-500/40 hover:bg-amber-900' ?>">
        <i data-lucide="database" class="w-3 h-3"></i>
        <span class="w-1.5 h-1.5 rounded-full <?= $dbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400' ?>"></span>
        <span><?= $dbConnected ? 'MySQL: Conectado (XAMPP)' : 'MySQL: Desconectado' ?></span>
      </button>
    </div>

    <!-- Selector de Rol Rápido -->
    <div class="flex items-center gap-2 text-[11px]">
      <span class="text-purple-300 hidden sm:inline">Cambiar rol:</span>
      <button onclick="setRole('visitor')" id="btnRoleVisitor" class="px-2 py-0.5 rounded transition bg-purple-700 text-white font-bold">Visitante</button>
      <span class="text-purple-400">/</span>
      <button onclick="setRole('customer')" id="btnRoleCustomer" class="px-2 py-0.5 rounded transition text-purple-200 hover:bg-purple-800">Cliente (Sofía)</button>
      <span class="text-purple-400">/</span>
      <button onclick="setRole('admin')" id="btnRoleAdmin" class="px-2 py-0.5 rounded transition text-purple-200 hover:bg-purple-800">Admin (Valentina)</button>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- 2. NAVBAR PRINCIPAL                                      -->
  <!-- ======================================================== -->
  <header class="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
      
      <!-- Logo y Marca -->
      <div onclick="switchTab('catalog')" class="flex items-center gap-3.5 cursor-pointer group select-none">
        <div class="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500 shadow-sm bg-purple-100 group-hover:scale-105 transition-transform">
          <img src="assets/images/marana_mascot_logo_1791404947945.jpg" alt="Maraña Mascot" class="w-full h-full object-cover">
        </div>
        <div>
          <span class="font-display text-2xl font-bold tracking-tight text-marana-900 flex items-center gap-1.5">
            Maraña Crochet
            <span class="text-[10px] font-sans px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold border border-purple-200">PHP & MySQL</span>
          </span>
          <p class="text-xs text-stone-500 font-medium">Tejido artesanal hecho a mano con amor</p>
        </div>
      </div>

      <!-- Menú de Navegación -->
      <nav class="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-stone-600">
        <button onclick="switchTab('catalog')" id="nav-catalog" class="px-3.5 py-2 rounded-xl transition font-semibold text-purple-900 bg-purple-100/70">
          Catálogo
        </button>
        <button onclick="switchTab('orders')" id="nav-orders" class="px-3.5 py-2 rounded-xl transition hover:text-purple-900 hover:bg-purple-50">
          Mis Pedidos
        </button>
        <button onclick="switchTab('quotes')" id="nav-quotes" class="px-3.5 py-2 rounded-xl transition hover:text-purple-900 hover:bg-purple-50">
          A Medida
        </button>
        <button onclick="switchTab('classes')" id="nav-classes" class="px-3.5 py-2 rounded-xl transition hover:text-purple-900 hover:bg-purple-50">
          Talleres Virtuales
        </button>
        <button onclick="switchTab('admin')" id="nav-admin" class="hidden px-3.5 py-2 rounded-xl font-bold transition text-amber-900 bg-amber-100 border border-amber-300 hover:bg-amber-200">
          <i data-lucide="shield-check" class="w-4 h-4 inline-block mr-1"></i> Panel Admin
        </button>
      </nav>

      <!-- Zona de Acciones (Buscador, Carrito, Usuario) -->
      <div class="flex items-center gap-3">
        <!-- Botón de Cotización Rápida -->
        <button onclick="openQuoteModal()" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-purple-200 hover:border-purple-400 text-purple-900 rounded-xl text-xs font-semibold shadow-xs transition">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 text-purple-600"></i>
          <span>Cotizar a Medida</span>
        </button>

        <!-- Botón del Carrito -->
        <button onclick="openCartDrawer()" class="relative p-2.5 text-stone-700 hover:text-purple-900 hover:bg-purple-50 rounded-xl transition border border-stone-200">
          <i data-lucide="shopping-bag" class="w-5 h-5"></i>
          <span id="cartBadge" class="absolute -top-1.5 -right-1.5 bg-purple-700 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">0</span>
        </button>

        <!-- Botón de Usuario / Autenticación -->
        <button onclick="openAuthModal()" class="flex items-center gap-2 p-2 sm:px-3 sm:py-2 bg-stone-100 hover:bg-purple-100/60 rounded-xl transition border border-stone-200 text-stone-700 text-xs font-semibold">
          <i data-lucide="user" class="w-4 h-4 text-purple-700"></i>
          <span id="navUserLabel" class="hidden sm:inline">Ingresar</span>
        </button>
      </div>

    </div>

    <!-- Menú móvil inferior -->
    <div class="md:hidden flex items-center justify-around border-t border-stone-200 px-2 py-2 bg-[#FAF8F5] text-xs font-medium">
      <button onclick="switchTab('catalog')" class="py-1 px-2.5 rounded-lg text-purple-900 font-bold">Catálogo</button>
      <button onclick="switchTab('orders')" class="py-1 px-2.5 rounded-lg text-stone-600">Pedidos</button>
      <button onclick="switchTab('quotes')" class="py-1 px-2.5 rounded-lg text-stone-600">A Medida</button>
      <button onclick="switchTab('classes')" class="py-1 px-2.5 rounded-lg text-stone-600">Clases</button>
      <button onclick="switchTab('admin')" id="mobileNavAdmin" class="hidden py-1 px-2.5 rounded-lg text-amber-900 font-bold bg-amber-100">Admin</button>
    </div>
  </header>

  <!-- ======================================================== -->
  <!-- 3. CONTENIDO PRINCIPAL POR VISTAS                        -->
  <!-- ======================================================== -->
  <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

    <!-- ---------------------------------------------------- -->
    <!-- VISTA 1: CATÁLOGO Y TIENDA (HOME)                    -->
    <!-- ---------------------------------------------------- -->
    <section id="view-catalog" class="space-y-8">
      <!-- Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white shadow-xl border border-purple-800/50">
        <div class="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img src="assets/images/hero_crochet_showcase_1791404957378.jpg" alt="Crochet Hero" class="w-full h-full object-cover">
        </div>
        <div class="relative z-10 p-8 sm:p-12 max-w-2xl space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/80 border border-purple-600/50 text-purple-200 text-xs font-semibold">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-purple-300"></i>
            <span>Colección Hecha a Mano 2026</span>
          </div>
          <h1 class="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Cada puntada cuenta una historia única.
          </h1>
          <p class="text-sm sm:text-base text-purple-200 font-normal leading-relaxed">
            Amigurumis con alma, cárdigans oversize, totes y accesorios tejidos artesanalmente en Medellín con hilos de algodón mercerizado de primera calidad.
          </p>
          <div class="pt-2 flex flex-wrap gap-3">
            <a href="#productos-grid" class="px-5 py-3 rounded-xl bg-white text-purple-950 font-bold text-xs sm:text-sm hover:bg-purple-50 transition shadow-md">
              Ver Catálogo Completo
            </a>
            <button onclick="openQuoteModal()" class="px-5 py-3 rounded-xl bg-purple-800/70 hover:bg-purple-800 text-white font-semibold text-xs sm:text-sm border border-purple-600/50 transition">
              Pedir Diseño Personalizado
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros de Categoría y Barra de Búsqueda -->
      <div id="productos-grid" class="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-b border-stone-200 pb-5">
        <!-- Categorías -->
        <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button onclick="filterCategory('all')" id="cat-all" class="cat-pill active px-4 py-2 rounded-xl text-xs font-bold bg-purple-900 text-white shadow-xs transition">
            Todos (<?= count($products) ?>)
          </button>
          <button onclick="filterCategory('amigurumis')" id="cat-amigurumis" class="cat-pill px-4 py-2 rounded-xl text-xs font-semibold bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 transition">
            Amigurumis
          </button>
          <button onclick="filterCategory('prendas')" id="cat-prendas" class="cat-pill px-4 py-2 rounded-xl text-xs font-semibold bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 transition">
            Prendas
          </button>
          <button onclick="filterCategory('accesorios')" id="cat-accesorios" class="cat-pill px-4 py-2 rounded-xl text-xs font-semibold bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 transition">
            Accesorios
          </button>
          <button onclick="filterCategory('kits_patrones')" id="cat-kits_patrones" class="cat-pill px-4 py-2 rounded-xl text-xs font-semibold bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 transition">
            Kits & Patrones
          </button>
        </div>

        <!-- Búsqueda y Filtro de Stock -->
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:w-64">
            <input type="text" id="searchInput" oninput="filterProducts()" placeholder="Buscar amigurumi o prenda..." class="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent">
            <i data-lucide="search" class="w-4 h-4 text-stone-400 absolute left-3 top-2.5"></i>
          </div>
          <label class="flex items-center gap-2 text-xs text-stone-600 font-medium cursor-pointer select-none whitespace-nowrap">
            <input type="checkbox" id="stockFilter" onchange="filterProducts()" class="rounded text-purple-700 focus:ring-purple-600">
            <span>Solo en stock</span>
          </label>
        </div>
      </div>

      <!-- Cuadrícula de Productos desde MySQL -->
      <div id="productsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php foreach ($products as $p): ?>
          <div class="product-card group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
               data-id="<?= htmlspecialchars($p['id']) ?>"
               data-category="<?= htmlspecialchars($p['categoria']) ?>"
               data-name="<?= htmlspecialchars(strtolower($p['nombre'])) ?>"
               data-stock="<?= (int)$p['stock'] ?>">
            
            <!-- Imagen del Producto -->
            <div class="relative aspect-square overflow-hidden bg-stone-100">
              <img src="<?= htmlspecialchars($p['imagen_url']) ?>" alt="<?= htmlspecialchars($p['nombre']) ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              
              <!-- Badges Superiores -->
              <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                <?php if ($p['es_destacado']): ?>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">Destacado</span>
                <?php endif; ?>
                <?php if ($p['stock'] == 0): ?>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-900 text-white shadow-xs">Agotado</span>
                <?php elseif ($p['stock'] <= $p['min_stock_alert']): ?>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-xs">¡Solo <?= $p['stock'] ?> en stock!</span>
                <?php endif; ?>
              </div>

              <!-- Botón Vista Rápida -->
              <button onclick="openProductModal('<?= $p['id'] ?>')" class="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-xl text-stone-700 hover:text-purple-900 hover:bg-white shadow-md transition opacity-0 group-hover:opacity-100 cursor-pointer" title="Vista Rápida">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>

            <!-- Información del Producto -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span class="uppercase tracking-wider font-semibold text-[10px] text-purple-700"><?= htmlspecialchars($p['categoria']) ?></span>
                  <div class="flex items-center gap-1 text-amber-500 font-semibold">
                    <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
                    <span><?= number_format($p['rating'], 1) ?></span>
                    <span class="text-stone-400 font-normal">(<?= $p['review_count'] ?>)</span>
                  </div>
                </div>
                <h3 class="font-display font-bold text-base text-stone-900 group-hover:text-purple-900 transition-colors">
                  <?= htmlspecialchars($p['nombre']) ?>
                </h3>
                <p class="text-xs text-stone-500 line-clamp-2 mt-1">
                  <?= htmlspecialchars($p['descripcion']) ?>
                </p>
              </div>

              <div class="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span class="text-lg font-bold text-marana-900">
                    $<?= number_format($p['precio'], 0, ',', '.') ?> COP
                  </span>
                  <?php if (!empty($p['precio_original'])): ?>
                    <span class="text-xs text-stone-400 line-through block">
                      $<?= number_format($p['precio_original'], 0, ',', '.') ?> COP
                    </span>
                  <?php endif; ?>
                </div>

                <?php if ($p['stock'] > 0): ?>
                  <button onclick="addToCart('<?= $p['id'] ?>')" class="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer">
                    <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
                    <span>Añadir</span>
                  </button>
                <?php else: ?>
                  <button disabled class="px-3.5 py-2 bg-stone-200 text-stone-400 rounded-xl text-xs font-semibold cursor-not-allowed">
                    Agotado
                  </button>
                <?php endif; ?>
              </div>
            </div>

          </div>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- ---------------------------------------------------- -->
    <!-- VISTA 2: MIS PEDIDOS (CLIENTE)                       -->
    <!-- ---------------------------------------------------- -->
    <section id="view-orders" class="hidden space-y-6">
      <div class="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h2 class="font-display text-2xl font-bold text-stone-900">Historial de Pedidos</h2>
          <p class="text-xs text-stone-500">Gestiona tus pedidos artesanales y reporta comprobantes de pago</p>
        </div>
        <span class="text-xs px-3 py-1 bg-purple-100 text-purple-900 rounded-full font-semibold">
          <?= count($orders) ?> pedidos registrados
        </span>
      </div>

      <div class="space-y-4">
        <?php if (empty($orders)): ?>
          <div class="p-12 text-center bg-white rounded-2xl border border-stone-200">
            <i data-lucide="package" class="w-12 h-12 text-stone-300 mx-auto mb-3"></i>
            <h3 class="font-bold text-stone-700">Aún no tienes pedidos registrados</h3>
            <p class="text-xs text-stone-500 mt-1">Explora el catálogo y realiza tu primera compra artesanal.</p>
          </div>
        <?php else: ?>
          <?php foreach ($orders as $ord): ?>
            <div class="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <span class="text-xs font-bold font-mono text-purple-900">#<?= htmlspecialchars($ord['id']) ?></span>
                  <span class="text-xs text-stone-400 ml-2"><?= htmlspecialchars($ord['created_at']) ?></span>
                </div>
                <div class="flex items-center gap-2">
                  <!-- Estado Pago -->
                  <?php if ($ord['estado_pago'] === 'verified'): ?>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Pago Aprobado</span>
                  <?php elseif ($ord['estado_pago'] === 'rejected'): ?>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">Comprobante Rechazado</span>
                  <?php else: ?>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">Pago Pendiente</span>
                  <?php endif; ?>

                  <!-- Estado Pedido -->
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 uppercase tracking-wider text-[10px]">
                    <?= htmlspecialchars($ord['estado_pedido']) ?>
                  </span>
                </div>
              </div>

              <!-- Items del pedido -->
              <div class="space-y-2">
                <?php foreach ($ord['items'] as $item): ?>
                  <div class="flex items-center justify-between text-xs py-1">
                    <div class="flex items-center gap-3">
                      <img src="<?= htmlspecialchars($item['imagen_url']) ?>" class="w-10 h-10 rounded-lg object-cover border border-stone-200">
                      <div>
                        <strong class="text-stone-800"><?= htmlspecialchars($item['nombre_producto']) ?></strong>
                        <span class="text-stone-400 block text-[11px]"><?= $item['cantidad'] ?> unidad(es) x $<?= number_format($item['precio_unitario'], 0, ',', '.') ?> COP</span>
                      </div>
                    </div>
                    <span class="font-bold text-stone-900">$<?= number_format($item['cantidad'] * $item['precio_unitario'], 0, ',', '.') ?> COP</span>
                  </div>
                <?php endforeach; ?>
              </div>

              <!-- Total y Botones de Acción -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
                <div>
                  <span class="text-stone-500">Dirección: <strong><?= htmlspecialchars($ord['direccion_envio']) ?>, <?= htmlspecialchars($ord['ciudad_envio']) ?></strong></span>
                  <div class="text-sm font-bold text-purple-950 mt-0.5">Total: $<?= number_format($ord['total'], 0, ',', '.') ?> COP</div>
                </div>

                <div class="flex items-center gap-2">
                  <?php if ($ord['estado_pago'] !== 'verified'): ?>
                    <button onclick="openPaymentProofModal('<?= $ord['id'] ?>')" class="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-semibold flex items-center gap-1.5 transition">
                      <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                      <span>Subir Comprobante</span>
                    </button>
                  <?php endif; ?>

                  <?php if ($ord['estado_pedido'] === 'delivered' && !$ord['es_calificado']): ?>
                    <button onclick="openReviewModal('<?= $ord['id'] ?>', '<?= $ord['items'][0]['producto_id'] ?? 'prod-1' ?>')" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold flex items-center gap-1.5 transition">
                      <i data-lucide="star" class="w-3.5 h-3.5"></i>
                      <span>Calificar Compra</span>
                    </button>
                  <?php endif; ?>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </section>

    <!-- ---------------------------------------------------- -->
    <!-- VISTA 3: COTIZACIONES PERSONALIZADAS (HU-35)         -->
    <!-- ---------------------------------------------------- -->
    <section id="view-quotes" class="hidden space-y-6">
      <div class="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h2 class="font-display text-2xl font-bold text-stone-900">Diseños a Medida (Cotizaciones)</h2>
          <p class="text-xs text-stone-500">Solicita réplicas de tus mascotas o ideas personalizadas en crochet</p>
        </div>
        <button onclick="openQuoteModal()" class="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          <span>Nueva Solicitud</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <?php foreach ($quotes as $q): ?>
          <div class="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-purple-900">#<?= htmlspecialchars($q['id']) ?></span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold 
                <?= $q['estado'] === 'quoted' ? 'bg-blue-100 text-blue-800' : ($q['estado'] === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800') ?>">
                <?= ucfirst($q['estado']) ?>
              </span>
            </div>
            <h4 class="font-bold text-stone-900 text-sm"><?= htmlspecialchars($q['tipo_articulo']) ?></h4>
            <p class="text-xs text-stone-600"><?= htmlspecialchars($q['descripcion']) ?></p>
            <div class="text-[11px] text-stone-500 space-y-0.5 pt-2 border-t border-stone-100">
              <div><strong>Medidas:</strong> <?= htmlspecialchars($q['dimensiones']) ?></div>
              <div><strong>Colores:</strong> <?= htmlspecialchars($q['colores_preferidos']) ?></div>
            </div>

            <?php if (!empty($q['precio_cotizado'])): ?>
              <div class="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-purple-700 block font-semibold">Precio Cotizado por Taller:</span>
                  <strong class="text-purple-950 text-sm">$<?= number_format($q['precio_cotizado'], 0, ',', '.') ?> COP</strong>
                  <span class="text-stone-400 block text-[10px]">Tiempo est.: <?= $q['dias_estimados'] ?> días</span>
                </div>
                <?php if ($q['estado'] === 'quoted'): ?>
                  <button onclick="acceptQuote('<?= $q['id'] ?>')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs">
                    Aceptar y Crear Pedido
                  </button>
                <?php endif; ?>
              </div>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- ---------------------------------------------------- -->
    <!-- VISTA 4: CLASES VIRTUALES                            -->
    <!-- ---------------------------------------------------- -->
    <section id="view-classes" class="hidden space-y-6">
      <div class="border-b border-stone-200 pb-4">
        <h2 class="font-display text-2xl font-bold text-stone-900">Talleres Virtuales de Crochet</h2>
        <p class="text-xs text-stone-500">Aprende técnicas paso a paso dictadas por la artesana creadora de Maraña</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <?php foreach ($classes as $cls): ?>
          <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col">
            <div class="relative h-48 bg-stone-100">
              <img src="<?= htmlspecialchars($cls['imagen_url']) ?>" class="w-full h-full object-cover">
              <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-900 text-white">
                <?= htmlspecialchars($cls['nivel']) ?>
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 class="font-display font-bold text-lg text-stone-900"><?= htmlspecialchars($cls['titulo']) ?></h3>
                <p class="text-xs text-stone-500 mt-1"><?= htmlspecialchars($cls['descripcion']) ?></p>
                <div class="flex items-center gap-4 text-xs text-stone-400 mt-2 font-medium">
                  <span>Instructor: <strong class="text-stone-700"><?= htmlspecialchars($cls['instructor']) ?></strong></span>
                  <span>Duración: <?= htmlspecialchars($cls['duracion']) ?></span>
                </div>
              </div>

              <!-- Módulos de la clase -->
              <div class="border-t border-stone-100 pt-3 space-y-1.5">
                <span class="text-[11px] font-bold text-stone-700 block mb-1">Temario de Lecciones:</span>
                <?php foreach ($cls['modulos'] as $m): ?>
                  <div class="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50">
                    <span class="text-stone-700"><?= htmlspecialchars($m['title']) ?></span>
                    <span class="text-[10px] font-semibold text-purple-700"><?= htmlspecialchars($m['duration']) ?></span>
                  </div>
                <?php endforeach; ?>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- ---------------------------------------------------- -->
    <!-- VISTA 5: PANEL ADMINISTRATIVO (ADMIN DASHBOARD)      -->
    <!-- ---------------------------------------------------- -->
    <section id="view-admin" class="hidden space-y-6">
      <div class="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-purple-300">Panel de Control Maraña</span>
          <h2 class="font-display text-2xl font-bold">Gestión de Inventario & Pedidos</h2>
          <p class="text-xs text-purple-200">Base de datos activa en XAMPP: <code class="font-mono bg-purple-950 px-2 py-0.5 rounded text-white font-bold">marana_crochet</code></p>
        </div>
        <button onclick="openAddProductModal()" class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Nuevo Producto</span>
        </button>
      </div>

      <!-- Tabla de Gestión de Inventario en MySQL -->
      <div class="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <h3 class="font-bold text-sm text-stone-900">Control de Stock e Inventario en Tiempo Real</h3>
          <span class="text-xs text-stone-500"><?= count($products) ?> productos en catálogo</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-stone-100 text-stone-600 uppercase font-semibold text-[10px]">
              <tr>
                <th class="p-3">Producto</th>
                <th class="p-3">SKU</th>
                <th class="p-3">Precio</th>
                <th class="p-3 text-center">Stock Actual</th>
                <th class="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-200">
              <?php foreach ($products as $p): ?>
                <tr class="hover:bg-purple-50/40">
                  <td class="p-3 font-medium text-stone-900 flex items-center gap-2.5">
                    <img src="<?= htmlspecialchars($p['imagen_url']) ?>" class="w-8 h-8 rounded-lg object-cover">
                    <?= htmlspecialchars($p['nombre']) ?>
                  </td>
                  <td class="p-3 font-mono text-stone-500"><?= htmlspecialchars($p['sku']) ?></td>
                  <td class="p-3 font-bold text-purple-950">$<?= number_format($p['precio'], 0, ',', '.') ?> COP</td>
                  <td class="p-3 text-center">
                    <span class="px-2 py-0.5 rounded-full font-bold text-[11px] <?= $p['stock'] == 0 ? 'bg-red-100 text-red-800' : ($p['stock'] <= 2 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800') ?>">
                      <?= $p['stock'] ?> uds
                    </span>
                  </td>
                  <td class="p-3 text-right space-x-1">
                    <button onclick="quickUpdateStock('<?= $p['id'] ?>', <?= $p['stock'] + 1 ?>)" class="p-1 px-2 bg-stone-100 hover:bg-stone-200 rounded font-bold text-stone-700" title="Aumentar Stock">+1</button>
                    <button onclick="quickUpdateStock('<?= $p['id'] ?>', Math.max(0, <?= $p['stock'] - 1 ?>))" class="p-1 px-2 bg-stone-100 hover:bg-stone-200 rounded font-bold text-stone-700" title="Disminuir Stock">-1</button>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabla de Pedidos en Espera de Verificación -->
      <div class="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-stone-200 bg-stone-50">
          <h3 class="font-bold text-sm text-stone-900">Verificación de Comprobantes de Pago</h3>
        </div>
        <div class="divide-y divide-stone-200 text-xs">
          <?php foreach ($orders as $ord): ?>
            <div class="p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span class="font-mono font-bold text-purple-900">#<?= htmlspecialchars($ord['id']) ?></span>
                <span class="text-stone-500 ml-2">Cliente: <strong><?= htmlspecialchars($ord['cliente_nombre']) ?></strong></span>
                <div class="text-[11px] text-stone-400 mt-0.5">Banco: <?= htmlspecialchars($ord['banco_nombre'] ?? 'N/A') ?> | Recibo: <?= htmlspecialchars($ord['numero_comprobante'] ?? 'N/A') ?></div>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-purple-950 text-sm">$<?= number_format($ord['total'], 0, ',', '.') ?> COP</span>
                <?php if ($ord['estado_pago'] !== 'verified'): ?>
                  <button onclick="adminVerifyPayment('<?= $ord['id'] ?>')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs">Aprobar Pago</button>
                  <button onclick="adminRejectPayment('<?= $ord['id'] ?>')" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs">Rechazar</button>
                <?php else: ?>
                  <span class="text-emerald-700 font-bold">Verificado ✓</span>
                <?php endif; ?>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </section>

  </main>

  <!-- ======================================================== -->
  <!-- 4. MODALES GLOBALES INTERACTIVOS                         -->
  <!-- ======================================================== -->

  <!-- Drawer del Carrito de Compras -->
  <div id="cartDrawer" class="fixed inset-0 z-50 overflow-hidden pointer-events-none transition-opacity duration-300 opacity-0">
    <div onclick="closeCartDrawer()" class="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"></div>
    <div class="absolute inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 translate-x-full" id="cartDrawerPanel">
        
        <div class="p-5 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="shopping-bag" class="w-5 h-5 text-purple-700"></i>
            <h3 class="font-display font-bold text-lg text-purple-950">Carrito Artesanal</h3>
          </div>
          <button onclick="closeCartDrawer()" class="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <div id="cartItemsList" class="flex-1 overflow-y-auto p-5 space-y-4 text-xs divide-y divide-stone-100">
          <!-- Renderizado dinámicamente con JavaScript -->
        </div>

        <div class="p-5 border-t border-stone-200 bg-[#FAF8F5] space-y-3 text-xs">
          <div class="flex items-center justify-between text-stone-600">
            <span>Subtotal:</span>
            <span id="cartSubtotalLabel" class="font-bold text-stone-900">$0 COP</span>
          </div>
          <div class="flex items-center justify-between text-stone-600">
            <span>Envío:</span>
            <span id="cartShippingLabel" class="font-bold text-stone-900">$8.000 COP</span>
          </div>
          <div class="flex items-center justify-between text-base font-bold text-purple-950 pt-2 border-t border-stone-200">
            <span>Total:</span>
            <span id="cartTotalLabel">$0 COP</span>
          </div>
          <button onclick="openCheckoutModal()" class="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer">
            Finalizar Compra
          </button>
        </div>

      </div>
    </div>
  </div>

  <!-- Modal de Finalizar Compra (Checkout) -->
  <div id="checkoutModal" class="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs hidden items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-stone-800 animate-in fade-in zoom-in-95 duration-150">
      <div class="flex items-center justify-between pb-3 border-b border-stone-200">
        <h3 class="font-display font-bold text-lg text-purple-950">Confirmar Pedido Artesanal</h3>
        <button onclick="closeCheckoutModal()" class="p-1 text-stone-400 hover:text-stone-700 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="checkoutForm" onsubmit="submitOrder(event)" class="py-4 space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-stone-700 mb-1">Nombre Completo *</label>
          <input type="text" id="chkName" required value="Sofía Rodríguez" class="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-stone-700 mb-1">Correo Electrónico *</label>
            <input type="email" id="chkEmail" required value="sofia.crochet@gmail.com" class="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none">
          </div>
          <div>
            <label class="block font-semibold text-stone-700 mb-1">Teléfono / WhatsApp *</label>
            <input type="tel" id="chkPhone" required value="+57 315 889 4421" class="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none">
          </div>
        </div>
        <div>
          <label class="block font-semibold text-stone-700 mb-1">Dirección de Entrega *</label>
          <input type="text" id="chkAddress" required value="Carrera 43A # 18 Sur - 45, Apto 502" class="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none">
        </div>
        <div>
          <label class="block font-semibold text-stone-700 mb-1">Ciudad *</label>
          <input type="text" id="chkCity" required value="Medellín, Antioquia" class="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none">
        </div>
        <div>
          <label class="block font-semibold text-stone-700 mb-1">Método de Pago</label>
          <select id="chkPaymentMethod" class="w-full p-2.5 border border-stone-300 rounded-xl bg-white font-medium">
            <option value="transfer">Transferencia Bancaria (Nequi / Bancolombia / Daviplata)</option>
            <option value="cash">Pago Contraentrega (Solo Medellín)</option>
          </select>
        </div>

        <div class="pt-3 border-t border-stone-200 flex justify-end gap-2">
          <button type="button" onclick="closeCheckoutModal()" class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium">Cancelar</button>
          <button type="submit" class="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold shadow-sm">Confirmar y Guardar en MySQL</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal de Diagnóstico MySQL (XAMPP) -->
  <div id="dbModal" class="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs hidden items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-800 animate-in fade-in zoom-in-95 duration-150">
      <div class="flex items-center justify-between pb-3 border-b border-stone-200">
        <div class="flex items-center gap-2.5">
          <div class="p-2 bg-purple-100 text-purple-700 rounded-xl">
            <i data-lucide="database" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-bold text-stone-900">Conexión MySQL en XAMPP</h3>
            <p class="text-xs text-stone-500">Base de datos: <code class="text-purple-700 font-mono">marana_crochet</code></p>
          </div>
        </div>
        <button onclick="closeDbModal()" class="p-1 text-stone-400 hover:text-stone-700 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="py-4 space-y-3 text-xs">
        <div class="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
          <span class="font-medium text-stone-600">Estado del Servicio:</span>
          <span class="font-bold flex items-center gap-1.5 <?= $dbConnected ? 'text-emerald-700' : 'text-red-700' ?>">
            <span class="w-2.5 h-2.5 rounded-full <?= $dbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500' ?>"></span>
            <?= $dbConnected ? 'En línea (XAMPP MySQL)' : 'Error de Conexión' ?>
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 text-stone-600">
          <div class="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
            <span class="text-[10px] text-purple-700 font-semibold block">Productos en BD:</span>
            <strong class="text-purple-950 text-sm"><?= count($products) ?> registrados</strong>
          </div>
          <div class="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
            <span class="text-[10px] text-purple-700 font-semibold block">Pedidos en BD:</span>
            <strong class="text-purple-950 text-sm"><?= count($orders) ?> órdenes</strong>
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-stone-200 flex justify-end gap-2">
        <a href="setup.php" class="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium text-xs">Re-sembrar BD</a>
        <button onclick="location.reload()" class="py-2 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs">Actualizar</button>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
      <p class="font-bold text-stone-200">🧶 Maraña Crochet 2026 - Conectado con MySQL en XAMPP</p>
      <p>Desarrollado para demostración y evaluación SENA | PHP 8.2 + MySQL InnoDB</p>
    </div>
  </footer>

  <!-- ======================================================== -->
  <!-- 5. LÓGICA JAVASCRIPT DE INTERACTIVIDAD                    -->
  <!-- ======================================================== -->
  <script>
    // Inicializar íconos de Lucide
    lucide.createIcons();

    // Estado del Rol RBAC
    let currentRole = 'visitor';

    function setRole(role) {
      currentRole = role;
      document.getElementById('roleLabel').innerText = role === 'admin' ? 'Administrador' : (role === 'customer' ? 'Cliente' : 'Visitante');
      document.getElementById('navUserLabel').innerText = role === 'admin' ? 'Valentina (Admin)' : (role === 'customer' ? 'Sofía R.' : 'Ingresar');

      // Botones de estilo
      ['visitor', 'customer', 'admin'].forEach(r => {
        const btn = document.getElementById('btnRole' + r.charAt(0).toUpperCase() + r.slice(1));
        if (r === role) {
          btn.className = 'px-2 py-0.5 rounded transition bg-purple-700 text-white font-bold';
        } else {
          btn.className = 'px-2 py-0.5 rounded transition text-purple-200 hover:bg-purple-800';
        }
      });

      // Visibilidad del tab Admin
      const navAdmin = document.getElementById('nav-admin');
      const mobileNavAdmin = document.getElementById('mobileNavAdmin');
      if (role === 'admin') {
        navAdmin.classList.remove('hidden');
        mobileNavAdmin.classList.remove('hidden');
        switchTab('admin');
      } else {
        navAdmin.classList.add('hidden');
        mobileNavAdmin.classList.add('hidden');
        if (activeTab === 'admin') switchTab('catalog');
      }
    }

    // Navegación por pestañas
    let activeTab = 'catalog';
    function switchTab(tab) {
      activeTab = tab;
      ['catalog', 'orders', 'quotes', 'classes', 'admin'].forEach(t => {
        const view = document.getElementById('view-' + t);
        const nav = document.getElementById('nav-' + t);
        if (view) view.classList.toggle('hidden', t !== tab);
        if (nav && t !== 'admin') {
          if (t === tab) {
            nav.className = 'px-3.5 py-2 rounded-xl transition font-semibold text-purple-900 bg-purple-100/70';
          } else {
            nav.className = 'px-3.5 py-2 rounded-xl transition hover:text-purple-900 hover:bg-purple-50';
          }
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Filtros de Catálogo
    function filterCategory(cat) {
      document.querySelectorAll('.cat-pill').forEach(p => {
        p.className = 'cat-pill px-4 py-2 rounded-xl text-xs font-semibold bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 transition';
      });
      document.getElementById('cat-' + cat).className = 'cat-pill px-4 py-2 rounded-xl text-xs font-bold bg-purple-900 text-white shadow-xs transition';
      
      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => {
        const matches = (cat === 'all' || card.dataset.category === cat);
        card.style.display = matches ? 'flex' : 'none';
      });
    }

    function filterProducts() {
      const q = document.getElementById('searchInput').value.toLowerCase();
      const onlyStock = document.getElementById('stockFilter').checked;

      document.querySelectorAll('.product-card').forEach(card => {
        const name = card.dataset.name;
        const stock = parseInt(card.dataset.stock);
        const matchesQuery = name.includes(q);
        const matchesStock = !onlyStock || stock > 0;

        card.style.display = (matchesQuery && matchesStock) ? 'flex' : 'none';
      });
    }

    // Carrito de compras en LocalStorage
    let cart = JSON.parse(localStorage.getItem('marana_cart') || '[]');
    updateCartUI();

    function addToCart(productId) {
      const existing = cart.find(i => i.id === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id: productId, quantity: 1 });
      }
      localStorage.setItem('marana_cart', JSON.stringify(cart));
      updateCartUI();
      openCartDrawer();
    }

    function updateCartUI() {
      const count = cart.reduce((sum, i) => sum + i.quantity, 0);
      document.getElementById('cartBadge').innerText = count;

      // Calcular precios y renderizar lista
      const list = document.getElementById('cartItemsList');
      if (cart.length === 0) {
        list.innerHTML = '<div class="text-center py-12 text-stone-400"><i data-lucide="shopping-bag" class="w-8 h-8 mx-auto mb-2"></i>Tu carrito está vacío</div>';
        document.getElementById('cartSubtotalLabel').innerText = '$0 COP';
        document.getElementById('cartTotalLabel').innerText = '$0 COP';
        lucide.createIcons();
        return;
      }

      list.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between py-2">
          <div>
            <strong class="text-stone-800">Producto #${item.id}</strong>
            <span class="text-stone-400 block">${item.quantity} ud(s)</span>
          </div>
          <button onclick="removeFromCart('${item.id}')" class="text-rose-500 hover:text-rose-700 font-bold">Eliminar</button>
        </div>
      `).join('');
      
      document.getElementById('cartSubtotalLabel').innerText = '$' + (count * 45000).toLocaleString('es-CO') + ' COP';
      document.getElementById('cartTotalLabel').innerText = '$' + (count * 45000 + 8000).toLocaleString('es-CO') + ' COP';
      lucide.createIcons();
    }

    function removeFromCart(id) {
      cart = cart.filter(i => i.id !== id);
      localStorage.setItem('marana_cart', JSON.stringify(cart));
      updateCartUI();
    }

    function openCartDrawer() {
      const drawer = document.getElementById('cartDrawer');
      const panel = document.getElementById('cartDrawerPanel');
      drawer.classList.remove('opacity-0', 'pointer-events-none');
      panel.classList.remove('translate-x-full');
    }

    function closeCartDrawer() {
      const drawer = document.getElementById('cartDrawer');
      const panel = document.getElementById('cartDrawerPanel');
      drawer.classList.add('opacity-0', 'pointer-events-none');
      panel.classList.add('translate-x-full');
    }

    // Modal Checkout
    function openCheckoutModal() {
      closeCartDrawer();
      document.getElementById('checkoutModal').classList.remove('hidden');
      document.getElementById('checkoutModal').classList.add('flex');
    }

    function closeCheckoutModal() {
      document.getElementById('checkoutModal').classList.add('hidden');
      document.getElementById('checkoutModal').classList.remove('flex');
    }

    async function submitOrder(e) {
      e.preventDefault();
      const orderData = {
        customerName: document.getElementById('chkName').value,
        customerEmail: document.getElementById('chkEmail').value,
        customerPhone: document.getElementById('chkPhone').value,
        shippingAddress: {
          address: document.getElementById('chkAddress').value,
          city: document.getElementById('chkCity').value,
        },
        paymentMethod: document.getElementById('chkPaymentMethod').value,
        items: cart.map(i => ({ productId: i.id, name: 'Producto Artesanal ' + i.id, quantity: i.quantity, unitPrice: 45000 })),
        subtotal: cart.length * 45000,
        shippingCost: 8000,
        total: cart.length * 45000 + 8000
      };

      try {
        const res = await fetch('api/orders.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        const result = await res.json();
        if (result.success) {
          alert('¡Pedido guardado con éxito en MySQL (XAMPP)! Código: ' + (result.orderId || 'OK'));
          cart = [];
          localStorage.removeItem('marana_cart');
          closeCheckoutModal();
          location.reload();
        } else {
          alert('Error: ' + result.error);
        }
      } catch (err) {
        alert('Error conectando con MySQL: ' + err.message);
      }
    }

    // Modal Diagnóstico DB
    function openDbModal() {
      document.getElementById('dbModal').classList.remove('hidden');
      document.getElementById('dbModal').classList.add('flex');
    }
    function closeDbModal() {
      document.getElementById('dbModal').classList.add('hidden');
      document.getElementById('dbModal').classList.remove('flex');
    }

    // Modales y Acciones Admin
    async function quickUpdateStock(id, newStock) {
      try {
        const res = await fetch('api/products.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update_stock', id, stock: newStock })
        });
        const r = await res.json();
        if (r.success) {
          location.reload();
        }
      } catch (e) {
        alert('Error al actualizar stock en MySQL');
      }
    }

    async function adminVerifyPayment(orderId) {
      if (!confirm('¿Aprobar el pago de la orden #' + orderId + '?')) return;
      try {
        const res = await fetch('api/orders.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verify_payment', orderId })
        });
        location.reload();
      } catch (e) {}
    }

    async function adminRejectPayment(orderId) {
      const reason = prompt('Motivo del rechazo:', 'Comprobante ilegible');
      if (!reason) return;
      try {
        const res = await fetch('api/orders.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'reject_payment', orderId, reason })
        });
        location.reload();
      } catch (e) {}
    }

    function openQuoteModal() {
      const item = prompt('¿Qué te gustaría cotizar?', 'Amigurumi personalizado de mi perrito');
      if (!item) return;
      fetch('api/quotes.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: 'Sofía Rodríguez', itemType: item, description: 'Diseño a medida en algodón', dimensions: '20 cm' })
      }).then(() => {
        alert('¡Cotización enviada y guardada en MySQL!');
        location.reload();
      });
    }

    function openPaymentProofModal(orderId) {
      const ref = prompt('Número de comprobante Nequi/Bancolombia:', 'NEQ-' + Math.floor(Math.random() * 900000));
      if (!ref) return;
      fetch('api/orders.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_proof', orderId, proof: { bankName: 'Nequi', receiptNumber: ref } })
      }).then(() => {
        alert('Comprobante registrado en MySQL con éxito');
        location.reload();
      });
    }

    function openReviewModal(orderId, prodId) {
      const comment = prompt('Deja tu comentario sobre el producto:', '¡Excelente calidad y muy suave!');
      if (!comment) return;
      fetch('api/reviews.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: prodId, orderId, rating: 5, comment })
      }).then(() => {
        alert('¡Reseña guardada en MySQL!');
        location.reload();
      });
    }

    function openAddProductModal() {
      const name = prompt('Nombre del nuevo producto:', 'Mini Amigurumi Gatito');
      if (!name) return;
      const price = prompt('Precio (COP):', '35000');
      if (!price) return;
      fetch('api/products.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category: 'amigurumis',
          price: parseFloat(price),
          stock: 5,
          imageUrl: 'assets/images/product_amigurumi_spider_1791404966002.jpg',
          description: 'Tejido artesanal hecho a mano con hilo de algodón mercerizado.'
        })
      }).then(() => {
        alert('¡Producto creado en MySQL!');
        location.reload();
      });
    }

    function openAuthModal() {
      const choice = prompt('Selecciona cómo deseas ingresar:\n1. Cliente Verificado (Sofía Rodríguez)\n2. Administrador (Valentina)\nEscribe 1 o 2:', '1');
      if (choice === '1') setRole('customer');
      if (choice === '2') setRole('admin');
    }

    function openProductModal(id) {
      const card = document.querySelector(`.product-card[data-id="${id}"]`);
      if (!card) return;
      const name = card.querySelector('h3').innerText;
      const desc = card.querySelector('p').innerText;
      alert(`🧶 Vista Rápida de Producto:\n\n${name}\n\n${desc}\n\n¡Tejido 100% a mano con hilo de algodón mercerizado hipoalergénico!`);
    }
  </script>
</body>
</html>
