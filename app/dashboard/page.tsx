"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const tools = [
  {
    id: "eyes",
    icon: "👁️",
    title: "Eye Analysis",
    description: "Detect conjunctivitis, cataracts & eyelid problems",
    model: "dog-eye-problems-detection-qr6ld/1",
    color: "#0288D1",
    bg: "#E6F1FB",
    border: "#B5D4F4",
  },
  {
    id: "poop",
    icon: "💩",
    title: "Stool Analysis",
    description: "Detect blood, diarrhea, mucus & worms",
    model: "dog-poo-health-id/1",
    color: "#5D4037",
    bg: "#F1EFE8",
    border: "#D3D1C7",
  },
  {
    id: "dental",
    icon: "🦷",
    title: "Dental Health",
    description: "Detect tartar buildup & gum inflammation",
    model: "dog-dental/4",
    color: "#388E3C",
    bg: "#EAF3DE",
    border: "#C0DD97",
  },
  {
    id: "skin",
    icon: "🐾",
    title: "Skin Disease",
    description: "Detect bacterial, fungal & allergic conditions",
    model: "dog-skin-diseases/1",
    color: "#E65100",
    bg: "#FAEEDA",
    border: "#FAC775",
  },
  {
    id: "ticks",
    icon: "🕷️",
    title: "Tick Detection",
    description: "Identify tick species & potential Lyme risk",
    model: "ticks-ropwb/1",
    color: "#6A1B9A",
    bg: "#EEEDFE",
    border: "#CECBF6",
  },
  {
    id: "fleas",
    icon: "🦟",
    title: "Fleas & Parasites",
    description: "Detect fleas vs healthy skin",
    model: "fleas-vs.-healthy-dog-skin/1",
    color: "#AD1457",
    bg: "#FBEAF0",
    border: "#F4C0D1",
  },
  {
    id: "mange",
    icon: "🔬",
    title: "Mange & Ringworm",
    description: "Detect mange, hotspots & ringworm",
    model: "dog-skin-disease-detection-6pgvk/1",
    color: "#C62828",
    bg: "#FCEBEB",
    border: "#F7C1C1",
  },
  {
    id: "posture",
    icon: "🐕",
    title: "Posture Analysis",
    description: "Detect joint & spine alignment issues",
    model: "dog-pose/1",
    color: "#00695C",
    bg: "#E1F5EE",
    border: "#9FE1CB",
  },
];

type Result = {
  predictions?: Array<{ class: string; confidence: number }>;
  error?: string;
};

