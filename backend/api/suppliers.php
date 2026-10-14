<?php
/**
 * Maraña Crochet - API de Proveedores de Insumos
 * GET /api/suppliers.php
 * POST /api/suppliers.php (Crear proveedor)
 */

require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function formatSupplierRow($row) {
    return [
        'id'             => $row['id'],
        'name'           => $row['nombre'],
        'contactPerson'  => $row['contacto'],
        'phone'          => $row['telefono'],
        'email'          => $row['email'],
        'category'       => $row['categoria'],
        'leadTimeDays'   => (int)$row['dias_entrega'],
        'lastRestockDate'=> $row['ultimo_reabastecimiento'] ?: '',
        'notes'          => $row['notas'] ?: ''
    ];
}

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM proveedores ORDER BY created_at DESC");
    $suppliers = array_map('formatSupplierRow', $stmt->fetchAll());
    sendJsonResponse(['success' => true, 'data' => $suppliers]);
}

if ($method === 'POST') {
    $data = getRequestBody();

    if (empty($data['name']) || empty($data['contactPerson'])) {
        sendJsonResponse(['success' => false, 'error' => 'Nombre y persona de contacto son obligatorios'], 400);
    }

    $id = !empty($data['id']) ? $data['id'] : ('sup-' . round(microtime(true) * 1000));

    $sql = "INSERT INTO proveedores (id, nombre, contacto, telefono, email, categoria, dias_entrega, ultimo_reabastecimiento, notas)
            VALUES (:id, :name, :contact, :phone, :email, :category, :lead, :last_restock, :notes)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id'           => $id,
        ':name'         => $data['name'],
        ':contact'      => $data['contactPerson'],
        ':phone'        => $data['phone'] ?? '',
        ':email'        => $data['email'] ?? '',
        ':category'     => $data['category'] ?? 'General',
        ':lead'         => isset($data['leadTimeDays']) ? (int)$data['leadTimeDays'] : 3,
        ':last_restock' => !empty($data['lastRestockDate']) ? $data['lastRestockDate'] : date('Y-m-d'),
        ':notes'        => $data['notes'] ?? ''
    ]);

    sendJsonResponse([
        'success' => true,
        'message' => 'Proveedor guardado en MySQL',
        'data'    => array_merge($data, ['id' => $id])
    ], 201);
}

sendJsonResponse(['error' => 'Método no soportado'], 405);
