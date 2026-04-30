import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarMemorandum } from '../services/memorandumService';

export const useMemorandum = (datosInicialesDB) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idCorrespondencia: 1, 
    instruccionSeguimiento: '',
    idUsuarioEmisor: '', 
    idUsuarioFirmante: '',
    idPlantilla: '',
    idArea: '', 
    observaciones: '',
    folioUnico: '', 
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
        const payload = {
          ...formData,
          folioUnico: formData.folioUnico || `MEMO-${Date.now()}`
        };

        const resultado = await generarMemorandum(payload);

        if (resultado && resultado.id) {
            navigate(`/correspondencia/asignar-area/${resultado.id}`);
        } else {
            console.error("El servidor no devolvió el ID del memorándum");
        }

    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error al guardar el borrador. Revisa la conexión con el servidor.");
    }
  };

  
  return { formData, setFormData, handleChange, handleSubmit };
};
