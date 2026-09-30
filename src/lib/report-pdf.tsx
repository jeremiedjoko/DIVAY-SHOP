import React from "react";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

// Données brutes : ce fichier est volontairement indépendant de la base (testable seul)
export type ReportData = {
  year: number;
  month: number;
  monthName: string;
  shopFc: number;
  servicesFc: number;
  totalFc: number;
  ordersTotal: number;
  ordersCounted: number;
  ordersCancelled: number;
  ordersPending: number;
  appointmentsTotal: number;
  appointmentsDone: number;
  appointmentsCancelled: number;
  topProducts: { name: string; qty: number; revenueFc: number }[];
  topServices: { name: string; qty: number; revenueFc: number }[];
  orders: { number: string; date: string; customer: string; totalFc: number; status: string }[];
};

// Espaces normaux (pas d'espace insécable : la police PDF standard l'affiche mal)
const fc = (n: number) => `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FC`;

const STATUS_FR: Record<string, string> = {
  PAID: "Payée", PROCESSING: "En préparation", SHIPPED: "Expédiée", DELIVERED: "Livrée",
};

const c = { rose: "#c0476b", dark: "#2a1c15", grey: "#78716c", line: "#f0dde6", soft: "#fff0f4" };
const st = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: c.dark, fontFamily: "Helvetica" },
  head: { borderBottomWidth: 2, borderBottomColor: c.rose, paddingBottom: 12, marginBottom: 20 },
  brand: { fontSize: 22, color: c.rose, fontFamily: "Helvetica-Bold", letterSpacing: 2 },
  title: { fontSize: 13, marginTop: 4 },
  sub: { fontSize: 9, color: c.grey, marginTop: 2 },
  kpiRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  kpi: { flex: 1, backgroundColor: c.soft, borderRadius: 6, padding: 12 },
  kpiLabel: { fontSize: 8, color: c.grey, textTransform: "uppercase" },
  kpiValue: { fontSize: 15, fontFamily: "Helvetica-Bold", color: c.rose, marginTop: 4 },
  h2: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 14, marginBottom: 6 },
  th: { flexDirection: "row", backgroundColor: c.rose, color: "#fff", paddingVertical: 5, paddingHorizontal: 6, fontFamily: "Helvetica-Bold" },
  tr: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: c.line },
  empty: { color: c.grey, fontSize: 9, paddingVertical: 6 },
  foot: { position: "absolute", bottom: 24, left: 40, right: 40, fontSize: 8, color: c.grey, textAlign: "center" },
});

function Table({ cols, rows, empty }: { cols: { label: string; w: number; right?: boolean }[]; rows: string[][]; empty: string }) {
  return (
    <View>
      <View style={st.th}>
        {cols.map((col) => (
          <Text key={col.label} style={{ width: `${col.w}%`, textAlign: col.right ? "right" : "left" }}>{col.label}</Text>
        ))}
      </View>
      {rows.length === 0 && <Text style={st.empty}>{empty}</Text>}
      {rows.map((r, i) => (
        <View key={i} style={st.tr} wrap={false}>
          {r.map((cell, j) => (
            <Text key={j} style={{ width: `${cols[j].w}%`, textAlign: cols[j].right ? "right" : "left" }}>{cell}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function ReportDocument({ d }: { d: ReportData }) {
  return (
    <Document title={`Rapport ${d.monthName} ${d.year} - Divay Beauty`}>
      <Page size="A4" style={st.page}>
        <View style={st.head}>
          <Text style={st.brand}>DIVAY BEAUTY</Text>
          <Text style={st.title}>Rapport d&apos;activité - {d.monthName} {d.year}</Text>
          <Text style={st.sub}>Édité le {new Date().toLocaleDateString("fr-FR")} - Montants en Francs Congolais (FC)</Text>
        </View>

        <View style={st.kpiRow}>
          <View style={st.kpi}><Text style={st.kpiLabel}>Chiffre d&apos;affaires total</Text><Text style={st.kpiValue}>{fc(d.totalFc)}</Text></View>
          <View style={st.kpi}><Text style={st.kpiLabel}>Boutique</Text><Text style={st.kpiValue}>{fc(d.shopFc)}</Text></View>
          <View style={st.kpi}><Text style={st.kpiLabel}>Prestations</Text><Text style={st.kpiValue}>{fc(d.servicesFc)}</Text></View>
        </View>

        <Text style={st.sub}>
          Commandes : {d.ordersCounted} comptabilisées sur {d.ordersTotal} ({d.ordersPending} en attente, {d.ordersCancelled} annulées).
          {"  "}Rendez-vous : {d.appointmentsDone} réalisés sur {d.appointmentsTotal} ({d.appointmentsCancelled} annulés).
        </Text>

        <Text style={st.h2}>Produits les plus vendus</Text>
        <Table
          cols={[{ label: "Produit", w: 55 }, { label: "Qté", w: 15, right: true }, { label: "CA", w: 30, right: true }]}
          rows={d.topProducts.map((p) => [p.name, String(p.qty), fc(p.revenueFc)])}
          empty="Aucune vente ce mois-ci."
        />

        <Text style={st.h2}>Prestations les plus réalisées</Text>
        <Table
          cols={[{ label: "Prestation", w: 55 }, { label: "Nb", w: 15, right: true }, { label: "CA", w: 30, right: true }]}
          rows={d.topServices.map((p) => [p.name, String(p.qty), fc(p.revenueFc)])}
          empty="Aucun rendez-vous réalisé ce mois-ci."
        />

        <Text style={st.h2}>Détail des commandes comptabilisées</Text>
        <Table
          cols={[{ label: "N°", w: 18 }, { label: "Date", w: 17 }, { label: "Cliente", w: 30 }, { label: "Statut", w: 17 }, { label: "Total", w: 18, right: true }]}
          rows={d.orders.map((o) => [o.number, o.date, o.customer, STATUS_FR[o.status] ?? o.status, fc(o.totalFc)])}
          empty="Aucune commande ce mois-ci."
        />

        <Text style={st.foot} fixed>
          Le chiffre d&apos;affaires compte les commandes payées, en préparation, expédiées ou livrées, et les rendez-vous marqués « réalisés ».
        </Text>
      </Page>
    </Document>
  );
}

export async function renderReportPdf(d: ReportData): Promise<Buffer> {
  return renderToBuffer(<ReportDocument d={d} />);
}
