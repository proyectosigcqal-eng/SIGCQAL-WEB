import { useState, useEffect, useCallback, useRef } from "react";
import { listarBandejaIrl } from "../services/bandejaIrlService";

const SUB_SWITCHES = [
  { key: "DIRECTO", label: "IRL Asignación Directa", esEvolucion: false },
  { key: "EVOLUCION", label: "IRL Evolución", esEvolucion: true },
];

export const useBandejaIrl = ({ enabled = true } = {}) => {
  const [busqueda, setBusqueda] = useState("");
  const [subSwitchActivo, setSubSwitchActivo] = useState("DIRECTO");
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  // Resuelve el valor booleano para el endpoint
  const esEvolucion = SUB_SWITCHES.find(
    (s) => s.key === subSwitchActivo,
  )?.esEvolucion;

  const fetchBandeja = useCallback(() => {
    if (!enabled) return; // No fetch si el tab no está activo
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setCargando(true);
    setError(null);

    listarBandejaIrl({
      esEvolucion,
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
  }, [busqueda, esEvolucion, enabled]);

  // Debounce búsqueda 350ms — solo si enabled
  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(fetchBandeja, 350);
    return () => window.clearTimeout(id);
  }, [fetchBandeja, enabled]);

  // Cleanup al desmontar
  useEffect(() => () => controllerRef.current?.abort(), []);

  return {
    busqueda,
    setBusqueda,
    subSwitchActivo,
    setSubSwitchActivo,
    items,
    cargando,
    error,
    SUB_SWITCHES,
    recargar: fetchBandeja,
  };
};
