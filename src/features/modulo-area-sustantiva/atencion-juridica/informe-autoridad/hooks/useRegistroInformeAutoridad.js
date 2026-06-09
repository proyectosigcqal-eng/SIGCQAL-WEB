import { useMemo, useState } from 'react';
import { registrarInformeAutoridad } from '../services/informeAutoridadService';

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const useRegistroInformeAutoridad = ({ folio, onSuccess } = {}) => {
  const [fechaRecepcion, setFechaRecepcion] = useState(todayISO());
  const [numeroOficioRespuesta, setNumeroOficioRespuesta] = useState('');
  const [fojas, setFojas] = useState('');
  const [archivoPdf, setArchivoPdf] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const isValid = useMemo(() => {
    const f = Number(fojas);
    return (
      Boolean(folio) &&
      Boolean(fechaRecepcion) &&
      Boolean(numeroOficioRespuesta?.trim()) &&
      Number.isFinite(f) &&
      f > 0 &&
      Boolean(archivoPdf)
    );
  }, [folio, fechaRecepcion, numeroOficioRespuesta, fojas, archivoPdf]);

  const handleArchivoChange = (file) => {
    setError(null);
    setSuccessMessage(null);
    if (!file) {
      setArchivoPdf(null);
      return;
    }
    if (file.type !== 'application/pdf') {
      setArchivoPdf(null);
      setError('El archivo debe ser un PDF.');
      return;
    }
    setArchivoPdf(file);
  };

  const submit = async () => {
    if (!isValid) {
      setError('Completa los campos obligatorios antes de guardar.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await registrarInformeAutoridad({
        folio,
        fechaRecepcion,
        numeroOficioRespuesta: numeroOficioRespuesta.trim(),
        fojas: Number(fojas),
        archivoPdf,
      });
      setSuccessMessage('Informe registrado correctamente.');
      if (onSuccess) onSuccess();
    } catch {
      setError('No fue posible guardar el informe. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fechaRecepcion,
    setFechaRecepcion,
    numeroOficioRespuesta,
    setNumeroOficioRespuesta,
    fojas,
    setFojas,
    archivoPdf,
    handleArchivoChange,
    isSubmitting,
    error,
    successMessage,
    isValid,
    submit,
  };
};

