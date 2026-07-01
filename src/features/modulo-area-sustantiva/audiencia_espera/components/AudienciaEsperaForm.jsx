import React from 'react';
import '../styles/AudienciaEsperaForm.css';

const AudienciaEsperaForm = () => {
  return (
    <div className="form-container">
      <form className="audiencia-form">
        <h3>Registro de Audiencia en Espera</h3>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="id_demanda_amparo">ID Demanda Amparo *</label>
            <input type="number" id="id_demanda_amparo" name="id_demanda_amparo" required />
          </div>
          <div className="field">
            <label htmlFor="numero_oficio_admision">Número de Oficio Admisión *</label>
            <input type="text" id="numero_oficio_admision" name="numero_oficio_admision" maxLength="100" required />
          </div>
          <div className="field">
            <label htmlFor="fecha_notificacion_oficio">Fecha Notificación Oficio *</label>
            <input type="date" id="fecha_notificacion_oficio" name="fecha_notificacion_oficio" required />
          </div>
          <div className="field">
            <label htmlFor="fecha_hora_audiencia_prog">Fecha y Hora Programada *</label>
            <input type="datetime-local" id="fecha_hora_audiencia_prog" name="fecha_hora_audiencia_prog" required />
          </div>
          <div className="field full-width">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea id="observaciones" name="observaciones" rows="6"></textarea>
          </div>
          <button type="submit" className="btn-submit">Registrar Audiencia</button>
        </div>
      </form>
    </div>
  );
};
export default AudienciaEsperaForm;