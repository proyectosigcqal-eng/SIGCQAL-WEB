import React, { useState } from 'react';
import { SearchBar } from '../../../features/modulo-correspondencia/personal/components/SearchBar';
import { PersonalTable } from '../../../features/modulo-correspondencia/personal/components/PersonalTable';
import { usePersonal } from '../../../features/modulo-correspondencia/personal/hooks/usePersonal';
import FormPersonal from '../../../features/modulo-correspondencia/personal/components/PersonalForm';
import styles from '../../../features/modulo-correspondencia/personal/styles/personal.module.css';


const PersonalPage = () => {
    const { personalList, handleDelete, handleSave, fetchPersonal, getPersonalDetail} = usePersonal();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [personalToEdit, setPersonalToEdit] = useState(null);

    const handleEdit = async (p) => {
    // 1. Llamamos a la API para traer el registro completo
    const fullData = await getPersonalDetail(p.idPersonal);
    
        // 2. Si recibimos datos, los pasamos al formulario
        if (fullData) {
            setPersonalToEdit(fullData); 
            setIsFormOpen(true);
        }
    };
    
    const handleSaveAndClose = async (data) => {
        await handleSave(data);
        setIsFormOpen(false); // Cierra el form tras guardar
        setPersonalToEdit(null); // Limpiamos después de guardar
    };

    

   return (
        <div className="bandeja-wrapper">
            <div className="bandeja-header">
                <h1 className="bandeja-title">Gestión de Personal</h1>
                <p className="bandeja-subtitle">Administración y control de registros de personal</p>
            </div>

            <div className="bandeja-card">
                {/* Aquí podrías agregar un SearchBar si quieres usar el formato de pestañas */}
                <div className="bandeja-content">
                    {/* 3. Botón para abrir el formulario */}
                    
                    {!isFormOpen && (
                        <button 
                            className="btn-atender" 
                            style={{ marginBottom: '1rem' }} 
                            onClick={() => setIsFormOpen(true)}
                        >
                            + Registrar Personal
                        </button>
                    )}
                    
                    {/* 4. Renderizado condicional */}
                    {isFormOpen ? (
                        <FormPersonal 
                            onSave={handleSaveAndClose}
                            onCancel={() => {
                                setIsFormOpen(false);
                                setPersonalToEdit(null);
                            }}
                            personalData={personalToEdit} // Pasamos los datos al form
                        />
                    ) : (
                    <table className="bandeja-table">
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
                                    <td className="folio-cell">{p.nombreCompleto}</td>
                                    <td>{p.curp}</td>
                                    <td>
                                        <span className={`status-badge ${p.activo ? 'status-concluido' : 'status-pendiente'}`}>
                                            {p.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                        className="btn-atender" 
                                        style={{ marginRight: '5px' }} 
                                        onClick={() => handleEdit(p)} 
                                        >
                                            Editar
                                        </button>
                                        <button className="btn-atender" onClick={() => handleDelete(p.idPersonal)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PersonalPage;