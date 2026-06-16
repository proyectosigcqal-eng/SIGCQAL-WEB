import { useState, useEffect } from 'react';
import { getAreas, getUsuarios, getPlantillas, getRoles, getTiposCorrespondencia, getAsesores, getPlantillasQuejaAri } from '../services/catalogosServices';

export const useCatalogos = () => {
    const [areas, setAreas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [plantillas, setPlantillas] = useState([]);
    const [plantillasQuejaAri, setPlantillasQuejaAri] = useState([]);
    const [roles, setRoles] = useState([]);
    const [tiposCorrespondencia, setTiposCorrespondencia] = useState([]);
    const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
    const [asesores, setAsesores] = useState([])

    useEffect(() => {
        const cargarDatos = async () => {
            setCargandoCatalogos(true);
            try {
                const [areasData, usuariosData, plantillasData, rolesData, tiposData, asesoresData, plantillasQuejaData] = await Promise.all([
                    getAreas(),
                    getUsuarios(),
                    getPlantillas(),
                    getRoles(),
                    getTiposCorrespondencia(),
                    getAsesores(),
                    getPlantillasQuejaAri()
                ]);

                setAreas(areasData);
                setUsuarios(usuariosData);
                setPlantillas(plantillasData);
                setRoles(rolesData);
                setTiposCorrespondencia(tiposData);
                setAsesores(asesoresData);
                setPlantillasQuejaAri(plantillasQuejaData);
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
        plantillasQuejaAri,
        roles,
        tiposCorrespondencia,
        asesores,
        cargandoCatalogos 
    };
};
