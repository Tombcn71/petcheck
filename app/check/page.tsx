"use client";
import { useState, useRef } from "react";
import Link from "next/link";

interface Result {
  summary?: string;
  isOk?: boolean;
  details?: string;
  advice?: string;
  error?: string;
}

interface Tool {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  bg: string;
}

const tools: Tool[] = [
  {
    id: "eyes",
    icon: "👁️",
    title: "Oog Check",
    description: "Check op irritatie of roodheid",
    color: "#0288D1",
    bg: "#E6F1FB",
  },
  {
    id: "poop",
    icon: "💩",
    title: "Ontlasting Analyse",
    description: "Detecteer afwijkingen in kleur",
    color: "#5D4037",
    bg: "#F1EFE8",
  },
  {
    id: "dental",
    icon: "🦷",
    title: "Gebit & Tandvlees",
    description: "Monitor tandsteen en tandvlees",
    color: "#388E3C",
    bg: "#EAF3DE",
  },
  {
    id: "skin",
    icon: "🐾",
    title: "Huid & Vacht",
    description: "Check op plekjes of irritatie",
    color: "#E65100",
    bg: "#FAEEDA",
  },
  {
    id: "bcs",
    icon: "⚖️",
    title: "Gewichts-check",
    description: "Beoordeel de BCS score",
    color: "#2E7D32",
    bg: "#F1F8E9",
  },
  {
    id: "pain",
    icon: "🐕",
    title: "Comfort Monitor",
    description: "AI-analyse van ongemak",
    color: "#D81B60",
    bg: "#FCE4EC",
  },
  {
    id: "coat",
    icon: "✨",
    title: "Vachtkwaliteit",
    description: "Beoordeel glans en conditie",
    color: "#FF8F00",
    bg: "#FFF8E1",
  },
  {
    id: "nose",
    icon: "🐶",
    title: "Neus Analyse",
    description: "Check op droogheid of korstjes",
    color: "#455A64",
    bg: "#ECEFF1",
  },
  {
    id: "ticks",
    icon: "🕷️",
    title: "Teken Spotter",
    description: "Identificeer teken en risico's",
    color: "#6A1B9A",
    bg: "#EEEDFE",
  },
  {
    id: "fleas",
    icon: "🦟",
    title: "Parasieten Check",
    description: "Spoor vlooien of mijten op",
    color: "#AD1457",
    bg: "#FBEAF0",
  },
  {
    id: "mange",
    icon: "🔬",
    title: "Huidinfecties",
    description: "Check op hotspots of schimmel",
    color: "#C62828",
    bg: "#FCEBEB",
  },
  {
    id: "ears",
    icon: "👂",
    title: "Oor Check",
    description: "Detecteer roodheid of mijt",
    color: "#00695C",
    bg: "#E1F5EE",
  },
];

