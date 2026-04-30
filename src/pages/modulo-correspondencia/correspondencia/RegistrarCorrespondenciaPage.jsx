import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormularioRegistrarCorrespondencia } from '@/features/modulo-correspondencia/correspondencia/components/FormularioRegistrarCorrespondencia';
import { IndicadorFlujo } from '@/features/modulo-correspondencia/correspondencia/components/IndicadorFlujo';
import { TablaCorrespondencias } from '@/features/modulo-correspondencia/correspondencia/components/TablaCorrespondencias';
import { useRegistrarCorrespondencia } from '@/features/modulo-correspondencia/correspondencia/hooks/useRegistrarCorrespondencia';
import { listarCorrespondencias } from '@/features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { useCatalogos } from '@/shared/hooks/useCatalogos';
import '@/features/modulo-correspondencia/correspondencia/styles/correspondencia.css';

export const RegistrarCorrespondenciaPage = () => {
  const navigate = useNavigate();

  const { areas, usuarios, cargandoCatalogos } = useCatalogos();
  const catalogos = useMemo(() => ({ areas, usuarios }), [areas, usuarios]);

  const [correspondencias, setCorrespondencias] = useState([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [errorLista, setErrorLista] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [detalle, setDetalle] = useState(null);

  const {
    formData,
    loading,
    error,
    correspondenciaRegistrada,
    flujoActual,
    handleChange,
    handleSubmit,
    onNuevoRegistro
  } = useRegistrarCorrespondencia();

  const cargarCorrespondencias = useCallback(async () => {
    setLoadingLista(true);
    setErrorLista(null);
    try {
      const data = await listarCorrespondencias();
      const items = Array.isArray(data) ? data : data?.items || data?.content || data?.data || [];
      setCorrespondencias(Array.isArray(items) ? items : []);
    } catch (e) {
      const mensaje =
        e?.response?.data?.message ||
        e?.response?.data?.mensaje ||
        e?.message ||
        'No se pudo cargar el listado de correspondencias.';
      setErrorLista(mensaje);
      setCorrespondencias([]);
    } finally {
      setLoadingLista(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      void cargarCorrespondencias();
    }, 0);
    return () => clearTimeout(t);
  }, [cargarCorrespondencias]);

  useEffect(() => {
    if (flujoActual === 'exitoso_acuse' || flujoActual === 'exitoso_memorandum') {
      const t = setTimeout(() => {
        void cargarCorrespondencias();
      }, 0);
      return () => clearTimeout(t);
    }
    return;
  }, [flujoActual, cargarCorrespondencias]);

  const filtradas = useMemo(() => {
    const q = (filtro || '').trim().toLowerCase();
    if (!q) return correspondencias;
    return correspondencias.filter((c) => {
      const folio = String(c?.folioUnico ?? c?.folio_unico ?? c?.folio ?? '').toLowerCase();
      const asunto = String(c?.asunto ?? '').toLowerCase();
      return folio.includes(q) || asunto.includes(q);
    });
  }, [correspondencias, filtro]);

  const irAMemorandum = useCallback(
    (c) => {
      const id =
        c?.idCorrespondencia ??
        c?.id_correspondencia ??
        correspondenciaRegistrada?.idCorrespondencia ??
        correspondenciaRegistrada?.id_correspondencia ??
        correspondenciaRegistrada?.id;

      navigate('/correspondencia/nuevo-memorandum', {
        state: {
          idCorrespondencia: id
        }
      });
    },
    [navigate, correspondenciaRegistrada]
  );

  const verDetalle = useCallback((c) => {
    setDetalle(c);
  }, []);

  return (
    <div className="registrar-page-container">
      <div className="registrar-split">
        <section className="panel-formulario-correspondencia">
          <div>
            <h2 style={{ margin: 0 }}>Registrar Correspondencia de Entrada</h2>
            <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 6 }}>
              Correspondencia &gt; Nueva Entrada
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            {error ? <div className="alerta-error">{error}</div> : null}
            {cargandoCatalogos ? <div>Cargando catálogos...</div> : null}
            <FormularioRegistrarCorrespondencia
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              catalogos={catalogos}
              loading={loading}
            />
            <IndicadorFlujo
              flujoActual={flujoActual}
              correspondenciaRegistrada={correspondenciaRegistrada}
              onIrAMemorandum={() => irAMemorandum(correspondenciaRegistrada)}
              onNuevoRegistro={onNuevoRegistro}
              error={error}
            />
          </div>
        </section>

        <section className="panel-tabla-correspondencias">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12 }}>
            <div>
              <h2 style={{ margin: 0 }}>Correspondencias Registradas</h2>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 6 }}>
                Filtra por folio único o asunto
              </div>
            </div>
            <button type="button" className="btn-secundario-corr" onClick={cargarCorrespondencias} disabled={loadingLista}>
              Actualizar lista
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <input
              className="filtro-tabla"
              type="text"
              placeholder="Buscar por folio o asunto"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          {errorLista ? <div className="alerta-error">{errorLista}</div> : null}
          {loadingLista ? <div>Cargando correspondencias...</div> : null}

          {detalle ? (
            <div className="form-card-corr" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                <strong>Detalle</strong>
                <button type="button" className="btn-secundario-corr" onClick={() => setDetalle(null)}>
                  Cerrar
                </button>
              </div>
              <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap', fontSize: 12, color: '#0f172a' }}>
                {JSON.stringify(detalle, null, 2)}
              </pre>
            </div>
          ) : null}

          <TablaCorrespondencias
            correspondencias={filtradas}
            onVerDetalle={verDetalle}
            onIrAMemorandum={irAMemorandum}
          />
        </section>
      </div>
    </div>
  );
};
