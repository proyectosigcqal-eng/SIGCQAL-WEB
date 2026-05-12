import React from 'react';
import membreteImg from '@/assets/membrete.jpg';
import '../styles/oficio.css';

export const VistaPreviaOficio = ({ formData, usuarios = [], areaDestino }) => {

  const getNombreUsuario = (id) => {
    if (!id) return "_________________________";
    const usuario = usuarios.find(u => u.id === Number(id));
    if (!usuario) return "_________________________";
    return `${usuario.nombre || ''} ${usuario.apellidoPaterno || ''}`.trim() || usuario.usuarioLogin;
  };

  const getAreaUsuario = (id) => {
    if (!id) return "_________________________";
    const usuario = usuarios.find(u => u.id === Number(id));
    return usuario?.nombreArea || "_________________________";
  };

  const obtenerFechaActual = () => {
    const meses = ['enero','febrero','marzo','abril','mayo','junio',
                   'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const fecha = new Date();
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  };

  // Valores dinámicos — igual que los marcadores de la plantilla
  const folio           = formData.folioUnico || '{{FOLIO}}';
  const asunto          = formData.asuntoCorrespondencia || formData.observaciones || '{{ASUNTO}}';
  const fecha           = obtenerFechaActual();
  const areaDestinatario = areaDestino?.nombre || areaDestino?.nombreArea || null;
  const areaEmisor = getAreaUsuario(formData.idUsuarioEmisor) || '[Sin Área Asignada]';
  const nombreEmisor    = getNombreUsuario(formData.idUsuarioEmisor);
  const instruccion     = formData.instruccionSeguimiento || '';
  const nombreFirmante  = getNombreUsuario(formData.idUsuarioFirmante);
  const areaFirmante    = getAreaUsuario(formData.idUsuarioFirmante);

  return (
    <div className="hoja-membretada-container">
      <div className="hoja-membretada-papel" id="oficio-pdf-content">

        <img src={membreteImg} alt="membrete" className="membrete-fondo" />

        <div className="membrete-contenido">

          {/* META INFO — esquina superior derecha */}
          <div className="membrete-meta-info">
            <p className="meta-folio">
            <strong>Oficio: {formData.folioUnico || 'XXXXXXXX'}</strong>
          </p>
            <p>Guadalupe, Zacatecas, a {fecha}.</p>
          </div>

          {/* DESTINATARIO */}
          <div className="cuerpo-memorandum">
            <p className="area-destinatario"><strong>{areaDestinatario}</strong></p>
            <p className="texto-presente"><strong>P R E S E N T E.</strong></p>

            {/* Texto del cuerpo — idéntico a la plantilla Word */}
            <div className="texto-contenido">
              <p>
                Por este conducto, remito a Usted el oficio <strong>{folio}</strong>,
                emitido por <strong>{nombreEmisor}</strong>, Encargado(a)
                de <strong>{areaEmisor}</strong>{' '}
                {instruccion || <span className="placeholder-muted">[Sin instrucciones de seguimiento]</span>}
              </p>
              <p>Sin más por el momento, aprovecho la ocasión para enviarle un cordial saludo.</p>
            </div>
          </div>

          {/* FIRMA */}
          <div className="membrete-footer-firma">
            <p><strong>Atentamente</strong></p>
            <div className="bloque-firma">
              <p><strong>{nombreFirmante}</strong></p>
              <p>{areaFirmante}</p>
            </div>
            <p className="texto-ccp">C.c.p.- Archivo.</p>
          </div>

        </div>
      </div>
    </div>
  );
};
