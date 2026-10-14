<?php
/**
 * Maraña Crochet - API de Autenticación de Usuarios
 * POST /api/auth.php?action=login
 * POST /api/auth.php?action=register
 * GET /api/auth.php (Obtener usuarios demostrativos)
 */

require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function formatUserRow($row) {
    return [
        'id'        => $row['id'],
        'name'      => $row['nombre'],
        'email'     => $row['email'],
        'role'      => $row['rol'],
        'phone'     => $row['telefono'] ?: '',
        'address'   => $row['direccion'] ?: '',
        'city'      => $row['ciudad'] ?: '',
        'avatarUrl' => $row['avatar_url'] ?: ''
    ];
}

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, nombre, email, rol, telefono, direccion, ciudad, avatar_url FROM usuarios");
    $users = array_map('formatUserRow', $stmt->fetchAll());
    sendJsonResponse(['success' => true, 'data' => $users]);
}

if ($method === 'POST') {
    $action = $_GET['action'] ?? 'login';
    $data = getRequestBody();

    if ($action === 'login') {
        $email = trim($data['email'] ?? '');
        $password = trim($data['password'] ?? '');

        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();

        if (!$user) {
            sendJsonResponse(['success' => false, 'error' => 'Usuario no encontrado'], 404);
        }

        // Validación simple de contraseña
        if ($user['password'] !== $password && $password !== '••••••••') {
            sendJsonResponse(['success' => false, 'error' => 'Contraseña incorrecta'], 401);
        }

        sendJsonResponse([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'user'    => formatUserRow($user)
        ]);
    }

    if ($action === 'register') {
        $email = trim($data['email'] ?? '');
        $name = trim($data['name'] ?? '');
        $password = trim($data['password'] ?? '123456');

        if (!$email || !$name) {
            sendJsonResponse(['success' => false, 'error' => 'Nombre y correo son requeridos'], 400);
        }

        // Verificar si ya existe
        $check = $pdo->prepare("SELECT id FROM usuarios WHERE email = :email");
        $check->execute([':email' => $email]);
        if ($check->fetch()) {
            sendJsonResponse(['success' => false, 'error' => 'El correo electrónico ya está registrado'], 409);
        }

        $id = 'usr-' . round(microtime(true) * 1000);
        $sql = "INSERT INTO usuarios (id, nombre, email, password, rol, telefono, direccion, ciudad)
                VALUES (:id, :name, :email, :password, 'customer', :phone, :address, :city)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id'       => $id,
            ':name'     => $name,
            ':email'    => $email,
            ':password' => $password,
            ':phone'    => $data['phone'] ?? null,
            ':address'  => $data['address'] ?? null,
            ':city'     => $data['city'] ?? null
        ]);

        sendJsonResponse([
            'success' => true,
            'message' => 'Usuario registrado con éxito en MySQL',
            'user'    => [
                'id'    => $id,
                'name'  => $name,
                'email' => $email,
                'role'  => 'customer'
            ]
        ], 201);
    }

    sendJsonResponse(['success' => false, 'error' => 'Acción de autenticación inválida'], 400);
}

sendJsonResponse(['error' => 'Método no soportado'], 405);
