import { InvoiceTemplate } from "./invoiceTemplates";

export const additionalTemplates: InvoiceTemplate[] = [
  {
    id: "medical-healthcare",
    name: "Medical & Healthcare",
    description: "Professional medical billing template with clean clinical layout",
    category: "Corporate",
    tags: ["medical", "healthcare", "clinical", "billing"],
    primaryColor: "#0d9488",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#1e293b; background:#fff; padding:40px; }
  .inv { max-width:760px; margin:0 auto; }
  .hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; padding-bottom:24px; border-bottom:3px solid #0d9488; }
  .logo-area { display:flex; align-items:center; gap:14px; }
  .logo-icon { width:48px;height:48px;background:#0d9488;border-radius:12px;display:flex;align-items:center;justify-content:center; }
  .logo-icon svg { width:28px;height:28px; }
  .brand h1 { font-size:20px;font-weight:800;color:#0d9488; }
  .brand p { font-size:11px;color:#64748b;margin-top:2px; }
  .inv-info { text-align:right; }
  .inv-info .label { font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8; }
  .inv-info .num { font-size:22px;font-weight:800;color:#0f172a;margin-top:4px; }
  .inv-info .date { font-size:12px;color:#64748b;margin-top:4px; }
  .patient-grid { display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px; }
  .pg-box .pg-label { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#0d9488;font-weight:700;margin-bottom:8px; }
  .pg-box .pg-name { font-size:15px;font-weight:700;color:#0f172a;margin-bottom:4px; }
  .pg-box .pg-text { font-size:13px;color:#64748b;line-height:1.7; }
  .meta-row { display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:32px; }
  .mc { padding:12px 16px;border-right:1px solid #e2e8f0; }
  .mc:last-child { border-right:none; }
  .mc .ml { font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;margin-bottom:4px; }
  .mc .mv { font-size:13px;font-weight:700;color:#0f172a; }
  table { width:100%;border-collapse:collapse;margin-bottom:28px; }
  thead th { padding:11px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#fff;background:#0d9488; }
  thead th:last-child { text-align:right; }
  tbody td { padding:12px 14px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9; }
  tbody td:last-child { text-align:right;font-weight:600; }
  tbody tr:nth-child(even) { background:#f0fdfa; }
  .totals { display:flex;justify-content:flex-end;margin-bottom:32px; }
  .tb { width:240px; }
  .tr { display:flex;justify-content:space-between;font-size:13px;color:#64748b;padding:6px 0;border-bottom:1px solid #f1f5f9; }
  .tr.final { border:none;font-size:17px;font-weight:800;color:#0f172a;padding-top:12px; }
  .tr.final span:last-child { color:#0d9488; }
  .note { background:#f0fdfa;border-left:4px solid #0d9488;padding:14px 18px;border-radius:0 8px 8px 0;font-size:12px;color:#475569;line-height:1.7;margin-bottom:24px; }
  .ft { text-align:center;font-size:11px;color:#94a3b8;padding-top:20px;border-top:1px solid #f1f5f9; }
</style></head>
<body>
<div class="inv">
  <div class="hdr">
    <div class="logo-area">
      <div class="logo-icon"><svg viewBox="0 0 28 28" fill="none"><path d="M14 2v24M2 14h24" stroke="white" stroke-width="3" stroke-linecap="round"/></svg></div>
      <div class="brand"><h1>MedCare Clinic</h1><p>Healthcare & Wellness</p></div>
    </div>
    <div class="inv-info"><div class="label">Medical Invoice</div><div class="num">#MED-2024-0847</div><div class="date">March 5, 2024</div></div>
  </div>
  <div class="patient-grid">
    <div class="pg-box"><div class="pg-label">Provider</div><div class="pg-name">MedCare Clinic LLC</div><div class="pg-text">500 Health Center Dr<br>Boston, MA 02115<br>NPI: 1234567890<br>billing@medcareclinic.com</div></div>
    <div class="pg-box"><div class="pg-label">Patient / Bill To</div><div class="pg-name">John A. Patterson</div><div class="pg-text">78 Elm Street<br>Cambridge, MA 02139<br>Insurance: BlueCross PPO<br>Member ID: BC-99887766</div></div>
  </div>
  <div class="meta-row">
    <div class="mc"><div class="ml">Service Date</div><div class="mv">Feb 28, 2024</div></div>
    <div class="mc"><div class="ml">Due Date</div><div class="mv">Mar 30, 2024</div></div>
    <div class="mc"><div class="ml">Insurance</div><div class="mv">BlueCross PPO</div></div>
    <div class="mc"><div class="ml">Copay Status</div><div class="mv" style="color:#0d9488">● Applied</div></div>
  </div>
  <table>
    <thead><tr><th>CPT Code</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>99213</td><td>Office Visit — Established Patient (Level 3)</td><td>1</td><td>$185.00</td><td>$185.00</td></tr>
      <tr><td>36415</td><td>Venipuncture (Blood Draw)</td><td>1</td><td>$25.00</td><td>$25.00</td></tr>
      <tr><td>80053</td><td>Comprehensive Metabolic Panel</td><td>1</td><td>$120.00</td><td>$120.00</td></tr>
      <tr><td>85025</td><td>Complete Blood Count (CBC)</td><td>1</td><td>$45.00</td><td>$45.00</td></tr>
      <tr><td>93000</td><td>Electrocardiogram (ECG)</td><td>1</td><td>$95.00</td><td>$95.00</td></tr>
    </tbody>
  </table>
  <div class="totals"><div class="tb">
    <div class="tr"><span>Subtotal</span><span>$470.00</span></div>
    <div class="tr"><span>Insurance Adjustment</span><span>−$188.00</span></div>
    <div class="tr"><span>Insurance Paid</span><span>−$232.00</span></div>
    <div class="tr final"><span>Patient Responsibility</span><span>$50.00</span></div>
  </div></div>
  <div class="note">This is not a bill. Your insurance has been filed. The patient responsibility shown reflects your copay. Please remit within 30 days. Questions? Call (617) 555-0300.</div>
  <div class="ft">MedCare Clinic LLC · 500 Health Center Dr, Boston, MA 02115 · Tax ID: 04-7654321</div>
</div>
</body></html>`,
  },
  {
    id: "legal-services",
    name: "Legal Services",
    description: "Formal legal billing invoice with time-based entries",
    category: "Corporate",
    tags: ["legal", "law", "attorney", "formal", "billing"],
    primaryColor: "#1e293b",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:'Times New Roman',Georgia,serif;color:#1e293b;background:#fff;padding:40px; }
  .inv { max-width:760px;margin:0 auto; }
  .hdr { border-bottom:3px double #1e293b;padding-bottom:24px;margin-bottom:32px; }
  .hdr-top { display:flex;justify-content:space-between;align-items:flex-start; }
  .firm-name { font-size:28px;font-weight:bold;color:#1e293b;letter-spacing:1px; }
  .firm-sub { font-size:12px;color:#64748b;margin-top:4px;font-style:italic; }
  .firm-bar { font-size:11px;color:#475569;margin-top:8px;line-height:1.6; }
  .inv-block { text-align:right; }
  .inv-block h2 { font-size:14px;text-transform:uppercase;letter-spacing:3px;color:#94a3b8; }
  .inv-block .num { font-size:20px;font-weight:bold;color:#1e293b;margin-top:4px; }
  .inv-block .dt { font-size:12px;color:#64748b;margin-top:4px; }
  .parties { display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px; }
  .party .pl { font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;font-weight:bold;margin-bottom:8px; }
  .party .pn { font-size:15px;font-weight:bold;margin-bottom:4px; }
  .party .pi { font-size:13px;color:#64748b;line-height:1.7; }
  .matter { background:#f8fafc;border:1px solid #e2e8f0;padding:16px 20px;border-radius:4px;margin-bottom:32px;font-size:13px; }
  .matter strong { color:#1e293b; }
  .matter span { color:#64748b; }
  table { width:100%;border-collapse:collapse;margin-bottom:28px; }
  thead th { padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#64748b;border-bottom:2px solid #1e293b; }
  thead th:last-child { text-align:right; }
  tbody td { padding:12px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9; }
  tbody td:last-child { text-align:right;font-weight:bold; }
  .totals { display:flex;justify-content:flex-end;margin-bottom:32px; }
  .tb { width:260px; }
  .tr { display:flex;justify-content:space-between;font-size:13px;color:#64748b;padding:6px 0;border-bottom:1px solid #f1f5f9; }
  .tr.final { border:none;font-size:18px;font-weight:bold;color:#1e293b;padding-top:14px;border-top:2px solid #1e293b;margin-top:4px; }
  .terms { font-size:11px;color:#94a3b8;line-height:1.8;border-top:1px solid #e2e8f0;padding-top:20px; }
  .terms strong { color:#64748b; }
</style></head>
<body>
<div class="inv">
  <div class="hdr">
    <div class="hdr-top">
      <div>
        <div class="firm-name">HARTWELL & ASSOCIATES</div>
        <div class="firm-sub">Attorneys at Law</div>
        <div class="firm-bar">1200 Legal Plaza, Suite 400 · Washington, DC 20005<br>Tel: (202) 555-0180 · Fax: (202) 555-0181 · firm@hartwelllaw.com</div>
      </div>
      <div class="inv-block"><h2>Statement</h2><div class="num">#HWL-2024-0291</div><div class="dt">March 1, 2024</div></div>
    </div>
  </div>
  <div class="parties">
    <div class="party"><div class="pl">Billing Attorney</div><div class="pn">Sarah M. Hartwell, Esq.</div><div class="pi">Partner<br>Bar #DC-445566<br>shartwell@hartwelllaw.com</div></div>
    <div class="party"><div class="pl">Client</div><div class="pn">Meridian Corp.</div><div class="pi">Attn: General Counsel<br>800 Commerce St, Floor 22<br>New York, NY 10004<br>legal@meridiancorp.com</div></div>
  </div>
  <div class="matter"><strong>Matter:</strong> <span>Meridian Corp. v. Pinnacle Holdings — Contract Dispute · Case #DC-2024-CV-1188</span></div>
  <table>
    <thead><tr><th>Date</th><th>Description</th><th>Attorney</th><th>Hours</th><th>Rate</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>02/05</td><td>Review opposing motion; research precedent</td><td>S. Hartwell</td><td>3.5</td><td>$550</td><td>$1,925.00</td></tr>
      <tr><td>02/08</td><td>Draft response brief; coordinate exhibits</td><td>S. Hartwell</td><td>5.0</td><td>$550</td><td>$2,750.00</td></tr>
      <tr><td>02/12</td><td>Deposition preparation and witness review</td><td>J. Nakamura</td><td>4.0</td><td>$400</td><td>$1,600.00</td></tr>
      <tr><td>02/15</td><td>Attend deposition (half day)</td><td>S. Hartwell</td><td>4.0</td><td>$550</td><td>$2,200.00</td></tr>
      <tr><td>02/20</td><td>Legal research — damages analysis</td><td>K. Osei (Assoc.)</td><td>6.0</td><td>$300</td><td>$1,800.00</td></tr>
      <tr><td>02/26</td><td>Client conference call; strategy session</td><td>S. Hartwell</td><td>1.5</td><td>$550</td><td>$825.00</td></tr>
    </tbody>
  </table>
  <div class="totals"><div class="tb">
    <div class="tr"><span>Legal Fees (24.0 hrs)</span><span>$11,100.00</span></div>
    <div class="tr"><span>Court Filing Fees</span><span>$400.00</span></div>
    <div class="tr"><span>Court Reporter</span><span>$650.00</span></div>
    <div class="tr"><span>Research Databases</span><span>$175.00</span></div>
    <div class="tr final"><span>Total Due</span><span>$12,325.00</span></div>
  </div></div>
  <div class="terms"><strong>Terms:</strong> Payment due within 30 days of statement date. Interest of 1.5% per month on overdue balances. Wire: Capital One · Routing 056073502 · Acct IOLTA-887766. Trust Account deposits applied per DC Bar Rule 1.15. Questions? Contact our billing dept at billing@hartwelllaw.com.</div>
</div>
</body></html>`,
  },
  {
    id: "photography-studio",
    name: "Photography Studio",
    description: "Artistic invoice for photographers with elegant visual layout",
    category: "Creative",
    tags: ["photography", "studio", "artistic", "visual"],
    primaryColor: "#a855f7",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#18181b;background:#faf5ff;padding:40px; }
  .inv { max-width:760px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(168,85,247,0.1); }
  .hdr { background:linear-gradient(135deg,#581c87 0%,#7c3aed 50%,#a855f7 100%);padding:40px 48px;color:white; }
  .hdr-top { display:flex;justify-content:space-between;align-items:center;margin-bottom:24px; }
  .brand { font-size:24px;font-weight:800;letter-spacing:-1px; }
  .brand span { opacity:0.6; }
  .inv-num { font-size:13px;opacity:0.7; }
  .hdr-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:20px; }
  .hg-item .hgl { font-size:9px;text-transform:uppercase;letter-spacing:2px;opacity:0.6;margin-bottom:4px; }
  .hg-item .hgv { font-size:14px;font-weight:700; }
  .body { padding:40px 48px; }
  .parties { display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:36px; }
  .party .pl { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#a855f7;font-weight:700;margin-bottom:8px; }
  .party .pn { font-size:15px;font-weight:700;margin-bottom:4px; }
  .party .pi { font-size:13px;color:#71717a;line-height:1.7; }
  table { width:100%;border-collapse:collapse;margin-bottom:28px; }
  thead th { padding:11px 0;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#a1a1aa;border-bottom:2px solid #f4f4f5; }
  thead th:last-child { text-align:right; }
  tbody td { padding:14px 0;font-size:14px;color:#27272a;border-bottom:1px solid #f4f4f5; }
  tbody td:first-child { font-weight:600; }
  tbody td:last-child { text-align:right;font-weight:700; }
  .totals { display:flex;justify-content:flex-end;margin-bottom:32px; }
  .tb { width:240px; }
  .tr { display:flex;justify-content:space-between;font-size:13px;color:#71717a;padding:6px 0; }
  .tr.final { font-size:18px;font-weight:800;color:#18181b;padding-top:14px;border-top:2px solid #a855f7;margin-top:6px; }
  .tr.final span:last-child { color:#a855f7; }
  .note { background:#faf5ff;border-radius:10px;padding:16px 20px;font-size:12px;color:#6b21a8;line-height:1.7; }
  .ft { text-align:center;font-size:11px;color:#a1a1aa;padding-top:24px;margin-top:24px;border-top:1px solid #f4f4f5; }
</style></head>
<body>
<div class="inv">
  <div class="hdr">
    <div class="hdr-top">
      <div class="brand">LUMEN <span>STUDIO</span></div>
      <div class="inv-num">Invoice #LUM-2024-033</div>
    </div>
    <div class="hdr-grid">
      <div class="hg-item"><div class="hgl">Shoot Date</div><div class="hgv">Feb 24, 2024</div></div>
      <div class="hg-item"><div class="hgl">Invoice Date</div><div class="hgv">Mar 1, 2024</div></div>
      <div class="hg-item"><div class="hgl">Payment Due</div><div class="hgv">Mar 15, 2024</div></div>
    </div>
  </div>
  <div class="body">
    <div class="parties">
      <div class="party"><div class="pl">Photographer</div><div class="pn">Lumen Studio</div><div class="pi">Maya Torres, Lead Photographer<br>44 Gallery Row, Studio 2B<br>San Francisco, CA 94102<br>maya@lumenstudio.co</div></div>
      <div class="party"><div class="pl">Client</div><div class="pn">Bloom Cosmetics Inc.</div><div class="pi">Attn: Marketing Dept<br>120 Beauty Blvd<br>Los Angeles, CA 90028<br>projects@bloomcosmetics.com</div></div>
    </div>
    <table>
      <thead><tr><th>Service</th><th>Details</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>Product Photography</td><td>Full-day shoot (8 hrs), 30 products</td><td>$3,200.00</td></tr>
        <tr><td>Studio Rental</td><td>Infinity wall setup + lighting</td><td>$800.00</td></tr>
        <tr><td>Photo Retouching</td><td>30 images × advanced retouch</td><td>$1,500.00</td></tr>
        <tr><td>Lifestyle Shots</td><td>Half-day lifestyle session, 15 images</td><td>$1,800.00</td></tr>
        <tr><td>Rush Delivery</td><td>48-hour turnaround surcharge</td><td>$450.00</td></tr>
      </tbody>
    </table>
    <div class="totals"><div class="tb">
      <div class="tr"><span>Subtotal</span><span>$7,750.00</span></div>
      <div class="tr"><span>Tax (8.625%)</span><span>$668.44</span></div>
      <div class="tr final"><span>Total Due</span><span>$8,418.44</span></div>
    </div></div>
    <div class="note">📸 All images delivered via secure cloud link. Usage rights: Commercial, unlimited, 2 years. Raw files available upon request (+$500). Thank you for choosing Lumen Studio!</div>
    <div class="ft">Lumen Studio · maya@lumenstudio.co · lumenstudio.co · Zelle: maya@lumenstudio.co</div>
  </div>
</div>
</body></html>`,
  },
  {
    id: "restaurant-catering",
    name: "Restaurant & Catering",
    description: "Warm, appetizing design for food service and catering invoices",
    category: "Creative",
    tags: ["restaurant", "catering", "food", "hospitality"],
    primaryColor: "#dc2626",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:'Georgia',serif;color:#1c1917;background:#fffbeb;padding:40px; }
  .inv { max-width:720px;margin:0 auto;background:#fff;border-radius:4px;border:1px solid #e7e5e4;overflow:hidden; }
  .hdr { background:#7f1d1d;padding:36px 40px;color:white;display:flex;justify-content:space-between;align-items:center; }
  .brand { font-size:26px;font-weight:bold;letter-spacing:1px; }
  .brand-sub { font-size:11px;opacity:0.7;margin-top:2px;font-style:italic; }
  .inv-box { text-align:right; }
  .inv-box .label { font-size:10px;text-transform:uppercase;letter-spacing:2px;opacity:0.6; }
  .inv-box .num { font-size:18px;font-weight:bold;margin-top:4px; }
  .inv-box .date { font-size:12px;opacity:0.7;margin-top:4px; }
  .red-bar { height:4px;background:linear-gradient(90deg,#dc2626,#f97316,#eab308); }
  .body { padding:36px 40px; }
  .event-info { background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin-bottom:28px;font-size:13px;color:#92400e;display:grid;grid-template-columns:repeat(3,1fr);gap:16px; }
  .ei-item .eil { font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#b45309;margin-bottom:4px; }
  .ei-item .eiv { font-weight:bold;color:#78350f; }
  .parties { display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:28px; }
  .party .pl { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#dc2626;margin-bottom:8px;font-weight:bold; }
  .party .pn { font-size:15px;font-weight:bold;margin-bottom:4px; }
  .party .pi { font-size:12px;color:#78716c;line-height:1.7; }
  table { width:100%;border-collapse:collapse;margin-bottom:24px; }
  thead th { padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#fff;background:#dc2626; }
  thead th:last-child { text-align:right; }
  tbody td { padding:12px;font-size:13px;color:#44403c;border-bottom:1px solid #f5f5f4; }
  tbody td:last-child { text-align:right;font-weight:bold; }
  .totals { display:flex;justify-content:flex-end;margin-bottom:28px; }
  .tb { width:220px; }
  .tr { display:flex;justify-content:space-between;font-size:13px;color:#78716c;padding:5px 0;border-bottom:1px solid #f5f5f4; }
  .tr.final { border:none;font-size:17px;font-weight:bold;color:#1c1917;padding-top:12px;border-top:2px solid #dc2626;margin-top:4px; }
  .note { font-size:12px;color:#a8a29e;font-style:italic;text-align:center;padding-top:20px;border-top:1px solid #f5f5f4; }
</style></head>
<body>
<div class="inv">
  <div class="hdr">
    <div><div class="brand">🍽️ La Tavola</div><div class="brand-sub">Fine Italian Catering · Est. 2010</div></div>
    <div class="inv-box"><div class="label">Catering Invoice</div><div class="num">#LT-2024-0188</div><div class="date">March 3, 2024</div></div>
  </div>
  <div class="red-bar"></div>
  <div class="body">
    <div class="event-info">
      <div class="ei-item"><div class="eil">Event</div><div class="eiv">Corporate Gala Dinner</div></div>
      <div class="ei-item"><div class="eil">Event Date</div><div class="eiv">Feb 24, 2024</div></div>
      <div class="ei-item"><div class="eil">Guests</div><div class="eiv">120 Attendees</div></div>
    </div>
    <div class="parties">
      <div class="party"><div class="pl">Caterer</div><div class="pn">La Tavola Catering LLC</div><div class="pi">28 Restaurant Row<br>Manhattan, NY 10036<br>events@latavola.com</div></div>
      <div class="party"><div class="pl">Client</div><div class="pn">Sterling & Partners</div><div class="pi">400 Madison Ave, Floor 18<br>New York, NY 10017<br>admin@sterlingpartners.com</div></div>
    </div>
    <table>
      <thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
      <tbody>
        <tr><td>Antipasto Station (per guest)</td><td>120</td><td>$18.00</td><td>$2,160.00</td></tr>
        <tr><td>Primi — Handmade Pasta Course</td><td>120</td><td>$24.00</td><td>$2,880.00</td></tr>
        <tr><td>Secondi — Choice of Entree</td><td>120</td><td>$42.00</td><td>$5,040.00</td></tr>
        <tr><td>Dessert — Tiramisu & Panna Cotta</td><td>120</td><td>$14.00</td><td>$1,680.00</td></tr>
        <tr><td>Bar Service (Open Bar, 4 hrs)</td><td>1</td><td>$3,200</td><td>$3,200.00</td></tr>
        <tr><td>Event Staff (Chef + 8 servers, 6 hrs)</td><td>1</td><td>$2,400</td><td>$2,400.00</td></tr>
        <tr><td>Equipment Rental (Tables, Linens)</td><td>1</td><td>$950</td><td>$950.00</td></tr>
      </tbody>
    </table>
    <div class="totals"><div class="tb">
      <div class="tr"><span>Subtotal</span><span>$18,310.00</span></div>
      <div class="tr"><span>Service Charge (18%)</span><span>$3,295.80</span></div>
      <div class="tr"><span>Tax (8.875%)</span><span>$1,915.26</span></div>
      <div class="tr"><span>Deposit Paid</span><span>−$5,000.00</span></div>
      <div class="tr final"><span>Balance Due</span><span>$18,521.06</span></div>
    </div></div>
    <div class="note">Buon appetito! Thank you for choosing La Tavola. Payment due within 14 days of event date. Gratuity not included.</div>
  </div>
</div>
</body></html>`,
  },
  {
    id: "construction-trade",
    name: "Construction & Trade",
    description: "Rugged professional template for contractors and tradespeople",
    category: "Corporate",
    tags: ["construction", "contractor", "trade", "builder"],
    primaryColor: "#ea580c",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:'Arial',sans-serif;color:#1c1917;background:#fff;padding:40px; }
  .inv { max-width:780px;margin:0 auto;border:2px solid #292524;overflow:hidden; }
  .hdr { background:#292524;padding:28px 36px;display:flex;justify-content:space-between;align-items:center;color:white; }
  .brand { display:flex;align-items:center;gap:14px; }
  .logo-box { width:44px;height:44px;background:#ea580c;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:white; }
  .brand-text h1 { font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:1px; }
  .brand-text p { font-size:10px;color:#a8a29e;text-transform:uppercase;letter-spacing:2px;margin-top:2px; }
  .inv-info { text-align:right; }
  .inv-info .num { font-size:18px;font-weight:900;color:#ea580c; }
  .inv-info .date { font-size:12px;color:#a8a29e;margin-top:4px; }
  .orange-line { height:4px;background:#ea580c; }
  .body { padding:32px 36px; }
  .project-bar { background:#fff7ed;border:1px solid #fed7aa;border-radius:6px;padding:16px 20px;margin-bottom:28px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;font-size:13px; }
  .pb-item .pbl { font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#c2410c;margin-bottom:4px; }
  .pb-item .pbv { font-weight:bold;color:#7c2d12; }
  .parties { display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:28px; }
  .party .pl { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#ea580c;font-weight:bold;margin-bottom:8px; }
  .party .pn { font-size:14px;font-weight:bold;margin-bottom:4px; }
  .party .pi { font-size:12px;color:#78716c;line-height:1.7; }
  table { width:100%;border-collapse:collapse;margin-bottom:24px; }
  thead th { padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#fff;background:#292524; }
  thead th:last-child { text-align:right; }
  tbody td { padding:11px 12px;font-size:13px;color:#44403c;border-bottom:1px solid #e7e5e4; }
  tbody td:last-child { text-align:right;font-weight:bold; }
  .totals { display:flex;justify-content:flex-end;margin-bottom:28px; }
  .tb { width:240px; }
  .tr { display:flex;justify-content:space-between;font-size:13px;color:#78716c;padding:6px 0;border-bottom:1px solid #e7e5e4; }
  .tr.final { border:none;font-size:17px;font-weight:900;color:#292524;padding-top:12px;border-top:2px solid #ea580c;margin-top:4px; }
  .tr.final span:last-child { color:#ea580c; }
  .terms { font-size:11px;color:#a8a29e;line-height:1.8;border-top:1px solid #e7e5e4;padding-top:16px; }
  .terms strong { color:#78716c; }
  .ft { background:#292524;padding:14px 36px;display:flex;justify-content:space-between;font-size:11px;color:#a8a29e; }
</style></head>
<body>
<div class="inv">
  <div class="hdr">
    <div class="brand"><div class="logo-box">IB</div><div class="brand-text"><h1>IronBuild Construction</h1><p>Licensed General Contractor</p></div></div>
    <div class="inv-info"><div class="num">#IBC-2024-0455</div><div class="date">March 1, 2024</div></div>
  </div>
  <div class="orange-line"></div>
  <div class="body">
    <div class="project-bar">
      <div class="pb-item"><div class="pbl">Project</div><div class="pbv">Kitchen Remodel — Phase 2</div></div>
      <div class="pb-item"><div class="pbl">License #</div><div class="pbv">CA-B-789456</div></div>
      <div class="pb-item"><div class="pbl">PO Number</div><div class="pbv">PO-2024-0088</div></div>
    </div>
    <div class="parties">
      <div class="party"><div class="pl">Contractor</div><div class="pn">IronBuild Construction LLC</div><div class="pi">1800 Builder's Way<br>Sacramento, CA 95814<br>License: CA-B-789456<br>office@ironbuild.com</div></div>
      <div class="party"><div class="pl">Property Owner</div><div class="pn">James & Linda Morrison</div><div class="pi">445 Elm Court<br>Sacramento, CA 95818<br>morrison.james@email.com</div></div>
    </div>
    <table>
      <thead><tr><th>Phase / Work Item</th><th>Details</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>Demolition & Removal</td><td>Existing cabinets, countertops, flooring</td><td>$2,800.00</td></tr>
        <tr><td>Plumbing Rough-In</td><td>Relocate sink, dishwasher line, gas line</td><td>$4,200.00</td></tr>
        <tr><td>Electrical Upgrade</td><td>New circuits (20A), undercabinet lighting</td><td>$3,600.00</td></tr>
        <tr><td>Cabinetry & Installation</td><td>Custom shaker cabinets (14 units)</td><td>$12,500.00</td></tr>
        <tr><td>Countertop — Quartz</td><td>42 sq ft, Calacatta Laza</td><td>$5,880.00</td></tr>
        <tr><td>Tile Backsplash</td><td>Subway tile, 28 sq ft installed</td><td>$1,400.00</td></tr>
        <tr><td>Flooring — LVP</td><td>180 sq ft, waterproof vinyl plank</td><td>$2,700.00</td></tr>
        <tr><td>Permits & Inspections</td><td>City of Sacramento</td><td>$850.00</td></tr>
      </tbody>
    </table>
    <div class="totals"><div class="tb">
      <div class="tr"><span>Subtotal</span><span>$33,930.00</span></div>
      <div class="tr"><span>Tax (7.75%)</span><span>$2,629.58</span></div>
      <div class="tr"><span>Previous Payments</span><span>−$10,000.00</span></div>
      <div class="tr final"><span>Balance Due</span><span>$26,559.58</span></div>
    </div></div>
    <div class="terms"><strong>Payment Terms:</strong> Net 15 from invoice date. 1.5% late fee per month. Warranty: 2-year workmanship guarantee. All materials warranted per manufacturer. Change orders require written approval before work begins.</div>
  </div>
  <div class="ft"><span>IronBuild Construction LLC · License CA-B-789456 · Bonded & Insured</span><span>Page 1 of 1</span></div>
</div>
</body></html>`,
  },
  {
    id: "saas-subscription",
    name: "SaaS Subscription",
    description: "Recurring billing template for software subscriptions",
    category: "Modern",
    tags: ["saas", "subscription", "recurring", "software"],
    primaryColor: "#2563eb",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;background:#fff;padding:40px; }
  .inv { max-width:740px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden; }
  .hdr { padding:32px 40px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0; }
  .logo-row { display:flex;align-items:center;gap:12px; }
  .logo-dot { width:36px;height:36px;background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:16px; }
  .brand-name { font-size:18px;font-weight:800;color:#0f172a; }
  .brand-tag { font-size:11px;color:#64748b; }
  .inv-meta { text-align:right;font-size:12px;color:#64748b; }
  .inv-meta .num { font-size:16px;font-weight:800;color:#2563eb;margin-bottom:4px; }
  .status-bar { background:#eff6ff;padding:14px 40px;display:flex;gap:40px;border-bottom:1px solid #e2e8f0; }
  .sb-item .sbl { font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#64748b; }
  .sb-item .sbv { font-size:13px;font-weight:700;color:#0f172a;margin-top:2px; }
  .body { padding:32px 40px; }
  .plan-box { background:linear-gradient(135deg,#eff6ff,#f5f3ff);border:1px solid #dbeafe;border-radius:12px;padding:20px 24px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center; }
  .plan-name { font-size:18px;font-weight:800;color:#0f172a; }
  .plan-desc { font-size:12px;color:#64748b;margin-top:2px; }
  .plan-price { font-size:28px;font-weight:900;color:#2563eb; }
  .plan-price span { font-size:14px;color:#64748b;font-weight:400; }
  .parties { display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:28px; }
  .party .pl { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#2563eb;font-weight:700;margin-bottom:8px; }
  .party .pn { font-size:14px;font-weight:700;margin-bottom:4px; }
  .party .pi { font-size:12px;color:#64748b;line-height:1.7; }
  table { width:100%;border-collapse:collapse;margin-bottom:24px; }
  thead th { padding:10px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#64748b;border-bottom:2px solid #e2e8f0; }
  thead th:last-child { text-align:right; }
  tbody td { padding:12px 14px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9; }
  tbody td:last-child { text-align:right;font-weight:700; }
  .totals { display:flex;justify-content:flex-end;margin-bottom:24px; }
  .tb { width:240px; }
  .tr { display:flex;justify-content:space-between;font-size:13px;color:#64748b;padding:6px 0;border-bottom:1px solid #f1f5f9; }
  .tr.final { border:none;font-size:16px;font-weight:800;color:#0f172a;padding-top:12px; }
  .tr.final span:last-child { color:#2563eb; }
  .auto-pay { background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;font-size:12px;color:#166534;display:flex;align-items:center;gap:8px; }
  .ft { text-align:center;font-size:11px;color:#94a3b8;padding-top:20px;margin-top:20px;border-top:1px solid #f1f5f9; }
</style></head>
<body>
<div class="inv">
  <div class="hdr">
    <div class="logo-row"><div class="logo-dot">S</div><div><div class="brand-name">StackFlow</div><div class="brand-tag">Developer Platform</div></div></div>
    <div class="inv-meta"><div class="num">#SF-2024-03-1847</div>Billing Period: Mar 1 – Mar 31, 2024</div>
  </div>
  <div class="status-bar">
    <div class="sb-item"><div class="sbl">Plan</div><div class="sbv">Business Pro</div></div>
    <div class="sb-item"><div class="sbl">Billing Cycle</div><div class="sbv">Monthly</div></div>
    <div class="sb-item"><div class="sbl">Payment Method</div><div class="sbv">Visa •••• 4242</div></div>
    <div class="sb-item"><div class="sbl">Status</div><div class="sbv" style="color:#16a34a">● Paid</div></div>
  </div>
  <div class="body">
    <div class="plan-box">
      <div><div class="plan-name">Business Pro Plan</div><div class="plan-desc">Up to 50 team seats · 100GB storage · Priority support</div></div>
      <div class="plan-price">$299<span>/mo</span></div>
    </div>
    <div class="parties">
      <div class="party"><div class="pl">Provider</div><div class="pn">StackFlow Inc.</div><div class="pi">600 Tech Ave, Suite 400<br>San Jose, CA 95113<br>billing@stackflow.dev</div></div>
      <div class="party"><div class="pl">Customer</div><div class="pn">DevOps Solutions Ltd.</div><div class="pi">350 Cloud Way<br>Denver, CO 80202<br>Account ID: SF-CUST-889922</div></div>
    </div>
    <table>
      <thead><tr><th>Item</th><th>Quantity</th><th>Unit Price</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>Business Pro Subscription</td><td>1 month</td><td>$299.00</td><td>$299.00</td></tr>
        <tr><td>Additional Team Seats (×12)</td><td>12 seats</td><td>$15.00</td><td>$180.00</td></tr>
        <tr><td>Extra Storage (50GB)</td><td>50 GB</td><td>$0.50/GB</td><td>$25.00</td></tr>
        <tr><td>API Overage (250K calls)</td><td>250,000</td><td>$0.001</td><td>$250.00</td></tr>
        <tr><td>Premium Support Add-on</td><td>1 month</td><td>$99.00</td><td>$99.00</td></tr>
      </tbody>
    </table>
    <div class="totals"><div class="tb">
      <div class="tr"><span>Subtotal</span><span>$853.00</span></div>
      <div class="tr"><span>Credits Applied</span><span>−$50.00</span></div>
      <div class="tr"><span>Tax (9.25%)</span><span>$74.28</span></div>
      <div class="tr final"><span>Amount Charged</span><span>$877.28</span></div>
    </div></div>
    <div class="auto-pay">✅ Auto-pay is enabled. This invoice was automatically charged to your Visa ending in 4242 on March 1, 2024.</div>
    <div class="ft">StackFlow Inc. · EIN 84-5678901 · stackflow.dev · support@stackflow.dev</div>
  </div>
</div>
</body></html>`,
  },
  {
    id: "education-tutor",
    name: "Education & Tutoring",
    description: "Friendly, approachable design for educators and tutoring services",
    category: "Minimal",
    tags: ["education", "tutoring", "teacher", "school"],
    primaryColor: "#0891b2",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0c4a6e;background:#ecfeff;padding:40px; }
  .inv { max-width:700px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(8,145,178,0.08); }
  .hdr { padding:32px 40px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #e0f2fe; }
  .brand { display:flex;align-items:center;gap:12px; }
  .brand-icon { font-size:32px; }
  .brand-text h1 { font-size:18px;font-weight:800;color:#0891b2; }
  .brand-text p { font-size:11px;color:#64748b; }
  .inv-badge { background:#ecfeff;border:1px solid #a5f3fc;border-radius:10px;padding:10px 18px;text-align:center; }
  .inv-badge .label { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#0891b2; }
  .inv-badge .num { font-size:16px;font-weight:800;color:#0c4a6e;margin-top:2px; }
  .body { padding:32px 40px; }
  .student-info { background:#f0f9ff;border-radius:10px;padding:16px 20px;margin-bottom:24px;display:grid;grid-template-columns:1fr 1fr;gap:16px; }
  .si-item .sil { font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#0891b2;margin-bottom:4px; }
  .si-item .siv { font-size:13px;font-weight:600;color:#0c4a6e; }
  .parties { display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px; }
  .party .pl { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#0891b2;margin-bottom:6px;font-weight:700; }
  .party .pn { font-size:14px;font-weight:700;margin-bottom:4px; }
  .party .pi { font-size:12px;color:#64748b;line-height:1.7; }
  table { width:100%;border-collapse:collapse;margin-bottom:24px; }
  thead th { padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#fff;background:#0891b2;border-radius:0; }
  thead th:first-child { border-radius:8px 0 0 0; }
  thead th:last-child { text-align:right;border-radius:0 8px 0 0; }
  tbody td { padding:11px 12px;font-size:13px;color:#334155;border-bottom:1px solid #f0f9ff; }
  tbody td:last-child { text-align:right;font-weight:600; }
  .totals { display:flex;justify-content:flex-end;margin-bottom:24px; }
  .tb { width:220px; }
  .tr { display:flex;justify-content:space-between;font-size:13px;color:#64748b;padding:5px 0;border-bottom:1px solid #f0f9ff; }
  .tr.final { border:none;font-size:16px;font-weight:800;color:#0c4a6e;padding-top:10px; }
  .tr.final span:last-child { color:#0891b2; }
  .note { background:#ecfeff;border-radius:10px;padding:14px 18px;font-size:12px;color:#0e7490;line-height:1.7;text-align:center; }
  .ft { text-align:center;font-size:11px;color:#94a3b8;padding:20px 40px; }
</style></head>
<body>
<div class="inv">
  <div class="hdr">
    <div class="brand"><div class="brand-icon">📚</div><div class="brand-text"><h1>BrightPath Tutoring</h1><p>Academic Excellence, One Session at a Time</p></div></div>
    <div class="inv-badge"><div class="label">Invoice</div><div class="num">#BPT-2024-0119</div></div>
  </div>
  <div class="body">
    <div class="student-info">
      <div class="si-item"><div class="sil">Student</div><div class="siv">Emily Rodriguez, Grade 10</div></div>
      <div class="si-item"><div class="sil">Subject</div><div class="siv">AP Mathematics & SAT Prep</div></div>
      <div class="si-item"><div class="sil">Billing Month</div><div class="siv">February 2024</div></div>
      <div class="si-item"><div class="sil">Payment Due</div><div class="siv">March 10, 2024</div></div>
    </div>
    <div class="parties">
      <div class="party"><div class="pl">Tutor</div><div class="pn">Dr. Michael Chen</div><div class="pi">BrightPath Tutoring<br>Ph.D. Mathematics (MIT)<br>m.chen@brightpath.edu<br>(617) 555-0244</div></div>
      <div class="party"><div class="pl">Bill To</div><div class="pn">Maria Rodriguez</div><div class="pi">55 Maple Drive<br>Newton, MA 02461<br>maria.r@email.com</div></div>
    </div>
    <table>
      <thead><tr><th>Date</th><th>Session</th><th>Hours</th><th>Rate</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>Feb 3</td><td>AP Calc — Limits & Continuity</td><td>1.5</td><td>$85/hr</td><td>$127.50</td></tr>
        <tr><td>Feb 10</td><td>AP Calc — Derivatives</td><td>1.5</td><td>$85/hr</td><td>$127.50</td></tr>
        <tr><td>Feb 14</td><td>SAT Math — Practice Test Review</td><td>2.0</td><td>$85/hr</td><td>$170.00</td></tr>
        <tr><td>Feb 17</td><td>AP Calc — Applications</td><td>1.5</td><td>$85/hr</td><td>$127.50</td></tr>
        <tr><td>Feb 24</td><td>SAT Math — Strategy & Timing</td><td>2.0</td><td>$85/hr</td><td>$170.00</td></tr>
        <tr><td>Feb 28</td><td>AP Calc — Integration Intro</td><td>1.5</td><td>$85/hr</td><td>$127.50</td></tr>
      </tbody>
    </table>
    <div class="totals"><div class="tb">
      <div class="tr"><span>Total Hours (10 hrs)</span><span>$850.00</span></div>
      <div class="tr"><span>Materials Fee</span><span>$35.00</span></div>
      <div class="tr final"><span>Total Due</span><span>$885.00</span></div>
    </div></div>
    <div class="note">🌟 Emily is making excellent progress! Her AP Calc practice scores have improved by 15% this month. Recommended: Continue 2× weekly sessions through the spring.</div>
  </div>
  <div class="ft">BrightPath Tutoring · Venmo: @drchen-tutor · Zelle: m.chen@brightpath.edu</div>
</div>
</body></html>`,
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Professional property management and real estate invoice",
    category: "Corporate",
    tags: ["real-estate", "property", "management", "rent"],
    primaryColor: "#065f46",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1e293b;background:#fff;padding:40px; }
  .inv { max-width:760px;margin:0 auto; }
  .hdr { display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:24px;border-bottom:2px solid #065f46; }
  .brand h1 { font-size:22px;font-weight:800;color:#065f46; }
  .brand p { font-size:12px;color:#64748b;margin-top:4px; }
  .inv-info { text-align:right; }
  .inv-info .num { font-size:20px;font-weight:800;color:#065f46; }
  .inv-info .date { font-size:12px;color:#64748b;margin-top:4px; }
  .property-box { background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin-bottom:28px; }
  .prop-title { font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#065f46;font-weight:700;margin-bottom:12px; }
  .prop-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:16px; }
  .pg-item .pgl { font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#16a34a;margin-bottom:3px; }
  .pg-item .pgv { font-size:13px;font-weight:700;color:#064e3b; }
  .parties { display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:28px; }
  .party .pl { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#065f46;font-weight:700;margin-bottom:6px; }
  .party .pn { font-size:14px;font-weight:700;margin-bottom:4px; }
  .party .pi { font-size:12px;color:#64748b;line-height:1.7; }
  table { width:100%;border-collapse:collapse;margin-bottom:24px; }
  thead th { padding:10px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#fff;background:#065f46; }
  thead th:last-child { text-align:right; }
  tbody td { padding:12px 14px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9; }
  tbody td:last-child { text-align:right;font-weight:600; }
  .totals { display:flex;justify-content:flex-end;margin-bottom:24px; }
  .tb { width:240px; }
  .tr { display:flex;justify-content:space-between;font-size:13px;color:#64748b;padding:6px 0;border-bottom:1px solid #f1f5f9; }
  .tr.final { border:none;font-size:17px;font-weight:800;color:#064e3b;padding-top:12px;border-top:2px solid #065f46;margin-top:4px; }
  .tr.final span:last-child { color:#065f46; }
  .ft { text-align:center;font-size:11px;color:#94a3b8;padding-top:20px;border-top:1px solid #f1f5f9; }
</style></head>
<body>
<div class="inv">
  <div class="hdr">
    <div class="brand"><h1>🏠 GreenStone Properties</h1><p>Property Management & Real Estate Services</p></div>
    <div class="inv-info"><div class="num">#GSP-2024-0312</div><div class="date">March 1, 2024 · Due: March 5, 2024</div></div>
  </div>
  <div class="property-box">
    <div class="prop-title">Property Details</div>
    <div class="prop-grid">
      <div class="pg-item"><div class="pgl">Property</div><div class="pgv">Unit 4B — The Elms</div></div>
      <div class="pg-item"><div class="pgl">Address</div><div class="pgv">225 Oak Street, Denver, CO</div></div>
      <div class="pg-item"><div class="pgl">Lease Term</div><div class="pgv">Jan 2024 – Dec 2024</div></div>
    </div>
  </div>
  <div class="parties">
    <div class="party"><div class="pl">Property Manager</div><div class="pn">GreenStone Properties LLC</div><div class="pi">100 Main Street, Suite 300<br>Denver, CO 80202<br>mgmt@greenstoneprops.com</div></div>
    <div class="party"><div class="pl">Tenant</div><div class="pn">Sarah & David Kim</div><div class="pi">Unit 4B, 225 Oak Street<br>Denver, CO 80220<br>kim.sarah@email.com</div></div>
  </div>
  <table>
    <thead><tr><th>Description</th><th>Period</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>Monthly Rent — 2BR/1BA</td><td>March 2024</td><td>$2,200.00</td></tr>
      <tr><td>Parking Space (#B12)</td><td>March 2024</td><td>$150.00</td></tr>
      <tr><td>Pet Fee (1 cat)</td><td>March 2024</td><td>$35.00</td></tr>
      <tr><td>Water/Sewer Utility</td><td>Feb usage</td><td>$48.50</td></tr>
      <tr><td>Trash/Recycling</td><td>March 2024</td><td>$25.00</td></tr>
    </tbody>
  </table>
  <div class="totals"><div class="tb">
    <div class="tr"><span>Subtotal</span><span>$2,458.50</span></div>
    <div class="tr"><span>Late Fee</span><span>$0.00</span></div>
    <div class="tr final"><span>Total Due</span><span>$2,458.50</span></div>
  </div></div>
  <div class="ft">GreenStone Properties LLC · Pay via Resident Portal at pay.greenstoneprops.com · ACH/Check accepted<br>Late payment after the 5th incurs a $75 late fee. Questions? (303) 555-0190</div>
</div>
</body></html>`,
  },
  {
    id: "fitness-wellness",
    name: "Fitness & Wellness",
    description: "Energetic design for personal trainers and wellness coaches",
    category: "Creative",
    tags: ["fitness", "wellness", "trainer", "health", "gym"],
    primaryColor: "#16a34a",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;background:#f0fdf4;padding:40px; }
  .inv { max-width:720px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(22,163,74,0.08); }
  .hdr { background:linear-gradient(135deg,#14532d,#16a34a);padding:36px 40px;color:white;display:flex;justify-content:space-between;align-items:center; }
  .brand { font-size:22px;font-weight:900;letter-spacing:-0.5px; }
  .brand span { opacity:0.7;font-weight:400; }
  .inv-box { text-align:right; }
  .inv-box .num { font-size:16px;font-weight:800; }
  .inv-box .date { font-size:12px;opacity:0.7;margin-top:4px; }
  .body { padding:32px 40px; }
  .client-card { background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:28px;display:grid;grid-template-columns:1fr 1fr;gap:20px; }
  .cc-item .ccl { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#16a34a;margin-bottom:4px;font-weight:700; }
  .cc-item .ccv { font-size:13px;font-weight:600;color:#14532d; }
  .parties { display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px; }
  .party .pl { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#16a34a;font-weight:700;margin-bottom:6px; }
  .party .pn { font-size:14px;font-weight:700;margin-bottom:4px; }
  .party .pi { font-size:12px;color:#64748b;line-height:1.7; }
  table { width:100%;border-collapse:collapse;margin-bottom:24px; }
  thead th { padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#fff;background:#16a34a; }
  thead th:last-child { text-align:right; }
  tbody td { padding:11px 12px;font-size:13px;color:#334155;border-bottom:1px solid #f0fdf4; }
  tbody td:last-child { text-align:right;font-weight:600; }
  .totals { display:flex;justify-content:flex-end;margin-bottom:24px; }
  .tb { width:220px; }
  .tr { display:flex;justify-content:space-between;font-size:13px;color:#64748b;padding:5px 0;border-bottom:1px solid #f0fdf4; }
  .tr.final { border:none;font-size:16px;font-weight:800;color:#14532d;padding-top:10px;border-top:2px solid #16a34a;margin-top:4px; }
  .tr.final span:last-child { color:#16a34a; }
  .progress { background:#f0fdf4;border-radius:10px;padding:16px 20px;font-size:12px;color:#166534;line-height:1.7; }
  .progress strong { display:block;margin-bottom:4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#16a34a; }
  .ft { text-align:center;font-size:11px;color:#94a3b8;padding:20px 40px; }
</style></head>
<body>
<div class="inv">
  <div class="hdr">
    <div class="brand">💪 PEAK <span>Performance</span></div>
    <div class="inv-box"><div class="num">#PEAK-2024-0067</div><div class="date">March 1, 2024</div></div>
  </div>
  <div class="body">
    <div class="client-card">
      <div class="cc-item"><div class="ccl">Client</div><div class="ccv">Jason Park</div></div>
      <div class="cc-item"><div class="ccl">Program</div><div class="ccv">Strength & Conditioning (12-week)</div></div>
      <div class="cc-item"><div class="ccl">Month</div><div class="ccv">February 2024 (Month 2 of 3)</div></div>
      <div class="cc-item"><div class="ccl">Payment Due</div><div class="ccv">March 10, 2024</div></div>
    </div>
    <div class="parties">
      <div class="party"><div class="pl">Trainer</div><div class="pn">Coach Ryan Mitchell</div><div class="pi">PEAK Performance Fitness<br>NASM Certified (CPT, PES)<br>ryan@peakfit.co · (415) 555-0177</div></div>
      <div class="party"><div class="pl">Bill To</div><div class="pn">Jason Park</div><div class="pi">88 Harbor View Dr<br>San Francisco, CA 94111<br>jason.park@email.com</div></div>
    </div>
    <table>
      <thead><tr><th>Session / Service</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>1-on-1 Training Session (60 min)</td><td>8</td><td>$95.00</td><td>$760.00</td></tr>
        <tr><td>Nutrition Coaching (Monthly)</td><td>1</td><td>$150.00</td><td>$150.00</td></tr>
        <tr><td>InBody Composition Scan</td><td>1</td><td>$45.00</td><td>$45.00</td></tr>
        <tr><td>Custom Meal Plan Update</td><td>1</td><td>$75.00</td><td>$75.00</td></tr>
        <tr><td>Recovery Session (Stretch/Mobility)</td><td>2</td><td>$55.00</td><td>$110.00</td></tr>
      </tbody>
    </table>
    <div class="totals"><div class="tb">
      <div class="tr"><span>Subtotal</span><span>$1,140.00</span></div>
      <div class="tr"><span>Package Discount (10%)</span><span>−$114.00</span></div>
      <div class="tr final"><span>Total Due</span><span>$1,026.00</span></div>
    </div></div>
    <div class="progress"><strong>Progress Update</strong>Jason is showing excellent progress — up 12 lbs on bench press, body fat down 1.8%. Consistency has been fantastic this month. Recommend adding a third weekly session for the final 4 weeks. Keep crushing it! 🔥</div>
  </div>
  <div class="ft">PEAK Performance Fitness · Venmo: @coachryan · Zelle: ryan@peakfit.co</div>
</div>
</body></html>`,
  },
  {
    id: "nonprofit-charity",
    name: "Non-Profit & Charity",
    description: "Heartfelt donation receipt for nonprofits and charitable organizations",
    category: "Minimal",
    tags: ["nonprofit", "charity", "donation", "receipt", "tax-deductible"],
    primaryColor: "#7c3aed",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1e1b4b;background:#faf5ff;padding:40px; }
  .inv { max-width:680px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(124,58,237,0.06); }
  .hdr { background:linear-gradient(135deg,#4c1d95,#7c3aed);padding:40px;text-align:center;color:white; }
  .brand { font-size:24px;font-weight:800;margin-bottom:4px; }
  .brand-sub { font-size:12px;opacity:0.7;margin-bottom:20px; }
  .receipt-badge { display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);border-radius:8px;padding:8px 20px; }
  .receipt-badge .label { font-size:9px;text-transform:uppercase;letter-spacing:2px;opacity:0.7; }
  .receipt-badge .num { font-size:16px;font-weight:800;margin-top:2px; }
  .body { padding:36px 40px; }
  .thank-you { text-align:center;margin-bottom:28px; }
  .thank-you h2 { font-size:22px;color:#7c3aed;margin-bottom:8px; }
  .thank-you p { font-size:14px;color:#64748b;line-height:1.6; }
  .donation-box { background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:1px solid #ddd6fe;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px; }
  .don-amount { font-size:40px;font-weight:900;color:#7c3aed; }
  .don-label { font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#8b5cf6;margin-top:4px; }
  .details-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px; }
  .dg-item { background:#faf5ff;border-radius:8px;padding:14px 16px; }
  .dg-item .dgl { font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#8b5cf6;margin-bottom:4px; }
  .dg-item .dgv { font-size:13px;font-weight:700;color:#1e1b4b; }
  .tax-note { background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;font-size:12px;color:#166534;line-height:1.7;margin-bottom:24px; }
  .tax-note strong { display:block;margin-bottom:4px; }
  .mission { text-align:center;font-size:12px;color:#8b5cf6;font-style:italic;padding-top:20px;border-top:1px solid #ede9fe;line-height:1.7; }
  .ft { text-align:center;font-size:11px;color:#94a3b8;padding:20px 40px;background:#faf5ff; }
</style></head>
<body>
<div class="inv">
  <div class="hdr">
    <div class="brand">🤝 Hope Forward Foundation</div>
    <div class="brand-sub">Empowering Communities Through Education</div>
    <div class="receipt-badge"><div class="label">Donation Receipt</div><div class="num">#HFF-2024-DR-0445</div></div>
  </div>
  <div class="body">
    <div class="thank-you"><h2>Thank You for Your Generosity!</h2><p>Your donation makes a meaningful difference in the lives of students and families in underserved communities.</p></div>
    <div class="donation-box"><div class="don-amount">$2,500.00</div><div class="don-label">Tax-Deductible Donation</div></div>
    <div class="details-grid">
      <div class="dg-item"><div class="dgl">Donor</div><div class="dgv">Patricia & Robert Chen</div></div>
      <div class="dg-item"><div class="dgl">Date Received</div><div class="dgv">February 28, 2024</div></div>
      <div class="dg-item"><div class="dgl">Payment Method</div><div class="dgv">Online — Credit Card</div></div>
      <div class="dg-item"><div class="dgl">Campaign</div><div class="dgv">Spring Scholarship Fund</div></div>
      <div class="dg-item"><div class="dgl">Donor Address</div><div class="dgv">142 Willow Lane, Palo Alto, CA 94301</div></div>
      <div class="dg-item"><div class="dgl">Donor Email</div><div class="dgv">chen.patricia@email.com</div></div>
    </div>
    <div class="tax-note"><strong>Tax Deduction Information</strong>Hope Forward Foundation is a 501(c)(3) tax-exempt organization. EIN: 26-1234567. No goods or services were provided in exchange for this contribution. This receipt serves as your official acknowledgment for tax purposes. Please retain for your records.</div>
    <div class="mission">"Education is the most powerful weapon which you can use to change the world." — Nelson Mandela<br>Your gift will fund scholarships for 5 students this spring.</div>
  </div>
  <div class="ft">Hope Forward Foundation · 501(c)(3) · EIN: 26-1234567<br>200 Community Way, Palo Alto, CA 94301 · info@hopeforward.org · hopeforward.org</div>
</div>
</body></html>`,
  },
  {
    id: "event-planning",
    name: "Event Planning",
    description: "Vibrant template for event planners and wedding coordinators",
    category: "Creative",
    tags: ["event", "wedding", "planner", "celebration"],
    primaryColor: "#be185d",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:'Georgia',serif;color:#1a1a1a;background:#fdf2f8;padding:40px; }
  .inv { max-width:740px;margin:0 auto;background:#fff;border-radius:2px;overflow:hidden;box-shadow:0 4px 32px rgba(190,24,93,0.06); }
  .hdr { background:linear-gradient(135deg,#831843,#be185d);padding:40px 48px;color:white;display:flex;justify-content:space-between;align-items:flex-start; }
  .brand h1 { font-size:24px;letter-spacing:2px; }
  .brand p { font-size:11px;opacity:0.6;margin-top:4px;letter-spacing:2px;text-transform:uppercase; }
  .inv-box { text-align:right; }
  .inv-box .label { font-size:9px;text-transform:uppercase;letter-spacing:3px;opacity:0.5; }
  .inv-box .num { font-size:16px;letter-spacing:1px;margin-top:4px; }
  .inv-box .date { font-size:12px;opacity:0.6;margin-top:4px; }
  .pink-bar { height:3px;background:linear-gradient(90deg,#be185d,#ec4899,#f9a8d4); }
  .body { padding:40px 48px; }
  .event-box { background:#fdf2f8;border:1px solid #fbcfe8;border-radius:8px;padding:20px 24px;margin-bottom:28px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px; }
  .eb-item .ebl { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#be185d;margin-bottom:4px;font-weight:bold; }
  .eb-item .ebv { font-size:13px;font-weight:bold;color:#831843; }
  .parties { display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:28px; }
  .party .pl { font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#be185d;font-weight:bold;margin-bottom:6px; }
  .party .pn { font-size:15px;font-weight:bold;margin-bottom:4px; }
  .party .pi { font-size:12px;color:#6b7280;line-height:1.7; }
  table { width:100%;border-collapse:collapse;margin-bottom:24px; }
  thead th { padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#fff;background:#be185d; }
  thead th:last-child { text-align:right; }
  tbody td { padding:12px;font-size:13px;color:#374151;border-bottom:1px solid #fce7f3; }
  tbody td:last-child { text-align:right;font-weight:bold; }
  .totals { display:flex;justify-content:flex-end;margin-bottom:28px; }
  .tb { width:240px; }
  .tr { display:flex;justify-content:space-between;font-size:13px;color:#6b7280;padding:6px 0;border-bottom:1px solid #fce7f3; }
  .tr.final { border:none;font-size:17px;font-weight:bold;color:#831843;padding-top:12px;border-top:2px solid #be185d;margin-top:4px; }
  .tr.final span:last-child { color:#be185d; }
  .note { font-size:12px;color:#9ca3af;font-style:italic;text-align:center;padding-top:20px;border-top:1px solid #fce7f3; }
</style></head>
<body>
<div class="inv">
  <div class="hdr">
    <div class="brand"><h1>✨ Bliss Events</h1><p>Luxury Event Planning</p></div>
    <div class="inv-box"><div class="label">Invoice</div><div class="num">#BLI-2024-0078</div><div class="date">March 1, 2024</div></div>
  </div>
  <div class="pink-bar"></div>
  <div class="body">
    <div class="event-box">
      <div class="eb-item"><div class="ebl">Event</div><div class="ebv">Chen-Williams Wedding</div></div>
      <div class="eb-item"><div class="ebl">Date</div><div class="ebv">April 20, 2024</div></div>
      <div class="eb-item"><div class="ebl">Venue</div><div class="ebv">The Grand Estate, Napa</div></div>
    </div>
    <div class="parties">
      <div class="party"><div class="pl">Event Planner</div><div class="pn">Bliss Events Co.</div><div class="pi">Isabella Torres, Lead Planner<br>44 Event Row, Suite 2<br>Napa, CA 94558<br>isabella@blissevents.co</div></div>
      <div class="party"><div class="pl">Client</div><div class="pn">Michael Chen & Jessica Williams</div><div class="pi">555 Vineyard Lane<br>San Francisco, CA 94102<br>jessica.w@email.com</div></div>
    </div>
    <table>
      <thead><tr><th>Service / Item</th><th>Details</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>Full Event Planning Package</td><td>12-month coordination</td><td>$8,500.00</td></tr>
        <tr><td>Venue Decoration & Florals</td><td>Rose gold theme, 200 centerpieces</td><td>$6,200.00</td></tr>
        <tr><td>Catering (150 guests)</td><td>3-course dinner + cocktail hour</td><td>$18,750.00</td></tr>
        <tr><td>Photography & Videography</td><td>Full day, 2 shooters + drone</td><td>$5,800.00</td></tr>
        <tr><td>Live Band (6 piece)</td><td>4-hour reception performance</td><td>$4,500.00</td></tr>
        <tr><td>Lighting & AV Setup</td><td>String lights, uplighting, sound</td><td>$3,200.00</td></tr>
        <tr><td>Day-of Coordination Staff (6)</td><td>Setup to teardown (14 hrs)</td><td>$2,100.00</td></tr>
      </tbody>
    </table>
    <div class="totals"><div class="tb">
      <div class="tr"><span>Subtotal</span><span>$49,050.00</span></div>
      <div class="tr"><span>Tax (8.25%)</span><span>$4,046.63</span></div>
      <div class="tr"><span>Deposits Paid</span><span>−$20,000.00</span></div>
      <div class="tr final"><span>Balance Due</span><span>$33,096.63</span></div>
    </div></div>
    <div class="note">Final balance due 14 days before the event (April 6, 2024). Congratulations to the happy couple! 💕</div>
  </div>
</div>
</body></html>`,
  },
];
