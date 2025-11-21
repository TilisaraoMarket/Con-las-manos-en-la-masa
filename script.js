document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.textContent = '☰';
                }
            }
        });
    });

    // Form Submission Mock
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                alert('¡Gracias! Hemos recibido tu mensaje. Nos pondremos en contacto pronto.');
                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        });
    });

    // Copy APK link button (index.html)
    const copyApkBtn = document.getElementById('copyApkLink');
    if (copyApkBtn) {
        copyApkBtn.addEventListener('click', () => {
            const apkLink = 'https://www.mediafire.com/file/js2zgyqk15wsx6b/Con_las_manos_en_la_masa.apk/file';
            // Use Clipboard API when available
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(apkLink).then(() => {
                    const status = document.getElementById('copyStatus');
                    if (status) status.textContent = 'Enlace copiado al portapapeles.';
                }).catch(() => {
                    fallbackCopy(apkLink);
                });
            } else {
                fallbackCopy(apkLink);
            }
        });
    }

    function fallbackCopy(text) {
        const input = document.createElement('textarea');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        try {
            document.execCommand('copy');
            const status = document.getElementById('copyStatus');
            if (status) status.textContent = 'Enlace copiado al portapapeles.';
        } catch (err) {
            const status = document.getElementById('copyStatus');
            if (status) status.textContent = 'No se pudo copiar automáticamente. Copiá y pegá este enlace: ' + text;
        }
        document.body.removeChild(input);
    }
});

// --- Funciones de contacto / WhatsApp ---
/**
 * Request the user's geolocation and store it in hidden inputs `loc_lat` and `loc_lon`.
 */
function requestLocation() {
    const statusEl = document.getElementById('locationStatus');
    if (!statusEl) return;
    if (!navigator.geolocation) {
        statusEl.textContent = 'Geolocalización no soportada en este navegador.';
        return;
    }

    statusEl.textContent = 'Obteniendo ubicación...';
    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const latInput = document.getElementById('loc_lat');
        const lonInput = document.getElementById('loc_lon');
        if (latInput) latInput.value = lat;
        if (lonInput) lonInput.value = lon;
        statusEl.textContent = `Ubicación guardada: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    }, function(err) {
        statusEl.textContent = 'No se pudo obtener ubicación: ' + err.message;
    }, { enableHighAccuracy: false, timeout: 10000 });
}

/**
 * Construye el mensaje tomando nombre, opción, texto y ubicación si existe,
 * y abre la URL de WhatsApp en una nueva pestaña.
 */
function sendWhatsAppFromForm() {
    const phone = '5492664548327';
    const nombre = (document.getElementById('name') || {}).value || '';
    const topic = (document.getElementById('topic') || {}).value || '';
    const message = (document.getElementById('message') || {}).value || '';
    const lat = (document.getElementById('loc_lat') || {}).value || '';
    const lon = (document.getElementById('loc_lon') || {}).value || '';

    let msg = '';
    msg += 'Contacto: Martín González\n';
    if (nombre) msg += 'Nombre: ' + nombre + '\n';
    if (topic) msg += 'Motivo: ' + topic + '\n';
    if (message) msg += 'Mensaje: ' + message + '\n';
    if (lat && lon) {
        msg += 'Ubicación: https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lon + '\n';
    }

    const encoded = encodeURIComponent(msg);
    const waUrl = 'https://api.whatsapp.com/send?phone=' + phone + '&text=' + encoded;
    window.open(waUrl, '_blank');
}

