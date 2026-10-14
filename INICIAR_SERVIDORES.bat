@echo off
title Marana Crochet 2026 - Servidores PHP + Vite
color 0B
chcp 65001 > nul

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║         MARAÑA CROCHET 2026 - INICIANDO SERVIDORES          ║
echo  ║               PHP + MySQL (XAMPP) + Vite React              ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

:: Verificar que MySQL de XAMPP esté corriendo
echo [1/4] Verificando MySQL (XAMPP)...
C:\xampp\mysql\bin\mysql.exe -u root -e "SELECT 1;" > nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo  [!] MySQL no está corriendo. Iniciando desde XAMPP...
    start "" "C:\xampp\xampp-control.exe"
    echo  [!] Por favor, inicia MySQL desde el Panel de Control de XAMPP.
    pause
) ELSE (
    echo  [OK] MySQL está activo y respondiendo.
)

:: Ejecutar setup de la base de datos
echo.
echo [2/4] Configurando base de datos marana_crochet...
C:\xampp\php\php.exe "backend\setup.php"
echo.

:: Iniciar servidor PHP built-in en puerto 8000
echo [3/4] Iniciando servidor PHP en http://127.0.0.1:8000 ...
start "PHP Backend (Puerto 8000)" /MIN C:\xampp\php\php.exe -S 127.0.0.1:8000 -t backend
timeout /t 2 > nul
echo  [OK] Servidor PHP iniciado en http://127.0.0.1:8000

:: Iniciar servidor Vite (React/TypeScript frontend)
echo.
echo [4/4] Iniciando frontend React/Vite en http://localhost:3000 ...
start "Vite Frontend (Puerto 3000)" /MIN cmd /c "npm run dev"
timeout /t 3 > nul
echo  [OK] Frontend Vite iniciado en http://localhost:3000

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║  ✓ APLICACIÓN LISTA - Abre tu navegador en:                 ║
echo  ║                                                              ║
echo  ║  Aplicación React:  http://localhost:3000                    ║
echo  ║  API PHP:           http://localhost:3000/api/status.php     ║
echo  ║  PHP puro (Apache): http://localhost/marana-crochet/         ║
echo  ║  Estado MySQL:      http://127.0.0.1:8000/api/status.php    ║
echo  ║                                                              ║
echo  ║  Usuarios de prueba (panel RBAC):                           ║
echo  ║    Admin:    admin@marana.co  /  admin123                   ║
echo  ║    Cliente:  sofia@gmail.com  /  sofia123                   ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

:: Abrir navegador automáticamente
timeout /t 2 > nul
start "" "http://localhost:3000"

echo  Presiona cualquier tecla para cerrar esta ventana...
echo  (Los servidores seguirán corriendo en segundo plano)
pause > nul
