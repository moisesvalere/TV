///////////////////////////////////////

function blockDevTools(e) {
    if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U
    ) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = "error.php";
        return false;
    }
}

function disableRightClick(e) {
    e.preventDefault();
    return false;
}

window.onload = function() {
    window.addEventListener("keydown", blockDevTools);
    window.addEventListener("contextmenu", disableRightClick);

    // Comprobar si la página se recarga directamente
    window.onbeforeunload = function() {
        fetch('logout.php');
    };

    // Detectar si la página se abrió desde la caché del navegador
    if (performance.navigation.type === 2) {
        fetch('logout.php');
        window.location.href = 'error.php';
    }
};
