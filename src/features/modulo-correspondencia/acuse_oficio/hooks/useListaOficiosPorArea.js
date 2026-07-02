import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8081/SIGCQAL_Prod/api/v1';

export const useListaOficiosPorArea = () => {
  const [oficios, setOficios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Función para extraer el área del token de forma dinámica
  const getAreaDesdeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return payload.idArea; // Extrae el campo 'idArea' de tu token
    } catch (e) {
      console.error("Error al obtener idArea del token:", e);
      return null;
    }
  };

 const cargarOficios = async () => {
    const idArea = getAreaDesdeToken();
    
    if (!idArea) {
      setError("No se pudo determinar el área del usuario.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/acuse-oficio/area/${idArea}`);
      setOficios(res.data);
    } catch (err) {
      setError(err?.message || 'Error al cargar oficios por área');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOficios();
  }, []);

  return { 
    oficios, 
    loading, 
    error, 
    recargar // Ahora recargar usa la lógica dinámica
  };
};