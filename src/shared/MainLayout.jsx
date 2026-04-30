import { FileEdit, FileText, LogOut, User } from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export const MainLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>SIGCQAL</h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/correspondencia/registrar" className={`nav-item ${isActive('/correspondencia/registrar') ? 'active' : ''}`}>
            <FileText /> <span>Registrar Entrada</span>
          </Link>
          <Link
            to="/correspondencia/nuevo-memorandum"
            className={`nav-item ${isActive('/correspondencia/nuevo-memorandum') ? 'active' : ''}`}
          >
            <FileEdit /> <span>Memorándum</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <a href="#" className="nav-item logout">
            <LogOut /> <span>Cerrar Sesión</span>
          </a>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-breadcrumb">
            <span>{location.pathname.startsWith('/correspondencia/registrar') ? 'Correspondencia' : 'Memorándum'}</span>
          </div>
          <div className="header-user">
            <div className="user-info">
              <span className="user-name">Juan Pérez García</span>
              <span className="user-role">Administrador</span>
            </div>
            <div className="user-avatar">
              <User />
            </div>
          </div>
        </header>

        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
