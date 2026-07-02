import React, { useState } from 'react';
import { usePersonal } from '../../../features/modulo-correspondencia/personal/hooks/usePersonal';
import FormPersonal from '../../../features/modulo-correspondencia/personal/components/PersonalForm';
import { Search, UserPlus } from 'lucide-react'; // Asegúrate de tener lucide-react instalado
import '../../../features/modulo-area-sustantiva/admin/styles/gestion-admin.css'; // Importamos el estilo del jefe
import { Pencil, Trash2 } from 'lucide-react';

const PersonalPage = () => {
    const { personalList, handleDelete, handleSave, getPersonalDetail } = usePersonal();
    
    // Estados para el Modal
    const [modalAbierto, setModalAbierto] = useState(false);
    const [personalEditar, setPersonalEditar] = useState(null);

    const handleEdit = async (p) => {
        const fullData = await getPersonalDetail(p.idPersonal);
        if (fullData) {
            setPersonalEditar(fullData);
            setModalAbierto(true);
        }
    };

    const handleGuardar = async (form) => {
        await handleSave(form);
        setModalAbierto(false);
        setPersonalEditar(null);
    };

    return (
        <div className="gadmin-page">
            {/* Encabezado */}
            <div className="gadmin-header">
                <div>
                    <h1 className="gadmin-title">Gestión de Personal</h1>
                    <p className="gadmin-subtitle">Administración y control de registros de personal.</p>
                </div>
                <div className="gadmin-actions">
                    <button className="gadmin-btn gadmin-btn--alta" onClick={() => setModalAbierto(true)}>
                        <UserPlus size={16} /> Registrar Personal
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <div className="gadmin-card">
                <div className="gadmin-table-wrap">
                    <table className="gadmin-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>CURP</th>
                                <th>Estatus</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personalList.map(p => (
                                <tr key={p.idPersonal}>
                                    <td>{p.nombreCompleto}</td>
                                    <td>{p.curp}</td>
                                    <td>
                                        <span className={`gadmin-badge ${p.activo ? 'gadmin-badge--activo' : 'gadmin-badge--inactivo'}`}>
                                            {p.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="gadmin-row-actions">
                                        <button className="gadmin-icon-btn" onClick={() => handleEdit(p)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="gadmin-icon-btn gadmin-icon-btn--danger" onClick={() => handleDelete(p.idPersonal)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Adaptado al diseño del jefe */}
            {modalAbierto && (
                <div className="gadmin-overlay">
                    <div className="gadmin-modal">
                        <div className="gadmin-modal-header">
                            <h2 className="gadmin-modal-title">{personalEditar ? 'Editar Personal' : 'Nuevo Registro'}</h2>
                            <button className="gadmin-modal-close" onClick={() => { setModalAbierto(false); setPersonalEditar(null); }}>×</button>
                        </div>
                        <div className="gadmin-modal-body">
                            <FormPersonal 
                                onSave={handleGuardar}
                                onCancel={() => { setModalAbierto(false); setPersonalEditar(null); }}
                                personalData={personalEditar}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default PersonalPage;