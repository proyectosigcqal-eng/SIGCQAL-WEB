import { useState, useEffect } from 'react';
import { listarAcusesPorArea } from '../services/acusecorrespondenciaService';

export const useListaAcusesCorrespondenciaPorArea = () => {
  const [acuses, setAcuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const getIdAreaLogueado = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return payload.idArea; // Asegúrate de que esta sea la clave correcta en tu JWT
    } catch (e) {
      console.error("Error al extraer idArea del token:", e);
      return null;
    }
  };

  const cargarAcuses = async () => {
    const idArea = getIdAreaLogueado();
    
    if (!idArea) {
      setError("No se pudo determinar el área del usuario.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await listarAcusesPorArea(idArea);
      setAcuses(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar acuses de correspondencia por área:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAcuses();
  }, []);

  return {
    acuses,
    loading,
    error,
    recargar: cargarAcuses // Ahora recargar usa la función dinámica
  };
};