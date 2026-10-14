<?php
/**
 * Maraña Crochet - API de Cupones de Descuento
 * GET /api/coupons.php (Listar cupones activos)
 * POST /api/coupons.php (Validar cupón)
 */

require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function formatCouponRow($row) {
    return [
        'code'            => $row['codigo'],
        'discountPercent' => (int)$row['descuento_porcentaje'],
        'minPurchase'     => (float)$row['compra_minima'],
        'description'     => $row['descripcion'],
        'isActive'        => (bool)$row['activo']
    ];
}

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM cupones");
    $coupons = array_map('formatCouponRow', $stmt->fetchAll());
    sendJsonResponse(['success' => true, 'data' => $coupons]);
}

if ($method === 'POST') {
    $data = getRequestBody();
    $code = strtoupper(trim($data['code'] ?? ''));

    $stmt = $pdo->prepare("SELECT * FROM cupones WHERE UPPER(codigo) = :code");
    $stmt->execute([':code' => $code]);
    $row = $stmt->fetch();

    if (!$row) {
        sendJsonResponse(['success' => false, 'error' => 'El cupón ingresado no existe.'], 404);
    }

    if (!$row['activo']) {
        sendJsonResponse(['success' => false, 'error' => 'Este código de descuento ha expirado.'], 400);
    }

    sendJsonResponse(['success' => true, 'data' => formatCouponRow($row)]);
}

sendJsonResponse(['error' => 'Método no soportado'], 405);
