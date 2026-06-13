import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { usePlazosAutoridad } from '../hooks/usePlazosAutoridad';
import '@/features/modulo-correspondencia/bandeja-central/styles/detalleBandejaModal.css';

export const RegistroInformeAutoridadModal = ({ expedienteId, onClose, onSuccess }) => {
  const hoy = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ numeroOficioRespuesta: '', fojas: '', fechaRecepcion: hoy });
  const [pdf, setPdf] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const { registrarInforme, error } = usePlazosAutoridad(expedienteId);

  useEffect(() => {
    setForm({ numeroOficioRespuesta: '', fojas: '', fechaRecepcion: hoy });
    setPdf(null);
  }, [expedienteId, hoy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expedienteId) return;

    setEnviando(true);
    try {
      await registrarInforme(form, pdf);
      onSuccess?.();
      onClose?.();
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box" style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Registrar Informe de Autoridad</h3>
            <span className="modal-tipo">Recepción de oficio respuesta, fojas y PDF firmado</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} type="button" aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'grid', gap: 14 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568' }}>Oficio respuesta *</label>
            <input
              type="text"
              required
              value={form.numeroOficioRespuesta}
              onChange={(e) => setForm((prev) => ({ ...prev, numeroOficioRespuesta: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568' }}>Fojas *</label>
            <input
              type="number"
              required
              min="1"
              value={form.fojas}
              onChange={(e) => setForm((prev) => ({ ...prev, fojas: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568' }}>Fecha de recepción *</label>
            <input
              type="date"
              required
              value={form.fechaRecepcion}
              onChange={(e) => setForm((prev) => ({ ...prev, fechaRecepcion: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: 6 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568' }}>PDF firmado *</label>
            <input
              type="file"
              accept=".pdf"
              required
              onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '10px 12px',
                borderRadius: 8,
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button className="btn-cancelar" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-concluir" type="submit" disabled={enviando || !expedienteId}>
              {enviando ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

