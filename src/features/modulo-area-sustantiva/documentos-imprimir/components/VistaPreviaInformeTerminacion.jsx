import React from 'react';
import membreteImg from '@/assets/membrete.jpg';
import '../styles/informeTerminacion.css'; 

export const VistaPreviaInformeTerminacion = ({ formData }) => {
  const estiloHojaFondo = membreteImg ? { backgroundImage: `url(${membreteImg})` } : {};

  // Valores de reserva (placeholder) si el formulario aún no tiene datos
  const contribuyente = formData.nombreContribuyente || 'Nombre del Contribuyente';
  const encargado = formData.nombreEncargado || 'Nombre del Encargado';
  const asesor = formData.nombreAsesor || 'Nombre del Asesor';

  return (
    <div className="panel-vista-previa" id="informe-terminacion-pdf-content">
      <div className="hoja-membretada-papel" style={estiloHojaFondo}>
        <div className="membrete-contenido">
          
          {/* Encabezado con Logo según la imagen adjunta */}
          <div className="header-container">
            
          </div>

          {/* Cuerpo del Documento */}
          <div className="texto-contenido" style={{ flex: 1, marginTop: '20px' }}>
            <p style={{ textAlign: 'justify', fontSize: '13.5px', color: '#1e293b' }}>
              Lo anterior se asienta para los efectos legales a que haya lugar. Agréguese a los autos del presente expediente. Así lo acordaron y firman:
            </p>
          </div>

          {/* Bloques de Firmas idénticas al diseño de la imagen */}
          <div className="firmas-container">
            {/* Fila Superior: Contribuyente a la izquierda, Encargado a la derecha */}
            <div className="firmas-fila-superior">
              <div className="bloque-firma">
                <hr className="linea-firma" />
                <p className="rol-firma">Contribuyente</p>
                <p className="nombre-firma" style={{ fontWeight: 'bold' }}>{contribuyente}</p>
              </div>
              
              <div className="bloque-firma">
                <hr className="linea-firma" />
                <p className="rol-firma">
                  Encargado de la Comisión Estatal de la Defensa del Contribuyente
                </p>
                <p className="nombre-firma" style={{ fontWeight: 'bold' }}>{encargado}</p>
              </div>
            </div>

            {/* Fila Inferior: Asesor Jurídico centrado */}
            <div className="firmas-fila-inferior">
              <div className="bloque-firma" style={{ marginTop: '20px' }}>
                <hr className="linea-firma" />
                <p className="rol-firma">Asesor Jurídico</p>
                <p className="nombre-firma" style={{ fontWeight: 'bold' }}>{asesor}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VistaPreviaInformeTerminacion;