import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const FECHA_HOY = new Date().toLocaleDateString('es-MX', {
  day: '2-digit', 
  month: 'long', 
  year: 'numeric'
});

export const EditorACCI = ({ expediente, contestacion, folioExpediente }) => {
  const [titularRequerido, setTitularRequerido] = useState('');
  const [documentosAnexos, setDocumentosAnexos] = useState('');
  const [motivosRequerimiento, setMotivosRequerimiento] = useState('');
  const [inicialesAsesor, setInicialesAsesor] = useState('');
  const [generando, setGenerando] = useState(false);
  const [urlDocx, setUrlDocx] = useState(null);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  const [idQueja, setIdQueja] = useState(null);

  const numOficio = contestacion?.numOficio || '[NÚMERO DE OFICIO]';
  const dependencia = contestacion?.dependencia || '[DEPENDENCIA]';
  const encargado = contestacion?.encargado || '[ENCARGADO]';
  
  const folioExp = expediente?.folioGobierno ?? expediente?.folio ?? folioExpediente ?? '[FOLIO]';
  const numExpediente = expediente?.numExpediente ?? expediente?.expediente ?? folioExp;
  const contribuyente = expediente?.nombreContribuyente ?? expediente?.contribuyente ?? '[CONTRIBUYENTE]';

  useEffect(() => {
  if (!folioExp || folioExp === '[FOLIO]') return;
  fetch(`${API}/api/v1/quejas-ari/contexto/${folioExp}`)
    .then(r => r.ok ? r.json() : null)
    .then(ctx => setIdQueja(ctx?.idQueja ?? null))
    .catch(() => {});
}, [folioExp]);

 const handleGenerarACCI = async () => {
  if (!titularRequerido || !motivosRequerimiento) {
    setError('El titular requerido y los motivos del requerimiento son obligatorios.');
    return;
  }
  setGenerando(true);
  setError(null);
  setExito(false);

  try {
    const payload = {
      folioExpediente: folioExp,
      contribuyente: contribuyente,
      dependencia: dependencia,
      numOficioRecibido: numOficio,
      fechaOficio: FECHA_HOY,
      fechaRecepcion: FECHA_HOY,
      encargadoDependencia: encargado,
      fechaProveido: FECHA_HOY,
      documentosAnexos: documentosAnexos || '',
      titularRequerido: titularRequerido,
      motivosRequerimiento: motivosRequerimiento,
      inicialesAsesor: inicialesAsesor || '',
      // idQueja e idOficioAutoridad: NO se mandan — el backend los resuelve solo
    };

    const res = await fetch(`${API}/api/v1/quejas-acci`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Error ${res.status}`);

    const data = await res.json();
    setUrlDocx(data.rutaPdfAcci ?? data.url ?? null);
    setExito(true);
  } catch (e) {
    setError('Error al generar el ACCI: ' + e.message);
  } finally {
    setGenerando(false);
  }
};

  return (
    <section className="ca-card">
      <h2 className="ca-card-title">📋 Generador de ACCI</h2>

      {error && <div className="ca-alert-error">{error}</div>}
      
      {exito && (
        <div className="ca-alert-exito">
          ✓ ACCI generado correctamente.{' '}
          {urlDocx && (
            <a 
              href={`${API}${urlDocx}`}
              target="_blank"
              rel="noreferrer"
              className="ca-btn-descargar"
            >
              Descargar DOCX
            </a>
          )}
        </div>
      )}

      <div className="acci-layout">
        {/* ── Panel izquierdo: campos del asesor ── */}
        <div className="acci-form-panel">
          <h3 className="acci-form-title">Campos a completar</h3>

          <div className="acci-info-readonly">
            <div className="acci-readonly-item">
              <span className="acci-readonly-label">📅 Fecha</span>
              <span className="acci-readonly-value">{FECHA_HOY}</span>
            </div>
            <div className="acci-readonly-item">
              <span className="acci-readonly-label">📋 Folio / Exp</span>
              <span className="acci-readonly-value">{numExpediente}</span>
            </div>
            <div className="acci-readonly-item">
              <span className="acci-readonly-label">👤 Contribuyente</span>
              <span className="acci-readonly-value">{contribuyente}</span>
            </div>
            <div className="acci-readonly-item">
              <span className="acci-readonly-label">📨 Oficio recibido</span>
              <span className="acci-readonly-value">{numOficio}</span>
            </div>
            <div className="acci-readonly-item">
              <span className="acci-readonly-label">🏢 Dependencia</span>
              <span className="acci-readonly-value">{dependencia}</span>
            </div>
          </div>

          <div className="ca-field" style={{ marginTop: '1rem' }}>
            <label>
              Titular al que se requiere <span className="ca-req">*</span>
            </label>
            <input
              type="text"
              value={titularRequerido}
              onChange={e => setTitularRequerido(e.target.value)}
              placeholder="Ej: Titular de la Subdirección de Ingresos de la Secretaría de Finanzas"
            />
          </div>

          <div className="ca-field">
            <label>Documentos anexados en la contestación</label>
            <textarea
              rows={4}
              value={documentosAnexos}
              onChange={e => setDocumentosAnexos(e.target.value)}
              placeholder="Describe los documentos, créditos fiscales o multas anexadas..."
            />
          </div>

          <div className="ca-field">
            <label>
              Motivos y fundamentos del requerimiento <span className="ca-req">*</span>
            </label>
            <textarea
              rows={6}
              value={motivosRequerimiento}
              onChange={e => setMotivosRequerimiento(e.target.value)}
              placeholder="Especifique detalladamente las preguntas o aclaraciones requeridas..."
            />
          </div>

          <div className="ca-field">
            <label>Iniciales del asesor <span className="ca-opcional">(opcional)</span></label>
            <input
              type="text"
              value={inicialesAsesor}
              onChange={e => setInicialesAsesor(e.target.value)}
              placeholder="Ej: *JDRS*/cioe"
            />
          </div>

          <button
            className="ca-btn-guardar"
            onClick={handleGenerarACCI}
            disabled={generando}
          >
            {generando ? 'Generando ACCI...' : '📄 Generar ACCI'}
          </button>
        </div>

        {/* ── Panel derecho: vista previa del documento ── */}
        <div className="acci-preview-panel">
          <h3 className="acci-form-title">Vista previa del documento</h3>
          
          <div className="acci-doc-wrap">
           <div className="acci-doc" style={{ 
  position: 'relative', 
  minHeight: '1050px',
  padding: '170px 60px 90px 60px', // ← deja espacio para el header
  fontFamily: "'Montserrat', 'Arial', sans-serif",
  fontSize: '11pt',
  lineHeight: '1.5',
  color: '#000',
  backgroundColor: '#fff',
}}>

              {/* Imagen del membrete como FONDO absoluto */}
            <img
  src="/src/assets/membrete.jpg"
  alt="Membrete"
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '160px',      // ← solo el header, no toda la página
    objectFit: 'cover',
    objectPosition: 'top',
    zIndex: 0,
    pointerEvents: 'none',
  }}
/>

              {/* Contenido con z-index alto sobre el membrete */}
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'justify' }}>
                
                {/* ── Encabezado tipo tabla del ACCI — Alineado a la derecha como el original ── */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '1.5rem',
                }}>
                  <div style={{
                    border: '1px solid #000',
                    padding: '10px',
                    width: '60%', 
                    fontSize: '9.5pt',
                    lineHeight: '1.4',
                    fontFamily: 'inherit',
                  }}>
                    <div><strong>Quejas o Reclamaciones</strong></div>
                    <div style={{ textDecoration: 'underline', fontWeight: 'bold', marginBottom: '4px' }}>
                      Acuerdo de Acciones de Investigación.
                    </div>
                    <div><strong>Folio:</strong> {folioExp}</div>
                    <div><strong>Expediente:</strong> {numExpediente}</div>
                    <div><strong>Contribuyente:</strong> {contribuyente}</div>
                    <div><strong>Autoridad Fiscal:</strong> {dependencia}</div>
                  </div>
                </div>

                <p style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                  Zacatecas, Zacatecas, {FECHA_HOY}.
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  Se da cuenta al licenciado <strong>José David Rivera Sesma</strong>, en su calidad de Encargado de la Comisión Estatal de la Defensa del Contribuyente, con lo siguiente:
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  Oficio <span style={{ textDecoration: 'underline' }}>{numOficio}</span> de fecha <span style={{ textDecoration: 'underline' }}>{FECHA_HOY}</span>, presentado ante la Comisión Estatal de la Defensa del Contribuyente el <span style={{ textDecoration: 'underline' }}>{FECHA_HOY}</span>, según consta en el sello de recibido de la oficialía de partes, signado por <span style={{ textDecoration: 'underline' }}>{encargado}</span> de <span style={{ textDecoration: 'underline' }}>{dependencia}</span>, al que anexó copia simple de la documentación que a continuación se indica:
                </p>

                <p style={{ paddingLeft: '20px', fontStyle: 'italic', color: '#555', marginBottom: '1rem' }}>
                  {documentosAnexos || '[Describa aquí la documentación o créditos anexados por la autoridad]'}
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  Documentos mediante los cuales rinde su informe, con lo que pretende dar cumplimiento al requerimiento efectuado por esta Comisión, por proveído de {FECHA_HOY}, en el expediente indicado al rubro.
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  En consecuencia, con fundamento en los artículos 1, 22, 24, segundo párrafo; 25, fracciones III, IX y XVI; 27, fracción II; 37, 42, fracción II; 44, fracción I, de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios; 6, fracción IV; 23, fracción XIII; 26, fracción X; 27, fracción II y 36 del Estatuto Orgánico; 11, 27, 56 y 68 de los Lineamientos Generales de Actuación, ambos ordenamientos de la Comisión Estatal de la Defensa del Contribuyente, <strong>SE ACUERDA:</strong>
                </p>

                <p style={{ marginBottom: '0.8rem' }}>
                  <strong>I. Recepción.</strong> Se tiene por recibido y rendido el informe de cuenta, por lo que se ordena agregar a los autos del expediente en que se actúa, para los efectos legales a que haya lugar.
                </p>

                <p style={{ marginBottom: '0.8rem' }}>
                  <strong>II. Cumplimiento.</strong> Se tiene por cumplido en tiempo y forma el requerimiento efectuado por esta Comisión a {dependencia}, por medio del oficio signado por {encargado}, número {numOficio}, recibido el día {FECHA_HOY}, según consta en el sello de la oficialía de partes, por lo que se deja sin efectos el apercibimiento que se le formuló en el propio acuerdo.
                </p>

                <p style={{ marginBottom: '0.8rem' }}>
                  <strong>III. Requerimiento.</strong> En tal virtud, se ordena realizar <strong>ACCIONES DE INVESTIGACIÓN</strong>, a afecto de que esta Comisión cuente con elementos que permitan brindar una solución oportuna a la pretensión planteada en el asunto que nos ocupa, con fundamento en el artículo 38 y 41 de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios, se <strong>REQUIERE</strong> al <strong>{titularRequerido || '[TITULAR A REQUERIR]'}</strong>, para que:
                </p>

                <p style={{ marginBottom: '0.5rem', paddingLeft: '20px' }}>
                  Rinda su <strong>INFORME</strong>, con respecto de lo siguiente:
                </p>

                <p style={{ paddingLeft: '4px', fontStyle: 'italic', color: '#4a148c', marginBottom: '0.8rem', whiteSpace: 'pre-wrap' }}>
                  {motivosRequerimiento || '[El asesor especificará aquí los motivos y directrices del requerimiento]'}
                </p>

                <p style={{ marginBottom: '0.8rem' }}>
                  Al anterior requerimiento se deberá dar cumplimiento dentro del plazo de <strong>CINCO DÍAS HÁBILES</strong> siguientes a su notificación; en la inteligencia de que, en términos del artículo 19 de los Lineamientos Generales de Actuación de la Comisión Estatal de la Defensa del Contribuyente, las notificaciones surtirán efectos el día que se practiquen.
                </p>

                <p style={{ marginBottom: '0.8rem' }}>
                  <strong>IV. Apercibimiento.</strong> Se apercibe al <strong>{titularRequerido || '[TITULAR]'}</strong> que, en caso de incumplimiento, se hará acreedor a la sanción prevista en los artículos 50, fracción I, inciso a) de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios.
                </p>

                <p style={{ marginBottom: '1.5rem' }}>
                  <strong>V. Justificación.</strong> No se omite mencionar que de conformidad con lo dispuesto en el artículo 24, segundo párrafo, de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios, los requerimientos que se efectúan son de carácter obligatorio y buscan obtener información útil, completa y oportuna que sirva para el debido esclarecimiento de los hechos que se investigan, determinando en su momento si existen o no violación a los derechos fundamentales del quejoso.
                </p>

                <p style={{ marginBottom: '1.5rem' }}><strong>NOTIFÍQUESE</strong> como corresponda.</p>

                <p style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                  Así lo acordó y firma el Encargado de la Comisión Estatal de la Defensa del Contribuyente. - <strong>Conste.</strong>
                </p>

                <div className="acci-firma" style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0 }}><strong>Lic. José David Rivera Sesma</strong></p>
                  <p style={{ margin: 0, fontSize: '10pt' }}>Encargado de la Comisión Estatal de la Defensa del Contribuyente</p>
                </div>

                {inicialesAsesor && (
                  <p style={{ textAlign: 'left', marginTop: '2rem', fontSize: '9pt', color: '#333' }}>
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