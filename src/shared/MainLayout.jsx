import { Mail, LogOut, User, FileText, CheckSquare, FolderCheck, Archive, ChevronDown } from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export const MainLayout = () => {
    const { pathname } = useLocation();

    const [moduleOpen, setModuleOpen] = useState(pathname.startsWith('/correspondencia'));
    const [juridicoOpen, setJuridicoOpen] = useState(pathname.startsWith('/atencion-juridica'));

    const subItems = [
        { label: 'Correspondencia pendiente de Revisión', to: '/correspondencia/pendiente-revision-area', icon: <Mail size={16} /> },
        { label: 'Correspondencia Registrada', to: '/correspondencia/registradas', icon: <Archive size={16} /> },
        { label: 'Correspondencia asignada', to: '/correspondencia/acuses-correspondencia', icon: <Archive size={16} /> },
        { label: 'Registrar Correspondencia', to: '/correspondencia/registrar', icon: <Archive size={16} /> },
        { label: 'Memorándum pendiente de Revisión', to: '/correspondencia/lista-memorandums-revision', icon: <FileText size={16} /> },
        { label: 'Memorándum asignados', to: '/correspondencia/memorandums-por-area', icon: <CheckSquare size={16} /> },
        { label: 'Acuses de Oficio por Área', to: '/correspondencia/oficios-por-area', icon: <FolderCheck size={16} /> },
        { label: 'Contestación', to: '/correspondencia/bandeja', icon: <Archive size={16} /> },
        
    ];

    const juridicoItems = [
        { label: 'Registro de Expedientes', to: '/area-sustantiva/registro-expediente', icon: <FolderCheck size={16} /> },
        { label: 'Calificación', to: '/atencion-juridica/clasificacion/260100001', icon: <CheckSquare size={16} /> },
        { label: 'Bandeja de Gestión ', to: '/atencion-juridica/bandeja', icon: <Archive size={16} /> },
    
    ];

    const breadcrumb = pathname.startsWith('/atencion-juridica') ? 'Atención Jurídica' : 'Memorándum';

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-logo"><h1>SIGCQAL</h1></div>
                <nav className="sidebar-nav">
                    <div className="module-header-wrap">
                        <button
                            onClick={() => setModuleOpen(!moduleOpen)}
                            aria-expanded={moduleOpen}
                            className={`module-header ${pathname.startsWith('/correspondencia') ? 'active' : ''}`}
                        >
                            <FileText size={18} />
                            <strong className="module-title">Módulo Correspondencia</strong>
                            <span className="chevron-wrap">
                                <ChevronDown className="chevron" size={16} />
                            </span>
                        </button>
                    </div>

                    {moduleOpen && (
                        <div className="module-items">
                            {subItems.map(({ label, to, icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`nav-item sub-item ${pathname === to ? 'active' : ''}`}
                                >
                                    {icon} <span>{label}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="module-header-wrap">
                        <button
                            onClick={() => setJuridicoOpen(!juridicoOpen)}
                            aria-expanded={juridicoOpen}
                            className={`module-header ${pathname.startsWith('/atencion-juridica') ? 'active' : ''}`}
                        >
                            <CheckSquare size={18} />
                            <strong className="module-title">Atención Jurídica</strong>
                            <span className="chevron-wrap">
                                <ChevronDown className="chevron" size={16} />
                            </span>
                        </button>
                    </div>

                    {juridicoOpen && (
                        <div className="module-items">
                            {juridicoItems.map(({ label, to, icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`nav-item sub-item ${pathname === to ? 'active' : ''}`}
                                >
                                    {icon} <span>{label}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </nav>
                <div className="sidebar-footer">
                    <a href="#" className="nav-item logout">
                        <LogOut size={16} /> <span>Cerrar Sesión</span>
                    </a>
                </div>
            </aside>

            <main className="main-content">
                <header className="header">
                    <div className="header-breadcrumb"><span>{breadcrumb}</span></div>
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
