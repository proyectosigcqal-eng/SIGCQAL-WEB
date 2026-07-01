import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
    const { isAuthenticated, session, rolActivo } = useAuth();
    const location = useLocation();

    // 1. No autenticado → login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Múltiples roles sin haber elegido uno → selección
    if (session?.roles?.length > 1 && !rolActivo) {
        return <Navigate to="/seleccion-rol" replace />;
    }

    // 3. Verificación de rol (si la ruta exige alguno)
    if (allowedRoles.length > 0) {
        const rolNombre = rolActivo?.nombreRol ?? session?.roles?.[0]?.nombreRol;
        if (!allowedRoles.includes(rolNombre)) {
            return <Navigate to="/acceso-restringido" state={{ from: location }} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;