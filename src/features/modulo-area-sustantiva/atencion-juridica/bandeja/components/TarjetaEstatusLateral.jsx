

import { SemaforoPlazo } from '@/features/modulo-area-sustantiva/atencion-juridica/prevencion/components/SemaforoPlazo';

export const TarjetaEstatusLateral = ({
  estatusActual,
  progresoPorcentaje,
  onVerDocumentos,
  onAbrirConstancia,
  puedeAbrirConstancia,
  generandoConstancia,
  mensajeConstancia,
}) => (


  <div className="ficha-lateral-card">
    <div className="ficha-lateral-label">ESTATUS ACTUAL</div>
    <div className="ficha-lateral-estatus">{estatusActual}</div>

    {/* --- AQUÍ AGREGAMOS LA CONDICIÓN Y EL SEMÁFORO --- */}
    {estatusActual?.toUpperCase().includes('PREVENCI') && (
      <div style={{ marginTop: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
        <SemaforoPlazo folio={folio} />
      </div>
    )}

    <div className="ficha-progress-bar">
      <div
        className="ficha-progress-fill"
        style={{ width: `${progresoPorcentaje}%` }}
      />
    </div>

    <button className="ficha-btn-documentos" onClick={onVerDocumentos}>
      VER DOCUMENTOS
    </button>

    <button
      className="ficha-btn-constancia"
      onClick={onAbrirConstancia}
      disabled={!puedeAbrirConstancia || generandoConstancia}
    >
      {generandoConstancia ? 'GENERANDO CONSTANCIA...' : 'GENERAR CONSTANCIA INTERNA DE REMISIÓN'}
    </button>

    {mensajeConstancia ? (
      <div className="ficha-constancia-msg">{mensajeConstancia}</div>
    ) : null}
  </div>
);