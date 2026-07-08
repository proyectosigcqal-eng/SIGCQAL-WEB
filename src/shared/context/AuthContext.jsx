import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY      = 'sigcqal_token';
const REFRESH_KEY    = 'sigcqal_refresh_token';
const SESSION_KEY    = 'sigcqal_session';
const ROL_ACTIVO_KEY = 'sigcqal_rol_activo';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';

export const AuthProvider = ({ children }) => {

    const [session, setSession] = useState(() => {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    });

    const [rolActivo, setRolActivo] = useState(() => {
        try {
            const raw = sessionStorage.getItem(ROL_ACTIVO_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    });

    // ── Login — guarda token + sesión y resetea rol ───────────────────────
    const login = useCallback((loginResponse) => {
        const { token, refreshToken, ...resto } = loginResponse;

        sessionStorage.setItem(TOKEN_KEY,   token);
        if (refreshToken) {
            sessionStorage.setItem(REFRESH_KEY, refreshToken);
        }
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(resto));

        setSession(resto);
        setRolActivo(null);
        sessionStorage.removeItem(ROL_ACTIVO_KEY);
    }, []);

    // ── Selección de rol — 2.8.4 ─────────────────────────────────────────
    const seleccionarRol = useCallback((rol) => {
        sessionStorage.setItem(ROL_ACTIVO_KEY, JSON.stringify(rol));
        setRolActivo(rol);
    }, []);

    // ── Logout — invalida sesión en back y limpia storage ─────────────────
    const logout = useCallback(async () => {
        const token = sessionStorage.getItem(TOKEN_KEY);
        if (token) {
            try {
                await fetch(`${API_BASE}/api/v1/auth/logout`, {
                    method:  'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch {
                // Si falla la red, continuamos cerrando sesión local
            }
        }
        sessionStorage.clear();
        setSession(null);
        setRolActivo(null);
    }, []);

    // ── Refresh token — renueva el access token ───────────────────────────
    const refreshSession = useCallback(async () => {
        const refreshToken = sessionStorage.getItem(REFRESH_KEY);
        if (!refreshToken) return false;

        try {
            const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ refreshToken }),
            });
            if (!res.ok) throw new Error('Refresh inválido');

            const data = await res.json();
            sessionStorage.setItem(TOKEN_KEY, data.token);
            if (data.refreshToken) {
                sessionStorage.setItem(REFRESH_KEY, data.refreshToken);
            }
            return true;
        } catch {
            // Refresh falló — cerrar sesión
            sessionStorage.clear();
            setSession(null);
            setRolActivo(null);
            return false;
        }
    }, []);

    // ── Getters ───────────────────────────────────────────────────────────
    const getToken = useCallback(() =>
        sessionStorage.getItem(TOKEN_KEY), []);

    const getRefreshToken = useCallback(() =>
        sessionStorage.getItem(REFRESH_KEY), []);

    const isAuthenticated = !!session;

    // ── 2.8.3 Guard de rutas ──────────────────────────────────────────────
    // Como urlBase está vacío en BD por ahora, si está vacío no bloquea.
    // Cuando se agregue url_base a la tabla roles, esto funcionará automáticamente.
    const tieneAccesoA = useCallback((pathname) => {
        if (!session?.roles?.length) return false;
        return session.roles.some(r =>
            !r.urlBase || r.urlBase === '' || pathname.startsWith(r.urlBase)
        );
    }, [session]);

    // ── 2.8.4 Helper para saber si debe mostrar pantalla de selección ─────
    const necesitaSeleccionarRol = useCallback(() => {
        return (session?.roles?.length ?? 0) > 1 && !rolActivo;
    }, [session, rolActivo]);

    return (
        <AuthContext.Provider value={{
            session,
            rolActivo,
            isAuthenticated,
            login,
            logout,
            seleccionarRol,
            refreshSession,
            getToken,
            getRefreshToken,
            tieneAccesoA,
            necesitaSeleccionarRol,
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