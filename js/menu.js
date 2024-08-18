// Función para mostrar el menú de canales
function displayChannelMenu() {
    const menu = document.getElementById('channel-menu');
    menu.innerHTML = '';

    // Crear un nuevo div para contener 'nombre-pagina'
    const divContenedorNombrePagina = document.createElement('div');

    // Crea el div con la clase 'nombre-pagina'
    const divNombrePagina = document.createElement('div');
    divNombrePagina.className = 'nombre-pagina';

    // Agrega el ícono y el span al divNombrePagina
    const cloudIcon = document.createElement('ion-icon');
    cloudIcon.id = 'cloud';
    cloudIcon.name = 'cloud-outline';

    const apexSpan = document.createElement('span');
    apexSpan.textContent = 'Apex';

    divNombrePagina.appendChild(cloudIcon);
    divNombrePagina.appendChild(apexSpan);

    // Agrega el divNombrePagina al nuevo div contenedor
    divContenedorNombrePagina.appendChild(divNombrePagina);

    // Agrega el div contenedor al menu
    menu.appendChild(divContenedorNombrePagina);

    // Crea el nav con la clase 'navegacion'
    const nav = document.createElement('nav');
    nav.className = 'navegacion';

    // Si no hay categorías, muestra un mensaje
    if (Object.keys(channelCategories).length === 0) {
        menu.textContent = 'No se encontraron categorías.';
        return;
    }

    // Crea elementos de menú para cada categoría de canal y agrégalos al nav
    for (const [channelId, channelCategory] of Object.entries(channelCategories)) {
        const menuItem = document.createElement('li');
        menuItem.className = 'nav-item';

        const a = document.createElement('a');
        a.href = '#';

        // Crear un span para el nombre de la categoría
        const span = document.createElement('span');
        span.textContent = channelCategory.name;

        // Crear el ícono correspondiente según el nombre de la categoría
        const icon = document.createElement('ion-icon');
        if (channelCategory.name.toLowerCase().includes('tv')) {
            icon.name = 'radio-outline';
        } else if (channelCategory.name.toLowerCase().includes('series')) {
            icon.name = 'play-circle-outline';
        } else if (channelCategory.name.toLowerCase().includes('peliculas')) {
            icon.name = 'logo-youtube';
        } else {
            icon.name = 'ellipse-outline'; // Default icon
        }

        // Agregar el ícono y el span al enlace
        a.appendChild(icon);
        a.appendChild(span);
        menuItem.appendChild(a);
        nav.appendChild(menuItem);

        // Agregar eventos de clic al span y al icono
        const displayCategories = (event) => {
            event.preventDefault();
            displayTvgCategories(channelId);
        };

        span.addEventListener('click', displayCategories);
        icon.addEventListener('click', displayCategories);
    }

    // Agrega el nav al menu
    menu.appendChild(nav);

    // Crear un nuevo div para contener 'linea', 'modo-oscuro' y 'usuario'
    const divContenedorElementos = document.createElement('div');

    // Crear y agregar el div con la clase 'linea'
    const divLinea = document.createElement('div');
    divLinea.className = 'linea';
    divContenedorElementos.appendChild(divLinea);

    // Crear y agregar el div con la clase 'modo-oscuro'
    const divModoOscuro = document.createElement('div');
    divModoOscuro.className = 'modo-oscuro';

    // Crear y agregar el div con la clase 'info' dentro de 'modo-oscuro'
    const divInfo = document.createElement('div');
    divInfo.className = 'info';

    const moonIcon = document.createElement('ion-icon');
    moonIcon.name = 'moon-outline';

    const darkModeSpan = document.createElement('span');
    darkModeSpan.textContent = 'Dark Mode';

    divInfo.appendChild(moonIcon);
    divInfo.appendChild(darkModeSpan);
    divModoOscuro.appendChild(divInfo);

    // Crear y agregar el div con la clase 'switch' dentro de 'modo-oscuro'
    const divSwitch = document.createElement('div');
    divSwitch.className = 'switch';

    // Crear y agregar el div con la clase 'base' dentro de 'switch'
    const divBase = document.createElement('div');
    divBase.className = 'base';

    // Crear y agregar el div con la clase 'circulo' dentro de 'base'
    const divCirculo = document.createElement('div');
    divCirculo.className = 'circulo';

    divBase.appendChild(divCirculo);
    divSwitch.appendChild(divBase);
    divModoOscuro.appendChild(divSwitch);

    // Agregar el div 'modo-oscuro' al contenedor
    divContenedorElementos.appendChild(divModoOscuro);

    // Crear y agregar el div con la clase 'usuario'
    const divUsuario = document.createElement('div');
    divUsuario.className = 'usuario';

    const usuarioImg = document.createElement('img');
    usuarioImg.src = 'https://imgur.com/mC4EzF9.png';
    usuarioImg.alt = '';

    const usuarioLink = document.createElement('a');
    usuarioLink.href = 'https://t.me/m3u8listas';
    usuarioLink.appendChild(usuarioImg);

    const divInfoUsuario = document.createElement('div');
    divInfoUsuario.className = 'info-usuario';

    const divNombreEmail = document.createElement('div');
    divNombreEmail.className = 'nombre-email';

    const nombreSpan = document.createElement('span');
    nombreSpan.className = 'nombre';
    nombreSpan.textContent = 'Listas M3u Gratis';

    const emailLink = document.createElement('a');
    emailLink.href = 'https://t.me/m3u8listas';
    emailLink.className = 'email';
    emailLink.textContent = 'https://t.me/m3u8listas';

    const ellipsisIcon = document.createElement('ion-icon');
    ellipsisIcon.name = 'ellipsis-vertical-outline';

    divNombreEmail.appendChild(nombreSpan);
    divNombreEmail.appendChild(emailLink);
    divInfoUsuario.appendChild(divNombreEmail);
    divInfoUsuario.appendChild(ellipsisIcon);
    divUsuario.appendChild(usuarioLink);
    divUsuario.appendChild(divInfoUsuario);

    // Agregar el div 'usuario' al contenedor
    divContenedorElementos.appendChild(divUsuario);

    // Agregar el nuevo contenedor al menu
    menu.appendChild(divContenedorElementos);

    // Agrega los event listeners para el modo oscuro, la barra lateral y el menú
    const cloud = document.getElementById("cloud");
    const barraLateral = document.querySelector(".barra-lateral");
    const spans = document.querySelectorAll("span");
    const palanca = document.querySelector(".switch");
    const circulo = document.querySelector(".circulo");
    const men = document.querySelector(".menu");
    const main = document.querySelector("main");

    men.addEventListener("click", () => {
        barraLateral.classList.toggle("max-barra-lateral");
        if (barraLateral.classList.contains("max-barra-lateral")) {
            men.children[0].style.display = "none";
            men.children[1].style.display = "block";
        } else {
            men.children[0].style.display = "block";
            men.children[1].style.display = "none";
        }
    });

    palanca.addEventListener("click", () => {
        let body = document.body;
        body.classList.toggle("dark-mode");
        circulo.classList.toggle("prendido");
    });

    cloud.addEventListener("click", () => {
        barraLateral.classList.toggle("mini-barra-lateral");
        main.classList.toggle("min-main");
        spans.forEach((span) => {
            span.classList.toggle("oculto");
        });
    });
}
