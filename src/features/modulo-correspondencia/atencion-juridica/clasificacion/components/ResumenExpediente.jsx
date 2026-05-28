const Item = ({ label, value }) => (
  <div className="aj-kv">
    <div className="aj-kv-label">{label}</div>
    <div className="aj-kv-value">{value || '—'}</div>
  </div>
);

export const ResumenExpediente = ({
  expediente,
  tramiteNombre,
  tipoAsesoriaNombre,
  autoridadNombre,
  tipoActoNombre,
  calificacionNombre,
  canalEntrada,
  monto,
}) => {
  return (
    <section className="aj-card aj-summary-card">
      <div className="aj-card-title">RESUMEN DEL EXPEDIENTE</div>
      <div className="aj-kv-grid">
        <Item label="Folio" value={expediente?.folioGobierno} />
        <Item label="Contribuyente" value={expediente?.nombreContribuyente} />
        <Item label="Trámite" value={tramiteNombre} />
        <Item label="Estatus" value={expediente?.estatus} />
        <Item label="Tipo de asesoría" value={tipoAsesoriaNombre} />
        <Item label="Autoridad" value={autoridadNombre} />
        <Item label="Tipo de acto" value={tipoActoNombre} />
        <Item label="Calificación del acto" value={calificacionNombre} />
        <Item label="Canal de entrada" value={canalEntrada} />
        <Item label="Monto (MXN)" value={monto ? `$ ${monto}` : ''} />
      </div>
    </section>
  );
};

