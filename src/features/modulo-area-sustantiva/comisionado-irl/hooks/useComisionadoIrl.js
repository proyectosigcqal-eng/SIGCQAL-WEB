// features/modulo-area-sustantiva/comisionado-irl/hooks/useComisionadoIrl.js

import { useState, useEffect, useCallback, useRef } from "react";
import {
  listarBandejaIrl,
  listarEstatusRepresentacionLegal,
} from "../../representacion-legal-irl/services/bandejaIrlService";
import { getAsesores } from "@/shared/services/catalogosServices";

const SUB_SWITCHES = [
  { key: "DIRECTO", label: "IRL Asignación Directa", esEvolucion: false },
  { key: "EVOLUCION", label: "IRL Evolución", esEvolucion: true },
];

export const useComisionadoIrl = ({ enabled = true } = {}) => {
  const [busqueda, setBusqueda] = useState("");
  const [subSwitchActivo, setSubSwitchActivo] = useState("DIRECTO");
  const [estatusActivo, setEstatusActivo] = useState(null);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);
  const [asesores, setAsesores] = useState([]);
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  // NUEVO: Estado dinámico para los tabs de estatus
  const [catalogoEstatus, setCatalogoEstatus] = useState([
    { id: null, label: "Todos" }, // Default mientras carga el backend
  ]);

  const esEvolucion = SUB_SWITCHES.find(
    (s) => s.key === subSwitchActivo,
  )?.esEvolucion;

  // Cargar catálogos (asesores y estatus) una sola vez
  useEffect(() => {
    if (!enabled) return;

    getAsesores()
      .then((data) => {
        if (Array.isArray(data)) setAsesores(data);
      })
      .catch(() => {});

    // Cargar estatus desde backend
    listarEstatusRepresentacionLegal()
      .then((estatusData) => {
        // Aseguramos que "Todos" siempre quede de primero
        setCatalogoEstatus([{ id: null, label: "Todos" }, ...estatusData]);
      })
      .catch(() => {
        // Si falla, dejamos solo "Todos"
      });
  }, [enabled]);

  const fetchBandeja = useCallback(() => {
    if (!enabled) return;
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setCargando(true);
    setError(null);

    listarBandejaIrl({
      esEvolucion,
      idEstatus: estatusActivo,
      idAsesor: asesorSeleccionado,
      query: busqueda,
      signal: controller.signal,
    })
      .then((res) => {
        if (!controller.signal.aborted) setItems(res?.items ?? []);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setError(err.message);
          setItems([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
  }, [busqueda, esEvolucion, estatusActivo, asesorSeleccionado, enabled]);

  // Debounce 350ms
  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(fetchBandeja, 350);
    return () => window.clearTimeout(id);
  }, [fetchBandeja, enabled]);

  const handleSubSwitchChange = (key) => {
    setSubSwitchActivo(key);
    setEstatusActivo(null);
  };

  useEffect(() => () => controllerRef.current?.abort(), []);

  return {
    busqueda,
    setBusqueda,
    subSwitchActivo,
    setSubSwitchActivo: handleSubSwitchChange,
    estatusActivo,
    setEstatusActivo,
    asesorSeleccionado,
    setAsesorSeleccionado,
    asesores,
    items,
    cargando,
    error,
    SUB_SWITCHES,
    ESTATUS_TABS: catalogoEstatus, // ← Ahora viene del backend
    recargar: fetchBandeja,
  };
};
