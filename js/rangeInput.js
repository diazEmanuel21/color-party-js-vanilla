const multiplier = 20; // Define el número de segundos por unidad
const inputRange = document.getElementById("rangeInput"); // Referencia al input range
const rangeValue = document.getElementById("rangeValue"); // Referencia al div donde se muestra el tiempo

// Función encargada de actualizar el rango proporcionado por el menú
function updateRangeValue(value) {
    const totalTime = value * multiplier; // Calcula el tiempo total
    rangeValue.innerText = `Tiempo(s): ${totalTime}`; // Actualiza el texto del div
}

// Agregar el evento 'input' para que se actualice mientras se mueve el slider
inputRange.addEventListener("input", function () {
    updateRangeValue(this.value);
});