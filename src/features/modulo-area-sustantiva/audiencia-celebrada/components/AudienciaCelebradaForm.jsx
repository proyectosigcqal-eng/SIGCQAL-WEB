import React from 'react';
import '../styles/AudienciaCelebradaForm.css';

const AudienciaCelebradaForm = () => {
  return (
    <div className="form-container">
      <form className="audiencia-celebrada-form">
        <h3>Audiencia Celebrada</h3>
        <div className="form-grid">
          {/* FK */}
          <div className="field">
            <label htmlFor="id_audiencia_espera">ID Audiencia Espera *</label>
            <input type="number" id="id_audiencia_espera" name="id_audiencia_espera" required />
          </div>
          
          {/* Fecha y Hora */}
          <div className="field">
            <label htmlFor="fecha_hora_celebracion">Fecha y Hora Celebración *</label>
            <input type="datetime-local" id="fecha_hora_celebracion" name="fecha_hora_celebracion" required />
          </div>

          {/* Campos Opcionales */}
          <div className="field">
            <label htmlFor="numero_oficio_acta">Número de Oficio Acta</label>
            <input type="text" id="numero_oficio_acta" name="numero_oficio_acta" maxLength="100" />
          </div>
          <div className="field">
            <label htmlFor="sala_o_modalidad">Sala o Modalidad</label>
            <input type="text" id="sala_o_modalidad" name="sala_o_modalidad" maxLength="150" />
          </div>

          {/* Resultado (Gordito) */}
          <div className="field full-width">
            <label htmlFor="resultado_audiencia">Resultado de la Audiencia *</label>
            <textarea id="resultado_audiencia" name="resultado_audiencia" rows="6" required></textarea>
          </div>

          {/* Booleano */}
          <div className="field">
            <label htmlFor="asistio_autoridad">¿Asistió la Autoridad? *</label>
            <select id="asistio_autoridad" name="asistio_autoridad" required>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          
          <button type="submit" className="btn-submit">Guardar Audiencia</button>
        </div>
      </form>
    </div>
  );
};
export default AudienciaCelebradaForm;