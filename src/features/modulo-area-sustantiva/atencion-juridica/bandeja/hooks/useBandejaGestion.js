import { useState, useEffect, useCallback, useRef } from "react";
import { getAsesores } from "@/shared/services/catalogosServices";

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8081/SIGCQAL_dev";

const ETAPAS = [
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

const extractAsesorId = (item) => {
  if (!item || typeof item !== "object") return "";
  if (item.idAsesor !== undefined && item.idAsesor !== null) {
    return String(item.idAsesor);
  }
  if (item.id_asesor !== undefined && item.id_asesor !== null) {
    return String(item.id_asesor);
  }
  if (item.id !== undefined && item.id !== null) return String(item.id);
  return "";
};

const getAsesorNombre = (item) => {
  if (!item || typeof item !== "object") return "";
  return (
    item.nombreCompleto ??
    item.nombre_completo ??
    item.nombreAsesor ??
    item.nombre_asesor ??
    item.nombre ??
    ""
  );
};

const normalizarTexto = (valor) =>
  String(valor ?? "")
    .trim()
    .toLowerCase();

const adaptarTramite = (item) => {
  console.log(">>> item bandeja:", item);
  return {
    id: item.folio,
    folio: item.folio,
    idExpediente: item.idExpediente ?? item.id_expediente ?? null,
    idAsesor: item.idAsesor ?? item.id_asesor ?? null,
    asesor:
      item.asesor ??
      item.nombreAsesor ??
      item.nombre_asesor ??
      item.nombreCompletoAsesor ??
      "",
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

const filtrarPorAsesor = (tramites, asesorSeleccionado, asesores) => {
  if (!asesorSeleccionado) return tramites;

  const asesorActual = asesores.find(
    (asesor) => extractAsesorId(asesor) === String(asesorSeleccionado),
  );
  const nombreSeleccionado = normalizarTexto(getAsesorNombre(asesorActual));

  return tramites.filter((tramite) => {
    const idTramite =
      tramite.idAsesor !== undefined && tramite.idAsesor !== null
        ? String(tramite.idAsesor)
        : "";
    const nombreTramite = normalizarTexto(tramite.asesor);

    return (
      (idTramite && idTramite === String(asesorSeleccionado)) ||
      (nombreSeleccionado && nombreTramite === nombreSeleccionado)
    );
  });
};

export const useBandejaGestion = ({
  enabled = true,
  tipoTramite = "QUEJAS_Y_RECLAMACIONES",
} = {}) => {
  const [busqueda, setBusqueda] = useState("");
  const [etapaActiva, setEtapaActiva] = useState("TODAS");
  const [asesorSeleccionado, setAsesorSeleccionado] = useState("");
  const [asesores, setAsesores] = useState([]);
  const [tramitesBase, setTramitesBase] = useState([]);
  const [tramites, setTramites] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    getAsesores()
      .then((data) => {
        if (Array.isArray(data)) setAsesores(data);
      })
      .catch(() => {
        setAsesores([]);
      });
  }, [enabled]);

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
    params.append("tipo_tramite", tipoTramite);

    fetch(`${API_BASE}/api/v1/tramites/bandeja?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(async (data) => {
        if (!Array.isArray(data)) throw new Error("Respuesta inesperada");

        const tramitesAdaptados = data.map(adaptarTramite);
        const visibles = filtrarPorEtapa(tramitesAdaptados, etapaActiva);

        if (!controller.signal.aborted) setTramitesBase(visibles);

        const necesitaSemaforo = ETAPAS_CON_SEMAFORO.includes(etapaActiva);
        if (!necesitaSemaforo) return;

        const enriquecidos = await Promise.all(
          visibles.map(async (t) => ({
            ...t,
            semaforoPlazos:
              t.semaforoPlazos ?? (await obtenerSemaforo(t.folio)),
          })),
        );

        if (!controller.signal.aborted) setTramitesBase(enriquecidos);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setTramitesBase([]);
        setTramites([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
  }, [busqueda, etapaActiva, tipoTramite]);

  useEffect(() => {
    setTramites(filtrarPorAsesor(tramitesBase, asesorSeleccionado, asesores));
  }, [tramitesBase, asesorSeleccionado, asesores]);

  useEffect(() => {
    if (!enabled) return; // 👈 no fetch si está deshabilitado
    const id = window.setTimeout(fetchBandeja, 350);
    return () => window.clearTimeout(id);
  }, [fetchBandeja, enabled]);

  // Cuando se deshabilita, limpiamos estado para que no quede basura visible
  useEffect(() => {
    if (!enabled) {
      setAsesorSeleccionado("");
      setAsesores([]);
      setTramitesBase([]);
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
    asesorSeleccionado,
    setAsesorSeleccionado,
    asesores,
    tramites,
    cargando,
    error,
    ETAPAS,
    recargar: fetchBandeja,
    refrescar: fetchBandeja,
  };
};
