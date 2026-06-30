import React from 'react';
import { LoginForm } from '../../../features/auth/login/components/LoginForm';
import '../../../features/auth/login/styles/Login.css';

export const Login = () => {
    return (
        <div className="login-page">
            <div className="system-logo">SIGCQAL</div>
            <div className="login-container">
                <LoginForm />
            </div>
        </div>
    );
};