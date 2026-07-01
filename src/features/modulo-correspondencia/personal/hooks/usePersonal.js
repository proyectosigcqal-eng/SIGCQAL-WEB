import { useState, useEffect } from 'react';
import * as service from '../services/personalService';

export const usePersonal = () => {
    const [personalList, setPersonalList] = useState([]);

   const handleSave = async (data) => {
        try {
            if (data.idPersonal) {
                // Si tiene ID, es una actualización
                await service.updatePersonal(data.idPersonal, data);
            } else {
                // Si no, es un registro nuevo
                await service.createPersonal(data);
            }
            fetchPersonal(); // Recarga la tabla después de cualquier acción
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    const fetchPersonal = async () => {
        const { data } = await service.getPersonal();
        setPersonalList(data);
    };

    const handleDelete = async (id) => {
        await service.deletePersonal(id);
        fetchPersonal(); // Refrescar lista
    };

    const getPersonalDetail = async (id) => {
        try {
            const { data } = await service.getPersonalById(id);
            return data; // Esto devuelve el objeto con TODOS los campos
        } catch (error) {
            console.error("Error al obtener detalle:", error);
            return null;
        }
    };

    useEffect(() => { fetchPersonal(); }, []);

    return { personalList, handleDelete, handleSave, fetchPersonal, getPersonalDetail };
};