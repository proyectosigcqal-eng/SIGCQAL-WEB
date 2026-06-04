import { useState, useEffect } from 'react';
import { getAreas, getUsuarios, getPlantillas, getRoles, getTiposCorrespondencia, getAsesores } from '../services/catalogosServices';

export const useCatalogos = () => {
    const [areas, setAreas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [plantillas, setPlantillas] = useState([]);
    const [roles, setRoles] = useState([]);
    const [tiposCorrespondencia, setTiposCorrespondencia] = useState([]);
    const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
    const [asesores, setAsesores] = useState([])

    useEffect(() => {
        const cargarDatos = async () => {
            setCargandoCatalogos(true);
            try {
                const [areasData, usuariosData, plantillasData, rolesData, tiposData, asesoresData] = await Promise.all([
                    getAreas(),
                    getUsuarios(),
                    getPlantillas(),
                    getRoles(),
                    getTiposCorrespondencia(),
                    getAsesores()
                ]);

                setAreas(areasData);
                setUsuarios(usuariosData);
                setPlantillas(plantillasData);
                setRoles(rolesData);
                setTiposCorrespondencia(tiposData);
                setAsesores(asesoresData);
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
        tiposCorrespondencia,
        asesores,
        cargandoCatalogos 
    };
};
