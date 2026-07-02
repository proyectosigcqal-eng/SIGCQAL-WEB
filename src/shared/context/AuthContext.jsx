import { createContext, useContext, useState, useCallback } from 'react';
import { normalizeLoginSession } from '@/shared/utils/sessionUtils';

const AuthContext = createContext(null);

const TOKEN_KEY   = 'sigcqal_token';
const SESSION_KEY = 'sigcqal_session';

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(() => {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    });

    const [rolActivo, setRolActivo] = useState(() => {
        try {
            const raw = sessionStorage.getItem('sigcqal_rol_activo');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    });

    const login = useCallback((loginResponse) => {
        const { token, ...resto } = loginResponse;
        const sessionNormalizada = normalizeLoginSession(resto);
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionNormalizada));
        setSession(sessionNormalizada);
        setRolActivo(null);
    }, []);

    const seleccionarRol = useCallback((rol) => {
        sessionStorage.setItem('sigcqal_rol_activo', JSON.stringify(rol));
        setRolActivo(rol);
    }, []);

    const logout = useCallback(() => {
        sessionStorage.clear();
        setSession(null);
        setRolActivo(null);
    }, []);

    const getToken = useCallback(() =>
        sessionStorage.getItem(TOKEN_KEY), []);

    const isAuthenticated = !!session;

    // ⚠️ tieneAccesoA depende de urlBase — que hoy siempre es "" porque
    // quitamos url_base del modelo. Mientras no exista esa columna en BD,
    // esta función siempre devuelve false para cualquier ruta.
    // Solución temporal: si urlBase está vacío, no bloquea acceso.
    const tieneAccesoA = useCallback((pathname) => {
        if (!session?.roles?.length) return false;
        return session.roles.some(r =>
            !r.urlBase || r.urlBase === '' || pathname.startsWith(r.urlBase)
        );
    }, [session]);

    return (
        <AuthContext.Provider value={{
            session, rolActivo, isAuthenticated,
            login, logout, seleccionarRol, getToken, tieneAccesoA,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return ctx;
};