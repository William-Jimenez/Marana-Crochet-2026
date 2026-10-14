<?php
/**
 * Maraña Crochet - API de Cotizaciones Personalizadas
 * GET /api/quotes.php (Listar cotizaciones)
 * POST /api/quotes.php (Crear solicitud de cotización)
 * PUT /api/quotes.php (Cotizar precio, rechazar, aceptar)
 */

require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function formatQuoteRow($row) {
    return [
        'id'              => $row['id'],
        'userId'          => $row['usuario_id'] ?: 'usr-customer-1',
        'customerName'    => $row['cliente_nombre'],
        'customerEmail'   => $row['cliente_email'],
        'customerPhone'   => $row['cliente_telefono'],
        'itemType'        => $row['tipo_articulo'],
        'description'     => $row['descripcion'],
        'dimensions'      => $row['dimensiones'],
        'preferredColors' => $row['colores_preferidos'],
        'referenceImage'  => $row['imagen_referencia'] ?: undefined,
        'status'          => $row['estado'],
        'quotedPrice'     => $row['precio_cotizado'] !== null ? (float)$row['precio_cotizado'] : undefined,
        'estimatedDays'   => $row['dias_estimados'] !== null ? (int)$row['dias_estimados'] : undefined,
        'adminNote'       => $row['nota_admin'] ?: undefined,
        'createdAt'       => $row['created_at']
    ];
}

// -------------------------------------------------------------
// GET: Listar cotizaciones
// -------------------------------------------------------------
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM cotizaciones ORDER BY created_at DESC");
    $quotes = array_map('formatQuoteRow', $stmt->fetchAll());
    sendJsonResponse(['success' => true, 'data' => $quotes]);
}

// -------------------------------------------------------------
// POST: Crear solicitud de cotización
// -------------------------------------------------------------
if ($method === 'POST') {
    $data = getRequestBody();

    if (empty($data['customerName']) || empty($data['itemType']) || empty($data['description'])) {
        sendJsonResponse(['success' => false, 'error' => 'Faltan campos obligatorios para la cotización'], 400);
    }

    $id = !empty($data['id']) ? $data['id'] : ('COT-2026-' . rand(100, 999));
    $userId = $data['userId'] ?? 'usr-customer-1';

    $sql = "INSERT INTO cotizaciones (
        id, usuario_id, cliente_nombre, cliente_email, cliente_telefono,
        tipo_articulo, descripcion, dimensiones, colores_preferidos, imagen_referencia, estado
    ) VALUES (
        :id, :usuario_id, :cliente_nombre, :cliente_email, :cliente_telefono,
        :tipo_articulo, :descripcion, :dimensiones, :colores_preferidos, :imagen_referencia, 'pending'
    )";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id'                 => $id,
        ':usuario_id'         => $userId,
        ':cliente_nombre'     => $data['customerName'],
        ':cliente_email'      => $data['customerEmail'] ?? '',
        ':cliente_telefono'   => $data['customerPhone'] ?? '',
        ':tipo_articulo'      => $data['itemType'],
        ':descripcion'        => $data['description'],
        ':dimensiones'        => $data['dimensions'] ?? '',
        ':colores_preferidos' => $data['preferredColors'] ?? '',
        ':imagen_referencia'  => $data['referenceImage'] ?? null
    ]);

    sendJsonResponse([
        'success' => true,
        'message' => 'Cotización registrada con éxito en MySQL',
        'quoteId' => $id
    ], 201);
}

// -------------------------------------------------------------
// PUT: Administrar cotización (Cotizar, Rechazar, Aceptar)
// -------------------------------------------------------------
if ($method === 'PUT') {
    $data = getRequestBody();
    $action = $data['action'] ?? '';
    $quoteId = $data['quoteId'] ?? null;

    if (!$quoteId) {
        sendJsonResponse(['success' => false, 'error' => 'ID de cotización no especificado'], 400);
    }

    // Administrador cotiza precio y días
    if ($action === 'quote_price') {
        $price = (float)($data['price'] ?? 0);
        $days = (int)($data['estimatedDays'] ?? 5);
        $adminNote = $data['adminNote'] ?? '';

        $stmt = $pdo->prepare("UPDATE cotizaciones SET 
            estado = 'quoted',
            precio_cotizado = :price,
            dias_estimados = :days,
            nota_admin = :note
            WHERE id = :id");

        $stmt->execute([
            ':price' => $price,
            ':days'  => $days,
            ':note'  => $adminNote,
            ':id'    => $quoteId
        ]);

        sendJsonResponse(['success' => true, 'message' => 'Precio cotizado guardado en MySQL']);
    }

    // Administrador rechaza
    if ($action === 'reject') {
        $adminNote = $data['adminNote'] ?? 'No disponible por saturación del taller';
        $stmt = $pdo->prepare("UPDATE cotizaciones SET estado = 'rejected', nota_admin = :note WHERE id = :id");
        $stmt->execute([':note' => $adminNote, ':id' => $quoteId]);

        sendJsonResponse(['success' => true, 'message' => 'Cotización rechazada']);
    }

    // Cliente acepta cotización
    if ($action === 'accept') {
        $stmt = $pdo->prepare("UPDATE cotizaciones SET estado = 'accepted' WHERE id = :id");
        $stmt->execute([':id' => $quoteId]);

        sendJsonResponse(['success' => true, 'message' => 'Cotización aceptada']);
    }

    sendJsonResponse(['success' => false, 'error' => 'Acción desconocida'], 400);
}

sendJsonResponse(['error' => 'Método no soportado'], 405);
