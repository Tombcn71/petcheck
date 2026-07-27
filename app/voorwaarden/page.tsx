import Link from "next/link";
import { PawPrint, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Algemene Voorwaarden – Doggyscan.nl",
  description: "Algemene voorwaarden voor het gebruik van Doggyscan.nl",
};

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A1A2E] font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-3 mb-10 w-fit">
            <div className="bg-[#4FC3F7] text-white w-9 h-9 flex items-center justify-center rounded-xl">
              <PawPrint fill="currentColor" size={20} />
            </div>
            <span className="font-extrabold text-[#1A1A2E] tracking-tighter text-lg uppercase">
              Doggy<span className="text-[#4FC3F7]">scan.nl</span>
            </span>
          </Link>

          <h1 className="text-4xl font-black uppercase tracking-tighter mb-3">
            Algemene <span className="text-[#4FC3F7]">Voorwaarden</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Laatst bijgewerkt: juli 2026
          </p>
        </div>

        {/* Medische disclaimer – prominent bovenaan */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-10 flex gap-4">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={22} />
          <div>
            <p className="font-black text-amber-800 uppercase text-sm tracking-wide mb-1">
              Geen vervanging voor een dierenarts
            </p>
            <p className="text-amber-700 text-sm leading-relaxed">
              Doggyscan.nl is een ondersteunend hulpmiddel en vervangt <strong>nooit</strong> een professioneel
              veterinair consult. Bij twijfel over de gezondheid van uw hond dient u altijd
              contact op te nemen met een dierenarts. In spoedeisende situaties — zoals
              benauwdheid, bewusteloosheid, ernstige bloeding of inslikken van gifstoffen —
              belt u direct uw (nacht)dierenarts.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed text-slate-700">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E] mb-3">
              1. Over Doggyscan.nl
            </h2>
            <p>
              Doggyscan.nl is een digitale applicatie aangeboden door een eenmanszaak gevestigd
              in Nederland. De app stelt hondeneigenaren in staat om via foto-analyse en
              vragenlijsten een eerste indruk te krijgen van de gezondheid van hun hond.
              De analyses worden uitgevoerd door artificiële intelligentie (AI) en zijn
              uitsluitend bedoeld als <strong>informerend en ondersteunend hulpmiddel</strong>.
            </p>
            <p className="mt-3">
              Doggyscan.nl biedt onder andere:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-slate-600">
              <li>AI-gestuurde symptoomanalyse op basis van foto's</li>
              <li>Registratie van het gezondheidsdossier van uw hond</li>
              <li>Analyses van onder andere ogen, oren, huid, vacht, gebit en ontlasting</li>
              <li>Inzicht in mogelijke signalen die verdere veterinaire aandacht vereisen</li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E] mb-3">
              2. Geen medisch of veterinair advies
            </h2>
            <p>
              De informatie, analyses en suggesties die Doggyscan.nl genereert, vormen
              <strong> geen veterinair advies, diagnose of behandelplan</strong>. De AI kan
              fouten maken, incomplete informatie interpreteren of patronen herkennen die in
              de praktijk niet relevant zijn.
            </p>
            <p className="mt-3">
              U bent zelf verantwoordelijk voor de beslissingen die u neemt op basis van
              de uitkomsten van de app. Doggyscan.nl aanvaardt geen aansprakelijkheid voor
              schade die voortvloeit uit het opvolgen — of juist niet opvolgen — van
              informatie uit de app.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E] mb-3">
              3. Toegang en account
            </h2>
            <p>
              Om gebruik te maken van Doggyscan.nl dient u een account aan te maken via
              Clerk (onze authenticatieprovider). U bent minimaal 18 jaar oud of handelt
              onder toezicht van een ouder of voogd.
            </p>
            <p className="mt-3">
              U bent verantwoordelijk voor de vertrouwelijkheid van uw inloggegevens en
              voor alle activiteiten die plaatsvinden via uw account. Meld misbruik direct
              via <a href="mailto:info@doggyscan.nl" className="text-[#4FC3F7] font-bold">info@doggyscan.nl</a>.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E] mb-3">
              4. Abonnement en betaling
            </h2>
            <p>
              Doggyscan.nl biedt een gratis proefperiode van zeven dagen. Na afloop van
              de proefperiode wordt automatisch een betaald abonnement geactiveerd, tenzij
              u vóór het einde van de proefperiode opzegt.
            </p>
            <p className="mt-3">
              Betalingen worden verwerkt via Stripe. Abonnementen worden maandelijks of
              jaarlijks verlengd, afhankelijk van uw keuze. U kunt op elk moment opzeggen
              via de instellingenpagina in de app. Bij opzegging blijft uw toegang actief
              tot het einde van de lopende betaalperiode; er vindt geen terugbetaling
              plaats van reeds betaalde bedragen.
            </p>
            <p className="mt-3">
              Prijswijzigingen worden minimaal 30 dagen van tevoren aangekondigd per e-mail.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E] mb-3">
              5. Toegestaan gebruik
            </h2>
            <p>Het is niet toegestaan om:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-slate-600">
              <li>De app te gebruiken voor commerciële doeleinden zonder schriftelijke toestemming</li>
              <li>Automatisch of geautomatiseerd grote hoeveelheden verzoeken te versturen (scraping, bots)</li>
              <li>Resultaten buiten context te presenteren als professioneel veterinair advies</li>
              <li>De app te gebruiken voor andere diersoorten dan honden</li>
              <li>Inbreuk te maken op intellectuele eigendomsrechten van Doggyscan.nl</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E] mb-3">
              6. Beschikbaarheid en onderhoud
            </h2>
            <p>
              Wij streven naar een hoge beschikbaarheid, maar garanderen geen ononderbroken
              werking van de app. Onderhoud, updates en onvoorziene storingen kunnen tijdelijk
              leiden tot beperkte of geen toegang. Doggyscan.nl is niet aansprakelijk voor
              schade als gevolg van downtime.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E] mb-3">
              7. Privacy en gegevens
            </h2>
            <p>
              De verwerking van uw persoonsgegevens is beschreven in onze{" "}
              <Link href="/privacy" className="text-[#4FC3F7] font-bold hover:underline">
                Privacyverklaring
              </Link>
              . Wij verwerken gegevens in overeenstemming met de Algemene Verordening
              Gegevensbescherming (AVG/GDPR) op Europese servers.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E] mb-3">
              8. Aansprakelijkheidsbeperking
            </h2>
            <p>
              De aansprakelijkheid van Doggyscan.nl is beperkt tot het bedrag dat u in de
              afgelopen twaalf maanden aan abonnementskosten heeft betaald. Doggyscan.nl
              is niet aansprakelijk voor indirecte schade, gevolgschade, gederfde winst
              of schade aan derden.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E] mb-3">
              9. Wijzigingen in de voorwaarden
            </h2>
            <p>
              Wij behouden het recht deze voorwaarden te wijzigen. Bij wezenlijke wijzigingen
              ontvangt u minimaal 14 dagen van tevoren een melding per e-mail. Voortgezet
              gebruik van de app na de ingangsdatum geldt als aanvaarding van de gewijzigde
              voorwaarden.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E] mb-3">
              10. Toepasselijk recht en geschillen
            </h2>
            <p>
              Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden
              bij voorkeur in overleg opgelost. Lukt dat niet, dan is de bevoegde rechter
              in Nederland exclusief bevoegd.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E] mb-3">
              11. Contact
            </h2>
            <p>
              Vragen over deze voorwaarden? Neem contact op via{" "}
              <a href="mailto:info@doggyscan.nl" className="text-[#4FC3F7] font-bold hover:underline">
                info@doggyscan.nl
              </a>
              .
            </p>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-[#4FC3F7]">Home</Link>
          <Link href="/privacy" className="hover:text-[#4FC3F7]">Privacyverklaring</Link>
          <Link href="/dashboard" className="hover:text-[#4FC3F7]">Dashboard</Link>
        </div>

      </div>
    </div>
  );
}
