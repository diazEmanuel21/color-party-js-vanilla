// Obtener los elementos del DOM
const lamps = document.querySelectorAll(".lamp");
const lightItems = document.querySelectorAll(".lamp-light");
const songTitle = document.querySelector(".song-container");
const lampSelect = document.getElementById("lamp-select");
const colorPicker = document.getElementById("color-picker");
const applyColorBtn = document.getElementById("apply-color");
const startPartyBtn = document.getElementById("start-party");
const stopPartyBtn = document.getElementById("stop-party");
const partyAudio = document.getElementById("party-audio");
const toastElement = document.getElementById("myToast");
/* Animate references */
let bgAnimation;
let rotationLamp;
let lampFlickerAnimations = [];
// let rotationLamp;
let titleSongAnimation;

// Inicializa el toast
const myToast = new bootstrap.Toast(toastElement);
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
// Variable para almacenar el index de la ultima canción que sonó
let lastIndex = null;


// Función para verificar que haya al menos 3 colores distintos al predeterminado
function validateColors() {
    const validColors = Object.values(lampColors).filter(color => color !== "rgba(255, 248, 229, 0.5)");
    return validColors.length >= 3;
}

// Función para iniciar la cuenta regresiva
function startCountdown(totalTime) {
    const progressBar = document.getElementById('progressBar');

    let remainingTime = totalTime;
    const interval = setInterval(() => {
        // Actualizar la barra de progreso
        const progress = (remainingTime / totalTime) * 100;
        progressBar.style.width = `${parseInt(progress)}%`;
        progressBar.textContent = `${parseInt(progress)}%`;

        // Si se llega a 0, termina la cuenta regresiva
        if (remainingTime <= 0) {
            clearInterval(interval);
            //Se para la fiesta
            stopParty();
        }

        remainingTime--;
    }, 1000); // Decrementa cada segundo
}

//Función encargada de obtener el tiempo proporcionado por el usuario
function startCountdownTest() {
    /* Extrae el valor del rango de tiempo */
    const rangeValueDiv = document.getElementById("rangeValue");
    const rangeText = rangeValueDiv.innerText || rangeValueDiv.textContent;
    const totalTime = parseInt(rangeText.split(":")[1].trim(), 10);

    startCountdown(totalTime)
}

// Función para iniciar la fiesta (efecto estrobo)
function startParty() {
    if (!validateColors()) {
        myToast.show();
        return;
    }
    //Obtener current song del local-storage
    const songRaw = localStorage.getItem('song');
    const indexSong = localStorage.getItem('index-song');

    if (!songRaw || !indexSong) {
        Swal.fire({
            title: '¡Ups! No has seleccionado una canción',
            text: 'Por favor selecciona una canción para iniciar la fiesta.',
            icon: 'info',
            showCancelButton: true, // Agrega un segundo botón opcional si es necesario
            confirmButtonText: 'Ver play list',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirige al usuario
                window.location.href = './pages/media.html';
            }
        });
        return;
    }

    const { files, songName, artist } = JSON.parse(songRaw)[indexSong];
    // files.cover; //img-bg-song 
    partyAudio.src = files.song;
    songTitle.textContent = `${artist} - ${songName}`;

    // Iniciar la reproducción de la canción
    partyAudio.play(); // Reproduce la música cuando se hace clic en "Start party"

    // Resto de la lógica para el efecto de estrobo (cambiar el fondo de pantalla)
    const colors = Object.values(lampColors).filter(color => color !== "rgba(255, 248, 229, 0.5)");
    let index = 0;
    partyInterval = setInterval(() => {
        document.body.style.backgroundColor = colors[index];
        index = (index + 1) % colors.length;
    }, 500);

    // Llamar a las funciones de animación
    animateLampBackground();
    animateLampRotation();
    animateLampFlicker();
    animateSongTitle();

    //llamar contador para progress
    startCountdownTest();
}

// Función para detener el efecto estrobo
function stopParty() {
    clearInterval(partyInterval); // Detener el intervalo que cambia el fondo
    document.body.style.backgroundColor = "#121920"; // Restaurar color de fondo original
    partyAudio.pause(); // Pausar la música
    partyAudio.currentTime = 0; // Reiniciar la canción a su inicio

    /* Pausar animaciónes gsap */
    bgAnimation.pause();
    rotationLamp.pause();
    lampFlickerAnimations.forEach(animation => {
        animation.pause();
    });
    titleSongAnimation.pause();
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
    //Obtener current song del local-storage
    const songRaw = localStorage.getItem('song');
    const indexSong = localStorage.getItem('index-song');

    if (!songRaw || !indexSong) {
        Swal.fire({
            title: '¡Ups! No has seleccionado una canción',
            text: 'Por favor selecciona una canción para iniciar la fiesta.',
            icon: 'info',
            showCancelButton: true, // Agrega un segundo botón opcional si es necesario
            confirmButtonText: 'Ver play list',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirige al usuario
                window.location.href = './pages/media.html';
            }
        });
        return;
    }

    // Reproducir sonido aleatorio
    playRandomSound();

    const selectedLampId = lampSelect.value;
    const selectedColor = colorPicker.value;
    lampColors[selectedLampId] = selectedColor;

    const selectedLamp = document.getElementById(selectedLampId).querySelector(".lamp-light");
    const rgbColor = hexToRgb(selectedColor);
    selectedLamp.style.backgroundColor = rgbColor;

    /* Setear background en "Colores seleccionados" */
    const idCurrentLamp = selectedLampId.split('lamp')[1]; //Obtener el id de la lampara actual
    const colorLamp = document.getElementsByClassName(`color-lamp-${idCurrentLamp}`)[0]; 

    colorLamp.style.backgroundColor = rgbColor;
}

// Función para reproducir un sonido aleatorio
function playRandomSound() {
    const audio = new Audio();
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * 7) + 1;
    } while (randomIndex === lastIndex); // Asegurar que no se repita
    lastIndex = randomIndex;

    const soundPath = `assets/DJ/${String(randomIndex).padStart(2, '0')}.mp3`;
    audio.src = soundPath;
    audio.play();
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
    bgAnimation = gsap.to(".section-lamp", {
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
/* EFECTO 1 */
// function animateLampRotation() {
//     gsap.to(".lamp", {
//         rotation: 15,
//         repeat: -1,
//         yoyo: true,
//         duration: 1.5,
//         ease: "power1.inOut"
//     });
// }
// Animación de las lámparas (efecto de luz de discoteca)
/* EFECTO 2 */
function animateLampRotation() {
    rotationLamp = gsap.to(".lamp", {
        rotationY: 360,
        duration: 4,
        repeat: -1,
        ease: "linear",
    });
}

// Animación de parpadeo de la luz de las lámparas (efecto de luz pulsante)
function animateLampFlicker() {
    lightItems.forEach((light, index) => {
        const flickerAnimation = gsap.to(light, {
            opacity: 0.7,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.5
        });

        lampFlickerAnimations.push(flickerAnimation);
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
    titleSongAnimation = gsap.to(songTitle, {
        x: '-100%',
        duration: 10,
        repeat: -1,
        ease: 'linear',
    });
}

/* Apagar encender lampara */
animateLampToggle();
