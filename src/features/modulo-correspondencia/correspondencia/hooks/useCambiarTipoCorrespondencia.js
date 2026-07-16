import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../../shared/config/api';

export const useCambiarTipoCorrespondencia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cambiarTipo = async (idCorrespondencia, idTipoCorrespondencia) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/correspondencias/entrada/${idCorrespondencia}/tipo-correspondencia`,
        { idTipoCorrespondencia }
      );
      return response.data;
    } catch (err) {
      const mensaje = err?.response?.data?.detail || 'Error al cambiar tipo';
      setError(mensaje);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { cambiarTipo, loading, error };
};
