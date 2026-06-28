import React, { useEffect } from 'react';
import '../styles/rlCir.css';

export const FormularioRLCir = ({ formData, handleChange, handleSubmit, catalogos, cargando, downloadUrl }) => {
  // Se asume la lista de asesores desde el catálogo general de usuarios o asesores
  const listaAsesores = catalogos?.asesores || catalogos?.usuarios || [];

  const textoDefaultArticulos = "Lo anterior con fundamento en lo dispuesto por los artículos 1, 2, 25 fracción II, de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios; en relación con el 2, 6 fracciones I, III, 7 fracción II, inciso a), 26 fracción VII, 27 fracciones I, II, 28 fracciones I, II, III, VIII, X y 39 fracciones II y III, del Estatuto Orgánico de la Comisión Estatal de la Defensa del Contribuyente, así como el 1, 5, 30 fracción IV, 45, 46, 47, 48, y 49 de los Lineamientos Generales de Actuación de la Comisión Estatal de la Defensa del Contribuyente";

  // Efecto para asegurar que el texto por defecto se cargue en el estado del componente padre si viene vacío
  useEffect(() => {
    if (!formData.articulos) {
      handleChange({
        target: {
          name: 'articulos',
          value: textoDefaultArticulos
        }
      });
    }
  }, [formData.articulos, handleChange]);

  return (
    <form className="quejaari-form" onSubmit={handleSubmit}>
      
      <div className="form-group full-width">
        <label>Folio del Expediente (Pre-cargado)</label>
        <input type="text" name="folioGobierno" value={formData.folioGobierno || ''} disabled />
      </div>

      <div className="form-group full-width">
        <label>Motivos</label>
        <textarea 
          name="motivos" 
          value={formData.motivos || ''} 
          onChange={handleChange} 
          rows={4} 
          placeholder="Escriba los motivos de la remisión..."
        />
      </div>

      <div className="form-group full-width">
        <label>Artículos</label>
        <textarea 
          name="articulos" 
          value={formData.articulos ?? textoDefaultArticulos} 
          onChange={handleChange} 
          rows={6} // Aumentado a 6 para mejorar la visualización de este texto largo
          placeholder="Ej. Artículos 14, 16 constitucionales..."
        />
      </div>

      <div className="form-group full-width">
        <label>Observaciones</label>
        <textarea 
          name="observaciones" 
          value={formData.observaciones || ''} 
          onChange={handleChange} 
          rows={3} 
          placeholder="Detalles adicionales del expediente..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Asesor Remitente</label>
          <select name="idAsesorRemitente" value={formData.idAsesorRemitente || ''} onChange={handleChange}>
            <option value="">-- Seleccione Asesor --</option>
            {listaAsesores.map(as => {
              const idReal = as.idAsesor ?? as.id;
              return (
                <option key={idReal} value={idReal}>
                  {as.nombre || `Asesor ${idReal}`}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label>Asesor que Recibe</label>
          <select name="idAsesorRecibe" value={formData.idAsesorRecibe || ''} onChange={handleChange}>
            <option value="">-- Seleccione Asesor --</option>
            {listaAsesores.map(as => {
              const idReal = as.idAsesor ?? as.id;
              return (
                <option key={idReal} value={idReal}>
                  {as.nombre || `Asesor ${idReal}`}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width">
          <label>Director</label>
          <input 
            type="text" 
            name="director" 
            value={formData.director || ''} 
            onChange={handleChange} 
            placeholder="Nombre del director"
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primario" type="submit" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Guardar RL_CIR'}
        </button>
        {downloadUrl && (
          <a
            className="btn-descargar-quejaari"
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Descargar RL_CIR
          </a>
        )}
      </div>

    </form>
  );
};

export default FormularioRLCir;