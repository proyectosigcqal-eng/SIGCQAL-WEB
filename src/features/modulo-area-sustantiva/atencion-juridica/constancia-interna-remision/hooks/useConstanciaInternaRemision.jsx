import { useState, useEffect, useCallback } from 'react';
import cirService from '../services/cirService';

const formatToday = () => new Date().toISOString().split('T')[0];

export const useConstanciaInternaRemision = (expedienteId) => {
  const [formData, setFormData] = useState({
    fundamentos: '',
    observaciones: '',
    fechaCIR: formatToday(),
  });

  const [precargados, setPrecargados] = useState({
    asesorQueRemite: 'No disponible',
    nombreEncargado: 'No disponible',
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const loadPrecargados = useCallback(async () => {
    if (!expedienteId) return;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, precargados: null }));

    try {
      const data = await cirService.obtenerPrecargados(expedienteId);
      setPrecargados({
        asesorQueRemite: data.asesorQueRemite || 'No disponible',
        nombreEncargado: data.nombreEncargado || 'No disponible',
      });
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        precargados: err.message || 'Error al cargar datos precargados',
      }));
      setPrecargados({
        asesorQueRemite: 'No disponible',
        nombreEncargado: 'No disponible',
      });
    } finally {
      setIsLoading(false);
    }
  }, [expedienteId]);

  useEffect(() => {
    if (!expedienteId) return;
    loadPrecargados();
  }, [expedienteId, loadPrecargados]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateForm = useCallback(() => {
    const validationErrors = {};

    if (!formData.fundamentos?.trim()) {
      validationErrors.fundamentos = 'Los fundamentos son requeridos';
    }

    if (!formData.fechaCIR) {
      validationErrors.fechaCIR = 'La fecha es requerida';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      delete next.submit;
      delete next.preview;
      return next;
    });
  }, []);

  const handleGeneratePreview = useCallback(async () => {
    if (!validateForm()) return;

    setIsGeneratingPreview(true);
    setErrors((prev) => ({ ...prev, preview: null, submit: null }));
    setMessage(null);

    try {
      const url = await cirService.previewCIR({
        expedienteId,
        fundamentos: formData.fundamentos,
        observaciones: formData.observaciones,
        fechaCIR: formData.fechaCIR,
        asesorQueRemite: precargados.asesorQueRemite,
        nombreEncargado: precargados.nombreEncargado,
      });

      setPreviewUrl((prevUrl) => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return url;
      });
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        preview: err.message || 'Error al generar preview',
      }));
      setPreviewUrl((prevUrl) => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return null;
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [expedienteId, formData, validateForm]);

  const handleGenerarCIR = useCallback(async () => {
    if (!validateForm()) return false;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, submit: null, preview: null }));
    setMessage(null);

    try {
      const result = await cirService.generarCIR({
        expedienteId,
        fundamentos: formData.fundamentos,
        observaciones: formData.observaciones,
        fechaCIR: formData.fechaCIR,
      });

      setMessage({
        type: 'success',
        text: `CIR generada exitosamente: ${result.filename}`,
      });
      setFormData({ fundamentos: '', observaciones: '', fechaCIR: formatToday() });
      setPreviewUrl(null);
      return true;
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'Error al guardar CIR',
      }));
      setMessage({
        type: 'error',
        text: err.message || 'Error al guardar CIR',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [expedienteId, formData, validateForm]);

  const handleClose = useCallback(() => {
    setPreviewUrl(null);
    setErrors({});
    setMessage(null);
    setFormData({ fundamentos: '', observaciones: '', fechaCIR: formatToday() });
  }, []);

  return {
    formData,
    handleInputChange,
    errors,
    precargados,
    isLoading,
    isGeneratingPreview,
    previewUrl,
    message,
    handleGeneratePreview,
    handleGenerarCIR,
    handleClose,
  };
};
