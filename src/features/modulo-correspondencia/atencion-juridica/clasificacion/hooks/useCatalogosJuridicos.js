import { useState } from 'react';

const AUTORIDADES_FISCALES = [
  { id: 1, nombre: 'Ayuntamiento' },
  { id: 2, nombre: 'SEFIN' },
  { id: 3, nombre: 'JIAPAZ' },
  { id: 4, nombre: 'SAT' },
  { id: 5, nombre: 'Otra autoridad' },
];

const TIPOS_ACTO = [
  { id: 1, nombre: 'Impuesto predial' },
  { id: 2, nombre: 'Multa' },
  { id: 3, nombre: 'Contribución vehicular' },
  { id: 4, nombre: 'Otro tipo de acto' },
];

const CALIFICACIONES = [
  { id: 1, nombre: 'Cobro elevado' },
  { id: 2, nombre: 'Improcedente' },
  { id: 3, nombre: 'Ilegalidad' },
  { id: 4, nombre: 'Otra calificación' },
];

const TIPOS_ASESORIA = [
  { id: 1, nombre: 'Asesoría Simplificada' },
  { id: 2, nombre: 'Queja Administrativa' },
  { id: 3, nombre: 'Representación Legal' },
];

export const useCatalogosJuridicos = () => {
  const [autoridadesFiscales] = useState(AUTORIDADES_FISCALES);
  const [tiposActo] = useState(TIPOS_ACTO);
  const [calificaciones] = useState(CALIFICACIONES);
  const [tiposAsesoria] = useState(TIPOS_ASESORIA);
  const [cargando] = useState(false);
  const [error] = useState(null);

  return {
    autoridadesFiscales,
    tiposActo,
    calificaciones,
    tiposAsesoria,
    cargando,
    error,
  };
};

