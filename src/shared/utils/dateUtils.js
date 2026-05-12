// Utilities to normalize and extract date fields from API responses.
const KNOWN_DATE_KEYS = [
  'fechaEmision','fecha_emision','fechaExpedicion','fecha_expeddicion','fechaExpedicion',
  'fechaAceptacion','fecha_aceptacion','fechaResolucion','fecha_resolucion',
  'fechaRegistro','fecha_registro','fechaRecibido','fecha_recibido','fechaOficio','fecha_oficio',
  'fecha','fechaMovimiento','fecha_movimiento'
];

export function normalizeDateValue(val) {
  if (!val && val !== 0) return null;
  if (typeof val === 'number') return new Date(val).toISOString();
  if (typeof val === 'string') {
    const s = val.trim();
    // Convert common 'YYYY-MM-DD HH:mm:ss' to 'YYYY-MM-DDTHH:mm:ss' so Date parses it reliably
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s) && !s.includes('T')) {
      return s.replace(' ', 'T');
    }
    // Keep ISO date or date-only strings as-is
    return s;
  }
  try {
    return String(val);
  } catch (e) {
    return null;
  }
}

export function pickFecha(obj, keys = KNOWN_DATE_KEYS) {
  if (!obj) return null;
  // Try direct keys
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const v = obj[k];
      if (v || v === 0) return normalizeDateValue(v);
    }
  }
  // Try snake_case alternatives
  for (const k of keys) {
    const v = obj?.[k.toLowerCase()];
    if (v || v === 0) return normalizeDateValue(v);
  }
  // Try nested common wrappers
  if (obj.data) {
    for (const k of keys) {
      const v = obj.data[k] ?? obj.data[k.toLowerCase()];
      if (v || v === 0) return normalizeDateValue(v);
    }
  }
  return null;
}

export function formatDateDisplay(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTimeDisplay(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return d.toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default { pickFecha, normalizeDateValue, formatDateDisplay, formatDateTimeDisplay };
