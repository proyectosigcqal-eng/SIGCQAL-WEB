// src/pages/auth/seleccion-rol/SeleccionRolPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { Shield } from 'lucide-react';

export const SeleccionRolPage = () => {
  const { session, seleccionarRol, logout } = useAuth();
  const navigate = useNavigate();

  const roles = session?.roles ?? [];

  const handleSeleccionar = (rol) => {
    seleccionarRol(rol);
    // Redirige a urlBase del rol seleccionado
    const destino = rol.urlBase && rol.urlBase !== ''
      ? rol.urlBase
      : '/correspondencia/bandeja';
    navigate(destino, { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f1f5f9',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '2.5rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: 480, width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f1b3d', margin: 0 }}>
            ¿Con qué rol deseas operar hoy?
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: 8 }}>
            Bienvenido, <strong>{session?.usuarioLogin}</strong>.
            Selecciona el contexto de trabajo para esta sesión.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {roles.map((rol) => (
            <button
              key={rol.idRol}
              onClick={() => handleSeleccionar(rol)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '1rem 1.25rem', borderRadius: 10,
                border: '1.5px solid #e2e8f0', background: '#f8fafc',
                cursor: 'pointer', transition: 'all 0.15s',
                textAlign: 'left', width: '100%',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1e3a8a';
                e.currentTarget.style.borderColor = '#1e3a8a';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#0f1b3d';
              }}
            >
              <Shield size={20} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {rol.nombreRol}
                </div>
                {rol.urlBase && (
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: 2 }}>
                    {rol.urlBase}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={logout}
          style={{
            marginTop: '1.5rem', width: '100%', padding: '0.6rem',
            background: 'none', border: 'none', color: '#9ca3af',
            fontSize: '0.8rem', cursor: 'pointer',
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};