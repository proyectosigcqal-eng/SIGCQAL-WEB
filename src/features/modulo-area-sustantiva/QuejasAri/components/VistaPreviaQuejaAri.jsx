import React from 'react';
import membreteImg from '@/assets/membrete.jpg';
import '../styles/quejasAri.css'; 

export const VistaPreviaQuejaAri = ({ formData, usuarios = [], areaDestino }) => {

  const formatearFecha = (fechaInput) => {
    if (!fechaInput) {
      const meses = ['enero','febrero','marzo','abril','mayo','junio',
                     'julio','agosto','septiembre','octubre','noviembre','diciembre'];
      const fecha = new Date();
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    }
    // Maneja formatos ISO 'YYYY-MM-DDTHH:mm:ss' o 'YYYY-MM-DD' de manera segura
    const fechaLimpia = fechaInput.split('T')[0];
    const [year, month, day] = fechaLimpia.split('-');
    const meses = ['enero','febrero','marzo','abril','mayo','junio',
                   'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${parseInt(day, 10)} de ${meses[parseInt(month, 10) - 1]} de ${year}`;
  };

  // Valores dinámicos mapeados
  const expediente          = formData.numExpedienteOficial || '{{EXPEDIENTE}}';
  const fechaAcuerdo        = formatearFecha(formData.fechaAcuerdo);
  const actosOmisiones      = formData.sintesisActosOmisiones || '';
  const encargadoFirma      = formData.nombreEncargadoFirma || '_________________________';
  const multasReq           = formData.multasRequerimientos || '';
  const multasCred          = formData.multasCredito || '';
  const areaDestinatario    = formData.idArea 
    ? (areaDestino?.nombre || areaDestino?.nombreArea || null)
    : null;

  const instituto = formData.instituto || '';

  // NUEVOS: Extracción de variables enriquecidas relacionales
  const folioGobierno       = formData.folioGobierno || '{{FOLIO_GOBIERNO}}';
  const nombreAsesor        = formData.nombreAsesor || '{{NOMBRE_ASESOR}}';
  const rfcAsesor           = formData.rfcAsesor || '{{RFC_ASESOR}}';
  const nombreRepresentante = formData.nombreRepresentante || '{{NOMBRE_REPRESENTANTE}}';
  const nombreContribuyente = formData.nombreContribuyente || '{{NOMBRE_CONTRIBUYENTE}}';
  const identificacionContribuyente = formData.identificacionContribuyente || '{{IDENTIFICACION_CONTRIBUYENTE}}';
  const fechaSolicitud = formData.fechaSolicitud 
  ? formatearFecha(formData.fechaSolicitud) 
  : '{{FECHA_SOLICITUD}}';

  // Estilo común para inyectar el fondo dinámicamente sin fallos de compilación de assets
  const estiloHojaFondo = { backgroundImage: `url(${membreteImg})` };

  return (
    <div className="panel-vista-previa" id="queja-ari-pdf-content">

      {/* ================= HOJA 1: INICIO Y HECHOS ================= */}
      <div className="hoja-membretada-papel" style={estiloHojaFondo}>
        <div className="membrete-contenido">
          <div>
            {/* META INFO — Esquina superior derecha */}
            <div className="membrete-meta-info" style={{ textAlign: 'right', marginBottom: '15px' }}>
              <p className="meta-folio" style={{  margin: '7px 0 15px 0' }}>
                <strong style={{ fontSize: '16px' }}>Quejas y reclamaciones</strong>
              </p>
              
              <p className="meta-folio" style={{  margin: '0 0 15px 0' }}>
                <strong style={{ fontSize: '16px', textDecoration: 'underline' }}>Acuerdo de Admisión con Requerimiento de Informe</strong>
              </p>

              <p className="meta-folio" style={{  margin: '0 0 8px 0' }}>
                {/* CAMBIO: Implementado folioGobierno */}
                <strong style={{ fontSize: '16px' }}>Folio: {folioGobierno}</strong>
              </p>

              <p className="meta-folio" style={{ margin: '0 0 8px 0' }}>
                <strong style={{ fontSize: '16px' }}>Expediente: {expediente}</strong>
              </p>
              <p style={{ fontSize: '15.5px', margin: '4px 0 0 0' }}>Zacatecas, Zacatecas, {fechaAcuerdo}.</p>
            </div>

            {/* DESTINATARIO */}
            <div className="cuerpo-memorandum">
              {areaDestinatario && <p className="area-destinatario"><strong>{areaDestinatario}</strong></p>}
              <div className="texto-contenido">

                <div className="seccion-queja" style={{ marginBottom: '15px' }}>
                  <p style={{ textAlign: 'justify' }}>
                    Se da cuenta al licenciado , en su calidad de Encargada de la Comisión Estatal de la Defensa del Contribuyente, con lo siguiente.
                  </p>

                  <p style={{ textAlign: 'justify' }}>
                    {/* CAMBIO: Implementados fechaSolicitud, nombreAsesor y rfcAsesor */}
                    1.  Solicitud para la prestación del servicio de asesoría y consulta, recibida el {fechaSolicitud}, signada por {nombreAsesor}, con Registro Federal de Contribuyentes {rfcAsesor} con motivo de actos y omisiones de la Subdirección de Ingresos, de la Secretaría de Finanzas del Estado de Zacatecas, mediante la cual en su parte medular señala lo siguiente:
                  </p>

                  <p style={{ textAlign: 'justify' }}>
                    {/* CAMBIO: Implementado nombreRepresentante */}
                    “Se presenta a las instalaciones de esta Comisión, el contribuyente {nombreRepresentante}, {actosOmisiones || <span className="placeholder-muted">[Sin motivo de la visita]</span>}.”
                  </p>   


                  <p style={{ textAlign: 'justify' }}>
                    2.  Copia simple de:
                  </p>

                   <p style={{ textAlign: 'justify' }}>
                     {/* CAMBIO: Implementados nombreContribuyente e identificacionContribuyente */}
                    a)  Credencial para votar, expedida por el {instituto || <span className="placeholder-muted">[Instituto]</span>}, a nombre de {nombreContribuyente}, con número de identificación {identificacionContribuyente}
                  </p>               
                  
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>Hoja 1 de 5</div>
        </div>
      </div>


      {/* ================= HOJA 2: MARCO JURÍDICO Y FINANZAS ================= */}
      <div className="hoja-membretada-papel" style={estiloHojaFondo}>
        <div className="membrete-contenido">
          <div>
            <div className="cuerpo-memorandum" style={{ marginTop: '10px' }}>
              <div className="texto-contenido">
                <div className="seccion-queja" style={{ marginBottom: '25px' }}>
                  
                  <p style={{ textAlign: 'justify' }}>
                    b)  Multas por no cumplir con los requerimientos número {multasReq || <span className="placeholder-muted">[Multas requerimientos]</span>} identificadas con número de crédito {multasCred || <span className="placeholder-muted">[Número crédito]</span>} así como su respectivo presupuesto de pago.
                  </p>

                  <p style={{ textAlign: 'justify' }}>
                    Documentos los anteriores, de los que se desprenden posibles vulneraciones a los derechos del Contribuyente.
                  </p>

                  <p style={{ textAlign: 'justify' }}>
                    En consecuencia, con fundamento en lo dispuesto en los artículos 1, 2, 3, 4, 5, 22, 23, 24, 25, fracción III; 26, 37, 40 y 41 de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios; 2, 6, fracciones I y IV; 7, fraction II, inciso a), numeral 2 y último párrafo; 27, fracción II; 28, fracciones I, VI y XIII; 35, 36, 37, 38, 39, fracción VI y 42 del Estatuto Orgánico; 1, 3, 5, fracción IV; 11, 56, 57, 58, 59, 64, fracciones III, VI, VII y VIII de los Lineamientos Generales de Actuación, los dos últimos ordenamientos de la Comisión Estatal de la Defensa del Contribuyente, se emite el siguiente:
                  </p>

                 <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
                ACUERDO:
                </p>

                <p style={{ textAlign: 'justify'}}>
                <strong>I. Recepción. </strong>Se tiene por recibida la queja y la documentación de cuenta, por lo que se ordena integrar el expediente respectivo y su registro en el Libro de Gobierno con la clave citada al rubro.
                </p>
                  
                  <p style={{ textAlign: 'justify'}}>
                <strong>II. Actos y Autoridad Fiscal. </strong>En atención a lo dispuesto en el artículo 37, primer párrafo de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios, esta Comisión advierte que de lo manifestado y de los documentos que aporta se desglosan como actos y omisiones motivo de la queja, los siguientes:
                </p>
                
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>Hoja 2 de 5</div>
        </div>
      </div>


      {/* ================= HOJA 3: CONCLUSIÓN Y FIRMAS ================= */}
      <div className="hoja-membretada-papel" style={estiloHojaFondo}>
        <div className="membrete-contenido">
          <div>
            <div className="cuerpo-memorandum" style={{ marginTop: '10px' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '3px double #000000', 
                  fontFamily: 'sans-serif',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#e2e8f0' }}> 
                      <th style={{
                        border: '1px solid #000000',
                        padding: '5px',
                        width: '10%',
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}>No.</th>
                      <th style={{
                        border: '1px solid #000000',
                        padding: '5px',
                        width: '90%',
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}>Actos y omisiones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{
                        border: '1px solid #000000',
                        padding: '5px',
                        verticalAlign: 'top',
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}>
                        1
                      </td>
                      <td style={{
                        border: '1px solid #000000',
                        padding: '5px',
                        textAlign: 'justify',
                        lineHeight: '1.5'
                      }}>
                        La expedición de las multas con número de crédito, {multasCred || <span className="placeholder-muted">[Número crédito]</span>}, antes que finalizara el plazo de los 15 días que fue otorgado en el requerimiento de obligaciones omitidas con número {multasReq || <span className="placeholder-muted">[Número requerimientos]</span>}, violentando el artículo 115, fracción I del Código Fiscal del Estado de Zacatecas y sus Municipios, asumiendo que el contribuyente no cumpliría con sus obligaciones fiscales.
                      </td>
                    </tr>
                  </tbody>
                </table>
              
              <p style={{ textAlign: 'justify', marginBottom: '9px' }}>
          Asimismo, se tiene por señalada como autoridad fiscal responsable de los actos y omisiones a la Subdirección de Ingresos, de la Secretaría de Finanzas del Estado de Zacatecas.
        </p>
        
        <p style={{ textAlign: 'justify', marginBottom: '9px' }}>
          <strong>III. Admisión.</strong> De conformidad con los artículos 25, fracción III de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios; así como 56 y 64, fracción III de los Lineamientos Generales de Actuación de la Comisión Estatal de Defensa del Contribuyente, se admite a trámite la queja de mérito.
        </p>

        <p style={{ textAlign: 'justify', marginBottom: '9px' }}>
          <strong>IV. Notificaciones.</strong> Se tienen por señalados como domicilio, número telefónico, para oír y recibir notificaciones por parte de la contribuyente, los que precisa en su solicitud de queja.
        </p>
        
        <p style={{ textAlign: 'justify', marginBottom: '9px' }}>
          <strong>V. Pruebas.</strong> Se tienen por ofrecidas y admitidas como prueba las documentales anexadas a la solicitud de servicio, por parte de la contribuyente. 
        </p>

        <p style={{ textAlign: 'justify', marginBottom: '9px' }}> 
          <strong>VI. Requerimiento.</strong> Con fundamento en el artículo 41 de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios y artículo 64, fracciones I, II, III y IV, de los Lineamientos Generales de Actuación de la Comisión Estatal de la Defensa del Contribuyente, con copia del presente acuerdo, que se adjunta al mismo, SE REQUIERE al Titular de la Subdirección de Ingresos, de la 
        </p>
              
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>Hoja 3 de 5</div>
        </div>
      </div>

      {/* ================= HOJA 4 ================= */}
      <div className="hoja-membretada-papel" style={estiloHojaFondo}>
        <div className="membrete-contenido">
          <div>
            <div className="cuerpo-memorandum" style={{ marginTop: '10px' }}>
              <div className="texto-contenido">
                <div className="seccion-queja" style={{ marginBottom: '25px' }}>
                <p style={{ textAlign: 'justify'}}>
                  Secretaría de Finanzas del Estado de Zacatecas, para que dentro del plazo de CINCO DÍAS HÁBILES, a partir de la notificación del presente acuerdo:
                </p>
              <p style={{ textAlign: 'justify'}}>
                1.  Rinda su INFORME, con respecto de lo siguiente:
              </p>

              <p style={{ textAlign: 'justify'}}>
                &nbsp;&nbsp;<strong>a)</strong>  Si admite o no los actos materia de la queja.
              </p>

              <p style={{ textAlign: 'justify'}}>
                &nbsp;&nbsp;<strong>b)</strong>  Si considera que los mismos resultan o no violatorios de los derechos de la persona contribuyente, exponiendo sus antecedentes, fundamentos, razones o motivos que justifiquen la emisión y, en su caso, subsistencia de éstos.
              </p>

              <p style={{ textAlign: 'justify'}}>
                &nbsp;&nbsp;<strong>c)</strong>  Indique los motivos y fundamentos legales que le permiten expedir las multas con número de crédito {multasCred || <span className="placeholder-muted">[Número crédito]</span>}, antes que finalizara el plazo de los 15 días que fue otorgado en el requerimiento de obligaciones omitidas número {multasReq || <span className="placeholder-muted">[Número requerimientos]</span>}, asumiendo así que este no daría cumplimiento a dicho requerimiento, violando así la fracción I del artículo 115 del Código Fiscal del Estado de Zacatecas y sus Municipios.
              </p>

              <p style={{ textAlign: 'justify'}}>
                &nbsp;&nbsp;<strong>d)</strong>  En el supuesto de admitir la vulneración a la esfera jurídica de la ahora quejoso, señale la manera en que la restituirá en el goce de sus derechos.
              </p>

              <p style={{ textAlign: 'justify'}}>
               <strong>VII. Apercibimiento. </strong>Se <strong>apercibe al Titular de la Dirección de Ingresos, de la Secretaría de Finanzas del Estado de Zacatecas </strong>que, en caso de incumplimiento, se hará acreedor a la sanción prevista en los artículos 50, fracción I, inciso a) de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios; 122, fracción I de los Lineamientos Generales de Actuación de la Comisión Estatal de la Defensa del Contribuyente.
              </p>

              <p style={{ textAlign: 'justify'}}>
               En la inteligencia de que, transcurrido el mencionado plazo, se continuará con el trámite de la queja, con las constancias que obren en el expediente.
              </p>

              <p style={{ textAlign: 'justify'}}>
               Asimismo, se hace de su conocimiento que con independencia de que se otorgue 
              </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>Hoja 4 de 5</div>
        </div>
      </div>


      {/* ================= HOJA 5 ================= */}
      <div className="hoja-membretada-papel" style={estiloHojaFondo}>
        <div className="membrete-contenido">
          <div>
            <div className="cuerpo-memorandum" style={{ marginTop: '0px' }}>
              <div className="texto-contenido">
                <div className="seccion-queja" style={{ marginBottom: '10px' }}>
              <p style={{ textAlign: 'justify'}}>
               algún beneficio al contribuyente, esa autoridad fiscal deberá rendir el informe y remitir las constancias atinentes en los términos señalados en el presente proveído, en el entendido de que en caso contrario se tendrá por no cumplido el requerimiento y se aplicarán las sanciones referidas en el primer párrafo de este punto.
              </p>
              <p style={{ textAlign: 'justify'}}>
              <strong>VIII. Domicilio de la Comisión. </strong>A efecto de dar cabal cumplimiento al requerimiento efectuado en este acuerdo, la autoridad fiscal responsable deberá rendir su informe en el tiempo y la forma señalados y entregarlo en las oficinas que ocupa la Comisión Estatal de la Defensa del Contribuyente ubicadas en Boulevard José López Portillo, número 60, Colonia Dependencias Federales, C.P. 98600, Guadalupe, Zacatecas, en horario de 09:00 a 14:30 horas de lunes a viernes.
              </p>

              <p style={{ textAlign: 'justify'}}>
               <strong>IX. Información. </strong>Se hace del conocimiento de la autoridad fiscal responsable que el presente procedimiento de salvaguarda de derechos fundamentales, así como la resolución que se emita por esta Comisión, no constituye instancia y no perjudicará el ejercicio de otros derechos y medios de defensa con que cuente el hoy promovente conforme a las leyes, ni suspenderá, ni interrumpirá los plazos preclusivos, de prescripción o caducidad, ni afectará los trámites o procedimientos que lleven a cabo las autoridades fiscales.
              </p>

              <p style={{ textAlign: 'justify'}}>
               <strong>X. Protección de datos personales. </strong>Se toma conocimiento que la contribuyente manifestó su oposición a la publicación de sus datos personales de conformidad con los artículos 3, fracción VII de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios; así como, 28, fracción VI del Estatuto Orgánico de la Comisión Estatal de la Defensa del Contribuyente.
              </p>

                <p style={{ textAlign: 'justify'}}>
                  <strong>NOTIFÍQUESE</strong> como corresponda.
              </p>

              <p style={{ textAlign: 'justify'}}>
               Así lo acordó y firma el Encargado de la Comisión Estatal de la Defensa del Contribuyente, quien da fe. - Conste.
              </p>

                {/* SECCIÓN DE FIRMA IMPULSADA SIEMPRE AL BORDE INFERIOR */}
                <div className="membrete-footer-firma" style={{ marginBottom: '10px', marginTop:'32px' }}>
                  <div className="bloque-firma" style={{ marginTop: '0px', textAlign: 'center' }}>
                    <p style={{ margin: 0 }}><strong>Lic. {encargadoFirma}</strong></p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                      <strong>Encargado de la Comisión Estatal de la Defensa del Contribuyente</strong>
                    </p>
                  </div>
                </div>

                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>Hoja 5 de 5</div>
        </div>
      </div>

    </div>
  );
};