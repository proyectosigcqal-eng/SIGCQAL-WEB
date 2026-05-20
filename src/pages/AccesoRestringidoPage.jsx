import React from 'react';
import { useNavigate } from 'react-router-dom';

function getUserRoleFromStorage() {
  try {
    const raw = localStorage.getItem('user') || localStorage.getItem('usuario');
    if (raw) {
      try { const p = JSON.parse(raw); return p?.role || p?.rol || null; } catch { return raw; }
    }
    return localStorage.getItem('userRole') || localStorage.getItem('role') || localStorage.getItem('rol');
  } catch { return null; }
}

const DEFAULT_HOME = {
  Administrador: '/correspondencia/bandeja',
  Revisor: '/correspondencia/bandeja',
  Capturista: '/correspondencia/registrar',
};

const AccesoRestringidoPage = () => {
  const navigate = useNavigate();
  const role = getUserRoleFromStorage();
  const home = DEFAULT_HOME[role] || '/';

  return (
    <div className="sigcqal-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ maxWidth: 680, textAlign: 'center' }}>
        <h1 style={{ color: 'var(--guinda)', marginBottom: '0.5rem' }}>Acceso Restringido</h1>
        <p style={{ color: 'var(--muted-3)', marginBottom: '1.25rem' }}>
          No tienes permisos suficientes para acceder a este recurso. Si crees que esto es un error, contacta al administrador.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn-secundario" onClick={() => navigate(-1)}>Volver</button>
          <button className="btn-primario" onClick={() => navigate(home)}>Ir a inicio</button>
        </div>
      </div>
    </div>
  );
};

export default AccesoRestringidoPage;
