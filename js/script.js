// Obtener los elementos del DOM
const lamps = document.querySelectorAll('.lamp');
const lightItems = document.querySelectorAll('.lamp-light');
const songTitle = document.querySelector('.song-title');
const lampSelect = document.getElementById("lamp-select");
const colorPicker = document.getElementById("color-picker");
const applyColorBtn = document.getElementById("apply-color");
const startPartyBtn = document.getElementById("start-party");
const stopPartyBtn = document.getElementById("stop-party");

// Objeto para almacenar los colores de cada lámpara (inicialmente con un color predeterminado)
const lampColors = {
    lamp1: "rgba(255, 248, 229, 0.5)",
    lamp2: "rgba(255, 248, 229, 0.5)",
    lamp3: "rgba(255, 248, 229, 0.5)",
    lamp4: "rgba(255, 248, 229, 0.5)",
    lamp5: "rgba(255, 248, 229, 0.5)"
};

// Variable para almacenar el ID del intervalo (para detenerlo después)
let partyInterval;

// Función para verificar que haya al menos 3 colores distintos al predeterminado
function validateColors() {
    const validColors = Object.values(lampColors).filter(color => color !== "rgba(255, 248, 229, 0.5)");
    return validColors.length >= 3;
}

// Función para iniciar la fiesta (efecto estrobo)
function startParty() {
    if (!validateColors()) {
        alert("¡Selecciona más colores para iniciar la fiesta!");
        return;
    }

    const colors = Object.values(lampColors).filter(color => color !== "rgba(255, 248, 229, 0.5)");

    let index = 0;
    // Cambiar el fondo del body haciendo un efecto estrobo
    partyInterval = setInterval(() => {
        document.body.style.backgroundColor = colors[index];
        index = (index + 1) % colors.length;
    }, 500);
}

// Función para detener el efecto estrobo
function stopParty() {
    clearInterval(partyInterval);
    document.body.style.backgroundColor = "#121920"; // Restaurar el color de fondo original
}

// Función para convertir un valor hexadecimal en RGBA
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(hex => hex + hex).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
}

// Función para actualizar el color de la lámpara seleccionada
function applyLampColor() {
    const selectedLampId = lampSelect.value;
    const selectedColor = colorPicker.value;
    lampColors[selectedLampId] = selectedColor;

    const selectedLamp = document.getElementById(selectedLampId).querySelector(".lamp-light");
    const rgbColor = hexToRgb(selectedColor);
    selectedLamp.style.backgroundColor = rgbColor;
}

// Función para escuchar el cambio de lámpara y actualizar el color en el color-picker
function updateColorPicker() {
    const selectedLampId = lampSelect.value;
    const selectedLampColor = lampColors[selectedLampId];
    colorPicker.value = selectedLampColor;
}

// Evento para aplicar el color seleccionado al hacer clic en "Aplicar color"
applyColorBtn.addEventListener("click", applyLampColor);

// Evento para cambiar el color en el color-picker cuando se selecciona una lámpara
lampSelect.addEventListener("change", updateColorPicker);

// Evento para iniciar la fiesta cuando se haga clic en el botón
startPartyBtn.addEventListener("click", startParty);

// Evento para detener el efecto cuando se haga clic en el botón "Stop party"
stopPartyBtn.addEventListener("click", stopParty);

// Animaciones utilizando GSAP

// Animación para el fondo de la lámpara (movimiento suave de fondo)
function animateLampBackground() {
    gsap.to(".section-lamp", {
        x: "+=20",
        y: "+=10",
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 0.2
    });
}

// Animación de las lámparas (efecto colgante)
function animateLampRotation() {
    gsap.to(".lamp", {
        rotation: 15,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut"
    });
}

// Animación de parpadeo de la luz de las lámparas (efecto de luz pulsante)
function animateLampFlicker() {
    lightItems.forEach((light, index) => {
        gsap.to(light, {
            opacity: 0.7,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.5
        });
    });
}

// Función para alternar el estado de las lámparas (encendida/apagada) con animaciones
function animateLampToggle() {
    lamps.forEach((lamp, index) => {
        const light = lightItems[index];

        lamp.addEventListener('click', () => {
            if (light.classList.contains('on')) {
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
}

// Función para animar la canción con GSAP
function animateSongTitle() {
    gsap.to(songTitle, {
        x: '-100%',
        duration: 10,
        repeat: -1,
        ease: 'linear',
    });
    setTimeout(() => {
        songTitle.textContent = '"Dancing Queen - ABBA"';
        gsap.fromTo(songTitle, { x: '100%' }, { x: '-100%', duration: 10, repeat: -1, ease: 'linear' });
    }, 15000); // Cambia la canción después de 15 segundos
}

// Llamar a las funciones de animación
animateLampBackground();
animateLampRotation();
animateLampFlicker();
animateLampToggle();
animateSongTitle();