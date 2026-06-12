const normalizarEstado = (semaforo) => {
  const estado = semaforo?.estado ?? semaforo?.semaforo_estado ?? null;
  if (!estado) return null;
  return String(estado).toUpperCase().trim();
};

const getDiasRestantes = (semaforo) => {
  const value = semaforo?.diasHabilesRestantes ?? semaforo?.dias_habiles_restantes ?? null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const SemaforoPlazosAutoridad = ({ semaforo }) => {
  if (!semaforo) return null;

  const estado = normalizarEstado(semaforo);
  if (!estado) return null;

  const dias = getDiasRestantes(semaforo);

  const config = {
    VERDE: { cls: 'bdg-badge--verde', label: 'En tiempo' },
    AMARILLO: { cls: 'badge-proceso', label: 'Próximo a vencer' },
    ROJO: { cls: 'bdg-badge--rojo', label: 'Vencido' },
  }[estado] ?? { cls: 'bdg-badge--rojo', label: 'Vencido' };

  const extra = dias === null ? '' : ` (${dias} día${dias === 1 ? '' : 's'})`;

  return <span className={`bdg-badge ${config.cls}`}>{`${config.label}${extra}`}</span>;
};

