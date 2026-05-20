
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  obtenerCorrespondenciaPorId, 
  obtenerProximoFolio, 
  guardarSeguimiento 
} from '../services/seguimientoService';

import { useCallback, useState } from 'react';
import { formatForBackend, formatTimeForBackend } from '@/shared/utils/dateUtils';


const formatDate = (date) => formatForBackend(date);

const formatTime = (date) => formatTimeForBackend(date);


const formatTimestamp = (date) => `${formatForBackend(date)} ${formatTimeForBackend(date)}`;

const unwrapCorrespondencia = (data) => {
  if (!data) return null;
  if (data.data) return data.data;
  if (data.resultado) return data.resultado;
  return data;
};

export const useContestacionCorrespondencia = () => {
  const { id } = useParams(); // Sincronizado con la ruta dinámica de App.jsx
  const navigate = useNavigate();

  // Estados de control de UI (Idénticos al patrón de useContestacion)
  const [correspondencia, setCorrespondencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Estado del formulario unificado
  const [form, setForm] = useState({
    idCorrespondencia: id,
    folioRespuesta: '',
    numeroOficioContestacion: '', // Nuevo campo requerido
    respuestaSeguimientoCorrespondencia: '',
    fechaResolucion: formatDate(new Date()),
    horaResolucion: formatTime(new Date()),
    idUsuario: 2, // Por defecto temporalmente
    idEstatus: 4, // Estado inicial por defecto
    archivoAdjunto: null
  });

  
  useEffect(() => {
    if (!id) return;

    const cargarDatosIniciales = async () => {
      try {
        setLoading(true);
        setError(null);

        // Se ejecutan en paralelo la consulta base y el cálculo del folio dinámico CC
        const [dataCorrespondencia, nuevoFolio] = await Promise.all([
          obtenerCorrespondenciaPorId(id),
          obtenerProximoFolio()
        ]);

        // Desempaquetado seguro del objeto JSON que retorna el API
        const unwrapData = dataCorrespondencia.data || dataCorrespondencia.resultado || dataCorrespondencia;
        setCorrespondencia(unwrapData);

        // Seteamos el próximo folio generado en el formulario
        setForm(prev => ({
          ...prev,
          folioRespuesta: nuevoFolio
        }));

      } catch (err) {
        console.error("Error al inicializar la contestación de correspondencia:", err);
        setError(err.message || 'No se pudo cargar la correspondencia base');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosIniciales();
  }, [id]);

  // Manejador de cambios para inputs estándar (Texto, Fecha, Tiempo)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador de cambios especializado para capturar archivos del input file
  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setForm(prev => ({
      ...prev,
      archivoAdjunto: file
    }));
  };

  // Ejecución del guardado
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.numeroOficioContestacion.trim()) {
      alert("El número de oficio de contestación es requerido.");
      return;
    }

    if (!form.respuestaSeguimientoCorrespondencia.trim()) {
      alert("La descripción de la respuesta no puede ir vacía.");
      return;
    }

    try {
      setSubmitting(true);
      
      // Enviamos el objeto del formulario al servicio
      await guardarSeguimiento(form);
      
      alert("Contestación de correspondencia registrada exitosamente.");
      navigate(-1); // Regresa a la pantalla anterior (Bandeja)
    } catch (err) {
      console.error("Error al registrar contestación:", err);
      alert(err.message || "Ocurrió un error al guardar el seguimiento.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    correspondencia,
    loading,
    submitting,
    error,
    handleChange,
    handleFileChange,
    handleSubmit
  };
};