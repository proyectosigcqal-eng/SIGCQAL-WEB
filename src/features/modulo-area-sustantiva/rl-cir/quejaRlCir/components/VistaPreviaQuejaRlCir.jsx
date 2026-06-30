import React from 'react';
import membreteImg from '@/assets/membrete.jpg';
import '../styles/quejaRlCir.css';

export const VistaPreviaQuejaRlCir = ({ formData = {}, datosResolucion = null, asesores = [], tramiteContext = {} }) => {

  const estiloHojaFondo = { backgroundImage: `url(${membreteImg})` };
  const borderStyle = '1px solid #000000';

  // Buscar asesores dinámicamente
  const asesorRemitenteSeleccionado = asesores.find(as => {
    const idReal = as.idAsesor ?? as.id;
    return String(idReal) === String(formData.idAsesorRemitente);
  });

  const asesorRecibeSeleccionado = asesores.find(as => {
    const idReal = as.idAsesor ?? as.id;
    return String(idReal) === String(formData.idAsesorRecibe);
  });

  const nombreRemitente = asesorRemitenteSeleccionado?.nombre || 'Nombre asesor que remite';
  const nombreRecibe = asesorRecibeSeleccionado?.nombre || 'Nombre asesor que recibe';

  // Mapeo priorizando el JSON de Resolución Final del Back-end
  const numeroOficio = datosResolucion?.numeroOficio || '{{NUMERO_OFICIO}}';
  const folioGobierno = datosResolucion?.folioGobierno || tramiteContext.folio || '{{FOLIO_GOBIERNO}}';
  const contribuyente = datosResolucion?.nombreContribuyente || formData.contribuyente || tramiteContext.contribuyente || '{{CONTRIBUYENTE}}';
  const identificacionOficial = datosResolucion?.identificacionOficial || '{{IDENTIFICACION_OFICIAL}}';
  const numExpedienteOficial = datosResolucion?.numExpedienteOficial || '{{NUM_EXPEDIENTE_OFICIAL}}';
  const numeroCreditoAri = datosResolucion?.numeroCreditoAri || '{{NUMERO_CREDITO_ARI}}';

  // Mantenemos multasCredito por si el formulario original de quejas lo usara de fallback
  const multasCredito = formData.multasCredito || numeroCreditoAri;

  return (
    <div className="panel-vista-previa" id="queja-rl-cir-pdf-content">
      <div className="hoja-membretada-papel" style={estiloHojaFondo}>
        <div className="membrete-contenido" style={{ display: 'flex', flexDirection: 'column', marginTop: '5px', height: '100%', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#000' }}>
          
          <div style={{ border: borderStyle, width: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* ENCABEZADO CON CONSTANCIA, FOLIO Y CONTRIBUYENTE */}
            <div style={{ padding: '10px', borderBottom: borderStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <u style={{ fontWeight: 'bold', fontSize: '13px', textAlign: 'center', width: '100%', display: 'block' }}>
                Constancia Interna de Remisión
              </u>
              <div style={{ alignSelf: 'flex-end', width: '50%', textAlign: 'left', marginTop: '5px', fontSize: '11px', paddingRight: '10px' }}>
                <p style={{ margin: '2px 0' }}><strong>Número de Folio:</strong> {folioGobierno}.</p>
                <p style={{ margin: '2px 0' }}><strong>Contribuyente:</strong> {contribuyente}.</p>
                <p style={{ margin: '2px 0' }}><strong>Identificación Oficial:</strong> {identificacionOficial}.</p>
              </div>
            </div>

            {/* FECHA */}
            <div style={{ textAlign: 'right', padding: '4px 20px', borderBottom: borderStyle, fontSize: '11px' }}>
              Zacatecas, Zac., a {formData.fechaEmision || 'AAAA-MM-DD'}
            </div>

            {/* ÁREA A CANALIZAR */}
            <div style={{ padding: '4px 10px', borderBottom: borderStyle }}>
              <strong>Área a canalizar:</strong> Representación Legal y Defensa.
            </div>

            {/* SERVICIO PRESTADO PREVIAMENTE */}
            <div style={{ padding: '4px 10px', borderBottom: borderStyle }}>
              <strong>Servicio prestado previamente:</strong> Quejas.
            </div>

            {/* DOCUMENTACIÓN QUE SE REMITE */}
            <div style={{ padding: '8px 10px', borderBottom: borderStyle, textAlign: 'justify', fontSize: '11px' }}>
              <strong style={{ display: 'block', marginBottom: '6px' }}>Documentación que se remite:</strong>
              <ol style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.4' }}>
                <li style={{ marginBottom: '8px' }}>
                  Copia simple de oficio {numeroOficio}, de la dirección de Ingresos de la secretaría de Finanzas del Estado de Zacatecas, donde se rinde informe respecto al Acuerdo de Acciones de Investigación derivado de la queja {numExpedienteOficial}.
                </li>
                <li>
                  <strong>Anexo: Oficio {formData.oficio || '{{OFICIO}}'}</strong> dirigido al C. {contribuyente}, donde se le notifica que quedan sin efectos las multas de Impuesto Sobre Nómina con números de crédito: {multasCredito}.
                </li>
              </ol>
            </div>

            {/* MOTIVOS */}
            <div style={{ padding: '8px 10px', borderBottom: borderStyle, textAlign: 'justify' }}>
              <strong>Motivos por los que se remite y solicita el servicio:</strong> {formData.motivos || '{{MOTIVOS}}'}
            </div>

            {/* ARTÍCULOS / FUNDAMENTO */}
            <div style={{ padding: '15px 10px', borderBottom: borderStyle, textAlign: 'justify', minHeight: '60px' }}>
              {formData.articulos || '{{ARTICULOS}}'}
            </div>

            {/* OBSERVACIONES */}
            <div style={{ padding: '6px 10px', borderBottom: borderStyle }}>
              <strong>Observaciones:</strong> {formData.observaciones || '{{OBSERVACIONES}}'}
            </div>

            {/* SECCIÓN DE FIRMAS ASESORES */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ borderRight: borderStyle, borderBottom: borderStyle, height: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '3px', textAlign: 'center' }}>
                <span>L.C. {nombreRemitente}</span>
              </div>
              <div style={{ borderBottom: borderStyle, height: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '3px', textAlign: 'center' }}>
                <span>{nombreRecibe}</span>
              </div>
            </div>

            {/* SUB-ENCABEZADO DE PUESTOS ASESORES */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#fff' }}>
              <div style={{ borderRight: borderStyle, borderBottom: borderStyle, textAlign: 'center', fontWeight: 'bold', padding: '2px 0', fontSize: '11px' }}>
                Asesor que remite
              </div>
              <div style={{ borderBottom: borderStyle, textAlign: 'center', fontWeight: 'bold', padding: '2px 0', fontSize: '11px' }}>
                Asesor que recibe
              </div>
            </div>

            {/* ESPACIO EN BLANCO PREVIO A AUTORIZACIÓN */}
            <div style={{ height: '40px', borderBottom: borderStyle }}></div>

            {/* AUTORIZACIÓN DIRECTOR */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4px 0' }}>
              <span style={{ fontWeight: 'bold' }}>Lic. {formData.director || 'Nombre director'}</span>
              <span style={{ fontSize: '11px', fontWeight: 'bold', borderTop: '1px solid #000', width: '60%', marginTop: '2px', paddingTop: '2px' }}>
                Directora Técnica Jurídica
              </span>
              <span style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '2px' }}>Autoriza</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default VistaPreviaQuejaRlCir;