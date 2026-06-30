import React from 'react';
import membreteImg from '@/assets/membrete.jpg';
import '../styles/rlCir.css';

// 1. Recibimos el arreglo de "asesores" que viene directamente de tu useCatalogos
export const VistaPreviaRLCir = ({ formData = {}, asesores = [] }) => {

  const formatearFechaActual = () => {
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const fecha = new Date();
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  };

  const estiloHojaFondo = { backgroundImage: `url(${membreteImg})` };
  const borderStyle = '1px solid #000000';
  
  const textoDefaultArticulos = "Lo anterior con fundamento en lo dispuesto por los artículos 1, 2, 25 fracción II, de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios; en relación con el 2, 6 fracciones I, III, 7 fracción II, inciso a), 26 fracción VII, 27 fracciones I, II, 28 fracciones I, II, III, VIII, X y 39 fracciones II y III, del Estatuto Orgánico de la Comisión Estatal de la Defensa del Contribuyente, así como el 1, 5, 30 fracción IV, 45, 46, 47, 48, y 49 de los Lineamientos Generales de Actuación de la Comisión Estatal de la Defensa del Contribuyente";

  // 2. Buscamos el asesor remitente usando el id guardado en formData (atendiendo si la propiedad es idAsesor o id)
  const asesorRemitenteSeleccionado = asesores.find(as => {
    const idReal = as.idAsesor ?? as.id;
    return String(idReal) === String(formData.idAsesorRemitente);
  });

  // 3. Buscamos el asesor que recibe usando el id guardado en formData
  const asesorRecibeSeleccionado = asesores.find(as => {
    const idReal = as.idAsesor ?? as.id;
    return String(idReal) === String(formData.idAsesorRecibe);
  });

  // 4. Mapeamos los nombres dinámicos. Si no hay selección, cae en el valor por defecto que tenías originalmente.
  const nombreRemitente = asesorRemitenteSeleccionado?.nombre || formData.nombreAsesorRemitente || 'Nombre asesor que remite';
  const nombreRecibe = asesorRecibeSeleccionado?.nombre || formData.nombreAsesorRecibe || 'Nombre asesor que recibe';

  return (
    <div className="panel-vista-previa" id="rl-cir-pdf-content">
      <div className="hoja-membretada-papel" style={estiloHojaFondo}>
        <div className="membrete-contenido" style={{ display: 'flex', flexDirection: 'column', marginTop: '5px', height: '100%', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#000' }}>
          
          <div style={{ border: borderStyle, width: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* ENCABEZADO */}
            <div style={{ textAlign: 'center', padding: '10px', borderBottom: borderStyle, position: 'relative' }}>
              <u style={{ fontWeight: 'bold', fontSize: '14px' }}>Constancia Interna de Remisión</u>
              <div style={{ textAlign: 'right', marginTop: '5px', paddingRight: '20px' }}>
                <p style={{ margin: '2px 0' }}><strong>Número de Folio:</strong> {formData.folioGobierno || 'Folio'}</p>
                <p style={{ margin: '2px 0' }}><strong>Contribuyente:</strong> {formData.nombreContribuyente || 'Contribuyente'}</p>
              </div>
            </div>

            {/* FECHA */}
            <div style={{ textAlign: 'right', padding: '5px 20px', borderBottom: borderStyle }}>
              Zacatecas, Zac., a {formData.fecha || formatearFechaActual()}
            </div>

            {/* ÁREA A CANALIZAR Y SERVICIO PREVIO */}
            <div style={{ padding: '6px 10px', borderBottom: borderStyle, lineHeight: '1.4' }}>
              <div><strong>Área a canalizar:</strong> Representación Legal y Defensa.</div>
              <div><strong>Servicio prestado previamente:</strong> Asesoría.</div>
            </div>

            {/* DOCUMENTACIÓN QUE SE REMITE */}
            <div style={{ padding: '8px 10px', borderBottom: borderStyle }}>
              <strong style={{ display: 'block', marginBottom: '5px' }}>Documentación que se remite:</strong>
              <ol style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.4' }}>
                <li>Solicitud de Servicio.</li>
                <li>Copia de la Identificación oficial No. {formData.identificacionOficial || 'Número identificacion'}</li>
                <li>Multas por infracciones y requerimientos de obligaciones omitidas.</li>
                <li>Multas por Incumplir a requerimiento.</li>
              </ol>
            </div>

            {/* MOTIVOS POR LOS QUE SE REMITE */}
            <div style={{ padding: '8px 10px', borderBottom: borderStyle, textAlign: 'justify' }}>
              <strong>Motivos por los que se remite y solicita el servicio:</strong> {formData.motivos || 'Motivos'}
            </div>

            {/* FUNDAMENTO LEGAL */}
            <div style={{ padding: '8px 10px', borderBottom: borderStyle, textAlign: 'justify', fontSize: '11px', lineHeight: '1.3' }}>
              {formData.articulos || textoDefaultArticulos}
            </div>

            {/* OBSERVACIONES */}
            <div style={{ padding: '6px 10px', borderBottom: borderStyle }}>
              <strong>Observaciones:</strong> {formData.observaciones || 'Observaciones'}
            </div>

            {/* SECCIÓN DE FIRMAS ACTUALIZADA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100px' }}>
              <div style={{ borderRight: borderStyle, borderBottom: borderStyle, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '5px', textAlign: 'center' }}>
                <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{nombreRemitente}</span>
                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Asesor que remite</span>
              </div>
              <div style={{ borderBottom: borderStyle, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '5px', textAlign: 'center' }}>
                <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{nombreRecibe}</span>
                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Asesor que recibe</span>
              </div>
            </div>

            {/* AUTORIZACIÓN */}
            <div style={{ height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '5px' }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Lic.  {formData.director || 'Nombre director'}</span>
              <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Director Técnico Juridico</span>
              <span style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '1px' }}>Autoriza</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};