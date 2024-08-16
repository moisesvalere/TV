<?php
session_start();

// Verificar si la sesión es válida
if (!isset($_SESSION['valid_session']) || $_SESSION['valid_session'] !== true) {
    header("Location: error.php");
    exit();
}

// Destruir la variable de sesión para invalidar el acceso en caso de recarga
unset($_SESSION['valid_session']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reproductor y Contenidos</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>  
    <div class="menu">
        <ion-icon name="menu-outline"></ion-icon>
        <ion-icon name="close-outline"></ion-icon>
    </div>
        <!-- Barra lateral del menú de categorías de canales -->
        <div id="channel-menu" class="barra-lateral">
            
        </div>
            

            |<!-- Contenedor principal -->
            <main id="main-content" class=""></main>
         

            <!-- Contenedor para mostrar los tvg-id de la categoría seleccionada -->
            
        </div>
   

    <!-- Contenedor del reproductor de video -->
    <div id="player-container" class="overlay">
        <button id="close-player" class="btn btn-danger">X</button>
        <div id="aRzklaXf"></div>
    </div>

    <!-- Contenedor del iframe -->
    <div id="iframe-container" class="overlay">
        <button id="close-iframe" class="btn btn-danger">X</button>
        <iframe id="videoFrame" src="" sandbox="allow-scripts allow-same-origin"></iframe>
    </div>


    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
    <script src="https://jwpsrv.com/library/FfMxTl3oEeSEiiIACxmInQ.js"></script>
    <script src="script.js"></script>
</body>
</html>