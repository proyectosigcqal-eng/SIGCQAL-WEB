import { useState, useEffect, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const ANIOS_DISPONIBLES = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

const TIPOS_CONSTRUCCION = ['A', 'B', 'C', 'D'];

const Field = ({ label, required, children }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{
      display: 'block', fontSize: '0.72rem', fontWeight: 700,
      letterSpacing: '0.06em', color: '#64748b', marginBottom: '0.35rem',
      textTransform: 'uppercase',
    }}>
      {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.875rem',
  border: '1px solid #e2e8f0', borderRadius: 6, outline: 'none',
  background: 'var(--color-background-primary, #fff)',
  color: 'var(--color-text-primary, #0f172a)',
  boxSizing: 'border-box',
};

const cardStyle = {
  background: 'var(--color-background-primary, #fff)',
  border: '1px solid #e2e8f0', borderRadius: 10,
  padding: '1.5rem', marginBottom: '1.25rem',
};

export const FormularioDemandaAmparo = ({
  folio, expediente, demandaExistente, onSemaforoActualizado
}) => {
  const [municipios,     setMunicipios]     = useState([]);
  const [idDemanda,      setIdDemanda]      = useState(null);
  const [guardando,      setGuardando]      = useState(false);
  const [generando,      setGenerando]      = useState(false);
  const [cargandoPdf,    setCargandoPdf]    = useState(false);
  const [exito,          setExito]          = useState(null);
  const [errorForm,      setErrorForm]      = useState(null);

  // Campos del formulario
  const [autoridadMunicipio,      setAutoridadMunicipio]      = useState('');
  const [superficieTerreno,       setSuperficieTerreno]       = useState('');
  const [superficieConstruccion,  setSuperficieConstruccion]  = useState('');
  const [tipoConstruccion,        setTipoConstruccion]        = useState('');
  const [zonificacion,            setZonificacion]            = useState('');
  const [folioRecibo,             setFolioRecibo]             = useState('');
  const [montoPago,               setMontoPago]               = useState('');
  const [fechaPrimerPago,         setFechaPrimerPago]         = useState('');
  const [transcripcionLey,        setTranscripcionLey]        = useState('');
  const [folioRecibo2,        setFolioRecibo2]        = useState('');
  const [numRecibo1,          setNumRecibo1]          = useState('');
  const [numRecibo2,          setNumRecibo2]          = useState('');
  const [clavePredial,        setClavePredial]        = useState('');
  const [numCuenta,           setNumCuenta]           = useState('');
  const [domicilioAutoridad,  setDomicilioAutoridad]  = useState('');

  // Switch multas históricas
  const [incluyeMultas,       setIncluyeMultas]       = useState(false);
  const [aniosSeleccionados,  setAniosSeleccionados]  = useState([]);
  const [argumentacion,       setArgumentacion]       = useState('');

  // Archivos PDF
  const [demandaPdf,  setDemandaPdf]  = useState(null);
  const [acusePdf,    setAcusePdf]    = useState(null);
  const [urlDemanda,  setUrlDemanda]  = useState(null);
  const [urlAcuse,    setUrlAcuse]    = useState(null);
  const [urlGenerada, setUrlGenerada] = useState(null);

  // Precarga municipios
  useEffect(() => {
    fetch(`${API}/catalogos/municipios`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setMunicipios(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Precarga datos si ya existe la demanda
  useEffect(() => {
    if (!demandaExistente) return;
    const d = demandaExistente;
    setIdDemanda(d.idDemandaAmparo);
    setAutoridadMunicipio(d.autoridadReclamadaMunicipio ?? '');
    setSuperficieTerreno(d.superficieTerreno ?? '');
    setSuperficieConstruccion(d.superficieConstruccion ?? '');
    setTipoConstruccion(d.tipoConstruccion ?? '');
    setZonificacion(d.zonificacion ?? '');
    setFolioRecibo(d.folioReciboPago ?? '');
    setMontoPago(d.montoPago ?? '');
    setFechaPrimerPago(d.fechaPrimerPago ?? '');
    setIncluyeMultas(d.incluyeMultasHistoricas ?? false);
    setAniosSeleccionados(
      d.aniosMultasHistoricas
        ? d.aniosMultasHistoricas.split(',').map(Number)
        : []
    );
    setUrlGenerada(d.rutaPdfDemandaGenerada ?? null);
    setUrlDemanda(d.rutaPdfDemandaPresentada ?? null);
    setUrlAcuse(d.rutaPdfAcuseDemanda ?? null);
    setFolioRecibo2(d.folioReciboPago2 ?? '');
    setNumRecibo1(d.numRecibo1 ?? '');
    setNumRecibo2(d.numRecibo2 ?? '');
    setClavePredial(d.clavePredial ?? '');
    setNumCuenta(d.numCuenta ?? '');
    setDomicilioAutoridad(d.domicilioAutoridad ?? '');
  }, [demandaExistente]);

  // Toggle de año en el switch de multas
  const toggleAnio = (anio) => {
    setAniosSeleccionados(prev =>
      prev.includes(anio)
        ? prev.filter(a => a !== anio)
        : [...prev, anio].sort()
    );
  };

  // Payload para guardar / actualizar
  const buildPayload = useCallback(() => ({
    folioExpediente:                folio,
    idExpediente:                   expediente?.id_expediente ?? null,
    idRepresentacionLegal:          null,
    autoridadReclamadaMunicipio:    autoridadMunicipio || null,
    superficieTerreno:              superficieTerreno        ? parseFloat(superficieTerreno)        : null,
    superficieConstruccion:         superficieConstruccion   ? parseFloat(superficieConstruccion)   : null,
    tipoConstruccion:               tipoConstruccion         || null,
    zonificacion:                   zonificacion             || null,
    folioReciboPago:                folioRecibo              || null,
    montoPago:                      montoPago                ? parseFloat(montoPago)                : null,
    fechaPrimerPago:                fechaPrimerPago          || null,
    incluyeMultasHistoricas:        incluyeMultas,
    aniosMultasHistoricas:          incluyeMultas && aniosSeleccionados.length > 0
                                      ? aniosSeleccionados.join(',') : null,
    argumentacionFaltaNotificacion: incluyeMultas ? argumentacion : null,
    transcripcionLeyIngresos:       transcripcionLey         || null,
     folioReciboPago2:               folioRecibo2             || null,
    numRecibo1:                     numRecibo1               || null,
    numRecibo2:                     numRecibo2               || null,
    clavePredial:                   clavePredial             || null,
    numCuenta:                      numCuenta                || null,
    domicilioAutoridad:             domicilioAutoridad       || null,
  }), [
    folio, expediente, autoridadMunicipio, superficieTerreno,
    superficieConstruccion, tipoConstruccion, zonificacion,
    folioRecibo, montoPago, fechaPrimerPago,
    incluyeMultas, aniosSeleccionados, argumentacion, transcripcionLey,
    folioRecibo2, numRecibo1, numRecibo2, clavePredial,
    numCuenta, domicilioAutoridad,
  ]);

  // Guardar o actualizar
  const handleGuardar = async () => {
    setGuardando(true);
    setErrorForm(null);
    setExito(null);
    try {
      const url    = idDemanda
        ? `${API}/api/v1/irl-demanda-amparo/${idDemanda}`
        : `${API}/api/v1/irl-demanda-amparo`;
      const method = idDemanda ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setIdDemanda(data.idDemandaAmparo);
      setExito('Datos guardados correctamente.');
    } catch (e) {
      setErrorForm('Error al guardar: ' + e.message);
    } finally {
      setGuardando(false);
    }
  };

  // Generar DOCX
  const handleGenerarDocx = async () => {
    if (!idDemanda) {
      setErrorForm('Guarda los datos antes de generar el documento.');
      return;
    }
    setGenerando(true);
    setErrorForm(null);
    try {
      const res = await fetch(
        `${API}/api/v1/irl-demanda-amparo/${idDemanda}/generar-demanda`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setUrlGenerada(data.rutaPdfDemandaGenerada);
      setExito('Documento generado correctamente.');

      // Actualiza el semáforo si ya hay fecha de pago
      if (fechaPrimerPago && onSemaforoActualizado) {
        fetch(`${API}/api/v1/irl-demanda-amparo/${idDemanda}/semaforo-judicial`)
          .then(r => r.ok ? r.json() : null)
          .then(sem => sem && onSemaforoActualizado(sem))
          .catch(() => {});
      }
    } catch (e) {
      setErrorForm('Error al generar: ' + e.message);
    } finally {
      setGenerando(false);
    }
  };

  // Cargar PDFs
  const handleCargarPdf = async () => {
    if (!idDemanda) {
      setErrorForm('Guarda los datos antes de cargar los PDFs.');
      return;
    }
    if (!demandaPdf) {
      setErrorForm('Selecciona el PDF de la demanda presentada.');
      return;
    }
    setCargandoPdf(true);
    setErrorForm(null);
    try {
      const form = new FormData();
      form.append('demanda', demandaPdf);
      if (acusePdf) form.append('acuse', acusePdf);

      const res = await fetch(
        `${API}/api/v1/irl-demanda-amparo/${idDemanda}/cargar-demanda`,
        { method: 'POST', body: form }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setUrlDemanda(data.rutaPdfDemandaPresentada);
      setUrlAcuse(data.rutaPdfAcuseDemanda);
      setExito('PDFs cargados correctamente.');
    } catch (e) {
      setErrorForm('Error al cargar PDFs: ' + e.message);
    } finally {
      setCargandoPdf(false);
    }
  };

  // Descarga del DOCX generado
  const handleDescargarDocx = async () => {
    const urlCompleta = `${API}${urlGenerada}`;
    try {
      const res = await fetch(urlCompleta);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = href;
      a.download = urlGenerada.split('/').pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 60_000);
    } catch (e) {
      console.error('Error al descargar:', e);
      window.open(urlCompleta, '_blank');
    }
  };

  return (
    <div>

      {/* ── Alertas ── */}
      {exito && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6,
          padding: '0.75rem 1rem', marginBottom: '1rem', color: '#166534', fontSize: '0.85rem',
        }}>
          ✓ {exito}
        </div>
      )}
      {errorForm && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6,
          padding: '0.75rem 1rem', marginBottom: '1rem', color: '#991b1b', fontSize: '0.85rem',
        }}>
          ✗ {errorForm}
        </div>
      )}

      {/* ── Autoridad reclamada ── */}
      <div style={cardStyle}>
        <h3 style={{
          fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginTop: 0, marginBottom: '1.25rem',
        }}>
          Autoridad Reclamada
        </h3>
        <Field label="Municipio (Autoridad Reclamada)" required>
          <select
            value={autoridadMunicipio}
            onChange={e => setAutoridadMunicipio(e.target.value)}
            style={inputStyle}
          >
            <option value="">— Selecciona municipio —</option>
            {municipios.map(m => (
              <option key={m.idMunicipio ?? m.id} value={m.nombreMunicipio ?? m.nombre}>
                {m.nombreMunicipio ?? m.nombre}
              </option>
            ))}
          </select>
        </Field>
         <Field label="Domicilio de la Autoridad (municipio)">
          <input type="text" style={inputStyle} value={domicilioAutoridad}
            onChange={e => setDomicilioAutoridad(e.target.value)}
            placeholder="Ej: Avenida Principal No. 1, Centro, C.P. 99999, Fresnillo, Zacatecas." />
        </Field>
      </div>

      {/* ── Datos del Predio ── */}
      <div style={cardStyle}>
        <h3 style={{
          fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginTop: 0, marginBottom: '1.25rem',
        }}>
          Datos del Predio
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
          <Field label="Superficie Terreno (m²)">
            <input
              type="number" min="0" step="0.01" style={inputStyle}
              value={superficieTerreno}
              onChange={e => setSuperficieTerreno(e.target.value)}
              placeholder="Ej: 120.50"
            />
          </Field>
          <Field label="Superficie Construcción (m²)">
            <input
              type="number" min="0" step="0.01" style={inputStyle}
              value={superficieConstruccion}
              onChange={e => setSuperficieConstruccion(e.target.value)}
              placeholder="Ej: 80.00"
            />
          </Field>
          <Field label="Tipo de Construcción">
            <select
              style={inputStyle}
              value={tipoConstruccion}
              onChange={e => setTipoConstruccion(e.target.value)}
            >
              <option value="">— Selecciona —</option>
              {TIPOS_CONSTRUCCION.map(t => (
                <option key={t} value={t}>Tipo {t}</option>
              ))}
            </select>
          </Field>
          <Field label="Zonificación">
            <input
              type="text" style={inputStyle}
              value={zonificacion}
              onChange={e => setZonificacion(e.target.value)}
              placeholder="Ej: Zona III"
            />
          </Field>
        </div>
      </div>

      {/* ── Actos de Aplicación ── */}
      <div style={cardStyle}>
        <h3 style={{
          fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginTop: 0, marginBottom: '1.25rem',
        }}>
          Actos de Aplicación (Primer Pago)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1rem' }}>
          <Field label="Folio del Recibo" required>
            <input
              type="text" style={inputStyle}
              value={folioRecibo}
              onChange={e => setFolioRecibo(e.target.value)}
              placeholder="Ej: REC-2024-00123"
            />
          </Field>
          <Field label="Monto Pagado ($)" required>
            <input
              type="number" min="0" step="0.01" style={inputStyle}
              value={montoPago}
              onChange={e => setMontoPago(e.target.value)}
              placeholder="Ej: 4500.00"
            />
          </Field>
          <Field label="Fecha del Primer Pago" required>
            <input
              type="date" style={inputStyle}
              value={fechaPrimerPago}
              onChange={e => setFechaPrimerPago(e.target.value)}
            />
          </Field>
        </div>
        {fechaPrimerPago && (
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.25rem 0 0' }}>
            ⚠ El semáforo judicial de 15 días hábiles iniciará el día siguiente a esta fecha.
          </p>
        )}
      </div>

 {/* ── Datos del Recibo ── */}
      <div style={cardStyle}>
        <h3 style={{
          fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginTop: 0, marginBottom: '1.25rem',
        }}>
          Datos del Recibo
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
          <Field label="No. Folio Recibo 1" required>
            <input type="text" style={inputStyle} value={folioRecibo}
              onChange={e => setFolioRecibo(e.target.value)} placeholder="Ej: 1144732025" />
          </Field>
          <Field label="No. Folio Recibo 2">
            <input type="text" style={inputStyle} value={folioRecibo2}
              onChange={e => setFolioRecibo2(e.target.value)} placeholder="Ej: 1144742025" />
          </Field>
          <Field label="Número de Recibo 1">
            <input type="text" style={inputStyle} value={numRecibo1}
              onChange={e => setNumRecibo1(e.target.value)} placeholder="Ej: 717212" />
          </Field>
          <Field label="Número de Recibo 2">
            <input type="text" style={inputStyle} value={numRecibo2}
              onChange={e => setNumRecibo2(e.target.value)} placeholder="Ej: 717213" />
          </Field>
          <Field label="Clave Predial" required>
            <input type="text" style={inputStyle} value={clavePredial}
              onChange={e => setClavePredial(e.target.value)} placeholder="Ej: 0011564301900" />
          </Field>
          <Field label="Número de Cuenta">
            <input type="text" style={inputStyle} value={numCuenta}
              onChange={e => setNumCuenta(e.target.value)} placeholder="Ej: 00821CH" />
          </Field>
        </div>
      </div>

      {/* ── Switch multas históricas ── */}
      <div style={cardStyle}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: incluyeMultas ? '1.25rem' : 0,
        }}>
          <h3 style={{
            fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a',
            letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0,
          }}>
            Multas de Ejercicios Anteriores (2016-2023)
          </h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
            <div style={{
              position: 'relative', width: 44, height: 24,
              background: incluyeMultas ? '#1e3a8a' : '#cbd5e1',
              borderRadius: 12, transition: 'background 0.2s',
            }}>
              <div style={{
                position: 'absolute', top: 3, left: incluyeMultas ? 23 : 3,
                width: 18, height: 18, background: '#fff', borderRadius: '50%',
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
              <input
                type="checkbox"
                checked={incluyeMultas}
                onChange={e => {
                  setIncluyeMultas(e.target.checked);
                  if (!e.target.checked) {
                    setAniosSeleccionados([]);
                    setArgumentacion('');
                  }
                }}
                style={{
                  position: 'absolute', opacity: 0, width: '100%',
                  height: '100%', cursor: 'pointer', margin: 0,
                }}
              />
            </div>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              {incluyeMultas ? 'Incluye multas históricas' : 'Sin multas históricas'}
            </span>
          </label>
        </div>

        {incluyeMultas && (
          <div>
            <Field label="Años con multas sin notificar" required>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ANIOS_DISPONIBLES.map(anio => (
                  <button
                    key={anio}
                    type="button"
                    onClick={() => toggleAnio(anio)}
                    style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: '0.82rem',
                      fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                      borderColor: aniosSeleccionados.includes(anio) ? '#1e3a8a' : '#e2e8f0',
                      background:  aniosSeleccionados.includes(anio) ? '#1e3a8a' : 'transparent',
                      color:       aniosSeleccionados.includes(anio) ? '#fff'    : '#64748b',
                      transition:  'all 0.15s',
                    }}
                  >
                    {anio}
                  </button>
                ))}
              </div>
              {aniosSeleccionados.length > 0 && (
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 6 }}>
                  Seleccionados: {aniosSeleccionados.join(', ')}
                </p>
              )}
            </Field>

            <Field label="Argumentación por falta de notificación" required>
              <textarea
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
                value={argumentacion}
                onChange={e => setArgumentacion(e.target.value)}
                placeholder="Describe los argumentos por falta de notificación para los años seleccionados..."
              />
            </Field>
          </div>
        )}
      </div>

      {/* ── Transcripción de Ley (Rich Text) ── */}
      <div style={cardStyle}>
        <h3 style={{
          fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginTop: 0, marginBottom: '1.25rem',
        }}>
          Transcripción de Ley de Ingresos
        </h3>
        <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 0, marginBottom: '0.75rem' }}>
          Transcribe el artículo con las tarifas/tasas aplicables al caso.
          Puedes usar <strong>**negritas**</strong> y listas con guión.
        </p>
        <MDEditor
          value={transcripcionLey}
          onChange={val => setTranscripcionLey(val ?? '')}
          height={250}
          preview="live"
          data-color-mode="light"
        />
      </div>

      {/* ── Acciones: guardar y generar ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleGuardar}
          disabled={guardando}
          style={{
            padding: '10px 24px', background: '#1e3a8a', color: '#fff',
            border: 'none', borderRadius: 7, fontWeight: 700, fontSize: '0.82rem',
            cursor: guardando ? 'not-allowed' : 'pointer',
            opacity: guardando ? 0.7 : 1,
            letterSpacing: '0.05em',
          }}
        >
          {guardando ? 'GUARDANDO...' : '💾 GUARDAR DATOS'}
        </button>

        <button
          onClick={handleGenerarDocx}
          disabled={generando || !idDemanda}
          style={{
            padding: '10px 24px', background: '#166534', color: '#fff',
            border: 'none', borderRadius: 7, fontWeight: 700, fontSize: '0.82rem',
            cursor: (generando || !idDemanda) ? 'not-allowed' : 'pointer',
            opacity: (generando || !idDemanda) ? 0.6 : 1,
            letterSpacing: '0.05em',
          }}
        >
          {generando ? 'GENERANDO...' : '📄 GENERAR DEMANDA (.DOCX)'}
        </button>

        {urlGenerada && (
          <button
            onClick={handleDescargarDocx}
            style={{
              padding: '10px 20px', background: '#0c4a6e', color: '#fff',
              borderRadius: 7, fontWeight: 700, fontSize: '0.82rem',
              border: 'none', cursor: 'pointer', letterSpacing: '0.05em',
            }}
          >
            ⬇ DESCARGAR DOCX
          </button>
        )}
      </div>

      {/* ── Carga de PDFs ── */}
      <div style={cardStyle}>
        <h3 style={{
          fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginTop: 0, marginBottom: '1.25rem',
        }}>
          Carga de Demanda Presentada
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
          <Field label="PDF — Demanda Presentada ante Juzgado" required>
            <input
              type="file"
              accept=".pdf"
              onChange={e => setDemandaPdf(e.target.files[0] ?? null)}
              style={{ ...inputStyle, padding: '0.4rem' }}
            />
            {urlDemanda && (
              <a
                href={urlDemanda} target="_blank" rel="noreferrer"
                style={{ fontSize: '0.75rem', color: '#1e3a8a', marginTop: 4, display: 'block' }}
              >
                ✓ Ver demanda cargada
              </a>
            )}
          </Field>

          <Field label="PDF — Acuse de Recibo del Juzgado">
            <input
              type="file"
              accept=".pdf"
              onChange={e => setAcusePdf(e.target.files[0] ?? null)}
              style={{ ...inputStyle, padding: '0.4rem' }}
            />
            {urlAcuse && (
              <a
                href={urlAcuse} target="_blank" rel="noreferrer"
                style={{ fontSize: '0.75rem', color: '#1e3a8a', marginTop: 4, display: 'block' }}
              >
                ✓ Ver acuse cargado
              </a>
            )}
          </Field>
        </div>

        <button
          onClick={handleCargarPdf}
          disabled={cargandoPdf || !idDemanda}
          style={{
            padding: '10px 24px', background: '#7c3aed', color: '#fff',
            border: 'none', borderRadius: 7, fontWeight: 700, fontSize: '0.82rem',
            cursor: (cargandoPdf || !idDemanda) ? 'not-allowed' : 'pointer',
            opacity: (cargandoPdf || !idDemanda) ? 0.6 : 1,
            letterSpacing: '0.05em', marginTop: '0.5rem',
          }}
        >
          {cargandoPdf ? 'CARGANDO...' : '📎 CARGAR PDFs'}
        </button>
      </div>

    </div>
  );
};
