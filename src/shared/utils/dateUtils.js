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
    // If it's a date-only string 'YYYY-MM-DD', append a mid-day time so it's parsed as local
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return `${s}T12:00:00`;
    }
    // Keep ISO date/time strings as-is
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
  const d = parseToLocalDate(dateStr);
  if (!d || isNaN(d)) return '-';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function formatDateTimeDisplay(dateStr) {
  if (!dateStr) return '-';
  const d = parseToLocalDate(dateStr);
  if (!d || isNaN(d)) return '-';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

export function formatForBackend(dateLike) {
  if (!dateLike) return null;
  const d = parseToLocalDate(dateLike instanceof Date ? dateLike : dateLike);
  if (!d || isNaN(d)) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatTimeForBackend(dateLike) {
  if (!dateLike) return null;
  const d = parseToLocalDate(dateLike instanceof Date ? dateLike : dateLike);
  if (!d || isNaN(d)) return null;
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

// Helper: parse into a local Date safely. Handles date-only strings by forcing midday local time
function parseToLocalDate(dateLike) {
  if (!dateLike) return null;
  if (dateLike instanceof Date) return dateLike;
  const s = String(dateLike).trim();
  // date-only
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(`${s}T12:00:00`);
  // common 'YYYY-MM-DD HH:mm:ss' → 'T' for parsing
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s) && !s.includes('T')) return new Date(s.replace(' ', 'T'));
  return new Date(s);
}

export default { pickFecha, normalizeDateValue, formatDateDisplay, formatDateTimeDisplay, formatForBackend, formatTimeForBackend };
