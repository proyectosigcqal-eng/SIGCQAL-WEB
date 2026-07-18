import React from 'react';
import membreteImg from '@/assets/membrete.jpg';
import '../styles/amparoPredial.css'; 

export const VistaPreviaAmparoPredial = ({ formData }) => {
  const estiloHojaFondo = membreteImg ? { backgroundImage: `url(${membreteImg})` } : {};

  // Valor de reserva (placeholder) si el formulario aún no tiene datos
  const contribuyente = (formData.nombreContribuyente || 'ADRIAN CORTEZ VELÁZQUEZ').toUpperCase();

  return (
    <div className="panel-vista-previa" id="amparo-predial-pdf-content">
      <div className="hoja-membretada-papel" style={estiloHojaFondo}>
        <div className="membrete-contenido">
          
          

          {/* Título de la sección */}
          <div className="titulo-seccion-container">
            <h2 className="titulo-puntos-petitorios">PUNTOS PETITORIOS</h2>
          </div>

          {/* Cuerpo del Documento */}
          <div className="texto-contenido-amparo">
            <p className="texto-introductorio">
              Por lo expuesto, <strong>A USTED JUEZ DE DISTRITO EN TURNO DEL VIGÉSIMO TERCER CIRCUITO</strong>, atentamente se solicita:
            </p>

            <ul className="lista-puntos-petitorios">
              <li>
                <strong>PRIMERO.</strong> Tener por presentado en los términos de este escrito, solicitando el amparo y protección de la Justicia Federal en contra de las normas generales reclamadas y de las autoridades que se señalan en los capítulos respectivos de esta demanda.
              </li>
              <li>
                <strong>SEGUNDO.</strong> Admitir la demanda a trámite, solicitar de las responsables los informes justificados y fijar día y hora para la celebración de las audiencias constitucional.
              </li>
              <li>
                <strong>TERCERO.</strong> Tener por exhibidas, ofrecidas y relacionadas las pruebas que se señalan en el capítulo respectivo, sin perjuicio de adicionar otras en el momento de la celebración de la audiencia constitucional.
              </li>
              <li>
                <strong>CUARTO.</strong> Tener por autorizadas a las personas mencionadas en el presente escrito, a efecto de que puedan oír y recibir notificaciones en representación del suscrito.
              </li>
              <li>
                <strong>QUINTO.</strong> Previos los trámites de la ley, conceder al quejoso el amparo y protección de la Justicia Federal que se solicita.
              </li>
              <li>
                <strong>SEXTO.</strong> De los originales de los referidos documentos que se exhiben, se cotejen para que sean devueltos los originales.
              </li>
            </ul>
          </div>

          {/* Sección de Firma */}
          <div className="firma-seccion-amparo">
            <p className="atentamente-texto">ATENTAMENTE</p>
            
            <div className="bloque-firma-amparo">
              <hr className="linea-firma-amparo" />
              <p className="nombre-firma-amparo">{contribuyente}</p>
            </div>

            <p className="fecha-pie-pagina">
              Zacatecas, Zacatecas, a la fecha de su presentación.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VistaPreviaAmparoPredial;