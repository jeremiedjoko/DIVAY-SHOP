import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { orders } from "@/db/schema";
// On utilise une approche HTML to PDF / Printable HTML pour éviter les crashs Edge.
// L'impression native du navigateur transformera ceci en PDF propre.

async function checkAdmin() {
  const session = await getSession();
  return session?.roles?.includes("SUPER_ADMIN") || session?.roles?.includes("VENDEUSE");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { lines: true, user: true }
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const dateStr = new Date(order.createdAt).toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' });
  const total = (order.totalMinor / 100).toFixed(2);

  // Template HTML Premium pour le PDF de la facture
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Quittance ${order.orderNumber}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');
          body { font-family: 'Inter', sans-serif; padding: 60px; color: #1a1a1a; max-width: 800px; margin: 0 auto; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; border-bottom: 2px solid #0f0f0f; padding-bottom: 20px; }
          .brand h1 { font-family: 'Playfair Display', serif; font-size: 28px; letter-spacing: 0.1em; margin: 0; text-transform: uppercase; }
          .brand p { color: #888; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
          .invoice-details { text-align: right; }
          .invoice-details h2 { font-weight: 500; font-size: 16px; margin: 0 0 5px 0; color: #666; }
          .invoice-details p { font-size: 14px; font-weight: 600; margin: 0; }
          
          .grid { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 14px; }
          .box { width: 48%; }
          .box h3 { font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 0.05em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px; }
          .box p { margin: 4px 0; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 14px; }
          th { text-align: left; padding: 12px 8px; border-bottom: 1px solid #0f0f0f; font-weight: 600; font-size: 12px; text-transform: uppercase; color: #888; }
          td { padding: 16px 8px; border-bottom: 1px solid #eee; }
          .col-qty { text-align: center; width: 100px; }
          .col-price, .col-total { text-align: right; width: 120px; }
          
          .totals { width: 300px; margin-left: auto; }
          .total-row { display: flex; justify-content: space-between; padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 14px; }
          .total-row.grand-total { font-weight: 600; font-size: 18px; border-bottom: none; border-top: 2px solid #0f0f0f; margin-top: 5px; }
          
          .footer { text-align: center; margin-top: 80px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
          
          /* Force impression en PDF */
          @media print {
            body { padding: 0; }
            @page { margin: 2cm; }
          }
        </style>
      </head>
      <body onload="window.print()">
        <div class="header">
          <div class="brand">
            <h1>DIVAY BEAUTY</h1>
            <p>Facture & Quittance</p>
          </div>
          <div class="invoice-details">
            <h2>COMMANDE N°</h2>
            <p>${order.orderNumber}</p>
            <p style="font-weight: 400; color: #666; margin-top: 4px;">${dateStr}</p>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <h3>Facturé / Livré à</h3>
            <p><strong>${order.shippingName}</strong></p>
            <p>${order.shippingAddress}</p>
            <p>${order.shippingCity}</p>
            <p style="margin-top: 8px; color: #666;">${order.shippingEmail}</p>
            <p style="color: #666;">${order.shippingPhone}</p>
          </div>
          <div class="box">
            <h3>Détails du paiement</h3>
            <p><strong>Méthode:</strong> ${order.paymentMethod === 'cod' ? 'Paiement à la livraison' : 'Carte bancaire (Stripe)'}</p>
            <p><strong>Statut:</strong> ${order.status}</p>
            <p><strong>Devise:</strong> ${order.currency}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="col-price">Prix unitaire</th>
              <th class="col-qty">Quantité</th>
              <th class="col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.lines.map(line => `
              <tr>
                <td><strong>${line.productName}</strong></td>
                <td class="col-price">${order.currency === 'USD' ? '$' : ''}${(line.priceMinor / 100).toFixed(2)} ${order.currency === 'CDF' ? 'FC' : ''}</td>
                <td class="col-qty">${line.quantity}</td>
                <td class="col-total">${order.currency === 'USD' ? '$' : ''}${((line.priceMinor * line.quantity) / 100).toFixed(2)} ${order.currency === 'CDF' ? 'FC' : ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Sous-total</span>
            <span>${order.currency === 'USD' ? '$' : ''}${total} ${order.currency === 'CDF' ? 'FC' : ''}</span>
          </div>
          <div class="total-row">
            <span>Livraison</span>
            <span>Gratuit</span>
          </div>
          <div class="total-row grand-total">
            <span>Total Payé</span>
            <span>${order.currency === 'USD' ? '$' : ''}${total} ${order.currency === 'CDF' ? 'FC' : ''}</span>
          </div>
        </div>

        <div class="footer">
          <p>Merci pour votre confiance.</p>
          <p>DIVAY BEAUTY — Kinshasa, République Démocratique du Congo</p>
        </div>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="Facture-${order.orderNumber}.html"`,
    },
  });
}
