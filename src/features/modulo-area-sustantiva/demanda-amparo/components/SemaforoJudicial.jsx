const COLORES = {
  VERDE:    { bg: '#f0fdf4', border: '#86efac', texto: '#166534', punto: '#22c55e' },
  AMARILLO: { bg: '#fefce8', border: '#fde047', texto: '#854d0e', punto: '#eab308' },
  ROJO:     { bg: '#fef2f2', border: '#fca5a5', texto: '#991b1b', punto: '#ef4444' },
  GRIS:     { bg: '#f8fafc', border: '#e2e8f0', texto: '#475569', punto: '#94a3b8' },
};

const formatearFecha = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const meses = ['ene','feb','mar','abr','may','jun',
                 'jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d)} ${meses[parseInt(m)-1]} ${y}`;
};

export const SemaforoJudicial = ({ semaforo }) => {
  if (!semaforo) return null;
  const c = COLORES[semaforo.color] ?? COLORES.GRIS;

  return (
    <div style={{
      background: c.bg, border: `1.5px solid ${c.border}`,
      borderRadius: 10, padding: '0.75rem 1.25rem',
      display: 'flex', alignItems: 'center', gap: 14,
      minWidth: 260,
    }}>
      {/* Punto de color */}
      <div style={{
        width: 14, height: 14, borderRadius: '50%',
        background: c.punto, flexShrink: 0,
        boxShadow: `0 0 0 3px ${c.border}`,
      }} />

      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700,
                      letterSpacing: '0.07em', color: c.texto,
                      textTransform: 'uppercase', marginBottom: 2 }}>
          Semáforo Judicial — Amparo
        </div>

        {semaforo.vencido ? (
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: c.texto }}>
            Plazo vencido — {formatearFecha(semaforo.fechaLimite)}
          </div>
        ) : (
          <>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: c.texto }}>
              {semaforo.diasHabilesRestantes}{' '}
              <span style={{ fontWeight: 400, fontSize: '0.82rem' }}>
                días hábiles restantes
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: c.texto, opacity: 0.8 }}>
              Vence: {formatearFecha(semaforo.fechaLimite)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};