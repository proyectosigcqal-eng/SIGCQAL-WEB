import React from 'react';
import { useRegistroExpediente } from '../hooks/useRegistroExpediente';
import '@/features/modulo-area-sustantiva/registroexpediente/styles/registroExpediente.css';
import { ControlOperativo } from './ControlOperativo';
import { DatosContribuyente } from './DatosContribuyente';
import { ClasificacionAtencion } from './ClasificacionAtencion';
import { ComponenteCritico } from './ComponenteCritico';
import { ModalGuardarExpediente } from './ModalGuardarExpediente';
import {SolicitanteRepresentante} from './Solicitante';

const MUNICIPIOS = [
  { id: '1', nombre: 'San Salvador' },
  { id: '2', nombre: 'Santa Tecla' },
  { id: '3', nombre: 'Soyapango' },
];

const LOCALIDADES = [
  { id: '1', nombre: 'Centro' },
  { id: '2', nombre: 'Zona Rosa' },
  { id: '3', nombre: 'Mejoramiento Social' },
];

const ASESORES = [
  { id: '1', nombre: 'Lic. Juan Pérez' },
  { id: '2', nombre: 'Lic. María García' },
  { id: '3', nombre: 'Lic. Carlos López' },
];

const ESTADOS = [
  { id: '1', nombre: 'El Salvador' },
  { id: '2', nombre: 'Guatemala' },
  { id: '3', nombre: 'Honduras' },
];

// The presentational section components were moved to separate files under components/

export const RegistroExpedienteForm = () => {
  const {
    formData,
    erroresCampo,
    isLoading,
    error,
    mostrarModalGuardar,
    handleChange,
    handleChangeNested,
    handleTipoPersonaChange,
    handleTipoRepresentanteChange,
    handleTieneRepresentanteChange,
    handleClasificacionChange,
    handleFileChange,
    handleSubmit,
    handleConfirmarGuardar,
    handleCancelarGuardar
  } = useRegistroExpediente();

  return (
    <div className="registro-expediente-container">
      <form onSubmit={handleSubmit} className="registro-expediente-form">
        <div className="form-wrapper">
          {error && (
            <div className="alerta-error" style={{ marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          <ControlOperativo
            formData={formData}
            erroresCampo={erroresCampo}
            handleChange={handleChange}
            municipios={MUNICIPIOS}
            localidades={LOCALIDADES}
            asesores={ASESORES}
          />

          <DatosContribuyente
            formData={formData}
            erroresCampo={erroresCampo}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleChangeNested={handleChangeNested}
            handleTipoPersonaChange={handleTipoPersonaChange}
            estados={ESTADOS}
          />
          <SolicitanteRepresentante
            formData={formData}
            erroresCampo={erroresCampo}
            handleChangeNested={handleChangeNested}
          />

          <ClasificacionAtencion
            formData={formData}
            erroresCampo={erroresCampo}
            handleClasificacionChange={handleClasificacionChange}
          />

          <ComponenteCritico onGuardar={handleSubmit} isLoading={isLoading} />
        </div>
      </form>

      <ModalGuardarExpediente
        visible={mostrarModalGuardar}
        isLoading={isLoading}
        onConfirmar={handleConfirmarGuardar}
        onCancelar={handleCancelarGuardar}
      />
    </div>
  );
};
