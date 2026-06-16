import React from 'react';
import '../styles/quejasAri.css';

export const FormularioQuejaAri = ({ formData, setFormData, handleChange, handleSubmit, catalogos, cargando }) => {
  const plantillas = catalogos?.plantillasQuejaAri || [];

  const handlePlantillaChange = (e) => {
    const { name, value } = e.target;
    const numValue = value !== '' ? Number(value) : '';
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  return (
    <form className="quejaari-form" onSubmit={handleSubmit}>

      <div className="form-group full-width">
        <label>No. Expediente (Oficial)</label>
        <input type="text" name="numExpedienteOficial" value={formData.numExpedienteOficial || ''} disabled placeholder="Se generará automáticamente" />
      </div>

      <div className="form-group full-width">
        <label>Motivo de la visita</label>
        <textarea name="sintesisActosOmisiones" value={formData.sintesisActosOmisiones || ''} onChange={handleChange} rows={4} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Instituto que expidió la identificación</label>
          <input type="text" name="instituto" value={formData.instituto || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Nombre encargado (firma)</label>
          <input type="text" name="nombreEncargadoFirma" value={formData.nombreEncargadoFirma || ''} onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Número de requerimientos</label>
          <input type="text" name="multasRequerimientos" value={formData.multasRequerimientos || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Número de créditos</label>
          <input type="text" name="multasCredito" value={formData.multasCredito || ''} onChange={handleChange} />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primario" type="submit" disabled={cargando}>{cargando ? 'Guardando...' : 'Guardar Queja ARI'}</button>
      </div>

    </form>
  );
};

export default FormularioQuejaAri;
