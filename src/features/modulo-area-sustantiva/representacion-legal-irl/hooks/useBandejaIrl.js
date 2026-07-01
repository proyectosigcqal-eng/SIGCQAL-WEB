import { useState, useEffect, useCallback, useRef } from "react";
import { listarBandejaIrl } from "../services/bandejaIrlService";

const SUB_SWITCHES = [
  { key: "DIRECTO", label: "IRL Asignación Directa", esEvolucion: false },
  { key: "EVOLUCION", label: "IRL Evolución", esEvolucion: true },
];

const ESTATUS_TABS = [
  { id: null, label: "Todos" },
  { id: 1, label: "Asignado" },
  { id: 2, label: "CIR generado" },
  { id: 3, label: "Demanda presentada" },
  { id: 4, label: "Admitida en espera de audiencia" },
  { id: 5, label: "Audiencia celebrada" },
  { id: 6, label: "Sentencia dictada" },
  { id: 7, label: "En recurso de revisión" },
  { id: 8, label: "Sentencia Ejecutoria" },
  { id: 9, label: "Cumplimiento notificado" },
  { id: 10, label: "Concluido" },
];

export const useBandejaIrl = ({ enabled = true } = {}) => {
  const [busqueda, setBusqueda] = useState("");
  const [subSwitchActivo, setSubSwitchActivo] = useState("DIRECTO");
  const [estatusActivo, setEstatusActivo] = useState(null);
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const esEvolucion = SUB_SWITCHES.find(
    (s) => s.key === subSwitchActivo,
  )?.esEvolucion;

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
      query: busqueda,
      signal: controller.signal,
    })
      .then((res) => {
        if (!controller.signal.aborted) {
          setItems(res?.items ?? []);
        }
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
  }, [busqueda, esEvolucion, estatusActivo, enabled]);

  // Debounce 350ms
  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(fetchBandeja, 350);
    return () => window.clearTimeout(id);
  }, [fetchBandeja, enabled]);

  // Reset estatus al cambiar sub-switch
  const handleSubSwitchChange = (key) => {
    setSubSwitchActivo(key);
    setEstatusActivo(null);
  };

  // Cleanup
  useEffect(() => () => controllerRef.current?.abort(), []);

  return {
    busqueda,
    setBusqueda,
    subSwitchActivo,
    setSubSwitchActivo: handleSubSwitchChange,
    estatusActivo,
    setEstatusActivo,
    items,
    cargando,
    error,
    SUB_SWITCHES,
    ESTATUS_TABS,
    recargar: fetchBandeja,
  };
};
