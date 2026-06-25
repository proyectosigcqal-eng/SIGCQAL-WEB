import { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { useGestionUsuarios } from '@/features/modulo-area-sustantiva/admin/hooks/useGestionUsuarios';
import { TablaUsuarios }      from '@/features/modulo-area-sustantiva/admin/components/TablaUsuarios';
import { ModalUsuario }       from '@/features/modulo-area-sustantiva/admin/components/ModalUsuario';
import { ModalRoles }         from '@/features/modulo-area-sustantiva/admin/components/ModalRoles';
import '@/features/modulo-area-sustantiva/admin/styles/gestion-admin.css';

export const GestionUsuariosPage = () => {
  const {
    usuarios, roles, areas, cargando, error,
    busqueda, setBusqueda,
    crearUsuario, actualizarRoles, darBaja,
  } = useGestionUsuarios();

  const [modalUsuario, setModalUsuario] = useState(false);
  const [modalRoles,   setModalRoles]   = useState(false);
  const [usuarioRoles, setUsuarioRoles] = useState(null);
  const [confirmBaja,  setConfirmBaja]  = useState(null);
  const [errorBaja,    setErrorBaja]    = useState(null);

  const handleBaja = async () => {
    if (!confirmBaja) return;
    setErrorBaja(null);
    try {
      await darBaja(confirmBaja.id);
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
          <h1 className="gadmin-title">Gestión de Usuarios</h1>
          <p className="gadmin-subtitle">
            Administración de accesos, perfiles y roles del sistema.
          </p>
        </div>
        <div className="gadmin-actions">
          <button
            className="gadmin-btn gadmin-btn--alta"
            onClick={() => setModalUsuario(true)}
          >
            <UserPlus size={16} /> Alta de Usuario
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
              placeholder="Buscar por usuario o área..."
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

        <TablaUsuarios
          usuarios={usuarios}
          roles={roles}
          cargando={cargando}
          onRoles={(u) => { setUsuarioRoles(u); setModalRoles(true); }}
          onBaja={(u)  => { setErrorBaja(null); setConfirmBaja(u); }}
        />
      </div>

      {/* ── Modal alta usuario ── */}
      <ModalUsuario
        abierto={modalUsuario}
        onCerrar={() => setModalUsuario(false)}
        onGuardar={crearUsuario}
        areas={areas} 
      />

      {/* ── Modal roles ── */}
      <ModalRoles
        abierto={modalRoles}
        usuario={usuarioRoles}
        roles={roles}
        onCerrar={() => { setModalRoles(false); setUsuarioRoles(null); }}
        onGuardar={actualizarRoles}
        
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
                ¿Deseas dar de baja al usuario{' '}
                <strong>{confirmBaja.usuarioLogin}</strong>?
                Perderá acceso al sistema de forma inmediata.
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