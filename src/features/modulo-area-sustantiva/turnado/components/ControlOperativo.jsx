export const ControlOperativo = ({ formData, erroresCampo, handleChange, municipios = [] }) => {
  const extractId = (item) => {
    if (!item || typeof item !== 'object') return '';
    return String(item.id ?? item.idMunicipio ?? '');
  };

  const getMunicipioNombre = (m) => m?.nombreMunicipio || m?.nombre || 'Sin nombre';

  return (
    <section className="form-section section-card">
      <div className="section-header">
        <h3 className="section-title">Control Operativo</h3>
      </div>
      <div className="section-body">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="folioGobierno">Folio de Gobierno *</label>
            <input
              id="folioGobierno"
              name="folioGobierno"
              type="text"
              value={formData.folioGobierno || ''}
              onChange={handleChange}
              placeholder="Ej: 2406-00125"
              className={erroresCampo.folioGobierno ? 'campo-con-error' : ''}
            />
            {erroresCampo.folioGobierno && (
              <span className="error-text">{erroresCampo.folioGobierno}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="fechaSolicitud">Fecha de Solicitud *</label>
            <input
              id="fechaSolicitud"
              name="fechaSolicitud"
              type="date"
              value={formData.fechaSolicitud}
              onChange={handleChange}
              disabled
              className={erroresCampo.fechaSolicitud ? 'campo-con-error' : ''}
            />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <span style={{ display: 'block', paddingTop: '12px', color: '#333', marginLeft: '4px' }}>
              Zacatecas
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="idMunicipio">Municipio *</label>
            <select
              id="idMunicipio"
              name="idMunicipio"
              value={formData.idMunicipio}
              onChange={handleChange}
              className={erroresCampo.idMunicipio ? 'campo-con-error' : ''}
            >
              <option value="">Seleccionar municipio...</option>
              {municipios.map((m, i) => {
                const id = extractId(m);
                return (
                  <option key={id || `mun-${i}`} value={id}>
                    {getMunicipioNombre(m)}
                  </option>
                );
              })}
            </select>
            {erroresCampo.idMunicipio && (
              <span className="error-text">{erroresCampo.idMunicipio}</span>
            )}
          </div>

          {/* ── Asesor: 100% Automático ── */}
          <div className="form-group">
            <label style={{ marginBottom: '6px', display: 'block' }}>Asesor Responsable *</label>
            <div className="asesor-auto-badge">
              <span>⟳</span>
              <span>Se asignará automáticamente al guardar (Round Robin)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
