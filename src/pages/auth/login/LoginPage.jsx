import React from 'react';
import { LoginForm } from '../../../features/auth/login/components/LoginForm';
import '../../../features/auth/login/styles/Login.css';

export const Login = () => {
    return (
        <div className="login-page">
            {/* Nombre del sistema en la parte superior izquierda */}
            <div className="system-logo">SIGCQAL</div>
            
            <div className="login-left">
                <LoginForm />
            </div>
            <div className="login-right">
                {/* Espacio reservado para la imagen de fondo */}
            </div>
        </div>
    );
};