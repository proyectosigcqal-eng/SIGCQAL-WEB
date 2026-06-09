import { useTurnado } from '../hooks/useTurnado';

export const AsesorAsignado = ({ folio, nombreAsesor, onReasignado }) => {
  const { turnar, cargando, error } = useTurnado();

  const handleReasignar = async () => {
    const ok = window.confirm(
      `¿Deseas reasignar el expediente ${folio} al siguiente asesor disponible?`
    );
    if (!ok) return;

    const resultado = await turnar(folio);
    if (resultado) {
      alert(`Reasignado a: ${resultado.nombre_asesor}`);
      if (onReasignado) onReasignado(resultado);
    }
  };

  return (
    <div className="asesor-asignado">
      <div className="ficha-field-label">ASESOR RESPONSABLE</div>
      <div className="asesor-nombre">
        {nombreAsesor || <span className="asesor-sin-asignar">Sin asignar</span>}
      </div>

      {error && (
        <p className="asesor-error">{error}</p>
      )}

      <button
        className="btn-reasignar"
        onClick={handleReasignar}
        disabled={cargando}
      >
        {cargando ? 'Reasignando...' : '↺ Reasignar'}
      </button>
    </div>
  );
};