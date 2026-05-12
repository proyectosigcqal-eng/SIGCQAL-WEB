import React from 'react';
import membreteImg from '@/assets/membrete.jpg';
import '../styles/oficio.css';

export const VistaPreviaOficio = ({ formData = {}, usuarios = [], areaDestino }) => {
  const getNombreUsuario = (id) => {
    if (!id) return '_________________________';
    const usuario = usuarios.find((u) => u.id === Number(id));
    if (!usuario) return '_________________________';
    return (
      `${usuario.nombre || ''} ${usuario.apellidoPaterno || ''}`.trim() ||
      usuario.usuarioLogin ||
      '_________________________'
    );
  };

  const getAreaUsuario = (id) => {
    if (!id) return '_________________________';
    const usuario = usuarios.find((u) => u.id === Number(id));
    return usuario?.nombreArea || '_________________________';
  };

  const obtenerFechaActual = () => {
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const fecha = new Date();
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  };

  const splitParrafos = (texto) => {
    const limpio = (texto || '').replace(/\r\n/g, '\n').trim();
    if (!limpio) return [];
    return limpio.split(/\n\s*\n/g).map((p) => p.trim()).filter(Boolean);
  };

  const noOficio = (formData.folioUnico || '').trim() || 'OFI-________';
  const referencia = (formData.folioUnico || '').trim() || '________';
  const asunto =
    (formData.asuntoCorrespondencia || '').trim() ||
    (formData.observaciones || '').trim() ||
    '';
  const fecha = obtenerFechaActual();
  const areaDestinatario = areaDestino?.nombre || areaDestino?.nombreArea || '';
  const nombreEmisor = getNombreUsuario(formData.idUsuarioEmisor);
  const areaEmisor = getAreaUsuario(formData.idUsuarioEmisor) || '_________________________';
  const nombreFirmante = getNombreUsuario(formData.idUsuarioFirmante);
  const areaFirmante = getAreaUsuario(formData.idUsuarioFirmante);
  const cuerpo = (formData.instruccionSeguimiento || '').trim();
  const parrafos = splitParrafos(cuerpo);

  return (
    <div className="sigcqalPreviewShell sigcqalOficioPreview">
      <div className="sigcqalPaper" id="oficio-pdf-content">
        <img src={membreteImg} alt="membrete" className="sigcqalPaperBg" />
        <div className="sigcqalPaperContent">
          <header className="sigcqalHeader">
            <div className="sigcqalMinWidth0">
              <div className="sigcqalDocType">OFICIO</div>
              <div className="sigcqalHeaderSub">
                <div className="sigcqalHeaderSubTitle">{areaEmisor}</div>
                <div className="sigcqalHeaderSubLine">Elaboró: {nombreEmisor}</div>
              </div>
            </div>
            <div className="sigcqalMetaRight">
              <div className="sigcqalMetaLine">
                <span className="sigcqalMetaKey">No. Oficio:</span>
                <span className="sigcqalMetaVal">{noOficio}</span>
              </div>
              <div className="sigcqalMetaLine">
                <span className="sigcqalMetaKey">Referencia:</span>
                <span className="sigcqalMetaVal">{referencia}</span>
              </div>
              <div className="sigcqalMetaDate">Guadalupe, Zacatecas, a {fecha}.</div>
            </div>
          </header>

          <section className="sigcqalSection">
            <div className="sigcqalToLine">
              <div className="sigcqalDestinatario">{areaDestinatario || '_________________________'}</div>
              <div className="sigcqalPresente">P R E S E N T E.</div>
            </div>

            <div className="sigcqalKVGrid">
              <div className="sigcqalKV">
                <div className="sigcqalK">Asunto</div>
                <div className="sigcqalV">
                  {asunto ? asunto : <span className="sigcqalPlaceholder">[Sin asunto]</span>}
                </div>
              </div>
              <div className="sigcqalKV">
                <div className="sigcqalK">Área Destino</div>
                <div className="sigcqalV">
                  {areaDestinatario ? areaDestinatario : <span className="sigcqalPlaceholder">[Sin área destino]</span>}
                </div>
              </div>
            </div>
          </section>

          <main className="sigcqalBody" aria-label="Cuerpo del oficio">
            {parrafos.length > 0 ? (
              parrafos.map((p, idx) => (
                <p key={idx} className="sigcqalP">
                  {p}
                </p>
              ))
            ) : (
              <p className="sigcqalP sigcqalPlaceholder">[Escribe el contenido del oficio para visualizarlo aquí]</p>
            )}
          </main>

          <footer className="sigcqalFooter">
            <div className="sigcqalSignSealRow">
              <div>
                <div className="sigcqalSignTitle">ATENTAMENTE</div>
                <div className="sigcqalSignSpacer" />
                <div className="sigcqalSignName">{nombreFirmante}</div>
                <div className="sigcqalSignArea">{areaFirmante}</div>
              </div>
              <div>
                <div className="sigcqalSealBox">SELLO OFICIAL</div>
              </div>
            </div>
            <div className="sigcqalCCPRow">
              <div className="sigcqalSmall">C.c.p.- Archivo.</div>
              <div className="sigcqalSmall">Documento institucional</div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
