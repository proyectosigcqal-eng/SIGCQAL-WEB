import React from 'react';
import membreteImg from '@/assets/membrete.jpg';
import '../styles/cartaCompromiso.css';

export const VistaPreviaCartaCompromiso = ({ formData }) => {
  const estiloHojaFondo = membreteImg ? { backgroundImage: `url(${membreteImg})` } : {};
  const contribuyente = formData.nombreContribuyente || 'NOMBRE DEL CONTRIBUYENTE';

  return (
    <div className="panel-vista-previa" id="carta-compromiso-pdf-content">
      <div className="hoja-membretada-papel" style={estiloHojaFondo}>
        <div className="membrete-contenido">
          
          {/* Cuerpo superior: Sección VI */}
          {/* SE AÑADIÓ flexGrow: 0 Y flex: 'none' PARA ANULAR EL ESTILO GLOBAL DE LA CLASE */}
          <div className="texto-contenido" style={{ marginTop: '10px', flexGrow: 0, flex: 'none' }}>
            <p style={{ textAlign: 'justify', fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: '0' }}>
              VI. Fecha en que el contribuyente deberá acudir a la Delegación de la Comisión Estatal de la Defensa del Contribuyente para firmar el medio de impugnación:
            </p>
          </div>

          {/* Bloque de Firma Único Centrado */}
          <div className="firmas-container-carta">
            <div className="bloque-firma-centrado">
              <hr className="linea-firma" />
              <p className="nombre-firma" style={{ fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                {contribuyente}
              </p>
              <p className="rol-firma">NOMBRE Y FIRMA DEL QUEJOSO</p>
              <p className="rol-firma">Y/O SOLICITANTE Y/O REPRESENTANTE LEGAL</p>
            </div>
          </div>

          {/* Manifiesto inferior */}
          <div className="manifiesto-container">
            <p style={{ textAlign: 'justify', fontSize: '13px', color: '#0f172a', lineHeight: '1.2', fontWeight: '400', margin: '0' }}>
              MANIFIESTO QUE HE LEÍDO EL CONTENIDO DEL PRESENTE DOCUMENTO QUE ACEPTO TODOS Y CADA UNO DE LOS 
              DERECHOS Y OBLIGACIONES QUE EN ELLA SE ESTABLECEN, ASÍ COMO QUE ES MI INTENCIÓN SER PATROCINADO 
              LEGALMENTE POR LA COMISIÓN ESTATAL DE LA DEFENSA DEL CONTRIBUYENTE.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VistaPreviaCartaCompromiso;