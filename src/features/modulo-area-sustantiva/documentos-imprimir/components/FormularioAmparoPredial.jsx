import React from 'react';
import '../styles/amparoPredial.css';

export const FormularioAmparoPredial = ({ formData, handleChange, handleSubmit, cargando, downloadUrl }) => {
  return (
    <form className="informe-form" onSubmit={handleSubmit}>
      <div className="form-group full-width">
        <h3 style={{ margin: '0 0 10px 0', color: '#1A2238' }}>Datos del Amparo Impuesto Predial</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 15px 0' }}>
          Ingrese el nombre del contribuyente quejoso para generar la hoja final de puntos petitorios.
        </p>
      </div>

      <div className="form-group">
        <label>Nombre del Contribuyente (Quejoso)</label>
        <input 
          type="text" 
          name="nombreContribuyente" 
          value={formData.nombreContribuyente || ''} 
          onChange={handleChange} 
          placeholder="Ej. ADRIAN CORTEZ VELÁZQUEZ" 
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
            download="hoja_final_amparo_predial.docx"
          >
            Descargar Documento (.docx)
          </a>
        )}
      </div>
    </form>
  );
};

export default FormularioAmparoPredial;