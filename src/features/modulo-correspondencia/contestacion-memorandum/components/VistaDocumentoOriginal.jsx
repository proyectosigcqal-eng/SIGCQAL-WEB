export const VistaDocumentoOriginal = ({ memorandum, loading }) => {
  if (loading) return <p className="text-muted">Cargando documento...</p>;
  if (!memorandum) return <p className="text-muted">No se pudo cargar el documento.</p>;

  const urlRelativa = memorandum.urlMemorandumGenerado ?? null;

  if (!urlRelativa) return <p className="text-muted">Documento firmado aún no disponible.</p>;

  // ✅ Parámetros para forzar el ajuste y ocultar herramientas del navegador
  const urlPdf = `http://localhost:8081/SIGCQAL_dev${urlRelativa}#toolbar=0&navpanes=0&view=FitH`;

  return (
    <div style={{ 
      position: 'relative',
      width: '100%', 
      // 💡 Proporción exacta de una hoja tamaño Carta (8.5 de ancho por 11 de alto).
      // Esto hace que el contenedor se ajuste de forma idéntica a la hoja del PDF,
      // haciendo que la franja gris oscuro desaparezca por completo.
      aspectRatio: '8.5 / 11', 
      backgroundColor: '#ffffff', // Fondo de seguridad blanco
      overflow: 'hidden', 
      borderRadius: '8px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e0e0e0'
    }}>
      <iframe
        src={urlPdf}
        title={`Memorándum ${memorandum.folioUnico ?? ''}`}
        style={{ 
          width: '100%',
          height: '100%',
          border: 'none', 
          display: 'block'
        }}
      />
    </div>
  );
};