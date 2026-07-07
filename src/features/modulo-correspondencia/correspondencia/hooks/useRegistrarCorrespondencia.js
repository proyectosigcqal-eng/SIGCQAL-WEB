import { useEffect, useMemo, useState } from 'react';
import { registrarCorrespondencia } from '../services/correspondenciaService';
import { formatForBackend } from '@/shared/utils/dateUtils';
import { useAuth } from '@/shared/context/AuthContext';
import { getIdUsuarioActual } from '@/shared/utils/sessionUtils';

const FE_03 = 'Todos los campos obligatorios deben estar completos.';
const FE_04 = 'La fecha de expedición no puede ser posterior a la fecha de recibido.';
const FE_ARCHIVO = 'Debes cargar y confirmar el documento digitalizado.';

const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number') return '';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${Math.max(1, Math.round(kb))} KB`;
};

const isAllowedFile = (file) => {
  const allowedMime = ['application/pdf', 'image/jpeg', 'image/png'];
  const allowedExt = ['.pdf', '.jpg', '.jpeg', '.png'];
  const mimeOk = allowedMime.includes(file.type);
  const name = (file.name || '').toLowerCase();
  const extOk = allowedExt.some((ext) => name.endsWith(ext));
  return mimeOk || extOk;
};

export const useRegistrarCorrespondencia = () => {
  const hoy = useMemo(() => formatForBackend(new Date()), []);
  const { session } = useAuth();
  const idUsuario = session?.idUsuario ?? session?.id ?? null;

  const [formData, setFormData] = useState({
    idTipoCorrespondencia: '',
    numeroOficio: '',
    fechaExpedicion: '',
    dependenciaRemitente: '',
    titularDependencia: '',
    asunto: '',
    fechaRecibido: hoy,
    observaciones: ''
  });

  const [erroresCampo, setErroresCampo] = useState({});

  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [archivoPreview, setArchivoPreview] = useState(null);
  const [archivoConfirmado, setArchivoConfirmado] = useState(false);
  const [errorArchivo, setErrorArchivo] = useState(null);

  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registroExitoso, setRegistroExitoso] = useState(null);

  useEffect(() => {
    return () => {
      if (archivoPreview) URL.revokeObjectURL(archivoPreview);
    };
  }, [archivoPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErroresCampo((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setError(null);
  };

  const handleArchivoChange = (e) => {
    const file = e?.target?.files?.[0] || null;
    setError(null);
    setErrorArchivo(null);

    if (!file) return;

    if (!isAllowedFile(file)) {
      setErrorArchivo('Formato no permitido. Solo PDF, JPG o PNG.');
      setArchivoSeleccionado(null);
      setArchivoConfirmado(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorArchivo('El archivo excede el tamaño máximo de 10 MB.');
      setArchivoSeleccionado(null);
      setArchivoConfirmado(false);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setArchivoSeleccionado(file);
    setArchivoPreview(previewUrl);
    setArchivoConfirmado(false);
    setMostrarModalConfirmacion(true);
  };

  const handleConfirmarArchivo = () => {
    if (!archivoSeleccionado) return;
    setArchivoConfirmado(true);
    setMostrarModalConfirmacion(false);
    setErrorArchivo(null);
  };

  const handleRechazarArchivo = () => {
    setArchivoSeleccionado(null);
    setArchivoPreview(null);
    setArchivoConfirmado(false);
    setMostrarModalConfirmacion(false);
  };

  const handleQuitarArchivo = () => {
    handleRechazarArchivo();
    setErrorArchivo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setRegistroExitoso(null);
    setErroresCampo({});

    const faltantes = {};
  

    const numeroOficio = (formData.numeroOficio || '').trim();
    const fechaExpedicion = (formData.fechaExpedicion || '').trim();
    const dependenciaRemitente = (formData.dependenciaRemitente || '').trim();
    const asunto = (formData.asunto || '').trim();
    const fechaRecibido = (formData.fechaRecibido || '').trim();

    if (!numeroOficio) faltantes.numeroOficio = 'Obligatorio';
    if (!fechaExpedicion) faltantes.fechaExpedicion = 'Obligatorio';
    if (!dependenciaRemitente) faltantes.dependenciaRemitente = 'Obligatorio';
    if (!asunto) faltantes.asunto = 'Obligatorio';
    if (!fechaRecibido) faltantes.fechaRecibido = 'Obligatorio';

    if (Object.keys(faltantes).length > 0) {
      setErroresCampo(faltantes);
      setError(FE_03);
      return;
    }

    if (fechaExpedicion > fechaRecibido) {
      setErroresCampo({ fechaExpedicion: 'Revisa la fecha', fechaRecibido: 'Revisa la fecha' });
      setError(FE_04);
      return;
    }

    if (!archivoSeleccionado || !archivoConfirmado) {
      setErrorArchivo(FE_ARCHIVO);
      setError(FE_ARCHIVO);
      return;
    }

    const dto = {
      consecutivo: null,
      folioUnico: null,
      numeroOficio,
      fechaExpedicion,
      dependenciaRemitente,
      titularDependencia: (formData.titularDependencia || '').trim() || null,
      asunto,
      fechaRecibido,
      idTipoCorrespondencia: formData.idTipoCorrespondencia ? Number(formData.idTipoCorrespondencia) : 1,
      idEstatus: 1,
      idUsuarioCaptura: idUsuario,
      idArea: null,
      observaciones: (formData.observaciones || '').trim() || null
    };

    setIsLoading(true);
    try {
      const response = await registrarCorrespondencia(dto);
      setRegistroExitoso(response);
    } catch (err) {
      const mensaje =
        err?.response?.data?.message ||
        err?.response?.data?.mensaje ||
        err?.message ||
        'Ocurrió un error al registrar la correspondencia.';
      setError(mensaje);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    erroresCampo,
    archivoSeleccionado,
    archivoPreview,
    archivoConfirmado,
    errorArchivo,
    mostrarModalConfirmacion,
    isLoading,
    error,
    registroExitoso,
    tamanoArchivo: archivoSeleccionado ? formatFileSize(archivoSeleccionado.size) : '',
    handleChange,
    handleArchivoChange,
    handleConfirmarArchivo,
    handleRechazarArchivo,
    handleQuitarArchivo,
    handleSubmit
  };
};
