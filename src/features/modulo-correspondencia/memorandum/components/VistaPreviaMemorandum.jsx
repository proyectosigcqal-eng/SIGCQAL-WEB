import React from "react";
import membreteImg from "@/assets/membrete.jpg";
import "../styles/memorandum.css";

export const VistaPreviaMemorandum = ({
  formData,
  usuarios = [],
  areaDestino,
}) => {
  const getNombreUsuario = (id) => {
    if (!id) return "";
    const usuario = usuarios.find((u) => u.id === Number(id));
    if (!usuario) return "";
    return (usuario.nombreCompleto || usuario.usuarioLogin || "").trim();
  };

  const getAreaUsuario = (id) => {
    if (!id) return "";
    const usuario = usuarios.find((u) => u.id === Number(id));
    return usuario?.nombreArea || "";
  };

  const obtenerFechaActual = () => {
    const meses = [
      "enero","febrero","marzo","abril","mayo","junio",
      "julio","agosto","septiembre","octubre","noviembre","diciembre",
    ];
    const fecha = new Date();
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  };

  // ── Variables que mapean 1:1 con los marcadores de la plantilla ──────────
  const folio          = formData.folioUnico   || "MEMO-XXXXXXXX"; // ← sin tocar, es el de arriba
const numOficioRef   = formData.numeroOficio || folio;           // ← nuevo, para el cuerpo
  const asunto         = formData.asuntoCorrespondencia || formData.observaciones || "";
  const fecha          = obtenerFechaActual();
  const usuarioEncargado = formData.nombreEncargado
                          || getNombreUsuario(formData.idUsuarioEncargado)
                          || "";
  const cargoEncargado   = formData.cargoEncargado || "";
  const areaDestinatario = areaDestino?.nombre || areaDestino?.nombreArea
                          || getAreaUsuario(formData.idArea) || "";
  const instruccion      = formData.instruccionSeguimiento || "";
  const nombreFirmante   = getNombreUsuario(formData.idUsuarioFirmante);
  const areaFirmante     = getAreaUsuario(formData.idUsuarioFirmante);
  // ─────────────────────────────────────────────────────────────────────────

  // Estilos inline para replicar el Word fielmente
  const s = {
    page: {
      position: 'relative',
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: 12,
      color: '#000',
      lineHeight: 1.4,
    },
    headerBox: {
      // bloque superior derecho: folio + asunto en blockquote
      textAlign: 'right',
      marginBottom: 8,
    },
    folioLine: {
      fontWeight: 700,
      fontSize: 13,
    },
    fecha: {
      marginBottom: 14,
    },
    destinatarioNombre: {
      fontWeight: 700,
      textTransform: 'uppercase',
      marginBottom: 0,
    },
    destinatarioCargo: {
      fontWeight: 700,
      textTransform: 'uppercase',
      marginTop: 0,
      marginBottom: 14,
    },
    presente: {
      fontWeight: 700,
      letterSpacing: '0.25em',
      marginBottom: 12,
    },
    cuerpo: {
      textAlign: 'justify',
      marginBottom: 10,
    },
    saludo: {
      textAlign: 'justify',
      marginBottom: 24,
    },
    atentamente: {
      fontWeight: 700,
      marginBottom: 32,
    },
    firmaNombre: {
      fontWeight: 700,
      textTransform: 'uppercase',
      marginBottom: 0,
    },
    firmaArea: {
      fontWeight: 700,
      textTransform: 'uppercase',
      marginTop: 0,
      marginBottom: 14,
    },
    ccp: {
      marginTop: 8,
    },
    placeholder: {
      color: '#aaa',
      fontStyle: 'italic',
    },
  };

  const ph = (val, label) =>
    val
      ? val
      : <span style={s.placeholder}>[{label}]</span>;

  return (
    <div className="hoja-membretada-container">
      <div className="hoja-membretada-papel" id="memorandum-pdf-content" style={s.page}>
        <img src={membreteImg} alt="membrete" className="membrete-fondo" />

        <div className="membrete-contenido">

          {/* ── HEADER: folio + asunto (blockquote derecho en Word) ───────── */}
          <div style={s.headerBox}>
            <p style={s.folioLine}><strong>{folio}</strong></p>
            <p><strong>Asunto:</strong> {ph(asunto, 'Asunto')}</p>
          </div>

          {/* ── FECHA ────────────────────────────────────────────────────── */}
          <p style={s.fecha}>
            Guadalupe, Zacatecas, a {fecha}.
          </p>

          {/* ── DESTINATARIO ─────────────────────────────────────────────── */}
          <p style={s.destinatarioNombre}>
            <strong>{ph(usuarioEncargado, 'USUARIO_ENCARGADO')}</strong>
          </p>
          {/* Cargo + Área en la misma línea, igual que la plantilla */}
          <p style={s.destinatarioCargo}>
            <strong>
              {cargoEncargado || areaDestinatario
                ? `${cargoEncargado}${cargoEncargado && areaDestinatario ? ' ' : ''}${areaDestinatario}`
                : <span style={s.placeholder}>[CARGO_ENCARGADO AREA_DESTINATARIO]</span>
              }
            </strong>
          </p>

          {/* ── PRESENTE ─────────────────────────────────────────────────── */}
          <p style={s.presente}><strong>P R E S E N T E.</strong></p>

          {/* ── CUERPO — idéntico al Word ─────────────────────────────────
              "En atención a su memorándum número {{FOLIO}},
               informo a Usted que {{INSTRUCCION}}"                        */}
          <p style={s.cuerpo}>
            En atención a su oficio número <strong>{numOficioRef}</strong>,
            informo a Usted que{' '}
            {instruccion
              ? instruccion
              : <span style={s.placeholder}>[Sin instrucciones de seguimiento]</span>
            }
          </p>

          {/* ── SALUDO ───────────────────────────────────────────────────── */}
          <p style={s.saludo}>
            Sin más por el momento, aprovecho la ocasión para enviarle un
            cordial saludo.
          </p>

          {/* ── FIRMA ────────────────────────────────────────────────────── */}
          <p style={s.atentamente}><strong>Atentamente</strong></p>

          <p style={s.firmaNombre}>
            <strong>{ph(nombreFirmante, 'NOMBRE_FIRMANTE')}</strong>
          </p>
          <p style={s.firmaArea}>
            <strong>{ph(areaFirmante, 'AREA_FIRMANTE')}</strong>
          </p>

          <p style={s.ccp}>C.c.p. Archivo.</p>

        </div>
      </div>
    </div>
  );
};
