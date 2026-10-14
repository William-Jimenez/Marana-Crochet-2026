<?php
/**
 * Maraña Crochet - Configuración de Base de Datos MySQL (XAMPP / PDO)
 * 
 * Conexión optimizada y segura mediante PDO con soporte para UTF-8 y CORS.
 */

// Headers CORS para permitir la comunicación entre React (Vite) y el API PHP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Manejo de solicitudes preliminares (pre-flight OPTIONS)
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Parámetros de conexión a XAMPP MySQL
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'marana_crochet');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');

/**
 * Obtener instancia PDO para la base de datos
 * @return PDO|null
 */
function getDBConnection() {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "error"   => "Error de conexión con la base de datos MySQL en XAMPP: " . $e->getMessage(),
                "details" => [
                    "host" => DB_HOST,
                    "database" => DB_NAME,
                    "user" => DB_USER,
                    "suggestion" => "Verifica que el módulo MySQL esté iniciado en el panel de control de XAMPP."
                ]
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }

    return $pdo;
}

/**
 * Enviar respuesta JSON estandarizada
 */
function sendJsonResponse($data, $statusCode = 200) {
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

/**
 * Obtener cuerpo JSON de la petición
 */
function getRequestBody() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}
