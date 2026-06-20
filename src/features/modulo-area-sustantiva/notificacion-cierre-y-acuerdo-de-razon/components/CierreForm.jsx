import React from 'react';
import '../styles/CierreForm.css';

const CierreForm = ({ data, disabled, onOpenModal, onMedioChange, onFileChange, isLoading }) => {
  const handleFileInput = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    onFileChange(file);
  };

  return (
    <div className={`cierre-form-container ${disabled ? 'disabled' : ''}`}>
      {/* Información del expediente (Datos de solo lectura) */}
      <div className="info-header">
        <p><strong>Folio de Gobierno:</strong> {data.folio}</p>
        <p><strong>Folio Expediente:</strong> {data.expediente}</p>
        <p><strong>Quejoso:</strong> {data.quejoso}</p>
      </div>

      <hr />
      <div className="form-fields">
        <div>
          <label>Medio de notificación de la resolución</label>
          <select value={data.medioNotificacion} disabled={disabled} onChange={onMedioChange}>
            <option value="Correo Electrónico">Correo Electrónico</option>
            <option value="Teléfono / Mensajería">Teléfono / Mensajería</option>
          </select>
        </div>

        <div>
          <label>Cargar acuerdo de razón (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            disabled={disabled}
            onChange={handleFileInput}
          />
          {data.acuerdoFileName && <p className="file-name">Archivo seleccionado: {data.acuerdoFileName}</p>}
        </div>
      </div>

      {/* Botón de acción */}
      {!disabled && (
        <button className="btn-finalizar" onClick={onOpenModal} disabled={isLoading}>
          {isLoading ? 'Procesando...' : 'FINALIZAR PROCESO DEFINITIVAMENTE'}
        </button>
      )}
    </div>
  );
};

export default CierreForm;