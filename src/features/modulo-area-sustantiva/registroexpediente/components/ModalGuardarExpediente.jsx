export const ModalGuardarExpediente = ({
  visible,
  isLoading,
  onConfirmar,
  onCancelar,
  asesorAsignado // { nombreAsesor, fechaAsignacion }
}) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-guardar-expediente">
        <div className="modal-header">
          <h2>Confirmar Registro de Expediente</h2>
          <button type="button" className="modal-close" onClick={onCancelar} disabled={isLoading}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-icon-success">✓</div>
          <p className="modal-message">
            ¿Deseas proceder a guardar este expediente? Una vez guardado,
            podrás continuar con la calificación jurídica.
          </p>

          {/* ── Asesor asignado SIEMPRE visible ── */}
          <div className="modal-asesor-box">
            <div className="modal-asesor-label">ASESOR QUE RECIBIRÁ EL EXPEDIENTE</div>
            {asesorAsignado ? (
              <>
                {/* Nota: Asegúrate de que coincida con cómo tu backend serializa el JSON (nombreAsesor vs nombre_asesor) */}
                <div className="modal-asesor-nombre">
                  {asesorAsignado?.nombreAsesor || asesorAsignado.nombre_asesor || 'Buscando asesor...'}
                </div>
                <div className="modal-asesor-meta">
                  Asignado por Round Robin
                </div>
              </>
            ) : (
              <div className="modal-asesor-cargando">
                Calculando asignación...
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secundario"
            onClick={onCancelar}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primario"
            onClick={onConfirmar}
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="spinner-small" /> Guardando...</>
            ) : (
              'Confirmar y Guardar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};