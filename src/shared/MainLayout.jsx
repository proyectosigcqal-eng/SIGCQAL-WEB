import { Mail, LogOut, User, FileText, CheckSquare, FolderCheck, Archive, ChevronDown, Users, Shield, Briefcase } from 'lucide-react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import '../styles/MainLayout.css'

export const MainLayout = () => {
    const { pathname } = useLocation();
    const navigate      = useNavigate();
    const { session, rolActivo, logout } = useAuth();

    const [adminOpen,           setAdminOpen]         = useState(pathname.startsWith('/admin'));
    const [correspondenciaOpen, setCorrespondenciaOpen] = useState(pathname.startsWith('/correspondencia'));
    const [sustantivaOpen,      setSustantivaOpen]    = useState(
        pathname.startsWith('/atencion-juridica') || pathname.startsWith('/area-sustantiva')
    );

    const nombreRolActivo = rolActivo?.nombreRol ?? session?.roles?.[0]?.nombreRol ?? '';

    // ── Definición completa de los 4 módulos con sus roles permitidos ──
    const MODULOS = {
        gestionUsuarios: {
            label: 'Gestión de Usuarios',
            icon: <Users size={20} />,
            roles: ['Administrador'],
            items: [
                { label: 'Usuarios del Sistema', to: '/admin/usuarios', icon: <User size={18} /> },
            ],
        },
        gestionEmpleados: {
            label: 'Gestión de Empleados',
            icon: <Briefcase size={20} />,
            roles: ['Administrador'],
            items: [
                { label: 'Gestión de Empleados', to: '/correspondencia/personal', icon: <User size={18} /> },
            ],
        },
        correspondencia: {
            label: 'Correspondencia',
            icon: <FileText size={20} />,
            roles: ['Administrador', 'Administrador Correspondencia', 'Gestor de Correspondencia'],
            items: [
                { label: 'Registrar Correspondencia',              to: '/correspondencia/registrar',                 icon: <Archive size={18} />,    roles: ['Administrador', 'Administrador Correspondencia'] },
                { label: 'Correspondencia Registrada',             to: '/correspondencia/registradas',               icon: <Archive size={18} />,    roles: ['Administrador', 'Administrador Correspondencia'] },
                { label: 'Pendiente de Revisión',                  to: '/correspondencia/pendiente-revision-area',   icon: <Mail size={18} />,       roles: ['Administrador', 'Gestor de Correspondencia'] },
                { label: 'Correspondencia Asignada',               to: '/correspondencia/acuses-correspondencia',    icon: <Archive size={18} />,    roles: ['Administrador', 'Gestor de Correspondencia'] },
                { label: 'Memorándums Pendientes',                 to: '/correspondencia/lista-memorandums-revision',icon: <FileText size={18} />,   roles: ['Administrador', 'Gestor de Correspondencia'] },
                { label: 'Memorándums Asignados',                  to: '/correspondencia/memorandums-por-area',      icon: <CheckSquare size={18} />,roles: ['Administrador', 'Gestor de Correspondencia'] },
                { label: 'Acuses de Oficio por Área',              to: '/correspondencia/oficios-por-area',          icon: <FolderCheck size={18} />,roles: ['Administrador', 'Gestor de Correspondencia'] },
                { label: 'Contestación de Bandeja',                to: '/correspondencia/bandeja',                   icon: <Archive size={18} />,    roles: ['Administrador', 'Administrador Correspondencia', 'Gestor de Correspondencia'] },
            ],
        },
        sustantiva: {
            label: 'Área Sustantiva',
            icon: <CheckSquare size={20} />,
            roles: ['Administrador', 'Asesor'],
            items: [
                { label: 'Registro de Expedientes', to: '/area-sustantiva/busqueda-contribuyente', icon: <FolderCheck size={18} /> },
                { label: 'Registro y Calificación',  to: '/atencion-juridica/clasificacion',     icon: <CheckSquare size={18} /> },
                { label: 'Gestión de Quejas',        to: '/atencion-juridica/bandeja',           icon: <Archive size={18} /> },
                { label: 'Seguimiento de Queja',     to: '/atencion-juridica/bandeja-tramites-irl', icon: <Archive size={18} /> },
                { label: 'Asignación de Casos',      to: '/atencion-juridica/asignacion',        icon: <FolderCheck size={18} /> },
            ],
        },
    };

    // ── Filtra módulos e items según el rol activo ──
    const tieneAcceso = (rolesPermitidos) =>
        !rolesPermitidos || rolesPermitidos.includes(nombreRolActivo);

    const modulosVisibles = Object.entries(MODULOS).filter(([, mod]) =>
        tieneAcceso(mod.roles)
    );

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const breadcrumb = pathname.startsWith('/atencion-juridica') || pathname.startsWith('/area-sustantiva')
        ? 'Área Sustantiva'
        : pathname.startsWith('/admin')
        ? 'Administración'
        : 'Módulo de Correspondencia';

    const toggles = {
        gestionUsuarios:  [adminOpen,           setAdminOpen],
        gestionEmpleados: [adminOpen,           setAdminOpen],
        correspondencia:  [correspondenciaOpen, setCorrespondenciaOpen],
        sustantiva:       [sustantivaOpen,      setSustantivaOpen],
    };

    return (
        <div className="app-layout">
            {/* MENÚ LATERAL */}
            <aside className="app-sidebar">
                <div className="sidebar-brand">
                    <h2>SIGCQAL</h2>
                </div>
                
                <nav className="sidebar-menu" aria-label="Navegación principal">
                    {modulosVisibles.map(([key, mod]) => {
                        const [isOpen, setIsOpen] = toggles[key];
                        const itemsVisibles = mod.items.filter(item =>
                            tieneAcceso(item.roles)
                        );

                        if (itemsVisibles.length === 0) return null;

                        const isModuleActive = pathname.startsWith(itemsVisibles[0]?.to?.split('/').slice(0, 2).join('/'));

                        return (
                            <div key={key} className="menu-group">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    aria-expanded={isOpen}
                                    className={`menu-parent-btn ${isModuleActive ? 'active-parent' : ''}`}
                                >
                                    <div className="menu-parent-content">
                                        <span className="menu-icon">{mod.icon}</span>
                                        <span className="menu-text">{mod.label}</span>
                                    </div>
                                    <ChevronDown 
                                        className={`menu-chevron ${isOpen ? 'rotate' : ''}`} 
                                        size={18} 
                                    />
                                </button>

                                <div className={`menu-children-container ${isOpen ? 'open' : ''}`}>
                                    {itemsVisibles.map(({ label, to, icon }) => {
                                        const isItemActive = pathname === to;
                                        return (
                                            <Link
                                                key={to}
                                                to={to}
                                                aria-current={isItemActive ? 'page' : undefined}
                                                className={`menu-child-link ${isItemActive ? 'active-child' : ''}`}
                                            >
                                                <span className="child-icon">{icon}</span>
                                                <span className="child-text">{label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button 
                        type="button" 
                        onClick={handleLogout} 
                        className="logout-button"
                    >
                        <LogOut size={20} /> 
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="app-main">
                <header className="app-header">
                    <div className="header-breadcrumb">
                        <span>{breadcrumb}</span>
                    </div>
                    
                    <div className="header-profile">
                        <div className="profile-text">
                            <span className="profile-name">{session?.usuarioLogin ?? 'Usuario'}</span>
                            <span className="profile-role">{nombreRolActivo}</span>
                        </div>
                        <div className="profile-avatar">
                            <User size={22} color="#ffffff" />
                        </div>
                    </div>
                </header>
                
                <div className="app-content-scroll">
                    <div className="app-content-wrapper">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};