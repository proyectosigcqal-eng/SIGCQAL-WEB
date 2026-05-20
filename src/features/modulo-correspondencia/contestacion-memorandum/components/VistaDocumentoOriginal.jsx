import { fileUrl } from '@/shared/config/api';

export const VistaDocumentoOriginal = ({ memorandum, loading }) => {
  if (loading) return <p className="text-muted">Cargando documento...</p>;
  if (!memorandum) return <p className="text-muted">No se pudo cargar el documento.</p>;

  const urlRelativa = memorandum.urlMemorandumGenerado ?? null;

  if (!urlRelativa) return <p className="text-muted">Documento firmado aún no disponible.</p>;

  const urlPdf = `${fileUrl(urlRelativa)}#toolbar=0&navpanes=0&view=FitH`;

  return (
    <div style={{ 
      width: '100%', 
      height: '500px',          // ← altura fija en lugar de aspectRatio
      backgroundColor: '#fff',
      overflow: 'hidden', 
      
      borderRadius: '8px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e0e0e0'
    }}>
      <iframe
        src={urlPdf}
        title={`Memorándum ${memorandum.folioUnico ?? ''}`}
        width="100%"
        height="100%"
        style={{ border: 'none', display: 'block' }}
      />
    </div>
  );
};