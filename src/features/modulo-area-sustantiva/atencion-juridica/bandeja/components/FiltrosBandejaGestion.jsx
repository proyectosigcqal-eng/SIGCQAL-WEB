export const FiltrosBandejaGestion = ({
  busqueda,
  setBusqueda,
  etapaActiva,
  setEtapaActiva,
  ETAPAS,
  cargando,
  asesores = [],
  asesorSeleccionado,
  setAsesorSeleccionado,
}) => {
  const getAsesorId = (asesor) => {
    if (!asesor || typeof asesor !== "object") return "";
    if (asesor.idAsesor !== undefined && asesor.idAsesor !== null) {
      return String(asesor.idAsesor);
    }
    if (asesor.id_asesor !== undefined && asesor.id_asesor !== null) {
      return String(asesor.id_asesor);
    }
    if (asesor.id !== undefined && asesor.id !== null) {
      return String(asesor.id);
    }
    return "";
  };

  const getAsesorNombre = (asesor) => {
    if (!asesor || typeof asesor !== "object") return "Sin nombre";
    return (
      asesor.nombreCompleto ??
      asesor.nombre_completo ??
      asesor.nombreAsesor ??
      asesor.nombre_asesor ??
      asesor.nombre ??
      "Sin nombre"
    );
  };

  return (
    <>
      <div className="bdg-filtros-row">
        <input
          className="bdg-input"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por folio, expediente o quejoso..."
          aria-label="Buscar"
          disabled={cargando}
        />

        <select
          className="bdg-select bdg-filtro-asesor"
          value={asesorSeleccionado ?? ""}
          onChange={(e) => setAsesorSeleccionado(e.target.value)}
          disabled={cargando}
          aria-label="Filtrar por asesor"
        >
          <option value="">Todos los asesores</option>
          {asesores.map((asesor) => (
            <option key={getAsesorId(asesor) || getAsesorNombre(asesor)} value={getAsesorId(asesor)}>
              {getAsesorNombre(asesor)}
            </option>
          ))}
        </select>
      </div>

      <div className="bdg-filtros-etapas-scroll">
        {ETAPAS.map((etapa, i) => (
          <button
            key={etapa.key}
            type="button"
            onClick={() => setEtapaActiva(etapa.key)}
            disabled={cargando}
            className={`bdg-etapa-tab ${etapaActiva === etapa.key ? "bdg-switch-btn is-active" : "bdg-switch-btn"}`}
            style={{
              cursor: cargando ? "not-allowed" : "pointer",
              opacity: cargando ? 0.6 : 1,
              borderRight:
                i < ETAPAS.length - 1
                  ? "0.5px solid var(--color-border-secondary)"
                  : "none",
            }}
          >
            {etapa.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default FiltrosBandejaGestion;
