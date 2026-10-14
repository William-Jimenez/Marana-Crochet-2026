<?php
/**
 * Maraña Crochet - API de Productos
 * GET /api/products.php
 * POST /api/products.php (Crear producto)
 * PUT /api/products.php (Actualizar producto o stock)
 */

require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function formatProductRow($row) {
    return [
        'id'            => $row['id'],
        'sku'           => $row['sku'],
        'name'          => $row['nombre'],
        'category'      => $row['categoria'],
        'price'         => (float)$row['precio'],
        'originalPrice' => $row['precio_original'] !== null ? (float)$row['precio_original'] : null,
        'stock'         => (int)$row['stock'],
        'minStockAlert' => (int)$row['min_stock_alert'],
        'rating'        => (float)$row['rating'],
        'reviewCount'   => (int)$row['review_count'],
        'imageUrl'      => $row['imagen_url'],
        'description'   => $row['descripcion'],
        'details'       => !empty($row['detalles']) ? json_decode($row['detalles'], true) : [],
        'isFeatured'    => (bool)$row['es_destacado'],
        'salesCount'    => (int)$row['ventas_count']
    ];
}

// -------------------------------------------------------------
// GET: Listar productos
// -------------------------------------------------------------
if ($method === 'GET') {
    $category = $_GET['category'] ?? null;
    $onlyInStock = isset($_GET['in_stock']) && $_GET['in_stock'] === 'true';

    $sql = "SELECT * FROM productos WHERE 1=1";
    $params = [];

    if ($category && $category !== 'all') {
        $sql .= " AND categoria = :category";
        $params[':category'] = $category;
    }

    if ($onlyInStock) {
        $sql .= " AND stock > 0";
    }

    $sql .= " ORDER BY es_destacado DESC, created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $products = array_map('formatProductRow', $rows);
    sendJsonResponse(['success' => true, 'data' => $products]);
}

// -------------------------------------------------------------
// POST: Crear nuevo producto (Admin)
// -------------------------------------------------------------
if ($method === 'POST') {
    $data = getRequestBody();

    if (empty($data['name']) || empty($data['price']) || empty($data['category'])) {
        sendJsonResponse(['success' => false, 'error' => 'Faltan campos obligatorios: name, price, category'], 400);
    }

    $id = !empty($data['id']) ? $data['id'] : ('prod-' . round(microtime(true) * 1000));
    $sku = !empty($data['sku']) ? $data['sku'] : ('SKU-' . strtoupper(substr(uniqid(), -6)));
    $detallesJson = !empty($data['details']) ? json_encode($data['details'], JSON_UNESCAPED_UNICODE) : '[]';

    $sql = "INSERT INTO productos (id, sku, nombre, categoria, precio, precio_original, stock, min_stock_alert, rating, review_count, imagen_url, descripcion, detalles, es_destacado, ventas_count)
            VALUES (:id, :sku, :nombre, :categoria, :precio, :precio_original, :stock, :min_stock_alert, :rating, :review_count, :imagen_url, :descripcion, :detalles, :es_destacado, :ventas_count)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id'              => $id,
        ':sku'             => $sku,
        ':nombre'          => $data['name'],
        ':categoria'       => $data['category'],
        ':precio'          => (float)$data['price'],
        ':precio_original' => !empty($data['originalPrice']) ? (float)$data['originalPrice'] : null,
        ':stock'           => isset($data['stock']) ? (int)$data['stock'] : 0,
        ':min_stock_alert' => isset($data['minStockAlert']) ? (int)$data['minStockAlert'] : 2,
        ':rating'          => 5.0,
        ':review_count'    => 0,
        ':imagen_url'      => $data['imageUrl'] ?? '',
        ':descripcion'     => $data['description'] ?? '',
        ':detalles'        => $detallesJson,
        ':es_destacado'    => !empty($data['isFeatured']) ? 1 : 0,
        ':ventas_count'    => 0
    ]);

    sendJsonResponse([
        'success' => true,
        'message' => 'Producto creado con éxito en MySQL',
        'data'    => array_merge($data, ['id' => $id, 'sku' => $sku])
    ], 201);
}

// -------------------------------------------------------------
// PUT: Actualizar producto o stock
// -------------------------------------------------------------
if ($method === 'PUT') {
    $data = getRequestBody();
    $action = $data['action'] ?? 'update_all';

    if ($action === 'update_stock') {
        if (!isset($data['id']) || !isset($data['stock'])) {
            sendJsonResponse(['success' => false, 'error' => 'Faltan parámetros id y stock'], 400);
        }

        $stmt = $pdo->prepare("UPDATE productos SET stock = :stock WHERE id = :id");
        $stmt->execute([':stock' => max(0, (int)$data['stock']), ':id' => $data['id']]);

        sendJsonResponse(['success' => true, 'message' => 'Stock actualizado en base de datos']);
    }

    // Actualización completa de producto
    if (empty($data['id'])) {
        sendJsonResponse(['success' => false, 'error' => 'ID de producto no especificado'], 400);
    }

    $detallesJson = isset($data['details']) ? json_encode($data['details'], JSON_UNESCAPED_UNICODE) : null;

    $sql = "UPDATE productos SET 
                nombre = :nombre,
                categoria = :categoria,
                precio = :precio,
                precio_original = :precio_original,
                stock = :stock,
                min_stock_alert = :min_stock_alert,
                imagen_url = :imagen_url,
                descripcion = :descripcion,
                es_destacado = :es_destacado" .
                ($detallesJson !== null ? ", detalles = :detalles" : "") .
            " WHERE id = :id";

    $params = [
        ':nombre'          => $data['name'],
        ':categoria'       => $data['category'],
        ':precio'          => (float)$data['price'],
        ':precio_original' => !empty($data['originalPrice']) ? (float)$data['originalPrice'] : null,
        ':stock'           => (int)$data['stock'],
        ':min_stock_alert' => (int)($data['minStockAlert'] ?? 2),
        ':imagen_url'      => $data['imageUrl'] ?? '',
        ':descripcion'     => $data['description'] ?? '',
        ':es_destacado'    => !empty($data['isFeatured']) ? 1 : 0,
        ':id'              => $data['id']
    ];

    if ($detallesJson !== null) {
        $params[':detalles'] = $detallesJson;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    sendJsonResponse(['success' => true, 'message' => 'Producto actualizado en MySQL']);
}

sendJsonResponse(['error' => 'Método no soportado'], 405);
