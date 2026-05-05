import { FileText, FileEdit, List, LogOut, User } from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export const MainLayout = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    return (
        <div className="app-container">
            {/* Sidebar de tu HTML */}
            <aside className="sidebar">
                <div className="sidebar-logo"><h1>SIGCQAL</h1></div>
                <nav className="sidebar-nav">
                    <Link to="/correspondencia/registrar" className={`nav-item ${isActive('/correspondencia/registrar') ? 'active' : ''}`}>
                        <FileText /> <span>Registrar Correspondencia</span>
                    </Link>
                    <Link to="/correspondencia/registradas" className={`nav-item ${isActive('/correspondencia/registradas') ? 'active' : ''}`}>
                        <List /> <span>Correspondencia Registrada</span>
                    </Link>
                    <Link to="/correspondencia/nuevo-memorandum" className={`nav-item ${isActive('/correspondencia/nuevo-memorandum') ? 'active' : ''}`}>
                        <FileEdit /> <span>Memorándum</span>
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
