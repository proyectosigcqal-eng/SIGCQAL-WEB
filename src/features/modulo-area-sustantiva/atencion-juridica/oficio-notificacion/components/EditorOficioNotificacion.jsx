import { useState } from 'react';
import { useEffect } from 'react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const FECHA_HOY = new Date().toLocaleDateString('es-MX', {
  day: '2-digit', month: 'long', year: 'numeric'
});

const FUNDAMENTO_DEFAULT =
  'Lo anterior, con fundado en los artículos 25 fracciones III, IV y IX; ' +
  '33 fracción I, de la Ley de los Derechos y Defensa del Contribuyente del ' +
  'Estado de Zacatecas y sus Municipios; 19, 21 fracción V, 25 fracción I y ' +
  '27 de los Lineamientos Generales de Actuación de la Comisión Estatal de la ' +
  'Defensa del Contribuyente.';

export const EditorOficioNotificacion = ({ expediente, folioExpediente }) => {
  // ── Campos ROJOS — el usuario los llena ──────────────────────────────
  const [numOficio,               setNumOficio]               = useState('');
const [autoridades,     setAutoridades]     = useState([]);
const [idAutoridad,     setIdAutoridad]     = useState('');
const [nombreAutoridad, setNombreAutoridad] = useState('');
  const [fechaAcuerdo,            setFechaAcuerdo]            = useState('');
  const [fundamento,              setFundamento]              = useState(FUNDAMENTO_DEFAULT);
  const [inicialesAsesor,         setInicialesAsesor]         = useState('');
  const [tipoAcuerdo,      setTipoAcuerdo]      = useState('acuerdo de cierre');

  const [generando, setGenerando] = useState(false);
  const [urlDocx,   setUrlDocx]   = useState(null);
  const [error,     setError]     = useState(null);
  const [exito,     setExito]     = useState(false);

  // ── Campos VERDES — vienen del expediente ────────────────────────────
  const numExpediente = expediente?.folio
                     ?? expediente?.folioGobierno
                     ?? folioExpediente
                     ?? '[EXPEDIENTE]';
  const contribuyente = expediente?.contribuyente
                     ?? expediente?.nombreContribuyente
                     ?? '[CONTRIBUYENTE]';

                     useEffect(() => {
  fetch(`${API}/catalogos/autoridades`)
     .then(r => r.ok ? r.json() : [])
    .then(data => {
      console.log('Autoridades:', data); // ← revisa en consola cómo llegan los campos
      setAutoridades(data);
    })
    .catch(() => {});
}, []);

const handleAutoridadChange = (e) => {
  const id = e.target.value;
  setIdAutoridad(id);
  const found = autoridades.find(a => String(a.id) === String(id));
  setNombreAutoridad(found?.nombre ?? '');
};

  const handleGenerar = async () => {
    if (!numOficio || !idAutoridad || !fechaAcuerdo) {
  setError('Número de oficio, autoridad y fecha del acuerdo son obligatorios.');
  return;
}
    setGenerando(true);
    setError(null);
    setExito(false);

    try {
     const params = new URLSearchParams({
      folioExpediente: numExpediente,
      numOficio,
      nombreContribuyente: contribuyente,
      idAutoridad,
      nombreAutoridad,
      tipoAcuerdo,
      fechaAcuerdo,
      fundamento,
      inicialesAsesor: inicialesAsesor || '',
    });

      const res = await fetch(
        `${API}/api/v1/oficio-notificacion/generar?${params.toString()}`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setUrlDocx(data.url ?? null);
      setExito(true);
    } catch (e) {
      setError('Error al generar el oficio: ' + e.message);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <section className="ca-card">
      <h2 className="ca-card-title">📄 Generador de Oficio de Notificación</h2>

      {error && <div className="ca-alert-error">{error}</div>}
      {exito && (
        <div className="ca-alert-exito">
          ✓ Oficio generado correctamente.{' '}
          {urlDocx && (
            <a href={`${API}${urlDocx}`} target="_blank" rel="noreferrer" className="ca-btn-descargar">
              Descargar DOCX
            </a>
          )}
        </div>
      )}

      <div className="acci-layout">

        {/* ── Panel izquierdo: formulario ── */}
        <div className="acci-form-panel">
          <h3 className="acci-form-title">Campos a completar</h3>

          {/* Datos verdes — solo lectura, vienen del sistema */}
          <div className="acci-info-readonly">
            <div className="acci-readonly-item">
              <span className="acci-readonly-label">📋 Expediente</span>
              <span className="acci-readonly-value">{numExpediente}</span>
            </div>
            <div className="acci-readonly-item">
              <span className="acci-readonly-label">👤 Contribuyente</span>
              <span className="acci-readonly-value">{contribuyente}</span>
            </div>
            <div className="acci-readonly-item">
              <span className="acci-readonly-label">📅 Fecha oficio</span>
              <span className="acci-readonly-value">{FECHA_HOY}</span>
            </div>
          </div>

          {/* Campos rojos — el usuario los llena */}
          <div className="ca-field" style={{ marginTop: '1rem' }}>
            <label>Número de Oficio <span className="ca-req">*</span></label>
            <input
              type="text"
              value={numOficio}
              onChange={e => setNumOficio(e.target.value)}
              placeholder="Ej: CEDECON-DTJ-071/2026"
            />
          </div>

          <div className="ca-field" style={{ marginTop: '1rem' }}>
  <label>Autoridad Destinataria <span className="ca-req">*</span></label>
  <select value={idAutoridad} onChange={handleAutoridadChange}>
    <option value="">-- Selecciona una autoridad --</option>
   {autoridades.map(a => (
  <option key={a.id} value={a.id}>
    {a.nombre}
  </option>
))}
  </select>
</div>


          <div className="ca-field">
            <label>Notificación de acuerdo <span className="ca-req">*</span></label>
            <input
              type="text"
              value={tipoAcuerdo}
              onChange={e => setTipoAcuerdo(e.target.value)}
              placeholder="Ej: acuerdo de cierre"
            />
          </div>

          <div className="ca-field">
            <label>Fecha del Acuerdo <span className="ca-req">*</span></label>
            <input
              type="text"
              value={fechaAcuerdo}
              onChange={e => setFechaAcuerdo(e.target.value)}
              placeholder="Ej: 21 de febrero de 2026"
            />
          </div>

          <div className="ca-field">
            <label>Fundamento Legal</label>
            <textarea
              rows={4}
              value={fundamento}
              onChange={e => setFundamento(e.target.value)}
            />
          </div>

          <div className="ca-field">
            <label>Iniciales del Asesor <span className="ca-opcional">(opcional)</span></label>
            <input
              type="text"
              value={inicialesAsesor}
              onChange={e => setInicialesAsesor(e.target.value)}
              placeholder="Ej: MBMGR/cygl"
            />
          </div>

          <button
            className="ca-btn-guardar"
            onClick={handleGenerar}
            disabled={generando}
          >
            {generando ? 'Generando...' : '📄 Generar Oficio'}
          </button>
        </div>

        {/* ── Panel derecho: vista previa ── */}
        <div className="acci-preview-panel">
          <h3 className="acci-form-title">Vista previa del documento</h3>
          <div className="acci-doc-wrap">
            <div className="acci-doc" style={{
              position: 'relative',
              minHeight: '1050px',
              padding: '170px 60px 90px 60px',
              fontFamily: "'Montserrat', 'Arial', sans-serif",
              fontSize: '11pt',
              lineHeight: '1.6',
              color: '#000',
              backgroundColor: '#fff',
            }}>
              {/* Membrete */}
              <img
                src="/src/assets/membrete.jpg"
                alt="Membrete"
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: '160px',
                  objectFit: 'cover', objectPosition: 'top',
                  zIndex: 0, pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>

                {/* Encabezado oficio — alineado a la derecha */}
                <div style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
                  <span>Oficio: </span>
                  <span style={{ color: '#EE0000', fontWeight: 600 }}>
                    {numOficio || '[NÚMERO DE OFICIO]'}
                  </span>
                </div>
                <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                  <span>Asunto: </span>
                  <span style={{ color: '#000' }}>Notificación de acuerdo.</span>
                </div>

                {/* Fecha */}
                <p style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                  <span style={{ color: '#EE0000' }}>
                    Zacatecas, Zacatecas, {FECHA_HOY}.
                  </span>
                </p>

                {/* Destinatario */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ color: '#EE0000' }}>
                      {nombreAutoridad || '[AUTORIDAD DESTINATARIA]'}
                    </div>
        
                  <div style={{ fontWeight: 600, letterSpacing: '0.15em', marginTop: '0.5rem' }}>
                    P r e s e n t e
                  </div>
                </div>

                {/* Cuerpo */}
                <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
                  Por medio del presente se notifica el{' '}
                  <span style={{ color: '#EE0000' }}>
                    {tipoAcuerdo || '[TIPO DE ACUERDO]'}
                  </span>{' '}
                  dictado el día{' '}
                  <span style={{ color: '#92D050', fontWeight: 600 }}>
                    {fechaAcuerdo || '[FECHA ACUERDO]'}
                  </span>
                  , en el expediente{' '}
                  <span style={{ color: '#92D050', fontWeight: 600 }}>
                    {numExpediente}
                  </span>
                  , relativo a la queja presentada ante esta Comisión por el contribuyente{' '}
                  <span style={{ color: '#92D050', fontWeight: 600 }}>
                    {contribuyente}{' '}
                  </span>
                  por los actos y omisiones que se indican en el proveído de referencia,
                  emitidos por esa Dirección a su cargo; para tal efecto anexo copia del mismo.
                </p>

                <p style={{ marginBottom: '1rem', textAlign: 'justify', color: '#EE0000' }}>
                  {fundamento}
                </p>

                <p style={{ marginBottom: '2rem', textAlign: 'justify' }}>
                  Sin otro particular, agradezco la atención brindada al presente
                  y le reitero mi consideración.
                </p>

                <p style={{ color: '#EE0000', marginBottom: '2.5rem' }}>Atentamente</p>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#EE0000', fontWeight: 700, margin: 0 }}>
                    Lic. José David Rivera Sesma
                  </p>
                  <p style={{ color: '#EE0000', fontSize: '10pt', margin: 0 }}>
                    Encargado de la Comisión Estatal de la Defensa del Contribuyente
                  </p>
                </div>

                <div style={{ marginTop: '2.5rem', fontSize: '9.5pt' }}>
                  <div>C.c.p.&nbsp;&nbsp;&nbsp;Expediente.</div>
                  <div>Archivo.</div>
                </div>

                {inicialesAsesor && (
                  <p style={{ marginTop: '1.5rem', fontSize: '9pt', color: '#333' }}>
                    {inicialesAsesor}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};