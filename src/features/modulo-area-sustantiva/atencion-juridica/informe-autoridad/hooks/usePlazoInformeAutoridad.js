import { useEffect, useState } from 'react';
import { API_HOST } from '@/shared/config/api';
import { PLAZO_INFORME_AUTORIDAD_ENDPOINT } from '../constants';

export const usePlazoInformeAutoridad = (folio) => {
  const [plazo, setPlazo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!folio) return;
    setCargando(true);
    setError(null);

    fetch(`${API_HOST}${PLAZO_INFORME_AUTORIDAD_ENDPOINT(folio)}`)
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

