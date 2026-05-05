import React, { useMemo, useState } from 'react';

export const ModalAsignarArea = ({ visible, areas, onConfirmar, onSaltarSinArea }) => {
  const [idSeleccionado, setIdSeleccionado] = useState('');

  const listaAreas = useMemo(() => {
    if (!Array.isArray(areas)) return [];
    return areas;
  }, [areas]);

  if (!visible) return null;

  const handleConfirmar = () => {
    if (!idSeleccionado) return;
    onConfirmar?.(idSeleccionado);
  };

  return (
    <div className="modal-asignar-area-overlay">
      <div className="modal-asignar-area-card" role="dialog" aria-modal="true">
        <div className="modal-asignar-area-title">¿Deseas asignar un área responsable?</div>
        <div className="modal-asignar-area-subtitle">Puedes asignarlo ahora o hacerlo después.</div>

        <select
          className="modal-asignar-area-select"
          value={idSeleccionado}
          onChange={(e) => setIdSeleccionado(e.target.value)}
        >
          <option value="">Seleccionar área...</option>
          {listaAreas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>

        <div className="modal-asignar-area-acciones">
          <button type="button" className="btn-primario-corr" disabled={!idSeleccionado} onClick={handleConfirmar}>
            Sí, asignar área
          </button>
          <button type="button" className="btn-secundario-corr" onClick={() => onSaltarSinArea?.()}>
            No por ahora, solo guardar
          </button>
        </div>
      </div>
    </div>
  );
};

