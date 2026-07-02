import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorACCI } from './EditorACCI';
import './contestacion-autoridad.css';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';

export const ContestacionAutoridadPage = () => {
  const { folio } = useParams();
  const navigate  = useNavigate();

  const [expediente, setExpediente]   = useState(null);
  const [decision, setDecision]       = useState(null); // 'acci' | 'resolucion'
  const [guardando, setGuardando]     = useState(false);
  const [error, setError]             = useState(null);

  // Campos bloque 1 — contestación recibida
  const [numOficio, setNumOficio]         = useState('');
  const [dependencia, setDependencia]     = useState('');
  const [encargado, setEncargado]         = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [archivoPDF, setArchivoPDF]       = useState(null);

  useEffect(() => {
    if (!folio) return;
    fetch(`${API}/api/v1/expedientes/${folio}`)
      .then(r => r.json())
      .then(setExpediente)
      .catch(() => setError('No se pudo cargar el expediente'));
  }, [folio]);

  const handleArchivoChange = (e) => {
    const file = e.target.files?.[0];
    if (file?.type === 'application/pdf') setArchivoPDF(file);
    else setError('Solo se permiten archivos PDF');
  };

  const handleGuardarContestacion = async () => {
    if (!numOficio || !dependencia) {
      setError('El número de oficio y la dependencia son obligatorios');
      return;
    }
    if (!archivoPDF) {
      setError('Debes adjuntar el PDF de la contestación');
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('folioExpediente',  folio);
      formData.append('numeroOficio',     numOficio);
      formData.append('dependencia',      dependencia);
      formData.append('encargado',        encargado || '');
      formData.append('observaciones',    observaciones || '');
      formData.append('archivoPDF',       archivoPDF);

      await fetch(`${API}/api/v1/contestacion-autoridad/guardar`, {
        method: 'POST',
        body: formData,
      });
    } catch {
      setError('Error al guardar la contestación');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="ca-page">

      {/* ── Encabezado ── */}
      <button className="ca-back-btn" onClick={() => navigate(-1)}>
        ← Regresar
      </button>
      <h1 className="ca-title">Contestación de Autoridad</h1>
      {expediente && (
        <p className="ca-folio">Expediente: <strong>{expediente.folioGobierno}</strong></p>
      )}

      {error && <div className="ca-alert-error">{error}</div>}

      {/* ── BLOQUE 1: Registro de la contestación ── */}
      <section className="ca-card">
        <h2 className="ca-card-title">📥 Registro de Contestación Recibida</h2>
        <div className="ca-grid-2">

          <div className="ca-field">
            <label>Número de Oficio <span className="ca-req">*</span></label>
            <input
              type="text"
              value={numOficio}
              onChange={e => setNumOficio(e.target.value)}
              placeholder="Ej: DI/3239/2025"
            />
          </div>

          <div className="ca-field">
            <label>Nombre de la Dependencia <span className="ca-req">*</span></label>
            <input
              type="text"
              value={dependencia}
              onChange={e => setDependencia(e.target.value)}
              placeholder="Ej: Secretaría de Finanzas"
            />
          </div>

          <div className="ca-field">
            <label>Encargado / Firmante de la Dependencia <span className="ca-opcional">(opcional)</span></label>
            <input
              type="text"
              value={encargado}
              onChange={e => setEncargado(e.target.value)}
              placeholder="Ej: Subdirector de Ingresos"
            />
          </div>

          <div className="ca-field">
            <label>Observaciones <span className="ca-opcional">(opcional)</span></label>
            <input
              type="text"
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              placeholder="Observaciones internas..."
            />
          </div>

        </div>

        {/* Upload PDF */}
        <div className="ca-upload-wrap">
          <label className="ca-upload-label">
            📎 PDF de la Contestación <span className="ca-req">*</span>
          </label>
          <div className="ca-upload-box">
            <input type="file" accept=".pdf" onChange={handleArchivoChange} />
            <span>{archivoPDF ? `✓ ${archivoPDF.name}` : 'Seleccionar PDF...'}</span>
          </div>
        </div>

        <button
          className="ca-btn-guardar"
          onClick={handleGuardarContestacion}
          disabled={guardando}
        >
          {guardando ? 'Guardando...' : '💾 Guardar Contestación'}
        </button>
      </section>

      {/* ── BLOQUE 2: Decisión ── */}
      <section className="ca-card">
        <h2 className="ca-card-title">⚖️ Decisión</h2>
        <p className="ca-decision-desc">
          Con base en la contestación recibida, selecciona la acción a seguir:
        </p>
        <div className="ca-decision-btns">
          <button
            className={`ca-decision-btn ${decision === 'acci' ? 'is-selected' : ''}`}
            onClick={() => setDecision('acci')}
          >
            <span className="ca-decision-icon">📋</span>
            <span className="ca-decision-label">Generar ACCI</span>
            <span className="ca-decision-sub">Acuerdo de Informe de Investigación</span>
          </button>
          <button
            className={`ca-decision-btn ${decision === 'resolucion' ? 'is-selected' : ''}`}
            onClick={() => setDecision('resolucion')}
          >
            <span className="ca-decision-icon">📄</span>
            <span className="ca-decision-label">Pasar a Resolución</span>
            <span className="ca-decision-sub">Emitir informe de resolución directamente</span>
          </button>
        </div>
      </section>

      {/* ── BLOQUE 3: Editor ACCI ── */}
      {decision === 'acci' && (
        <EditorACCI
          expediente={expediente}
          contestacion={{ numOficio, dependencia, encargado }}
          folioExpediente={folio}
        />
      )}

      {/* ── Resolución directa ── */}
      {decision === 'resolucion' && (
        <section className="ca-card">
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>
            Redirigiendo al flujo de resolución...
          </p>
          {navigate(`/area-sustantiva/resolucion/${folio}`)}
        </section>
      )}

    </div>
  );
};