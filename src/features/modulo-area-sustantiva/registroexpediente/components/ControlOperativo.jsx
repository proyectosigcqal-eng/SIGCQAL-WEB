import React from 'react';

export const ControlOperativo = ({ formData, erroresCampo, handleChange, municipios = [], asesores = [] }) => {
  
  const extractId = (item) => {
    if (!item || typeof item !== 'object') return '';
    if (item.id !== undefined && item.id !== null) return String(item.id);
    if (item.idMunicipio !== undefined && item.idMunicipio !== null) return String(item.idMunicipio);
    if (item.idAsesor !== undefined && item.idAsesor !== null) return String(item.idAsesor);
    return '';
  };

  const getMunicipioNombre = (m) => m?.nombreMunicipio || m?.nombre || 'Sin nombre';
  const getAsesorNombre = (a) => a?.nombre || a?.nombreAsesor || 'Sin nombre';

  return (
    <section className="form-section section-card">
      <div className="section-header">
        <h3 className="section-title">Control Operativo</h3>
      </div>

      {/* ← ANTES: label e input sueltos sin form-group ni section-body */}
      {/* ← AHORA: misma estructura que todos los demás campos */}
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
            {erroresCampo.fechaSolicitud && (
              <span className="error-text">{erroresCampo.fechaSolicitud}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="idEstado">Estado *</label>
            <span
              id="idLocalidad"
              style={{ display: 'block', paddingTop: '12px', color: '#333', marginLeft: '4px' }}
            >
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
              {Array.isArray(municipios) && municipios.length > 0 ? (
                municipios.map((m, index) => {
                  const municipioId = extractId(m);
                  const optionValue = municipioId || '';
                  const reactKey = municipioId ? `mun-${municipioId}` : `mun-index-${index}`;
                  return (
                    <option key={reactKey} value={optionValue}>
                      {getMunicipioNombre(m)}
                    </option>
                  );
                })
              ) : (
                <option disabled>No hay municipios disponibles</option>
              )}
            </select>
            {erroresCampo.idMunicipio && (
              <span className="error-text">{erroresCampo.idMunicipio}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="idAsesorResponsable">Asesor Responsable *</label>
            <select
              id="idAsesorResponsable"
              name="idAsesorResponsable"
              value={formData.idAsesorResponsable}
              onChange={handleChange}
              className={erroresCampo.idAsesorResponsable ? 'campo-con-error' : ''}
            >
              <option value="">Seleccionar asesor...</option>
              {Array.isArray(asesores) && asesores.length > 0 ? (
                asesores.map((a, index) => {
                  const asesorId = extractId(a);
                  const optionValue = asesorId || '';
                  const reactKey = asesorId ? `ase-${asesorId}` : `ase-index-${index}`;
                  return (
                    <option key={reactKey} value={optionValue}>
                      {getAsesorNombre(a)}
                    </option>
                  );
                })
              ) : (
                <option disabled>No hay asesores disponibles</option>
              )}
            </select>
            {erroresCampo.idAsesorResponsable && (
              <span className="error-text">{erroresCampo.idAsesorResponsable}</span>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};