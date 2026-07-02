import { useState, useEffect } from 'react';
import { obtenerCorrespondenciaPendientePorArea } from '../services/correspondenciaService';

export const useCorrespondenciaPendientePorArea = () => {
  const [correspondencia, setCorrespondencia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
const getAreaDesdeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      // El payload es la segunda parte del JWT
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.idArea; // Aquí está el idArea que viene de tu JwtService
    } catch (e) {
      console.error("Error al decodificar token para obtener idArea:", e);
      return null;
    }
  };


const cargarCorrespondencia = async () => {
    const idArea = getAreaDesdeToken(); // Obtenemos el valor aquí
    
    if (!idArea) {
      setError("No se pudo determinar el área del usuario logueado.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await obtenerCorrespondenciaPendientePorArea(idArea);
      setCorrespondencia(data);
    } catch (err) {
      setError(err?.message || 'Error al obtener correspondencia pendiente por área');
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    cargarCorrespondencia();
  }, []); // Se ejecuta al montar

  const recargar = () => {
    cargarCorrespondencia();
  };

  return {
    correspondencia,
    loading,
    error,
    recargar
  };
};