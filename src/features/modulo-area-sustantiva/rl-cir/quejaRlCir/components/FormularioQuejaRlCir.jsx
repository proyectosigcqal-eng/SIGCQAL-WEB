import React, { useEffect } from 'react';
import '../styles/quejaRlCir.css';

export const FormularioQuejaRlCir = ({ formData, handleChange, handleSubmit, catalogos, cargando, downloadUrl }) => {
  const listaAsesores = catalogos?.asesores || catalogos?.usuarios || [];

  const textoDefaultArticulos = "Artículos 14 y 16 de la Constitución Política de los Estados Unidos Mexicanos.";

  // Inicializa el fundamento por defecto si viene vacío
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
        <label>Fecha</label>
        <input 
          type="text" 
          name="fechaEmision" 
          value={formData.fechaEmision || ''} 
          onChange={handleChange}
          readOnly
          style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} 
          required
        />
      </div>

      <div className="form-group full-width">
        <label>Motivos</label>
        <textarea 
          name="motivos" 
          value={formData.motivos || ''} 
          onChange={handleChange} 
          rows={4} 
          placeholder="Se identificaron omisiones graves en la notificación del crédito..."
        />
      </div>

      <div className="form-group full-width">
        <label>Artículos</label>
        <textarea 
          name="articulos" 
          value={formData.articulos || ''} // Cambiado a '||' para evitar problemas de control de estado en React
          onChange={handleChange} 
          rows={4} 
          placeholder="Escriba los artículos de fundamento..."
        />
      </div>

      <div className="form-group full-width">
        <label>Número de Oficio</label>
        <input 
          type="text" 
          name="oficio" 
          value={formData.oficio || ''} 
          onChange={handleChange}
          placeholder="Ej. OF-SIAM-2026-0042"
          required
        />
      </div>

      <div className="form-group full-width">
        <label>Observaciones</label>
        <textarea 
          name="observaciones" 
          value={formData.observaciones || ''} 
          onChange={handleChange} 
          rows={3} 
          placeholder="El expediente cuenta con todas las constancias de remisión interna validadas..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Asesor Remitente</label>
          <select 
            name="idAsesorRemitente" 
            value={formData.idAsesorRemitente || ''} 
            onChange={handleChange}
          >
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
          <select 
            name="idAsesorRecibe" 
            value={formData.idAsesorRecibe || ''} 
            onChange={handleChange}
          >
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
            placeholder="Lic. Alejandro Mendoza Torres"
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primario" type="submit" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Guardar Queja RL_CIR'}
        </button>

        {/* Mapeo directo y nativo de la URL de descarga idéntico a QuejasAri */}
        {downloadUrl && (
          <a
            className="btn-descargar-quejaari"
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            📥 Descargar Queja RL_CIR
          </a>
        )}
      </div>

    </form>
  );
};

export default FormularioQuejaRlCir;