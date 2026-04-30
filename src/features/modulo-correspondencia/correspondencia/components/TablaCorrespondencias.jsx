import React from 'react';

const toText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value);
};

const getFolio = (c) => c?.folioUnico ?? c?.folio_unico ?? c?.folio ?? '';

const getNumeroOficio = (c) =>
  c?.numeroOficio ?? c?.numOficioExterno ?? c?.num_oficio_externo ?? '';

const getDependencia = (c) => c?.dependenciaRemitente ?? c?.dependencia_remitente ?? '';

const getAsunto = (c) => c?.asunto ?? '';

const getFechaRecibido = (c) => c?.fechaRecibido ?? c?.fecha_recibido ?? '';

const getArea = (c) => c?.nombreArea ?? c?.areaAsignada ?? c?.idArea ?? c?.id_area ?? '';

const getEstatus = (c) => c?.estatus ?? c?.nombreEstatus ?? c?.estatusNombre ?? c?.idEstatus ?? c?.id_estatus;

const normalizeEstatus = (estatus) => {
  if (estatus === null || estatus === undefined) return { label: '—', variant: 'concluido' };
  if (typeof estatus === 'number') {
    if (estatus === 1) return { label: 'Registrado', variant: 'registrado' };
    if (estatus === 2) return { label: 'Asignado', variant: 'asignado' };
    if (estatus === 3) return { label: 'En seguimiento', variant: 'en-seguimiento' };
    if (estatus === 4) return { label: 'Concluido', variant: 'concluido' };
    return { label: `Estatus ${estatus}`, variant: 'concluido' };
  }

  const text = String(estatus).trim();
  const upper = text.toUpperCase();

  if (upper.includes('REGISTR')) return { label: text, variant: 'registrado' };
  if (upper.includes('ASIGN')) return { label: text, variant: 'asignado' };
  if (upper.includes('SEGUIM')) return { label: text, variant: 'en-seguimiento' };
  if (upper.includes('CONCLU')) return { label: text, variant: 'concluido' };

  return { label: text, variant: 'concluido' };
};

export const TablaCorrespondencias = ({ correspondencias = [], onVerDetalle, onIrAMemorandum }) => {
  if (!Array.isArray(correspondencias) || correspondencias.length === 0) {
    return <div>No hay correspondencias registradas.</div>;
  }

  return (
    <table className="tabla-correspondencias">
      <thead>
        <tr>
          <th>Folio Único</th>
          <th>Número de Oficio</th>
          <th>Dependencia Remitente</th>
          <th>Asunto</th>
          <th>Fecha Recibido</th>
          <th>Área Asignada</th>
          <th>Estatus</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {correspondencias.map((c, idx) => {
          const id = c?.idCorrespondencia ?? c?.id_correspondencia ?? c?.id ?? idx;
          const estatus = normalizeEstatus(getEstatus(c));

          return (
            <tr key={id}>
              <td>{toText(getFolio(c))}</td>
              <td>{toText(getNumeroOficio(c))}</td>
              <td>{toText(getDependencia(c))}</td>
              <td>{toText(getAsunto(c))}</td>
              <td>{toText(getFechaRecibido(c))}</td>
              <td>{toText(getArea(c))}</td>
              <td>
                <span className={`badge-estatus badge-${estatus.variant}`}>{estatus.label}</span>
              </td>
              <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" className="btn-secundario-corr" onClick={() => onVerDetalle?.(c)}>
                  Ver Detalle
                </button>
                <button type="button" className="btn-primario-corr" onClick={() => onIrAMemorandum?.(c)}>
                  Generar Memorándum
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

