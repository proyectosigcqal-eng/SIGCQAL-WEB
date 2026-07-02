import { useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8081/SIGCQAL_dev";

const FECHA_HOY = new Date().toLocaleDateString("es-MX", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export const EditorCIR = ({ expediente, folioExpediente }) => {
  // ── Campos del formulario ──────────────────────────────
  const [areaQueRemite, setAreaQueRemite] = useState("Asesoría");
  const [areaQueRecibe, setAreaQueRecibe] = useState(
    "Departamento de Quejas, Recomendaciones, Medidas Correctivas y Sanciones",
  );
  const [servicioPrestado, setServicioPrestado] = useState("Asesoría");

  const [documentacionRemite, setDocumentacionRemite] = useState("");
  const [motivosRemite, setMotivosRemite] = useState("");
  const [fundamentos, setFundamentos] = useState(
    "Lo anterior con fundamento en lo dispuesto por los artículos 1, 22, 25 fracción I, III, 26, 37, 38 , 39 y 40 de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios; en relación con el 2, 6 fracciones I, IV, 7 fracción II, inciso a), 26 fracción VII, 27 fracciones I, II, 28 fracciones I, V, VI, VIII, X y XIII, y 39 fracciones II y VI, del Estatuto Orgánico de la Comisión Estatal de la Defensa del Contribuyente, así como el 1, 5, 30 fracción IV, 56, 57, 58 de los Lineamientos Generales de Actuación de la Comisión Estatal de la Defensa del Contribuyente.",
  );
  const [observaciones, setObservaciones] = useState("");

  const [asesorQueRemite, setAsesorQueRemite] = useState("");
  const [asesorQueRecibe, setAsesorQueRecibe] = useState("");
  const [nombreTitular, setNombreTitular] = useState(
    "LIC. JOSE DAVID RIVERA SESMA",
  );

  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  // ── Campos del sistema (verdes) ──────────────────────
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
      const expedienteId =
        expediente?.id_expediente ||
        expediente?.idExpediente ||
        expediente?.id;

      if (!expedienteId) {
        setError(
          "Error critico: No se pudo encontrar el ID del expediente en el sistema.",
        );
        return;
      }

      // ✅ CORRECCIÓN: se envían TODOS los campos al backend.
      // Los 4 que faltaban (areaQueRemite, areaQueRecibe, servicioPrestado,
      // asesorQueRecibe) son leídos en construirVariablesTemplate() para
      // rellenar {{AREA_QUE_REMITE}}, {{AREA_QUE_RECIBE}},
      // {{SERVICIO_PREVIO}} y {{NOMBRE_ASESOR_RECIBE}} en el docx.
      const payload = {
        documentacionRemite,
        motivosRemite,
        fundamentos,
        observaciones,
        areaQueRemite,                              // ← antes faltaba
        areaQueRecibe,                              // ← antes faltaba
        servicioPrestado,                           // ← antes faltaba
        asesorQueRemite: asesorQueRemite || "ASESOR EN TURNO",
        asesorQueRecibe,                            // ← antes faltaba
        nombreEncargado: nombreTitular,
      };

      const res = await fetch(
        `${API}/api/v1/expedientes/${expedienteId}/constancia-interna-remision/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Error del servidor: ${res.status}`);
      }

      // Descarga directa del Blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "Constancia_Interna_Remision.docx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExito(true);
    } catch (e) {
      setError("Error al generar la CIR: " + e.message);
    } finally {
      setGenerando(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    fontFamily: "inherit",
    fontSize: "0.9rem",
    boxSizing: "border-box",
  };

  return (
    <section
      className="ca-card"
      style={{
        background: "#fff",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <h2
        style={{
          fontSize: "1.4rem",
          fontWeight: "bold",
          color: "#1e293b",
          margin: "0 0 1rem 0",
        }}
      >
        📋 Generador de Constancia Interna de Remisión
      </h2>

      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            padding: "1rem",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}
      {exito && (
        <div
          style={{
            backgroundColor: "#dcfce7",
            color: "#166534",
            padding: "1rem",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          ✓ Constancia generada y descargada correctamente.
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          alignItems: "flex-start",
        }}
      >
        {/* ── PANEL IZQUIERDO: FORMULARIO COMPLETO ── */}
        <div
          style={{
            flex: "1 1 380px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Bloque Verde (Solo Lectura) */}
          <div
            style={{
              backgroundColor: "#f0fdf4",
              padding: "1rem",
              borderRadius: "6px",
              border: "1px solid #bbf7d0",
              fontSize: "0.9rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "0.4rem 1rem",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#166534", fontWeight: "600" }}>
                📅 Fecha:
              </span>
              <span style={{ fontWeight: "500" }}>{FECHA_HOY}</span>
              <span style={{ color: "#166534", fontWeight: "600" }}>
                📋 Folio:
              </span>
              <span style={{ fontWeight: "500" }}>{folioExp}</span>
              <span style={{ color: "#166534", fontWeight: "600" }}>
                👤 Contribuyente:
              </span>
              <span style={{ fontWeight: "500" }}>{contribuyente}</span>
              <span style={{ color: "#166534", fontWeight: "600" }}>
                🏢 Autoridad:
              </span>
              <span style={{ fontWeight: "500" }}>{autoridad}</span>
            </div>
          </div>

          <div
            style={{
              height: "1px",
              background: "#e2e8f0",
              margin: "0.5rem 0",
            }}
          />
          <h3 style={{ margin: 0, fontSize: "1rem", color: "#475569" }}>
            Datos de la Remisión
          </h3>

          {/* Inputs Dobles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
                Área que remite
              </label>
              <input
                type="text"
                style={inputStyle}
                value={areaQueRemite}
                onChange={(e) => setAreaQueRemite(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
                Área que recibe
              </label>
              <input
                type="text"
                style={inputStyle}
                value={areaQueRecibe}
                onChange={(e) => setAreaQueRecibe(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Servicio prestado previamente
            </label>
            <input
              type="text"
              style={inputStyle}
              value={servicioPrestado}
              onChange={(e) => setServicioPrestado(e.target.value)}
            />
          </div>

          {/* Textareas Principales */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Documentación que se remite{" "}
              <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={documentacionRemite}
              onChange={(e) => setDocumentacionRemite(e.target.value)}
              placeholder="Ej: Copia de Solicitud, IFE, Requerimiento..."
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Motivos por los que se remite{" "}
              <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={motivosRemite}
              onChange={(e) => setMotivosRemite(e.target.value)}
              placeholder="Ej: Para el pertinente análisis y solución del asunto..."
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Fundamentos (Artículos)
            </label>
            <textarea
              rows={4}
              style={{ ...inputStyle, resize: "vertical", fontSize: "0.8rem" }}
              value={fundamentos}
              onChange={(e) => setFundamentos(e.target.value)}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Observaciones
            </label>
            <textarea
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

          <div
            style={{
              height: "1px",
              background: "#e2e8f0",
              margin: "0.5rem 0",
            }}
          />
          <h3 style={{ margin: 0, fontSize: "1rem", color: "#475569" }}>
            Firmas
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
                Asesor que remite
              </label>
              <input
                type="text"
                style={inputStyle}
                value={asesorQueRemite}
                onChange={(e) => setAsesorQueRemite(e.target.value)}
                placeholder="Nombre del Asesor"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
                Asesor que recibe
              </label>
              <input
                type="text"
                style={inputStyle}
                value={asesorQueRecibe}
                onChange={(e) => setAsesorQueRecibe(e.target.value)}
                placeholder="Nombre del Asesor"
              />
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Titular que Autoriza
            </label>
            <input
              type="text"
              style={inputStyle}
              value={nombreTitular}
              onChange={(e) => setNombreTitular(e.target.value)}
            />
          </div>

          <button
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
              marginTop: "0.5rem",
            }}
          >
            {generando
              ? "Generando CIR..."
              : "📄 Generar y Descargar Constancia"}
          </button>
        </div>

        {/* ── PANEL DERECHO: VISTA PREVIA OFICIAL ── */}
        <div
          style={{
            flex: "2 1 500px",
            backgroundColor: "#f1f5f9",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            position: "sticky",
            top: "1rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "#334155",
              margin: "0 0 1rem 0",
              textAlign: "center",
            }}
          >
            Vista Previa
          </h3>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "700px",
                minHeight: "900px",
                padding: "140px 50px 50px 50px",
                fontFamily: "'Arial', sans-serif",
                fontSize: "10pt",
                lineHeight: "1.4",
                color: "#000",
                backgroundColor: "#fff",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                boxSizing: "border-box",
              }}
            >
              <img
                src="/src/assets/membrete.jpg"
                alt="Membrete"
                onError={(e) => (e.target.style.display = "none")}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "130px",
                  objectFit: "cover",
                  objectPosition: "top",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Encabezado Oficial */}
                <div
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    marginBottom: "1rem",
                    fontSize: "9.5pt",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      marginBottom: "6px",
                      fontSize: "11pt",
                    }}
                  >
                    CONSTANCIA INTERNA DE REMISIÓN
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "4px",
                    }}
                  >
                    <div>
                      <strong>Nº de Folio:</strong> {folioExp}
                    </div>
                    <div>
                      <strong>Contribuyente:</strong> {contribuyente}
                    </div>
                  </div>
                  <div style={{ marginTop: "4px" }}>
                    Zacatecas, Zac., a {FECHA_HOY}
                  </div>
                </div>

                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Área que remite:</strong>{" "}
                  <span style={{ color: "#dc2626" }}>{areaQueRemite}</span>
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Área que recibe:</strong>{" "}
                  <span style={{ color: "#dc2626" }}>{areaQueRecibe}</span>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <strong>Servicio prestado previamente:</strong>{" "}
                  <span style={{ color: "#dc2626" }}>{servicioPrestado}</span>
                </div>

                <div style={{ marginBottom: "0.4rem", fontWeight: "bold" }}>
                  Documentación que se remite:
                </div>
                <div
                  style={{
                    paddingLeft: "20px",
                    marginBottom: "1rem",
                    whiteSpace: "pre-wrap",
                    color: documentacionRemite ? "#000" : "#94a3b8",
                    fontStyle: documentacionRemite ? "normal" : "italic",
                  }}
                >
                  {documentacionRemite || "[Ingrese la documentación]"}
                </div>

                <div style={{ marginBottom: "0.4rem", fontWeight: "bold" }}>
                  Motivos por los que se remite y solicita el servicio:
                </div>
                <div
                  style={{
                    paddingLeft: "20px",
                    marginBottom: "1rem",
                    color: motivosRemite ? "#000" : "#94a3b8",
                    fontStyle: motivosRemite ? "normal" : "italic",
                  }}
                >
                  {motivosRemite || "[Ingrese los motivos]"}
                </div>

                <div
                  style={{
                    marginBottom: "1.5rem",
                    fontSize: "9pt",
                    textAlign: "justify",
                  }}
                >
                  {fundamentos}
                </div>

                <div style={{ marginBottom: "0.4rem", fontWeight: "bold" }}>
                  Observaciones:
                </div>
                <div
                  style={{
                    paddingLeft: "20px",
                    marginBottom: "3rem",
                    color: observaciones ? "#000" : "#94a3b8",
                  }}
                >
                  {observaciones || "Ninguna."}
                </div>

                {/* Tabla de Firmas */}
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "30px",
                    fontSize: "9pt",
                  }}
                >
                  <thead>
                    <tr
                      style={{ borderBottom: "1px solid #000", height: "20px" }}
                    >
                      <th
                        style={{
                          width: "33%",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        Nombre y firma de Asesor
                      </th>
                      <th
                        style={{
                          width: "33%",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        Nombre y firma de Asesor
                      </th>
                      <th
                        style={{
                          width: "33%",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        Nombre y firma del Titular
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ height: "80px" }}>
                      <td
                        style={{
                          textAlign: "center",
                          verticalAlign: "bottom",
                          fontWeight: "bold",
                          color: "#dc2626",
                        }}
                      >
                        {asesorQueRemite || "[Remite]"}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          verticalAlign: "bottom",
                          fontWeight: "bold",
                          color: "#dc2626",
                        }}
                      >
                        {asesorQueRecibe || "[Recibe]"}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          verticalAlign: "bottom",
                          fontWeight: "bold",
                          color: "#dc2626",
                        }}
                      >
                        {nombreTitular || "[Autorizó]"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
