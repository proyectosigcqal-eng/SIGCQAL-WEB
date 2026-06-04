import React from 'react';

export const ControlOperativo = ({ formData, erroresCampo, handleChange, municipios = [], asesores = [] }) => {
  // Defensas para estructura de datos y keys
  const getMunicipioId = (m, index) => m?.id || m?.idMunicipio || `municipio-${index}`;
  const getMunicipioNombre = (m) => m?.nombre || m?.nombreMunicipio || 'Sin nombre';
  
  const getAsesorId = (a, index) => a?.id || a?.idAsesor || `asesor-${index}`;
  const getAsesorNombre = (a) => a?.nombre || a?.nombreAsesor || 'Sin nombre';

  return (
    <section className="form-section section-card">
      <div className="section-header">
        <h3 className="section-title">Control Operativo</h3>
      </div>
      <div className="section-body">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="fechaRegistro">Fecha de Registro *</label>
            <input
              id="fechaRegistro"
              name="fechaRegistro"
              type="date"
              value={formData.fechaRegistro}
              onChange={handleChange}
              disabled
              className={erroresCampo.fechaRegistro ? 'campo-con-error' : ''}
            />
            {erroresCampo.fechaRegistro && <span className="error-text">{erroresCampo.fechaRegistro}</span>}
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
                municipios.map((m, index) => (
                  <option key={getMunicipioId(m, index)} value={getMunicipioId(m, index)}>
                    {getMunicipioNombre(m)}
                  </option>
                ))
              ) : (
                <option disabled>No hay municipios disponibles</option>
              )}
            </select>
            {erroresCampo.idMunicipio && <span className="error-text">{erroresCampo.idMunicipio}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="idLocalidad">Localidad *</label>
            <input
              id="idLocalidad"
              name="idLocalidad"
              type="text"
              value={formData.idLocalidad}
              onChange={handleChange}
              placeholder="Ingrese la localidad"
              className={erroresCampo.idLocalidad ? 'campo-con-error' : ''}
            />
            {erroresCampo.idLocalidad && <span className="error-text">{erroresCampo.idLocalidad}</span>}
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
                asesores.map((a, index) => (
                  <option key={getAsesorId(a, index)} value={getAsesorId(a, index)}>
                    {getAsesorNombre(a)}
                  </option>
                ))
              ) : (
                <option disabled>No hay asesores disponibles</option>
              )}
            </select>
            {erroresCampo.idAsesorResponsable && <span className="error-text">{erroresCampo.idAsesorResponsable}</span>}
          </div>
        </div>
      </div>
    </section>
  );
};
