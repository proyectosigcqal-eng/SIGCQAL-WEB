import { useEffect, useState } from 'react';
import {
  getAutoridadesFiscales,
  getCalificacionesActo,
  getEstatusDetalleExpediente,
  getTipoEntrada,
  getTiposActo,
  getTiposAsesoria,
} from '@/shared/services/catalogosServices';

const CALIFICACIONES_DEFAULT = [
  { id: 1, nombre: 'Cobro elevado' },
  { id: 2, nombre: 'Improcedente' },
  { id: 3, nombre: 'Ilegalidad' },
  { id: 4, nombre: 'Otra calificacion' },
];

const TIPOS_ASESORIA_DEFAULT = [
  { id: 1, nombre: 'Asesoria Simplificada' },
  { id: 2, nombre: 'Queja Administrativa' },
  { id: 3, nombre: 'Representacion Legal' },
];

const CATALOGOS_VACIOS = {
  autoridadesFiscales: [],
  tiposActo: [],
  calificaciones: CALIFICACIONES_DEFAULT,
  tiposAsesoria: TIPOS_ASESORIA_DEFAULT,
  estatusDetalleExpediente: [],
  tiposEntrada: [],
};

const normalizarCatalogo = (data, idKeys, nombreKeys) => {
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => {
      const id = idKeys.map((key) => item?.[key]).find((value) => value !== undefined && value !== null && String(value) !== '');
      const nombre = nombreKeys
        .map((key) => item?.[key])
        .find((value) => value !== undefined && value !== null && String(value).trim() !== '');

      if (id == null || nombre == null) return null;
      return { id, nombre: String(nombre).trim(), raw: item };
    })
    .filter(Boolean);
};

export const useCatalogosJuridicos = () => {
  const [catalogos, setCatalogos] = useState(CATALOGOS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    const cargar = async () => {
      setCargando(true);
      setError(null);

      try {
        const [
          autoridadesData,
          tiposActoData,
          calificacionesData,
          tiposAsesoriaData,
          estatusDetalleData,
          tiposEntradaData,
        ] = await Promise.all([
          getAutoridadesFiscales(),
          getTiposActo(),
          getCalificacionesActo().catch(() => null),
          getTiposAsesoria().catch(() => null),
          getEstatusDetalleExpediente(),
          getTipoEntrada(),
        ]);

        if (!alive) return;

        const calificaciones = normalizarCatalogo(
          calificacionesData,
          ['id', 'idCalificacion', 'idCalificacionActo', 'id_calificacion', 'id_calificacion_acto', 'calificacionActoId'],
          ['nombre', 'descripcion', 'calificacion', 'calificacionActo', 'nombreCalificacion', 'nombreCalificacionActo']
        );

        const tiposAsesoria = normalizarCatalogo(
          tiposAsesoriaData,
          ['id', 'idTipoAsesoria', 'id_tipo_asesoria', 'tipoAsesoriaId'],
          ['nombre', 'descripcion', 'asesoria', 'tipoAsesoria', 'nombreAsesoria', 'nombreTipoAsesoria']
        );

        const nextCatalogos = {
          autoridadesFiscales: normalizarCatalogo(
            autoridadesData,
            ['id', 'idAutoridad', 'idAutoridadFiscal', 'id_autoridad', 'id_autoridad_fiscal'],
            ['nombre', 'descripcion', 'autoridad', 'nombreAutoridad', 'nombre_autoridad']
          ),
          tiposActo: normalizarCatalogo(
            tiposActoData,
            ['id', 'idTipoActo', 'idTipoActoEmitido', 'id_tipo_acto', 'id_tipo_acto_emitido', 'tipoActoId'],
            ['nombre', 'descripcion', 'tipoActo', 'nombreTipoActo', 'nombreTipoActoEmitido']
          ),
          calificaciones: calificaciones.length > 0 ? calificaciones : CALIFICACIONES_DEFAULT,
          tiposAsesoria: tiposAsesoria.length > 0 ? tiposAsesoria : TIPOS_ASESORIA_DEFAULT,
          estatusDetalleExpediente: normalizarCatalogo(
            estatusDetalleData,
            ['id', 'idEstatusDetalleExpediente', 'id_estatus_detalle_expediente', 'estatusDetalleExpedienteId'],
            ['nombre', 'descripcion', 'estatus', 'estatusDetalle', 'nombreEstatusDetalle']
          ),
          tiposEntrada: normalizarCatalogo(
            tiposEntradaData,
            ['id', 'idTipoEntrada', 'id_tipo_entrada', 'tipoEntradaId'],
            ['nombre', 'descripcion', 'tipoEntrada', 'nombreTipoEntrada']
          ),
        };

        setCatalogos(nextCatalogos);
        const hayCatalogoRequeridoVacio =
          nextCatalogos.autoridadesFiscales.length === 0 ||
          nextCatalogos.tiposActo.length === 0 ||
          nextCatalogos.estatusDetalleExpediente.length === 0 ||
          nextCatalogos.tiposEntrada.length === 0;
        setError(hayCatalogoRequeridoVacio ? 'No se pudieron cargar los catalogos requeridos.' : null);
      } catch (err) {
        if (!alive) return;
        setCatalogos(CATALOGOS_VACIOS);
        setError(err?.response?.data?.message || err?.message || 'No se pudieron cargar los catalogos juridicos.');
      } finally {
        if (alive) {
          setCargando(false);
        }
      }
    };

    cargar();

    return () => {
      alive = false;
    };
  }, []);

  return {
    ...catalogos,
    cargando,
    error,
  };
};
