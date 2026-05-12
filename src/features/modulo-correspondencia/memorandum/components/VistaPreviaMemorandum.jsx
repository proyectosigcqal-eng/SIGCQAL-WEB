import React from 'react';
import membreteImg from '@/assets/membrete.jpg';
import '../styles/memorandum.css';

export const VistaPreviaMemorandum = ({ formData = {}, usuarios = [], areaDestino }) => {
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
    return limpio
      .split(/\n\s*\n/g)
      .map((p) => p.trim())
      .filter(Boolean);
  };

  const noMemo = (formData.folioUnico || '').trim() || 'MEMO-________';
  const fecha = obtenerFechaActual();
  const para = areaDestino?.nombre || areaDestino?.nombreArea || '';
  const deNombre = getNombreUsuario(formData.idUsuarioEmisor);
  const deArea = getAreaUsuario(formData.idUsuarioEmisor);
  const asunto = (formData.asuntoCorrespondencia || '').trim() || (formData.observaciones || '').trim() || '';
  const firmanteNombre = getNombreUsuario(formData.idUsuarioFirmante);
  const firmanteArea = getAreaUsuario(formData.idUsuarioFirmante);
  const cuerpo = (formData.instruccionSeguimiento || '').trim();
  const parrafos = splitParrafos(cuerpo);

  return (
    <div className="sigcqalPreviewShell sigcqalMemoPreview">
      <div className="sigcqalPaper" id="memorandum-pdf-content">
        <img src={membreteImg} alt="membrete" className="sigcqalPaperBg" />
        <div className="sigcqalPaperContent">
          <div className="sigcqalTopRow">
            <div className="sigcqalMinWidth0">
              <div className="sigcqalTitle">MEMORÁNDUM</div>
              <div className="sigcqalHeaderSub">
                <div className="sigcqalHeaderSubTitle">{deArea}</div>
              </div>
            </div>
            <div className="sigcqalMeta">
              <div className="sigcqalMetaLine">
                <span className="sigcqalMetaKey">No.:</span>
                <span className="sigcqalMetaVal">{noMemo}</span>
              </div>
              <div className="sigcqalMetaDate">Guadalupe, Zacatecas, a {fecha}.</div>
            </div>
          </div>

          <section className="sigcqalKVBox" aria-label="Encabezado de memorándum">
            <div className="sigcqalKVRow">
              <div className="sigcqalKVKey">Para</div>
              <div className="sigcqalKVVal">
                {para ? para : <span className="sigcqalPlaceholder">_________________________</span>}
              </div>
            </div>
            <div className="sigcqalKVRow">
              <div className="sigcqalKVKey">De</div>
              <div className="sigcqalKVVal">
                {deNombre}
                <span className="sigcqalInlineMuted"> · {deArea}</span>
              </div>
            </div>
            <div className="sigcqalKVRow">
              <div className="sigcqalKVKey">Asunto</div>
              <div className="sigcqalKVVal">
                {asunto ? asunto : <span className="sigcqalPlaceholder">[Sin asunto]</span>}
              </div>
            </div>
            <div className="sigcqalKVRow">
              <div className="sigcqalKVKey">Fecha</div>
              <div className="sigcqalKVVal">{fecha}</div>
            </div>
          </section>

          <main className="sigcqalBody" aria-label="Contenido del memorándum">
            {parrafos.length > 0 ? (
              parrafos.map((p, idx) => (
                <p key={idx} className="sigcqalP">
                  {p}
                </p>
              ))
            ) : (
              <p className="sigcqalP sigcqalPlaceholder">[Escribe el contenido del memorándum para visualizarlo aquí]</p>
            )}
          </main>

          <footer className="sigcqalFooter">
            <div className="sigcqalSignTitle">ATENTAMENTE</div>
            <div className="sigcqalSignSpacer" />
            <div className="sigcqalSignName">{firmanteNombre}</div>
            <div className="sigcqalSignArea">{firmanteArea}</div>
            <div className="sigcqalCCP">
              <div>C.c.p.- Archivo.</div>
              <div>Documento institucional</div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
