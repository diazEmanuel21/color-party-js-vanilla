const lamps = document.querySelectorAll('.lamp');
const lightItems = document.querySelectorAll('.lamp-light');
const songTitle = document.querySelector('.song-title');

/* Transform from hex to rgb */
function hexToRgb(hex) {
    hex = hex.replace(/^#/, ''); // Eliminar el símbolo # si existe
    if (hex.length === 3) {
        hex = hex.split('').map(hex => hex + hex).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
}

// Función para alternar la lámpara entre encendida y apagada con animaciones de GSAP
lamps.forEach((lamp, index) => {
    const light = lightItems[index];

    lamp.addEventListener('click', () => {
        if (light.classList.contains('on')) {
            // Apagar la lámpara con una animación
            gsap.to(light, { 
                duration: 0.3, 
                opacity: 0, 
                scale: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    light.classList.remove('on');
                    light.classList.add('off');
                }
            });
        } else {
            // Encender la lámpara con una animación
            light.classList.remove('off');
            light.classList.add('on');
            gsap.fromTo(light, { opacity: 0, scale: 0.8 }, { 
                duration: 0.5, 
                opacity: 1, 
                scale: 1,
                ease: "power2.out" 
            });
        }
    });
});

// Función para cambiar el color de cada lámpara
const colorInputs = document.querySelectorAll('.color-menu input');

colorInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        const light = lightItems[index];
        const color = input.value;
        const rgbColor = hexToRgb(color);
        gsap.to(light, { 
            backgroundColor: rgbColor,
            duration: 0.5,
            ease: "power2.inOut"
        });
    });
});

// Animación de parpadeo de la luz de la lámpara (efecto de luz pulsante)
lightItems.forEach((light, index) => {
    gsap.to(light, {
        opacity: 0.7,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5  // Hace que las lámparas parpadeen en secuencia
    });
});


// Animación del fondo SVG con GSAP
gsap.to(".section-lamp", {
    x: "+=20",    // Mover hacia la derecha
    y: "+=10",    // Mover hacia abajo
    duration: 1,   // Duración de la animación
    repeat: -1,    // Repetir indefinidamente
    yoyo: true,    // Alternar entre las posiciones
    ease: "power1.inOut", // Suavizar la animación
    delay: 0.2     // Retraso para crear un efecto más orgánico
});

// Otra animación para las lámparas con GSAP
gsap.to(".lamp", {
    rotation: 15,  // Rotar las lámparas
    repeat: -1,    // Repetir indefinidamente
    yoyo: true,    // Alternar la rotación
    duration: 1.5, // Duración
    ease: "power1.inOut"
});



// Configura la animación para que sea fluida y en bucle infinito
gsap.to(songTitle, {
    x: '-100%', // Mueve el texto hacia la izquierda fuera de la pantalla
    duration: 10, // Duración en segundos
    repeat: -1, // Repetir infinitamente
    ease: 'linear',
});

// Cambiar la canción después de unos segundos (puedes conectar esto a un reproductor en el futuro)
setTimeout(() => {
    songTitle.textContent = '"Dancing Queen - ABBA"';
    gsap.fromTo(songTitle, { x: '100%' }, { x: '-100%', duration: 10, repeat: -1, ease: 'linear' });
}, 15000); // Cambia la canción después de 15 segundos
