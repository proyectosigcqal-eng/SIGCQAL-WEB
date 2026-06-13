import { useState, useCallback, useEffect } from 'react'; // <-- Agregamos useEffect
import { useParams, useNavigate } from 'react-router-dom';
import { CheckSquare, AlertTriangle, FileText, User, Shield, Gavel } from 'lucide-react';
import '../../../../features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/checklist.css';

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

export const ChecklistDocumentosPage = () => {
  const { folio } = useParams();
  const navigate  = useNavigate();

  const [checked, setChecked] = useState({});
  const [procesando, setProcesando] = useState(false);
  
  // NUEVO: Estado para guardar la información del expediente
  const [expediente, setExpediente] = useState(null);

  // NUEVO: Hook para traer los datos del backend al cargar la página
  useEffect(() => {
    const fetchExpedienteInfo = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';
        // Ajusta esta ruta a tu endpoint real que devuelve el detalle del expediente
        const res = await fetch(`${API_BASE}/api/clasificacion-juridica/expedientes/${folio}`); 
        
        if (res.ok) {
          const data = await res.json();
          console.log("Datos recibidos del backend:", data);
          setExpediente(data);
        }
      } catch (error) {
        console.error('Error al cargar la información del expediente:', error);
      }
    };

    if (folio) {
      fetchExpedienteInfo();
    }
  }, [folio]);

  const toggleDoc = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const todosValidados = DOCUMENTOS.every((d) => checked[d.id]);

  // ── PROCEDE → quita semáforo, habilita CIR ──────────────────────────
  const handleProcede = useCallback(async () => {
    if (!todosValidados) return;
    setProcesando(true);
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev'}/api/v1/quejas/${folio}/admitir`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );
      navigate(`/atencion-juridica/tramites-irl/${folio}?accion=generar-cir`);
    } catch {
      navigate(`/atencion-juridica/tramites-irl/${folio}?accion=generar-cir`);
    } finally {
      setProcesando(false);
    }
  }, [folio, navigate, todosValidados]);

  // ── REQUIERE ACLARACIÓN → regresa a la bandeja con semáforo activo ──
  const handleRequiereAclaracion = useCallback(async () => {
    setProcesando(true);
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev'}/api/v1/quejas/${folio}/requerir-aclaracion`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );
    } catch {
    } finally {
      setProcesando(false);
      navigate('/atencion-juridica/bandeja');
    }
  }, [folio, navigate]);

  return (
    <div className="chk-page">

      {/* ── Cabecera del expediente ── */}
      <div className="chk-header-card">
        <div className="chk-header-item">
          <div className="chk-header-label">FOLIO</div>
          <div className="chk-header-folio">{folio}</div>
        </div>
        <div className="chk-header-item">
  <div className="chk-header-label">QUEJOSO</div>
  <div className="chk-header-value">
    {expediente?.contribuyente || '—'}
  </div>
</div>

<div className="chk-header-item">
  <div className="chk-header-label">ASUNTO DE LA QUEJA</div>
  <div className="chk-header-value">
    {expediente?.analisis_legal?.tipo_acto_impuesto 
     || expediente?.descripcion_sintetica 
     || '—'}
  </div>
</div>

<div className="chk-header-item">
  <div className="chk-header-label">AUTORIDAD</div>
  <div className="chk-header-value">
    {expediente?.analisis_legal?.autoridad_fiscal_emisora
     || expediente?.autoridad_responsable
     || '—'}
  </div>
</div>
      </div>

      <div className="chk-layout">
        {/* ── Lista de documentos (Se mantiene igual) ── */}
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
                      <path d="M1 5l3 4L11 1" stroke="white" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" />
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

        {/* ── Panel de acciones (Se mantiene igual) ── */}
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