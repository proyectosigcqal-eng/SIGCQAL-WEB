import { describe, it, expect } from 'vitest';
import {
  AREA_FILTER_SIN_ASIGNAR,
  hasAreaAsignada,
  matchesAreasFilter,
  shouldMostrarGenerarMemorandum
} from './correspondenciaUtils';

describe('correspondenciaUtils', () => {
  it('retorna true para correspondencias sin area asignada', () => {
    expect(shouldMostrarGenerarMemorandum({ area_asignada: null })).toBe(true);
    expect(shouldMostrarGenerarMemorandum({ area_asignada: '' })).toBe(true);
    expect(shouldMostrarGenerarMemorandum({ idArea: null })).toBe(true);
  });

  it('retorna false para correspondencias con area asignada', () => {
    expect(shouldMostrarGenerarMemorandum({ area_asignada: 'Finanzas' })).toBe(false);
    expect(shouldMostrarGenerarMemorandum({ idArea: 4 })).toBe(false);
    expect(shouldMostrarGenerarMemorandum({ nombreArea: 'Administración' })).toBe(false);
  });

  it('detecta correctamente si hay area asignada', () => {
    expect(hasAreaAsignada({ area_asignada: 'Area X' })).toBe(true);
    expect(hasAreaAsignada({ idArea: 0 })).toBe(true);
    expect(hasAreaAsignada({ idArea: '' })).toBe(false);
    expect(hasAreaAsignada({})).toBe(false);
  });

  it('filtra por áreas (selección múltiple) y soporta sin asignar', () => {
    const c1 = { idArea: 1 };
    const c2 = { idArea: 2 };
    const c3 = { idArea: null };

    expect(matchesAreasFilter(c1, [])).toBe(true);
    expect(matchesAreasFilter(c1, ['1'])).toBe(true);
    expect(matchesAreasFilter(c1, ['2'])).toBe(false);
    expect(matchesAreasFilter(c2, ['1', '2'])).toBe(true);
    expect(matchesAreasFilter(c3, [AREA_FILTER_SIN_ASIGNAR])).toBe(true);
    expect(matchesAreasFilter(c2, [AREA_FILTER_SIN_ASIGNAR])).toBe(false);
  });
});
