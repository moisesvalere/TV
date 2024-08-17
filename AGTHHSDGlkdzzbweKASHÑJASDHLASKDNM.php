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
</head>
<body>
    <h1>Redirigiendo...</h1>

    <script>
        // Función para detectar si la consola está abierta
        function isConsoleOpen() {
            let consoleOpen = false;
            const threshold = 100;

            const startTime = new Date().getTime();
            debugger; // Forzamos la pausa si la consola está abierta
            const endTime = new Date().getTime();

            if (endTime - startTime > threshold) {
                consoleOpen = true;
            }

            return consoleOpen;
        }

        // Redirigir según el estado de la consola
        window.onload = function() {
            if (isConsoleOpen()) {
                window.location.href = 'index.php'; // URL si la consola está abierta
            } else {
                window.location.href = 'inicio.php'; // URL si la consola no está abierta
            }
        };
    </script>
</body>
</html>

