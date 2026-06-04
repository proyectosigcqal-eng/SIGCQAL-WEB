import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistroExpedienteForm } from '@/features/modulo-area-sustantiva/registroexpediente/components/RegistroExpedienteForm';

export const RegistroExpedientePage = () => {
  const navigate = useNavigate();

  return (
    <div className="registro-expediente-page-container">
      <div className="page-header-registro-expediente">
        <button 
          type="button" 
          className="btn-volver"
          onClick={() => navigate(-1)}
        >
          ← Atrás
        </button>
        <h1 className="page-title-registro-expediente">Registro y Calificación de Expediente</h1>
        <div style={{ width: 100 }} />
      </div>

      <div className="page-content-registro-expediente">
        <RegistroExpedienteForm />
      </div>
    </div>
  );
};
