import { FileDown, User, Scale, CheckCircle } from 'lucide-react';

const EVENTOS_CONFIG = [
  {
    key: 'registro',
    titulo: 'REGISTRO / CAPTURA',
    icono: <User size={15} />,
  },
  {
    key: 'calificacion',
    titulo: 'CALIFICACIÓN JURÍDICA',
    icono: <Scale size={15} />,
  },
  {
    key: 'conclusion',
    titulo: 'CONCLUSIÓN / RESPUESTA DEL ASESOR',
    icono: <CheckCircle size={15} />,
  },
];

const EventoItem = ({ config, datos, isLast }) => {
  const completado = !!datos;

  return (
    <div className="lt-item">
      {/* Nodo + conector */}
      <div className="lt-nodo-col">
        <div className={`lt-nodo-icon ${completado ? 'lt-nodo--activo' : 'lt-nodo--inactivo'}`}>
          {config.icono}
        </div>
        {!isLast && <div className={`lt-conector ${completado ? 'lt-conector--activo' : ''}`} />}
      </div>

      {/* Contenido */}
      <div className="lt-contenido">
        <div className={`lt-evento-titulo ${completado ? 'lt-texto--activo' : 'lt-texto--pendiente'}`}>
          {config.titulo}
        </div>

        {completado ? (
          <>
            {/* Descripción / texto principal */}
            {datos.descripcion && (
              <p className="lt-descripcion">{datos.descripcion}</p>
            )}

            {/* Datos del contribuyente (solo en registro) */}
            {datos.datosContribuyente && (
              <div className="lt-datos-box">
                {Object.entries(datos.datosContribuyente).map(([label, value]) => (
                  <div key={label} className="lt-dato-row">
                    <span className="lt-dato-label">{label}:</span>
                    <span className="lt-dato-value">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Timestamp + usuario */}
            <div className="lt-meta-row">
              {datos.timestamp && (
                <span className="lt-timestamp--activo">{datos.timestamp}</span>
              )}
              {datos.usuario && (
                <span className="lt-usuario">— {datos.usuario}</span>
              )}
            </div>

            {/* Botón descarga PDF si hay adjunto */}
            {datos.adjunto && (
              <a
                href={datos.adjunto}
                download
                target="_blank"
                rel="noreferrer"
                className="lt-btn-pdf"
              >
                <FileDown size={14} />
                Descargar documento
              </a>
            )}
          </>
        ) : (
          <p className="lt-pendiente-texto">Pendiente</p>
        )}
      </div>
    </div>
  );
};

export const BloqueLineaTiempo = ({ bitacora }) => {
  // bitacora = { registro, calificacion, conclusion }
  const b = bitacora || {};

  return (
    <div className="ficha-card">
      <div className="ficha-card-header">
        <span className="ficha-card-icon">🕐</span>
        <h2 className="ficha-card-title"> BITÁCORA</h2>
      </div>
      <hr className="ficha-divider" />

      <div className="lt-timeline">
        {EVENTOS_CONFIG.map((config, idx) => (
          <EventoItem
            key={config.key}
            config={config}
            datos={b[config.key] || null}
            isLast={idx === EVENTOS_CONFIG.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
