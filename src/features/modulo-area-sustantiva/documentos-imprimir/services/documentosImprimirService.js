import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081/SIGCQAL_dev";

export const generarPreviewCIR = async (expedienteId, payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/expedientes/${expedienteId}/constancia-interna-remision/preview`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error al generar preview CIR:", error);
    throw error;
  }
};

export const generarDocumentoAsesoria = async (expedienteId, payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/expedientes/${expedienteId}/constancia-interna-remision/generate`,
      payload,
      { responseType: "blob", headers: { "Content-Type": "application/json" } },
    );
    descargarArchivo(response.data, `CIR_${expedienteId}.docx`);
    return true;
  } catch (error) {
    console.error("Error al generar Asesoría:", error);
    throw error;
  }
};

export const generarDocumentoRepresentacion = async (idDemanda, payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/irl-demanda-amparo/${idDemanda}/generar-demanda`,
      payload,
      { responseType: "blob", headers: { "Content-Type": "application/json" } },
    );
    descargarArchivo(response.data, `Demanda_${idDemanda}.docx`);
    return true;
  } catch (error) {
    console.error("Error al generar Demanda:", error);
    throw error;
  }
};

export const generarDocumentoInforme = async (idResolucion, payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/modulo-area-sustantiva/resolucion-final/${idResolucion}/generar-oficio`,
      payload,
      { responseType: "blob", headers: { "Content-Type": "application/json" } },
    );
    descargarArchivo(response.data, `ResolucionFinal_${idResolucion}.docx`);
    return true;
  } catch (error) {
    console.error("Error al generar Informe:", error);
    throw error;
  }
};

const descargarArchivo = (blob, nombreArchivo) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", nombreArchivo);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};
