import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const ContestacionAutoridadForm = ({
  folio, contestacion, setContestacion, decision, setDecision, onGuardadoExitoso
}) => {
  const [guardando, setGuardando] = useState(false);
  const [error, setError]         = useState(null);
  const [guardado, setGuardado]   = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) =>
    setContestacion(prev => ({ ...prev, [field]: e.target.value }));

  const handleArchivo = (e) => {
    const file = e.target.files?.[0];
    if (file?.type === 'application/pdf')
      setContestacion(prev => ({ ...prev, archivoPDF: file }));
    else setError('Solo se permiten archivos PDF');
  };

  const handleGuardar = async () => {
    if (!contestacion.numOficio || !contestacion.dependencia) {
        setError('El número de oficio y la dependencia son obligatorios');
        return;
    }
    if (!decision) {
        setError('Debes seleccionar una decisión antes de guardar');
        return;
    }
    if (!contestacion.archivoPDF) {
        setError('Debes adjuntar el PDF de la contestación');
        return;
    }
    setGuardando(true);
    setError(null);
    try {
        const fd = new FormData();
        fd.append('folioExpediente', folio);
        fd.append('numeroOficio',    contestacion.numOficio);
        fd.append('nombreTitular',   contestacion.encargado || '');
        fd.append('observaciones',   contestacion.observaciones || '');
        fd.append('decision',        decision.toUpperCase());
        fd.append('archivoPDF',      contestacion.archivoPDF);

        const res = await fetch(`${API}/api/v1/contestacion-autoridad/guardar`, {
            method: 'POST', body: fd,
        });
        if (!res.ok) throw new Error();
            onGuardadoExitoso(decision);
    } catch {
        setError('Error al guardar la contestación');
    } finally {
        setGuardando(false);
    }
};

  return (
    <div>
      {/* ── BLOQUE 1: Registro ── */}
      <section className="ca-card">
        <h2 className="ca-card-title">📥 Registro de Contestación Recibida</h2>

        {error && <div className="ca-alert-error">{error}</div>}

        <div className="ca-grid-2">
          <div className="ca-field">
            <label>Número de Oficio <span className="ca-req">*</span></label>
            <input
              type="text"
              value={contestacion.numOficio}
              onChange={handleChange('numOficio')}
              placeholder="Ej: DI/3239/2025"
            />
          </div>
          <div className="ca-field">
            <label>Nombre de la Dependencia <span className="ca-req">*</span></label>
            <input
              type="text"
              value={contestacion.dependencia}
              onChange={handleChange('dependencia')}
              placeholder="Ej: Secretaría de Finanzas"
            />
          </div>
          <div className="ca-field">
            <label>Encargado / Firmante <span className="ca-opcional">(opcional)</span></label>
            <input
              type="text"
              value={contestacion.encargado}
              onChange={handleChange('encargado')}
              placeholder="Ej: Subdirector de Ingresos"
            />
          </div>
          <div className="ca-field">
            <label>Observaciones <span className="ca-opcional">(opcional)</span></label>
            <input
              type="text"
              value={contestacion.observaciones}
              onChange={handleChange('observaciones')}
              placeholder="Observaciones internas..."
            />
          </div>
        </div>

        <div className="ca-upload-wrap">
          <label className="ca-upload-label">
            📎 PDF de la Contestación <span className="ca-req">*</span>
          </label>
          <div className="ca-upload-box">
            <input type="file" accept=".pdf" onChange={handleArchivo} />
            <span>
              {contestacion.archivoPDF
                ? `✓ ${contestacion.archivoPDF.name}`
                : 'Seleccionar PDF...'}
            </span>
          </div>
        </div>

        <button
          className="ca-btn-guardar"
          onClick={handleGuardar}
          disabled={guardando || guardado}
        >
          {guardado ? '✓ Guardado' : guardando ? 'Guardando...' : '💾 Guardar Contestación'}
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
    </div>
  );
};