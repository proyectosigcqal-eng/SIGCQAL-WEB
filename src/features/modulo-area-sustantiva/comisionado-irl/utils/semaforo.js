export function obtenerColorSemaforo(diasRestantes) {
  if (diasRestantes > 10) {
    return "VERDE";
  }
  if (diasRestantes > 5) {
    return "AMARILLO";
  }
  if (diasRestantes > 0) {
    return "ROJO";
  }
  return "VENCIDO";
}

export function obtenerClaseSemaforo(diasRestantes) {
  const color = obtenerColorSemaforo(diasRestantes);

  return {
    VERDE: "semaforo-verde",
    AMARILLO: "semaforo-amarillo",
    ROJO: "semaforo-rojo",
    VENCIDO: "semaforo-vencido",
  }[color];
}

export function formatearFecha(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
