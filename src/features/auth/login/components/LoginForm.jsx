// features/modulo-correspondencia/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginService } from '../services/loginService';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Llamamos al servicio (actualmente simulado) y guardamos el resultado
            const result = await loginService(username, password);
            
            // Al ser exitoso, guardamos un usuario simulado en localStorage
            // (en producción el backend debe devolver el rol de usuario)
            const role = (() => {
                const u = (username || '').toLowerCase();
                if (u.includes('admin')) return 'Administrador';
                if (u.includes('rev') || u.includes('revisor')) return 'Revisor';
                if (u.includes('capt') || u.includes('capturista')) return 'Capturista';
                return 'Capturista';
            })();
            const userObj = { username, role, token: (result && result.token) || null };
            localStorage.setItem('user', JSON.stringify(userObj));

            // Si venimos de una ruta protegida, redirigir ahí; si no, al /registrar
            const from = location.state?.from?.pathname || '/correspondencia/registrar';
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Error al iniciar sesión", error);
        }
    };

    return (
        <div className="login-form-container">
            <h1 className="login-title">Bienvenido de nuevo</h1>
            <p className="login-subtitle">Ingresa tus credenciales</p>

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
                        <a href="#forgot" className="forgot-password">¿Olvido su contraseña?</a>
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

                <button type="submit" className="login-button">Iniciar sesion</button>
            </form>
        </div>
    );
};
