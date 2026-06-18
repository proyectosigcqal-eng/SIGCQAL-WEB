import { useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8081/SIGCQAL_dev";

const FECHA_HOY = new Date().toLocaleDateString("es-MX", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export const EditorCIR = ({ expediente, folioExpediente }) => {
  // ── Campos ROJOS — el usuario los llena ──────────────────────────────
  const [documentacionRemite, setDocumentacionRemite] = useState("");
  const [motivosRemite, setMotivosRemite] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [asesorQueRemite, setAsesorQueRemite] = useState("");

  const [generando, setGenerando] = useState(false);
  const [urlDocx, setUrlDocx] = useState(null);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  // ── Campos VERDES — vienen del expediente o sistema ──────────────────
  const folioExp =
    expediente?.folioGobierno ??
    expediente?.folio ??
    folioExpediente ??
    "[FOLIO]";

  const contribuyente =
    expediente?.nombreContribuyente ??
    expediente?.contribuyente ??
    "[CONTRIBUYENTE]";
    
  const autoridad = expediente?.autoridad ?? "[AUTORIDAD RESPONSABLE]";

  const handleGenerarCIR = async () => {
    if (!documentacionRemite || !motivosRemite) {
      setError(
        "La documentación que se remite y los motivos son obligatorios.",
      );
      return;
    }

    setGenerando(true);
    setError(null);
    setExito(false);

    try {
      const expedienteId = expediente?.id || 1;

      const payload = {
        documentacionRemite,
        motivosRemite,
        observaciones,
        asesorQueRemite: asesorQueRemite || "ASESOR EN TURNO",
        fechaCIR: FECHA_HOY,
        autoridadResponsable: autoridad,
        nombreEncargado: "LIC. JOSE DAVID RIVERA SESMA"
      };

      const res = await fetch(
        `${API}/api/v1/expedientes/${expedienteId}/constancia-interna-remision/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
      const errData = await res.json();
      setUrlDocx(errData.url ?? null);
      setExito(true);
    } catch (e) {
      setError("Error al generar la CIR: " + e.message);
    } finally {
      setGenerando(false);
    }
  };

  // ── Estilos reutilizables para inputs ──
  const inputStyle = {
    width: "100%",
    padding: "0.6rem",
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    fontFamily: "inherit",
    fontSize: "0.95rem",
    boxSizing: "border-box"
  };

  return (
    <section className="ca-card" style={{ background: "#fff", borderRadius: "8px", padding: "2rem", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <h2 className="ca-card-title" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        📋 Generador de Constancia Interna de Remisión
      </h2>

      {error && (
        <div className="ca-alert-error" style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "1rem", borderRadius: "4px", marginBottom: "1.5rem", fontWeight: "500" }}>
          {error}
        </div>
      )}

      {exito && (
        <div className="ca-alert-exito" style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "1rem", borderRadius: "4px", marginBottom: "1.5rem", fontWeight: "500", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>✓ Constancia generada correctamente. El archivo se ha descargado.</span>
          {urlDocx && (
            <a href={`${API}${urlDocx}`} target="_blank" rel="noreferrer" className="ca-btn-descargar" style={{ color: "#166534", textDecoration: "underline", fontWeight: "bold" }}>
              Descargar DOCX
            </a>
          )}
        </div>
      )}

      {/* Contenedor principal flex para forzar las dos columnas */}
      <div className="acci-layout" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "flex-start" }}>
        
        {/* ── Panel izquierdo: formulario (40% del ancho) ── */}
        <div className="acci-form-panel" style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h3 className="acci-form-title" style={{ fontSize: "1.1rem", fontWeight: "600", color: "#334155", margin: 0, borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem" }}>
            Datos de la Remisión
          </h3>

          {/* Datos verdes — solo lectura */}
          <div className="acci-info-readonly" style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "6px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
            <div className="acci-readonly-item" style={{ display: "grid", gridTemplateColumns: "120px 1fr" }}>
              <span className="acci-readonly-label" style={{ color: "#64748b", fontWeight: "500" }}>📅 Fecha:</span>
              <span className="acci-readonly-value" style={{ color: "#0f172a", fontWeight: "600" }}>{FECHA_HOY}</span>
            </div>
            <div className="acci-readonly-item" style={{ display: "grid", gridTemplateColumns: "120px 1fr" }}>
              <span className="acci-readonly-label" style={{ color: "#64748b", fontWeight: "500" }}>📋 Folio / Exp:</span>
              <span className="acci-readonly-value" style={{ color: "#0f172a", fontWeight: "600" }}>{folioExp}</span>
            </div>
            <div className="acci-readonly-item" style={{ display: "grid", gridTemplateColumns: "120px 1fr" }}>
              <span className="acci-readonly-label" style={{ color: "#64748b", fontWeight: "500" }}>👤 Contribuyente:</span>
              <span className="acci-readonly-value" style={{ color: "#0f172a", fontWeight: "600" }}>{contribuyente}</span>
            </div>
            <div className="acci-readonly-item" style={{ display: "grid", gridTemplateColumns: "120px 1fr" }}>
              <span className="acci-readonly-label" style={{ color: "#64748b", fontWeight: "500" }}>🏢 Autoridad:</span>
              <span className="acci-readonly-value" style={{ color: "#0f172a", fontWeight: "600" }}>{autoridad}</span>
            </div>
          </div>

          {/* Campos rojos — el usuario los llena */}
          <div className="ca-field" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#334155" }}>
              Documentación que se remite <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              value={documentacionRemite}
              onChange={(e) => setDocumentacionRemite(e.target.value)}
              placeholder="Ej: Carpeta de investigación, Oficio de la autoridad..."
            />
          </div>

          <div className="ca-field" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#334155" }}>
              Motivos por los que se remite <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              value={motivosRemite}
              onChange={(e) => setMotivosRemite(e.target.value)}
              placeholder="Ej: Para análisis jurídico, substanciación..."
            />
          </div>

          <div className="ca-field" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#334155" }}>
              Observaciones <span style={{ color: "#94a3b8", fontWeight: "normal" }}>(opcional)</span>
            </label>
            <textarea
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas para el área de representación legal..."
            />
          </div>

          <div className="ca-field" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#334155" }}>
              Asesor que remite <span style={{ color: "#94a3b8", fontWeight: "normal" }}>(opcional)</span>
            </label>
            <input
              type="text"
              style={inputStyle}
              value={asesorQueRemite}
              onChange={(e) => setAsesorQueRemite(e.target.value)}
              placeholder="Ej: Lic. Nombre del Asesor"
            />
          </div>

          <button
            className="ca-btn-guardar"
            onClick={handleGenerarCIR}
            disabled={generando}
            style={{
              backgroundColor: generando ? "#94a3b8" : "#1e3a8a",
              color: "#fff",
              padding: "0.8rem",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: generando ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
          >
            {generando ? "Generando CIR..." : "📄 Generar Constancia"}
          </button>
        </div>

        {/* ── Panel derecho: vista previa del documento (60% del ancho) ── */}
        <div className="acci-preview-panel" style={{ flex: "2 1 500px", backgroundColor: "#f1f5f9", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h3 className="acci-form-title" style={{ fontSize: "1.1rem", fontWeight: "600", color: "#334155", margin: "0 0 1rem 0" }}>
            Vista previa del documento
          </h3>

          <div className="acci-doc-wrap" style={{ display: "flex", justifyContent: "center" }}>
            <div
              className="acci-doc"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "750px", // Limita el ancho para que parezca una hoja A4
                minHeight: "950px",
                padding: "170px 60px 90px 60px",
                fontFamily: "'Montserrat', 'Arial', sans-serif",
                fontSize: "11pt",
                lineHeight: "1.6",
                color: "#000",
                backgroundColor: "#fff",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", // Sombra tipo papel
                boxSizing: "border-box"
              }}
            >
              {/* Membrete */}
              <img
                src="/src/assets/membrete.jpg"
                alt="Membrete"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  objectPosition: "top",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 1, textAlign: "justify" }}>
                
                {/* ── Encabezado tipo tabla del CIR ── */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      border: "1px solid #000",
                      padding: "10px",
                      width: "65%",
                      fontSize: "9.5pt",
                      lineHeight: "1.4",
                      fontFamily: "inherit",
                    }}
                  >
                    <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "5px" }}>
                      CONSTANCIA INTERNA DE REMISIÓN
                    </div>
                    <div>
                      <strong>Folio:</strong>{" "}
                      <span style={{ color: "#16a34a", fontWeight: 600 }}>{folioExp}</span>
                    </div>
                    <div>
                      <strong>Contribuyente:</strong>{" "}
                      <span style={{ color: "#16a34a", fontWeight: 600 }}>{contribuyente}</span>
                    </div>
                    <div>
                      <strong>Fecha:</strong>{" "}
                      <span style={{ color: "#16a34a", fontWeight: 600 }}>{FECHA_HOY}</span>
                    </div>
                  </div>
                </div>

                <p style={{ marginBottom: "1rem" }}>
                  En la ciudad de Zacatecas, siendo las _____ horas del día{" "}
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>{FECHA_HOY}</span>, 
                  el suscrito{" "}
                  <span style={{ color: "#dc2626", fontWeight: 600 }}>
                    {asesorQueRemite || "[ASESOR QUE REMITE]"}
                  </span>
                  , hace constar la remisión del expediente citado al rubro al área de{" "}
                  <strong>Representación Legal y Defensa</strong>.
                </p>

                <p style={{ marginBottom: "1rem" }}>
                  Se acompaña a la presente la siguiente documentación:
                </p>

                <p
                  style={{
                    paddingLeft: "20px",
                    fontStyle: "italic",
                    color: documentacionRemite ? "#dc2626" : "#64748b",
                    marginBottom: "1rem",
                    backgroundColor: "#f8fafc",
                    padding: "10px",
                    borderLeft: "3px solid #1e3a8a",
                  }}
                >
                  {documentacionRemite ||
                    "[Describa aquí la documentación que se remite...]"}
                </p>

                <p style={{ marginBottom: "1rem" }}>
                  Lo anterior con el motivo de:{" "}
                  <span style={{ textDecoration: "underline", color: "#dc2626", fontWeight: 600 }}>
                    {motivosRemite || "[Motivos por los que se remite...]"}
                  </span>
                  .
                </p>

                <p style={{ marginBottom: "0.8rem" }}>
                  <strong>I. Recepción.</strong> Se da por recibido el
                  expediente y anexos descritos para su trámite.
                </p>

                <p style={{ marginBottom: "0.8rem" }}>
                  <strong>II. Observaciones.</strong>{" "}
                  <span style={{ color: observaciones ? "#dc2626" : "#000" }}>
                    {observaciones || "Sin observaciones."}
                  </span>
                </p>

                <div style={{ textAlign: "center", marginBottom: "3rem", marginTop: "3rem" }}>
                  <strong>ATENTAMENTE</strong>
                  <br />
                  <br />
                  <br />
                  <strong>LIC. ENCARGADO DEL ÁREA</strong>
                  <br />
                  <span style={{ fontSize: "0.9em" }}>
                    Comisión Estatal de la Defensa del Contribuyente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};