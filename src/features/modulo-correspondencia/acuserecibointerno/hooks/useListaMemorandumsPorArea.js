import { useState, useEffect } from 'react';
import { listarPorArea } from '../services/acuserecibointernoService';

export const useListaMemorandumsPorArea = () => {
  const [memorandums, setMemorandums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 // Función unificada para extraer datos del token
  const getDatosUsuarioToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return { idArea: null, idUsuario: null };
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return { 
        idArea: payload.idArea, 
        idUsuario: payload.idUsuario // Ajusta si en tu token se llama diferente
      };
    } catch (e) {
      console.error("Error al decodificar token:", e);
      return { idArea: null, idUsuario: null };
    }
  };

 const cargarMemorandums = async () => {
    const { idArea } = getDatosUsuarioToken();

    if (!idArea) {
      setError("No se pudo determinar el área del usuario logueado.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await listarPorArea(idArea);
      setMemorandums(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar memorandums por área:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMemorandums();
  }, []);

  return {
    memorandums,
    loading,
    error,
    recargar: cargarMemorandums // Ya no necesitamos pasarle un argumento
  };
};
