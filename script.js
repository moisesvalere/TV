

document.addEventListener('DOMContentLoaded', () => {
    fetchAndUpdateChannels();
    setInterval(fetchAndUpdateChannels, 3000000); // Actualiza cada 30 segundos

    document.getElementById('player-container').style.display = 'none';
    document.getElementById('iframe-container').style.display = 'none';

    document.getElementById('close-player').addEventListener('click', () => {
        const playerContainer = document.getElementById('player-container');
        playerContainer.style.display = 'none';

        const playerInstance = jwplayer("aRzklaXf");
        if (playerInstance) {
            playerInstance.remove();
        }
    });

    document.getElementById('close-iframe').addEventListener('click', () => {
        const iframeContainer = document.getElementById('iframe-container');
        iframeContainer.style.display = 'none';

        const iframe = document.getElementById('videoFrame');
        iframe.src = '';
    });
});

let channelCategories = {};

// URL del archivo M3U en GitHub
const githubUrl = 'https://raw.githubusercontent.com/moisesvalere/portales/main/portales';

// Función para obtener y actualizar las categorías de canales
function fetchAndUpdateChannels() {
    fetch(githubUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const { channels, iframes } = parseM3U(data);
            organizeChannelCategories(channels, iframes);
            displayChannelMenu();
        })
        .catch(error => console.error('Error fetching M3U file:', error));
}

// Función para analizar el archivo M3U
function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    const iframes = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXTINF')) {
            const logoMatch = lines[i].match(/tvg-logo="([^"]+)"/);
            const logo = logoMatch ? logoMatch[1] : '';

            const portadaMatch = lines[i].match(/portada="([^"]+)"/);
            const portada = portadaMatch ? portadaMatch[1] : '';

            const titleMatch = lines[i].match(/group-title="[^"]*",([^,]+)/);
            const title = titleMatch ? titleMatch[1] : '';
            
            const tvgIdMatch = lines[i].match(/tvg-id="([^"]*)"/);
            const tvgId = tvgIdMatch ? tvgIdMatch[1] : '';

            const channelIdMatch = lines[i].match(/channel-id="([^"]*)"/);
            const channelId = channelIdMatch ? channelIdMatch[1] : '';

            const url = lines[i + 1] ? lines[i + 1].trim() : '';

            if (logo && title && url && channelId) {
                channels.push({ logo, portada, title, url, channelId, tvgId });
            }
        } else if (lines[i].startsWith('#IFRAME')) {
            const logoMatch = lines[i].match(/tvg-logo="([^"]+)"/);
            const logo = logoMatch ? logoMatch[1] : '';

            const portadaMatch = lines[i].match(/portada="([^"]+)"/);
            const portada = portadaMatch ? portadaMatch[1] : '';
            
            const titleMatch = lines[i].match(/group-title="[^"]*",([^,]+)/);
            const title = titleMatch ? titleMatch[1] : '';
            
            const tvgIdMatch = lines[i].match(/tvg-id="([^"]*)"/);
            const tvgId = tvgIdMatch ? tvgIdMatch[1] : '';

            const channelIdMatch = lines[i].match(/channel-id="([^"]*)"/);
            const channelId = channelIdMatch ? channelIdMatch[1] : '';

            const url = lines[i + 1] ? lines[i + 1].trim() : '';

            if (logo && title && url && channelId) {
                iframes.push({ logo, portada, title, url, channelId, tvgId });
            }
        } else if (lines[i].startsWith('#NORMAL:-1')) {
            const logoMatch = lines[i].match(/tvg-logo="([^"]+)"/);
            const logo = logoMatch ? logoMatch[1] : '';

            const portadaMatch = lines[i].match(/portada="([^"]+)"/);
            const portada = portadaMatch ? portadaMatch[1] : '';
            
            const titleMatch = lines[i].match(/group-title="[^"]*",([^,]+)/);
            const title = titleMatch ? titleMatch[1] : '';
            
            const tvgIdMatch = lines[i].match(/tvg-id="([^"]*)"/);
            const tvgId = tvgIdMatch ? tvgIdMatch[1] : '';

            const channelIdMatch = lines[i].match(/channel-id="([^"]*)"/);
            const channelId = channelIdMatch ? channelIdMatch[1] : '';

            const url = lines[i + 1] ? lines[i + 1].trim() : '';

            if (logo && title && url && channelId) {
                iframes.push({ logo, portada, title, url, channelId, tvgId, normal: true });
            }
        }
    }

    return { channels, iframes };
}

