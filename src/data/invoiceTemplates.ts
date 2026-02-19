export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  primaryColor: string;
  html: string;
}

export const invoiceTemplates: InvoiceTemplate[] = [
  {
    id: "classic-minimal",
    name: "Classic Minimal",
    description: "Clean, timeless design with elegant typography",
    category: "Minimal",
    tags: ["minimal", "clean", "professional"],
    primaryColor: "#1e3a5f",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; color: #1a1a1a; background: #fff; padding: 40px; }
  .invoice { max-width: 750px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
  .brand { font-size: 24px; font-weight: bold; color: #1e3a5f; letter-spacing: -0.5px; }
  .brand-sub { font-size: 12px; color: #888; margin-top: 4px; }
  .invoice-label { text-align: right; }
  .invoice-label h2 { font-size: 36px; color: #1e3a5f; font-weight: normal; }
  .invoice-label p { font-size: 13px; color: #888; margin-top: 4px; }
  .divider { border: none; border-top: 1px solid #e5e5e5; margin: 24px 0; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .party-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin-bottom: 8px; }
  .party-name { font-size: 15px; font-weight: bold; color: #1a1a1a; margin-bottom: 4px; }
  .party-info { font-size: 13px; color: #555; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead th { padding: 10px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #888; border-bottom: 1px solid #e5e5e5; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 14px 12px; font-size: 14px; color: #333; border-bottom: 1px solid #f0f0f0; }
  tbody td:last-child { text-align: right; }
  .totals { display: flex; justify-content: flex-end; margin-bottom: 40px; }
  .totals-box { width: 240px; }
  .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #555; }
  .totals-row.total { border-top: 1px solid #1e3a5f; margin-top: 8px; padding-top: 12px; font-size: 16px; font-weight: bold; color: #1e3a5f; }
  .footer { font-size: 12px; color: #aaa; text-align: center; padding-top: 24px; border-top: 1px solid #f0f0f0; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div>
      <div class="brand">ACME Corp</div>
      <div class="brand-sub">Professional Services</div>
    </div>
    <div class="invoice-label">
      <h2>Invoice</h2>
      <p>#INV-2024-001 &nbsp;|&nbsp; Due: March 31, 2024</p>
    </div>
  </div>
  <hr class="divider">
  <div class="parties">
    <div>
      <div class="party-label">From</div>
      <div class="party-name">ACME Corp</div>
      <div class="party-info">123 Business Ave<br>New York, NY 10001<br>billing@acme.com</div>
    </div>
    <div>
      <div class="party-label">Bill To</div>
      <div class="party-name">Client Company Inc.</div>
      <div class="party-info">456 Client Street<br>Los Angeles, CA 90001<br>accounts@clientco.com</div>
    </div>
  </div>
  <table>
    <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>Web Design Services</td><td>1</td><td>$2,500.00</td><td>$2,500.00</td></tr>
      <tr><td>Frontend Development</td><td>40 hrs</td><td>$95.00</td><td>$3,800.00</td></tr>
      <tr><td>SEO Optimization</td><td>1</td><td>$800.00</td><td>$800.00</td></tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="totals-box">
      <div class="totals-row"><span>Subtotal</span><span>$7,100.00</span></div>
      <div class="totals-row"><span>Tax (8%)</span><span>$568.00</span></div>
      <div class="totals-row total"><span>Total</span><span>$7,668.00</span></div>
    </div>
  </div>
  <div class="footer">Thank you for your business. Payment due within 30 days.</div>
</div>
</body>
</html>`,
  },
  {
    id: "modern-bold",
    name: "Modern Bold",
    description: "Striking design with bold typography and accent colors",
    category: "Modern",
    tags: ["modern", "bold", "colorful"],
    primaryColor: "#0f172a",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Arial', sans-serif; color: #0f172a; background: #fff; }
  .invoice { max-width: 800px; margin: 0 auto; }
  .top-bar { background: #0f172a; color: white; padding: 32px 40px; display: flex; justify-content: space-between; align-items: center; }
  .brand { font-size: 22px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
  .inv-number { text-align: right; }
  .inv-number .label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; }
  .inv-number .value { font-size: 20px; font-weight: bold; color: #f59e0b; }
  .accent-bar { height: 5px; background: linear-gradient(90deg, #f59e0b 0%, #ef4444 100%); }
  .body { padding: 40px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 40px; }
  .meta-item .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 6px; }
  .meta-item .value { font-size: 14px; font-weight: 600; color: #0f172a; }
  .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #f59e0b; font-weight: 700; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead tr { background: #f1f5f9; }
  thead th { padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 16px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; }
  tbody td:last-child { text-align: right; font-weight: 600; }
  .totals { display: flex; justify-content: flex-end; }
  .totals-box { width: 260px; background: #f8fafc; border-radius: 8px; padding: 20px; }
  .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #64748b; border-bottom: 1px solid #e2e8f0; }
  .totals-row.grand { border: none; padding-top: 16px; font-size: 18px; font-weight: 900; color: #0f172a; }
  .totals-row.grand span:last-child { color: #f59e0b; }
  .footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 2px solid #f1f5f9; }
  .payment-info { font-size: 12px; color: #64748b; }
  .badge { background: #dcfce7; color: #16a34a; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; }
</style>
</head>
<body>
<div class="invoice">
  <div class="top-bar">
    <div class="brand">InvoicePro</div>
    <div class="inv-number">
      <div class="label">Invoice Number</div>
      <div class="value">#2024-0042</div>
    </div>
  </div>
  <div class="accent-bar"></div>
  <div class="body">
    <div class="meta">
      <div class="meta-item"><div class="label">Issue Date</div><div class="value">March 1, 2024</div></div>
      <div class="meta-item"><div class="label">Due Date</div><div class="value">March 31, 2024</div></div>
      <div class="meta-item"><div class="label">Status</div><div class="value" style="color:#f59e0b">● Pending</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:40px;">
      <div>
        <div class="section-title">From</div>
        <strong>InvoicePro Studio</strong><br>
        <span style="font-size:13px;color:#64748b">789 Creative Blvd, Suite 200<br>San Francisco, CA 94105<br>hello@invoicepro.io</span>
      </div>
      <div>
        <div class="section-title">Billed To</div>
        <strong>TechStartup Inc.</strong><br>
        <span style="font-size:13px;color:#64748b">321 Innovation Dr<br>Austin, TX 78701<br>finance@techstartup.io</span>
      </div>
    </div>
    <div class="section-title">Services</div>
    <table>
      <thead><tr><th>Description</th><th>Hours</th><th>Rate</th><th>Total</th></tr></thead>
      <tbody>
        <tr><td>Brand Identity Design</td><td>16</td><td>$120</td><td>$1,920.00</td></tr>
        <tr><td>UI/UX Prototyping</td><td>24</td><td>$110</td><td>$2,640.00</td></tr>
        <tr><td>Development Handoff</td><td>8</td><td>$130</td><td>$1,040.00</td></tr>
        <tr><td>Project Management</td><td>4</td><td>$90</td><td>$360.00</td></tr>
      </tbody>
    </table>
    <div class="totals">
      <div class="totals-box">
        <div class="totals-row"><span>Subtotal</span><span>$5,960.00</span></div>
        <div class="totals-row"><span>Discount (5%)</span><span>−$298.00</span></div>
        <div class="totals-row"><span>Tax (10%)</span><span>$566.20</span></div>
        <div class="totals-row grand"><span>Grand Total</span><span>$6,228.20</span></div>
      </div>
    </div>
    <div class="footer">
      <div class="payment-info">Bank Transfer · Routing: 021000021 · Acct: 1234567890</div>
      <div class="badge">Net 30</div>
    </div>
  </div>
</div>
</body>
</html>`,
  },
  {
    id: "elegant-luxury",
    name: "Elegant Luxury",
    description: "Gold-accented premium design for high-end services",
    category: "Luxury",
    tags: ["luxury", "elegant", "gold", "premium"],
    primaryColor: "#b8860b",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; background: #faf8f4; color: #2c2416; padding: 0; }
  .invoice { max-width: 780px; margin: 0 auto; background: #fff; box-shadow: 0 4px 40px rgba(0,0,0,0.08); }
  .header { padding: 50px 60px 40px; background: #1a1208; color: white; position: relative; overflow: hidden; }
  .header::after { content: ''; position: absolute; top: 0; right: 0; width: 200px; height: 100%; background: linear-gradient(135deg, transparent 0%, rgba(184,134,11,0.15) 100%); }
  .brand { font-size: 28px; letter-spacing: 4px; text-transform: uppercase; color: #d4a520; font-weight: normal; }
  .brand-tagline { font-size: 11px; letter-spacing: 3px; color: #8a7a5a; margin-top: 4px; text-transform: uppercase; }
  .inv-title { font-size: 13px; letter-spacing: 4px; text-transform: uppercase; color: #8a7a5a; margin-top: 32px; }
  .inv-num { font-size: 15px; letter-spacing: 2px; color: #d4a520; margin-top: 4px; }
  .gold-line { height: 2px; background: linear-gradient(90deg, #d4a520, #f0c84a, #d4a520); }
  .body { padding: 50px 60px; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 48px; }
  .party-label { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: #d4a520; margin-bottom: 12px; }
  .party-name { font-size: 17px; font-weight: bold; color: #1a1208; margin-bottom: 6px; }
  .party-info { font-size: 13px; color: #6b5d44; line-height: 1.7; }
  .dates { display: flex; gap: 40px; margin-bottom: 48px; }
  .date-item .label { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: #d4a520; margin-bottom: 6px; }
  .date-item .value { font-size: 14px; color: #1a1208; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
  thead th { padding: 12px 0; text-align: left; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: #8a7a5a; border-bottom: 1px solid #d4a520; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 18px 0; font-size: 14px; color: #2c2416; border-bottom: 1px solid #f0ebe0; }
  tbody td:last-child { text-align: right; color: #1a1208; font-weight: 600; }
  .totals { display: flex; justify-content: flex-end; margin-bottom: 48px; }
  .totals-inner { width: 280px; }
  .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #6b5d44; }
  .totals-row.final { padding-top: 16px; border-top: 1px solid #d4a520; margin-top: 8px; font-size: 18px; color: #1a1208; font-weight: bold; }
  .totals-row.final span:last-child { color: #d4a520; }
  .footer-note { text-align: center; font-size: 12px; color: #8a7a5a; font-style: italic; padding-top: 32px; border-top: 1px solid #f0ebe0; letter-spacing: 0.5px; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="brand">Aurum Studio</div>
    <div class="brand-tagline">Excellence in Design</div>
    <div class="inv-title">Invoice</div>
    <div class="inv-num">#AUR-2024-088</div>
  </div>
  <div class="gold-line"></div>
  <div class="body">
    <div class="dates">
      <div class="date-item"><div class="label">Issued</div><div class="value">March 1, 2024</div></div>
      <div class="date-item"><div class="label">Due Date</div><div class="value">April 1, 2024</div></div>
    </div>
    <div class="parties">
      <div>
        <div class="party-label">From</div>
        <div class="party-name">Aurum Studio Ltd.</div>
        <div class="party-info">1 Mayfair Square<br>London, W1K 6TF<br>invoices@aurumstudio.co.uk</div>
      </div>
      <div>
        <div class="party-label">Invoice For</div>
        <div class="party-name">Prestige Holdings PLC</div>
        <div class="party-info">88 Kensington High St<br>London, W8 4SG<br>accounts@prestige.co.uk</div>
      </div>
    </div>
    <table>
      <thead><tr><th>Service</th><th>Description</th><th>Qty</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>Luxury Branding</td><td>Full visual identity system</td><td>1</td><td>£8,500.00</td></tr>
        <tr><td>Photography</td><td>Professional product shoot (full day)</td><td>1</td><td>£2,200.00</td></tr>
        <tr><td>Print Collateral</td><td>Business cards, stationery set</td><td>500</td><td>£1,450.00</td></tr>
        <tr><td>Retouching</td><td>Post-production per image</td><td>20</td><td>£600.00</td></tr>
      </tbody>
    </table>
    <div class="totals">
      <div class="totals-inner">
        <div class="totals-row"><span>Subtotal</span><span>£12,750.00</span></div>
        <div class="totals-row"><span>VAT (20%)</span><span>£2,550.00</span></div>
        <div class="totals-row final"><span>Total Due</span><span>£15,300.00</span></div>
      </div>
    </div>
    <div class="footer-note">"We are grateful for your continued trust. Payment kindly requested within 30 days."</div>
  </div>
</div>
</body>
</html>`,
  },
  {
    id: "tech-startup",
    name: "Tech Startup",
    description: "Clean, modern design for tech and SaaS companies",
    category: "Modern",
    tags: ["tech", "startup", "saas", "modern"],
    primaryColor: "#6366f1",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background: #fff; padding: 40px; }
  .invoice { max-width: 760px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
  .logo-area { display: flex; align-items: center; gap: 12px; }
  .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; }
  .logo-text { font-size: 18px; font-weight: 700; color: #111827; }
  .logo-sub { font-size: 12px; color: #6b7280; }
  .status-chip { display: inline-block; background: #fef3c7; color: #d97706; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.8px; }
  .inv-details { text-align: right; }
  .inv-num { font-size: 24px; font-weight: 800; color: #6366f1; }
  .inv-date { font-size: 13px; color: #6b7280; margin-top: 4px; }
  .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; background: #f9fafb; border-radius: 12px; padding: 20px 24px; margin-bottom: 40px; }
  .info-item .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 4px; }
  .info-item .value { font-size: 14px; font-weight: 600; color: #111827; }
  .section-header { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #6b7280; margin-bottom: 12px; }
  .bill-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .bill-box { }
  .bill-name { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px; }
  .bill-addr { font-size: 13px; color: #6b7280; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; border-radius: 12px; overflow: hidden; }
  thead tr { background: #6366f1; }
  thead th { padding: 13px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: white; font-weight: 600; }
  thead th:last-child { text-align: right; }
  tbody tr:nth-child(even) { background: #f9fafb; }
  tbody td { padding: 14px 16px; font-size: 14px; color: #374151; }
  tbody td:last-child { text-align: right; font-weight: 600; color: #111827; }
  .totals-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .notes { width: 45%; }
  .notes p { font-size: 12px; color: #6b7280; line-height: 1.6; }
  .totals-box { width: 45%; }
  .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #6b7280; }
  .totals-row.total { padding: 12px 16px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px; color: white; font-size: 16px; font-weight: 700; margin-top: 8px; }
  .footer { display: flex; justify-content: space-between; font-size: 12px; color: #9ca3af; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="logo-area">
      <div class="logo-icon">N</div>
      <div>
        <div class="logo-text">NexaCloud</div>
        <div class="logo-sub">Software & APIs</div>
      </div>
    </div>
    <div class="inv-details">
      <div class="status-chip">Unpaid</div>
      <div class="inv-num">#INV-2024-019</div>
      <div class="inv-date">Issued: March 1, 2024</div>
    </div>
  </div>
  <div class="info-grid">
    <div class="info-item"><div class="label">Issue Date</div><div class="value">Mar 1, 2024</div></div>
    <div class="info-item"><div class="label">Due Date</div><div class="value">Mar 31, 2024</div></div>
    <div class="info-item"><div class="label">Currency</div><div class="value">USD</div></div>
    <div class="info-item"><div class="label">Payment</div><div class="value">Net 30</div></div>
  </div>
  <div class="bill-grid">
    <div class="bill-box">
      <div class="section-header">From</div>
      <div class="bill-name">NexaCloud Inc.</div>
      <div class="bill-addr">500 Tech Park Drive, Suite 800<br>Seattle, WA 98101<br>billing@nexacloud.io · +1 (206) 555-0100</div>
    </div>
    <div class="bill-box">
      <div class="section-header">Bill To</div>
      <div class="bill-name">DataFlow Systems LLC</div>
      <div class="bill-addr">200 Enterprise Way<br>Chicago, IL 60601<br>accounts@dataflow.io · +1 (312) 555-0200</div>
    </div>
  </div>
  <table>
    <thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
    <tbody>
      <tr><td>API Pro Plan (Monthly)</td><td>1</td><td>$599.00</td><td>$599.00</td></tr>
      <tr><td>Additional API Calls (1M)</td><td>5</td><td>$29.00</td><td>$145.00</td></tr>
      <tr><td>Premium Support</td><td>1</td><td>$299.00</td><td>$299.00</td></tr>
      <tr><td>Dedicated Server (32GB RAM)</td><td>1</td><td>$449.00</td><td>$449.00</td></tr>
      <tr><td>Onboarding Session</td><td>2 hrs</td><td>$150.00</td><td>$300.00</td></tr>
    </tbody>
  </table>
  <div class="totals-section">
    <div class="notes">
      <div class="section-header">Payment Notes</div>
      <p>Please include invoice number in payment reference. Bank transfer preferred. For questions contact billing@nexacloud.io</p>
    </div>
    <div class="totals-box">
      <div class="totals-row"><span>Subtotal</span><span>$1,792.00</span></div>
      <div class="totals-row"><span>Tax (8.5%)</span><span>$152.32</span></div>
      <div class="totals-row total"><span>Total Due</span><span>$1,944.32</span></div>
    </div>
  </div>
  <div class="footer"><span>nexacloud.io · Privacy Policy · Terms</span><span>Thank you for your business 🚀</span></div>
</div>
</body>
</html>`,
  },
  {
    id: "creative-agency",
    name: "Creative Agency",
    description: "Vibrant and artistic design for creative professionals",
    category: "Creative",
    tags: ["creative", "agency", "colorful", "artistic"],
    primaryColor: "#ec4899",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #fff; color: #111; }
  .invoice { max-width: 800px; margin: 0 auto; }
  .sidebar-layout { display: grid; grid-template-columns: 220px 1fr; min-height: 900px; }
  .sidebar { background: #111; color: white; padding: 40px 30px; }
  .sidebar-logo { font-size: 20px; font-weight: 900; letter-spacing: -1px; margin-bottom: 8px; }
  .sidebar-logo span { color: #ec4899; }
  .sidebar-tagline { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-bottom: 48px; }
  .sidebar-section { margin-bottom: 36px; }
  .sidebar-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #ec4899; margin-bottom: 10px; }
  .sidebar-text { font-size: 13px; color: #ccc; line-height: 1.7; }
  .sidebar-amount { margin-top: 40px; padding: 20px; border: 1px solid #333; border-radius: 8px; }
  .sidebar-amount .amt-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-bottom: 8px; }
  .sidebar-amount .amt-value { font-size: 28px; font-weight: 900; color: #ec4899; }
  .main { padding: 40px; }
  .main-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .inv-title { font-size: 48px; font-weight: 900; color: #111; line-height: 1; letter-spacing: -2px; }
  .inv-title span { color: #ec4899; }
  .inv-meta { text-align: right; font-size: 13px; color: #888; }
  .inv-meta strong { display: block; font-size: 15px; color: #111; font-weight: 700; }
  .accent-line { width: 60px; height: 4px; background: linear-gradient(90deg, #ec4899, #8b5cf6); border-radius: 2px; margin: 20px 0; }
  .client-section { margin-bottom: 40px; }
  .client-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #ec4899; margin-bottom: 8px; }
  .client-name { font-size: 18px; font-weight: 800; color: #111; }
  .client-detail { font-size: 13px; color: #888; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead th { padding: 10px 0; text-align: left; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #888; border-bottom: 2px solid #f0f0f0; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 16px 0; font-size: 14px; color: #333; border-bottom: 1px solid #f5f5f5; }
  tbody td:first-child { font-weight: 600; color: #111; }
  tbody td:last-child { text-align: right; font-weight: 700; color: #111; }
  .sub-totals { margin-left: auto; width: 220px; }
  .st-row { display: flex; justify-content: space-between; font-size: 13px; color: #888; padding: 6px 0; }
  .st-row.final { font-size: 16px; color: #111; font-weight: 900; padding-top: 12px; border-top: 2px solid #111; }
  .terms { margin-top: 40px; font-size: 11px; color: #aaa; }
</style>
</head>
<body>
<div class="invoice">
  <div class="sidebar-layout">
    <div class="sidebar">
      <div class="sidebar-logo">PIXEL<span>&</span>CO</div>
      <div class="sidebar-tagline">Creative Studio</div>
      <div class="sidebar-section">
        <div class="sidebar-label">From</div>
        <div class="sidebar-text">Pixel &amp; Co.<br>22 Design District<br>Brooklyn, NY 11201<br><br>hello@pixelandco.com<br>+1 718 555 0102</div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">Invoice Date</div>
        <div class="sidebar-text">March 1, 2024</div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">Due Date</div>
        <div class="sidebar-text">March 28, 2024</div>
      </div>
      <div class="sidebar-amount">
        <div class="amt-label">Amount Due</div>
        <div class="amt-value">$9,240</div>
      </div>
    </div>
    <div class="main">
      <div class="main-header">
        <div>
          <div class="inv-title">INV<span>.</span></div>
          <div class="inv-title">#034</div>
        </div>
        <div class="inv-meta">
          <strong>Pixel &amp; Co. Studio</strong>
          Tax ID: 99-8765432
        </div>
      </div>
      <div class="accent-line"></div>
      <div class="client-section">
        <div class="client-label">Billed To</div>
        <div class="client-name">Visionary Brands Ltd.</div>
        <div class="client-detail">44 Advertising Row, Manhattan, NY 10019 · pay@visionary.com</div>
      </div>
      <table>
        <thead><tr><th>Project / Service</th><th>Days</th><th>Rate</th><th>Total</th></tr></thead>
        <tbody>
          <tr><td>Campaign Strategy &amp; Direction</td><td>3</td><td>$1,200</td><td>$3,600</td></tr>
          <tr><td>Visual Content Production</td><td>2</td><td>$1,100</td><td>$2,200</td></tr>
          <tr><td>Social Media Toolkit</td><td>1</td><td>$900</td><td>$900</td></tr>
          <tr><td>Motion Graphics (5 clips)</td><td>2</td><td>$800</td><td>$1,600</td></tr>
          <tr><td>Client Revisions (2 rounds)</td><td>1</td><td>$600</td><td>$600</td></tr>
        </tbody>
      </table>
      <div class="sub-totals">
        <div class="st-row"><span>Subtotal</span><span>$8,900</span></div>
        <div class="st-row"><span>Tax (3.8%)</span><span>$338</span></div>
        <div class="st-row final"><span>Total</span><span>$9,238</span></div>
      </div>
      <div class="terms">Payment via wire transfer or check. Late payments incur 1.5% monthly interest. © 2024 Pixel &amp; Co.</div>
    </div>
  </div>
</div>
</body>
</html>`,
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    description: "Professional blue-themed invoice for enterprises",
    category: "Corporate",
    tags: ["corporate", "blue", "enterprise", "formal"],
    primaryColor: "#1d4ed8",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Trebuchet MS', Arial, sans-serif; color: #1e293b; background: #fff; padding: 40px; }
  .invoice { max-width: 770px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%); color: white; padding: 36px 40px; display: flex; justify-content: space-between; align-items: center; }
  .company-info h1 { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
  .company-info p { font-size: 12px; opacity: 0.75; margin-top: 6px; line-height: 1.6; }
  .invoice-info { text-align: right; }
  .invoice-info .inv-word { font-size: 36px; font-weight: 900; letter-spacing: -1px; opacity: 0.25; text-transform: uppercase; }
  .invoice-info .inv-num { font-size: 16px; font-weight: 700; color: #93c5fd; }
  .invoice-info .inv-date { font-size: 12px; opacity: 0.75; margin-top: 4px; }
  .sub-header { background: #1e3a8a; padding: 12px 40px; display: flex; gap: 40px; }
  .sub-info span { font-size: 11px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1px; }
  .sub-info strong { display: block; font-size: 13px; color: white; margin-top: 2px; }
  .body { padding: 40px; }
  .addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 2px solid #e2e8f0; }
  .addr-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #1d4ed8; font-weight: 700; margin-bottom: 10px; }
  .addr-name { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
  .addr-text { font-size: 13px; color: #64748b; line-height: 1.7; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead { background: #eff6ff; }
  thead th { padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #1d4ed8; font-weight: 700; border-top: 2px solid #1d4ed8; border-bottom: 1px solid #dbeafe; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 14px 16px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; }
  tbody td:last-child { text-align: right; font-weight: 600; }
  tfoot td { padding: 8px 16px; font-size: 14px; color: #64748b; text-align: right; }
  tfoot tr.grand td { padding: 14px 16px; font-size: 16px; font-weight: 700; color: white; background: #1d4ed8; }
  .payment { margin-top: 24px; padding: 20px; background: #f8fafc; border-left: 4px solid #1d4ed8; border-radius: 0 8px 8px 0; }
  .payment h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #1d4ed8; margin-bottom: 10px; }
  .payment p { font-size: 13px; color: #64748b; line-height: 1.6; }
  .footer { display: flex; justify-content: space-between; align-items: center; padding: 16px 40px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="company-info">
      <h1>GlobalTech Solutions</h1>
      <p>Enterprise Software &amp; Consulting<br>1000 Corporate Center Dr · Chicago, IL 60601<br>invoices@globaltech.com · (312) 555-0300</p>
    </div>
    <div class="invoice-info">
      <div class="inv-word">Invoice</div>
      <div class="inv-num">#GT-2024-0156</div>
      <div class="inv-date">Date: March 1, 2024</div>
    </div>
  </div>
  <div class="sub-header">
    <div class="sub-info"><span>Issue Date</span><strong>March 1, 2024</strong></div>
    <div class="sub-info"><span>Due Date</span><strong>March 31, 2024</strong></div>
    <div class="sub-info"><span>Payment Terms</span><strong>Net 30</strong></div>
    <div class="sub-info"><span>Currency</span><strong>USD</strong></div>
  </div>
  <div class="body">
    <div class="addresses">
      <div>
        <div class="addr-label">Billing From</div>
        <div class="addr-name">GlobalTech Solutions Inc.</div>
        <div class="addr-text">1000 Corporate Center Dr<br>Chicago, IL 60601<br>EIN: 12-3456789</div>
      </div>
      <div>
        <div class="addr-label">Billing To</div>
        <div class="addr-name">Meridian Financial Corp.</div>
        <div class="addr-text">500 Financial District Blvd<br>New York, NY 10004<br>PO#: MFC-8821</div>
      </div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Description of Services</th><th>Period</th><th>Units</th><th>Rate</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>Enterprise License (Tier 3)</td><td>Q1 2024</td><td>1</td><td>$12,000</td><td>$12,000.00</td></tr>
        <tr><td>2</td><td>Implementation Services</td><td>Feb–Mar</td><td>80 hrs</td><td>$200</td><td>$16,000.00</td></tr>
        <tr><td>3</td><td>Data Migration</td><td>Feb 2024</td><td>1</td><td>$4,500</td><td>$4,500.00</td></tr>
        <tr><td>4</td><td>Training Workshops</td><td>Mar 2024</td><td>3 days</td><td>$1,800</td><td>$5,400.00</td></tr>
        <tr><td>5</td><td>Annual Support Contract</td><td>2024</td><td>1</td><td>$6,000</td><td>$6,000.00</td></tr>
      </tbody>
      <tfoot>
        <tr><td colspan="5">Subtotal</td><td>$43,900.00</td></tr>
        <tr><td colspan="5">Federal Tax (0%)</td><td>$0.00</td></tr>
        <tr><td colspan="5">State Tax (IL 6.25%)</td><td>$2,743.75</td></tr>
        <tr class="grand"><td colspan="5">TOTAL DUE</td><td>$46,643.75</td></tr>
      </tfoot>
    </table>
    <div class="payment">
      <h4>Payment Instructions</h4>
      <p>Bank: First National Bank · ABA Routing: 071000013 · Account: 9876543210 · Swift: FNBCUS33<br>Please reference invoice number GT-2024-0156 with all payments.</p>
    </div>
  </div>
  <div class="footer"><span>GlobalTech Solutions Inc. · Confidential</span><span>Page 1 of 1</span></div>
</div>
</body>
</html>`,
  },
  {
    id: "freelancer-simple",
    name: "Freelancer Simple",
    description: "Straightforward and clean for independent professionals",
    category: "Minimal",
    tags: ["freelancer", "simple", "minimal", "consultant"],
    primaryColor: "#059669",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #18181b; background: #fff; padding: 48px; }
  .invoice { max-width: 680px; margin: 0 auto; }
  .top { display: flex; justify-content: space-between; margin-bottom: 56px; }
  .name { font-size: 26px; font-weight: 800; color: #18181b; }
  .profession { font-size: 13px; color: #71717a; margin-top: 4px; }
  .inv-badge { display: inline-flex; align-items: center; gap: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px 16px; }
  .inv-badge .dot { width: 8px; height: 8px; background: #059669; border-radius: 50%; }
  .inv-badge span { font-size: 13px; font-weight: 600; color: #059669; }
  .meta-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 1px solid #e4e4e7; border-radius: 10px; overflow: hidden; margin-bottom: 48px; }
  .meta-cell { padding: 16px 20px; }
  .meta-cell + .meta-cell { border-left: 1px solid #e4e4e7; }
  .meta-cell .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #a1a1aa; margin-bottom: 4px; }
  .meta-cell .value { font-size: 14px; font-weight: 600; color: #18181b; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .party .plabel { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #059669; margin-bottom: 8px; font-weight: 700; }
  .party .pname { font-size: 15px; font-weight: 700; color: #18181b; margin-bottom: 4px; }
  .party .pinfo { font-size: 13px; color: #71717a; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead th { padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #a1a1aa; text-align: left; border-bottom: 2px solid #e4e4e7; font-weight: 600; }
  thead th:last-child { text-align: right; }
  tbody tr td { padding: 16px 0; font-size: 14px; border-bottom: 1px solid #f4f4f5; }
  tbody tr:last-child td { border-bottom: none; }
  tbody td:last-child { text-align: right; font-weight: 700; color: #18181b; }
  .totals-wrapper { border-top: 2px solid #e4e4e7; padding-top: 24px; display: flex; justify-content: flex-end; margin-bottom: 48px; }
  .totals { width: 240px; }
  .trow { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; color: #71717a; }
  .trow.main { font-size: 18px; font-weight: 800; color: #18181b; border-top: 1px solid #e4e4e7; padding-top: 12px; margin-top: 6px; }
  .trow.main span:last-child { color: #059669; }
  .bank-info { background: #f4f4f5; border-radius: 10px; padding: 20px 24px; font-size: 13px; color: #71717a; line-height: 1.7; margin-bottom: 32px; }
  .bank-info strong { color: #18181b; display: block; margin-bottom: 6px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .footer { font-size: 12px; color: #a1a1aa; text-align: center; }
</style>
</head>
<body>
<div class="invoice">
  <div class="top">
    <div>
      <div class="name">Alex Thompson</div>
      <div class="profession">Full-Stack Developer &amp; Consultant</div>
    </div>
    <div class="inv-badge">
      <span class="dot"></span>
      <span>Invoice #AT-2024-07</span>
    </div>
  </div>
  <div class="meta-row">
    <div class="meta-cell"><div class="label">Date Issued</div><div class="value">March 1, 2024</div></div>
    <div class="meta-cell"><div class="label">Payment Due</div><div class="value">March 21, 2024</div></div>
    <div class="meta-cell"><div class="label">Amount Due</div><div class="value" style="color:#059669">$6,120.00</div></div>
  </div>
  <div class="parties">
    <div class="party">
      <div class="plabel">From</div>
      <div class="pname">Alex Thompson</div>
      <div class="pinfo">42 Dev Street, Apt 3<br>Portland, OR 97201<br>alex@alexthompson.dev</div>
    </div>
    <div class="party">
      <div class="plabel">To</div>
      <div class="pname">GrowthLab Ventures</div>
      <div class="pinfo">101 Startup Blvd<br>Boulder, CO 80301<br>ops@growthlabvc.com</div>
    </div>
  </div>
  <table>
    <thead><tr><th>Description</th><th>Hours</th><th>Rate/hr</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>Backend API Development (Node.js)</td><td>28</td><td>$120</td><td>$3,360</td></tr>
      <tr><td>Database Design &amp; Optimization</td><td>12</td><td>$130</td><td>$1,560</td></tr>
      <tr><td>Code Review &amp; Documentation</td><td>6</td><td>$100</td><td>$600</td></tr>
      <tr><td>Deployment &amp; DevOps Setup</td><td>4</td><td>$110</td><td>$440</td></tr>
    </tbody>
  </table>
  <div class="totals-wrapper">
    <div class="totals">
      <div class="trow"><span>Subtotal (50 hrs)</span><span>$5,960</span></div>
      <div class="trow"><span>Expenses</span><span>$160</span></div>
      <div class="trow main"><span>Total Due</span><span>$6,120</span></div>
    </div>
  </div>
  <div class="bank-info">
    <strong>Payment Details</strong>
    Bank of America · Routing 026009593 · Account 1234567890<br>
    Venmo: @alex-thompson-dev · PayPal: alex@alexthompson.dev<br>
    Please pay within 20 days. Reference: AT-2024-07
  </div>
  <div class="footer">Thank you for working with me! Questions? alex@alexthompson.dev · (503) 555-0199</div>
</div>
</body>
</html>`,
  },
  {
    id: "dark-premium",
    name: "Dark Premium",
    description: "Sleek dark-mode invoice with vibrant neon accents",
    category: "Modern",
    tags: ["dark", "premium", "neon", "sleek"],
    primaryColor: "#22d3ee",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e2e8f0; background: #0a0f1e; padding: 40px; }
  .invoice { max-width: 760px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
  .header { padding: 40px; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #1e293b; }
  .brand-name { font-size: 22px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
  .brand-dot { color: #22d3ee; }
  .brand-sub { font-size: 12px; color: #475569; margin-top: 4px; }
  .inv-badge { background: rgba(34, 211, 238, 0.1); border: 1px solid rgba(34, 211, 238, 0.3); border-radius: 8px; padding: 12px 20px; text-align: right; }
  .inv-badge .inv-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #22d3ee; margin-bottom: 4px; }
  .inv-badge .inv-num { font-size: 20px; font-weight: 800; color: #f1f5f9; }
  .cyan-bar { height: 2px; background: linear-gradient(90deg, #22d3ee, #818cf8, transparent); }
  .body { padding: 40px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .info-block .info-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #22d3ee; margin-bottom: 10px; }
  .info-block .info-name { font-size: 16px; font-weight: 700; color: #f1f5f9; margin-bottom: 4px; }
  .info-block .info-text { font-size: 13px; color: #64748b; line-height: 1.7; }
  .dates-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 40px; }
  .date-chip { background: #1e293b; border-radius: 8px; padding: 14px 16px; }
  .date-chip .dc-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #475569; margin-bottom: 6px; }
  .date-chip .dc-value { font-size: 14px; font-weight: 600; color: #e2e8f0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead tr { background: #1e293b; }
  thead th { padding: 12px 16px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 16px; font-size: 14px; color: #cbd5e1; border-bottom: 1px solid #1e293b; }
  tbody td:last-child { text-align: right; color: #22d3ee; font-weight: 700; }
  tbody tr:hover td { background: rgba(255,255,255,0.02); }
  .total-section { display: flex; justify-content: flex-end; }
  .total-box { width: 260px; }
  .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #64748b; border-bottom: 1px solid #1e293b; }
  .total-grand { display: flex; justify-content: space-between; margin-top: 16px; padding: 16px; background: rgba(34, 211, 238, 0.08); border: 1px solid rgba(34, 211, 238, 0.2); border-radius: 8px; }
  .total-grand .tg-label { font-size: 16px; font-weight: 800; color: #f1f5f9; }
  .total-grand .tg-value { font-size: 20px; font-weight: 900; color: #22d3ee; }
  .footer-bar { margin-top: 40px; padding: 20px 0 0; border-top: 1px solid #1e293b; display: flex; justify-content: space-between; font-size: 12px; color: #475569; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div>
      <div class="brand-name">Orbit<span class="brand-dot">.</span>io</div>
      <div class="brand-sub">Digital Products &amp; Solutions</div>
    </div>
    <div class="inv-badge">
      <div class="inv-label">Invoice</div>
      <div class="inv-num">#ORB-2024-022</div>
    </div>
  </div>
  <div class="cyan-bar"></div>
  <div class="body">
    <div class="dates-row">
      <div class="date-chip"><div class="dc-label">Issue Date</div><div class="dc-value">Mar 1, 2024</div></div>
      <div class="date-chip"><div class="dc-label">Due Date</div><div class="dc-value">Mar 31, 2024</div></div>
      <div class="date-chip"><div class="dc-label">Status</div><div class="dc-value" style="color:#f59e0b">● Outstanding</div></div>
    </div>
    <div class="grid-2">
      <div class="info-block">
        <div class="info-label">Provider</div>
        <div class="info-name">Orbit.io LLC</div>
        <div class="info-text">77 Silicon Alley, Floor 12<br>New York, NY 10011<br>billing@orbit.io</div>
      </div>
      <div class="info-block">
        <div class="info-label">Client</div>
        <div class="info-name">Quantum Dynamics Co.</div>
        <div class="info-text">1 Innovation Hub<br>Boston, MA 02101<br>finance@quantumdyn.com</div>
      </div>
    </div>
    <table>
      <thead><tr><th>Service / Item</th><th>Units</th><th>Unit Price</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>SaaS Platform License (Pro)</td><td>12 mo</td><td>$299/mo</td><td>$3,588.00</td></tr>
        <tr><td>AI Analytics Module</td><td>1</td><td>$1,200</td><td>$1,200.00</td></tr>
        <tr><td>Custom Integration (Slack)</td><td>1</td><td>$850</td><td>$850.00</td></tr>
        <tr><td>Priority Support Tier</td><td>12 mo</td><td>$99/mo</td><td>$1,188.00</td></tr>
        <tr><td>Team Seats (×10)</td><td>12 mo</td><td>$15/seat</td><td>$1,800.00</td></tr>
      </tbody>
    </table>
    <div class="total-section">
      <div class="total-box">
        <div class="total-row"><span>Subtotal</span><span>$8,626.00</span></div>
        <div class="total-row"><span>Discount (10%)</span><span>−$862.60</span></div>
        <div class="total-row"><span>Tax (7%)</span><span>$544.72</span></div>
        <div class="total-grand">
          <span class="tg-label">Total Due</span>
          <span class="tg-value">$8,308.12</span>
        </div>
      </div>
    </div>
    <div class="footer-bar">
      <span>Orbit.io LLC · EIN 45-6789012</span>
      <span>Wire: Silvergate Bank · Routing 122238420 · Acct 5678901234</span>
    </div>
  </div>
</div>
</body>
</html>`,
  },
  {
    id: "retro-pastel",
    name: "Retro Pastel",
    description: "Nostalgic pastel palette with a warm, handcrafted feel",
    category: "Creative",
    tags: ["retro", "pastel", "warm", "handcrafted"],
    primaryColor: "#db7d4e",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Courier Prime', 'Courier New', monospace; color: #3d2b1f; background: #fdf6ec; padding: 40px; }
  .invoice { max-width: 720px; margin: 0 auto; background: #fff9f0; border: 2px solid #3d2b1f; border-radius: 2px; overflow: hidden; }
  .stamp-header { background: #db7d4e; padding: 32px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3d2b1f; }
  .brand-stamp { font-size: 28px; font-weight: 700; color: #fff9f0; letter-spacing: 2px; text-transform: uppercase; }
  .brand-year { font-size: 11px; color: rgba(255,249,240,0.7); letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
  .inv-stamp { text-align: right; }
  .inv-stamp .stamp-box { display: inline-block; border: 2px solid rgba(255,249,240,0.5); padding: 8px 16px; }
  .inv-stamp .s-label { font-size: 10px; letter-spacing: 3px; color: rgba(255,249,240,0.7); text-transform: uppercase; }
  .inv-stamp .s-num { font-size: 18px; font-weight: 700; color: #fff9f0; margin-top: 4px; }
  .body { padding: 40px; }
  .rule { border: none; border-top: 1px dashed #c9a87c; margin: 28px 0; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
  .party .plabel { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #db7d4e; margin-bottom: 8px; }
  .party .pname { font-size: 15px; font-weight: 700; color: #3d2b1f; margin-bottom: 4px; }
  .party .pinfo { font-size: 12px; color: #7a5c44; line-height: 1.8; }
  .dates { display: flex; gap: 40px; margin-bottom: 32px; font-size: 13px; }
  .dates .dl { color: #c9a87c; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-bottom: 4px; }
  .dates .dv { font-weight: 700; color: #3d2b1f; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead th { padding: 10px 8px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #db7d4e; border-bottom: 2px dashed #c9a87c; font-weight: 700; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 14px 8px; font-size: 13px; color: #3d2b1f; border-bottom: 1px dashed #e8d5c0; }
  tbody td:last-child { text-align: right; font-weight: 700; }
  .totals { display: flex; justify-content: flex-end; margin-bottom: 40px; }
  .totals-inner { width: 240px; }
  .tr { display: flex; justify-content: space-between; font-size: 13px; color: #7a5c44; padding: 6px 0; border-bottom: 1px dashed #e8d5c0; }
  .tr.big { font-size: 18px; font-weight: 700; color: #3d2b1f; padding-top: 12px; border-top: 2px solid #db7d4e; border-bottom: none; margin-top: 6px; }
  .tr.big span:last-child { color: #db7d4e; }
  .note-box { background: #fef3e8; border: 1px dashed #c9a87c; border-radius: 2px; padding: 16px; font-size: 12px; color: #7a5c44; line-height: 1.7; font-style: italic; }
  .footer-row { display: flex; justify-content: space-between; margin-top: 28px; font-size: 11px; color: #c9a87c; }
</style>
</head>
<body>
<div class="invoice">
  <div class="stamp-header">
    <div>
      <div class="brand-stamp">Meadow & Co.</div>
      <div class="brand-year">Est. 2018 · Handmade Goods</div>
    </div>
    <div class="inv-stamp">
      <div class="stamp-box">
        <div class="s-label">Receipt No.</div>
        <div class="s-num">M&C-0094</div>
      </div>
    </div>
  </div>
  <div class="body">
    <div class="dates">
      <div><div class="dl">Date Issued</div><div class="dv">March 1, 2024</div></div>
      <div><div class="dl">Payment Due</div><div class="dv">March 15, 2024</div></div>
    </div>
    <hr class="rule">
    <div class="parties">
      <div class="party">
        <div class="plabel">From</div>
        <div class="pname">Meadow & Co. Studio</div>
        <div class="pinfo">18 Wildflower Lane<br>Asheville, NC 28801<br>hello@meadowandco.com</div>
      </div>
      <div class="party">
        <div class="plabel">Billed To</div>
        <div class="pname">Sunrise Boutique</div>
        <div class="pinfo">34 Main Street<br>Charleston, SC 29401<br>orders@sunriseboutique.com</div>
      </div>
    </div>
    <hr class="rule">
    <table>
      <thead><tr><th>Item</th><th>Qty</th><th>Price Ea.</th><th>Total</th></tr></thead>
      <tbody>
        <tr><td>Hand-Poured Soy Candles (Lavender)</td><td>24</td><td>$18.00</td><td>$432.00</td></tr>
        <tr><td>Pressed Flower Cards (Assorted)</td><td>50</td><td>$7.50</td><td>$375.00</td></tr>
        <tr><td>Linen Tote Bags (Embroidered)</td><td>15</td><td>$32.00</td><td>$480.00</td></tr>
        <tr><td>Ceramic Mug Set (Set of 2)</td><td>10</td><td>$48.00</td><td>$480.00</td></tr>
        <tr><td>Wildflower Honey (8oz jar)</td><td>30</td><td>$12.00</td><td>$360.00</td></tr>
      </tbody>
    </table>
    <div class="totals">
      <div class="totals-inner">
        <div class="tr"><span>Subtotal</span><span>$2,127.00</span></div>
        <div class="tr"><span>Shipping</span><span>$64.00</span></div>
        <div class="tr"><span>Tax (6%)</span><span>$127.62</span></div>
        <div class="tr big"><span>Total</span><span>$2,318.62</span></div>
      </div>
    </div>
    <div class="note-box">"Thank you so much for your order! Everything is packed with love and care. Please allow 5–7 business days for delivery. Returns accepted within 14 days of receipt."</div>
    <div class="footer-row">
      <span>Venmo @meadowandco · Check payable to Meadow & Co. Studio</span>
      <span>meadowandco.com</span>
    </div>
  </div>
</div>
</body>
</html>`,
  },
  {
    id: "consulting-pro",
    name: "Consulting Pro",
    description: "Structured layout for consultants and professional services",
    category: "Corporate",
    tags: ["consulting", "professional", "structured", "formal"],
    primaryColor: "#7c3aed",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; color: #1f2937; background: #fff; }
  .invoice { max-width: 800px; margin: 0 auto; }
  .top-strip { background: #7c3aed; height: 6px; }
  .header { padding: 36px 48px; display: flex; justify-content: space-between; align-items: flex-start; background: #faf9ff; border-bottom: 1px solid #ede9fe; }
  .company h1 { font-size: 24px; font-weight: 700; color: #7c3aed; }
  .company p { font-size: 12px; color: #6b7280; margin-top: 6px; line-height: 1.6; }
  .inv-right { text-align: right; }
  .inv-right h2 { font-size: 32px; font-weight: 800; color: #1f2937; letter-spacing: -1px; }
  .inv-right .inv-details { font-size: 13px; color: #6b7280; margin-top: 6px; }
  .info-bar { background: #7c3aed; color: white; padding: 14px 48px; display: flex; gap: 48px; }
  .ib-item .ib-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; }
  .ib-item .ib-value { font-size: 14px; font-weight: 700; margin-top: 2px; }
  .body { padding: 40px 48px; }
  .bill-section { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; background: #faf9ff; border: 1px solid #ede9fe; border-radius: 8px; padding: 24px; }
  .bill-block .bb-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #7c3aed; font-weight: 700; margin-bottom: 10px; }
  .bill-block .bb-name { font-size: 16px; font-weight: 700; color: #1f2937; margin-bottom: 6px; }
  .bill-block .bb-text { font-size: 13px; color: #6b7280; line-height: 1.7; }
  .scope-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #7c3aed; margin-bottom: 16px; border-left: 3px solid #7c3aed; padding-left: 10px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead { background: #1f2937; }
  thead th { padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: white; }
  thead th:last-child { text-align: right; }
  tbody tr:nth-child(odd) { background: #faf9ff; }
  tbody td { padding: 14px 16px; font-size: 14px; color: #374151; border-bottom: 1px solid #f3f4f6; }
  tbody td:last-child { text-align: right; font-weight: 700; color: #1f2937; }
  .total-wrap { display: flex; justify-content: flex-end; margin-bottom: 40px; }
  .total-table { width: 300px; }
  .total-table tr td { padding: 8px 0; font-size: 14px; color: #6b7280; }
  .total-table tr td:last-child { text-align: right; }
  .total-table tr.t-final td { font-size: 20px; font-weight: 800; color: #7c3aed; padding-top: 14px; border-top: 2px solid #7c3aed; }
  .bottom-strip { display: flex; justify-content: space-between; align-items: center; padding: 20px 48px; background: #faf9ff; border-top: 1px solid #ede9fe; }
  .bs-text { font-size: 12px; color: #9ca3af; }
  .bs-paid { background: #f5f3ff; border: 1px solid #ede9fe; color: #7c3aed; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; }
</style>
</head>
<body>
<div class="invoice">
  <div class="top-strip"></div>
  <div class="header">
    <div class="company">
      <h1>Apex Consulting Group</h1>
      <p>Strategy · Operations · Growth<br>250 Park Avenue, New York, NY 10177<br>invoices@apexcg.com · (212) 555-0400</p>
    </div>
    <div class="inv-right">
      <h2>INVOICE</h2>
      <div class="inv-details">Number: ACG-2024-0312<br>Page: 1 of 1</div>
    </div>
  </div>
  <div class="info-bar">
    <div class="ib-item"><div class="ib-label">Invoice Date</div><div class="ib-value">March 1, 2024</div></div>
    <div class="ib-item"><div class="ib-label">Due Date</div><div class="ib-value">March 31, 2024</div></div>
    <div class="ib-item"><div class="ib-label">Terms</div><div class="ib-value">Net 30</div></div>
    <div class="ib-item"><div class="ib-label">Engagement</div><div class="ib-value">Q1 2024 Retainer</div></div>
  </div>
  <div class="body">
    <div class="bill-section">
      <div class="bill-block">
        <div class="bb-label">Consulting Firm</div>
        <div class="bb-name">Apex Consulting Group LLC</div>
        <div class="bb-text">250 Park Avenue, Suite 1200<br>New York, NY 10177<br>EIN: 47-1234567<br>invoices@apexcg.com</div>
      </div>
      <div class="bill-block">
        <div class="bb-label">Client Organization</div>
        <div class="bb-name">NextWave Manufacturing Corp.</div>
        <div class="bb-text">7800 Industrial Park Rd<br>Detroit, MI 48201<br>PO# NWM-2024-Q1<br>ap@nextwavemfg.com</div>
      </div>
    </div>
    <div class="scope-label">Scope of Services Rendered</div>
    <table>
      <thead><tr><th>Service Description</th><th>Consultant</th><th>Hours</th><th>Rate</th><th>Total</th></tr></thead>
      <tbody>
        <tr><td>Strategic Planning Workshop (2-day offsite)</td><td>Sr. Partner</td><td>16</td><td>$450</td><td>$7,200</td></tr>
        <tr><td>Market Entry Analysis Report</td><td>Associate</td><td>40</td><td>$280</td><td>$11,200</td></tr>
        <tr><td>Operations Efficiency Audit</td><td>Manager</td><td>24</td><td>$350</td><td>$8,400</td></tr>
        <tr><td>Executive Coaching Sessions (×4)</td><td>Sr. Partner</td><td>8</td><td>$500</td><td>$4,000</td></tr>
        <tr><td>Implementation Roadmap</td><td>Manager</td><td>20</td><td>$350</td><td>$7,000</td></tr>
        <tr><td>Travel &amp; Expenses (Reimbursable)</td><td>—</td><td>—</td><td>—</td><td>$2,340</td></tr>
      </tbody>
    </table>
    <div class="total-wrap">
      <table class="total-table">
        <tr><td>Professional Fees</td><td>$37,800.00</td></tr>
        <tr><td>Reimbursable Expenses</td><td>$2,340.00</td></tr>
        <tr><td>Subtotal</td><td>$40,140.00</td></tr>
        <tr><td>Sales Tax (NY 8.875%)</td><td>$3,562.43</td></tr>
        <tr class="t-final"><td>AMOUNT DUE</td><td>$43,702.43</td></tr>
      </table>
    </div>
  </div>
  <div class="bottom-strip">
    <div class="bs-text">Wire: JPMorgan Chase · Routing 021000021 · Acct 0987654321 · Ref: ACG-2024-0312</div>
    <div class="bs-paid">Net 30</div>
  </div>
</div>
</body>
</html>`,
  },
  {
    id: "logo-clean-white",
    name: "Logo Clean White",
    description: "Bright white layout with a prominent company logo area and clean lines",
    category: "Minimal",
    tags: ["logo", "minimal", "clean", "white", "branding"],
    primaryColor: "#2563eb",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background: #fff; padding: 48px; }
  .invoice { max-width: 760px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 2px solid #e5e7eb; }
  .logo-wrap { display: flex; align-items: center; gap: 16px; }
  .logo-svg { width: 60px; height: 60px; flex-shrink: 0; }
  .company-name { font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.5px; }
  .company-sub { font-size: 12px; color: #6b7280; margin-top: 2px; }
  .invoice-badge { text-align: right; }
  .invoice-badge h2 { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #2563eb; }
  .invoice-badge .num { font-size: 28px; font-weight: 800; color: #111827; margin-top: 4px; }
  .invoice-badge .date { font-size: 13px; color: #6b7280; margin-top: 4px; }
  .address-row { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .addr .lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #2563eb; margin-bottom: 8px; }
  .addr .name { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px; }
  .addr .info { font-size: 13px; color: #6b7280; line-height: 1.7; }
  .meta-strip { display: flex; gap: 0; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin-bottom: 40px; }
  .meta-item { flex: 1; padding: 14px 18px; border-right: 1px solid #e5e7eb; }
  .meta-item:last-child { border-right: none; }
  .meta-item .ml { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #9ca3af; margin-bottom: 4px; }
  .meta-item .mv { font-size: 14px; font-weight: 700; color: #111827; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead th { padding: 11px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; background: #2563eb; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 14px; font-size: 14px; color: #374151; border-bottom: 1px solid #f3f4f6; }
  tbody td:last-child { text-align: right; font-weight: 600; }
  tbody tr:nth-child(even) { background: #f9fafb; }
  .totals { display: flex; justify-content: flex-end; margin-bottom: 40px; }
  .totals-box { width: 260px; }
  .trow { display: flex; justify-content: space-between; font-size: 14px; color: #6b7280; padding: 7px 0; border-bottom: 1px solid #f3f4f6; }
  .trow.final { border: none; font-size: 18px; font-weight: 800; color: #111827; padding-top: 14px; }
  .trow.final span:last-child { color: #2563eb; }
  .footer-note { text-align: center; font-size: 12px; color: #9ca3af; padding-top: 24px; border-top: 1px solid #f3f4f6; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="logo-wrap">
      <svg class="logo-svg" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="60" rx="14" fill="#2563eb"/>
        <rect x="12" y="18" width="36" height="5" rx="2.5" fill="white"/>
        <rect x="12" y="28" width="24" height="5" rx="2.5" fill="white" opacity="0.7"/>
        <rect x="12" y="38" width="30" height="5" rx="2.5" fill="white" opacity="0.5"/>
      </svg>
      <div>
        <div class="company-name">BluePeak Agency</div>
        <div class="company-sub">Creative &amp; Digital Services</div>
      </div>
    </div>
    <div class="invoice-badge">
      <div class="date" style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#2563eb;font-weight:700">Invoice</div>
      <div class="num">#BP-2024-055</div>
      <div class="date">Due: April 15, 2024</div>
    </div>
  </div>
  <div class="meta-strip">
    <div class="meta-item"><div class="ml">Issued</div><div class="mv">Mar 16, 2024</div></div>
    <div class="meta-item"><div class="ml">Due</div><div class="mv">Apr 15, 2024</div></div>
    <div class="meta-item"><div class="ml">Terms</div><div class="mv">Net 30</div></div>
    <div class="meta-item"><div class="ml">Currency</div><div class="mv">USD</div></div>
  </div>
  <div class="address-row">
    <div class="addr">
      <div class="lbl">From</div>
      <div class="name">BluePeak Agency LLC</div>
      <div class="info">88 Creative Quarter<br>Portland, OR 97209<br>billing@bluepeak.io</div>
    </div>
    <div class="addr">
      <div class="lbl">Bill To</div>
      <div class="name">Horizon Retail Group</div>
      <div class="info">404 Commerce Blvd<br>Seattle, WA 98101<br>ap@horizonretail.com</div>
    </div>
  </div>
  <table>
    <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>Brand Strategy &amp; Positioning</td><td>1</td><td>$4,500</td><td>$4,500.00</td></tr>
      <tr><td>Logo &amp; Visual Identity Design</td><td>1</td><td>$3,200</td><td>$3,200.00</td></tr>
      <tr><td>Website Redesign (5 pages)</td><td>1</td><td>$6,800</td><td>$6,800.00</td></tr>
      <tr><td>Social Media Kit (12 templates)</td><td>1</td><td>$1,400</td><td>$1,400.00</td></tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="totals-box">
      <div class="trow"><span>Subtotal</span><span>$15,900.00</span></div>
      <div class="trow"><span>Tax (9%)</span><span>$1,431.00</span></div>
      <div class="trow final"><span>Total Due</span><span>$17,331.00</span></div>
    </div>
  </div>
  <div class="footer-note">BluePeak Agency LLC · EIN 93-1234567 · Bank: Chase · Routing 021000021 · Acct 4567890123<br>Thank you for your business! Questions? billing@bluepeak.io</div>
</div>
</body>
</html>`,
  },
  {
    id: "logo-dark-corporate",
    name: "Logo Dark Corporate",
    description: "Dark header with full-color SVG logo, ideal for enterprise brands",
    category: "Corporate",
    tags: ["logo", "corporate", "dark", "enterprise", "branding"],
    primaryColor: "#0f172a",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Trebuchet MS', Arial, sans-serif; color: #1e293b; background: #f8fafc; }
  .invoice { max-width: 800px; margin: 0 auto; background: #fff; box-shadow: 0 4px 32px rgba(0,0,0,0.10); }
  .header { background: #0f172a; padding: 36px 48px; display: flex; justify-content: space-between; align-items: center; }
  .logo-block { display: flex; align-items: center; gap: 18px; }
  .logo-svg { width: 56px; height: 56px; flex-shrink: 0; }
  .company-text .cname { font-size: 22px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
  .company-text .ctag { font-size: 11px; color: #64748b; letter-spacing: 1px; margin-top: 3px; text-transform: uppercase; }
  .inv-right { text-align: right; }
  .inv-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2.5px; color: #475569; margin-bottom: 6px; }
  .inv-number { font-size: 24px; font-weight: 900; color: #38bdf8; }
  .inv-date { font-size: 12px; color: #64748b; margin-top: 4px; }
  .accent-line { height: 4px; background: linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #fb7185 100%); }
  .body { padding: 40px 48px; }
  .info-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 40px; }
  .ig-item { padding: 14px 16px; border-right: 1px solid #e2e8f0; }
  .ig-item:last-child { border-right: none; }
  .ig-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 4px; }
  .ig-value { font-size: 13px; font-weight: 700; color: #1e293b; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .party .pl { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #38bdf8; font-weight: 700; margin-bottom: 10px; }
  .party .pn { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
  .party .pi { font-size: 13px; color: #64748b; line-height: 1.7; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead tr { background: #0f172a; }
  thead th { padding: 13px 16px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 14px 16px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; }
  tbody td:last-child { text-align: right; font-weight: 700; color: #0f172a; }
  tbody tr:hover td { background: #f8fafc; }
  .totals-row-wrap { display: flex; justify-content: flex-end; margin-bottom: 40px; }
  .totals-inner { width: 280px; }
  .tr { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9; }
  .tr.grand { font-size: 20px; font-weight: 900; color: #0f172a; border: none; padding-top: 16px; }
  .tr.grand span:last-child { color: #38bdf8; }
  .payment-note { background: #f0f9ff; border-left: 4px solid #38bdf8; padding: 16px 20px; border-radius: 0 8px 8px 0; font-size: 13px; color: #475569; line-height: 1.6; }
  .footer { display: flex; justify-content: space-between; padding: 16px 48px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="logo-block">
      <svg class="logo-svg" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="12" fill="#1e293b"/>
        <polygon points="28,10 48,44 8,44" fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="28" cy="30" r="6" fill="#38bdf8"/>
        <line x1="28" y1="10" x2="28" y2="24" stroke="#38bdf8" stroke-width="2.5"/>
      </svg>
      <div class="company-text">
        <div class="cname">Vantage Corp</div>
        <div class="ctag">Global Enterprise Solutions</div>
      </div>
    </div>
    <div class="inv-right">
      <div class="inv-label">Tax Invoice</div>
      <div class="inv-number">#VTG-2024-0301</div>
      <div class="inv-date">Issued March 1, 2024</div>
    </div>
  </div>
  <div class="accent-line"></div>
  <div class="body">
    <div class="info-grid">
      <div class="ig-item"><div class="ig-label">Issue Date</div><div class="ig-value">Mar 1, 2024</div></div>
      <div class="ig-item"><div class="ig-label">Due Date</div><div class="ig-value">Mar 31, 2024</div></div>
      <div class="ig-item"><div class="ig-label">Payment Terms</div><div class="ig-value">Net 30</div></div>
      <div class="ig-item"><div class="ig-label">Currency</div><div class="ig-value">USD</div></div>
    </div>
    <div class="parties">
      <div class="party">
        <div class="pl">Issued By</div>
        <div class="pn">Vantage Corp Inc.</div>
        <div class="pi">1200 Enterprise Pkwy<br>Dallas, TX 75201<br>EIN: 82-4567890<br>billing@vantagecorp.com</div>
      </div>
      <div class="party">
        <div class="pl">Billed To</div>
        <div class="pn">Apex Industries Ltd.</div>
        <div class="pi">8800 Industry Blvd<br>Houston, TX 77001<br>PO#: AX-2024-881<br>accounts@apexind.com</div>
      </div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
      <tbody>
        <tr><td>01</td><td>Enterprise Software License (Annual)</td><td>3</td><td>$8,000</td><td>$24,000.00</td></tr>
        <tr><td>02</td><td>Cloud Infrastructure Setup</td><td>1</td><td>$5,500</td><td>$5,500.00</td></tr>
        <tr><td>03</td><td>Technical Consulting (80 hrs)</td><td>80</td><td>$220</td><td>$17,600.00</td></tr>
        <tr><td>04</td><td>Staff Training Programme (3 days)</td><td>3</td><td>$2,000</td><td>$6,000.00</td></tr>
        <tr><td>05</td><td>Annual Maintenance &amp; Support</td><td>1</td><td>$4,800</td><td>$4,800.00</td></tr>
      </tbody>
    </table>
    <div class="totals-row-wrap">
      <div class="totals-inner">
        <div class="tr"><span>Subtotal</span><span>$57,900.00</span></div>
        <div class="tr"><span>Discount (5%)</span><span>−$2,895.00</span></div>
        <div class="tr"><span>Tax (8%)</span><span>$4,400.40</span></div>
        <div class="tr grand"><span>Total Due</span><span>$59,405.40</span></div>
      </div>
    </div>
    <div class="payment-note">Wire Transfer: Wells Fargo · Routing 121000248 · Account 9876543210 · SWIFT: WFBIUS6S<br>Please reference invoice #VTG-2024-0301 on all payments.</div>
  </div>
  <div class="footer"><span>Vantage Corp Inc. · Confidential Document</span><span>Page 1 of 1</span></div>
</div>
</body>
</html>`,
  },
  {
    id: "logo-luxury-gold",
    name: "Logo Luxury Gold",
    description: "Opulent design with SVG monogram logo, gold foil details and premium typography",
    category: "Luxury",
    tags: ["logo", "luxury", "gold", "monogram", "premium"],
    primaryColor: "#c9a227",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', 'Times New Roman', serif; color: #1c1208; background: #f9f6ef; }
  .invoice { max-width: 780px; margin: 0 auto; background: #fff; }
  .header { background: #1c1208; padding: 48px 56px; display: flex; justify-content: space-between; align-items: center; }
  .logo-mark { display: flex; align-items: center; gap: 20px; }
  .monogram-svg { width: 70px; height: 70px; flex-shrink: 0; }
  .brand-text .bname { font-size: 26px; letter-spacing: 6px; text-transform: uppercase; color: #c9a227; font-weight: normal; }
  .brand-text .btag { font-size: 9px; letter-spacing: 4px; color: #6b5a35; text-transform: uppercase; margin-top: 6px; }
  .inv-ref { text-align: right; }
  .inv-ref .ref-label { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: #6b5a35; margin-bottom: 8px; }
  .inv-ref .ref-num { font-size: 16px; letter-spacing: 3px; color: #c9a227; }
  .gold-rule { height: 1px; background: linear-gradient(90deg, transparent, #c9a227, #e8c96b, #c9a227, transparent); }
  .body { padding: 52px 56px; }
  .date-row { display: flex; gap: 48px; margin-bottom: 48px; }
  .date-item .di-label { font-size: 8px; letter-spacing: 3px; text-transform: uppercase; color: #c9a227; margin-bottom: 6px; }
  .date-item .di-value { font-size: 14px; color: #1c1208; font-weight: bold; letter-spacing: 0.5px; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 52px; }
  .party .plabel { font-size: 8px; letter-spacing: 3px; text-transform: uppercase; color: #c9a227; margin-bottom: 12px; }
  .party .pname { font-size: 18px; color: #1c1208; margin-bottom: 8px; font-style: italic; }
  .party .pinfo { font-size: 12px; color: #7a6843; line-height: 1.8; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
  thead th { padding: 14px 0; font-size: 8px; text-transform: uppercase; letter-spacing: 3px; color: #c9a227; text-align: left; border-bottom: 1px solid #c9a227; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 18px 0; font-size: 14px; color: #1c1208; border-bottom: 1px solid #f0ebe0; }
  tbody td:last-child { text-align: right; color: #1c1208; font-weight: bold; }
  .total-area { display: flex; justify-content: flex-end; margin-bottom: 48px; }
  .total-inner { width: 280px; }
  .tr { display: flex; justify-content: space-between; font-size: 13px; color: #7a6843; padding: 7px 0; border-bottom: 1px solid #f0ebe0; }
  .tr.final { font-size: 20px; color: #1c1208; font-weight: bold; border: none; padding-top: 16px; margin-top: 4px; border-top: 1px solid #c9a227; }
  .tr.final span:last-child { color: #c9a227; }
  .closing { text-align: center; font-size: 12px; color: #7a6843; font-style: italic; padding: 32px 0; border-top: 1px solid #f0ebe0; letter-spacing: 0.5px; line-height: 1.8; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="logo-mark">
      <svg class="monogram-svg" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="70" height="70" rx="4" fill="none" stroke="#c9a227" stroke-width="1.5"/>
        <rect x="4" y="4" width="62" height="62" rx="2" fill="none" stroke="#c9a227" stroke-width="0.5" opacity="0.4"/>
        <text x="35" y="46" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#c9a227" font-style="italic">M</text>
        <line x1="16" y1="58" x2="54" y2="58" stroke="#c9a227" stroke-width="0.8" opacity="0.5"/>
      </svg>
      <div class="brand-text">
        <div class="bname">Maison</div>
        <div class="btag">Atelier de Luxe · Paris</div>
      </div>
    </div>
    <div class="inv-ref">
      <div class="ref-label">Facture / Invoice</div>
      <div class="ref-num">MSN — 2024 — 041</div>
    </div>
  </div>
  <div class="gold-rule"></div>
  <div class="body">
    <div class="date-row">
      <div class="date-item"><div class="di-label">Date d'émission</div><div class="di-value">1 Mars 2024</div></div>
      <div class="date-item"><div class="di-label">Date d'échéance</div><div class="di-value">1 Avril 2024</div></div>
    </div>
    <div class="parties">
      <div class="party">
        <div class="plabel">De la part de</div>
        <div class="pname">Maison Atelier de Luxe</div>
        <div class="pinfo">14 Rue du Faubourg Saint-Honoré<br>75008 Paris, France<br>TVA: FR 12 345678901<br>facturation@maison-atelier.fr</div>
      </div>
      <div class="party">
        <div class="plabel">À l'attention de</div>
        <div class="pname">The Meridian Collection</div>
        <div class="pinfo">32 Old Bond Street<br>London, W1S 4PD<br>United Kingdom<br>accounts@meridiancollection.co.uk</div>
      </div>
    </div>
    <table>
      <thead><tr><th>Service / Prestation</th><th>Qté</th><th>Prix unitaire</th><th>Montant HT</th></tr></thead>
      <tbody>
        <tr><td>Couture sur Mesure — Collection Printemps</td><td>3</td><td>€4,800</td><td>€14,400.00</td></tr>
        <tr><td>Accessoires Signature (Pochette, Ceinture)</td><td>5</td><td>€1,200</td><td>€6,000.00</td></tr>
        <tr><td>Consultation Stylisme Privée (4 séances)</td><td>4</td><td>€650</td><td>€2,600.00</td></tr>
        <tr><td>Emballage Prestige &amp; Expédition Assurée</td><td>1</td><td>€480</td><td>€480.00</td></tr>
      </tbody>
    </table>
    <div class="total-area">
      <div class="total-inner">
        <div class="tr"><span>Sous-total HT</span><span>€23,480.00</span></div>
        <div class="tr"><span>TVA (20%)</span><span>€4,696.00</span></div>
        <div class="tr final"><span>Total TTC</span><span>€28,176.00</span></div>
      </div>
    </div>
    <div class="closing">« Nous vous remercions de votre confiance et de votre fidélité. »<br>Virement IBAN: FR76 3000 4000 0101 2345 6789 012 · BIC: BNPAFRPPXXX</div>
  </div>
</div>
</body>
</html>`,
  },
  {
    id: "logo-modern-gradient",
    name: "Logo Modern Gradient",
    description: "Vivid gradient header with centered SVG logo mark for bold modern brands",
    category: "Modern",
    tags: ["logo", "modern", "gradient", "colorful", "bold"],
    primaryColor: "#7c3aed",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e1b4b; background: #f5f3ff; padding: 40px; }
  .invoice { max-width: 760px; margin: 0 auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 48px rgba(124,58,237,0.15); }
  .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%); padding: 44px 48px; text-align: center; position: relative; }
  .logo-circle { width: 72px; height: 72px; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
  .logo-circle svg { width: 40px; height: 40px; }
  .brand-name { font-size: 24px; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
  .brand-tag { font-size: 11px; color: rgba(255,255,255,0.7); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
  .inv-chip { display: inline-block; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); border-radius: 20px; padding: 6px 20px; font-size: 13px; font-weight: 700; color: white; margin-top: 18px; letter-spacing: 1px; }
  .body { padding: 40px 48px; }
  .meta-row { display: flex; gap: 0; background: #f5f3ff; border-radius: 12px; overflow: hidden; margin-bottom: 40px; }
  .meta-cell { flex: 1; padding: 16px 20px; border-right: 1px solid #ede9fe; }
  .meta-cell:last-child { border-right: none; }
  .mc-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #a78bfa; margin-bottom: 4px; }
  .mc-value { font-size: 14px; font-weight: 700; color: #1e1b4b; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .party .pl { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #7c3aed; font-weight: 700; margin-bottom: 8px; }
  .party .pn { font-size: 15px; font-weight: 800; color: #1e1b4b; margin-bottom: 4px; }
  .party .pi { font-size: 13px; color: #6b7280; line-height: 1.7; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; border-radius: 12px; overflow: hidden; }
  thead tr { background: linear-gradient(135deg, #7c3aed, #a855f7); }
  thead th { padding: 13px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: white; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 14px 16px; font-size: 14px; color: #374151; border-bottom: 1px solid #f5f3ff; }
  tbody td:last-child { text-align: right; font-weight: 700; color: #1e1b4b; }
  tbody tr:nth-child(even) { background: #faf9ff; }
  .totals-wrap { display: flex; justify-content: flex-end; margin-bottom: 40px; }
  .totals-box { width: 260px; background: #f5f3ff; border-radius: 12px; padding: 20px; }
  .trow { display: flex; justify-content: space-between; font-size: 14px; color: #6b7280; padding: 6px 0; }
  .trow.grand { margin-top: 12px; padding-top: 12px; border-top: 1px solid #ddd6fe; font-size: 20px; font-weight: 900; color: #1e1b4b; }
  .trow.grand span:last-child { background: linear-gradient(135deg, #7c3aed, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .footer { text-align: center; font-size: 12px; color: #9ca3af; padding: 24px 48px; border-top: 1px solid #f5f3ff; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="logo-circle">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4L36 32H4L20 4Z" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="20" cy="24" r="5" fill="white"/>
      </svg>
    </div>
    <div class="brand-name">Prisma Studio</div>
    <div class="brand-tag">Creative Technology Agency</div>
    <div class="inv-chip">Invoice #PRM-2024-088</div>
  </div>
  <div class="body">
    <div class="meta-row">
      <div class="meta-cell"><div class="mc-label">Issued</div><div class="mc-value">Mar 1, 2024</div></div>
      <div class="meta-cell"><div class="mc-label">Due</div><div class="mc-value">Apr 1, 2024</div></div>
      <div class="meta-cell"><div class="mc-label">Terms</div><div class="mc-value">Net 30</div></div>
      <div class="meta-cell"><div class="mc-label">Status</div><div class="mc-value" style="color:#7c3aed">● Pending</div></div>
    </div>
    <div class="parties">
      <div class="party">
        <div class="pl">From</div>
        <div class="pn">Prisma Studio LLC</div>
        <div class="pi">55 Pixel Lane, Studio 4<br>Los Angeles, CA 90028<br>hello@prismastudio.co</div>
      </div>
      <div class="party">
        <div class="pl">Bill To</div>
        <div class="pn">FutureBrand Inc.</div>
        <div class="pi">202 Brand Avenue, Floor 9<br>New York, NY 10001<br>finance@futurebrand.com</div>
      </div>
    </div>
    <table>
      <thead><tr><th>Service</th><th>Hours</th><th>Rate</th><th>Total</th></tr></thead>
      <tbody>
        <tr><td>UX Research &amp; User Testing</td><td>20</td><td>$140</td><td>$2,800.00</td></tr>
        <tr><td>Product Design (Mobile App)</td><td>48</td><td>$135</td><td>$6,480.00</td></tr>
        <tr><td>Motion Design &amp; Micro-animations</td><td>16</td><td>$150</td><td>$2,400.00</td></tr>
        <tr><td>Design System Documentation</td><td>12</td><td>$120</td><td>$1,440.00</td></tr>
        <tr><td>Handoff &amp; Developer Support</td><td>8</td><td>$125</td><td>$1,000.00</td></tr>
      </tbody>
    </table>
    <div class="totals-wrap">
      <div class="totals-box">
        <div class="trow"><span>Subtotal</span><span>$14,120.00</span></div>
        <div class="trow"><span>Tax (9.5%)</span><span>$1,341.40</span></div>
        <div class="trow grand"><span>Total Due</span><span>$15,461.40</span></div>
      </div>
    </div>
    <div class="footer">Prisma Studio LLC · EIN 85-1234567 · Wire: Bank of America · Routing 026009593 · Acct 1122334455<br>Thank you for collaborating with us ✦</div>
  </div>
</div>
</body>
</html>`,
  },
  {
    id: "logo-creative-sidebar",
    name: "Logo Creative Sidebar",
    description: "Artistic sidebar layout with custom SVG icon logo for creative studios",
    category: "Creative",
    tags: ["logo", "creative", "sidebar", "artistic", "studio"],
    primaryColor: "#f97316",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #fff; color: #18181b; }
  .invoice { max-width: 820px; margin: 0 auto; display: grid; grid-template-columns: 240px 1fr; min-height: 900px; }
  .sidebar { background: #18181b; color: white; padding: 44px 32px; display: flex; flex-direction: column; }
  .logo-area { margin-bottom: 40px; text-align: center; }
  .logo-svg { width: 64px; height: 64px; margin: 0 auto 14px; display: block; }
  .brand-name { font-size: 18px; font-weight: 900; color: #f97316; letter-spacing: -0.5px; }
  .brand-tag { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: #52525b; margin-top: 4px; }
  .divider { height: 1px; background: #27272a; margin: 24px 0; }
  .sb-section { margin-bottom: 32px; }
  .sb-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #f97316; margin-bottom: 12px; }
  .sb-text { font-size: 12px; color: #a1a1aa; line-height: 1.8; }
  .amount-box { background: #27272a; border-radius: 12px; padding: 20px; margin-top: auto; }
  .ab-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #71717a; margin-bottom: 8px; }
  .ab-value { font-size: 30px; font-weight: 900; color: #f97316; line-height: 1; }
  .main { padding: 44px 40px; }
  .main-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .inv-word { font-size: 44px; font-weight: 900; color: #18181b; letter-spacing: -2px; line-height: 1; }
  .inv-word span { color: #f97316; }
  .inv-meta { text-align: right; font-size: 12px; color: #a1a1aa; line-height: 1.7; }
  .orange-bar { width: 48px; height: 4px; background: #f97316; border-radius: 2px; margin: 16px 0 28px; }
  .client-info { margin-bottom: 32px; }
  .ci-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #f97316; margin-bottom: 8px; }
  .ci-name { font-size: 17px; font-weight: 800; color: #18181b; margin-bottom: 2px; }
  .ci-sub { font-size: 13px; color: #71717a; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
  thead th { padding: 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #a1a1aa; text-align: left; border-bottom: 2px solid #f4f4f5; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 14px 0; font-size: 14px; color: #27272a; border-bottom: 1px solid #f4f4f5; }
  tbody td:first-child { font-weight: 600; color: #18181b; }
  tbody td:last-child { text-align: right; font-weight: 700; }
  .summary { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; margin-bottom: 32px; }
  .s-row { display: flex; justify-content: space-between; width: 200px; font-size: 13px; color: #71717a; }
  .s-row.final { font-size: 16px; font-weight: 900; color: #18181b; width: 200px; padding-top: 10px; border-top: 2px solid #f97316; }
  .s-row.final span:last-child { color: #f97316; }
  .terms-note { font-size: 11px; color: #a1a1aa; line-height: 1.7; }
</style>
</head>
<body>
<div class="invoice">
  <div class="sidebar">
    <div class="logo-area">
      <svg class="logo-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="none" stroke="#f97316" stroke-width="2"/>
        <circle cx="32" cy="32" r="12" fill="#f97316"/>
        <line x1="32" y1="4" x2="32" y2="20" stroke="#f97316" stroke-width="2.5"/>
        <line x1="32" y1="44" x2="32" y2="60" stroke="#f97316" stroke-width="2.5"/>
        <line x1="4" y1="32" x2="20" y2="32" stroke="#f97316" stroke-width="2.5"/>
        <line x1="44" y1="32" x2="60" y2="32" stroke="#f97316" stroke-width="2.5"/>
        <line x1="12" y1="12" x2="22" y2="22" stroke="#f97316" stroke-width="2" opacity="0.5"/>
        <line x1="42" y1="42" x2="52" y2="52" stroke="#f97316" stroke-width="2" opacity="0.5"/>
      </svg>
      <div class="brand-name">Solaris Works</div>
      <div class="brand-tag">Motion &amp; Branding</div>
    </div>
    <div class="divider"></div>
    <div class="sb-section">
      <div class="sb-label">Studio Address</div>
      <div class="sb-text">77 Loft District<br>Chicago, IL 60607<br><br>hello@solarisworks.co<br>+1 (312) 555-0181</div>
    </div>
    <div class="sb-section">
      <div class="sb-label">Invoice Date</div>
      <div class="sb-text">March 1, 2024</div>
    </div>
    <div class="sb-section">
      <div class="sb-label">Payment Due</div>
      <div class="sb-text">March 21, 2024</div>
    </div>
    <div class="sb-section">
      <div class="sb-label">Invoice No.</div>
      <div class="sb-text">#SOL-2024-019</div>
    </div>
    <div class="amount-box">
      <div class="ab-label">Total Amount Due</div>
      <div class="ab-value">$11,820</div>
    </div>
  </div>
  <div class="main">
    <div class="main-top">
      <div>
        <div class="inv-word">INV<span>.</span></div>
        <div class="inv-word">#019</div>
      </div>
      <div class="inv-meta">
        Solaris Works LLC<br>
        Tax ID: 93-8765432<br>
        Net 20 Days
      </div>
    </div>
    <div class="orange-bar"></div>
    <div class="client-info">
      <div class="ci-label">Billed To</div>
      <div class="ci-name">Momentum Creative Co.</div>
      <div class="ci-sub">28 Studio Row, Los Angeles, CA 90038 · pay@momentumcreative.com</div>
    </div>
    <table>
      <thead><tr><th>Project / Deliverable</th><th>Days</th><th>Day Rate</th><th>Total</th></tr></thead>
      <tbody>
        <tr><td>Animated Brand Identity (Logo)</td><td>4</td><td>$1,100</td><td>$4,400</td></tr>
        <tr><td>Title Sequence (30 sec)</td><td>3</td><td>$1,200</td><td>$3,600</td></tr>
        <tr><td>Social Motion Pack (6 clips)</td><td>2</td><td>$950</td><td>$1,900</td></tr>
        <tr><td>Sound Design Supervision</td><td>1</td><td>$800</td><td>$800</td></tr>
        <tr><td>Client Revisions (2 rounds included)</td><td>1</td><td>$600</td><td>$600</td></tr>
      </tbody>
    </table>
    <div class="summary">
      <div class="s-row"><span>Subtotal</span><span>$11,300</span></div>
      <div class="s-row"><span>Tax (4.6%)</span><span>$520</span></div>
      <div class="s-row final"><span>Total</span><span>$11,820</span></div>
    </div>
    <div class="terms-note">
      Payment by ACH or wire transfer only.<br>
      Chase Bank · Routing 071000013 · Account 5566778899<br>
      Late payments subject to 2% monthly interest after due date.
    </div>
  </div>
</div>
</body>
</html>`,
  },
];
