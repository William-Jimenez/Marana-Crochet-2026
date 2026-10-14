<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Maraña Crochet 2026 - Backend PHP / MySQL / XAMPP</title>
  <style>
    :root {
      --primary: #581c87;
      --primary-light: #7e22ce;
      --bg: #FAF8F5;
      --card: #ffffff;
      --text: #292524;
      --success: #15803d;
      --danger: #b91c1c;
      --border: #e7e5e4;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 2rem 1rem;
      line-height: 1.5;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      background: linear-gradient(135deg, #3b0764, #581c87);
      color: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 10px 25px -5px rgba(88, 28, 135, 0.2);
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.15);
      padding: 0.4rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .badge-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .card h2 {
      margin-top: 0;
      color: var(--primary);
      font-size: 1.25rem;
      border-bottom: 2px solid #f3e8ff;
      padding-bottom: 0.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }
    .stat-box {
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
    }
    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: var(--primary);
    }
    .stat-label {
      font-size: 0.85rem;
      color: #6b21a8;
      text-transform: uppercase;
      font-weight: 600;
    }
    .endpoints-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .endpoint-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      border-bottom: 1px solid var(--border);
      text-decoration: none;
      color: inherit;
      transition: background 0.15s;
    }
    .endpoint-item:hover {
      background: #faf5ff;
    }
    .method {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      margin-right: 0.5rem;
    }
    .method-get { background: #dcfce7; color: #166534; }
    .method-post { background: #dbeafe; color: #1e40af; }
    .method-put { background: #fef3c7; color: #92400e; }
    .btn {
      display: inline-block;
      background: var(--primary);
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: bold;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn:hover {
      background: var(--primary-light);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>🧶 Maraña Crochet 2026</h1>
        <p style="margin: 0; opacity: 0.9;">Servidor Backend PHP & Base de Datos MySQL (XAMPP)</p>
      </div>
      <div>
        <?php
          require_once __DIR__ . '/config/db.php';
          $connected = false;
          $dbStats = ['products' => 0, 'orders' => 0, 'quotes' => 0, 'reviews' => 0];
          try {
              $pdo = getDBConnection();
              $connected = true;
              $dbStats['products'] = (int)$pdo->query("SELECT COUNT(*) FROM productos")->fetchColumn();
              $dbStats['orders']   = (int)$pdo->query("SELECT COUNT(*) FROM pedidos")->fetchColumn();
              $dbStats['quotes']   = (int)$pdo->query("SELECT COUNT(*) FROM cotizaciones")->fetchColumn();
              $dbStats['reviews']  = (int)$pdo->query("SELECT COUNT(*) FROM resenas")->fetchColumn();
          } catch (Exception $e) {}
        ?>
        <div class="badge">
          <span class="badge-dot" style="background: <?= $connected ? '#22c55e' : '#ef4444' ?>;"></span>
          <?= $connected ? 'MySQL Conectado' : 'Sin Conexión MySQL' ?>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>📊 Estado de la Base de Datos (`marana_crochet`)</h2>
      <?php if ($connected): ?>
        <div class="grid">
          <div class="stat-box">
            <div class="stat-number"><?= $dbStats['products'] ?></div>
            <div class="stat-label">Productos</div>
          </div>
          <div class="stat-box">
            <div class="stat-number"><?= $dbStats['orders'] ?></div>
            <div class="stat-label">Pedidos</div>
          </div>
          <div class="stat-box">
            <div class="stat-number"><?= $dbStats['quotes'] ?></div>
            <div class="stat-label">Cotizaciones</div>
          </div>
          <div class="stat-box">
            <div class="stat-number"><?= $dbStats['reviews'] ?></div>
            <div class="stat-label">Reseñas</div>
          </div>
        </div>
        <p style="font-size: 0.9rem; color: #57534e;">
          <strong>Host:</strong> <?= DB_HOST ?>:<?= DB_PORT ?> &nbsp;|&nbsp;
          <strong>Usuario:</strong> <?= DB_USER ?> &nbsp;|&nbsp;
          <strong>Base de Datos:</strong> <?= DB_NAME ?>
        </p>
      <?php else: ?>
        <div style="background: #fee2e2; border: 1px solid #fca5a5; padding: 1rem; border-radius: 0.5rem; color: #991b1b;">
          <strong>Atención:</strong> No se pudo conectar a MySQL. Asegúrate de presionar <strong>"Start"</strong> en el módulo <strong>MySQL</strong> del panel de control de XAMPP.
        </div>
      <?php endif; ?>

      <div style="margin-top: 1.5rem;">
        <a href="setup.php" class="btn">⚡ Ejecutar Instalador / Sembrador de Base de Datos</a>
      </div>
    </div>

    <div class="card">
      <h2>🔌 Endpoints del API REST</h2>
      <ul class="endpoints-list">
        <li>
          <a class="endpoint-item" href="api/status.php" target="_blank">
            <div>
              <span class="method method-get">GET</span>
              <code>/api/status.php</code> - Diagnóstico y salud de conexión MySQL
            </div>
            <span>↗</span>
          </a>
        </li>
        <li>
          <a class="endpoint-item" href="api/products.php" target="_blank">
            <div>
              <span class="method method-get">GET</span>
              <span class="method method-post">POST</span>
              <span class="method method-put">PUT</span>
              <code>/api/products.php</code> - Catálogo de productos e inventario
            </div>
            <span>↗</span>
          </a>
        </li>
        <li>
          <a class="endpoint-item" href="api/orders.php" target="_blank">
            <div>
              <span class="method method-get">GET</span>
              <span class="method method-post">POST</span>
              <span class="method method-put">PUT</span>
              <code>/api/orders.php</code> - Gestión de pedidos y comprobantes
            </div>
            <span>↗</span>
          </a>
        </li>
        <li>
          <a class="endpoint-item" href="api/quotes.php" target="_blank">
            <div>
              <span class="method method-get">GET</span>
              <span class="method method-post">POST</span>
              <span class="method method-put">PUT</span>
              <code>/api/quotes.php</code> - Cotizaciones personalizadas (HU-35)
            </div>
            <span>↗</span>
          </a>
        </li>
        <li>
          <a class="endpoint-item" href="api/reviews.php" target="_blank">
            <div>
              <span class="method method-get">GET</span>
              <span class="method method-post">POST</span>
              <code>/api/reviews.php</code> - Reseñas y calificaciones de clientes
            </div>
            <span>↗</span>
          </a>
        </li>
        <li>
          <a class="endpoint-item" href="api/suppliers.php" target="_blank">
            <div>
              <span class="method method-get">GET</span>
              <span class="method method-post">POST</span>
              <code>/api/suppliers.php</code> - Proveedores de insumos y lanas
            </div>
            <span>↗</span>
          </a>
        </li>
        <li>
          <a class="endpoint-item" href="api/classes.php" target="_blank">
            <div>
              <span class="method method-get">GET</span>
              <span class="method method-put">PUT</span>
              <code>/api/classes.php</code> - Cursos y talleres virtuales
            </div>
            <span>↗</span>
          </a>
        </li>
        <li>
          <a class="endpoint-item" href="api/coupons.php" target="_blank">
            <div>
              <span class="method method-get">GET</span>
              <span class="method method-post">POST</span>
              <code>/api/coupons.php</code> - Cupones de descuento
            </div>
            <span>↗</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</body>
</html>
