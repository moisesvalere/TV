document.addEventListener('DOMContentLoaded', () => {
    fetchAndUpdateChannels();
    setInterval(fetchAndUpdateChannels, 30000); // Actualiza cada 30 segundos

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

// Function to fetch and update channel categories
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

// Function to parse M3U file
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
        }
    }

    return { channels, iframes };
}

// Function to organize channel categories
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

// Function to display channel menu
function displayChannelMenu() {
    const menu = document.getElementById('channel-menu');
    menu.innerHTML = '';

    if (Object.keys(channelCategories).length === 0) {
        menu.textContent = 'No se encontraron categorías.';
        return;
    }

    for (const [channelId, channelCategory] of Object.entries(channelCategories)) {
        const menuItem = document.createElement('li');
        menuItem.textContent = channelCategory.name;
        menuItem.addEventListener('click', () => {
            displayTvgCategories(channelId);
        });

        menu.appendChild(menuItem);
    }
}

// Function to display tvg-id categories
function displayTvgCategories(channelId) {
    const container = document.getElementById('content-container');
    container.innerHTML = '';

    const channelCategory = channelCategories[channelId];

    if (channelCategory && Object.keys(channelCategory.tvgCategories).length > 0) {
        for (const [tvgId, tvgCategory] of Object.entries(channelCategory.tvgCategories)) {
            const tvgElement = document.createElement('div');
            tvgElement.className = 'item category';
            tvgElement.textContent = tvgCategory.name;

            const portadaElement = document.createElement('img');
            portadaElement.src = tvgCategory.portada;
            portadaElement.alt = tvgCategory.name;
            portadaElement.className = 'portada-icon';

            tvgElement.appendChild(portadaElement);

            tvgElement.addEventListener('click', () => {
                displayCategoryItems(channelId, tvgId);
            });

            container.appendChild(tvgElement);
        }
    } else {
        container.textContent = 'No se encontraron subcategorías.';
    }
}

// Function to display items in a category
function displayCategoryItems(channelId, tvgId) {
    const container = document.getElementById('content-container');
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
                    updateIframe(item.url);
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

// Function to update player with a new URL
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

// Function to update iframe with a new URL
function updateIframe(url) {
    const iframe = document.getElementById('videoFrame');
    iframe.src = url;
    document.getElementById('iframe-container').style.display = 'flex';

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
