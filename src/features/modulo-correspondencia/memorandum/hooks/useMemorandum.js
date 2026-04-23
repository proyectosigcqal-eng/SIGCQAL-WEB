import { useState, useEffect } from 'react';
import { generarMemorandum } from '../services/memorandumService';

export const useMemorandum = (datosInicialesDB) => {
  const [formData, setFormData] = useState({
    idCorrespondencia: 1, // <--- Pon un ID que SI exista en tu DB
    instruccionSeguimiento: '',
    idUsuarioEmisor: 1, 
    idUsuarioFirmante: 1,
    idPlantilla: 1,
    idArea: 1,
    observaciones: '',
    // idArea: datosInicialesDB?.idArea || null,
    folioUnico: `MEMO-${Date.now()}`, 
    asuntoCorrespondencia: datosInicialesDB?.asunto || 'Sin asunto',
    // nombreUsuarioFirmante: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
        console.log("Enviando DTO al servidor...", formData);
        const resultado = await generarMemorandum(formData);
        
        alert(`¡Memorándum guardado con éxito! Folio: ${resultado.folioUnico}`);
        // Aquí podrías limpiar el formulario o redirigir
    } catch (error) {
        alert("Error al guardar. Revisa la consola y tu backend.");
    }
};

  return { formData, handleChange, handleSubmit };
};