// Función para organizar las categorías de canales
function organizeChannelCategories(channels, iframes) {
    channelCategories = {};

    [...channels, ...iframes].forEach(item => {
        if (!channelCategories[item.channelId]) {
            channelCategories[item.channelId] = {
                name: item.channelId,
                tvgCategories: {}
            };
        }

        if (!channelCategories[item.channelId].tvgCategories[item.tvgId]) {
            channelCategories[item.channelId].tvgCategories[item.tvgId] = {
                name: item.tvgId,
                portada: item.portada,
                items: []
            };
        }
        
        channelCategories[item.channelId].tvgCategories[item.tvgId].items.push(item);
    });
}

// Función para mostrar el menú de canales
function displayChannelMenu() {
    const menu = document.getElementById('channel-menu');
    menu.innerHTML = '';

    // Crea el nav con la clase 'navegacion'
    const nav = document.createElement('nav');
    nav.className = 'navegacion';

    // Si no hay categorías, muestra un mensaje
    if (Object.keys(channelCategories).length === 0) {
        menu.textContent = 'No se encontraron categorías.';
        return;
    }

    // Crea el div con la clase 'nombre-pagina'
    const divNombrePagina = document.createElement('div');
    divNombrePagina.className = 'nombre-pagina';

    // Agrega el ícono y el span al divNombrePagina
    const icon = document.createElement('ion-icon');
    icon.id = 'cloud';
    icon.name = 'cloud-outline';

    const span = document.createElement('span');
    span.textContent = 'Apex';

    divNombrePagina.appendChild(icon);
    divNombrePagina.appendChild(span);

    menu.appendChild(divNombrePagina);

    // Agrega el divNombrePagina al nav
    nav.appendChild(divNombrePagina);

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

        span.addEventListener('click', (event) => {
            event.preventDefault();
            displayTvgCategories(channelId);
        });
    }

    // Agrega el nav al menu
    menu.appendChild(nav);

    // Agrega el event listener al ícono después de que se haya agregado al DOM
    const cloud = document.getElementById("cloud");

    const barraLateral = document.querySelector(".barra-lateral");
    const spans = document.querySelectorAll("span");

    cloud.addEventListener("click", () => {
        barraLateral.classList.toggle("mini-barra-lateral");
        spans.forEach((span) => {
            span.classList.toggle("oculto");
        });
    });

}



