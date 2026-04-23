import { Mail, LogOut, User } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div className="app-container">
            {/* Sidebar de tu HTML */}
            <aside className="sidebar">
                <div className="sidebar-logo"><h1>SIGCQAL</h1></div>
                <nav className="sidebar-nav">
                    <Link to="/correspondencia" className="nav-item active">
                        <Mail /> <span>Correspondencia</span>
                    </Link>
                </nav>
                <div className="sidebar-footer">
                    <a href="#" className="nav-item logout">
                        <LogOut /> <span>Cerrar Sesión</span>
                    </a>
                </div>
            </aside>

            {/* Main Content de tu HTML */}
            <main className="main-content">
                <header className="header">
                    <div className="header-breadcrumb"><span>Memorándum</span></div>
                    <div className="header-user">
                        <div className="user-info">
                            <span className="user-name">Juan Pérez García</span>
                            <span className="user-role">Administrador</span>
                        </div>
                        <div className="user-avatar"><User /></div>
                    </div>
                </header>

                <div className="content-body">
                    {/* 💡 Aquí React Router inyectará tus páginas */}
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};