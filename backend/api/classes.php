<?php
/**
 * Maraña Crochet - API de Clases Virtuales
 * GET /api/classes.php
 * PUT /api/classes.php (Completar módulo o inscribirse)
 */

require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function formatClassRow($row) {
    return [
        'id'            => $row['id'],
        'title'         => $row['titulo'],
        'level'         => $row['nivel'],
        'duration'      => $row['duracion'],
        'lessonsCount'  => (int)$row['lecciones_count'],
        'instructor'    => $row['instructor'],
        'imageUrl'      => $row['imagen_url'],
        'description'   => $row['descripcion'],
        'rating'        => (float)$row['rating'],
        'studentsCount' => (int)$row['estudiantes_count'],
        'isEnrolled'    => (bool)$row['inscrito'],
        'modules'       => !empty($row['modulos']) ? json_decode($row['modulos'], true) : []
    ];
}

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM clases_virtuales ORDER BY created_at ASC");
    $classes = array_map('formatClassRow', $stmt->fetchAll());
    sendJsonResponse(['success' => true, 'data' => $classes]);
}

if ($method === 'PUT') {
    $data = getRequestBody();
    $action = $data['action'] ?? '';
    $classId = $data['classId'] ?? null;

    if (!$classId) {
        sendJsonResponse(['success' => false, 'error' => 'ID de clase no proporcionado'], 400);
    }

    if ($action === 'enroll') {
        $stmt = $pdo->prepare("UPDATE clases_virtuales SET inscrito = 1, estudiantes_count = estudiantes_count + 1 WHERE id = :id");
        $stmt->execute([':id' => $classId]);
        sendJsonResponse(['success' => true, 'message' => 'Inscrito en la clase exitosamente']);
    }

    if ($action === 'toggle_module') {
        $moduleId = $data['moduleId'] ?? '';
        $stmt = $pdo->prepare("SELECT modulos FROM clases_virtuales WHERE id = :id");
        $stmt->execute([':id' => $classId]);
        $row = $stmt->fetch();

        if ($row && !empty($row['modulos'])) {
            $modules = json_decode($row['modulos'], true);
            foreach ($modules as &$mod) {
                if ($mod['id'] === $moduleId) {
                    $mod['completed'] = !($mod['completed'] ?? false);
                }
            }
            $upd = $pdo->prepare("UPDATE clases_virtuales SET modulos = :modulos WHERE id = :id");
            $upd->execute([':modulos' => json_encode($modules, JSON_UNESCAPED_UNICODE), ':id' => $classId]);

            sendJsonResponse(['success' => true, 'modules' => $modules]);
        }
    }

    sendJsonResponse(['success' => false, 'error' => 'Acción no reconocida'], 400);
}

sendJsonResponse(['error' => 'Método no soportado'], 405);
