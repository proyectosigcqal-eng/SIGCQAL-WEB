import React from 'react';
import '../styles/memorandum.css';

export const VistaPreviaMemorandum = ({ formData, usuarios = [], areaDestino, idUsuarioAsignado }) => {

  const getNombreUsuario = (id) => {
    if (!id) return "_________________________";
    const usuario = usuarios.find(u => u.id === Number(id));
    if (!usuario) return "_________________________";
    return usuario.usuarioLogin || `${usuario.nombre || ''} ${usuario.apellidoPaterno || ''}`.trim() || "_________________________";
  };

  const getAreaUsuario = (id) => {
    if (!id) return "_________________________";
    const usuario = usuarios.find(u => u.id === Number(id));
    return usuario && usuario.nombreArea ? usuario.nombreArea : "Área sin asignar";
  };

  const obtenerFechaActual = () => {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const fecha = new Date();
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  };

  const nombreResponsable = idUsuarioAsignado ? getNombreUsuario(idUsuarioAsignado) : null;

  const folioCorrespondencia = formData.folioUnico || "______/______";
  const emisorNombre = formData.idUsuarioEmisor ? getNombreUsuario(formData.idUsuarioEmisor) : "...";
  const emisorArea = formData.idUsuarioEmisor ? getAreaUsuario(formData.idUsuarioEmisor) : "...";

  return (
    <div className="hoja-membretada-container">
      <div className="hoja-membretada-papel">
        
        <header className="membrete-header">
          <div className="membrete-logo-box">
            <div className="logo-circulo-guinda"></div>
            <div className="membrete-institucion">
              <p>COMISIÓN ESTATAL DE LA</p>
              <p>DEFENSA DEL CONTRIBUYENTE</p>
              <p>ESTADO DE ZACATECAS</p>
            </div>
          </div>
          
          <div className="membrete-meta-info">
            <p className="meta-folio">
              <strong>MEMORÁNDUM-05/2026</strong>
            </p>
            <p>
              <strong>Asunto:</strong> {formData.asuntoCorrespondencia || 'Sin asunto asignado'}
            </p>
            <p>Guadalupe, Zacatecas, a {obtenerFechaActual()}.</p>
          </div>
        </header>

    <main className="cuerpo-memorandum">
  {/* Sección del Responsable */}
  <div className="area-responsable-preview mb-4">
    {nombreResponsable ? (
      <>
        <h5 className="text-uppercase mb-0" style={{ fontSize: '1.1rem', color: '#2c3e50', fontWeight: 'bold' }}>
          {nombreResponsable}
        </h5>
        <h5 className="text-uppercase mb-0" style={{ fontSize: '0.95rem', color: '#333' }}>
          {areaDestino?.nombre || areaDestino?.nombreArea || 'Área no especificada'}
        </h5>
      </>
    ) : (
      <h5 className="text-muted italic">[Responsable y Área No Asignados]</h5>
    )}
  </div>

  <p className="texto-presente"><strong>P R E S E N T E .</strong></p>
  
  <div className="texto-contenido">
    <p className="parrafo-introductorio">
      De conformidad al oficio marcado con el Número <strong>{folioCorrespondencia}</strong> emitido por <strong>{emisorNombre}</strong>, perteneciente a la dependencia: <strong>{emisorArea}</strong>.
    </p>
    
    {/* Mapeo de párrafos con seguridad contra nulos */}
    {formData.instruccionSeguimiento ? (
      formData.instruccionSeguimiento.split('\n').map((parrafo, index) => (
        parrafo.trim() !== "" && <p key={index}>{parrafo}</p>
      ))
    ) : (
      <p className="text-muted">[Sin instrucciones de seguimiento]</p>
    )}
  </div>
</main>

        <footer className="membrete-footer">
          <div className="bloque-firma">
            <p><strong>Atentamente</strong></p>
            <p><strong>{getNombreUsuario(formData.idUsuarioFirmante)}</strong></p>
            <p>{getAreaUsuario(formData.idUsuarioFirmante)}</p>
          </div>
          
          <p className="texto-ccp">C.c.p.- Archivo.</p>
        </footer>

        <div className="cenefa-inferior-guinda">
          <p>Boulevard José López Portillo, número 60, Dependencias Federales, C.P. 98600,</p>
          <p>Guadalupe, Zac. Tel. (492)9279703.</p>
        </div>
        
      </div>
    </div>
  );
};