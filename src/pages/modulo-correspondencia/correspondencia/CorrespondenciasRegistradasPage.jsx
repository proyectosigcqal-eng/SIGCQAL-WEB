import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { listarCorrespondenciasPorTipo } from '@/features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { buscarOficioPorCorrespondencia } from '@/features/modulo-correspondencia/correspondencia/services/oficioContestacionService';
import { TablaCorrespondenciasExterna } from '@/features/modulo-correspondencia/correspondencia/components/TablaCorrespondenciasExterna';
import { TablaCorrespondenciasInterna } from '@/features/modulo-correspondencia/correspondencia/components/TablaCorrespondenciasInterna';
import '@/features/modulo-correspondencia/correspondencia/styles/correspondencia.css';

const getId = (item) =>
  item?.id ?? item?.idCorrespondencia ?? item?.correspondenciaId ?? item?.id_correspondencia ?? null;

export const CorrespondenciasRegistradasPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [vistaActual, setVistaActual] = useState('EXTERNA');
  const [corrExterna, setCorrExterna] = useState([]);
  const [corrInterna, setCorrInterna] = useState([]);
  const [oficiosGuardados, setOficiosGuardados] = useState({});
  const [loadingExt, setLoadingExt] = useState(false);
  const [loadingInt, setLoadingInt] = useState(false);
  const [error, setError] = useState(null);

  const cargarExterna = useCallback(async () => {
    setLoadingExt(true);
    setError(null);
    try {
      const data = await listarCorrespondenciasPorTipo('EXTERNA');
      setCorrExterna(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error al cargar correspondencia externa';
      setError(msg);
      setCorrExterna([]);
    } finally {
      setLoadingExt(false);
    }
  }, []);

  const cargarInterna = useCallback(async () => {
    setLoadingInt(true);
    setError(null);
    try {
      const data = await listarCorrespondenciasPorTipo('INTERNA');
      setCorrInterna(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error al cargar correspondencia interna';
      setError(msg);
      setCorrInterna([]);
    } finally {
      setLoadingInt(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([cargarExterna(), cargarInterna()]);
  }, [cargarExterna, cargarInterna]);

  useEffect(() => {
    const state = location.state;
    if (state?.tabActivo) {
      setVistaActual(state.tabActivo);
    }
    if (state?.refreshInterna) {
      cargarInterna();
    }
    if (state?.refreshExterna) {
      cargarExterna();
    }
  }, [cargarExterna, cargarInterna, location.state]);

  useEffect(() => {
    if (!corrInterna.length) {
      setOficiosGuardados({});
      return;
    }

    let cancelled = false;

    const verificar = async () => {
      const mapa = {};
      const batchSize = 10;

      for (let i = 0; i < corrInterna.length; i += batchSize) {
        const batch = corrInterna.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (corr) => {
            const id = getId(corr);
            if (!id) return;
            try {
              const oficio = await buscarOficioPorCorrespondencia(id);
              if (oficio) {
                const urlPdfFinal = oficio.urlPdfFinal ?? oficio.url_pdf_final ?? null;
                const numOficioSalida = oficio.numOficioSalida ?? oficio.num_oficio_salida ?? null;
                if (urlPdfFinal || numOficioSalida) {
                  mapa[id] = { urlPdfFinal, numOficioSalida };
                }
              }
            } catch (e) {
              console.error('Error al verificar oficio de correspondencia:', e);
            }
          })
        );
      }

      if (!cancelled) {
        setOficiosGuardados(mapa);
      }
    };

    verificar();

    return () => {
      cancelled = true;
    };
  }, [corrInterna]);

  const handleActualizar = () => {
    if (vistaActual === 'EXTERNA') {
      cargarExterna();
      return;
    }
    cargarInterna();
  };

  const handleGenerarMemo = (item) => {
    const id = getId(item);
    if (!id) return;
    navigate(`/correspondencia/nuevo-memorandum/${id}`);
  };

  const handleGenerarOficioExterno = (item) => {
    const id = getId(item);
    if (!id) return;
    navigate(`/correspondencia/generar-oficio-externo/${id}`);
  };

  const handleGenerarOficioInterno = (item) => {
    const id = getId(item);
    if (!id) return;
    navigate(`/correspondencia/generar-oficio-interno/${id}`);
  };

  return (
    <div className="correspondencias-registradas-page">
      <div className="page-header-corr">
        <button type="button" className="btn-secundario-corr" onClick={() => navigate(-1)}>
          ← Correspondencia
        </button>
        <h1 className="page-title-corr">Correspondencia Registrada</h1>
        <button
          type="button"
          className="btn-secundario-corr"
          onClick={handleActualizar}
          disabled={vistaActual === 'EXTERNA' ? loadingExt : loadingInt}
        >
          Actualizar lista
        </button>
      </div>

      <div className="vista-tabs">
        <button
          type="button"
          className={`vista-tab ${vistaActual === 'EXTERNA' ? 'active' : ''}`}
          onClick={() => setVistaActual('EXTERNA')}
        >
          Correspondencia Externa
        </button>
        <button
          type="button"
          className={`vista-tab ${vistaActual === 'INTERNA' ? 'active' : ''}`}
          onClick={() => setVistaActual('INTERNA')}
        >
          Correspondencia Interna
        </button>
      </div>

      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            color: '#dc2626',
            margin: '0 1.5rem 1rem',
            fontSize: '0.875rem'
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {vistaActual === 'EXTERNA' ? (
        <TablaCorrespondenciasExterna
          correspondencias={corrExterna}
          loading={loadingExt}
          onGenerarMemo={handleGenerarMemo}
          onGenerarOficio={handleGenerarOficioExterno}
        />
      ) : null}

      {vistaActual === 'INTERNA' ? (
        <TablaCorrespondenciasInterna
          correspondencias={corrInterna}
          loading={loadingInt}
          onGenerarOficio={handleGenerarOficioInterno}
          oficiosGuardados={oficiosGuardados}
        />
      ) : null}
    </div>
  );
};
