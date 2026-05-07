import React from 'react';
import { useNavigate } from 'react-router-dom';

import { BandejaAreaAsignada } from '@/features/modulo-correspondencia/correspondencia/components/BandejaAreaAsignada';
import { BandejaSinArea } from '@/features/modulo-correspondencia/correspondencia/components/BandejaSinArea';
import { AdminViewCorrespondencias } from '@/features/modulo-correspondencia/correspondencia/components/AdminViewCorrespondencias';
import { FormularioRegistrarCorrespondencia } from '@/features/modulo-correspondencia/correspondencia/components/FormularioRegistrarCorrespondencia';
import { ModalAsignarArea } from '@/features/modulo-correspondencia/correspondencia/components/ModalAsignarArea';
import { usePostRegistroCorrespondencia } from '@/features/modulo-correspondencia/correspondencia/hooks/usePostRegistroCorrespondencia';
import { useCatalogos } from '@/shared/hooks/useCatalogos';
import '@/features/modulo-correspondencia/correspondencia/styles/correspondencia.css';

export const RegistrarCorrespondenciaPage = () => {
  const navigate = useNavigate();

  const { tiposCorrespondencia } = useCatalogos();

  const {
    fase,
    correspondenciaRegistrada,
    areaSeleccionada,
    areas,
    correspondenciasSinArea,
    loading,
    error,
    onFormularioGuardado,
    onConfirmarConArea,
    onSaltarSinArea,
    onNuevoRegistro,
    onGenerarMemorandum
  } = usePostRegistroCorrespondencia();

  return (
    <div className="registrar-correspondencia-page">
      <div className="page-header-corr">
        <button type="button" className="btn-secundario-corr" onClick={() => navigate(-1)}>
          ← Correspondencia
        </button>
        <h1 className="page-title-corr">Registrar Nueva Entrada</h1>
        <div style={{ width: 180 }} />
      </div>

      {error ? (
        <div className="form-container-corr" style={{ paddingTop: '1rem', paddingBottom: 0 }}>
          <div className="alerta-error" style={{ marginBottom: 0 }}>
            {error}
          </div>
        </div>
      ) : null}

      {fase === 'MODAL_AREA' ? (
        <ModalAsignarArea
          visible={true}
          areas={areas}
          onConfirmar={onConfirmarConArea}
          onSaltarSinArea={onSaltarSinArea}
        />
      ) : null}

      {fase === 'GUARDANDO' || loading ? (
        <div className="form-container-corr" style={{ maxWidth: 860 }}>
          <div className="form-card-corr" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="spinner-corr" />
            <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Procesando...</div>
          </div>
        </div>
      ) : null}

      {fase === 'FORMULARIO' ? (
        <div style={{ padding: '1.5rem' }}>
          <FormularioRegistrarCorrespondencia
            onRegistroExitoso={onFormularioGuardado}
            tiposCorrespondencia={tiposCorrespondencia}
          />
        </div>
      ) : null}

      {fase === 'SIN_AREA' ? (
        <div className="registrar-split-vertical">
          <BandejaSinArea correspondencias={correspondenciasSinArea} onGenerarMemorandum={onGenerarMemorandum} />

          <AdminViewCorrespondencias
            correspondencias={todasCorrespondencias}
            areas={areas}
            onGenerarMemorandum={(correspondencia) => {
              navigate(`/correspondencia/nuevo-memorandum/${correspondencia.id}`);
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-primario-corr" onClick={onNuevoRegistro}>
              + Registrar otra
            </button>
          </div>
        </div>
      ) : null}

      {fase === 'CON_AREA' ? (
        <BandejaAreaAsignada
          correspondencia={correspondenciaRegistrada}
          areaSeleccionada={areaSeleccionada}
          onNuevoRegistro={onNuevoRegistro}
        />
      ) : null}
    </div>
  );
};
