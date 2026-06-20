import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useGestionAsesores } from '@/features/modulo-area-sustantiva/admin/hooks/useGestionAsesores';
import { TablaAsesores }      from '@/features/modulo-area-sustantiva/admin/components/TablaAsesores';
import { ModalAsesor }        from '@/features/modulo-area-sustantiva/admin/components/ModalAsesor';
import { Search }             from 'lucide-react';
import '@/features/modulo-area-sustantiva/admin/styles/gestion-admin.css';

export const GestionAsesoresPage = () => {
  const {
    asesores, cargando, error,
    busqueda, setBusqueda,
    crearAsesor, actualizarAsesor, darBaja,
  } = useGestionAsesores();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [asesorEditar, setAsesorEditar] = useState(null);
  const [confirmBaja,  setConfirmBaja]  = useState(null);
  const [errorBaja,    setErrorBaja]    = useState(null);

  const handleGuardar = async (form, id) => {
    if (id) await actualizarAsesor(id, form);
    else    await crearAsesor(form);
  };

  const handleBaja = async () => {
    if (!confirmBaja) return;
    setErrorBaja(null);
    try {
      await darBaja(confirmBaja.idAsesor);
      setConfirmBaja(null);
    } catch (e) {
      setErrorBaja(e.message);
    }
  };

  return (
    <div className="gadmin-page">

      {/* ── Encabezado ── */}
      <div className="gadmin-header">
        <div>
          <h1 className="gadmin-title">Gestión de Asesores</h1>
          <p className="gadmin-subtitle">
            Alta, baja y modificación de asesores jurídicos del sistema.
          </p>
        </div>
        <div className="gadmin-actions">
          <button
            className="gadmin-btn gadmin-btn--alta"
            onClick={() => { setAsesorEditar(null); setModalAbierto(true); }}
          >
            <UserPlus size={16} /> Alta de Asesor
          </button>
        </div>
      </div>

      {/* ── Tabla ── */}
      <div className="gadmin-card">
        <div style={{ padding: '1rem 1rem 0' }}>
          <div className="gadmin-search-wrap">
            <Search className="gadmin-search-icon" size={15} />
            <input
              className="gadmin-search"
              placeholder="Buscar por nombre o especialidad..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="gadmin-alert-error" style={{ margin: '0 1rem 1rem' }}>
            {error}
          </div>
        )}

        <TablaAsesores
          asesores={asesores}
          cargando={cargando}
          onEditar={(a) => { setAsesorEditar(a); setModalAbierto(true); }}
          onBaja={(a) => { setErrorBaja(null); setConfirmBaja(a); }}
        />
      </div>

      {/* ── Modal alta / modificación ── */}
      <ModalAsesor
        abierto={modalAbierto}
        asesor={asesorEditar}
        onCerrar={() => { setModalAbierto(false); setAsesorEditar(null); }}
        onGuardar={handleGuardar}
      />

      {/* ── Confirmación de baja ── */}
      {confirmBaja && (
        <div className="gadmin-overlay">
          <div className="gadmin-modal" style={{ maxWidth: 400 }}>
            <div className="gadmin-modal-header">
              <h2 className="gadmin-modal-title">Confirmar Baja</h2>
              <button
                className="gadmin-modal-close"
                onClick={() => { setConfirmBaja(null); setErrorBaja(null); }}
              >
                ×
              </button>
            </div>
            <div className="gadmin-modal-body">
              {errorBaja && (
                <div className="gadmin-alert-error">{errorBaja}</div>
              )}
              <p style={{ margin: 0, fontSize: '.9rem', color: '#374151' }}>
                ¿Deseas dar de baja al asesor{' '}
                <strong>{confirmBaja.nombreCompleto}</strong>?
                El registro se conservará pero quedará inactivo y no recibirá
                nuevas asignaciones.
              </p>
            </div>
            <div className="gadmin-modal-footer">
              <button
                className="gadmin-btn gadmin-btn--neutral"
                onClick={() => { setConfirmBaja(null); setErrorBaja(null); }}
              >
                Cancelar
              </button>
              <button
                className="gadmin-btn gadmin-btn--baja"
                onClick={handleBaja}
              >
                Confirmar Baja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};