import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useBandejaGestion } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/hooks/useBandejaGestion';
import { TablaTramites, TIPO_TRAMITE_TABS } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/TablaTramites';
import { esAsesor } from '@/shared/utils/sessionUtils';
import '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/bandeja-gestion.css';

export const BandejaGestionPage = () => {
  const [tipoActivo, setTipoActivo] = useState("QUEJAS_RECLAMACIONES");
  const usuarioEsAsesor = esAsesor(); // ← leer una vez al montar

  const isIrl    = tipoActivo === "REPRESENTACION_LEGAL_IRL";
  const isQuejas = tipoActivo === "QUEJAS_RECLAMACIONES";

  const {
    busqueda, setBusqueda,
    etapaActiva, setEtapaActiva,
    asesorSeleccionado, setAsesorSeleccionado,  // ← agregar
    asesores,                                    // ← agregar
    tramites, cargando, error, ETAPAS, recargar,
  } = useBandejaGestion({ enabled: isQuejas });

  useEffect(() => {
    if (isQuejas) recargar();
  }, [tipoActivo]);

  return (
    <div className="bdg-page">
      <div className="bdg-header">
        <div>
          <h1 className="bdg-title">Bandeja de Gestión</h1>
          <p className="bdg-subtitle">Monitoreo de plazos legales y atención ciudadana.</p>
        </div>
      </div>

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

              {/* ── Selector de asesor — solo visible para admin/comisionado ── */}
              {!usuarioEsAsesor && asesores.length > 0 && (
                <select
                  className="bdg-select"
                  value={asesorSeleccionado}
                  onChange={(e) => setAsesorSeleccionado(e.target.value)}
                  style={{ marginLeft: 8 }}
                >
                  <option value="">Todos los asesores</option>
                  {asesores.map((a) => (
                    <option
                      key={a.idAsesor ?? a.id}
                      value={a.idAsesor ?? a.id}
                    >
                      {a.nombreCompleto ?? a.nombre ?? a.usuarioLogin ?? `Asesor ${a.idAsesor}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="bdg-switch-bar">
              {ETAPAS.map((etapa, i) => (
                <button
                  key={etapa.key}
                  className={`bdg-switch-btn ${etapaActiva === etapa.key ? "is-active" : ""}`}
                  onClick={() => setEtapaActiva(etapa.key)}
                  style={{
                    borderRight: i < ETAPAS.length - 1
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

        {isQuejas && (
          cargando ? (
            <div className="bdg-empty"><p>Cargando...</p></div>
          ) : error ? (
            <div className="bdg-empty"><p>{error}</p></div>
          ) : (
            <TablaTramites tramites={tramites} tipoActivo={tipoActivo} />
          )
        )}

        {isIrl && (
          <TablaTramites tramites={[]} tipoActivo={tipoActivo} />
        )}

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