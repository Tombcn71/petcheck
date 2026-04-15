"use client";
import { useState, useRef } from "react";
import Link from "next/link";

// De interface is nu simpeler en gericht op AI-uitleg
interface Result {
  summary?: string;
  isOk?: boolean;
  details?: string;
  advice?: string;
  confidence?: number;
  error?: string;
}

const tools = [
  {
    id: "eyes",
    icon: "👁️",
    title: "Eye Analysis",
    description: "Detect cataracts, conjunctivitis & eyelid problems",
    color: "#0288D1",
    bg: "#E6F1FB",
  },
  {
    id: "poop",
    icon: "💩",
    title: "Stool Analysis",
    description: "Detect blood, diarrhea, mucus & worms",
    color: "#5D4037",
    bg: "#F1EFE8",
  },
  {
    id: "dental",
    icon: "🦷",
    title: "Dental Health",
    description: "Monitor tartar buildup & gum inflammation",
    color: "#388E3C",
    bg: "#EAF3DE",
  },
  {
    id: "skin",
    icon: "🐾",
    title: "Skin Disease",
    description: "Detect bacterial, fungal & allergic reactions",
    color: "#E65100",
    bg: "#FAEEDA",
  },
  {
    id: "bcs",
    icon: "⚖️",
    title: "Body Condition",
    description: "Evaluate weight levels & ideal body shape",
    color: "#2E7D32",
    bg: "#F1F8E9",
  },
  {
    id: "pain",
    icon: "🐕",
    title: "Pain Indicator",
    description: "Analyze facial expressions for signs of pain",
    color: "#D81B60",
    bg: "#FCE4EC",
  },
  {
    id: "coat",
    icon: "✨",
    title: "Coat Lustre",
    description: "Assess fur health, shine and vitality",
    color: "#FF8F00",
    bg: "#FFF8E1",
  },
  {
    id: "nose",
    icon: "🐶",
    title: "Nose Analysis",
    description: "Check for hyperkeratosis, dryness & secretions",
    color: "#455A64",
    bg: "#ECEFF1",
  },
  {
    id: "ticks",
    icon: "🕷️",
    title: "Tick Detection",
    description: "Identify tick species & Lyme risk",
    color: "#6A1B9A",
    bg: "#EEEDFE",
  },
  {
    id: "fleas",
    icon: "🦟",
    title: "Fleas & Parasites",
    description: "Spot hidden fleas and skin parasites",
    color: "#AD1457",
    bg: "#FBEAF0",
  },
  {
    id: "mange",
    icon: "🔬",
    title: "Mange & Ringworm",
    description: "Detect mange, hotspots & ringworm",
    color: "#C62828",
    bg: "#FCEBEB",
  },
  {
    id: "posture",
    icon: "🦴",
    title: "Posture Analysis",
    description: "Detect joint & spine alignment issues",
    color: "#00695C",
    bg: "#E1F5EE",
  },
];

export default function PetCheck() {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function analyze(toolId: string, file: File) {
    setLoading((l) => ({ ...l, [toolId]: true }));

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreviews((p) => ({ ...p, [toolId]: base64 }));

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, toolId }), // We sturen nu toolId ipv model
        });
        const data = await res.json();
        setResults((r) => ({ ...r, [toolId]: data }));
      } catch (err) {
        setResults((r) => ({ ...r, [toolId]: { error: "Analysis failed" } }));
      }
      setLoading((l) => ({ ...l, [toolId]: false }));
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
        .navbar { background: #FFFFFF; border-bottom: 1px solid #E8E8F0; padding: 12px 40px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 10; }
        .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; text-decoration: none; color: #1A1A2E; display: flex; align-items: center; gap: 8px; }
        .container { max-width: 1400px; margin: 0 auto; padding: 40px 24px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .card { background: #FFFFFF; border-radius: 24px; border: 1px solid #E8E8F0; padding: 24px; transition: all 0.2s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
        .tool-head { display: flex; gap: 16px; margin-bottom: 20px; }
        .tool-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .tool-info h3 { font-family: 'Syne', sans-serif; font-size: 18px; margin-bottom: 4px; }
        .tool-info p { font-size: 13px; color: #8888AA; line-height: 1.4; }
        .preview { width: 100%; aspect-ratio: 16/10; background: #F3F3FA; border-radius: 16px; margin-bottom: 20px; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid #E8E8F0; }
        .preview img { width: 100%; height: 100%; object-fit: cover; }
        .action-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .result-box { margin-top: 16px; padding: 12px; border-radius: 12px; font-weight: 700; text-align: center; border: 1px solid; font-size: 14px; }
        .ai-details { margin-top: 12px; font-size: 13px; color: #4A4A68; line-height: 1.5; }
        .ai-advice { margin-top: 10px; padding: 12px; background: #F9FAFB; border-radius: 10px; border: 1px solid #E8E8F0; font-size: 12px; color: #1A1A2E; }
      `}</style>

      <nav className="navbar">
        <Link href="/" className="logo">
          <span>🐾</span> PetCheck AI
        </Link>
        <Link
          href="/"
          style={{
            fontSize: "14px",
            color: "#6B6B8A",
            textDecoration: "none",
          }}>
          Back to Home
        </Link>
      </nav>

      <main className="container">
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "32px" }}>
            Medical Dashboard
          </h1>
          <p style={{ color: "#6B6B8A" }}>
            AI-powered health diagnostics for your dog.
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
                  {preview ? (
                    <img src={preview} alt="Preview" />
                  ) : (
                    <div
                      style={{
                        color: "#AAAACC",
                        textAlign: "center",
                        fontSize: "12px",
                      }}>
                      📸 Upload photo
                    </div>
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
                  onClick={() => fileRefs.current[tool.id]?.click()}>
                  {isLoading
                    ? "AI is thinking..."
                    : preview
                      ? "Change Photo"
                      : "Start Scan"}
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
                      <strong>Analysis:</strong> {res.details}
                    </div>

                    {res.advice && (
                      <div className="ai-advice">
                        <strong>AI Advice:</strong> {res.advice}
                      </div>
                    )}
                  </div>
                )}
                {res?.error && (
                  <div
                    className="result-box"
                    style={{ background: "#FCEBEB", color: "#C62828" }}>
                    {res.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
