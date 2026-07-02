import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';

export const useCierreAutomatico = () => {
  const [ejecutando, setEjecutando] = useState(false);
  const [mensaje, setMensaje]       = useState(null);
  const [error, setError]           = useState(null);

  const ejecutarManual = async () => {
    setEjecutando(true);
    setMensaje(null);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/v1/admin/cierre-automatico/ejecutar`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const texto = await res.text();
      setMensaje(texto);
    } catch (e) {
      setError(e.message);
    } finally {
      setEjecutando(false);
    }
  };

  return { ejecutarManual, ejecutando, mensaje, error };
};