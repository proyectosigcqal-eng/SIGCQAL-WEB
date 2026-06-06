import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const usePlazoPrevencion = (folio) => {
  const [plazo, setPlazo]       = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!folio) return;
    setCargando(true);

    fetch(`${API_BASE}/api/v1/expedientes/${folio}/plazo-prevencion`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(setPlazo)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [folio]);

  return { plazo, cargando, error };
};