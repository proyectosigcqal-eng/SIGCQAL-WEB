import React, { useEffect, useState } from 'react';
import { useRegistroExpediente } from '../hooks/useRegistroExpediente';
import { getAsesores, getMunicipios, getEstados } from '@/shared/services/catalogosServices';
import '@/features/modulo-area-sustantiva/registroexpediente/styles/registroExpediente.css';
import { ControlOperativo } from './ControlOperativo';
import { DatosContribuyente } from './DatosContribuyente';
import { ClasificacionAtencion } from './ClasificacionAtencion';
import { ComponenteCritico } from './ComponenteCritico';
import { ModalGuardarExpediente } from './ModalGuardarExpediente';
import {SolicitanteRepresentante} from './Solicitante';

// The presentational section components were moved to separate files under components/

export const RegistroExpedienteForm = () => {
  const [municipios, setMunicipios] = useState([]);
  const [asesores, setAsesores] = useState([]);
  const [estados, setEstados] = useState([]);
  const [isLoadingCatalogos, setIsLoadingCatalogos] = useState(true);
  const [catalogosError, setCatalogosError] = useState(null);

  const {
    formData,
    erroresCampo,
    isLoading,
    error,
    successMessage,
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

  // Cargar catálogos al montar el componente
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setIsLoadingCatalogos(true);
        setCatalogosError(null);
        
        const [municipiosData, asesoresData, estadosData] = await Promise.all([
          getMunicipios(),
          getAsesores(),
          getEstados()
        ]);
        
        console.log('Municipios cargados:', municipiosData);
        console.log('Asesores cargados:', asesoresData);
        console.log('Estados cargados:', estadosData);

        setMunicipios(municipiosData || []);
        setAsesores(asesoresData || []);
        setEstados(estadosData || []);
      } catch (err) {
        console.error('Error cargando catálogos:', err);
        setCatalogosError('Error al cargar los catálogos. Por favor recargue la página.');
      } finally {
        setIsLoadingCatalogos(false);
      }
    };

    cargarCatalogos();
  }, []);

  return (
    <div className="registro-expediente-container">
      <form onSubmit={handleSubmit} className="registro-expediente-form">
        <div className="form-wrapper">
          {(error || catalogosError) && (
            <div className="alerta-error" style={{ marginBottom: '1.5rem' }}>
              {error || catalogosError}
            </div>
          )}
          {successMessage && (
            <div className="alerta-exito" style={{ marginBottom: '1.5rem', color: '#0B6623' }}>
              {successMessage}
            </div>
          )}

          {isLoadingCatalogos ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos...</div>
          ) : (
            <>
              <ControlOperativo
                formData={formData}
                erroresCampo={erroresCampo}
                handleChange={handleChange}
                municipios={municipios}
                asesores={asesores}
              />

              <DatosContribuyente
                formData={formData}
                erroresCampo={erroresCampo}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleChangeNested={handleChangeNested}
                handleTipoPersonaChange={handleTipoPersonaChange}
                estados={estados}
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
            </>
          )}
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
