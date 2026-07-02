import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarOficio } from '../services/oficioService';

export const useOficio = (correspondencia, catalogos) => { // ← recibe catalogos como parámetro
  const navigate = useNavigate();

  const getIdUsuarioLogueado = () => {
      const token = localStorage.getItem('token');
      if (!token) return '';
      try {
          const payload = JSON.parse(window.atob(token.split('.')[1]));
          return payload.idUsuario; // Esto extrae tu ID real (ej. 14)
      } catch (e) {
          return '';
      }
  };

  const [formData, setFormData] = useState({
    idCorrespondencia:      '',
    instruccionSeguimiento: '',
    idUsuarioEmisor:        getIdUsuarioLogueado(), // ← obtiene el ID del usuario logueado
    idUsuarioFirmante:      getIdUsuarioLogueado(), // ← obtiene el ID del usuario logueado
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

    const token = localStorage.getItem('token');
    const payloadToken = JSON.parse(window.atob(token.split('.')[1]));
    const idUsuarioLogueado = payloadToken.idUsuario; // Asegúrate de que este sea el ID correcto

    try {

      const idReal = getIdUsuarioLogueado();
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
            idUsuarioEmisor: idReal,
            idUsuarioFirmante: idReal,
            areaDestinatario: areaDestino?.nombre || areaDestino?.nombreArea || '',
            nombreFirmante:   firmante?.usuarioLogin || '',
            areaFirmante:     firmante?.nombreArea   || getAreaUsuario(formData.idUsuarioFirmante, catalogos?.usuarios) || '',
            nombreEmisor:     emisor?.usuarioLogin   || '', // ← agregar
        };
        console.log("VALOR QUE ENVÍO AL BACKEND:", payload.idUsuarioEmisor);

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
