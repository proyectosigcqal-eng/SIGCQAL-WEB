import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const useFicha = (folio) => {
  const [detalle, setDetalle]   = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!folio) return;
    setCargando(true);
    setError(null);

    fetch(`${API_BASE}/api/v1/expedientes/${folio}/detalle-asesoria`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: expediente no encontrado`);
        return res.json();
      })
      .then(setDetalle)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [folio]);

  const verDocumentos = () => {
    window.open(
      `${API_BASE}/api/v1/expedientes/${folio}/constancia-pdf`,
      '_blank'
    );
  };

  return { detalle, cargando, error, verDocumentos };
};