import React from 'react';
import '../styles/memorandum.css';

export const FormularioMemorandum = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form className="formulario-memorandum" onSubmit={handleSubmit}>
      <div className="form-info-readonly">
        <p><strong>Referencia:</strong> {formData?.asuntoCorrespondencia || "Cargando asunto..."}</p>
        <p><strong>Folio:</strong> {formData?.folioUnico || "Cargando folio..."}</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Plantilla de Documento</label>
          <select name="idPlantilla" value={formData.idPlantilla} onChange={handleChange}>
            <option value="">Seleccione plantilla...</option>
            <option value="1">Formato Estándar</option>
            <option value="2">Urgente / Prioritario</option>
          </select>
        </div>

        <div className="form-group">
          <label>Usuario Firmante</label>
          <select name="idUsuarioFirmante" value={formData.idUsuarioFirmante} onChange={handleChange}>
            <option value="">¿Quién autoriza?</option>
            <option value="1">Lic. Juan Pérez García</option>
            <option value="2">Dra. María Lopez</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Instrucción de Seguimiento</label>
          <textarea 
            name="instruccionSeguimiento"
            rows="4"
            value={formData.instruccionSeguimiento}
            onChange={handleChange}
            placeholder="Escriba la instrucción detallada..."
          ></textarea>
        </div>

        <div className="form-group full-width">
          <label>Observaciones Internas</label>
          <textarea 
            name="observaciones"
            rows="2"
            value={formData.observaciones}
            onChange={handleChange}
            placeholder="Notas que no aparecen en el documento impreso..."
          ></textarea>
        </div>
      </div>

      <div className="form-acciones">
        <button type="button" className="btn-secundario">Cancelar</button>
        <button type="submit" className="btn-primario">Generar y Firmar</button>
      </div>
    </form>
  );
};