import { Mail, LogOut, User, FileText, CheckSquare, FolderCheck, Archive } from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export const MainLayout = () => {
    const { pathname } = useLocation();

    const navItems = [
        {
            label: 'Correspondencia pendiente de Revisión',
            to: '/correspondencia/pendiente-revision-area',
            icon: <Mail size={16} />
        },
          {
            label: 'Correspondencia Registrada',
            to: '/correspondencia/registradas',
            icon: <Archive size={16} />
        },
             {
            label: 'Correspondencia asignada',
            to: '/correspondencia/acuses-correspondencia',
            icon: <Archive size={16} />
        },
               {
            label: 'Registrar Correspondencia',
            to: '/correspondencia/registrar',
            icon: <Archive size={16} />
        },
        {
            label: 'Memorándum pendiente de Revisión',
            to: '/correspondencia/lista-memorandums-revision',
            icon: <FileText size={16} />
        },
        {
            label: 'Memorándum asignados',
            to: '/correspondencia/memorandums-por-area',
            icon: <CheckSquare size={16} />
        },
   
          {
            label: 'Contestación',
            to: '/correspondencia/bandeja',
            icon: <Archive size={16} />
        },
           
    ];

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-logo"><h1>SIGCQAL</h1></div>
                <nav className="sidebar-nav">
                    {navItems.map(({ label, to, icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`nav-item ${pathname === to ? 'active' : ''}`}
                        >
                            {icon} <span>{label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <a href="#" className="nav-item logout">
                        <LogOut size={16} /> <span>Cerrar Sesión</span>
                    </a>
                </div>
            </aside>

            <main className="main-content">
                <header className="header">
                    <div className="header-breadcrumb"><span>Memorándum</span></div>
                    <div className="header-user">
                        <div className="user-info">
                            <span className="user-name">Juan Pérez García</span>
                            <span className="user-role">Administrador</span>
                        </div>
                        <div className="user-avatar"><User size={18} /></div>
                    </div>
                </header>
                <div className="content-body">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};