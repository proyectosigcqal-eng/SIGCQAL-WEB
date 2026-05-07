import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormularioContestacion } from '../../../features/modulo-correspondencia/contestacion-correspondencia/components/FormularioContestacion';

export const ContestacionCorrespondenciaPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const volverATabla = () => {
    navigate('/correspondencia/bandeja');
  };

  return (
    <FormularioContestacion
      idCorrespondencia={id}
      onSuccess={volverATabla}
      onCancel={volverATabla}
    />
  );
};
