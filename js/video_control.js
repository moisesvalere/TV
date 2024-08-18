document.addEventListener('DOMContentLoaded', () => {
    // Actualiza la lista de canales cada 30 segundos
    fetchAndUpdateChannels();
    setInterval(fetchAndUpdateChannels, 30000);

    // Ocultar inicialmente los contenedores de video y iframe
    document.getElementById('player-container').style.display = 'none';
    document.getElementById('iframe-container').style.display = 'none';
    
    // Función para cerrar el reproductor de video y salir del modo pantalla completa
    document.getElementById('close-player').addEventListener('click', () => {
        const playerContainer = document.getElementById('player-container');
        playerContainer.style.display = 'none';

        const playerInstance = jwplayer("aRzklaXf");
        if (playerInstance) {
            playerInstance.remove();
        }

        // Salir del modo pantalla completa si está activo
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    // Función para cerrar el iframe y salir del modo pantalla completa
    document.getElementById('close-iframe').addEventListener('click', () => {
        const iframeContainer = document.getElementById('iframe-container');
        iframeContainer.style.display = 'none';

        const iframe = document.getElementById('videoFrame');
        iframe.src = '';

        // Salir del modo pantalla completa si está activo
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    // Variables para controlar el redimensionamiento y pantalla completa
    let resizeTimeout;
    let isFullscreenChanging = false;
    let isManualExitFullscreen = false;

    // Función para detectar dispositivos móviles
    function detectMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    }

    // Función para manejar el redimensionamiento
    function handleResize() {
        if (document.fullscreenElement || isFullscreenChanging || isManualExitFullscreen) {
            return; // No redirigir si está en pantalla completa o en proceso de cambio
        }

        // Redirigir si hay un cambio en el tamaño de la ventana y no es un dispositivo móvil
        if (!detectMobileDevice()) {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                window.location.href = "error.php";
            }, 100); // Espera 100ms antes de redirigir
        }
    }

    // Función para manejar el cambio en el estado de pantalla completa
    function handleFullscreenChange() {
        if (isManualExitFullscreen) {
            isManualExitFullscreen = false; // Desactivar la bandera después de salir manualmente
        } else {
            isFullscreenChanging = true;

            if (document.fullscreenElement) {
                isFullscreenChanging = false;
                return;
            } else {
                setTimeout(() => {
                    isFullscreenChanging = false; // Reiniciar la bandera
                }, 200);
            }
        }
    }

    // Función para manejar el evento de presionar teclas
    function handleKeyDown(event) {
        if (event.key === "Escape") {
            isManualExitFullscreen = true; // Marcar que la salida de fullscreen es manual
        }
    }

    // Función para cerrar el reproductor de video en pantalla completa
    document.getElementById('close-playerfull').addEventListener('click', () => {
        isManualExitFullscreen = true;
        const playerContainer = document.getElementById('player-container');
        playerContainer.style.display = 'none';

        const playerInstance = jwplayer("aRzklaXf");
        if (playerInstance) {
            playerInstance.remove(); // Detener y eliminar el reproductor
        }

        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    // Función para cerrar el iframe en pantalla completa
    document.getElementById('close-iframefull').addEventListener('click', () => {
        isManualExitFullscreen = true;
        const iframeContainer = document.getElementById('iframe-container');
        iframeContainer.style.display = 'none';

        const iframe = document.getElementById('videoFrame');
        iframe.src = ''; // Eliminar el contenido del iframe para detener el sonido

        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    // Añadir eventos de redimensionamiento y cambio de pantalla completa
    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    // Función para poner el iframe en pantalla completa
    function toggleFullscreenIframe() {
        const iframeContainer = document.getElementById('iframe-container');
        const videoFrame = document.getElementById('videoFrame');

        if (!document.fullscreenElement) {
            iframeContainer.requestFullscreen().then(() => {
                videoFrame.style.width = '100%';
                videoFrame.style.height = '100%';
                videoFrame.style.marginLeft = '0'; // Cambiar margin-left a 0 en pantalla completa
                updateFullscreenButtonVisibility();
            });
        } else {
            document.exitFullscreen().then(() => {
                videoFrame.style.width = '70%';
                videoFrame.style.height = '70%';
                videoFrame.style.marginLeft = '15%'; // Restaurar margin-left a 15%
                updateFullscreenButtonVisibility();
            });
        }
    }

    // Función para poner el reproductor de video en pantalla completa
    function toggleFullscreenPlayer() {
        const playerContainer = document.getElementById('player-container');
        const playerInstance = jwplayer("aRzklaXf");

        if (!document.fullscreenElement) {
            playerContainer.requestFullscreen().then(() => {
                playerInstance.resize("100%", "100%");
                updateFullscreenButtonVisibility();
            });
        } else {
            document.exitFullscreen().then(() => {
                playerInstance.resize("70%", "70%");
                updateFullscreenButtonVisibility();
            });
        }
    }

    // Función para actualizar la visibilidad de los botones en modo pantalla completa
    function updateFullscreenButtonVisibility() {
        const fullscreenIframeButton = document.getElementById('fullscreen-iframe');
        const closeIframeButton = document.getElementById('close-iframe');
        const closeIframeFullButton = document.getElementById('close-iframefull');

        const fullscreenPlayerButton = document.getElementById('fullscreen-player');
        const closePlayerButton = document.getElementById('close-player');
        const closePlayerFullButton = document.getElementById('close-playerfull');
        
        if (document.fullscreenElement) {
            fullscreenIframeButton.style.display = 'none';
            closeIframeButton.style.display = 'none';
            closeIframeFullButton.style.display = 'block';

            fullscreenPlayerButton.style.display = 'none';
            closePlayerButton.style.display = 'none';
            closePlayerFullButton.style.display = 'block';
        } else {
            fullscreenIframeButton.style.display = 'flex';
            closeIframeButton.style.display = 'block';
            closeIframeFullButton.style.display = 'none';

            fullscreenPlayerButton.style.display = 'flex';
            closePlayerButton.style.display = 'block';
            closePlayerFullButton.style.display = 'none';
        }
    }

    // Agregar eventos a los botones de pantalla completa
    document.getElementById('fullscreen-iframe').addEventListener('click', () => {
        toggleFullscreenIframe();
    });

    document.getElementById('fullscreen-player').addEventListener('click', () => {
        toggleFullscreenPlayer();
    });

    // Escuchar cambios en el estado de pantalla completa
    document.addEventListener('fullscreenchange', updateFullscreenButtonVisibility);

    // Inicializar la visibilidad de los botones al cargar la página
    updateFullscreenButtonVisibility();  
});
