import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { listarCorrespondenciasPorTipo } from '@/features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { TablaCorrespondenciasExterna } from '@/features/modulo-correspondencia/correspondencia/components/TablaCorrespondenciasExterna';
import { TablaCorrespondenciasInterna } from '@/features/modulo-correspondencia/correspondencia/components/TablaCorrespondenciasInterna';
import '@/features/modulo-correspondencia/correspondencia/styles/correspondencia.css';

const getId = (item) =>
  item?.id ?? item?.idCorrespondencia ?? item?.correspondenciaId ?? item?.id_correspondencia ?? null;

export const CorrespondenciasRegistradasPage = () => {
  const navigate = useNavigate();

  const [vistaActual, setVistaActual] = useState('EXTERNA');
  const [corrExterna, setCorrExterna] = useState([]);
  const [corrInterna, setCorrInterna] = useState([]);
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

  const handleGenerarOficio = (item) => {
    const id = getId(item);
    if (!id) return;
    navigate(`/correspondencia/generar-oficio/${id}`);
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
          onGenerarOficio={handleGenerarOficio}
        />
      ) : null}

      {vistaActual === 'INTERNA' ? (
        <TablaCorrespondenciasInterna
          correspondencias={corrInterna}
          loading={loadingInt}
          onGenerarOficio={handleGenerarOficio}
        />
      ) : null}
    </div>
  );
};
