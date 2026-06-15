import { useCallback, useState } from 'react';
import { generarConstancia } from '../services/constanciaService';

const INITIAL_FORM_DATA = {
  documentacionRemite: '',
  motivosRemite: '',
  observaciones: '',
};

export const useGenerarConstancia = (expedienteId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerarConstancia = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await generarConstancia(expedienteId, formData);
      setSuccess(true);
      setFormData(INITIAL_FORM_DATA);
      return { ok: true };
    } catch (err) {
      const message = err?.message || 'Error al generar constancia';
      setError(message);
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setFormData(INITIAL_FORM_DATA);
  }, []);

  return {
    formData,
    handleChange,
    handleGenerarConstancia,
    loading,
    error,
    success,
    resetState,
  };
};
