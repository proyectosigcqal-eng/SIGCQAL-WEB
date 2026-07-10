import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAreas } from '@/shared/services/catalogosServices';
import { asignarAreaCorrespondencia, listarCorrespondencias } from '../services/correspondenciaService';

const separarSinArea = (lista) => {
  const base = Array.isArray(lista) ? lista : [];
  return base.filter((c) => c.idArea === null || c.idArea === undefined || String(c.idArea) === '');
};

export const usePostRegistroCorrespondencia = () => {
  const navigate = useNavigate();

  const [fase, setFase] = useState('FORMULARIO');
  const [correspondenciaRegistrada, setCorrespondenciaRegistrada] = useState(null);
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [areas, setAreas] = useState([]);
  const [todasCorrespondencias, setTodasCorrespondencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const correspondenciasSinArea = useMemo(() => separarSinArea(todasCorrespondencias), [todasCorrespondencias]);

  const iniciar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [areasResp, corrResp] = await Promise.all([getAreas(), listarCorrespondencias()]);
      setAreas(Array.isArray(areasResp) ? areasResp : []);
      setTodasCorrespondencias(Array.isArray(corrResp) ? corrResp : []);
    } catch (err) {
      const mensaje =
        err?.response?.data?.message ||
        err?.response?.data?.mensaje ||
        err?.message ||
        'Ocurrió un error al cargar catálogos o correspondencias.';
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    iniciar();
  }, [iniciar]);

  const onFormularioGuardado = useCallback((responseDTO) => {
    setCorrespondenciaRegistrada(responseDTO);
    setError(null);
    const idTipo =
      responseDTO?.idTipoCorrespondencia ??
      responseDTO?.id_tipo_correspondencia ??
      responseDTO?.tipoCorrespondencia?.idTipo ??
      responseDTO?.tipoCorrespondencia?.id ??
      null;

    const descripcionTipo = String(
      responseDTO?.descripcionTipo ??
        responseDTO?.descripcion_tipo ??
        responseDTO?.tipoCorrespondencia?.descripcion ??
        responseDTO?.tipoCorrespondencia?.descripcionTipo ??
        ''
    ).toUpperCase();

    const esInterna = String(idTipo) === '2' || descripcionTipo.includes('INTERNA');

    if (esInterna) {
  setFase('GUARDANDO');
  setLoading(true);
  listarCorrespondencias()
    .then((corrResp) => {
      setTodasCorrespondencias(Array.isArray(corrResp) ? corrResp : []);
      navigate('/correspondencia/registradas'); 
    })
    .catch((err) => {
      navigate('/correspondencia/registradas');
    })
    .finally(() => setLoading(false));
  return;
}

    setFase('MODAL_AREA');
  }, []);

  const onConfirmarConArea = useCallback(
    async (idArea) => {
      const idAreaStr = String(idArea || '');
      if (!idAreaStr) return;

      setFase('GUARDANDO');
      setLoading(true);
      setError(null);

      try {
        const area = (Array.isArray(areas) ? areas : []).find((a) => String(a.id) === idAreaStr) || null;
        setAreaSeleccionada(area);

        const idCorrespondencia =
          correspondenciaRegistrada?.id ||
          correspondenciaRegistrada?.idCorrespondencia ||
          correspondenciaRegistrada?.correspondenciaId ||
          null;

        if (idCorrespondencia) {
          const actualizado = await asignarAreaCorrespondencia(idCorrespondencia, idAreaStr);
          if (actualizado) setCorrespondenciaRegistrada(actualizado);
        }

        const corrResp = await listarCorrespondencias();
        setTodasCorrespondencias(Array.isArray(corrResp) ? corrResp : []);
        navigate('/correspondencia/registradas');
      } catch (err) {
        const mensaje =
          err?.response?.data?.message ||
          err?.response?.data?.mensaje ||
          err?.message ||
          'Ocurrió un error al asignar el área.';
        setError(mensaje);
        setFase('MODAL_AREA');
      } finally {
        setLoading(false);
      }
    },
    [areas, correspondenciaRegistrada]
  );

  const onSaltarSinArea = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const corrResp = await listarCorrespondencias();
      setTodasCorrespondencias(Array.isArray(corrResp) ? corrResp : []);
      navigate('/correspondencia/registradas');
    } catch (err) {
      const mensaje =
        err?.response?.data?.message ||
        err?.response?.data?.mensaje ||
        err?.message ||
        'Ocurrió un error al recargar la bandeja.';
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  const onNuevoRegistro = useCallback(() => {
    setCorrespondenciaRegistrada(null);
    setAreaSeleccionada(null);
    setError(null);
    setFase('FORMULARIO');
  }, []);

  const onGenerarMemorandum = useCallback(
    (correspondencia, from) => {
      const id =
        correspondencia?.id ||
        correspondencia?.idCorrespondencia ||
        correspondencia?.correspondenciaId ||
        null;

      if (!id) return;
      // ← cambia state por parámetro en URL
      navigate(`/correspondencia/nuevo-memorandum/${id}`);
    },
    [navigate]
);

  return {
    fase,
    correspondenciaRegistrada,
    areaSeleccionada,
    areas,
    todasCorrespondencias,
    correspondenciasSinArea,
    loading,
    error,
    iniciar,
    onFormularioGuardado,
    onConfirmarConArea,
    onSaltarSinArea,
    onNuevoRegistro,
    onGenerarMemorandum
  };
};

