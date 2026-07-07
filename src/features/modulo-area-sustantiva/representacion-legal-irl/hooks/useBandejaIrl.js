// features/modulo-area-sustantiva/representacion-legal-irl/hooks/useBandejaIrl.js

import { useState, useEffect, useCallback, useRef } from "react";
import { listarBandejaIrl } from "../services/bandejaIrlService";
import { getAsesores } from "@/shared/services/catalogosServices";

const ETAPAS_IRL = [
  { key: "ASIGNADO",             label: "Asignado",                        estatus: "Asignado" },
  { key: "CIR_GENERADO",         label: "CIR Generado",                    estatus: "CIR generado" },
  { key: "DEMANDA_PRESENTADA",   label: "Demanda Presentada",              estatus: "Demanda presentada" },
  { key: "AUDIENCIA_ESPERA",     label: "Admitida en Espera de Audiencia", estatus: "Admitida en espera de audiencia" },
  { key: "AUDIENCIA_CELEBRADA",  label: "Audiencia Celebrada",             estatus: "Audiencia celebrada" },
  { key: "SENTENCIA_DICTADA",    label: "Sentencia Dictada",               estatus: "Sentencia dictada" },
  { key: "RECURSO_REVISION",     label: "En Recurso de Revisión",          estatus: "En recurso de revisión" },
  { key: "SENTENCIA_EJECUTORIA", label: "Sentencia Ejecutoria",            estatus: "Sentencia Ejecutoria" },
  { key: "CUMPLIMIENTO",         label: "Cumplimiento Notificado",         estatus: "Cumplimiento notificado" },
  { key: "CONCLUIDO",            label: "Concluido",                       estatus: "Concluido" },
];

const SUB_SWITCHES = [
  { key: "DIRECTO",   label: "IRL Asignación Directa", esEvolucion: false },
  { key: "EVOLUCION", label: "IRL Seguimiento",          esEvolucion: true  },
];

export const useBandejaIrl = ({ enabled = true } = {}) => {
  const [busqueda,            setBusqueda]            = useState('');
  const [subSwitchActivo,     setSubSwitchActivo]     = useState('DIRECTO');
  const [etapaActiva,         setEtapaActiva]         = useState('TODAS');
  const [estatusActivo,       setEstatusActivo]       = useState(null);
  const [asesorSeleccionado,  setAsesorSeleccionado]  = useState(null);
  const [asesores,            setAsesores]            = useState([]);
  const [itemsBrutos,         setItemsBrutos]         = useState([]);
  const [items,               setItems]               = useState([]);
  const [cargando,            setCargando]            = useState(false);
  const [error,               setError]               = useState(null);
  const controllerRef = useRef(null);

  // Catálogo de asesores (solo una vez)
  useEffect(() => {
    if (!enabled) return;
    getAsesores()
      .then((data) => { if (Array.isArray(data)) setAsesores(data); })
      .catch(() => {});
  }, [enabled]);

  const fetchBandeja = useCallback(() => {
    if (!enabled) return;
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setCargando(true);
    setError(null);

    const etapa          = ETAPAS_IRL.find((e) => e.key === etapaActiva);
    const estatusBackend = etapa?.estatus ?? null;

    listarBandejaIrl({
      idEstatus: estatusBackend,
      query:     busqueda,
      signal:    controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) return;

        // ✅ BUGS 1, 3 y 4 CORREGIDOS:
        // - El service ahora retorna un array directo (bug 1 resuelto allá)
        // - Los items ya vienen adaptados con los campos correctos del DTO (bug 3)
        // - NO se vuelve a llamar adaptarItem aquí (bug 4: double-mapping eliminado)
        setItemsBrutos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setItemsBrutos([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
  }, [busqueda, etapaActiva, enabled]);

  // Filtro de esEvolucion en frontend (el backend no lo filtra)
  useEffect(() => {
    const esEvolucion = SUB_SWITCHES.find((s) => s.key === subSwitchActivo)?.esEvolucion;
    setItems(itemsBrutos.filter((item) => item.esEvolucion === esEvolucion));
  }, [itemsBrutos, subSwitchActivo]);

  // Debounce 350 ms
  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(fetchBandeja, 350);
    return () => window.clearTimeout(id);
  }, [fetchBandeja, enabled]);

  useEffect(() => {
    if (!enabled) {
      setItemsBrutos([]);
      setItems([]);
      setCargando(false);
      setError(null);
    }
  }, [enabled]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const handleSubSwitchChange = (key) => {
    setSubSwitchActivo(key);
    setEtapaActiva('TODAS');
    setEstatusActivo(null);
  };

  return {
    busqueda,      setBusqueda,
    subSwitchActivo, setSubSwitchActivo: handleSubSwitchChange,
    etapaActiva,   setEtapaActiva,
    estatusActivo, setEstatusActivo,
    asesorSeleccionado, setAsesorSeleccionado,
    asesores,
    items,
    cargando,
    error,
    SUB_SWITCHES,
    ESTATUS_TABS:  ETAPAS_IRL,
    ETAPAS_IRL,
    recargar:      fetchBandeja,
  };
};