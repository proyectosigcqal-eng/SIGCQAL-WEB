import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function getUserRoleFromStorage() {
  try {
    // Common keys where an app might store the user object
    const candidateKeys = ['usuario', 'user', 'auth', 'currentUser', 'current_user'];
    for (const key of candidateKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        const possibles = [
          parsed?.role,
          parsed?.rol,
          parsed?.nombreRol,
          parsed?.roleName,
          parsed?.usuarioRol,
          parsed?.tipoUsuario,
        ];
        for (const p of possibles) if (p) return p;
      } catch {
        // raw might be a plain role string
        if (raw) return raw;
      }
    }

    // fallback to explicit stored role keys
    const extra = localStorage.getItem('userRole') || localStorage.getItem('role') || localStorage.getItem('rol');
    if (extra) {
      try { return JSON.parse(extra); } catch { return extra; }
    }
  } catch (err) {
    // ignore
  }
  return null;
}

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const location = useLocation();
  const userRole = getUserRoleFromStorage();

  // Not authenticated -> redirect to login
  if (!userRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allowed role -> render children
  if (!allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
    return children;
  }

  // Authenticated but not authorized -> acceso restringido
  return <Navigate to="/acceso-restringido" state={{ from: location }} replace />;
};

export default ProtectedRoute;
