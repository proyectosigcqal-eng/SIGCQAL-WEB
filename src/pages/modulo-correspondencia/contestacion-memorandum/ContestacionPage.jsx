import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VistaPreviaMemorandum } from '../../../features/modulo-correspondencia/memorandum/components/VistaPreviaMemorandum';;
import { FormularioContestacion } from '../../../features/modulo-correspondencia/contestacion-memorandum/components/FormularioContestacion'
import { registrarSeguimiento } from '../../../features/modulo-correspondencia/memorandum/services/memorandumService';

export const ContestacionPage = () => {
  return (
    <div className="contestacion-page">
      {/* 1. Header de la página */}
      <div className="page-header-box">
        <h2>Seguimiento de Memorándum</h2>
        <p className="text-muted">Gestión de respuesta y cierre de folio institucional.</p>
      </div>

      {/* 2. Layout dividido */}
      <div className="split-layout">
        
        {/* LADO IZQUIERDO: Documento Original */}
        <section className="card-container">
          <div className="card-title-bar">
            <span>📄</span>
            <h5>Documento Original de Instrucción</h5>
          </div>
          <div className="form-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
             {/* Aquí va tu componente <VistaPreviaMemorandum /> */}
             <div className="alert alert-secondary border-0">
               Cargando previsualización del documento...
             </div>
          </div>
        </section>

        {/* LADO DERECHO: Formulario de Acción */}
        <section className="card-container">
          <div className="card-title-bar">
            <span>📝</span>
            <h5>Formulario de Captura de Respuesta</h5>
          </div>
          
          <form className="form-body">
            <div className="input-group-custom">
              <label>Número de Oficio de Salida</label>
              <input type="text" className="form-input-styled" placeholder="Ej. CEDC-045/2026" />
            </div>

            <div className="input-group-custom">
              <label>Informe de atención</label>
              <textarea className="form-input-styled" rows="6" placeholder="Describe la resolución de este memorándum..."></textarea>
            </div>

            <div className="input-group-custom">
              <label>Carga de Oficio Firmado </label>
              <div className="pdf-upload-zone">
                <div className="upload-icon">📁</div>
                <p className="mb-0 fw-bold text-dark">Arrastra el archivo PDF o haz clic aquí</p>
                <small className="text-muted">Solo archivos PDF oficiales firmados.</small>
              </div>
            </div>

            <button type="submit" className="btn-submit-action shadow">
              CONCLUIR Y GUARDAR SEGUIMIENTO
            </button>
          </form>
        </section>

      </div>
    </div>
  );
};