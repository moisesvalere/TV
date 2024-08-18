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

