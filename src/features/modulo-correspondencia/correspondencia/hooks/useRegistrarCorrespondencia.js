import { useMemo, useState } from 'react';
import { registrarCorrespondencia } from '../services/correspondenciaService';

const toNullableNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export const useRegistrarCorrespondencia = () => {
  const initialFormData = useMemo(
    () => ({
      numeroOficio: '',
      fechaExpedicion: '',
      dependenciaRemitente: '',
      titularDependencia: '',
      asunto: '',
      fechaRecibido: '',
      idUsuarioCaptura: '',
      idArea: '',
      observaciones: '',
      idEstatus: 1,
      folioUnico: '',
      consecutivo: null
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [correspondenciaRegistrada, setCorrespondenciaRegistrada] = useState(null);
  const [flujoActual, setFlujoActual] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onNuevoRegistro = () => {
    setFormData(initialFormData);
    setLoading(false);
    setError(null);
    setCorrespondenciaRegistrada(null);
    setFlujoActual('idle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setCorrespondenciaRegistrada(null);
    setFlujoActual('registrando');

    try {
      const payload = {
        ...formData,
        idUsuarioCaptura: toNullableNumber(formData.idUsuarioCaptura),
        idArea: toNullableNumber(formData.idArea),
        idEstatus: toNullableNumber(formData.idEstatus) ?? 1,
        consecutivo: formData.consecutivo === null ? null : toNullableNumber(formData.consecutivo),
        folioUnico: formData.folioUnico || null
      };

      const response = await registrarCorrespondencia(payload);
      setCorrespondenciaRegistrada(response);

      const tieneArea = response?.idArea !== null && response?.idArea !== undefined;
      setFlujoActual(tieneArea ? 'exitoso_acuse' : 'exitoso_memorandum');
    } catch (err) {
      const mensaje =
        err?.response?.data?.message ||
        err?.response?.data?.mensaje ||
        err?.message ||
        'Ocurrió un error al registrar la correspondencia.';
      setError(mensaje);
      setFlujoActual('error');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    correspondenciaRegistrada,
    flujoActual,
    handleChange,
    handleSubmit,
    onNuevoRegistro
  };
};
