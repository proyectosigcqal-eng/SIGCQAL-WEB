import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarOficio } from '../services/oficioService';

export const useOficio = (correspondencia, catalogos) => { // ← recibe catalogos como parámetro
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idCorrespondencia:      '',
    instruccionSeguimiento: '',
    idUsuarioEmisor:        '',
    idUsuarioFirmante:      '',
    idPlantilla:            '',
    idArea:                 '',
    observaciones:          '',
    folioUnico:             `OFICIO-${Date.now()}`,
    asuntoCorrespondencia:  '',
  });

 useEffect(() => {
  if (!correspondencia) return;
  setFormData(prev => ({
    ...prev,
    idCorrespondencia:     correspondencia.id,
    asuntoCorrespondencia: correspondencia.asunto || '',
    folioUnico:            '', // ← vacío, el backend lo genera
    idArea:                correspondencia.idArea || '',
  }));
}, [correspondencia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = (name.startsWith('id') && value !== '') ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const firmante = catalogos?.usuarios?.find(
            u => u.id === Number(formData.idUsuarioFirmante)
        );
        const emisor = catalogos?.usuarios?.find(
            u => u.id === Number(formData.idUsuarioEmisor)
        );
        const areaDestino = catalogos?.areas?.find(
            a => a.id === Number(formData.idArea)
        );

        const payload = {
            ...formData,
            areaDestinatario: areaDestino?.nombre || areaDestino?.nombreArea || '',
            nombreFirmante:   firmante?.usuarioLogin || '',
            areaFirmante:     firmante?.nombreArea   || getAreaUsuario(formData.idUsuarioFirmante, catalogos?.usuarios) || '',
            nombreEmisor:     emisor?.usuarioLogin   || '', // ← agregar
        };

        const resultado = await generarOficio(payload);
        if (resultado?.id) {
            navigate(`/correspondencia/asignar-area-oficio/${resultado.id}`);
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar el borrador.');
    }
};

// Helper para obtener área de un usuario
const getAreaUsuario = (idUsuario, usuarios) => {
    const u = usuarios?.find(u => u.id === Number(idUsuario));
    return u?.nombreArea || '';
};

  return { formData, setFormData, handleChange, handleSubmit };
};
