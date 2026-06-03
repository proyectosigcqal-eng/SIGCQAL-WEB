import { useState, useMemo } from 'react';

const MOCK_TRAMITES = [
  {
    id: 1,
    folio: '260000000',
    municipio: 'MUNICIPIO DE GUADALUPE',
    contribuyente: 'JUAN PÉREZ LÓPEZ',
    impuesto: 'Impuesto Predial',
    estatusPrincipal: 'CALIFICACION',
    estatusSecundario: 'ASESORÍA EN PROCESO',
    ultimaModificacion: 'Se detecta cobro indebido por f...',
    fecha: '2026-05-26 10:15',
    tipoTramite: 'ASESORIA_SIMPLIFICADA',
  },
  {
    id: 2,
    folio: '260000003',
    municipio: 'AYUNTAMIENTO DE FRESNILLO',
    contribuyente: 'LOGÍSTICA AVANZADA S.C.',
    impuesto: 'ISAI',
    estatusPrincipal: 'REGISTRO',
    estatusSecundario: 'ASESORÍA EN PROCESO',
    ultimaModificacion: 'Asesoría inicial sobre cálculo d...',
    fecha: '2026-05-26 11:00',
    tipoTramite: 'ASESORIA_SIMPLIFICADA',
  },
  {
    id: 3,
    folio: '260000010',
    municipio: 'MUNICIPIO DE ZACATECAS',
    contribuyente: 'EMPRESA CONSTRUCTORA SA',
    impuesto: 'Impuesto Predial',
    estatusPrincipal: 'EN PROCESO',
    estatusSecundario: 'QUEJAS Y RECLAMACIONES',
    ultimaModificacion: 'Queja por cobro excesivo...',
    fecha: '2026-05-25 09:30',
    tipoTramite: 'QUEJAS_Y_RECLAMACIONES',
  },
  {
    id: 4,
    folio: '260000015',
    municipio: 'MUNICIPIO DE GUADALUPE',
    contribuyente: 'RAMÍREZ TORRES PEDRO',
    impuesto: 'Multa',
    estatusPrincipal: 'ASIGNADO',
    estatusSecundario: 'REPRESENTACIÓN LEGAL',
    ultimaModificacion: 'Juicio de nulidad iniciado...',
    fecha: '2026-05-24 14:00',
    tipoTramite: 'REPRESENTACION_LEGAL',
  },
];

const ESTATUS_OPTIONS = [
  { value: '', label: 'TODOS LOS ESTATUS' },
  { value: 'CALIFICACION', label: 'CALIFICACIÓN' },
  { value: 'REGISTRO', label: 'REGISTRO' },
  { value: 'EN PROCESO', label: 'EN PROCESO' },
  { value: 'ASIGNADO', label: 'ASIGNADO' },
  { value: 'CONCLUIDO', label: 'CONCLUIDO' },
];

const TABS = [
  { key: 'ASESORIA_SIMPLIFICADA', label: 'ASESORÍA SIMPLIFICADA' },
  { key: 'QUEJAS_Y_RECLAMACIONES', label: 'QUEJAS Y RECLAMACIONES' },
  { key: 'REPRESENTACION_LEGAL', label: 'REPRESENTACIÓN LEGAL' },
];

export const useBandejaGestion = () => {
  const [busqueda, setBusqueda] = useState('');
  const [estatusSeleccionado, setEstatusSeleccionado] = useState('');
  const [tabActiva, setTabActiva] = useState('ASESORIA_SIMPLIFICADA');
  const [tramites] = useState(MOCK_TRAMITES);

  const tramitesFiltrados = useMemo(() => {
    return tramites.filter((t) => {
      const coincideTab = t.tipoTramite === tabActiva;
      const coincideBusqueda =
        !busqueda ||
        t.folio.includes(busqueda) ||
        t.contribuyente.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstatus =
        !estatusSeleccionado || t.estatusPrincipal === estatusSeleccionado;
      return coincideTab && coincideBusqueda && coincideEstatus;
    });
  }, [tramites, tabActiva, busqueda, estatusSeleccionado]);

  const handleFiltrar = () => {
    // El filtrado es reactivo, este handler puede usarse para analytics o logs
  };

  return {
    busqueda,
    setBusqueda,
    estatusSeleccionado,
    setEstatusSeleccionado,
    tabActiva,
    setTabActiva,
    tramitesFiltrados,
    handleFiltrar,
    ESTATUS_OPTIONS,
    TABS,
  };
};
