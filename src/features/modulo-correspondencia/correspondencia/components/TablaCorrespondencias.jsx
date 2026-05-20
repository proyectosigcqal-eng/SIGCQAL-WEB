import React, { useMemo, useState } from 'react';
import { shouldMostrarGenerarMemorandum } from '../utils/correspondenciaUtils';
import { formatDateTimeDisplay } from '@/shared/utils/dateUtils';

const asArray = (value) => (Array.isArray(value) ? value : []);

const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const safeDateLabel = (value) => {
  if (!value) return '';
  return formatDateTimeDisplay(value);
};

const getId = (item) =>
  item?.idCorrespondencia ??
  item?.id_correspondencia ??
  item?.idCorrespondence ??
  item?.id ??
  item?.uuid ??
  null;

const getEstatusLabel = (item) => {
  const raw =
    item?.estatus ??
    item?.estatusNombre ??
    item?.nombreEstatus ??
    item?.descripcionEstatus ??
    item?.estatusDescripcion ??
    item?.idEstatus ??
    item?.id_estatus ??
    item?.idEstatusIndividual ??
    item?.id_estatus_individual;

  if (raw == null) return 'Sin estatus';
  if (typeof raw === 'number') {
    if (raw === 1) return 'Registrado';
    if (raw === 2) return 'Asignado';
    if (raw === 3) return 'En seguimiento';
    if (raw === 4) return 'Concluido';
    return `Estatus ${raw}`;
  }

  const label = String(raw).trim();
  return label.length ? label : 'Sin estatus';
};

const getEstatusVariant = (label) => {
  const n = normalizeText(label);
  if (n.includes('registr')) return 'registrado';
  if (n.includes('asign')) return 'asignado';
  if (n.includes('seguim') || n.includes('en seguimiento')) return 'en_seguimiento';
  if (n.includes('conclu') || n.includes('cerrad') || n.includes('final')) return 'concluido';
  return 'desconocido';
};

const getBadgeColors = (variant) => {
  if (variant === 'registrado') return { bg: '#DBEAFE', fg: '#1D4ED8' };
  if (variant === 'asignado') return { bg: '#FEF3C7', fg: '#B45309' };
  if (variant === 'en_seguimiento') return { bg: '#DCFCE7', fg: '#166534' };
  if (variant === 'concluido') return { bg: '#E5E7EB', fg: '#374151' };
  return { bg: '#E2E8F0', fg: '#0F172A' };
};

const getAreaLabel = (item) =>
  item?.nombreArea ?? item?.areaAsignada ?? item?.area?.nombre ?? item?.area?.nombreArea ?? item?.idArea ?? '';

const ActionButton = ({ children, onClick, disabled, tone = 'neutral', ariaLabel }) => {
  const [isHover, setIsHover] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const palette =
    tone === 'primary'
      ? {
          bg: '#1A2238',
          fg: '#FFFFFF',
          border: '#1A2238'
        }
      : tone === 'warning'
        ? {
            bg: '#F59E0B',
            fg: '#111827',
            border: '#D97706'
          }
        : {
            bg: '#FFFFFF',
            fg: '#111827',
            border: '#CBD5E1'
          };

  const style = {
    appearance: 'none',
    border: `1px solid ${palette.border}`,
    background: disabled ? '#F1F5F9' : palette.bg,
    color: disabled ? '#94A3B8' : palette.fg,
    padding: '8px 10px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 80ms ease, filter 120ms ease, box-shadow 120ms ease',
    transform: isHover && !disabled ? 'translateY(-1px)' : 'translateY(0)',
    filter: isHover && !disabled ? 'brightness(0.97)' : 'none',
    boxShadow: isFocus && !disabled ? '0 0 0 3px rgba(59, 130, 246, 0.45)' : 'none',
    outline: 'none'
  };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={style}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
    >
      {children}
    </button>
  );
};

