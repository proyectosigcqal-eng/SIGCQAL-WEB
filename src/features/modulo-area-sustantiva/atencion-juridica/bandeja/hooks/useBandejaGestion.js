import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const ETAPAS = [
  { key: 'TODOS', label: 'TODOS', estatus: '' },
  { key: 'SEGUIMIENTO', label: 'SEGUIMIENTO', estatus: 'SEGUIMIENTO' },
  { key: 'REQUIERE_ACLARACION', label: 'REQUIERE ACLARACIÓN', estatus: 'REQUIERE ACLARACIÓN' },
  { key: 'EMISION_CIR', label: 'EMISIÓN DE CIR', estatus: 'EMISIÓN DE CIR' },
  { key: 'ARI_EMITIDO', label: 'ARI EMITIDO', estatus: 'ARI EMITIDO' },
  { key: 'OFICIO_ENVIADO', label: 'OFICIO ENVIADO', estatus: 'OFICIO ENVIADO' },
  { key: 'RESPUESTA_RECIBIDA', label: 'RESPUESTA RECIBIDA', estatus: 'RESPUESTA RECIBIDA' },
  { key: 'INVESTIGACION_ACCI', label: 'INVESTIGACIÓN ACCI', estatus: 'INVESTIGACIÓN ACCI' },
  { key: 'RESOLUCION_EMITIDA', label: 'RESOLUCIÓN EMITIDA', estatus: 'RESOLUCIÓN EMITIDA' },
  { key: 'FINALIZADO', label: 'FINALIZADO', estatus: 'FINALIZADO' },
];

// Adapta el JSON del backend al shape que usan los componentes
const adaptarTramite = (item) => ({
  id:               item.folio,
  folio:            item.folio,
  municipio:        item.municipio_procedencia ?? '',
  contribuyente:    item.contribuyente ?? '',
  asunto:           item.tipo_acto ?? '',
  estatus:          item.estatus_principal ?? '',
  seguimiento:      item.ultima_modificacion?.descripcion ?? '',
  fecha:            item.ultima_modificacion?.timestamp ?? '',
});

export const useBandejaGestion = () => {
  const [busqueda, setBusqueda]                     = useState('');
  const [etapaActiva, setEtapaActiva]               = useState('TODOS');
  const [tramites, setTramites]                     = useState([]);
  const [cargando, setCargando]                     = useState(false);
  const [error, setError]                           = useState(null);

  const fetchBandeja = useCallback((searchValue) => {
    setCargando(true);
    setError(null);

    const params = new URLSearchParams();
    const s = searchValue ?? busqueda;
    if (s) params.append('search', s);

    const etapa = ETAPAS.find((e) => e.key === etapaActiva);
    if (etapa?.estatus) params.append('estatus', etapa.estatus);

    params.append('tipo_tramite', 'QUEJAS_Y_RECLAMACIONES');

    fetch(`${API_BASE}/api/v1/tramites/bandeja?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => setTramites(data.map(adaptarTramite)))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [busqueda, etapaActiva]);

  useEffect(() => {
    const id = window.setTimeout(() => fetchBandeja(busqueda), 350);
    return () => window.clearTimeout(id);
  }, [busqueda, etapaActiva, fetchBandeja]);

  return {
    busqueda,
    setBusqueda,
    etapaActiva,
    setEtapaActiva,
    tramites,
    cargando,
    error,
    ETAPAS,
  };
};
