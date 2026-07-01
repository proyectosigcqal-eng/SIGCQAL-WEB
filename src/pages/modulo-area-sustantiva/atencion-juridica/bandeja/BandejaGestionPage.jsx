import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useBandejaGestion } from "@/features/modulo-area-sustantiva/atencion-juridica/bandeja/hooks/useBandejaGestion";
import {
  TablaTramites,
  TIPO_TRAMITE_TABS,
} from "@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/TablaTramites";
import "@/features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/bandeja-gestion.css";

export const BandejaGestionPage = () => {
  const [tipoActivo, setTipoActivo] = useState("QUEJAS_RECLAMACIONES");

  const isIrl    = tipoActivo === "REPRESENTACION_LEGAL_IRL";
  const isQuejas = tipoActivo === "QUEJAS_RECLAMACIONES";

  const {
    busqueda,
    setBusqueda,
    etapaActiva,
    setEtapaActiva,
    tramites,
    cargando,
    error,
    ETAPAS,
    recargar,
  } = useBandejaGestion({
    // ← Solo activo cuando el tab de quejas está visible
    enabled: isQuejas,
  });

  // ← Cuando el usuario regresa al tab de Quejas, refetch automático
  useEffect(() => {
    if (isQuejas) recargar();
  }, [tipoActivo]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bdg-page">
      <div className="bdg-header">
        <div>
          <h1 className="bdg-title">Bandeja de Gestión</h1>
          <p className="bdg-subtitle">
            Monitoreo de plazos legales y atención ciudadana.
          </p>
        </div>
      </div>

      {/* ── Triple Switch ── */}
      <div className="bdg-switch-bar" style={{ marginBottom: "16px" }}>
        {TIPO_TRAMITE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTipoActivo(tab.id)}
            className={`bdg-switch-btn ${tipoActivo === tab.id ? "is-active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bdg-filtros-card">

        {/* ── Buscador + etapas — solo en Quejas ── */}
        {isQuejas && (
          <>
            <div className="bdg-filtros-row">
              <div className="bdg-search-wrap">
                <Search className="bdg-search-icon" size={16} />
                <input
                  type="text"
                  className="bdg-search"
                  placeholder="Buscar por folio, expediente, quejoso o asunto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <div className="bdg-switch-bar">
              {ETAPAS.map((etapa, i) => (
                <button
                  key={etapa.key}
                  className={`bdg-switch-btn ${etapaActiva === etapa.key ? "is-active" : ""}`}
                  onClick={() => setEtapaActiva(etapa.key)}
                  style={{
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
        )}

        {/* ── Contenido Quejas ── */}
        {isQuejas && (
          cargando ? (
            <div className="bdg-empty"><p>Cargando...</p></div>
          ) : error ? (
            <div className="bdg-empty"><p>{error}</p></div>
          ) : (
            <TablaTramites tramites={tramites} tipoActivo={tipoActivo} />
          )
        )}

        {/* ── Contenido IRL — TablaTramites maneja su propio fetch interno ── */}
        {isIrl && (
          <TablaTramites tramites={[]} tipoActivo={tipoActivo} />
        )}

        {/* ── Asesoría Simplificada — próximamente ── */}
        {tipoActivo === "ASESORIA_SIMPLIFICADA" && (
          <div className="bdg-empty">
            <div className="bdg-empty-icon">📂</div>
            <p>Asesoría Simplificada estará disponible próximamente.</p>
          </div>
        )}

      </div>
    </div>
  );
};
