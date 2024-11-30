// Obtener los elementos del DOM
const lamps = document.querySelectorAll('.lamp');
const lightItems = document.querySelectorAll('.lamp-light');
const songTitle = document.querySelector('.song-title');
const lampSelect = document.getElementById("lamp-select");
const colorPicker = document.getElementById("color-picker");
const applyColorBtn = document.getElementById("apply-color");

// Objeto para almacenar los colores de cada lámpara (inicialmente con un color predeterminado)
const lampColors = {
    lamp1: "rgba(255, 248, 229, 0.5)",
    lamp2: "rgba(255, 248, 229, 0.5)",
    lamp3: "rgba(255, 248, 229, 0.5)",
    lamp4: "rgba(255, 248, 229, 0.5)",
    lamp5: "rgba(255, 248, 229, 0.5)"
};

// Función para convertir un valor hexadecimal en RGBA (con opacidad)
function hexToRgb(hex) {
    hex = hex.replace(/^#/, ''); // Eliminar el símbolo '#' si existe
    if (hex.length === 3) { // Si el valor es de 3 caracteres, duplicamos cada uno
        hex = hex.split('').map(hex => hex + hex).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, 0.5)`; // Devuelve el valor en formato RGBA
}

// Función para actualizar el color de la lámpara seleccionada
function applyLampColor() {
    const selectedLampId = lampSelect.value; // Obtener la lámpara seleccionada
    const selectedColor = colorPicker.value; // Obtener el color seleccionado

    // Actualizar el color de la lámpara en el objeto lampColors
    lampColors[selectedLampId] = selectedColor;

    // Cambiar el color de la lámpara en el DOM
    const selectedLamp = document.getElementById(selectedLampId).querySelector(".lamp-light");
    const rgbColor = hexToRgb(selectedColor); // Convertir el color a formato RGBA
    selectedLamp.style.backgroundColor = rgbColor; // Aplicar el color a la lámpara
}

// Evento para aplicar el color seleccionado al hacer clic en "Aplicar color"
applyColorBtn.addEventListener("click", applyLampColor);

// Función para escuchar el cambio de lámpara y actualizar el color en el color-picker
lampSelect.addEventListener("change", () => {
    const selectedLampId = lampSelect.value; // Obtener la lámpara seleccionada
    const selectedLampColor = lampColors[selectedLampId]; // Obtener el color de la lámpara seleccionada
    colorPicker.value = selectedLampColor; // Establecer el color en el selector
});

// Animaciones utilizando GSAP

// Animación para el fondo de la lámpara (movimiento suave de fondo)
gsap.to(".section-lamp", {
    x: "+=20",    // Mover hacia la derecha
    y: "+=10",    // Mover hacia abajo
    duration: 1,   // Duración de la animación
    repeat: -1,    // Repetir indefinidamente
    yoyo: true,    // Alternar entre las posiciones
    ease: "power1.inOut", // Suavizar la animación
    delay: 0.2     // Retraso para crear un efecto más orgánico
});

// Animación de las lámparas (efecto colgante)
gsap.to(".lamp", {
    rotation: 15,  // Rotación de las lámparas
    repeat: -1,    // Repetir indefinidamente
    yoyo: true,    // Alternar la rotación
    duration: 1.5, // Duración de la animación
    ease: "power1.inOut"
});

// Animación de parpadeo de la luz de las lámparas (efecto de luz pulsante)
lightItems.forEach((light, index) => {
    gsap.to(light, {
        opacity: 0.7,    // Opacidad de la luz
        duration: 0.5,   // Duración de la animación
        repeat: -1,      // Repetir indefinidamente
        yoyo: true,      // Alternar opacidad
        ease: "sine.inOut", // Suavizar la animación
        delay: index * 0.5  // Desfase en el parpadeo para las lámparas en secuencia
    });
});

// Función para alternar el estado de las lámparas (encendida/apagada) con animaciones
lamps.forEach((lamp, index) => {
    const light = lightItems[index];

    lamp.addEventListener('click', () => {
        if (light.classList.contains('on')) {
            // Apagar la lámpara con una animación
            gsap.to(light, {
                duration: 0.3,
                opacity: 0,      // Desvanecer la lámpara
                scale: 0.8,      // Reducir tamaño
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
                opacity: 1,      // Aumentar la opacidad
                scale: 1,        // Restaurar tamaño
                ease: "power2.out"
            });
        }
    });
});

// Animación de la canción con GSAP
gsap.to(songTitle, {
    x: '-100%',         // Mueve el texto hacia la izquierda fuera de la pantalla
    duration: 10,       // Duración de la animación
    repeat: -1,         // Repetir indefinidamente
    ease: 'linear',     // Desplazamiento constante
});

// Cambiar la canción después de unos segundos
setTimeout(() => {
    songTitle.textContent = '"Dancing Queen - ABBA"';
    gsap.fromTo(songTitle, { x: '100%' }, { x: '-100%', duration: 10, repeat: -1, ease: 'linear' });
}, 15000); // Cambia la canción después de 15 segundos
