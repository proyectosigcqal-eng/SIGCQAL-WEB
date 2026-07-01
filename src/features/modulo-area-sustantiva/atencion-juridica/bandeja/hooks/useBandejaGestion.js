import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8081/SIGCQAL_dev";

const ETAPAS = [
  { key: "TODAS", label: "Todas", estatus: null },
  {
    key: "ASIGNADA_ASESOR",
    label: "Asignada a Asesor",
    estatus: "Asignada a Asesor",
  },
  {
    key: "VALIDACION",
    label: "En Validación de Requisitos",
    estatus: "En Validación de Requisitos",
  },
  {
    key: "CIR_GENERADA",
    label: "CIR Generada",
    estatus: "CIR Generada (Constancia Interna de Remisión)",
  },
  {
    key: "ARI_GENERADO",
    label: "ARI Generado",
    estatus: "ARI Generado (Acuerdo con Requerimiento de Informe)",
  },
  {
    key: "OFICIO_EMITIDO",
    label: "Oficio de Notificación Emitido",
    estatus: "Oficio de Notificación Emitido",
  },
  {
    key: "CONTESTACION",
    label: "Contestación de Autoridad Recibida",
    estatus: "Contestación de Autoridad Recibida",
  },
  {
    key: "ACCI_GENERADO",
    label: "ACCI Generado",
    estatus: "ACCI Generado (Acuerdo de Informe de Investigación)",
  },
  {
    key: "RESOLUCION",
    label: "Informe de Resolución Emitido",
    estatus: "Informe de Resolución Emitido",
  },
  {
    key: "NOTIFICACION",
    label: "En Proceso de Notificación Final",
    estatus: "En Proceso de Notificación Final",
  },
  {
    key: "CERRADA",
    label: "Cerrada / Concluida",
    estatus: "Cerrada / Concluida",
  },
];

// Etapas que requieren enriquecimiento con semáforo de plazos
const ETAPAS_CON_SEMAFORO = ["TODAS", "ASIGNADA_ASESOR", "VALIDACION"];

const adaptarTramite = (item) => {
  console.log(">>> item bandeja:", item);
  return {
    id: item.folio,
    folio: item.folio,
    idExpediente: item.idExpediente ?? item.id_expediente ?? null,
    municipio: item.municipio_procedencia ?? "",
    contribuyente: item.contribuyente ?? "",
    asunto: item.tipo_acto ?? "",
    estatus: item.estatus_principal ?? "",
    seguimiento: item.ultima_modificacion?.descripcion ?? "",
    fecha: item.ultima_modificacion?.timestamp ?? "",
    bloqueado: item.bloqueado ?? false,
    semaforoPlazos: item.semaforoPlazos ?? item.semaforo_plazos ?? null,
    tieneCir: item.tiene_cir ?? false,
    tieneAri: item.tiene_ari ?? false,
    tieneOficio: item.tiene_oficio ?? false,
    tieneContestacion: item.tiene_contestacion ?? false,
    tieneAcci: item.tiene_acci ?? false,
    tieneResolucion: item.tiene_resolucion ?? false,
    checklistCompleto: item.checklist_completo ?? false,
    fechaCir: item.fechaCir ?? item.fecha_cir ?? null,
    fechaAri: item.fechaAri ?? item.fecha_ari ?? null,
    fechaOficio: item.fechaOficio ?? item.fecha_oficio ?? null,
    fechaContestacion:
      item.fechaContestacion ?? item.fecha_contestacion ?? null,
    fechaAcci: item.fechaAcci ?? item.fecha_acci ?? null,
    fechaResolucion: item.fechaResolucion ?? item.fecha_resolucion ?? null,
  };
};

// Enriquecimiento opcional — no bloquea el render principal
const obtenerSemaforo = async (folio) => {
  if (!folio) return null;
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/expedientes/${folio}/plazo-prevencion`,
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

// Filtro local por etapa — se aplica ANTES de enriquecer para no desperdiciar fetches
const filtrarPorEtapa = (tramites, etapaActiva) => {
  return tramites.filter((t) => {
    if (etapaActiva === "CERRADA") return t.bloqueado === true;
    if (etapaActiva === "TODAS") return true;
    return !t.bloqueado;
  });
};

export const useBandejaGestion = ({ enabled = true } = {}) => {
  const [busqueda, setBusqueda] = useState("");
  const [etapaActiva, setEtapaActiva] = useState("TODAS");
  const [tramites, setTramites] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchBandeja = useCallback(() => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setCargando(true);
    setError(null);

    const params = new URLSearchParams();
    if (busqueda.trim()) params.append("search", busqueda.trim());

    const etapa = ETAPAS.find((e) => e.key === etapaActiva);
    if (etapa?.estatus && etapaActiva !== "CERRADA") {
      params.append("estatus", etapa.estatus);
    }
    params.append("tipo_tramite", "QUEJAS_Y_RECLAMACIONES");

    fetch(`${API_BASE}/api/v1/tramites/bandeja?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(async (data) => {
        if (!Array.isArray(data)) throw new Error("Respuesta inesperada");

        const tramitesBase = data.map(adaptarTramite);
        const visibles = filtrarPorEtapa(tramitesBase, etapaActiva);

        if (!controller.signal.aborted) setTramites(visibles);

        const necesitaSemaforo = ETAPAS_CON_SEMAFORO.includes(etapaActiva);
        if (!necesitaSemaforo) return;

        const enriquecidos = await Promise.all(
          visibles.map(async (t) => ({
            ...t,
            semaforoPlazos:
              t.semaforoPlazos ?? (await obtenerSemaforo(t.folio)),
          })),
        );

        if (!controller.signal.aborted) setTramites(enriquecidos);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setTramites([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
  }, [busqueda, etapaActiva]);

  useEffect(() => {
    if (!enabled) return; // 👈 no fetch si está deshabilitado
    const id = window.setTimeout(fetchBandeja, 350);
    return () => window.clearTimeout(id);
  }, [fetchBandeja, enabled]);

  // Cuando se deshabilita, limpiamos estado para que no quede basura visible
  useEffect(() => {
    if (!enabled) {
      setTramites([]);
      setCargando(false);
      setError(null);
    }
  }, [enabled]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return {
    busqueda,
    setBusqueda,
    etapaActiva,
    setEtapaActiva,
    tramites,
    cargando,
    error,
    ETAPAS,
    recargar: fetchBandeja,
    refrescar: fetchBandeja,
  };
};
