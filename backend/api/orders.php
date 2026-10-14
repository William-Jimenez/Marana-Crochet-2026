<?php
/**
 * Maraña Crochet - API de Pedidos y Comprobantes de Pago
 * GET /api/orders.php (Listar pedidos con sus items)
 * POST /api/orders.php (Crear nuevo pedido y descontar stock)
 * PUT /api/orders.php (Verificar pago, rechazar, subir comprobante, cambiar estado)
 */

require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function formatOrderRow($row, $items) {
    return [
        'id'            => $row['id'],
        'userId'        => $row['usuario_id'] ?: 'usr-customer-1',
        'customerName'  => $row['cliente_nombre'],
        'customerEmail' => $row['cliente_email'],
        'customerPhone' => $row['cliente_telefono'],
        'shippingAddress' => [
            'address' => $row['direccion_envio'],
            'city'    => $row['ciudad_envio'],
            'notes'   => $row['notas_envio'] ?: undefined,
        ],
        'items'         => $items,
        'subtotal'      => (float)$row['subtotal'],
        'discount'      => (float)$row['descuento'],
        'couponCode'    => $row['cupon_codigo'] ?: undefined,
        'shippingCost'  => (float)$row['costo_envio'],
        'total'         => (float)$row['total'],
        'paymentMethod' => $row['metodo_pago'],
        'paymentStatus' => $row['estado_pago'],
        'orderStatus'   => $row['estado_pedido'],
        'paymentProof'  => !empty($row['banco_nombre']) ? [
            'bankName'       => $row['banco_nombre'],
            'receiptNumber'  => $row['numero_comprobante'] ?: '',
            'imageUrl'       => $row['imagen_comprobante'] ?: '',
            'submittedAt'    => $row['fecha_comprobante'] ?: $row['created_at'],
            'rejectedReason' => $row['motivo_rechazo'] ?: undefined
        ] : null,
        'isReviewed'    => (bool)$row['es_calificado'],
        'createdAt'     => $row['created_at'],
        'updatedAt'     => $row['updated_at'] ?: $row['created_at']
    ];
}

// -------------------------------------------------------------
// GET: Listar pedidos
// -------------------------------------------------------------
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM pedidos ORDER BY created_at DESC");
    $ordersRows = $stmt->fetchAll();

    // Obtener todos los items indexados por pedido_id
    $itemsStmt = $pdo->query("SELECT * FROM pedido_items");
    $allItems = $itemsStmt->fetchAll();

    $itemsByOrder = [];
    foreach ($allItems as $item) {
        $pId = $item['pedido_id'];
        if (!isset($itemsByOrder[$pId])) {
            $itemsByOrder[$pId] = [];
        }
        $itemsByOrder[$pId][] = [
            'productId' => $item['producto_id'],
            'name'      => $item['nombre_producto'],
            'quantity'  => (int)$item['cantidad'],
            'unitPrice' => (float)$item['precio_unitario'],
            'imageUrl'  => $item['imagen_url']
        ];
    }

    $orders = [];
    foreach ($ordersRows as $row) {
        $items = $itemsByOrder[$row['id']] ?? [];
        $orders[] = formatOrderRow($row, $items);
    }

    sendJsonResponse(['success' => true, 'data' => $orders]);
}

