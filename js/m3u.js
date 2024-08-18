// URL del archivo M3U en GitHub
const githubUrl = 'https://raw.githubusercontent.com/Tequiroconmigo/portal/main/deporte.m3u';

// Función para obtener y actualizar las categorías de canales
function fetchAndUpdateChannels() {
    // Realiza una solicitud fetch para obtener el archivo M3U desde GitHub
    fetch(githubUrl)
        .then(response => {
            // Verifica si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Retorna el contenido del archivo como texto
            return response.text();
        })
        .then(data => {
            // Analiza el contenido del archivo M3U y organiza los datos
            const { channels, iframes } = parseM3U(data);
            organizeChannelCategories(channels, iframes);
            displayChannelMenu(); // Asegúrate de que esta función esté definida
        })
        .catch(error => console.error('Error fetching M3U file:', error));
}

// Función para analizar el archivo M3U
function parseM3U(data) {
    // Divide el contenido del archivo en líneas
    const lines = data.split('\n');
    const channels = [];
    const iframes = [];

    // Itera sobre cada línea del archivo
    for (let i = 0; i < lines.length; i++) {
        // Si la línea comienza con #EXTINF, es una entrada de canal
        if (lines[i].startsWith('#EXTINF')) {
            // Extrae la información del canal usando expresiones regulares
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

            // Si se extrajo toda la información requerida, agrega el canal al arreglo
            if (logo && title && url && channelId) {
                channels.push({ logo, portada, title, url, channelId, tvgId });
            }
        // Si la línea comienza con #IFRAME, es una entrada de iframe
        } else if (lines[i].startsWith('#IFRAME')) {
            // Extrae la información del iframe usando expresiones regulares
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

            // Si se extrajo toda la información requerida, agrega el iframe al arreglo
            if (logo && title && url && channelId) {
                iframes.push({ logo, portada, title, url, channelId, tvgId });
            }
        // Si la línea comienza con #NORMAL:-1, es una entrada de iframe sin anuncios
        } else if (lines[i].startsWith('#NORMAL:-1')) {
            // Extrae la información del iframe sin anuncios usando expresiones regulares
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

            // Si se extrajo toda la información requerida, agrega el iframe sin anuncios al arreglo
            if (logo && title && url && channelId) {
                iframes.push({ logo, portada, title, url, channelId, tvgId, normal: true });
            }
        }
    }

    // Retorna los arreglos de canales e iframes
    return { channels, iframes };
}

// Función para organizar las categorías de canales
function organizeChannelCategories(channels, iframes) {
    // Crea un objeto para almacenar las categorías de canales
    let channelCategories = {};

    // Combina los arreglos de canales e iframes
    [...channels, ...iframes].forEach(item => {
        // Si el canal/iframe no existe en el objeto, lo inicializa
        if (!channelCategories[item.channelId]) {
            channelCategories[item.channelId] = {
                name: item.channelId,
                tvgCategories: {}
            };
        }

        // Si la categoría tvg no existe, la inicializa
        if (!channelCategories[item.channelId].tvgCategories[item.tvgId]) {
            channelCategories[item.channelId].tvgCategories[item.tvgId] = {
                name: item.tvgId,
                portada: item.portada,
                items: []
            };
        }
        
        // Agrega el canal/iframe a la categoría tvg correspondiente
        channelCategories[item.channelId].tvgCategories[item.tvgId].items.push(item);
    });
}
