export const FormularioClasificacion = ({
  formData,
  onChange,
  onConfirmar,
  catalogos,
  cargandoCatalogos,
  guardando,
  error,
  errorCatalogos,
}) => {
  const { autoridadesFiscales, tiposActo, calificaciones, tiposAsesoria } = catalogos || {};

  return (
    <section className="clasificacion-form-card">
      <h2>Clasificación del Asunto</h2>

      {errorCatalogos && <div className="alerta-warning">{errorCatalogos}</div>}
      {error && <div className="alerta-error">{error}</div>}

      <form onSubmit={onConfirmar}>
        <div className="clasificacion-grid">
          <div className="form-group">
            <label htmlFor="idAutoridadFiscal">
              Autoridad fiscal emisora <span className="req">*</span>
            </label>
            <select
              id="idAutoridadFiscal"
              name="idAutoridadFiscal"
              value={formData.idAutoridadFiscal}
              onChange={onChange}
              required
              disabled={cargandoCatalogos}
            >
              <option value="">Seleccionar...</option>
              {(autoridadesFiscales || []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="idTipoActo">
              Tipo de acto <span className="req">*</span>
            </label>
            <select
              id="idTipoActo"
              name="idTipoActo"
              value={formData.idTipoActo}
              onChange={onChange}
              required
              disabled={cargandoCatalogos}
            >
              <option value="">Seleccionar...</option>
              {(tiposActo || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="idCalificacionActo">
              Calificación del acto <span className="req">*</span>
            </label>
            <select
              id="idCalificacionActo"
              name="idCalificacionActo"
              value={formData.idCalificacionActo}
              onChange={onChange}
              required
              disabled={cargandoCatalogos}
            >
              <option value="">Seleccionar...</option>
              {(calificaciones || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group tipo-asesoria-group">
          <label>
            Tipo de Asesoría <span className="req">*</span>
            <span className="exclusivo-badge">Selección exclusiva</span>
          </label>
          <div className="tipo-asesoria-opciones">
            {(tiposAsesoria || []).map((ta) => (
              <label
                key={ta.id}
                className={`opcion-asesoria ${formData.idTipoAsesoria === String(ta.id) ? 'seleccionada' : ''}`}
              >
                <input
                  type="radio"
                  name="idTipoAsesoria"
                  value={ta.id}
                  checked={formData.idTipoAsesoria === String(ta.id)}
                  onChange={onChange}
                  required
                  disabled={cargandoCatalogos}
                />
                {ta.nombre}
              </label>
            ))}
          </div>
        </div>

        <div className="form-acciones">
          <button type="submit" className="btn-confirmar-clasificacion" disabled={guardando || cargandoCatalogos}>
            {guardando ? 'Confirmando...' : 'Confirmar Clasificación'}
          </button>
        </div>
      </form>
    </section>
  );
};