// Función para mostrar las categorías de tvg-id
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
    cloudIcon.name = 'radio-outline';

    const apexSpan = document.createElement('span');
    apexSpan.textContent = 'TV GRATIS';

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

    // Agrega el event listener al ícono después de que se haya agregado al DOM
    const cloud = document.getElementById("cloud");

    const barraLateral = document.querySelector(".barra-lateral");
    const spans = document.querySelectorAll("span");
    const palanca = document.querySelector(".switch");
    const circulo = document.querySelector(".circulo");
    const men = document.querySelector(".menu");
    const main = document.querySelector("main");


    men.addEventListener("click",()=>{
        barraLateral.classList.toggle("max-barra-lateral");
        if(barraLateral.classList.contains("max-barra-lateral")){
            men.children[0].style.display = "none";
            men.children[1].style.display = "block";
        }
        else{
            men.children[0].style.display = "block";
            men.children[1].style.display = "none";
        }
});


    palanca.addEventListener("click",()=>{
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









// Función para mostrar las categorías de tvg-id
function displayTvgCategories(channelId) {
    const container = document.getElementById('main-content');
    container.innerHTML = '';

    const channelCategory = channelCategories[channelId];

    if (channelCategory && Object.keys(channelCategory.tvgCategories).length > 0) {
        for (const [tvgId, tvgCategory] of Object.entries(channelCategory.tvgCategories)) {
            const tvgElement = document.createElement('div');
            tvgElement.className = 'item category';

            // Crear contenedor para icono y texto
            const innerContainer = document.createElement('div');
            innerContainer.className = 'inner-container'; // Clase adicional para estilizar si es necesario

            // Crear y añadir el icono de portada
            const portadaElement = document.createElement('img');
            portadaElement.src = tvgCategory.portada;
            portadaElement.alt = tvgCategory.name;
            portadaElement.className = 'portada-icon';

            // Crear y añadir el texto del nombre
            const textElement = document.createElement('p');
            textElement.textContent = tvgCategory.name;

            // Añadir icono y texto al contenedor interno
            innerContainer.appendChild(portadaElement);
            innerContainer.appendChild(textElement);

            // Añadir el contenedor interno al div principal
            tvgElement.appendChild(innerContainer);

            tvgElement.addEventListener('click', () => {
                displayCategoryItems(channelId, tvgId);
            });

            container.appendChild(tvgElement);
        }
    } else {
        container.textContent = 'No se encontraron subcategorías.';
    }
}

// Función para mostrar los elementos en una categoría
function displayCategoryItems(channelId, tvgId) {
    const container = document.getElementById('main-content');
    container.innerHTML = '';

    const tvgCategory = channelCategories[channelId]?.tvgCategories[tvgId];

    if (tvgCategory && tvgCategory.items.length > 0) {
        tvgCategory.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';

            const logoElement = document.createElement('img');
            logoElement.src = item.logo;
            logoElement.alt = item.title;
            logoElement.addEventListener('click', () => {
                if (item.url.endsWith('.m3u8') || item.url.endsWith('.mp4')) {
                    updatePlayer(item.url);
                } else {
                    updateIframe(item.url, item.normal);
                }
            });

            const titleElement = document.createElement('p');
            titleElement.textContent = item.title;

            itemElement.appendChild(logoElement);
            itemElement.appendChild(titleElement);
            container.appendChild(itemElement);
        });
    } else {
        container.textContent = 'No se encontraron elementos.';
    }
}



// Función para actualizar el reproductor con una nueva URL
function updatePlayer(url) {
    document.getElementById('player-container').style.display = 'flex';
    jwplayer("aRzklaXf").setup({
        file: url,
        width: "100%",
        height: "100%",
        controls: true,
        autoplay: true
    });
}

// Función para actualizar el iframe con una nueva URL
function updateIframe(url, normal = false) {
    const iframe = document.getElementById('videoFrame');
    iframe.src = url;
    document.getElementById('iframe-container').style.display = 'flex';

    if (!normal) {
        // Agregar función para eliminar anuncios del iframe
        iframe.onload = function() {
            const iframeWindow = iframe.contentWindow;

            function removeAds() {
                try {
                    // Ejemplo de eliminación de anuncios específicos
                    const ads = iframeWindow.document.querySelectorAll('.ad, .advertisement, .adsbygoogle, [id^="google_ads"], [class^="ad-"]');
                    ads.forEach(ad => ad.remove());

                    // Remover elementos de script que puedan cargar anuncios
                    const scripts = iframeWindow.document.querySelectorAll('script');
                    scripts.forEach(script => {
                        if (script.src.includes('ad') || script.src.includes('ads')) {
                            script.remove();
                        }
                    });

                    // Remover iframes de publicidad
                    const adIframes = iframeWindow.document.querySelectorAll('iframe');
                    adIframes.forEach(adIframe => {
                        if (adIframe.src.includes('ad') || adIframe.src.includes('ads')) {
                            adIframe.remove();
                        }
                    });

                    // Remover pop-ups y overlays de anuncios
                    const popups = iframeWindow.document.querySelectorAll('.popup, .overlay');
                    popups.forEach(popup => popup.remove());
                } catch (error) {
                    console.error('Error removing ads:', error);
                }
            }

            removeAds();

            // Ejemplo de ejecución periódica para remover anuncios que aparezcan dinámicamente
            const removeAdsInterval = setInterval(removeAds, 2000);

            // Detener la ejecución periódica después de un tiempo
            setTimeout(() => clearInterval(removeAdsInterval), 30000);
        };
    }
}
