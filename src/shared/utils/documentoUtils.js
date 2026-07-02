import { fileUrl } from '@/shared/config/api';

/** Contrato backend: /api/files/memorandums/MEMO_{id}_FIRMADO.pdf */
export const buildMemorandumPdfPath = (idMemorandum) => {
  const id = Number(idMemorandum);
  if (!Number.isFinite(id) || id <= 0) return null;
  return `/api/files/memorandums/MEMO_${id}_FIRMADO.pdf`;
};

/** Contrato backend: /api/files/seguimiento-memorandum/{folioFormateado}.pdf */
export const buildSeguimientoMemorandumAdjuntoPath = (folioFormateado) => {
  if (!folioFormateado) return null;
  const folio = String(folioFormateado).trim();
  if (!folio) return null;
  const fileName = folio.toLowerCase().endsWith('.pdf') ? folio : `${folio}.pdf`;
  return `/api/files/seguimiento-memorandum/${fileName}`;
};

export const isRutaServidorArchivo = (value) =>
  typeof value === 'string' &&
  (value.startsWith('/api/files/') || /^https?:\/\/.+\/api\/files\//i.test(value));

/**
 * Normaliza rutas relativas del backend a URL absoluta.
 */
export const resolveDocumentoUrl = (relativePath) => {
  if (!relativePath) return null;

  let path = String(relativePath).trim();
  if (!path) return null;

  if (/^https?:\/\//i.test(path)) return path;

  path = path.replace(/\/adjunto:(\d+)/g, '/adjunto/$1');

  if (path.startsWith('/api/memorandum/') && !path.includes('/api/v1/')) {
    const match = path.match(/\/api\/memorandum\/(\d+)/);
    if (match) return fileUrl(buildMemorandumPdfPath(match[1]));
  }

  if (!path.startsWith('/api/files/') && !path.includes('/')) {
    path = `/api/files/seguimiento-memorandum/${path}`;
  }

  return fileUrl(path);
};

export const fetchDocumentoPdf = async (relativePath) => {
  const url = resolveDocumentoUrl(relativePath);
  if (!url) throw new Error('URL de documento no disponible');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo cargar el documento (HTTP ${response.status})`);
  }

  const blob = await response.blob();
  if (!blob.size) {
    throw new Error('El documento está vacío o no existe en el servidor');
  }

  return blob;
};

/** Ruta del PDF original del memorándum según contrato backend. */
export const extractMemorandumDocumentoPath = (entity) => {
  if (!entity || typeof entity !== 'object') return null;

  const fromApi = entity.urlMemorandumGenerado ?? entity.urlOficioGenerado ?? null;
  if (fromApi) return fromApi;

  const id = entity.idMemorandum ?? entity.idMemo ?? entity.id ?? null;
  return buildMemorandumPdfPath(id);
};

/** Ruta del adjunto de contestación según contrato backend. */
export const extractSeguimientoMemorandumAdjuntoPath = (seguimiento) => {
  if (!seguimiento || typeof seguimiento !== 'object') return null;

  const fromApi = seguimiento.archivoAdjunto ?? seguimiento.urlAdjunto ?? null;
  if (isRutaServidorArchivo(fromApi)) return fromApi;

  return buildSeguimientoMemorandumAdjuntoPath(seguimiento.folioFormateado);
};

export const extractDocumentoPath = (entity) => {
  if (!entity || typeof entity !== 'object') return null;

  return (
    extractMemorandumDocumentoPath(entity) ??
    entity.urlOficio ??
    entity.urlDescarga ??
    entity.rutaServidor ??
    extractSeguimientoMemorandumAdjuntoPath(entity) ??
    null
  );
};
