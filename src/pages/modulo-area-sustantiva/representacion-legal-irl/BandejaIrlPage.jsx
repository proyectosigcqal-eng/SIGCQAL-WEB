// pages/modulo-area-sustantiva/representacion-legal-irl/BandejaIrlPage.jsx

import { useBandejaIrl } from "@/features/modulo-area-sustantiva/representacion-legal-irl/hooks/useBandejaIrl";
import { TablaIrl } from "@/features/modulo-area-sustantiva/representacion-legal-irl/components/TablaIrl";

/**
 * Página standalone para la Bandeja de Representación Legal IRL.
 *
 * Una vez validada visualmente, integra TablaIrl dentro del tab
 * "REPRESENTACION_LEGAL_IRL" de TablaTramites.jsx y elimina esta página.
 */
export default function BandejaIrlPage() {
  const {
    busqueda,
    setBusqueda,
    subSwitchActivo,
    setSubSwitchActivo,
    items,
    cargando,
    error,
    SUB_SWITCHES,
  } = useBandejaIrl();

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
          Bandeja de Representación Legal IRL
        </h1>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#6b7280",
            margin: "0.25rem 0 0",
          }}
        >
          IRL Asignación Directa e IRL Evolución
        </p>
      </div>

      <TablaIrl
        subSwitchActivo={subSwitchActivo}
        setSubSwitchActivo={setSubSwitchActivo}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        items={items}
        cargando={cargando}
        error={error}
        SUB_SWITCHES={SUB_SWITCHES}
      />
    </div>
  );
}
