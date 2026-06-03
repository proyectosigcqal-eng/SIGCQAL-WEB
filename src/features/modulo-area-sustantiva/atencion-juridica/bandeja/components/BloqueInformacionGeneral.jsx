export const BloqueInformacionGeneral = ({ folio, fechaRegistro, contribuyente }) => (
  <div className="ficha-card">
    <div className="ficha-card-header">
      <span className="ficha-card-icon">ℹ️</span>
      <h2 className="ficha-card-title">INFORMACIÓN GENERAL</h2>
    </div>
    <hr className="ficha-divider" />
    <div className="ficha-info-grid">
      <div className="ficha-info-col">
        <div className="ficha-field-label">FOLIO</div>
        <div className="ficha-field-folio">{folio}</div>
      </div>
      <div className="ficha-info-col">
        <div className="ficha-field-label">FECHA DE REGISTRO</div>
        <div className="ficha-field-value">{fechaRegistro}</div>
      </div>
    </div>
    <div className="ficha-field-label" style={{ marginTop: '1rem' }}>CONTRIBUYENTE</div>
    <div className="ficha-field-contribuyente">{contribuyente}</div>
  </div>
);
