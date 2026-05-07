import React, { useEffect, useRef } from 'react';

import { FormularioCorrespondencia } from './FormularioCorrespondencia';
import { ModalConfirmacionArchivo } from './ModalConfirmacionArchivo';
import { PanelArchivoAdjunto } from './PanelArchivoAdjunto';
import { useRegistrarCorrespondencia } from '../hooks/useRegistrarCorrespondencia';

export const FormularioRegistrarCorrespondencia = ({ onRegistroExitoso, tiposCorrespondencia = [] }) => {
  const ultimoRegistroRef = useRef(null);

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

  useEffect(() => {
    if (!registroExitoso) return;
    const id = registroExitoso?.id || registroExitoso?.idCorrespondencia || registroExitoso?.correspondenciaId || null;
    const key = id ? String(id) : JSON.stringify(registroExitoso);
    if (ultimoRegistroRef.current === key) return;
    ultimoRegistroRef.current = key;
    onRegistroExitoso?.(registroExitoso);
  }, [onRegistroExitoso, registroExitoso]);

  return (
    <div className="form-container-corr">
      <div className="form-card-corr">
        <form onSubmit={handleSubmit}>
          <div className="form-group-corr full-width">
            <label htmlFor="idTipoCorrespondencia">Tipo de Correspondencia *</label>
            <select
              id="idTipoCorrespondencia"
              name="idTipoCorrespondencia"
              value={formData.idTipoCorrespondencia || ''}
              onChange={handleChange}
              disabled={isLoading}
              required
            >
              <option value="">Seleccionar tipo...</option>
              {tiposCorrespondencia.map((t) => (
                <option key={t.idTipo} value={t.idTipo}>
                  {t.descripcion}
                </option>
              ))}
            </select>
          </div>

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
            <button type="submit" className="btn-primario-corr" disabled={isLoading}>
              {isLoading ? <span className="spinner-corr" style={{ marginRight: '0.6rem' }} /> : null}
              Guardar Registro
            </button>
          </div>
        </form>
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

