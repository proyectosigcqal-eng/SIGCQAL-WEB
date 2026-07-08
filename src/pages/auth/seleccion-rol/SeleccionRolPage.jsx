// src/pages/auth/SeleccionRolPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';

export const SeleccionRolPage = () => {
  const { session, seleccionarRol } = useAuth();
  const navigate = useNavigate();

  const handleSeleccionar = (rol) => {
    seleccionarRol(rol);
    navigate(rol.urlBase || '/');
  };

  // Si solo hay un rol, redirigir automáticamente
  if (session?.roles?.length === 1) {
    handleSeleccionar(session.roles[0]);
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f1f5f9',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '2rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)', maxWidth: 420, width: '100%',
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1b3d', marginBottom: '0.5rem' }}>
          ¿Con qué rol deseas operar hoy?
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>
          Selecciona el perfil con el que accederás al sistema.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {session?.roles?.map((rol) => (
            <button
              key={rol.idRol ?? rol.id ?? rol.nombre}
              onClick={() => handleSeleccionar(rol)}
              style={{
                padding: '0.9rem 1.25rem', background: '#1e3a8a',
                color: '#fff', border: 'none', borderRadius: 8,
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                textAlign: 'left', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
              onMouseLeave={e => e.currentTarget.style.background = '#1e3a8a'}
            >
              {rol.nombreRol ?? rol.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};