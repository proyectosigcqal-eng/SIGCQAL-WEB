import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const useTurnado = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError]       = useState(null);
  const [resultado, setResultado] = useState(null);

  const turnar = async (folio, idUsuario = null) => {
    setCargando(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/v1/quejas/${folio}/turnar`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idUsuario }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? `Error ${res.status}`);
      }
      const data = await res.json();
      setResultado(data);
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setCargando(false);
    }
  };

  return { turnar, cargando, error, resultado };
};