import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';

const useContador = (fechaLimite) => {
  const [restante, setRestante] = useState('--:--:--');
  const [vencido, setVencido]   = useState(false);

  useEffect(() => {
    // ✅ Guard triple — null, undefined, o string vacío
    if (!fechaLimite || typeof fechaLimite !== 'string' || !fechaLimite.trim()) {
      setRestante('');
      return;
    }

    const limite = new Date(
      fechaLimite.includes('T') ? fechaLimite : fechaLimite + 'T23:59:59'
    );

    // ✅ Guard fecha inválida
    if (isNaN(limite.getTime())) {
      console.warn('fecha_limite inválida:', fechaLimite);
      setRestante('');
      return;
    }

    const calcular = () => {
      const diff = limite - new Date();
      if (diff <= 0) {
        setVencido(true);
        setRestante('VENCIDO');
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setRestante(
        `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
      );
    };

    calcular();
    const id = setInterval(calcular, 1_000);
    return () => clearInterval(id);
  }, [fechaLimite]);

  return { restante, vencido };
};

export const SemaforoContador = ({ folio }) => {
  const [plazo, setPlazo]       = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!folio) { setCargando(false); return; }
    setCargando(true);
    fetch(`${API_BASE}/api/v1/expedientes/${folio}/plazo-prevencion`)
      .then(r => r.ok ? r.json() : null)
      .then(setPlazo)
      .catch(() => setPlazo(null))
      .finally(() => setCargando(false));
  }, [folio]);

  if (cargando) return <span className="semaforo-cargando">...</span>;
  if (!plazo)   return <span className="semaforo-na">—</span>;

  // Vencido → FINALIZADO
  if (plazo.vencido) {
    return (
      <div className="semaforo-pill semaforo-pill--bloqueado">
        <div className="semaforo-dias">FINALIZADO</div>
      </div>
    );
  }

  const dias     = plazo.dias_habiles_restantes ?? 0;
  const semaforo = plazo.semaforo_estado ?? 'VERDE';
  const colorCls = semaforo === 'ROJO'     ? 'semaforo-pill--rojo'
                 : semaforo === 'AMARILLO'  ? 'semaforo-pill--amarillo'
                 :                           'semaforo-pill--verde';

  return (
    <div className={`semaforo-pill ${colorCls}`}>
      <div className="semaforo-dias">
        {dias} día{dias !== 1 ? 's' : ''} restante{dias !== 1 ? 's' : ''}
      </div>
    </div>
  );
};