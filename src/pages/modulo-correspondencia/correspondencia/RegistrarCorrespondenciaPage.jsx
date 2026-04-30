import React from 'react';
import { useNavigate } from 'react-router-dom';

import { FormularioCorrespondencia } from '@/features/modulo-correspondencia/correspondencia/components/FormularioCorrespondencia';
import { PanelArchivoAdjunto } from '@/features/modulo-correspondencia/correspondencia/components/PanelArchivoAdjunto';
import { ModalConfirmacionArchivo } from '@/features/modulo-correspondencia/correspondencia/components/ModalConfirmacionArchivo';
import { useRegistrarCorrespondencia } from '@/features/modulo-correspondencia/correspondencia/hooks/useRegistrarCorrespondencia';
import '@/features/modulo-correspondencia/correspondencia/styles/correspondencia.css';

export const RegistrarCorrespondenciaPage = () => {
  const navigate = useNavigate();

  const {
    formData,
    erroresCampo,
    archivoSeleccionado,
    archivoPreview,
    archivoConfirmado,
    errorArchivo,
    mostrarModalConfirmacion,
    isLoading,
    error,
    registroExitoso,
    tamanoArchivo,
    handleChange,
    handleArchivoChange,
    handleConfirmarArchivo,
    handleRechazarArchivo,
    handleQuitarArchivo,
    handleSubmit
  } = useRegistrarCorrespondencia();

  const folio =
    registroExitoso?.folioUnico ||
    registroExitoso?.folio ||
    registroExitoso?.folioGenerado ||
    registroExitoso?.consecutivo ||
    null;

  return (
    <div className="registrar-correspondencia-page">
      <div className="page-header-corr">
        <button type="button" className="btn-secundario-corr" onClick={() => navigate(-1)}>
          ← Correspondencia
        </button>
        <h1 className="page-title-corr">Registrar Nueva Entrada</h1>
        <div style={{ width: 180 }} />
      </div>

      <div className="form-container-corr">
        <div className="form-card-corr">
          {registroExitoso ? (
            <div className="alerta-exito">
              Registro guardado{folio ? ` · Folio generado: ${folio}` : ''}
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <FormularioCorrespondencia
              formData={formData}
              erroresCampo={erroresCampo}
              handleChange={handleChange}
              isLoading={isLoading}
              errorGlobal={error}
            />

            <div style={{ marginTop: '1.75rem' }}>
              <div className="form-section-title">Documento digitalizado</div>
              <PanelArchivoAdjunto
                archivoSeleccionado={archivoSeleccionado}
                archivoPreview={archivoPreview}
                archivoConfirmado={archivoConfirmado}
                errorArchivo={errorArchivo}
                onArchivoChange={handleArchivoChange}
                onQuitarArchivo={handleQuitarArchivo}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
              <button type="button" className="btn-secundario-corr" onClick={() => navigate(-1)} disabled={isLoading}>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primario-corr"
                disabled={isLoading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
              >
                {isLoading ? <span className="spinner-corr" /> : null}
                Guardar Registro
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacionArchivo
        visible={mostrarModalConfirmacion}
        nombreArchivo={archivoSeleccionado?.name || ''}
        tamanoArchivo={tamanoArchivo}
        previewUrl={archivoPreview}
        onConfirmar={handleConfirmarArchivo}
        onRechazar={handleRechazarArchivo}
      />
    </div>
  );
};
