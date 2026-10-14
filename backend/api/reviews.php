<?php
/**
 * Maraña Crochet - API de Reseñas y Calificaciones
 * GET /api/reviews.php
 * POST /api/reviews.php (Crear reseña y recalcular promedio de producto)
 * PUT /api/reviews.php (Aprobar o desaprobar reseña)
 */

require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function formatReviewRow($row) {
    return [
        'id'          => $row['id'],
        'productId'   => $row['producto_id'],
        'productName' => $row['nombre_producto'],
        'orderId'     => $row['pedido_id'] ?: '',
        'customerName'=> $row['cliente_nombre'],
        'rating'      => (int)$row['rating'],
        'comment'     => $row['comentario'],
        'date'        => $row['fecha'],
        'isApproved'  => (bool)$row['aprobado']
    ];
}

// -------------------------------------------------------------
// GET: Listar reseñas
// -------------------------------------------------------------
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM resenas ORDER BY created_at DESC");
    $reviews = array_map('formatReviewRow', $stmt->fetchAll());
    sendJsonResponse(['success' => true, 'data' => $reviews]);
}

// -------------------------------------------------------------
// POST: Enviar nueva reseña
// -------------------------------------------------------------
if ($method === 'POST') {
    $data = getRequestBody();

    if (empty($data['productId']) || empty($data['rating']) || empty($data['comment'])) {
        sendJsonResponse(['success' => false, 'error' => 'Faltan campos para la reseña'], 400);
    }

    $id = !empty($data['id']) ? $data['id'] : ('rev-' . round(microtime(true) * 1000));
    $productId = $data['productId'];
    $orderId = $data['orderId'] ?? null;
    $customerName = $data['customerName'] ?? 'Cliente Verificado';
    $rating = max(1, min(5, (int)$data['rating']));
    $comment = $data['comment'];
    $date = 'Reciente';

    // Obtener nombre del producto si no viene
    $pStmt = $pdo->prepare("SELECT nombre, rating, review_count FROM productos WHERE id = :id");
    $pStmt->execute([':id' => $productId]);
    $prod = $pStmt->fetch();
    $productName = $data['productName'] ?? ($prod ? $prod['nombre'] : 'Producto Maraña');

    $pdo->beginTransaction();

    try {
        // 1. Insertar reseña
        $sql = "INSERT INTO resenas (id, producto_id, nombre_producto, pedido_id, cliente_nombre, rating, comentario, fecha, aprobado)
                VALUES (:id, :p_id, :p_name, :order_id, :client, :rating, :comment, :fecha, 1)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id'       => $id,
            ':p_id'     => $productId,
            ':p_name'   => $productName,
            ':order_id' => $orderId,
            ':client'   => $customerName,
            ':rating'   => $rating,
            ':comment'  => $comment,
            ':fecha'    => $date
        ]);

        // 2. Marcar pedido como calificado
        if ($orderId) {
            $ordStmt = $pdo->prepare("UPDATE pedidos SET es_calificado = 1 WHERE id = :id");
            $ordStmt->execute([':id' => $orderId]);
        }

        // 3. Recalcular promedio de estrellas y conteo de reseñas del producto
        if ($prod) {
            $newCount = (int)$prod['review_count'] + 1;
            $newRating = round((((float)$prod['rating'] * (int)$prod['review_count']) + $rating) / $newCount, 1);

            $updProd = $pdo->prepare("UPDATE productos SET rating = :rating, review_count = :count WHERE id = :id");
            $updProd->execute([
                ':rating' => $newRating,
                ':count'  => $newCount,
                ':id'     => $productId
            ]);
        }

        $pdo->commit();

        sendJsonResponse([
            'success' => true,
            'message' => 'Reseña guardada con éxito en MySQL',
            'reviewId'=> $id
        ], 201);

    } catch (Exception $e) {
        $pdo->rollBack();
        sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// -------------------------------------------------------------
// PUT: Alternar aprobación de reseña
// -------------------------------------------------------------
if ($method === 'PUT') {
    $data = getRequestBody();
    $reviewId = $data['reviewId'] ?? null;

    if (!$reviewId) {
        sendJsonResponse(['success' => false, 'error' => 'ID de reseña requerido'], 400);
    }

    $stmt = $pdo->prepare("UPDATE resenas SET aprobado = IF(aprobado = 1, 0, 1) WHERE id = :id");
    $stmt->execute([':id' => $reviewId]);

    sendJsonResponse(['success' => true, 'message' => 'Estado de aprobación actualizado']);
}

sendJsonResponse(['error' => 'Método no soportado'], 405);
