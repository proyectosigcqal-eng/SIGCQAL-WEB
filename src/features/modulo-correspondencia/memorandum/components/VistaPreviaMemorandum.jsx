export const VistaPreviaMemorandum = ({ data }) => {
 
 const obtenerNombreFirmante = () => {
  if (data?.nombreUsuarioFirmante) return data.nombreUsuarioFirmante;
  
  const firmantes = {
    "1": "LIC. JUAN PÉREZ GARCÍA", 
    "2": "DRA. MARÍA LOPEZ"
  };
  
  return firmantes[data?.idUsuarioFirmante] || "NOMBRE DEL FIRMANTE";
};
  return (
    <div className="hoja-memorandum">
      {/* Encabezado Institucional */}
      <div className="hoja-header">
        <div className="escudo-mexico"></div>
        <div className="header-text">
          <h3>COMISIÓN ESTATAL DE LA DEFENSA DEL CONTRIBUYENTE</h3>
          <p className="subtitulo">Estado de Tlaxcala</p>
        </div>
      </div>

      <div className="hoja-contenido-principal">
        {/* Metadatos del Documento */}
        <div className="datos-documento">
          <p><strong>Asunto:</strong> {data?.asuntoCorrespondencia || "Sin asunto definido"}</p>
          <p><strong>No. Oficio:</strong> {data?.folioUnico || "PENDIENTE"}</p>
          <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Cuerpo del Memorándum */}
        <div className="cuerpo-texto">
          <p className="saludo-protocolario">A QUIEN CORRESPONDA:</p>
          
          <p>Por medio del presente y en relación a la correspondencia con folio <strong>{data?.idCorrespondencia || '---'}</strong>, se le comunica la siguiente instrucción:</p>
          
          <div className="cuadro-instruccion">
            {data?.instruccionSeguimiento ? (
              <p className="texto-final">{data.instruccionSeguimiento}</p>
            ) : (
              <p className="placeholder-text">[ Aquí aparecerá la instrucción de seguimiento redactada en el formulario ]</p>
            )}
          </div>

          {data?.observaciones && (
             <p className="nota-observaciones">
               <small><strong>Nota:</strong> {data.observaciones}</small>
             </p>
          )}
        </div>

        {/* Sección de Firma */}
        <div className="seccion-firma">
          <p>Atentamente,</p>
          <div className="linea-firma"></div>
          <p className="nombre-autoridad">{obtenerNombreFirmante()}</p>
          <p className="cargo-autoridad">SERVIDOR PÚBLICO AUTORIZADO</p>
        </div>
      </div>

      {/* Pie de página institucional */}
      <div className="hoja-footer">
        <div className="barra-decorativa"></div>
        <p>Generado por SIGCQAL | Módulo de Correspondencia</p>
        <p className="folio-seguridad">Verificación: {data?.folioUnico || '---'}</p>
      </div>
    </div>
  );
};