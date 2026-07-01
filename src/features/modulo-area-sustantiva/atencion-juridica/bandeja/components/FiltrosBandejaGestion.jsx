export const FiltrosBandejaGestion = ({
  busqueda,
  setBusqueda,
  etapaActiva,
  setEtapaActiva,
  ETAPAS,
  cargando,
}) => {
  return (
    <>
      {/* ── Búsqueda ── */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          className="bdg-input"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por folio, expediente o quejoso..."
          aria-label="Buscar"
          style={{ width: "100%", maxWidth: 400 }}
          disabled={cargando}
        />
      </div>

      {/* ── Switch de Etapas ── */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: "1.5rem",
          borderRadius: 8,
          border: "0.5px solid var(--color-border-secondary)",
          overflow: "hidden",
          flexWrap: "wrap",
        }}
      >
        {ETAPAS.map((etapa, i) => (
          <button
            key={etapa.key}
            type="button"
            onClick={() => setEtapaActiva(etapa.key)}
            disabled={cargando}
            style={{
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              whiteSpace: "nowrap",
              cursor: cargando ? "not-allowed" : "pointer",
              background:
                etapaActiva === etapa.key
                  ? "#1e3a8a"
                  : "var(--color-background-primary)",
              color:
                etapaActiva === etapa.key
                  ? "#fff"
                  : "var(--color-text-secondary)",
              transition: "background 0.12s, color 0.12s",
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
