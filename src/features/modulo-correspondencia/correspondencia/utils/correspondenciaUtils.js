const normalizeValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  return String(value);
};

export const AREA_FILTER_SIN_ASIGNAR = '__SIN_ASIGNAR__';

export const hasAreaAsignada = (correspondencia) => {
  if (!correspondencia) return false;
  const raw = correspondencia.idArea ?? correspondencia.id_area ?? correspondencia.area?.id ?? null;
  if (raw === null || raw === undefined) return false;
  if (typeof raw === 'number') return raw > 0;
  if (typeof raw === 'string') return raw.trim() !== '';
  return false;
};

export const shouldMostrarGenerarMemorandum = (correspondencia) => {
  return !hasAreaAsignada(correspondencia);
};

export const matchesAreasFilter = (correspondencia, selectedAreaIds = []) => {
  const selected = Array.isArray(selectedAreaIds) ? selectedAreaIds.map((v) => String(v)) : [];
  if (!selected.length) return true;

  const wantsSinAsignar = selected.includes(AREA_FILTER_SIN_ASIGNAR);
  const hasArea = hasAreaAsignada(correspondencia);
  if (wantsSinAsignar && !hasArea) return true;

  const idArea = normalizeValue(correspondencia?.idArea ?? correspondencia?.id_area ?? '');
  if (idArea && selected.includes(idArea)) return true;

  return false;
};