export default function PetCheck() {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function analyze(toolId: string, model: string, file: File) {
    setLoading((l) => ({ ...l, [toolId]: true }));
    setResults((r) => ({ ...r, [toolId]: {} }));

    // STAP 1: Verklein de afbeelding voor Vercel
    const resizeImage = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 800; // Genoeg voor AI, klein genoeg voor Vercel
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.7)); // 0.7 is 70% kwaliteit
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const resizedBase64 = await resizeImage(file);
      setPreviews((p) => ({ ...p, [toolId]: resizedBase64 }));

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: resizedBase64, model }),
      });

      const data = await res.json();
      setResults((r) => ({ ...r, [toolId]: data }));
    } catch (err) {
      console.error("Analysis error:", err);
      setResults((r) => ({ ...r, [toolId]: { error: "Analysis failed" } }));
    }
    setLoading((l) => ({ ...l, [toolId]: false }));
  }

  function getStatusInfo(result: Result) {
    if (!result?.predictions || result.predictions.length === 0)
      return { text: "No issues detected", ok: true };

    const criticalClasses = [
      "blood",
      "cherry",
      "tick",
      "flea",
      "mange",
      "tartar_4",
      "caries",
    ];
    const criticalIssue = result.predictions.find((p) =>
      criticalClasses.some((kw) => p.class.toLowerCase().includes(kw)),
    );

    if (criticalIssue) {
      return {
        text: `⚠ ${criticalIssue.class.toUpperCase()} (${Math.round(criticalIssue.confidence * 100)}%)`,
        ok: false,
      };
    }

    const realResult = result.predictions.find(
      (p) => !["teeth", "eye", "0", "box"].includes(p.class.toLowerCase()),
    );
    if (!realResult) return { text: "Healthy / Normal", ok: true };

    const ok = ["healthy", "normal"].some((kw) =>
      realResult.class.toLowerCase().includes(kw),
    );
    return {
      text: ok
        ? `Healthy (${Math.round(realResult.confidence * 100)}%)`
        : `${realResult.class} (${Math.round(realResult.confidence * 100)}%)`,
      ok,
    };
  }

  return (
    <div style={{ background: "#F7F7FA", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .navbar { background: #FFFFFF; border-bottom: 1px solid #E8E8F0; padding: 12px 40px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 10; }
        .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; text-decoration: none; color: #1A1A2E; display: flex; align-items: center; gap: 8px; }
        
        .container { max-width: 1400px; margin: 0 auto; padding: 40px 24px; }
        .header { margin-bottom: 40px; }
        .header h1 { font-family: 'Syne', sans-serif; font-size: 32px; margin-bottom: 8px; }
        .header p { color: #6B6B8A; font-size: 16px; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        
        .card { background: #FFFFFF; border-radius: 24px; border: 1px solid #E8E8F0; overflow: hidden; display: flex; flex-direction: column; transition: all 0.2s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
        .card-content { padding: 24px; flex-grow: 1; }
        
        .tool-head { display: flex; gap: 16px; margin-bottom: 20px; }
        .tool-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .tool-info h3 { font-family: 'Syne', sans-serif; font-size: 18px; margin-bottom: 4px; }
        .tool-info p { font-size: 13px; color: #8888AA; line-height: 1.4; }

        .preview { width: 100%; aspect-ratio: 16/10; background: #F3F3FA; border-radius: 16px; margin-bottom: 20px; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid #E8E8F0; }
        .preview img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder { color: #AAAACC; text-align: center; font-size: 12px; }

        .action-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
        .loading { font-size: 13px; color: #8888AA; text-align: center; margin-top: 12px; }
        
        .result { margin-top: 16px; padding: 12px; border-radius: 12px; font-weight: 600; font-size: 14px; text-align: center; border: 1px solid; }
        
        input[type="file"] { display: none; }
      `}</style>

      <nav className="navbar">
        <Link href="/" className="logo">
          <span>🐾</span> PetCheck
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
        <header className="header">
          <h1>Medical Dashboard</h1>
          <p>Select a health check and upload a clear photo of your dog.</p>
        </header>

        <div className="grid">
          {tools.map((tool) => {
            const result = results[tool.id];
            const isLoading = loading[tool.id];
            const preview = previews[tool.id];
            const si = result ? getStatusInfo(result) : null;

            return (
              <div className="card" key={tool.id}>
                <div className="card-content">
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
                      <div className="placeholder">Upload photo</div>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => {
                      fileRefs.current[tool.id] = el;
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) analyze(tool.id, tool.model, file);
                    }}
                  />

                  <button
                    className="action-btn"
                    style={{ background: tool.bg, color: tool.color }}
                    onClick={() => fileRefs.current[tool.id]?.click()}>
                    {isLoading
                      ? "Analyzing..."
                      : preview
                        ? "Change Photo"
                        : "Upload & Scan"}
                  </button>

                  {isLoading && (
                    <div className="loading">AI is identifying issues...</div>
                  )}

                  {si && !isLoading && (
                    <div
                      className="result"
                      style={{
                        background: si.ok ? "#EAF3DE" : "#FCEBEB",
                        borderColor: si.ok ? "#C0DD97" : "#F7C1C1",
                        color: si.ok ? "#2E7D32" : "#C62828",
                      }}>
                      {si.ok ? "✓" : "⚠"} {si.text}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
