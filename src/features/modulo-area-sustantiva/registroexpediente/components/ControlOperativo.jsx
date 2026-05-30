import React from 'react';

export const ControlOperativo = ({ formData, erroresCampo, handleChange, municipios = [], localidades = [], asesores = [] }) => {
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
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            {erroresCampo.idMunicipio && <span className="error-text">{erroresCampo.idMunicipio}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="idLocalidad">Localidad *</label>
            <select
              id="idLocalidad"
              name="idLocalidad"
              value={formData.idLocalidad}
              onChange={handleChange}
              className={erroresCampo.idLocalidad ? 'campo-con-error' : ''}
              disabled={!formData.idMunicipio}
            >
              <option value="">Seleccionar localidad...</option>
              {localidades.map((l) => (
                <option key={l.id} value={l.id}>{l.nombre}</option>
              ))}
            </select>
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
              {asesores.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
            {erroresCampo.idAsesorResponsable && <span className="error-text">{erroresCampo.idAsesorResponsable}</span>}
          </div>
        </div>
      </div>
    </section>
  );
};
