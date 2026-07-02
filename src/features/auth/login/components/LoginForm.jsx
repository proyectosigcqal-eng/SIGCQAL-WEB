import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alerta, setAlerta]     = useState(null);
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();
    const auth     = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setAlerta({
                type: 'warning',
                message: 'Ingresa tu usuario y contraseña para continuar.'
            });
            return;
        }

        setCargando(true);
        setAlerta(null);

        try {
            const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ usuarioLogin: username, password }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail ?? 'Credenciales incorrectas.');
            }

            const data = await res.json();

            auth.login(data);
            setAlerta({ type: 'success', message: 'Inicio de sesión correcto. Redirigiendo...' });

            const roles = data.roles ?? [];
            if (roles.length === 0) {
                navigate('/correspondencia/bandeja', { replace: true });
            } else if (roles.length === 1) {
                auth.seleccionarRol(roles[0]);
                const destino = roles[0].urlBase || '/correspondencia/bandeja';
                navigate(destino, { replace: true });
            } else {
                navigate('/seleccion-rol', { replace: true });
            }

        } catch (err) {
            setAlerta({ type: 'error', message: err.message || 'No se pudo iniciar sesión.' });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-form-container">
            <h1 className="login-title">Bienvenido de nuevo</h1>
            <p className="login-subtitle">Ingresa tus credenciales</p>

            {alerta && (
                <div className={`login-alert login-alert-${alerta.type}`} role="alert" aria-live="polite">
                    <span className="login-alert-icon">
                        {alerta.type === 'success' ? '✓' : alerta.type === 'warning' ? '⚠' : '✕'}
                    </span>
                    <span>{alerta.message}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                    <label htmlFor="username">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Usuario"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <div className="label-row">
                        <label htmlFor="password">Contraseña</label>
                        <a href="#forgot" className="forgot-password">¿Olvidó su contraseña?</a>
                    </div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="login-button" disabled={cargando}>
                    {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
            </form>
        </div>
    );
};