import React from 'react';
import './styles/SentenciaForm.css';

const SentenciaForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica de conexión al backend más adelante
    alert("Formulario enviado");
  };

  return (
    <div className="form-container">
      <form className="sentencia-form" onSubmit={handleSubmit}>
        <h3>Registro de Sentencia Dictada</h3>
        
        <div className="form-grid">
          {/* id_audiencia_celebrada */}
          <div className="field">
            <label htmlFor="id_audiencia_celebrada">ID Audiencia</label>
            <input type="number" id="id_audiencia_celebrada" name="id_audiencia_celebrada" required />
          </div>

          <div className="field" style={{ visibility: 'hidden' }}></div>

          {/* Fechas */}
          <div className="field">
            <label htmlFor="fecha_dictado">Fecha de Dictado</label>
            <input type="date" id="fecha_dictado" name="fecha_dictado" required />
          </div>
          <div className="field">
            <label htmlFor="fecha_notificacion_sentencia">Fecha de Notificación</label>
            <input type="date" id="fecha_notificacion_sentencia" name="fecha_notificacion_sentencia" required />
          </div>

          {/* Sentido del fallo */}
          <div className="field full-width">
            <label htmlFor="sentido_fallo">Sentido del Fallo</label>
            <input type="text" id="sentido_fallo" name="sentido_fallo" maxLength="100" required />
          </div>

          {/* Puntos resolutivos */}
          <div className="field full-width">
            <label htmlFor="puntos_resolutivos">Puntos Resolutivos</label>
            <textarea id="puntos_resolutivos" name="puntos_resolutivos" rows="5" required></textarea>
          </div>

          {/* Campos adicionales */}
          <div className="field">
            <label htmlFor="numero_oficio_sentencia">Número de Oficio</label>
            <input type="text" id="numero_oficio_sentencia" name="numero_oficio_sentencia" maxLength="100" />
          </div>

          <div className="field">
            <label htmlFor="ruta_archivo_sentencia">Ruta del Archivo</label>
            <input type="text" id="ruta_archivo_sentencia" name="ruta_archivo_sentencia" maxLength="500" />
          </div>
          
          <button type="submit" className="btn-submit">Registrar Sentencia</button>
        </div>
      </form>
    </div>
  );
};

export default SentenciaForm;