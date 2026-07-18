import React from 'react';
import '../styles/informeTerminacion.css';

export const FormularioInformeTerminacion = ({ formData, handleChange, handleSubmit, cargando, downloadUrl }) => {
  return (
    <form className="informe-form" onSubmit={handleSubmit}>
      <div className="form-group full-width">
        <h3 style={{ margin: '0 0 10px 0', color: '#1A2238' }}>Datos del Informe de Terminación</h3>
      </div>

      <div className="form-group">
        <label>Nombre del Contribuyente</label>
        <input 
          type="text" 
          name="nombreContribuyente" 
          value={formData.nombreContribuyente || ''} 
          onChange={handleChange} 
          placeholder="Ej. Adrián Cortez Velazquez" 
          required
        />
      </div>

      <div className="form-group">
        <label>Nombre del Encargado de la Comisión</label>
        <input 
          type="text" 
          name="nombreEncargado" 
          value={formData.nombreEncargado || ''} 
          onChange={handleChange} 
          placeholder="Ej. Lic. Maritza Elena Flores..." 
          required
        />
      </div>

      <div className="form-group">
        <label>Nombre del Asesor Jurídico</label>
        <input 
          type="text" 
          name="nombreAsesor" 
          value={formData.nombreAsesor || ''} 
          onChange={handleChange} 
          placeholder="Ej. Lic. Roberto Gómez Pérez" 
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
            download="informe_terminacion_servicio.docx"
          >
            Descargar Documento (.docx)
          </a>
        )}
      </div>
    </form>
  );
};

export default FormularioInformeTerminacion;