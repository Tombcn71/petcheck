"use client";
import Link from "next/link";

const stats = [
  { label: "Laatste Scan", value: "2 dagen geleden" },
  { label: "Gezondheidsstatus", value: "Uitstekend ✨" },
  { label: "Actieve meldingen", value: "Geen" },
];

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
        .welcome-header { margin-bottom: 40px; }
        .welcome-header h1 { font-family: 'Syne', sans-serif; font-size: 32px; margin-bottom: 8px; }
        .welcome-header p { color: #6B6B8A; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: #F9FAFB; padding: 20px; border-radius: 16px; border: 1px solid #F3F4F6; }
        .stat-card span { font-size: 13px; color: #6B6B8A; display: block; margin-bottom: 4px; }
        .stat-card strong { font-size: 18px; color: #1A1A2E; }

        .action-card { 
          background: #1A1A2E; color: white; padding: 40px; border-radius: 24px; 
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 40px;
        }
        .btn-scan { 
          background: #4FC3F7; color: #1A1A2E; padding: 16px 32px; 
          border-radius: 12px; font-weight: 700; text-decoration: none; 
        }
      `}</style>

      <header className="welcome-header">
        <h1>Welkom terug, Buddy 🐾</h1>
        <p>Hier is de actuele gezondheid van je hond.</p>
      </header>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <span>{s.label}</span>
            <strong>{s.value}</strong>
          </div>
        ))}
      </div>

      <div className="action-card">
        <div>
          <h2>Nieuwe Gezondheidscheck</h2>
          <p style={{ opacity: 0.8 }}>
            Scan ogen, gebit, huid of ontlasting in seconden.
          </p>
        </div>
        <Link href="/check" className="btn-scan">
          Start Diagnose →
        </Link>
      </div>

      <section>
        <h3 style={{ marginBottom: "20px", fontFamily: "Syne" }}>
          Recente Historie
        </h3>
        <div
          style={{
            color: "#6B6B8A",
            textAlign: "center",
            padding: "40px",
            background: "#F9FAFB",
            borderRadius: "16px",
          }}>
          Nog geen eerdere scans gevonden.
        </div>
      </section>
    </div>
  );
}
