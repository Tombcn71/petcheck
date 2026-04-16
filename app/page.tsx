"use client";
import Link from "next/link";
import { Show, SignUpButton } from "@clerk/nextjs";

const features = [
  {
    icon: "👁️",
    title: "Oog Check",
    desc: "Controleer op staar, rode ogen en ontstekingen.",
  },
  {
    icon: "💩",
    title: "Ontlasting Analyse",
    desc: "Check op bloed, consistentie en tekenen van wormen.",
  },
  {
    icon: "🦷",
    title: "Gebit & Tandvlees",
    desc: "Monitor tandsteen en ontstoken tandvlees (gingivitis).",
  },
  {
    icon: "🐾",
    title: "Huid & Allergie",
    desc: "Herken schimmels, hotspots en allergische uitslag.",
  },
  {
    icon: "⚖️",
    title: "Gewicht & Conditie",
    desc: "Krijg advies over de Body Condition Score van je hond.",
  },
  {
    icon: "🤕",
    title: "Pijn Signalen",
    desc: "AI-analyse van de gezichtsuitdrukking voor acute pijn.",
  },
  {
    icon: "✨",
    title: "Vacht & Glans",
    desc: "Beoordeel doffe vacht en mogelijke voedingstekorten.",
  },
  {
    icon: "🐶",
    title: "Neus Check",
    desc: "Check op korsten, extreme droogheid of loopneuzen.",
  },
  {
    icon: "🦟",
    title: "Ongedierte Spotter",
    desc: "Vind vlooien en mijten tussen de haren van je hond.",
  },
  {
    icon: "🕷️",
    title: "Teken Identificatie",
    desc: "Identificeer de teek en bepaal het risico op Lyme.",
  },
  {
    icon: "👂",
    title: "Oor Gezondheid",
    desc: "Spoor oormijt en diepliggende ontstekingen op.",
  },
  {
    icon: "🔬",
    title: "Ringworm & Schurft",
    desc: "Maak direct onderscheid tussen verschillende parasieten.",
  },
];

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FFFFFF; color: #1A1A2E; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        
        .hero { max-width: 1200px; margin: 0 auto; padding: 100px 20px; text-align: center; }
        .badge { display: inline-block; padding: 6px 12px; background: #E6F1FB; color: #0288D1; border-radius: 100px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
        h1 { font-family: 'Syne', sans-serif; font-size: clamp(40px, 10vw, 72px); font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 24px; }
        h1 span { color: #4FC3F7; }
        .description { font-size: 19px; color: #6B6B8A; max-width: 600px; margin: 0 auto 40px; line-height: 1.6; }
        
        .btn-primary { 
          background: #1A1A2E; 
          color: #FFFFFF; 
          padding: 18px 40px; 
          border-radius: 14px; 
          font-weight: 700; 
          text-decoration: none; 
          font-size: 18px; 
          display: inline-block; 
          transition: transform 0.2s; 
          border: none; 
          cursor: pointer; 
        }
        .btn-primary:hover { transform: scale(1.05); }
        
        .feature-section { padding: 80px 20px; background: #F9FAFB; }
        .section-label { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 48px; text-align: center; letter-spacing: -1px; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
        .feat-card { background: #FFFFFF; padding: 32px; border-radius: 24px; border: 1px solid #E5E7EB; text-align: left; transition: all 0.3s; }
        .feat-card:hover { border-color: #4FC3F7; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .icon-box { font-size: 32px; margin-bottom: 20px; }
        .feat-card h3 { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 10px; }
        .feat-card p { color: #6B6B8A; font-size: 14px; line-height: 1.6; }
        
        footer { padding: 60px 20px; text-align: center; border-top: 1px solid #F3F4F6; color: #AAAAAA; font-size: 12px; line-height: 1.8; }
        .footer-logo { font-family: 'Syne', sans-serif; font-weight: 800; color: #1A1A2E; font-size: 16px; margin-bottom: 16px; display: block; text-decoration: none; }
      `}</style>

      {/* Navbar is nu weg uit de homepage omdat hij in layout.tsx staat */}

      <main className="hero">
        <div className="badge">Next-Gen Veterinary AI</div>
        <h1>
          Zorg voor je hond, <br />
          <span>simpel gemaakt.</span>
        </h1>
        <p className="description">
          De meest geavanceerde AI-tool voor hondenbezitters in Nederland.
          Analyseer symptomen en welzijn direct vanaf een foto.
        </p>

        <Show when="signed-out">
          <SignUpButton mode="modal">
            <button className="btn-primary">Start Gratis Check →</button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <Link href="/dashboard" className="btn-primary">
            Naar mijn Dashboard →
          </Link>
        </Show>
      </main>

      <section className="feature-section" id="features">
        <div className="feature-container">
          <h2 className="section-label">Medische Mogelijkheden</h2>
          <div className="grid">
            {features.map((f, i) => (
              <div className="feat-card" key={i}>
                <div className="icon-box">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <Link href="/" className="footer-logo">
          🐾 PetCheck.ai
        </Link>
        <p>
          © 2026 PetCheck AI. Voor informatieve doeleinden. <br />
          Vervangt geen professioneel dierenartsadvies.
        </p>
      </footer>
    </>
  );
}
