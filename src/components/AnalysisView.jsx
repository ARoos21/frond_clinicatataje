// src/components/AnalysisView.jsx
import React from "react";
import {
  HeartPulse,
  Activity,
  AlertTriangle,
  CheckCircle,
  Utensils,
  Footprints,
  Sun,
  TrendingUp,
  FileText,
} from "lucide-react";
import { ResponsiveContainer, Cell, PieChart, Pie, Tooltip } from "recharts";
import "../styles/AnalysisView.css";

export const AnalysisView = ({ analysis, onReset }) => {
  const statusData = React.useMemo(() => {
    const counts = { Normal: 0, Alto: 0, Bajo: 0, Crítico: 0 };
    analysis.biomarkers.forEach((b) => {
      if (counts[b.status] !== undefined) counts[b.status]++;
    });
    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [analysis]);

  const COLORS = {
    Normal: "#10B981",
    Alto: "#F59E0B",
    Bajo: "#3B82F6",
    Crítico: "#EF4444",
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Normal": return <CheckCircle className="analysis-status-icon-normal" />;
      case "Alto": return <TrendingUp className="analysis-status-icon-high" />;
      case "Bajo": return <TrendingUp className="analysis-status-icon-low" />;
      case "Crítico": return <AlertTriangle className="analysis-status-icon-critical" />;
      default: return <Activity className="analysis-status-icon-default" />;
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case "diet": return <Utensils className="analysis-rec-icon" />;
      case "exercise": return <Footprints className="analysis-rec-icon" />;
      default: return <Sun className="analysis-rec-icon" />;
    }
  };

  return (
    <div className="analysis-container">
      {/* Header Summary */}
      <div className="analysis-summary-card">
        <div className="analysis-summary-content">
          <div className="analysis-summary-header">
            <span className="analysis-badge">Resumen IA</span>
            {analysis.date && <span className="analysis-date">{analysis.date}</span>}
          </div>
          <h2 className="analysis-title">Interpretación de Resultados</h2>
          <p className="analysis-summary-text">{analysis.summary}</p>
        </div>

        {/* Health Score */}
        <div className="analysis-score-card">
          <div className="analysis-score-circle">
            <svg className="analysis-score-svg">
              <circle
                cx="48"
                cy="48"
                r="40"
                className="analysis-score-track"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                className="analysis-score-progress"
                style={{
                  strokeDasharray: 251.2,
                  strokeDashoffset: 251.2 - (251.2 * analysis.overallHealthScore) / 100,
                }}
              />
            </svg>
            <div className="analysis-score-value">
              <span>{analysis.overallHealthScore}</span>
              <span className="analysis-score-label">Puntaje</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analysis-grid">
        {/* Biomarkers List */}
        <div className="analysis-biomarkers-section">
          <h3 className="analysis-section-title">
            <FileText className="analysis-section-icon" />
            Detalle de Biomarcadores
          </h3>

          <div className="analysis-biomarkers-list">
            {analysis.biomarkers.map((marker, idx) => (
              <div key={idx} className="analysis-biomarker-card">
                <div className="analysis-biomarker-header">
                  <div className="analysis-biomarker-icon">
                    {getStatusIcon(marker.status)}
                  </div>
                  <div className="analysis-biomarker-info">
                    <h4 className="analysis-biomarker-name">{marker.name}</h4>
                    <p className="analysis-biomarker-unit">{marker.unit}</p>
                  </div>
                  <div className="analysis-biomarker-value-container">
                    <span className="analysis-biomarker-value">{marker.value}</span>
                    <span className={`analysis-status-badge analysis-status-${marker.status.toLowerCase()}`}>
                      {marker.status}
                    </span>
                  </div>
                </div>
                <p className="analysis-biomarker-explanation">{marker.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Chart + Recommendations */}
        <div className="analysis-sidebar">
          {/* Pie Chart */}
          <div className="analysis-chart-card">
            <h3 className="analysis-chart-title">Resumen Visual</h3>
            <div className="analysis-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#ccc"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="analysis-chart-legend">
              {statusData.map((item) => (
                <div key={item.name} className="analysis-legend-item">
                  <div
                    className="analysis-legend-color"
                    style={{ backgroundColor: COLORS[item.name] }}
                  ></div>
                  <span>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="analysis-recommendations-card">
            <h3 className="analysis-recommendations-title">
              <HeartPulse className="analysis-rec-title-icon" />
              Recomendaciones
            </h3>
            <div className="analysis-recommendations-list">
              {analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="analysis-recommendation-item">
                  <div className="analysis-rec-type-icon">
                    {getRecommendationIcon(rec.type)}
                  </div>
                  <div className="analysis-rec-content">
                    <h4 className="analysis-rec-title">{rec.title}</h4>
                    <p className="analysis-rec-desc">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={onReset} className="analysis-reset-btn">
            Analizar otro documento
          </button>
        </div>
      </div>
    </div>
  );
};