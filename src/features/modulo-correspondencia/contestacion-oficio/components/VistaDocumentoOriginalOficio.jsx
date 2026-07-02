import { useDocumentoPdf } from '@/shared/hooks/useDocumentoPdf';
import { extractDocumentoPath } from '@/shared/utils/documentoUtils';

export const VistaDocumentoOriginalOficio = ({ oficio, loading: loadingOficio }) => {
  const urlRelativa = extractDocumentoPath(oficio);
  const { blobUrl, loading: loadingPdf, error, downloadUrl } = useDocumentoPdf(urlRelativa);

  if (loadingOficio || loadingPdf) {
    return <p className="text-muted">Cargando documento...</p>;
  }

  if (!oficio) {
    return <p className="text-muted">No se pudo cargar el documento.</p>;
  }

  if (!urlRelativa) {
    return <p className="text-muted">Documento firmado aún no disponible.</p>;
  }

  if (error) {
    return (
      <div className="documento-viewer-error">
        <p className="text-danger" style={{ marginBottom: '0.75rem' }}>{error}</p>
        {downloadUrl && (
          <a href={downloadUrl} target="_blank" rel="noreferrer" className="btn-descargar-doc">
            Abrir documento en nueva pestaña
          </a>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '500px',
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0',
      }}
    >
      <iframe
        src={`${blobUrl}#toolbar=0&navpanes=0&view=FitH`}
        title={`Oficio ${oficio.folioUnico ?? ''}`}
        width="100%"
        height="100%"
        style={{ border: 'none', display: 'block' }}
      />
    </div>
  );
};
