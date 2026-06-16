import { useState, useEffect, useCallback } from 'react';
import cirService from '../services/cirService';

export const useConstanciaInternaRemision = (expedienteId) => {
  const [formData, setFormData] = useState({
    analisisJuridico: '',
    determinacion: '',
    autoridadContesto: false,
    informeAutoridadFecha: '',
    informeAutoridadAsunto: '',
    informeAutoridadTexto: '',
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar preview en tiempo real
  useEffect(() => {
    if (!expedienteId) return;
    
    const generatePreview = async () => {
      try {
        setLoading(true);
        const response = await cirService.getPreview(expedienteId, formData);
        const url = URL.createObjectURL(
          new Blob([response.data], { type: 'application/pdf' })
        );
        setPreviewUrl(url);
      } catch (err) {
        console.error('Preview error:', err);
        setError('Error al generar vista previa');
      } finally {
        setLoading(false);
      }
    };

    generatePreview();
  }, [expedienteId, formData]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const response = await cirService.generarCIR(expedienteId, formData);
      
      if (response.status === 201) {
        setSuccess('✓ CIR generada y expediente actualizado a "CIR generada"');
        // Reset form
        setFormData({
          analisisJuridico: '',
          determinacion: '',
          autoridadContesto: false,
          informeAutoridadFecha: '',
          informeAutoridadAsunto: '',
          informeAutoridadTexto: '',
        });
        // Trigger refresh expediente en parent (pasar callback)
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar CIR');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleFieldChange,
    handleSubmit,
    previewUrl,
    loading,
    error,
    success,
  };
};
