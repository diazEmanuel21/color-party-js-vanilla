const audioPlayer = document.getElementById('current-song');

// Elementos del DOM
const songList = document.getElementById("song-list");
const selectedSongDisplay = document.getElementById("selected-song-display");

// Función para renderizar la lista de canciones
async function renderSongList() {
    try {
        // Obtener los datos del archivo JSON
        const response = await fetch("../data/songs.json");
        if (!response.ok) {
            throw new Error("Error al cargar la lista de canciones.");
        }
        const songs = await response.json(); // Parsear los datos como JSON

        // Renderizar la lista de canciones
        songs.forEach((song, index) => {
            // Crear un <li> para la canción
            const li = document.createElement("li");
            li.classList.add("list-group-item");

            // Crear el radio button para la canción
            const radioInput = document.createElement("input");
            radioInput.classList.add("form-check-input", "me-1");
            radioInput.type = "radio";
            radioInput.name = "listGroupRadio"; // Nombre común para los radio buttons
            radioInput.id = `songRadio${index}`; // ID único para cada radio
            radioInput.value = song.path; // Guardar el path de la canción en el valor del radio

            // Crear el label para el radio button
            const label = document.createElement("label");
            label.classList.add("form-check-label");
            label.setAttribute("for", radioInput.id);
            label.textContent = song.name; // Nombre de la canción

            // Añadir el radio button y el label al <li>
            li.appendChild(radioInput);
            li.appendChild(label);

            // Evento para manejar la selección de la canción
            radioInput.addEventListener("click", () => selectSong(song.name, song.path));

            // Añadir el <li> al contenedor de la lista
            songList.appendChild(li);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para manejar la selección de canción
function selectSong(name, path) {
    selectedSongDisplay.textContent = `🎶 ${name}`;
    audioPlayer.src = path;
    audioPlayer.play();
}

// Renderizar la lista al cargar la página
renderSongList();