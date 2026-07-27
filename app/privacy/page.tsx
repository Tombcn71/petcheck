import Link from "next/link";

export const metadata = {
  title: "Privacybeleid – Doggyscan.nl",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white font-jakarta antialiased">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#4FC3F7] mb-12 transition-colors">
          ← Terug
        </Link>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A2E] italic mb-2">
          Privacy<span className="text-[#4FC3F7] not-italic px-2">/</span>Beleid
        </h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-12">
          Laatst bijgewerkt: juli 2026
        </p>

        <div className="space-y-10 text-sm text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#4FC3F7] mb-3">
              1. Wie zijn wij?
            </h2>
            <p>
              Doggyscan.nl is een dienst van een eenmanszaak gevestigd in Nederland. Voor vragen over je privacy kun je contact opnemen via{" "}
              <a href="mailto:info@doggyscan.nl" className="text-[#4FC3F7] hover:underline">
                info@doggyscan.nl
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#4FC3F7] mb-3">
              2. Welke gegevens verzamelen wij?
            </h2>
            <ul className="space-y-2 list-none">
              {[
                "Accountgegevens: naam en e-mailadres bij registratie.",
                "Hondgegevens: naam, ras, leeftijd, gewicht en geslacht van je hond.",
                "Foto's: afbeeldingen die je uploadt voor een AI-scan.",
                "Gezondheidsdata: resultaten van AI-analyses, vaccinaties en medicatie.",
                "Betalingsgegevens: verwerkt via Stripe — wij slaan geen betaalgegevens op.",
                "Gebruiksdata: technische logs voor het verbeteren van de dienst.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#4FC3F7] font-black mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#4FC3F7] mb-3">
              3. Waarvoor gebruiken wij jouw gegevens?
            </h2>
            <ul className="space-y-2 list-none">
              {[
                "Het leveren en verbeteren van de Doggyscan-dienst.",
                "Het verwerken van betalingen en beheer van je abonnement.",
                "Het sturen van relevante meldingen over je account (geen spam).",
                "Het beantwoorden van vragen en feedback.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#4FC3F7] font-black mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#4FC3F7] mb-3">
              4. Delen wij jouw gegevens?
            </h2>
            <p className="mb-3">
              Wij verkopen nooit persoonsgegevens aan derden. Wij maken gebruik van de volgende verwerkers:
            </p>
            <ul className="space-y-2 list-none">
              {[
                "Clerk – authenticatie en accountbeheer.",
                "Stripe – betalingsverwerking.",
                "Google Gemini – AI-analyse van geüploade foto's.",
                "Vercel – hosting en infrastructuur.",
                "Neon – opslag van gezondheidsdata in een beveiligde database.",
                "Vercel Blob – opslag van foto's.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#4FC3F7] font-black mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Alle verwerkers zijn contractueel gebonden aan strikte dataverwerkingsovereenkomsten. Jouw gegevens worden opgeslagen en verwerkt op servers binnen de Europese Unie.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#4FC3F7] mb-3">
              5. Hoe lang bewaren wij jouw gegevens?
            </h2>
            <p>
              Wij bewaren jouw gegevens zolang je een actief account hebt. Wanneer je jouw account verwijdert, worden alle bijbehorende gegevens binnen 30 dagen definitief gewist.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#4FC3F7] mb-3">
              6. Cookies
            </h2>
            <p>
              Doggyscan.nl gebruikt functionele cookies die noodzakelijk zijn voor het werken van de app (inloggen, sessies). Wij gebruiken geen tracking- of advertentiecookies.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#4FC3F7] mb-3">
              7. Jouw rechten
            </h2>
            <p className="mb-3">Op grond van de AVG heb je de volgende rechten:</p>
            <ul className="space-y-2 list-none">
              {[
                "Inzage: je kunt opvragen welke gegevens wij van je hebben.",
                "Correctie: je kunt onjuiste gegevens laten aanpassen.",
                "Verwijdering: je kunt vragen jouw gegevens te wissen.",
                "Bezwaar: je kunt bezwaar maken tegen bepaalde vormen van verwerking.",
                "Overdraagbaarheid: je kunt een kopie van jouw gegevens opvragen.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#4FC3F7] font-black mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Stuur een e-mail naar{" "}
              <a href="mailto:info@doggyscan.nl" className="text-[#4FC3F7] hover:underline">
                info@doggyscan.nl
              </a>{" "}
              om gebruik te maken van je rechten.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#4FC3F7] mb-3">
              8. Medische disclaimer
            </h2>
            <p>
              De analyses van Doggyscan.nl zijn gebaseerd op AI en zijn uitsluitend bedoeld als persoonlijk overzicht ter ondersteuning van een gesprek met een dierenarts. De resultaten vormen geen medische diagnose en mogen niet als zodanig worden gebruikt.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#4FC3F7] mb-3">
              9. Wijzigingen
            </h2>
            <p>
              Wij kunnen dit privacybeleid aanpassen. Bij belangrijke wijzigingen informeren wij je via e-mail of een melding in de app.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#4FC3F7] mb-3">
              10. Contact
            </h2>
            <p>
              Vragen of opmerkingen over dit beleid? Neem contact op via{" "}
              <a href="mailto:info@doggyscan.nl" className="text-[#4FC3F7] hover:underline">
                info@doggyscan.nl
              </a>
              . Je hebt ook het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens via{" "}
              <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-[#4FC3F7] hover:underline">
                autoriteitpersoonsgegevens.nl
              </a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
