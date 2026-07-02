import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckSquare, AlertTriangle, FileText, User, Shield } from 'lucide-react';
import '../../../../features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/checklist.css';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const DOCUMENTOS = [
  {
    id: 'escrito_inicial',
    titulo: 'Escrito inicial de queja firmado',
    descripcion: 'Documento original con firma autógrafa o electrónica.',
    icono: <FileText size={20} />,
  },
  {
    id: 'identificacion_oficial',
    titulo: 'Identificación oficial vigente',
    descripcion: 'INE, Pasaporte o Cédula Profesional del promovente.',
    icono: <User size={20} />,
  },
  {
    id: 'documento_acto',
    titulo: 'Documento que acredite el acto impugnado',
    descripcion: 'Boleta, requerimiento, multa o resolución de la autoridad.',
    icono: <FileText size={20} />,
  },
  {
    id: 'poder_notarial',
    titulo: 'Poder Notarial (en caso de Representante)',
    descripcion: 'Acreditación de la personalidad jurídica del representante legal.',
    icono: <Shield size={20} />,
  },
];

// Mapeo: id del checkbox → campo en la BD
const CAMPO_BD = {
  escrito_inicial:        'requisitoIdentificacion',
  identificacion_oficial: 'requisitoActosFiscales',
  documento_acto:         'requisitoNarrativaClara',
  poder_notarial:         'requisitoCompetenciaCedecon',
};

const checkedToPayload = (checked) => ({
  requisitoIdentificacion:     checked.escrito_inicial        ?? false,
  requisitoActosFiscales:      checked.identificacion_oficial ?? false,
  requisitoNarrativaClara:     checked.documento_acto         ?? false,
  requisitoCompetenciaCedecon: checked.poder_notarial         ?? false,
});

