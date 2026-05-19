import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#ffffff", fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 10, color: "#94a3b8", marginTop: 4 },
  section: { marginTop: 15, marginBottom: 10 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bodyText: { fontSize: 11, lineHeight: 1.5, color: "#334155" },
  observationCard: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    border: "0.5pt solid #e2e8f0",
    break: "inside-avoid",
  },
  label: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 4,
  },
  photo: {
    width: "100%",
    borderRadius: 4,
    marginTop: 8,
  },
  noPhotoBox: {
    marginTop: 8,
    padding: 20,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    border: "1pt dashed #cbd5e1",
    textAlign: "center",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: "#f1f5f9",
  },
  footerText: {
    fontSize: 7,
    color: "#94a3b8",
    textAlign: "center",
  },
});

const vertalingen: Record<string, string> = {
  eyes: "De ogen",
  skin: "De huid",
  dental: "Het gebit",
  poop: "De ontlasting",
  ears: "De oren",
  coat: "De vacht",
  nose: "De neus",
  mange: "Huidirritatie",
  ticks: "Teken/Parasieten",
  fleas: "Vlooien",
  bcs: "Gewicht & Bouw",
  pain: "Gezichtsuitdrukking",
};

interface Props {
  brief: string;
  details: any[];
  dogName: string;
}

export const RapportPDF = ({ brief, details, dogName }: Props) => (
  <Document title={`Aantekeningen over ${dogName}`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Aantekeningen over {dogName || "mijn hond"}
          </Text>
          <Text style={styles.subtitle}>
            Datum: {new Date().toLocaleDateString("nl-NL")}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mijn waarnemingen</Text>
        <Text style={styles.bodyText}>
          {brief || "Geen specifieke toelichting."}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bijgevoegde foto's</Text>
        {Array.isArray(details) && details.length > 0 ? (
          details.map((item, index) => (
            // FIX 1: Gebruik een combinatie van tool_id en index voor een unieke key
            <View
              key={`${item.tool_id}-${index}`}
              style={styles.observationCard}>
              <Text style={styles.label}>
                BETREFT: {vertalingen[item?.tool_id] || "Algemeen"}
              </Text>
              <Text style={[styles.bodyText, { fontSize: 10 }]}>
                Aantekening: {item?.summary || "Foto ter referentie."}
              </Text>

              {/* FIX 2: Check of de URL bestaat en forceer rendering */}
              {item?.image_url ? (
                <Image
                  src={item.image_url.split("?")[0]}
                  style={styles.photo}
                />
              ) : (
                <View style={styles.noPhotoBox}>
                  <Text style={{ fontSize: 8, color: "#94a3b8" }}>
                    Beeld kon niet worden geladen of is niet beschikbaar.
                  </Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={[styles.bodyText, { color: "#94a3b8" }]}>
            Geen specifieke foto's bijgevoegd.
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Persoonlijk overzicht ter ondersteuning van het gesprek met de
          dierenarts. Dit document is geen medische diagnose.
        </Text>
      </View>
    </Page>
  </Document>
);
