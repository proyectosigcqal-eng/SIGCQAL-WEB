export const VistaDocumentoCorrespondencia = ({ correspondencia, loading }) => {
    if (loading) return <p className="text-muted">Cargando documento...</p>;
    if (!correspondencia) return <p className="text-muted">No se pudo cargar el documento.</p>;
  
    // ✅ CAMBIO 1: Eliminar 'memorandum' y usar 'correspondencia'.
    // ✅ CAMBIO 2: Añadir fallbacks para buscar la URL en diferentes campos 
    // que pueda devolver tu backend de correspondencia.
    const urlRelativa = correspondencia.urlCorrespondencia 
                     ?? correspondencia.urlOriginal 
                     ?? correspondencia.urlDocumento 
                     ?? null;
  
    if (!urlRelativa) {
      return <p className="text-muted">Documento firmado aún no disponible.</p>;
    }
  
    const urlPdf = `http://localhost:8081/SIGCQAL_dev${urlRelativa}#toolbar=0&navpanes=0&view=FitH`;
  
    return (
      <div style={{ 
        width: '100%', 
        height: '500px',
        backgroundColor: '#fff',
        overflow: 'hidden', 
        borderRadius: '8px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0'
      }}>
        <iframe
          src={urlPdf}
          // ✅ CAMBIO 3: Título dinámico coherente con el módulo
          title={`Correspondencia ${correspondencia.folioUnico ?? ''}`}
          width="100%"
          height="100%"
          style={{ border: 'none', display: 'block' }}
        />
      </div>
    );
  };