export default function CheckPage() {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function analyze(toolId: string, file: File) {
    setLoading((prev) => ({ ...prev, [toolId]: true }));
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreviews((prev) => ({ ...prev, [toolId]: base64 }));

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, toolId }),
        });
        const data = await res.json();
        setResults((prev) => ({ ...prev, [toolId]: data }));
      } catch (err) {
        setResults((prev) => ({
          ...prev,
          [toolId]: { error: "Analyse mislukt." },
        }));
      } finally {
        setLoading((prev) => ({ ...prev, [toolId]: false }));
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      style={{
        background: "#F7F7FA",
        minHeight: "100vh",
        color: "#1A1A2E",
        fontFamily: "'DM Sans', sans-serif",
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap');
        .container { max-width: 1400px; margin: 0 auto; padding: 40px 24px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .card { background: #FFFFFF; border-radius: 24px; border: 1px solid #E8E8F0; padding: 24px; display: flex; flex-direction: column; transition: all 0.2s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
        .tool-head { display: flex; gap: 16px; margin-bottom: 20px; }
        .tool-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .tool-info h3 { font-family: 'Syne', sans-serif; font-size: 18px; margin-bottom: 4px; }
        .tool-info p { font-size: 13px; color: #8888AA; line-height: 1.4; }
        .preview { width: 100%; aspect-ratio: 16/10; background: #F3F3FA; border-radius: 16px; margin-bottom: 20px; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid #E8E8F0; position: relative; }
        .preview img { width: 100%; height: 100%; object-fit: cover; }
        .action-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 14px; }
        .result-box { margin-top: 16px; padding: 12px; border-radius: 12px; font-weight: 700; text-align: center; border: 1px solid; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .ai-details { margin-top: 12px; font-size: 13px; color: #4A4A68; line-height: 1.5; padding: 0 4px; }
        .ai-advice { margin-top: 10px; padding: 12px; background: #F9FAFB; border-radius: 10px; border: 1px solid #E8E8F0; font-size: 12px; color: #1A1A2E; border-left: 4px solid #1A1A2E; }
        .loader-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 2; font-weight: 700; color: #1A1A2E; }
        .disclaimer { margin-top: 40px; text-align: center; font-size: 12px; color: #AAAAAA; max-width: 800px; margin-inline: auto; line-height: 1.6; }
      `}</style>

      <main className="container">
        <header style={{ marginBottom: "40px" }}>
          <Link
            href="/dashboard"
            style={{
              color: "#6B6B8A",
              textDecoration: "none",
              fontSize: "14px",
              display: "block",
              marginBottom: "10px",
            }}>
            ← Dashboard
          </Link>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "36px",
              marginBottom: "8px",
            }}>
            Gezondheidscheck
          </h1>
          <p style={{ color: "#6B6B8A", fontSize: "18px" }}>
            AI-gestuurde analyse voor je hond.
          </p>
        </header>

        <div className="grid">
          {tools.map((tool) => {
            const res = results[tool.id];
            const isLoading = loading[tool.id];
            const preview = previews[tool.id];

            return (
              <div className="card" key={tool.id}>
                <div className="tool-head">
                  <div className="tool-icon" style={{ background: tool.bg }}>
                    {tool.icon}
                  </div>
                  <div className="tool-info">
                    <h3>{tool.title}</h3>
                    <p>{tool.description}</p>
                  </div>
                </div>

                <div className="preview">
                  {preview && <img src={preview} alt="Preview" />}
                  {!preview && !isLoading && (
                    <div
                      style={{
                        color: "#AAAACC",
                        textAlign: "center",
                        fontSize: "13px",
                      }}>
                      📸 Upload foto
                    </div>
                  )}
                  {isLoading && (
                    <div className="loader-overlay">Scannen...</div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={(el) => {
                    fileRefs.current[tool.id] = el;
                  }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) analyze(tool.id, file);
                  }}
                />

                <button
                  className="action-btn"
                  style={{ background: tool.bg, color: tool.color }}
                  onClick={() => fileRefs.current[tool.id]?.click()}
                  disabled={isLoading}>
                  {isLoading
                    ? "Bezig..."
                    : preview
                      ? "Nieuwe Foto"
                      : "Start Analyse"}
                </button>

                {res && !isLoading && !res.error && (
                  <div className="results-container">
                    <div
                      className="result-box"
                      style={{
                        background: res.isOk ? "#EAF3DE" : "#FCEBEB",
                        borderColor: res.isOk ? "#C0DD97" : "#F7C1C1",
                        color: res.isOk ? "#2E7D32" : "#C62828",
                      }}>
                      {res.summary}
                    </div>

                    <div className="ai-details">
                      <strong>Inzicht:</strong> {res.details}
                    </div>

                    {res.advice && (
                      <div className="ai-advice">
                        <strong>AI Advies:</strong> {res.advice}
                      </div>
                    )}
                  </div>
                )}

                {res?.error && (
                  <div
                    className="result-box"
                    style={{
                      background: "#FCEBEB",
                      color: "#C62828",
                      borderColor: "#F7C1C1",
                    }}>
                    {res.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="disclaimer">
          Let op: Deze check is een AI-ondersteuning en vervangt geen
          professioneel dierenartsadvies.
        </p>
      </main>
    </div>
  );
}
