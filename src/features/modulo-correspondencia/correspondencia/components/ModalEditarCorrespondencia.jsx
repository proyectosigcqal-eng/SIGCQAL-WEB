import React, { useState, useEffect } from 'react';
import API_BASE_URL from '@/shared/config/api';
import axios from 'axios';

/**
 * ModalEditarCorrespondencia
 * Props:
 *   isOpen     — boolean
 *   onClose    — () => void
 *   item       — objeto de la correspondencia a editar
 *   onSuccess  — (itemActualizado) => void  ← para refrescar la tabla sin recargar
 */
export const ModalEditarCorrespondencia = ({ isOpen, onClose, item, onSuccess }) => {
  const [numeroOficio, setNumeroOficio] = useState('');
  const [asunto, setAsunto]             = useState('');
  const [guardando, setGuardando]       = useState(false);
  const [error, setError]               = useState(null);

  // Precargar datos cuando abre el modal
  useEffect(() => {
    if (!isOpen || !item) return;
    setNumeroOficio(item?.numeroOficio ?? item?.num_oficio_externo ?? '');
    setAsunto(item?.asunto ?? '');
    setError(null);
  }, [isOpen, item]);

  const handleGuardar = async () => {
    if (!numeroOficio.trim()) {
      setError('El número de oficio es obligatorio.');
      return;
    }
    if (!asunto.trim()) {
      setError('El asunto es obligatorio.');
      return;
    }

    const id = item?.id ?? item?.idCorrespondencia;
    if (!id) {
      setError('No se pudo identificar la correspondencia.');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      const token = sessionStorage.getItem('sigcqal_token');
      const response = await axios.patch(
        `${API_BASE_URL}/correspondencias/entrada/${id}/editar`,
        { numeroOficio: numeroOficio.trim(), asunto: asunto.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess?.(response.data);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.detail
        || err?.response?.data?.message
        || 'Error al actualizar la correspondencia.';
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '28px 32px',
        width: '100%', maxWidth: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1A365D' }}>
            ✏️ Editar Correspondencia
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#718096' }}
          >
            ✖
          </button>
        </div>

        {/* Folio — solo lectura como referencia */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Folio Único</label>
          <input
            type="text"
            value={item?.folioUnico ?? item?.folio_unico ?? '—'}
            disabled
            style={{ ...inputStyle, background: '#F7FAFC', color: '#718096' }}
          />
        </div>

        {/* No. Oficio — editable */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>No. Oficio <span style={{ color: '#E53E3E' }}>*</span></label>
          <input
            type="text"
            value={numeroOficio}
            onChange={e => setNumeroOficio(e.target.value)}
            placeholder="Ej. SEFIN/001/2026"
            style={inputStyle}
            disabled={guardando}
          />
        </div>

        {/* Asunto — editable */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Asunto <span style={{ color: '#E53E3E' }}>*</span></label>
          <textarea
            value={asunto}
            onChange={e => setAsunto(e.target.value)}
            rows={3}
            placeholder="Descripción del asunto..."
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            disabled={guardando}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FFF5F5', border: '1px solid #FC8181',
            borderRadius: 6, padding: '8px 12px',
            color: '#C53030', fontSize: 13, marginBottom: 16,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={guardando}
            style={{
              padding: '8px 20px', borderRadius: 7, border: '1.5px solid #CBD5E0',
              background: '#fff', color: '#4A5568', cursor: 'pointer', fontWeight: 600,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando}
            style={{
              padding: '8px 24px', borderRadius: 7, border: 'none',
              background: '#1A365D', color: '#fff', cursor: 'pointer',
              fontWeight: 700, opacity: guardando ? 0.7 : 1,
            }}
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block', marginBottom: 5,
  fontSize: 12, fontWeight: 700,
  color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.05em',
};

const inputStyle = {
  width: '100%', padding: '8px 12px',
  border: '1px solid #CBD5E0', borderRadius: 7,
  fontSize: 14, color: '#2D3748',
  boxSizing: 'border-box', outline: 'none',
};

export default ModalEditarCorrespondencia;
