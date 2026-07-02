import axios from 'axios'; // O tu cliente HTTP de preferencia

const API_URL = 'http://localhost:8081/SIGCQAL_Prod/api';

export const cerrarExpediente = async (payload) => {
  const res = await fetch(`${API}/api/v1/cierre-expediente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detalle = await res.text().catch(() => res.status);
    throw new Error(`Error ${res.status}: ${detalle}`);
  }

  // ✅ si el body está vacío (204 / void) no reventamos
  const text = await res.text();
  return text ? JSON.parse(text) : { success: true };
};