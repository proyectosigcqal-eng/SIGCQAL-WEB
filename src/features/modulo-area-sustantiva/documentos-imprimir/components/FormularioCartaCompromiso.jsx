import React from 'react';
import '../styles/cartaCompromiso.css';

export const FormularioCartaCompromiso = ({ formData, handleChange, handleSubmit, cargando, downloadUrl }) => {
  return (
    <form className="informe-form" onSubmit={handleSubmit}>
      <div className="form-group full-width">
        <h3 style={{ margin: '0 0 10px 0', color: '#1A2238' }}>
          Datos de la Carta Compromiso de Representación Legal
        </h3>
      </div>

      <div className="form-group">
        <label>Nombre del Contribuyente / Solicitante</label>
        <input
          type="text"
          name="nombreContribuyente"
          value={formData.nombreContribuyente || ''}
          onChange={handleChange}
          placeholder="Ej. Adrián Cortez Velazquez"
          required
        />
      </div>

      <div className="form-actions">
        <button className="btn-primario" type="submit" disabled={cargando}>
          {cargando ? 'Generando...' : 'Guardar y Generar'}
        </button>
        {downloadUrl && (
          <a
            className="btn-descargar"
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="carta_compromiso_representacion_legal.docx"
          >
            Descargar Documento (.docx)
          </a>
        )}
      </div>
    </form>
  );
};

export default FormularioCartaCompromiso;