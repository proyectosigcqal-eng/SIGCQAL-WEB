import { useState } from 'react';
import { generarMemorandum } from '../services/memorandumService';

export const useMemorandum = (datosInicialesDB) => {
  const [formData, setFormData] = useState({
    idCorrespondencia: 1, 
    instruccionSeguimiento: '',
    idUsuarioEmisor: '', 
    idUsuarioFirmante: '',
    idPlantilla: '',
    idArea: '', 
    observaciones: '',
    folioUnico: `MEMO-${Date.now()}`, 
    asuntoCorrespondencia: datosInicialesDB?.asunto || 'Sin asunto',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const finalValue = (name.startsWith('id') && value !== '') ? Number(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log("Enviando DTO al servidor...", formData);
        const resultado = await generarMemorandum(formData);
        alert(`¡Memorándum guardado con éxito! Folio: ${resultado.folioUnico}`);
    } catch (error) {
        alert("Error al guardar. Revisa la consola y tu backend.");
    }
  };

  
  return { formData, setFormData, handleChange, handleSubmit };
};