import { usePlazoInformeAutoridad } from '../hooks/usePlazoInformeAutoridad';

const COLORES = {
  VERDE: { bg: '#dcfce7', texto: '#166534', borde: '#86efac' },
  AMARILLO: { bg: '#fef9c3', texto: '#854d0e', borde: '#fde047' },
  ROJO: { bg: '#fee2e2', texto: '#991b1b', borde: '#fca5a5' },
};

export const SemaforoPlazoInformeAutoridad = ({ folio }) => {
  const { plazo, cargando, error } = usePlazoInformeAutoridad(folio);

  if (cargando) return <span className="semaforo-cargando">Calculando plazo...</span>;
  if (error || !plazo) return null;

  const color = COLORES[plazo.semaforo_estado] ?? COLORES.ROJO;

  return (
    <div
      className="semaforo-plazo"
      style={{
        backgroundColor: color.bg,
        border: `1px solid ${color.borde}`,
        borderRadius: '8px',
        padding: '8px 14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: color.borde,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />

      <div style={{ color: color.texto, fontSize: '0.85rem' }}>
        {plazo.vencido ? (
          <strong>⚠ PLAZO VENCIDO</strong>
        ) : (
          <>
            <strong>
              {plazo.dias_habiles_restantes}{' '}
              {plazo.dias_habiles_restantes === 1 ? 'día hábil' : 'días hábiles'}
            </strong>
            {' restante'}
            {plazo.dias_habiles_restantes !== 1 ? 's' : ''}
          </>
        )}
        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Límite: {plazo.fecha_limite}</div>
      </div>
    </div>
  );
};

