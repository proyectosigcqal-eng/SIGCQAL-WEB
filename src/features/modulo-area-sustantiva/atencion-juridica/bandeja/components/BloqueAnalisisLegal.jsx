export const BloqueAnalisisLegal = ({ analisis }) => {
  if (!analisis) return null;

  const {
    clasificacion_atencion,
    autoridad_fiscal_emisora,
    tipo_acto_impuesto,
    estatus_expediente,
    fundamento_analisis_juridico,
  } = analisis;

  return (
    <div className="ficha-card">
      <div className="ficha-card-header">
        <span className="ficha-card-icon-svg">⚖️</span>
        <h2 className="ficha-card-title">ANÁLISIS LEGAL Y CALIFICACIÓN</h2>
      </div>
      <hr className="ficha-divider" />

      <div className="ficha-analisis-grid">
        <div>
          <div className="ficha-field-label">CLASIFICACIÓN DE ATENCIÓN</div>
          <div className="ficha-field-clasificacion">{clasificacion_atencion}</div>
        </div>
        <div>
          <div className="ficha-field-label">AUTORIDAD FISCAL EMISORA</div>
          <div className="ficha-field-bold">{autoridad_fiscal_emisora}</div>
        </div>
        <div>
          <div className="ficha-field-label">TIPO DE ACTO / IMPUESTO</div>
          <div className="ficha-field-bold">{tipo_acto_impuesto}</div>
        </div>
        <div>
          <div className="ficha-field-label">ESTATUS DEL EXPEDIENTE</div>
          <span className="ficha-badge-estatus">{estatus_expediente}</span>
        </div>
      </div>

      <div className="ficha-fundamento-box">
        <div className="ficha-field-label">FUNDAMENTO Y ANÁLISIS JURÍDICO</div>
        <p className="ficha-fundamento-texto">{fundamento_analisis_juridico}</p>
      </div>
    </div>
  );
};
