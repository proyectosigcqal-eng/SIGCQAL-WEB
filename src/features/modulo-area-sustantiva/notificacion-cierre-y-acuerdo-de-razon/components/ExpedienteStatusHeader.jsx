const ExpedienteStatusHeader = () => (
  <div className="status-banner locked">
    <div className="icon">🔒</div>
    <div className="text">
      <h3>EXPEDIENTE FINALIZADO</h3>
      <p>Este proceso ha sido cerrado definitivamente. No se permiten modificaciones adicionales.</p>
    </div>
  </div>
);

export default ExpedienteStatusHeader;