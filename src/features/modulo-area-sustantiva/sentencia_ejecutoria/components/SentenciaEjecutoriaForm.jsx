import React from 'react';
import '../styles/SentenciaEjecutoriaForm.css';

const SentenciaEjecutoriaForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Formulario de Ejecutoria enviado");
  };

  return (
    <div className="form-container">
      <form className="ejecutoria-form" onSubmit={handleSubmit}>
        <h3>Registro de Sentencia Ejecutoria</h3>
        
        <div className="form-grid">
          {/* FKs */}
          <div className="field">
            <label htmlFor="id_sentencia">ID Sentencia *</label>
            <input type="number" id="id_sentencia" name="id_sentencia" required />
          </div>
          <div className="field">
            <label htmlFor="id_recurso_revision">ID Recurso de Revisión</label>
            <input type="number" id="id_recurso_revision" name="id_recurso_revision" />
          </div>

          {/* Datos Obligatorios */}
          <div className="field">
            <label htmlFor="numero_oficio_ejecutoria">Número de Oficio *</label>
            <input type="text" id="numero_oficio_ejecutoria" name="numero_oficio_ejecutoria" maxLength="100" required />
          </div>
          <div className="field">
            <label htmlFor="fecha_declaracion_ejecutoria">Fecha Declaración *</label>
            <input type="date" id="fecha_declaracion_ejecutoria" name="fecha_declaracion_ejecutoria" required />
          </div>

          {/* Campo de texto largo */}
          <div className="field full-width">
            <label htmlFor="requerimiento_cumplimiento">Requerimiento de Cumplimiento</label>
            <textarea id="requerimiento_cumplimiento" name="requerimiento_cumplimiento" rows="4"></textarea>
          </div>

          {/* La fecha de registro es un timestamp que se genera automáticamente al momento de guardar el registro, por lo que no es necesario incluir un campo para ello en el formulario. */}
          
          <button type="submit" className="btn-submit">Guardar Sentencia Ejecutoria</button>
        </div>
      </form>
    </div>
  );
};

export default SentenciaEjecutoriaForm;