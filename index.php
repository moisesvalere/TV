<?php
session_start();

// Establecer una variable de sesión para indicar que el usuario ha llegado desde index.php
$_SESSION['valid_session'] = true;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio</title>
    <script>
        // Redirigir automáticamente a protected.php
        window.onload = function() {
            window.location.href = 'inicio.php';
        };
    </script>
</head>
<body>
    <h1>Redirigiendo...</h1>
</body>
</html>
