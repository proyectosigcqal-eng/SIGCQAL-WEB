import { useEffect, useState } from 'react';
import { getAutoridadesFiscales, getTiposActo } from '@/shared/services/catalogosServices';

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
  const [autoridadesFiscales, setAutoridadesFiscales] = useState(AUTORIDADES_FISCALES);
  const [tiposActo, setTiposActo] = useState(TIPOS_ACTO);
  const [calificaciones, setCalificaciones] = useState(CALIFICACIONES);
  const [tiposAsesoria, setTiposAsesoriaState] = useState(TIPOS_ASESORIA);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    const normalizarCatalogo = (data, idKeys, nombreKeys) => {
      if (!Array.isArray(data)) return null;
      const normalized = data
        .map((item) => {
          const id = idKeys.map((k) => item?.[k]).find((v) => v !== undefined && v !== null && String(v) !== '');
          const nombre = nombreKeys
            .map((k) => item?.[k])
            .find((v) => v !== undefined && v !== null && String(v).trim() !== '');
          if (id == null || nombre == null) return null;
          return { id, nombre: String(nombre) };
        })
        .filter(Boolean);
      return normalized.length > 0 ? normalized : null;
    };

    const cargar = async () => {
      setCargando(true);
      setError(null);
      try {
        const [autoridadesData, tiposActoData] = await Promise.all([getAutoridadesFiscales(), getTiposActo()]);
        if (!alive) return;

        setAutoridadesFiscales(
          normalizarCatalogo(
            autoridadesData,
            ['id', 'idAutoridad', 'idAutoridadFiscal', 'id_autoridad', 'id_autoridad_fiscal'],
            ['nombre', 'descripcion', 'autoridad', 'nombreAutoridad']
          ) ?? AUTORIDADES_FISCALES
        );
        setTiposActo(
          normalizarCatalogo(
            tiposActoData,
            ['id', 'idTipoActo', 'id_tipo_acto', 'tipoActoId'],
            ['nombre', 'descripcion', 'tipoActo', 'nombreTipoActo']
          ) ?? TIPOS_ACTO
        );
        setCalificaciones(CALIFICACIONES);
        setTiposAsesoriaState(TIPOS_ASESORIA);
      } catch {
        if (!alive) return;
        setAutoridadesFiscales(AUTORIDADES_FISCALES);
        setTiposActo(TIPOS_ACTO);
        setCalificaciones(CALIFICACIONES);
        setTiposAsesoriaState(TIPOS_ASESORIA);
        setError('No se pudieron cargar los catálogos.');
      } finally {
        if (!alive) return;
        setCargando(false);
      }
    };

    cargar();
    return () => {
      alive = false;
    };
  }, []);

  return {
    autoridadesFiscales,
    tiposActo,
    calificaciones,
    tiposAsesoria,
    cargando,
    error,
  };
};