export const ChecklistDocumentosPage = () => {
  const { folio } = useParams();
  const navigate  = useNavigate();

  const [checked,    setChecked]    = useState({
    escrito_inicial:        false,
    identificacion_oficial: false,
    documento_acto:         false,
    poder_notarial:         false,
  });
  const [procesando,  setProcesando]  = useState(false);
  const [expediente,  setExpediente]  = useState(null);
  const [cargando,    setCargando]    = useState(true);
  const [errorDetalle, setErrorDetalle] = useState(null);

  // ── 1. Carga detalle del expediente ────────────────────────────────
  useEffect(() => {
    if (!folio) { setCargando(false); return; }

    fetch(`${API_BASE}/api/v1/expedientes/${folio}/detalle-asesoria`)
      .then(r => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then(data => {
        setExpediente(data);
        setErrorDetalle(null);
      })
      .catch(err => setErrorDetalle(err.message))
      .finally(() => setCargando(false));
  }, [folio]);

  // ── 2. Carga requisitos persistidos en BD ───────────────────────────
  useEffect(() => {
    if (!folio) return;

    fetch(`${API_BASE}/api/v1/quejas/${folio}/requisitos`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setChecked({
          escrito_inicial:        data.requisitoIdentificacion     ?? false,
          identificacion_oficial: data.requisitoActosFiscales      ?? false,
          documento_acto:         data.requisitoNarrativaClara     ?? false,
          poder_notarial:         data.requisitoCompetenciaCedecon ?? false,
        });
      })
      .catch(() => {}); // Si no hay queja aún, empieza en blanco
  }, [folio]);

  // ── 3. Toggle: actualiza UI inmediatamente + persiste en BD ─────────
  const toggleDoc = useCallback((id) => {
    setChecked(prev => {
      const siguiente = { ...prev, [id]: !prev[id] };

      // Fire-and-forget — no bloquea la UI si falla
      fetch(`${API_BASE}/api/v1/quejas/${folio}/requisitos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkedToPayload(siguiente)),
      }).catch(() => {});

      return siguiente;
    });
  }, [folio]);

  const todosValidados = DOCUMENTOS.every(d => checked[d.id]);

  // ── 4. PROCEDE ───────────────────────────────────────────────────────
  const handleProcede = useCallback(async () => {
  if (!todosValidados) return;
  setProcesando(true);
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/quejas/${folio}/admitir`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    );
    if (!res.ok) throw new Error(`Error ${res.status}`);
  } catch (e) {
    console.error('[Checklist] Error al admitir:', e.message);
  } finally {
    setProcesando(false);
    navigate('/atencion-juridica/bandeja'); // ← corregido, igual que requerir aclaración
  }
}, [folio, navigate, todosValidados]);

  // ── 5. REQUIERE ACLARACIÓN ───────────────────────────────────────────
  const handleRequiereAclaracion = useCallback(async () => {
    setProcesando(true);
    try {
      await fetch(
        `${API_BASE}/api/v1/quejas/${folio}/requerir-aclaracion`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );
    } catch (e) {
      console.error('[Checklist] Error al requerir aclaración:', e.message);
    } finally {
      setProcesando(false);
      navigate('/atencion-juridica/bandeja');
    }
  }, [folio, navigate]);

  // ── Helpers cabecera ─────────────────────────────────────────────────
  const quejoso   = expediente?.contribuyente ?? '—';
  const asunto    = expediente?.analisis_legal?.tipo_acto_impuesto
                 ?? expediente?.descripcion_sintetica
                 ?? '—';
  const autoridad = expediente?.autoridad_responsable
                 ?? expediente?.analisis_legal?.autoridad_fiscal_emisora
                 ?? '—';

  return (
    <div className="chk-page">

      {/* ── Cabecera ── */}
      <div className="chk-header-card">
        <div className="chk-header-item">
          <div className="chk-header-label">FOLIO</div>
          <div className="chk-header-folio">{folio}</div>
        </div>
        <div className="chk-header-item">
          <div className="chk-header-label">QUEJOSO</div>
          <div className="chk-header-value">
            {cargando ? '...' : quejoso}
          </div>
        </div>
        <div className="chk-header-item">
          <div className="chk-header-label">ASUNTO DE LA QUEJA</div>
          <div className="chk-header-value">
            {cargando ? '...' : asunto}
          </div>
        </div>
        <div className="chk-header-item">
          <div className="chk-header-label">AUTORIDAD</div>
          <div className="chk-header-value">
            {cargando ? '...' : autoridad}
          </div>
        </div>
      </div>

      {/* Error no crítico — no bloquea el checklist */}
      {errorDetalle && (
        <div style={{
          background: '#fef9c3', border: '1px solid #fde047',
          borderRadius: 8, padding: '0.6rem 1rem',
          color: '#854d0e', fontSize: '0.8rem', marginBottom: '1rem',
        }}>
          ⚠ No se pudo cargar el detalle del expediente. El checklist sigue disponible.
        </div>
      )}

      <div className="chk-layout">

        {/* ── Lista de documentos ── */}
        <div className="chk-card">
          <div className="chk-card-header">
            <CheckSquare size={20} />
            <h2 className="chk-card-title">VALIDACIÓN DE DOCUMENTOS OBLIGATORIOS</h2>
          </div>

          <ul className="chk-list">
            {DOCUMENTOS.map((doc) => (
              <li
                key={doc.id}
                className={`chk-item ${checked[doc.id] ? 'chk-item--checked' : ''}`}
                onClick={() => toggleDoc(doc.id)}
              >
                <div className={`chk-checkbox ${checked[doc.id] ? 'chk-checkbox--checked' : ''}`}>
                  {checked[doc.id] && (
                    <svg viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5l3 4L11 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="chk-item-body">
                  <div className="chk-item-titulo">{doc.titulo}</div>
                  <div className="chk-item-desc">{doc.descripcion}</div>
                </div>
                <div className="chk-item-icon">{doc.icono}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Panel de acciones ── */}
        <div className="chk-aside">
          <div className="chk-aside-label">ACCIONES DE CALIFICACIÓN</div>

          <button
            className={`chk-btn chk-btn--procede ${!todosValidados ? 'chk-btn--disabled' : ''}`}
            disabled={!todosValidados || procesando}
            onClick={handleProcede}
          >
            <CheckSquare size={18} />
            PROCEDE (ADMISIÓN)
          </button>

          <button
            className="chk-btn chk-btn--aclaracion"
            disabled={procesando}
            onClick={handleRequiereAclaracion}
          >
            <AlertTriangle size={18} />
            REQUIERE ACLARACIÓN
          </button>

          <p className="chk-hint">
            * El botón "Procede" se habilitará una vez que se hayan validado
            todos los documentos del checklist. "Requiere Aclaración" está
            siempre disponible.
          </p>

          <div className="chk-aviso">
            <div className="chk-aviso-title">ⓘ AVISO INSTITUCIONAL</div>
            <p>
              La admisión de la queja inicia el plazo legal de resolución
              conforme a los Lineamientos Generales de la SIGCQAL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};