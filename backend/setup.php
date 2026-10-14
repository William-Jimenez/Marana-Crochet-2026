<?php
/**
 * Maraña Crochet - Instalador y Sembrador de Base de Datos MySQL
 * 
 * Este script crea la base de datos `marana_crochet` y ejecuta el archivo `database.sql`
 * Puede ejecutarse desde el navegador (http://localhost:8000/setup.php) o por consola (php backend/setup.php).
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$isCli = (php_sapi_name() === 'cli');

if (!$isCli) {
    header("Content-Type: application/json; charset=UTF-8");
}

$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '3306';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';
$dbName = getenv('DB_NAME') ?: 'marana_crochet';

$sqlFile = __DIR__ . '/database.sql';

$results = [
    "success" => false,
    "steps" => [],
    "message" => ""
];

try {
    // 1. Conexión inicial al servidor MySQL sin especificar base de datos
    $pdo = new PDO("mysql:host={$host};port={$port}", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    $results["steps"][] = "Conexión a MySQL exitosa (Host: {$host}:{$port}, Usuario: {$user})";

    // 2. Crear base de datos si no existe
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $results["steps"][] = "Base de datos `{$dbName}` verificada / creada exitosamente.";

    // 3. Conectar a la base de datos creada
    $pdo->exec("USE `{$dbName}`;");

    // 4. Leer y ejecutar el script SQL
    if (!file_exists($sqlFile)) {
        throw new Exception("No se encontró el archivo SQL en: {$sqlFile}");
    }

    $sqlContent = file_get_contents($sqlFile);
    
    // Ejecutar sentencias SQL
    $pdo->exec($sqlContent);
    $results["steps"][] = "Estructura de tablas y datos iniciales importados correctamente desde database.sql.";

    // 5. Verificar tablas creadas
    $stmt = $pdo->query("SHOW TABLES;");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $results["tables"] = $tables;
    $results["steps"][] = "Tablas activas en `{$dbName}`: " . implode(", ", $tables);

    $results["success"] = true;
    $results["message"] = "¡Base de datos de Maraña Crochet configurada exitosamente en XAMPP!";

} catch (PDOException $e) {
    $results["success"] = false;
    $results["error"] = "Error de PDO/MySQL: " . $e->getMessage();
    $results["message"] = "No se pudo conectar a MySQL. Asegúrate de que XAMPP esté ejecutando MySQL.";
} catch (Exception $e) {
    $results["success"] = false;
    $results["error"] = $e->getMessage();
    $results["message"] = "Error durante la instalación.";
}

if ($isCli) {
    echo "====================================================\n";
    echo " Maraña Crochet 2026 - Instalador de Base de Datos\n";
    echo "====================================================\n";
    foreach ($results["steps"] as $step) {
        echo "[OK] {$step}\n";
    }
    if ($results["success"]) {
        echo "\n>>> " . $results["message"] . "\n";
    } else {
        echo "\n[ERROR] " . ($results["error"] ?? $results["message"]) . "\n";
    }
} else {
    echo json_encode($results, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
