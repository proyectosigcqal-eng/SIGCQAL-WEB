export const TarjetaEstatusLateral = ({ estatusActual, progresoPorcentaje, onVerDocumentos }) => (
  <div className="ficha-lateral-card">
    <div className="ficha-lateral-label">ESTATUS ACTUAL</div>
    <div className="ficha-lateral-estatus">{estatusActual}</div>

    <div className="ficha-progress-bar">
      <div
        className="ficha-progress-fill"
        style={{ width: `${progresoPorcentaje}%` }}
      />
    </div>

    <button className="ficha-btn-documentos" onClick={onVerDocumentos}>
      VER DOCUMENTOS
    </button>
  </div>
);
