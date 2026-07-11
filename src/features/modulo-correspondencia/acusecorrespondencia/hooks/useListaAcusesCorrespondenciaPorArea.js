// useListaAcusesCorrespondenciaPorArea.js
import { useState, useEffect } from "react";
import {
  listarAcusesPorArea,
  listarTodos,
} from "../services/acusecorrespondenciaService";
import { useAreaUsuario, TODAS_LAS_AREAS } from "@/shared/hooks/useAreaUsuario";

export const useListaAcusesCorrespondenciaPorArea = () => {
  const [acuses, setAcuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ocultarContestados, setOcultarContestados] = useState(true);

  const idArea = useAreaUsuario();

  const cargarAcuses = async () => {
    if (!idArea) return;
    setLoading(true);
    setError(null);
    try {
      const data =
        idArea === TODAS_LAS_AREAS
          ? await listarTodos()
          : await listarAcusesPorArea(idArea);

      setAcuses(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar acuses de correspondencia por área:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idArea !== null) cargarAcuses();
  }, [idArea]);

  // Por defecto la bandeja muestra solo activos (3 y 4).
  // "Mostrar todos" revela también los ya contestados/concluidos.
  const acusesVisibles = ocultarContestados
    ? acuses.filter((a) => a.idEstatus === 3 || a.idEstatus === 4)
    : acuses;

  return {
    acuses: acusesVisibles,
    loading,
    error,
    recargar: cargarAcuses,
    areaForzada: idArea,
    // 👇 NUEVO
    limpiarContestados: () => setOcultarContestados(true),
    mostrarTodos: () => setOcultarContestados(false),
    ocultarContestados,
  };
};
