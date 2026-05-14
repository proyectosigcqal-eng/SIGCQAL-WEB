// features/modulo-correspondencia/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../services/loginService';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Llamamos al servicio (actualmente simulado)
            await loginService(username, password);
            
            // Al ser exitoso, redirigimos a la ruta 
            navigate('/correspondencia/registrar');
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
                        placeholder="Usuario"
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
                        placeholder="Contraseña"
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