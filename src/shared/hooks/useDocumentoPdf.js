import { useState, useEffect } from 'react';
import { fetchDocumentoPdf, resolveDocumentoUrl } from '@/shared/utils/documentoUtils';

/**
 * Carga un PDF del backend como blob URL para visualización en iframe/embed
 * sin depender de X-Frame-Options del servidor de archivos.
 */
export const useDocumentoPdf = (relativePath) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    if (!relativePath) {
      setBlobUrl(null);
      setError(null);
      setDownloadUrl(null);
      return undefined;
    }

    let cancelled = false;
    let objectUrl = null;

    const load = async () => {
      setLoading(true);
      setError(null);
      setBlobUrl(null);
      setDownloadUrl(resolveDocumentoUrl(relativePath));

      try {
        const blob = await fetchDocumentoPdf(relativePath);
        if (cancelled) return;

        objectUrl = URL.createObjectURL(
          blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' })
        );
        setBlobUrl(objectUrl);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Error al cargar el documento');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [relativePath]);

  return { blobUrl, loading, error, downloadUrl };
};
