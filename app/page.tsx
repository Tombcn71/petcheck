"use client";
import Link from "next/link";

const features = [
  {
    icon: "👁️",
    title: "Eye Analysis",
    desc: "Detect cataracts, conjunctivitis & eyelid problems.",
  },
  {
    icon: "💩",
    title: "Stool Analysis",
    desc: "Identify blood, parasites and digestive issues.",
  },
  {
    icon: "🦷",
    title: "Dental Health",
    desc: "Monitor tartar buildup and gum inflammation.",
  },
  {
    icon: "🐾",
    title: "Skin Diseases",
    desc: "Check for fungal, bacterial & allergic reactions.",
  },
  {
    icon: "⚖️",
    title: "Body Condition",
    desc: "Evaluate weight levels and ideal body shape scores.",
  },
  {
    icon: "🤕",
    title: "Pain Indicator",
    desc: "Analyze facial expressions for signs of acute pain.",
  },
  {
    icon: "✨",
    title: "Coat Lustre",
    desc: "Assess fur health, shine and nutritional vitality.",
  },
  {
    icon: "🐶",
    title: "Nose Analysis",
    desc: "Check for hyperkeratosis, dryness and secretions.",
  },
  {
    icon: "🦟",
    title: "Fleas & Parasites",
    desc: "Spot hidden fleas and skin parasites instantly.",
  },
  {
    icon: "🕷️",
    title: "Tick Species",
    desc: "Identify tick types and potential Lyme disease risk.",
  },
  // RUIL: Posture is nu Ear Health
  {
    icon: "👂",
    title: "Ear Health",
    desc: "Detect ear mites, infections and inflammatory issues.",
  },
  {
    icon: "🔬",
    title: "Mange & Ringworm",
    desc: "Differentiate between mange, hotspots and more.",
  },
];

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FFFFFF; color: #1A1A2E; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        
        .navbar-wrapper {
          width: 100%;
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #F3F4F6;
          z-index: 100;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .nav-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-logo-icon { font-size: 20px; background: #4FC3F7; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
        .nav-logo-text { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #1A1A2E; letter-spacing: -0.5px; }

        .nav-links { display: flex; gap: 24px; align-items: center; }
        .nav-links a { text-decoration: none; color: #6B6B8A; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        
        @media (max-width: 640px) {
          .nav-links a:not(.btn-nav) { display: none; }
          .navbar { padding: 10px 16px; }
        }

        .btn-nav {
          background: #1A1A2E;
          color: #FFFFFF !important;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          font-size: 13px;
        }

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
        }
        .btn-primary:hover { transform: scale(1.05); }
        
        .feature-section { padding: 80px 20px; background: #F9FAFB; }
        .section-label { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 48px; text-align: center; letter-spacing: -1px; }
        
        .grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 20px; 
          max-width: 1200px; 
          margin: 0 auto; 
        }
        .feat-card { background: #FFFFFF; padding: 32px; border-radius: 24px; border: 1px solid #E5E7EB; text-align: left; transition: all 0.3s; }
        .feat-card:hover { border-color: #4FC3F7; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .icon-box { font-size: 32px; margin-bottom: 20px; }
        .feat-card h3 { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 10px; }
        .feat-card p { color: #6B6B8A; font-size: 14px; line-height: 1.6; }
        
        footer { padding: 60px 20px; text-align: center; border-top: 1px solid #F3F4F6; color: #AAAAAA; font-size: 12px; line-height: 1.8; }
        .footer-logo { font-family: 'Syne', sans-serif; font-weight: 800; color: #1A1A2E; font-size: 16px; margin-bottom: 16px; display: block; text-decoration: none; }
      `}</style>

      <div className="navbar-wrapper">
        <nav className="navbar">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">🐾</div>
            <span className="nav-logo-text">PetCheck.ai</span>
          </Link>
          <div className="nav-links">
            <a href="#features">Features</a>
            <Link href="/dashboard" className="btn-nav">
              Launch App
            </Link>
          </div>
        </nav>
      </div>

      <main className="hero">
        <div className="badge">Next-Gen Veterinary AI</div>
        <h1>
          Care for your dog, <br />
          <span>simplified.</span>
        </h1>
        <p className="description">
          The most advanced multimodal diagnostic tool for dog owners. Analyze
          symptoms, posture, and wellness from a single photo.
        </p>
        <Link href="/dashboard" className="btn-primary">
          Open Diagnostic Tool →
        </Link>
      </main>

      <section className="feature-section" id="features">
        <div className="feature-container">
          <h2 className="section-label">Medical Capabilities</h2>
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
          © 2026 PetCheck AI. For informational purposes only.
          <br />
          PetCheck AI does not replace professional veterinary advice,
          diagnosis, or treatment.
          <br />
          Always seek the advice of your veterinarian with any questions
          regarding a medical condition.
        </p>
      </footer>
    </>
  );
}