// -------------------------------------------------------------
// POST: Registrar nuevo pedido (Transacción con descuento de stock)
// -------------------------------------------------------------
if ($method === 'POST') {
    $data = getRequestBody();

    if (empty($data['customerName']) || empty($data['items']) || !is_array($data['items'])) {
        sendJsonResponse(['success' => false, 'error' => 'Datos incompletos para el pedido'], 400);
    }

    $orderId = !empty($data['id']) ? $data['id'] : ('MAR-2026-' . rand(1000, 9999));
    $userId = $data['userId'] ?? 'usr-customer-1';
    $customerName = $data['customerName'];
    $customerEmail = $data['customerEmail'] ?? '';
    $customerPhone = $data['customerPhone'] ?? '';
    $address = is_array($data['shippingAddress']) ? ($data['shippingAddress']['address'] ?? '') : '';
    $city = is_array($data['shippingAddress']) ? ($data['shippingAddress']['city'] ?? '') : '';
    $notes = is_array($data['shippingAddress']) ? ($data['shippingAddress']['notes'] ?? null) : null;

    $subtotal = (float)($data['subtotal'] ?? 0);
    $discount = (float)($data['discount'] ?? 0);
    $couponCode = $data['couponCode'] ?? null;
    $shippingCost = (float)($data['shippingCost'] ?? 0);
    $total = (float)($data['total'] ?? ($subtotal - $discount + $shippingCost));
    $paymentMethod = $data['paymentMethod'] ?? 'transfer';

    $pdo->beginTransaction();

    try {
        // 1. Insertar pedido principal
        $orderSql = "INSERT INTO pedidos (
            id, usuario_id, cliente_nombre, cliente_email, cliente_telefono,
            direccion_envio, ciudad_envio, notas_envio, subtotal, descuento,
            cupon_codigo, costo_envio, total, metodo_pago, estado_pago, estado_pedido
        ) VALUES (
            :id, :usuario_id, :cliente_nombre, :cliente_email, :cliente_telefono,
            :direccion_envio, :ciudad_envio, :notas_envio, :subtotal, :descuento,
            :cupon_codigo, :costo_envio, :total, :metodo_pago, 'pending_verification', 'pending'
        )";

        $stmt = $pdo->prepare($orderSql);
        $stmt->execute([
            ':id'               => $orderId,
            ':usuario_id'       => $userId,
            ':cliente_nombre'   => $customerName,
            ':cliente_email'    => $customerEmail,
            ':cliente_telefono' => $customerPhone,
            ':direccion_envio'  => $address,
            ':ciudad_envio'     => $city,
            ':notas_envio'      => $notes,
            ':subtotal'         => $subtotal,
            ':descuento'        => $discount,
            ':cupon_codigo'     => $couponCode,
            ':costo_envio'      => $shippingCost,
            ':total'            => $total,
            ':metodo_pago'      => $paymentMethod
        ]);

        // 2. Insertar items y descontar stock
        $itemSql = "INSERT INTO pedido_items (pedido_id, producto_id, nombre_producto, cantidad, precio_unitario, imagen_url)
                    VALUES (:pedido_id, :producto_id, :nombre_producto, :cantidad, :precio_unitario, :imagen_url)";
        $itemStmt = $pdo->prepare($itemSql);

        $stockStmt = $pdo->prepare("UPDATE productos SET stock = GREATEST(0, stock - :qty), ventas_count = ventas_count + :qty WHERE id = :id");

        foreach ($data['items'] as $item) {
            $itemStmt->execute([
                ':pedido_id'        => $orderId,
                ':producto_id'      => $item['productId'],
                ':nombre_producto'  => $item['name'],
                ':cantidad'         => (int)$item['quantity'],
                ':precio_unitario'  => (float)$item['unitPrice'],
                ':imagen_url'       => $item['imageUrl'] ?? ''
            ]);

            // Descontar inventario en MySQL
            $stockStmt->execute([
                ':qty' => (int)$item['quantity'],
                ':id'  => $item['productId']
            ]);
        }

        $pdo->commit();

        sendJsonResponse([
            'success' => true,
            'message' => 'Pedido registrado y guardado exitosamente en MySQL',
            'orderId' => $orderId
        ], 201);

    } catch (Exception $e) {
        $pdo->rollBack();
        sendJsonResponse([
            'success' => false,
            'error'   => 'Error al procesar el pedido en MySQL: ' . $e->getMessage()
        ], 500);
    }
}

// -------------------------------------------------------------
// PUT: Acciones sobre pedidos (Comprobante, Verificación, Estados)
// -------------------------------------------------------------
if ($method === 'PUT') {
    $data = getRequestBody();
    $action = $data['action'] ?? '';
    $orderId = $data['orderId'] ?? null;

    if (!$orderId) {
        sendJsonResponse(['success' => false, 'error' => 'ID de pedido no especificado'], 400);
    }

    // Subir comprobante de pago
    if ($action === 'submit_proof') {
        $proof = $data['proof'] ?? [];
        $stmt = $pdo->prepare("UPDATE pedidos SET 
            banco_nombre = :banco,
            numero_comprobante = :recibo,
            imagen_comprobante = :imagen,
            fecha_comprobante = NOW(),
            estado_pago = 'pending_verification',
            motivo_rechazo = NULL
            WHERE id = :id");

        $stmt->execute([
            ':banco'  => $proof['bankName'] ?? 'Nequi',
            ':recibo' => $proof['receiptNumber'] ?? null,
            ':imagen' => $proof['imageUrl'] ?? null,
            ':id'     => $orderId
        ]);

        sendJsonResponse(['success' => true, 'message' => 'Comprobante registrado con éxito en MySQL']);
    }

    // Verificar pago (Aprobación admin)
    if ($action === 'verify_payment') {
        $stmt = $pdo->prepare("UPDATE pedidos SET 
            estado_pago = 'verified',
            estado_pedido = 'in_preparation'
            WHERE id = :id");
        $stmt->execute([':id' => $orderId]);

        sendJsonResponse(['success' => true, 'message' => 'Pago aprobado y pedido en preparación']);
    }

    // Rechazar comprobante
    if ($action === 'reject_payment') {
        $reason = $data['reason'] ?? 'Comprobante no legible o monto incorrecto';
        $stmt = $pdo->prepare("UPDATE pedidos SET 
            estado_pago = 'rejected',
            motivo_rechazo = :reason
            WHERE id = :id");
        $stmt->execute([':reason' => $reason, ':id' => $orderId]);

        sendJsonResponse(['success' => true, 'message' => 'Comprobante rechazado']);
    }

    // Actualizar estado general del pedido (despachado, entregado, etc.)
    if ($action === 'update_status') {
        $status = $data['status'] ?? 'pending';
        $stmt = $pdo->prepare("UPDATE pedidos SET estado_pedido = :status WHERE id = :id");
        $stmt->execute([':status' => $status, ':id' => $orderId]);

        sendJsonResponse(['success' => true, 'message' => 'Estado de pedido actualizado']);
    }

    sendJsonResponse(['success' => false, 'error' => 'Acción desconocida'], 400);
}

sendJsonResponse(['error' => 'Método no soportado'], 405);
