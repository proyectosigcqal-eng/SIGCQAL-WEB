import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarContribuyentes } from '../services/busquedaContribuyenteService';
 
const MIN_LARGO_BUSQUEDA = 3;
 
export const useBusquedaContribuyente = () => {
  const navigate = useNavigate();
 
  const [texto, setTexto] = useState('');
  const [resultados, setResultados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
 
  const handleChangeTexto = (e) => {
    setTexto(e.target.value);
    setError(null);
  };
 
  const handleBuscar = async (e) => {
    e.preventDefault();
 
    if (texto.trim().length < MIN_LARGO_BUSQUEDA) {
      setError(`Ingresa al menos ${MIN_LARGO_BUSQUEDA} caracteres para buscar.`);
      return;
    }
 
    setIsLoading(true);
    setError(null);
 
    try {
      const data = await buscarContribuyentes(texto.trim());
      setResultados(data || []);
      setBusquedaRealizada(true);
    } catch (err) {
      console.error('Error al buscar contribuyentes:', err);
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Error al buscar. Intenta de nuevo.'
      );
      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  };
 
  // El usuario seleccionó un resultado existente -> ir al formulario con datos precargados
  const handleRegistrarAsesoria = (contribuyente) => {
    navigate('/area-sustantiva/registro-expediente', {
      state: {
        contribuyenteExistente: contribuyente
      }
    });
  };
 
  // No hubo resultados -> ir al formulario vacío (flujo normal de siempre)
  const handleRegistrarNuevaAsesoria = () => {
    navigate('/area-sustantiva/registro-expediente');
  };
 
  return {
    texto,
    resultados,
    isLoading,
    error,
    busquedaRealizada,
    handleChangeTexto,
    handleBuscar,
    handleRegistrarAsesoria,
    handleRegistrarNuevaAsesoria
  };
};