export const TablaCorrespondencias = ({
  correspondencias = [],
  onVerDetalle,
  onIrAMemorandum,
  onSort,
  sortConfig
}) => {
  const rows = useMemo(() => asArray(correspondencias), [correspondencias]);

  const canVerDetalle = typeof onVerDetalle === 'function';
  const canIrAMemorandum = typeof onIrAMemorandum === 'function';

  const renderHeader = (label, key) => {
    if (!onSort) return label;
    const active = sortConfig?.key === key;
    const dir = active ? sortConfig?.direction : null;
    const indicator = dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : '';

    return (
      <button
        type="button"
        onClick={() => onSort(key)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          font: 'inherit',
          padding: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        {label}
        <span aria-hidden="true" style={{ fontSize: 10, opacity: active ? 1 : 0.4 }}>
          {indicator || '↕'}
        </span>
      </button>
    );
  };

  if (!rows.length) {
    return (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          padding: '2rem 1rem',
          color: '#475569',
          textAlign: 'center'
        }}
      >
        No hay correspondencias registradas.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          minWidth: 980,
          borderCollapse: 'collapse',
          background: '#FFFFFF',
          borderRadius: 10,
          overflow: 'hidden'
        }}
      >
        <thead>
          <tr style={{ background: '#1A2238', color: '#FFFFFF' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, letterSpacing: 0.2 }}>
              {renderHeader('Folio Único', 'folio')}
            </th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, letterSpacing: 0.2 }}>
              {renderHeader('Número de Oficio', 'numeroOficio')}
            </th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, letterSpacing: 0.2 }}>
              {renderHeader('Dependencia Remitente', 'dependencia')}
            </th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, letterSpacing: 0.2 }}>
              {renderHeader('Asunto', 'asunto')}
            </th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, letterSpacing: 0.2 }}>
              {renderHeader('Fecha Recibido', 'fechaRecibido')}
            </th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, letterSpacing: 0.2 }}>
              {renderHeader('Área Asignada', 'area')}
            </th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, letterSpacing: 0.2 }}>
              {renderHeader('Estatus', 'estatus')}
            </th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, letterSpacing: 0.2 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, idx) => {
            const id = getId(item);
            const folio = item?.folioUnico ?? item?.folio_unico ?? item?.folio ?? '';
            const oficio = item?.numeroOficio ?? item?.num_oficio_externo ?? item?.numOficioExterno ?? '';
            const remitente = item?.dependenciaRemitente ?? item?.dependencia_remitente ?? '';
            const asunto = item?.asunto ?? '';
            const fechaRecibido = safeDateLabel(item?.fechaRecibido ?? item?.fecha_recibido ?? '');
            const area = getAreaLabel(item);
            const estatusLabel = getEstatusLabel(item);
            const estatusVariant = getEstatusVariant(estatusLabel);
            const badge = getBadgeColors(estatusVariant);

            return (
              <tr
                key={id ?? `${idx}`}
                style={{
                  borderBottom: '1px solid #E2E8F0',
                  background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
                }}
              >
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#0F172A', whiteSpace: 'nowrap' }}>
                  {folio || '—'}
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#0F172A', whiteSpace: 'nowrap' }}>
                  {oficio || '—'}
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#0F172A' }}>{remitente || '—'}</td>
                <td
                  title={asunto || ''}
                  style={{
                    padding: '10px 12px',
                    fontSize: 13,
                    color: '#0F172A',
                    maxWidth: 320,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {asunto || '—'}
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#0F172A', whiteSpace: 'nowrap' }}>
                  {fechaRecibido || '—'}
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#0F172A' }}>{area || 'Sin asignar'}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#0F172A', whiteSpace: 'nowrap' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      background: badge.bg,
                      color: badge.fg
                    }}
                  >
                    {estatusLabel}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#0F172A' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <ActionButton
                      tone="neutral"
                      disabled={!canVerDetalle || !id}
                      onClick={() => onVerDetalle?.(id)}
                      ariaLabel="Ver detalle de la correspondencia"
                    >
                      Ver Detalle
                    </ActionButton>
                    {shouldMostrarGenerarMemorandum(item) ? (
                      <ActionButton
                        tone="warning"
                        disabled={!canIrAMemorandum || !id}
                        onClick={() => onIrAMemorandum?.(id)}
                        ariaLabel="Generar memorándum de la correspondencia"
                      >
                        Generar Memorándum
                      </ActionButton>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCorrespondencias;

