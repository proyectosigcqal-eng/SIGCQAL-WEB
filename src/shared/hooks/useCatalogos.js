import { useState, useEffect } from 'react';
import { getAreas, getUsuarios, getPlantillas, getRoles } from '../services/catalogosServices';

export const useCatalogos = () => {
    const [areas, setAreas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [plantillas, setPlantillas] = useState([]);
    const [roles, setRoles] = useState([]);
    const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            setCargandoCatalogos(true);
            try {
                const [areasData, usuariosData, plantillasData, rolesData] = await Promise.all([
                    getAreas(),
                    getUsuarios(),
                    getPlantillas(),
                    getRoles()
                ]);

                setAreas(areasData);
                setUsuarios(usuariosData);
                setPlantillas(plantillasData);
                setRoles(rolesData);
            } catch (error) {
                console.error("Fallo al cargar los catálogos globales.", error);
            } finally {
                setCargandoCatalogos(false);
            }
        };

        cargarDatos();
    }, []);

    return { 
        areas, 
        usuarios, 
        plantillas, 
        roles,
        cargandoCatalogos 
    };
};