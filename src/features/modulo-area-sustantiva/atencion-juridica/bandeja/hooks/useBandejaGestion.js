import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

// Las pestañas son las etapas del flujo de queja
const ETAPAS = [
  { key: 'ASIGNADA_ASESOR',   label: 'Asignada a Asesor',                                  estatus: 'Asignada a Asesor' },
  { key: 'VALIDACION',        label: 'En Validación de Requisitos',                         estatus: 'En Validación de Requisitos' },
  { key: 'CIR_GENERADA',      label: 'CIR Generada',       estatus: 'CIR Generada (Constancia Interna de Remisión)' },
  { key: 'ARI_GENERADO',      label: 'ARI Generado', estatus: 'ARI Generado (Acuerdo con Requerimiento de Informe)' },
  { key: 'OFICIO_EMITIDO',    label: 'Oficio de Notificación Emitido',                      estatus: 'Oficio de Notificación Emitido' },
  { key: 'CONTESTACION',      label: 'Contestación de Autoridad Recibida',                  estatus: 'Contestación de Autoridad Recibida' },
  { key: 'ACCI_GENERADO',     label: 'ACCI Generado', estatus: 'ACCI Generado (Acuerdo de Informe de Investigación)' },
  { key: 'RESOLUCION',        label: 'Informe de Resolución Emitido',                       estatus: 'Informe de Resolución Emitido' },
  { key: 'NOTIFICACION',      label: 'En Proceso de Notificación Final',                    estatus: 'En Proceso de Notificación Final' },
  { key: 'CERRADA',           label: 'Cerrada / Concluida',                                 estatus: 'Cerrada / Concluida' },
];

const adaptarTramite = (item) => ({
  id:           item.folio,
  folio:        item.folio,
  municipio:    item.municipio_procedencia ?? '',
  contribuyente: item.contribuyente ?? '',
  asunto:       item.tipo_acto ?? '',
  estatus:      item.estatus_principal ?? '',
  seguimiento:  item.ultima_modificacion?.descripcion ?? '',
  fecha:        item.ultima_modificacion?.timestamp ?? '',
  // ← Datos del plazo que vendrán del endpoint de plazo
  plazo:        null, // se enriquece después
});

export const useBandejaGestion = () => {
  const [busqueda, setBusqueda]       = useState('');
  const [etapaActiva, setEtapaActiva] = useState('ASIGNADA_ASESOR');
  const [tramites, setTramites]       = useState([]);
  const [cargando, setCargando]       = useState(false);
  const [error, setError]             = useState(null);
  const controllerRef                 = useRef(null);

  const fetchBandeja = useCallback(() => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setCargando(true);
    setError(null);

    const params = new URLSearchParams();
    if (busqueda.trim()) params.append('search', busqueda.trim());

    const etapa = ETAPAS.find((e) => e.key === etapaActiva);
    if (etapa?.estatus) params.append('estatus', etapa.estatus);
    params.append('tipo_tramite', 'QUEJAS_Y_RECLAMACIONES');

    fetch(`${API_BASE}/api/v1/tramites/bandeja?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Respuesta inesperada');
        setTramites(data.map(adaptarTramite));
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setTramites([]);
      })
      .finally(() => setCargando(false));
  }, [busqueda, etapaActiva]);

  useEffect(() => {
    const id = window.setTimeout(fetchBandeja, 350);
    return () => window.clearTimeout(id);
  }, [fetchBandeja]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return {
    busqueda, setBusqueda,
    etapaActiva, setEtapaActiva,
    tramites, cargando, error,
    ETAPAS,
    recargar: fetchBandeja,
  };
};