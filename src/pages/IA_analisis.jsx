import React, { useState } from "react";
import { FileUploader } from "../components/FileUploader";
import { AnalysisView } from "../components/AnalysisView";
import { analyzeMedicalImage } from "../services/geminiService";
import {
  Brain,
  ShieldCheck,
  Stethoscope,
  Activity,
  ArrowRight,
} from "lucide-react";
import "../styles/IA_analisis.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const IA_analisis = () => {
  const [state, setState] = useState("idle");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const handleFileSelect = async (file) => {
    if (!file) return;
    setState("analyzing");
    setError("");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result;
        const result = await analyzeMedicalImage(base64, file.type);
        setAnalysis(result);
        setState("success");
      } catch (err) {
        console.error("Análisis fallido:", err);
        setError(
          "La imagen no pudo ser interpretada. Asegúrate de que sea clara, bien iluminada y contenga texto legible."
        );
        setState("error");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setState("idle");
    setAnalysis(null);
    setError("");
  };

  return (
    <div className="ia-root">
      <Header />

      <div className="ia-gradient-bg" />
      <main className="ia-wrapper">
        {state === "idle" && (
          <div className="ia-hero">
            <div className="ia-header">
              <h1 className="ia-heading">
                <span className="ia-heading-main">Interpretación Médica</span>
                <span className="ia-heading-ai">con IA</span>
              </h1>
              <p className="ia-lead">
                Sube cualquier resultado de laboratorio, informe o receta.
                <br className="hidden md:inline" />
                <span className="ia-lead-highlight">
                  Entiende tu salud en segundos.
                </span>
              </p>
            </div>

            <div className="ia-features-grid">
              {[
                {
                  icon: <Brain size={24} />,
                  title: "Explicación Clara",
                  desc: "Sin tecnicismos innecesarios.",
                },
                {
                  icon: <ShieldCheck size={24} />,
                  title: "Privacidad Total",
                  desc: "Tus datos se eliminan tras el análisis.",
                },
                {
                  icon: <Stethoscope size={24} />,
                  title: "Acción Inmediata",
                  desc: "Recomendaciones prácticas al instante.",
                },
              ].map((feature, i) => (
                <div key={i} className="ia-feature-card">
                  <div className="ia-feature-icon">{feature.icon}</div>
                  <div>
                    <h3 className="ia-feature-title">{feature.title}</h3>
                    <p className="ia-feature-desc">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Slot Moderno */}
            <div className="ia-upload-slot">
              <label
                htmlFor="file-upload"
                className="ia-upload-area"
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("ia-upload-dragover");
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("ia-upload-dragover");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("ia-upload-dragover");
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              >
                <div className="ia-upload-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 15V3M12 3L8 7M12 3L16 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 15H21M19 13V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="ia-upload-text">
                  <p>
                    <span className="ia-upload-highlight">Haz clic</span> o
                    arrastra tu documento médico aquí
                  </p>
                  <p className="ia-upload-subtext">
                    Admitidos: JPG, PNG, PDF (máx. 10 MB)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="ia-upload-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                    e.target.value = ""; // reset para permitir re-selección del mismo archivo
                  }}
                />
              </label>
            </div>
          </div>
        )}

        {state === "analyzing" && (
          <div className="ia-state-card">
            <div className="ia-analyze-animation">
              <div className="ia-analyze-circle">
                <Brain className="ia-analyze-icon" />
              </div>
              <div className="ia-analyze-pulse"></div>
            </div>
            <h2 className="ia-state-heading">Analizando tu documento médico</h2>
            <p className="ia-state-text">
              Extrayendo datos, comparando con estándares clínicos y generando
              tu informe personalizado...
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="ia-state-card ia-error">
            <div className="ia-error-icon">
              <Activity size={36} />
            </div>
            <h2 className="ia-state-heading">
              No pudimos procesar tu documento
            </h2>
            <p className="ia-state-text">{error}</p>
            <button
              onClick={handleReset}
              className="ia-btn-primary ia-btn-animated"
            >
              Reintentar <ArrowRight size={18} />
            </button>
          </div>
        )}

        {state === "success" && analysis && (
          <AnalysisView analysis={analysis} onReset={handleReset} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default IA_analisis;
