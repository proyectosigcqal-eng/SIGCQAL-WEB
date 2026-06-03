import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const ESTATUS_OPTIONS = [
  { value: '',            label: 'TODOS LOS ESTATUS' },
  { value: 'CALIFICACION', label: 'CALIFICACIÓN' },
  { value: 'REGISTRO',    label: 'REGISTRO' },
  { value: 'EN PROCESO',  label: 'EN PROCESO' },
  { value: 'ASIGNADO',    label: 'ASIGNADO' },
  { value: 'CONCLUIDO',   label: 'CONCLUIDO' },
];

const TABS = [
  { key: 'ASESORIA_SIMPLIFICADA',   label: 'ASESORÍA SIMPLIFICADA' },
  { key: 'QUEJAS_Y_RECLAMACIONES',  label: 'QUEJAS Y RECLAMACIONES' },
  { key: 'REPRESENTACION_LEGAL',    label: 'REPRESENTACIÓN LEGAL' },
];

// Adapta el JSON del backend al shape que usan los componentes
const adaptarTramite = (item) => ({
  id:               item.folio,
  folio:            item.folio,
  municipio:        item.municipio_procedencia ?? '',
  contribuyente:    item.contribuyente ?? '',
  impuesto:         item.tipo_acto ?? '',
  estatusPrincipal: item.estatus_principal ?? '',
  estatusSecundario:item.estatus_secundario ?? '',
  ultimaModificacion: item.ultima_modificacion?.descripcion ?? '',
  fecha:            item.ultima_modificacion?.timestamp ?? '',
  tipoTramite:      item.tipo_tramite ?? '',
});

export const useBandejaGestion = () => {
  const [busqueda, setBusqueda]                     = useState('');
  const [estatusSeleccionado, setEstatusSeleccionado] = useState('');
  const [tabActiva, setTabActiva]                   = useState('ASESORIA_SIMPLIFICADA');
  const [tramites, setTramites]                     = useState([]);
  const [cargando, setCargando]                     = useState(false);
  const [error, setError]                           = useState(null);

  const fetchBandeja = useCallback(() => {
    setCargando(true);
    setError(null);

    const params = new URLSearchParams();
    if (busqueda)           params.append('search',       busqueda);
    if (estatusSeleccionado) params.append('estatus',      estatusSeleccionado);
    if (tabActiva)          params.append('tipo_tramite', tabActiva);

    fetch(`${API_BASE}/api/v1/tramites/bandeja?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => setTramites(data.map(adaptarTramite)))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [busqueda, estatusSeleccionado, tabActiva]);

  // Re-fetch automático cuando cambia la tab o el estatus
  useEffect(() => {
    fetchBandeja();
  }, [tabActiva, estatusSeleccionado]);

  const handleFiltrar = () => fetchBandeja();

  return {
    busqueda,
    setBusqueda,
    estatusSeleccionado,
    setEstatusSeleccionado,
    tabActiva,
    setTabActiva,
    tramites,
    cargando,
    error,
    handleFiltrar,
    ESTATUS_OPTIONS,
    TABS,
  };
};