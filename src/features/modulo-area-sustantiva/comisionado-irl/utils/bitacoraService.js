import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8081/SIGCQAL_Prod";

export async function obtenerBitacora(folio) {
  if (!folio) {
    throw new Error("Folio es requerido para obtener bitácora");
  }

  try {
    const response = await axios.get(`${API_BASE}/api/bitacora/${folio}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo bitácora para folio ${folio}:`, error);
    throw error;
  }
}

export function formatearEventoBitacora(evento) {
  const tiposEventos = {
    QUEJA: "Queja Registrada",
    ARI: "ARI (Acuerdo de Inicio)",
    ACCI: "ACCI (Conclusión)",
    CIR: "CIR (Constancia Remisión)",
    RESPUESTA_AUTORIDAD: "Respuesta Autoridad",
    OFICIO_AUTORIDAD: "Oficio Autoridad",
    RESOLUCION_FINAL: "Resolución Final",
    NOTIFICACION_CIERRE: "Notificación Cierre",
  };

  return {
    ...evento,
    tipoLabel: tiposEventos[evento.tipo] || evento.tipo || "Evento",
    fechaFormato: evento.fecha
      ? new Date(evento.fecha).toLocaleDateString("es-MX")
      : "—",
  };
}
