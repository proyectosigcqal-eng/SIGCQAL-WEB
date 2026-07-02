const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';
// ✅ sin /api al final — la ruta completa va en el fetch

export const cerrarExpediente = async (payload) => {
  const res = await fetch(`${API_BASE}/api/notificacion-cierre-acuerdo-razon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detalle = await res.text().catch(() => String(res.status));
    throw new Error(`Error ${res.status}: ${detalle}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : { success: true };
};