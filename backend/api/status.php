<?php
/**
 * Maraña Crochet - Endpoint de Estado de la Conexión a Base de Datos
 * GET /api/status.php
 */

require_once __DIR__ . '/../config/db.php';

try {
    $pdo = getDBConnection();

    // Consultar conteo de tablas para verificar operatividad
    $prodCount = $pdo->query("SELECT COUNT(*) FROM productos")->fetchColumn();
    $orderCount = $pdo->query("SELECT COUNT(*) FROM pedidos")->fetchColumn();
    $quoteCount = $pdo->query("SELECT COUNT(*) FROM cotizaciones")->fetchColumn();
    $reviewCount = $pdo->query("SELECT COUNT(*) FROM resenas")->fetchColumn();

    // Obtener versión de MySQL
    $version = $pdo->query("SELECT VERSION()")->fetchColumn();

    sendJsonResponse([
        "success"   => true,
        "connected" => true,
        "engine"    => "MySQL / MariaDB (XAMPP)",
        "version"   => $version,
        "database"  => DB_NAME,
        "host"      => DB_HOST . ":" . DB_PORT,
        "stats"     => [
            "products" => (int)$prodCount,
            "orders"   => (int)$orderCount,
            "quotes"   => (int)$quoteCount,
            "reviews"  => (int)$reviewCount
        ],
        "timestamp" => date("Y-m-d H:i:s")
    ]);
} catch (Exception $e) {
    sendJsonResponse([
        "success"   => false,
        "connected" => false,
        "error"     => $e->getMessage()
    ], 500);
}
