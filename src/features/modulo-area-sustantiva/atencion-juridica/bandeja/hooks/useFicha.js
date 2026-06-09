import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const normalizarTexto = (value) => {
  if (value === null || value === undefined) return '';
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
};

const esCalificacionJuridicaPositiva = (value) => {
  const t = normalizarTexto(value);
  const matchProcede = /(^|[^a-z0-9])procede([^a-z0-9]|$)/.test(t);
  const matchPrevencion = /(^|[^a-z0-9])prevencion subsanada([^a-z0-9]|$)/.test(t);
  return matchProcede || matchPrevencion;
};

const esEstatusAprobadaParaAdmision = (value) => {
  const t = normalizarTexto(value);
  return t.includes('aprobada') && t.includes('admision');
};

const esEstatusConstanciaEmitida = (value) => {
  const t = normalizarTexto(value);
  return t.includes('constancia') && t.includes('emitida');
};

const extraerNombreArchivo = (contentDisposition) => {
  if (!contentDisposition) return '';
  const match = /filename\*?=(?:UTF-8''|")?([^\";]+)"?/i.exec(contentDisposition);
  if (!match?.[1]) return '';
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
};

const resolverUrlApi = (pathOrUrl) => {
  if (!pathOrUrl) return '';
  const v = pathOrUrl.toString();
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  if (v.startsWith('/')) return `${API_BASE}${v}`;
  return v;
};

const leerMensajeError = async (response, fallback) => {
  try {
    const data = await response.json();
    return data?.detail || data?.message || data?.title || fallback;
  } catch {
    return fallback;
  }
};

const obtenerTextoCalificacionJuridica = (detalle) => {
  if (!detalle) return '';

  const analisis = detalle.analisis_legal ?? {};
  const candidatos = [
    analisis.calificacion_juridica,
    analisis.calificacionJuridica,
    analisis.estatus_expediente,
    analisis.estatusExpediente,
    analisis.calificacion_acto,
    analisis.calificacionActo,
    detalle.calificacion_juridica,
    detalle.calificacionJuridica,
  ];

  const encontrado = candidatos.find((v) => v !== null && v !== undefined && v !== '');
  return encontrado ?? '';
};

export const useFicha = (folio) => {
  const [detalle, setDetalle]   = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);
  const [generandoConstancia, setGenerandoConstancia] = useState(false);
  const [cargandoPreviewConstancia, setCargandoPreviewConstancia] = useState(false);
  const [errorConstancia, setErrorConstancia] = useState(null);
  const [previewConstancia, setPreviewConstancia] = useState(null);
  const [urlConstanciaGenerada, setUrlConstanciaGenerada] = useState('');

  const fetchDetalle = useCallback(() => {
    if (!folio) return Promise.resolve();
    setCargando(true);
    setError(null);

    return fetch(`${API_BASE}/api/v1/expedientes/${folio}/detalle-asesoria`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: expediente no encontrado`);
        return res.json();
      })
      .then(setDetalle)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [folio]);

  useEffect(() => {
    fetchDetalle();
  }, [fetchDetalle]);

  const expedienteId = useMemo(() => {
    const raw = detalle?.id_expediente ?? detalle?.idExpediente ?? null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [detalle?.id_expediente, detalle?.idExpediente]);

  const constanciaAdjuntaUrl = useMemo(() => {
    const adjunto = detalle?.bitacora?.conclusion?.adjunto;
    return adjunto ? resolverUrlApi(adjunto) : '';
  }, [detalle?.bitacora?.conclusion?.adjunto]);

  const constanciaUrl = useMemo(() => {
    if (urlConstanciaGenerada) return urlConstanciaGenerada;
    if (constanciaAdjuntaUrl) return constanciaAdjuntaUrl;
    if (esEstatusConstanciaEmitida(detalle?.estatus_actual) && folio) {
      return `${API_BASE}/api/v1/expedientes/${folio}/constancia-pdf`;
    }
    return '';
  }, [constanciaAdjuntaUrl, detalle?.estatus_actual, folio, urlConstanciaGenerada]);

  const verDocumentos = () => {
    const url = constanciaUrl || `${API_BASE}/api/v1/expedientes/${folio}/constancia-pdf`;
    window.open(url, '_blank');
  };

  const textoCalificacionJuridica = useMemo(
    () => obtenerTextoCalificacionJuridica(detalle),
    [detalle]
  );

  const puedeGenerarConstancia = useMemo(
    () =>
      esCalificacionJuridicaPositiva(textoCalificacionJuridica) &&
      esEstatusAprobadaParaAdmision(detalle?.estatus_actual) &&
      !esEstatusConstanciaEmitida(detalle?.estatus_actual),
    [textoCalificacionJuridica, detalle?.estatus_actual]
  );

  const generarConstanciaInternaRemision = async () => {
    if (!expedienteId) return { ok: false, message: 'Expediente no disponible.' };

    setErrorConstancia(null);
    setCargandoPreviewConstancia(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/v1/expedientes/${expedienteId}/constancia-interna-remision/preview`
      );

      if (!response.ok) {
        const msg = await leerMensajeError(
          response,
          `Error ${response.status}: no fue posible cargar la vista previa.`
        );
        throw new Error(msg);
      }

      const data = await response.json();
      setPreviewConstancia(data);
      return { ok: true, data };
    } catch (err) {
      const msg = err?.message || 'No fue posible cargar la vista previa de la constancia.';
      setErrorConstancia(msg);
      return { ok: false, message: msg };
    } finally {
      setCargandoPreviewConstancia(false);
    }
  };

  const confirmarGeneracionConstancia = async ({ analisisJuridico, determinacion } = {}) => {
    if (!expedienteId) return { ok: false, message: 'Expediente no disponible.' };

    setErrorConstancia(null);
    setGenerandoConstancia(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/v1/expedientes/${expedienteId}/constancia-interna-remision`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            analisisJuridico,
            determinacion,
          }),
        }
      );

      if (!response.ok) {
        const msg = await leerMensajeError(
          response,
          `Error ${response.status}: no fue posible generar la constancia.`
        );
        throw new Error(msg);
      }

      const data = await response.json();
      setUrlConstanciaGenerada(resolverUrlApi(data?.urlDescarga));
      await fetchDetalle();

      const msg = data?.mensaje || 'Constancia Interna de Remisión generada exitosamente.';

      return { ok: true, data, message: msg };
    } catch (err) {
      const msg = err?.message || 'No fue posible generar la constancia.';
      setErrorConstancia(msg);
      return { ok: false, message: msg };
    } finally {
      setGenerandoConstancia(false);
    }
  };

  const descargarConstancia = async () => {
    if (!folio) return { ok: false, message: 'Folio no disponible.' };
    setErrorConstancia(null);

    try {
      const response = await fetch(constanciaUrl || `${API_BASE}/api/v1/expedientes/${folio}/constancia-pdf`);
      if (!response.ok) {
        const msg = await leerMensajeError(
          response,
          `Error ${response.status}: no fue posible descargar la constancia.`
        );
        throw new Error(msg);
      }

      const filename =
        extraerNombreArchivo(response.headers.get('content-disposition')) || `constancia-${folio}.pdf`;

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      return { ok: true, filename };
    } catch (err) {
      const msg = err?.message || 'No fue posible descargar la constancia.';
      setErrorConstancia(msg);
      return { ok: false, message: msg };
    }
  };

  return {
    detalle,
    cargando,
    error,
    verDocumentos,
    refrescarDetalle: fetchDetalle,
    puedeGenerarConstancia,
    textoCalificacionJuridica,
    cargandoPreviewConstancia,
    previewConstancia,
    generandoConstancia,
    errorConstancia,
    generarConstanciaInternaRemision,
    confirmarGeneracionConstancia,
    descargarConstancia,
    constanciaUrl,
    expedienteId,
  };
};
