import { useState, useEffect } from 'react';
import {
  crearResolucionFinal,
  buscarResolucionPorExpediente,
  generarOficioResolucionFinal,
} from '../services/ResolucionFinalService';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const FECHA_HOY = new Date().toLocaleDateString('es-MX', {
  day: '2-digit', month: 'long', year: 'numeric'
});

/**
 * Props nuevas respecto a la versión original, necesarias porque no existe
 * un endpoint único que agregue todos los IDs relacionados — cada uno se
 * resuelve en la pantalla que precede a esta:
 *
 * idExpediente               (obligatorio, identifica la resolución)
 * idAri                      (obligatorio, viene de la pantalla de ARI)
 * idQuejaRespuestaAutoridad  (obligatorio, viene de la pantalla de respuesta de autoridad)
 * idEstatusQueja             (obligatorio, viene del catálogo/estado de la queja)
 * idEstatusExpediente        (obligatorio, viene del estado actual del expediente)
 */
export const EditorResolucionFinal = ({
  expediente,
  folioExpediente,
  idExpediente,
  idAri,
  idQuejaRespuestaAutoridad,
  idEstatusQueja,
  idEstatusExpediente,
  fechaSolicitudPrevia,
  numeroOficioPrevio,
  fechaOficioPrevia,
}) => {
  // ── Campo nuevo: fecha del acto jurídico (va a la tabla, no solo al docx) ──
  const [fechaEmisionResolucion, setFechaEmisionResolucion] = useState('');

  // ── Campos del Acuerdo de Cierre (van solo al .docx) ───────────────────
  const [folio, setFolio] = useState('');
  const [expedienteNum, setExpedienteNum] = useState('');
  const [autoridadFiscal, setAutoridadFiscal] = useState('');
  const [fechaDocumento, setFechaDocumento] = useState(FECHA_HOY);
  const [fechaSolicitud, setFechaSolicitud] = useState('');
  const [nombreContribuyente, setNombreContribuyente] = useState('');
  const [motivoQueja, setMotivoQueja] = useState('');
  const [oficioNumero, setOficioNumero] = useState('');
  const [fechaOficio, setFechaOficio] = useState('');
  const [fechaIngresoOficio, setFechaIngresoOficio] = useState('');
  const [numeroCreditoMulta, setNumeroCreditoMulta] = useState('');
  const [contactoVia, setContactoVia] = useState('');
  const [iniciales, setIniciales] = useState('');

  // ── Estados para la UI ────────────────────────────────────────────────
  const [idResolucionFinal, setIdResolucionFinal] = useState(null);
  const [buscandoExistente, setBuscandoExistente] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [urlDocx, setUrlDocx] = useState(null);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  // ── Campos del expediente (vienen del sistema) ─────────────────────────
  const expedienteFromProps = expediente?.folio
                     ?? expediente?.folioGobierno
                     ?? folioExpediente
                     ?? '';
  const contribuyenteFromProps = expediente?.contribuyente
                     ?? expediente?.nombreContribuyente
                     ?? '';

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '';
    const [year, month, day] = fechaISO.split('-');
    const meses = ['enero','febrero','marzo','abril','mayo','junio',
                   'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
  };

  useEffect(() => {
    if (expedienteFromProps) setExpedienteNum(expedienteFromProps);
    if (contribuyenteFromProps) setNombreContribuyente(contribuyenteFromProps);
    if (fechaSolicitudPrevia) setFechaSolicitud(formatearFecha(fechaSolicitudPrevia));
    if (numeroOficioPrevio) setOficioNumero(numeroOficioPrevio);
    if (fechaOficioPrevia) setFechaOficio(formatearFecha(fechaOficioPrevia));
  }, [expedienteFromProps, contribuyenteFromProps, fechaSolicitudPrevia, numeroOficioPrevio, fechaOficioPrevia]);
  // ── Buscar si ya existe una resolución para este expediente ────────────
  useEffect(() => {
    if (!idExpediente) { setBuscandoExistente(false); return; }

    buscarResolucionPorExpediente(idExpediente)
      .then((existente) => {
        if (existente) {
          setIdResolucionFinal(existente.idResolucionFinal);
          if (existente.rutaResolucionFinal) {
            setUrlDocx(existente.rutaResolucionFinal);
          }
        }
      })
      .catch(() => {})
      .finally(() => setBuscandoExistente(false));
  }, [idExpediente]);

  // ── Generar Acuerdo de Cierre ─────────────────────────────────────────
  const handleGenerar = async () => {
    if (!folio || !expedienteNum || !autoridadFiscal || !fechaDocumento || !fechaSolicitud
        || !nombreContribuyente || !motivoQueja || !oficioNumero || !fechaOficio
        || !fechaIngresoOficio || !numeroCreditoMulta || !contactoVia) {
      setError('Faltan campos obligatorios.');
      return;
    }

    if (!fechaEmisionResolucion) {
      setError('La fecha de emisión de la resolución es obligatoria.');
      return;
    }

    setGenerando(true);
    setError(null);
    setExito(false);

    try {
      let idActual = idResolucionFinal;

      // Paso 1: si aún no existe, se crea el registro en resolucion_final.
      if (!idActual) {
  if (!idExpediente) {
    throw new Error('No se encontró el id del expediente.');
  }

  const creado = await crearResolucionFinal({
    fechaEmisionResolucion,
    conceptoCobro:            motivoQueja       || null,
    contactoVia:              contactoVia       || null,
    numeroCredito:            null,
    folioCredito:             numeroCreditoMulta || null,
    idExpediente,
    // ← Manda null explícito si no vienen — el backend ya los acepta
    idAri:                    idAri                       ?? null,
    idQuejaRespuestaAutoridad: idQuejaRespuestaAutoridad  ?? null,
    idEstatusQueja:           idEstatusQueja              ?? null,
    idEstatusExpediente:      idEstatusExpediente         ?? null,
  });

  idActual = creado.idResolucionFinal;
  setIdResolucionFinal(idActual);
}

      // Paso 2: generar el oficio .docx con los datos del formulario.
      const actualizado = await generarOficioResolucionFinal(idActual, {
        folio,
        expedienteNum,
        autoridadFiscal,
        fechaSolicitud,
        nombreContribuyente,
        motivoQueja,
        oficioNumero,
        fechaOficio,
        fechaIngresoOficio,
        numeroCreditoMulta,
        contactoVia,
        iniciales,
      });

      setUrlDocx(actualizado.rutaResolucionFinal);
      setExito(true);
    } catch (e) {
      setError('Error al generar el documento: ' + e.message);
    } finally {
      setGenerando(false);
    }
  };

  if (buscandoExistente) {
    return (
      <section className="ca-card">
        <p>Verificando si ya existe una resolución para este expediente...</p>
      </section>
    );
  }

  return (
    <section className="ca-card">
      <h2 className="ca-card-title">📄 Acuerdo de Cierre</h2>

      {error && <div className="ca-alert-error">{error}</div>}
     {exito && (
  <div className="ca-alert-exito">
    ✓ Acuerdo de cierre generado correctamente.{' '}
    {urlDocx && (
      <button
        className="ca-btn-descargar"
        onClick={async () => {
          // urlDocx = "/api/files/expedientes/ACUERDO_CIERRE_4_xxx.docx"
          const urlCompleta = `${API}${urlDocx}`;
          try {
            const res = await fetch(urlCompleta);
            if (!res.ok) throw new Error(`Error ${res.status}`);

            const blob     = await res.blob();
            const href     = URL.createObjectURL(blob);
            const a        = document.createElement('a');
            a.href         = href;
            a.download     = urlDocx.split('/').pop();
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(href), 60_000);
          } catch (e) {
            console.error('Error al descargar:', e);
            window.open(urlCompleta, '_blank');
          }
        }}
      >
        Descargar DOCX
      </button>
    )}
  </div>
)}

      <div className="acci-layout">

        {/* ── Panel izquierdo: formulario ── */}
        <div className="acci-form-panel">
          <h3 className="acci-form-title">Campos a completar</h3>

          {/* Fecha de emisión de la resolución (va a la base de datos) */}
          <div className="ca-field" style={{ marginTop: '1rem' }}>
            <label>Fecha de Emisión de la Resolución <span className="ca-req">*</span></label>
            <input
              type="date"
              value={fechaEmisionResolucion}
              onChange={e => setFechaEmisionResolucion(e.target.value)}
            />
          </div>

          {/* Datos básicos */}
          <div className="ca-field">
            <label>Folio <span className="ca-req">*</span></label>
            <input
              type="text"
              value={folio}
              onChange={e => setFolio(e.target.value)}
              placeholder="Ej: 250100097"
            />
          </div>

          <div className="ca-field">
            <label>Expediente <span className="ca-req">*</span></label>
            <input
              type="text"
              value={expedienteNum}
              onChange={e => setExpedienteNum(e.target.value)}
              placeholder="Ej: CEDECON-ZAC-QR-36/2025"
            />
          </div>

          <div className="ca-field">
            <label>Autoridad Fiscal <span className="ca-req">*</span></label>
            <input
              type="text"
              value={autoridadFiscal}
              onChange={e => setAutoridadFiscal(e.target.value)}
              placeholder="Ej: Dirección de Ingresos de la Secretaría de Finanzas del Estado de Zacatecas"
            />
          </div>

          <div className="ca-field">
            <label>Fecha del Documento <span className="ca-req">*</span></label>
            <input
              type="text"
              value={fechaDocumento}
              onChange={e => setFechaDocumento(e.target.value)}
              placeholder="Ej: 09 de febrero de 2026"
            />
          </div>

          <div className="ca-field">
            <label>Fecha de Solicitud <span className="ca-req">*</span></label>
            <input
              type="text"
              value={fechaSolicitud}
              onChange={e => setFechaSolicitud(e.target.value)}
              placeholder="Ej: 02 de diciembre de 2016"
            />
          </div>

          <div className="ca-field">
            <label>Nombre Contribuyente <span className="ca-req">*</span></label>
            <input
              type="text"
              value={nombreContribuyente}
              onChange={e => setNombreContribuyente(e.target.value)}
              placeholder="Ej: C. Javier Sánchez Murillo"
            />
          </div>

          <div className="ca-field">
            <label>Motivo de Queja <span className="ca-req">*</span></label>
            <textarea
              rows={3}
              value={motivoQueja}
              onChange={e => setMotivoQueja(e.target.value)}
              placeholder="Ej: respecto al cobro de Multas de Impuesto sobre Nómina"
            />
          </div>

          <div className="ca-field">
            <label>Oficio Número <span className="ca-req">*</span></label>
            <input
              type="text"
              value={oficioNumero}
              onChange={e => setOficioNumero(e.target.value)}
              placeholder="Ej: DI/0102026"
            />
          </div>

          <div className="ca-field">
            <label>Fecha del Oficio <span className="ca-req">*</span></label>
            <input
              type="text"
              value={fechaOficio}
              onChange={e => setFechaOficio(e.target.value)}
              placeholder="Ej: 09 de enero de 2026"
            />
          </div>

          <div className="ca-field">
            <label>Fecha de Ingreso del Oficio <span className="ca-req">*</span></label>
            <input
              type="text"
              value={fechaIngresoOficio}
              onChange={e => setFechaIngresoOficio(e.target.value)}
              placeholder="Ej: 14 de enero del corriente"
            />
          </div>

          <div className="ca-field">
            <label>Número de Crédito/Multa <span className="ca-req">*</span></label>
            <input
              type="text"
              value={numeroCreditoMulta}
              onChange={e => setNumeroCreditoMulta(e.target.value)}
              placeholder="Ej: BMISN-E-16088/2023"
            />
          </div>

          <div className="ca-field">
            <label>Contacto Vía <span className="ca-req">*</span></label>
            <input
              type="text"
              value={contactoVia}
              onChange={e => setContactoVia(e.target.value)}
              placeholder="Ej: telefónica"
            />
          </div>

          <div className="ca-field">
            <label>Iniciales (opcional)</label>
            <input
              type="text"
              value={iniciales}
              onChange={e => setIniciales(e.target.value)}
              placeholder="Ej: JDRS/cioe"
            />
          </div>

          <button
            className="ca-btn-guardar"
            onClick={handleGenerar}
            disabled={generando}
            style={{ marginTop: '1rem' }}
          >
            {generando ? 'Generando...' : '📄 Generar Acuerdo de Cierre'}
          </button>
        </div>

        {/* ── Panel derecho: vista previa ── */}
        <div className="acci-preview-panel">
          <h3 className="acci-form-title">Vista previa del documento</h3>
          <div className="acci-doc-wrap">
            <div className="acci-doc" style={{
              position: 'relative',
              minHeight: '1200px',
              padding: '170px 60px 90px 60px',
              fontFamily: "'Montserrat', 'Arial', sans-serif",
              fontSize: '11pt',
              lineHeight: '1.8',
              color: '#000',
              backgroundColor: '#fff',
              textAlign: 'justify',
            }}>
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
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '14pt', fontWeight: 'bold', margin: 0 }}>Quejas o Reclamaciones</h2>
                  <h3 style={{ fontSize: '13pt', fontWeight: 'bold', margin: '0.5rem 0', textDecoration: 'underline' }}>Acuerdo de Cierre</h3>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0.3rem 0' }}><strong>Folio:</strong> <span style={{ color: '#EE0000' }}>{folio || '[FOLIO]'}</span></p>
                  <p style={{ margin: '0.3rem 0' }}><strong>Expediente:</strong> <span style={{ color: '#EE0000' }}>{expedienteNum || '[EXPEDIENTE]'}</span></p>
                  <p style={{ margin: '0.3rem 0' }}><strong>Autoridad Fiscal:</strong> <span style={{ color: '#EE0000' }}>{autoridadFiscal || '[AUTORIDAD FISCAL]'}</span></p>
                  <p style={{ margin: '0.3rem 0', textAlign: 'right' }}>Zacatecas, Zacatecas, <span style={{ color: '#92D050' }}>{fechaDocumento || '[FECHA]'}</span>.</p>
                </div>

                <p style={{ marginBottom: '1.5rem' }}>
                  Se da cuenta al licenciado José David Rivera Sesma, en su calidad de Encargado de la Comisión Estatal de la Defensa del Contribuyente, con lo siguiente:
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  <strong>I. Antecedentes.</strong> Los hechos y actuaciones que obran en el expediente administrativo de mérito, abierto con motivo de la solicitud de fecha <span style={{ color: '#EE0000' }}>{fechaSolicitud || '[FECHA SOLICITUD]'}</span>, en virtud de la inconformidad manifestada por el <span style={{ color: '#EE0000' }}>{nombreContribuyente || '[CONTRIBUYENTE]'}</span> en calidad de contribuyente, respecto <span style={{ color: '#92D050' }}>{motivoQueja || '[MOTIVO DE QUEJA]'}</span>.
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  <strong>II. Marco Legal.</strong> Se emite el presente acuerdo de cierre, de conformidad con los artículos 1, 2, 3, 22, 23, 24, párrafo primero; 25, fracción III; 26, 37, fracción II; 33, fracciones I, VI y X y 38 de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios; 6, 7, fracción II, inciso a), numeral 2 y 39, fracción VI del Estatuto Orgánico de la Comisión Estatal para la Defensa del Contribuyente; así como 5, fracción IV; 56 y 67, fracción I, inciso b) de los Lineamientos Generales de Actuación de la Comisión Estatal de la Defensa del Contribuyente.
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  <strong>III. Cumplimiento.</strong> Se tiene por cumplido en tiempo y forma el requerimiento efectuado por esta Comisión a la Dirección de Ingresos de la Secretaría de Finanzas del Estado de Zacatecas, a través de su titular, mediante oficio <span style={{ color: '#EE0000' }}>{oficioNumero || '[OFICIO]'}</span> de fecha <span style={{ color: '#EE0000' }}>{fechaOficio || '[FECHA OFICIO]'}</span>, ingresado el día <span style={{ color: '#EE0000' }}>{fechaIngresoOficio || '[FECHA INGRESO]'}</span>, según consta en el sello de recibido de la Oficialía.
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  <strong>IV. Registro de Actuación.</strong> Se da cuenta mediante registro de actuación, que se contactó vía <span style={{ color: '#92D050' }}>{contactoVia || '[CONTACTO VÍA]'}</span> del contribuyente, con el fin de hacerle de conocimiento del informe rendido por la autoridad responsable, a través del oficio número <span style={{ color: '#EE0000' }}>{oficioNumero || '[OFICIO]'}</span>, recibido en esta Comisión en fecha <span style={{ color: '#EE0000' }}>{fechaIngresoOficio || '[FECHA]'}</span>, en el que hace referencia a la multa controlada con número de crédito <span style={{ color: '#92D050' }}>{numeroCreditoMulta || '[NUMERO CREDITO]'}</span>, fue dejada sin efecto, toda vez que, la autoridad fiscal responsable reconoce que ésta carece de las formalidades que son requeridas para su legalidad; anexando además copia del oficio número <span style={{ color: '#EE0000' }}>{oficioNumero || '[OFICIO]'}</span> mediante los cual se le comunica al contribuyente dicha situación, mismo que ya le fue notificado, por lo que respecta a las multas restantes están activas, no obstante, empero, la autoridad insistió que sus actos se encontraban revestidos de legalidad; por tanto, dicho diferendo con la autoridad se debió ventilar ante un órgano jurisdiccional, sin embargo; a la fecha en que la contribuyente acudió a esta Comisión lo hizo fuera del plazo con el que contaba para su impugnación a través de algún medio de defensa.
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  Por tal motivo, se recomendó acudir ante la autoridad fiscal con la finalidad de ponerse al corriente con sus obligaciones fiscales, a través de los estímulos fiscales contenidos en la Ley de Ingresos del Estado de Zacatecas para el ejercicio fiscal 2025.
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  En atención a lo anteriormente expuesto, se procede al cierre del presente expediente por encontrarse satisfecha la pretensión del contribuyente.
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  <strong>V. Consideraciones.</strong> De conformidad con el artículo 67, fracción I, inciso b) de los Lineamientos Generales de Actuación de la Comisión Estatal de la Comisión Estatal de la Defensa del Contribuyente, y derivado del análisis de las constancias que conforman el expediente en que se actúa, se advierte que, se tiene por satisfecha la pretensión del quejoso, misma que originó el procedimiento de mérito, y por tanto se ha actualizado una de las causales de terminación del servicio de queja.
                </p>

                <p style={{ marginBottom: '1.5rem' }}>
                  Por lo anteriormente expuesto se <strong>ACUERDA:</strong>
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  <strong>PRIMERO:</strong> Se declara terminado el servicio de quejas solicitado por el <span style={{ color: '#EE0000' }}>{nombreContribuyente || '[CONTRIBUYENTE]'}</span> en calidad de contribuyente, ante el área de Quejas Recomendaciones, Medidas Correctivas y Sanciones, de esta Comisión Estatal de la Defensa del Contribuyente y, por lo tanto, se emite el <strong>ACUERDO DE CIERRE</strong>, por encontrarse satisfecha la pretensión del contribuyente que originó el presente procedimiento, no obstante, se dejan a salvo sus derechos para que los haga valer en la vía y forma conducentes, de estimarlo conveniente a sus intereses.
                </p>

                <p style={{ marginBottom: '1.5rem' }}>
                  <strong>SEGUNDO</strong> Se ordena archivar el expediente como asunto totalmente concluido, previo las anotaciones que se realicen en el Libro de Gobierno.
                </p>

                <p style={{ marginBottom: '2rem', textAlign: 'left', fontWeight: 'bold' }}>NOTIFÍQUESE como corresponda.</p>

                <p style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
                  Así lo acordó y firma la Encargada de la Comisión Estatal de la Defensa del Contribuyente. - <strong>Conste.</strong>
                </p>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <p style={{ color: '#EE0000', fontWeight: 700, margin: 0 }}>Licenciado José David Rivera Sesma</p>
                  <p style={{ color: '#EE0000', fontSize: '10pt', margin: 0 }}>Encargada de la Comisión Estatal de la Defensa del Contribuyente</p>
                </div>

                <p style={{ fontSize: '10pt', color: '#333' }}>
                  {iniciales || ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};