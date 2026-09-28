# 🚀 Bruh Freelancing - Portfolio Website

> A dark-themed, responsive portfolio website built with smooth CSS 3D animations, parallax effects, dynamic circular branding, custom cursor trailing, and a secure static architecture.

---

## 👥 Foundational Partners

- **Ayyappa** — Co-Founder & Lead Full-Stack Architect / SaaS Specialist
- **Chandhana** — Co-Founder & Lead UI/UX Designer & Data Analytics Specialist

---

## 🎨 Design & Aesthetic Highlights

- **Obsidian Dark Cyberpunk Aesthetic**: High-contrast dark backgrounds (`#07090e`, `#0c1017`) complemented with electric cyan (`#00f2fe`), neon violet (`#7928ca`), and radiant emerald (`#00f5a0`) accents.
- **Dynamic Circular Logo**: Extracted from the source badge with all outer black square artifacts removed, enhanced with floating 3D tilt, ambient neon glow, and rotating orbital rings.
- **Custom Cursor Trailing (Desktop)**: Smooth Lerp follower ring, primary cyan pinpoint, interactive hover magnets on all clickable elements, and trailing glowing spark particles. Gracefully disabled on touchscreen devices (`pointer: coarse`).
- **3D Parallax & Tilt Engine**:
  - Desktop: Real-time mouse movement perspective tilt (`preserve-3d`, `translateZ`) across cards and hero visual.
  - Mobile / Tablets: Native **DeviceOrientation (gyroscope)** integration allowing users to experience subtle 3D tilt as they angle their physical device!
  - Parallax ambient background orbs linked to scroll depth.
- **Interactive Particle Constellation**: Canvas-rendered ambient particles responding dynamically to cursor position.

---

## 🛠️ Services Provided

1. **Web Design & Web Development**: Bespoke Figma UI/UX, Next.js / React frontends, 100/100 Core Web Vitals, and SEO.
2. **Landing Pages & SaaS Projects**: High-converting CRO funnels, multi-tenant cloud architectures, payment gateways (Razorpay, Stripe, UPI), and real-time WebSockets.
3. **Data Analysis & Dashboards**: Python (Pandas/NumPy) ETL pipelines, interactive PowerBI / Web BI dashboards, customer retention, and inventory predictive models.

---

## 💼 Local Client Highlights & Experience

- **Sri Balaji Supermart & Wholesale (Vijayawada)**: Wholesale grocery e-commerce app with WhatsApp billing and live inventory (+240% order volume).
- **Dr. Kavitha's Clinic & Aesthetics (Guntur)**: 3D interactive clinic landing page with automated slot booking (+185% bookings).
- **Andhra Spice Cloud Kitchen (Vizag)**: Direct-to-consumer digital ordering & kitchen display SaaS (3.2x faster dispatch, eliminated aggregator commissions).
- **Apex Regional Logistics (Rajahmundry)**: Fleet telemetry and predictive fuel analytics dashboard (28% fuel cost reduction).
- **Veda Greens Organic Farm (Kakinada)**: DTC harvest subscription story-driven landing page (+310% recurring growth).
- **FinEdge Local Micro-Finance (Tirupati)**: Transaction-based credit risk assessment engine (45% drop in loan defaults).

---

## 🔒 Security & Technical Standards

- **Sanitized Form Inputs**:
  - Client-side XSS entity encoding and tag stripping.
  - SQLi / command injection character filtering.
  - Strict RFC 5322 email regex verification.
  - Anti-bot invisible honeypot shield (`hp_shield_check`).
  - Replay protection with client timestamp nonces.
  - Submission rate limiting (prevents spam flooding).
- **HTTPS & CORS Configurations**:
  - Included `_headers` (Netlify / Cloudflare), `vercel.json` (Vercel), and `.htaccess` (Apache).
  - Configured `Content-Security-Policy` (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security` (HSTS).

---

## 💻 Local Preview & Testing

You can preview the site locally using Python's built-in HTTP server:

```powershell
# In the freelance folder:
python -m http.server 8080
```
Then open `http://localhost:8080` in your web browser.
