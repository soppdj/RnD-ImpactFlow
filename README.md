# ImpactFlow — Philanthropy R&D Hub (PWA)

A modern, responsive, Progressive Web App (PWA) tailored specifically for a solo **Research & Development (R&D) Manager** at a Philanthropy.

Built with a **"Clean & Minimalist"** startup aesthetic featuring generous whitespace, light slate background (`bg-slate-50`), **Trustworthy Blue** (`#2563eb`), and **Growth Green** (`#10b981`).

---

## 🚀 Tech Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS
- **Icons:** Lucide React (`lucide-react`)
- **Charts:** Recharts (`recharts`)
- **Backend & Realtime:** Supabase (`@supabase/supabase-js`)
- **PWA Capabilities:** `vite-plugin-pwa` with offline caching & mobile standalone view
- **Animations:** Canvas-Confetti

---

## 🌟 Key Features

### 1. Supabase Integration (Real-time & Multi-Device Sync)
- **Database Schema**: Fully structured for `tasks`, `kpi_metrics`, and `user_profile`.
- **Row-Level Security (RLS)** & Realtime publication enabled.
- **Cross-device synchronization**: Checking off a task on a mobile device instantly updates the desktop view in real time.
- **Instant Demo Sandbox**: If Supabase keys are not configured yet, the app gracefully operates in Local Sandbox mode using `localStorage` and `BroadcastChannel` for multi-window synchronization.

### 2. Dashboard (LogFrame KPI & Progress Automation)
- **Header Banner**: Personalized greeting ("Selamat datang kembali, [Name]") with **"Target Kuartal Ini"** subtitle dynamically fetched from the `user_profile` table.
- **Overall KRA Chart**: Recharts Donut Chart displaying aggregated performance percentage (Outcome 45%, Output 35%, Activity 20%).
- **Hierarchical Progress Bars**: LogFrame breakdown (Outcome, Output, and Activity) with dynamic calculation based on completed tasks in the `tasks` table.

### 3. Agenda (Deadline-Driven Checklist & WhatsApp Reminders)
- **Smart Sorting**: Tasks are automatically sorted by the closest deadline.
- **Visual Cues**:
  - 🔴 **Red**: Today / Overdue (Urgent)
  - 🟡 **Yellow**: Tomorrow
  - 🟢 **Green**: Upcoming / Future
  - ⚪ **Muted / Green Check**: Completed
- **Automated KPI Sync**: Completing a task immediately recalculates the LogFrame progress bars and triggers celebratory confetti.
- **WhatsApp Integration**:
  - **Option A (Frontend Deep-link)**: One-click `wa.me` URL with pre-filled formal NGO reminder.
  - **Option B (Backend / Webhook)**: Structured to trigger a Supabase Edge Function to dispatch WhatsApp messages via Twilio, Meta Cloud API, or Wablas.

### 4. Export Report (Print-Ready PDF)
- Executive Briefing layout for Foundation Trustees, Board of Directors, and Donor Partners.
- Contains:
  - "Bulan Ini" executive narrative summary
  - Overall KRA score and LogFrame achievement table
  - Detailed matrix of completed tasks and deliverables
  - Next month's priority action items
  - Formal dual-signature approval block
- **"Export to PDF / Print"**: High-resolution vector PDF generator via `@media print` CSS styling.

### 5. Profile & Settings
- Fully mapped to the `user_profile` table in Supabase:
  - Profile Photo (avatar preset or custom URL)
  - Nama Lengkap & Gelar
  - Nama Yayasan / Lembaga Filantropi
  - Target Kuartal Ini
  - Kapasitas Jam Kerja Harian (hours/day)
  - Nomor WhatsApp Aktif (for task reminder routing)

---

## 🛠️ Getting Started

### 1. Installation
```bash
# Clone or navigate to the directory
cd ngo-rnd-pwa

# Install dependencies
npm install
```

### 2. Configure Supabase (Optional for full cloud sync)
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Go to **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`supabase_schema.sql`](./supabase_schema.sql).
4. Rename `.env.example` to `.env` or edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key
VITE_WA_WEBHOOK_URL=https://your-project-id.supabase.co/functions/v1/send-whatsapp-reminder
```

*(Note: If you leave `.env` empty, the app runs in Local Demo Sandbox mode without any errors!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production / PWA
```bash
npm run build
npm run preview
```

---

## 📱 PWA Installation
When running on HTTPS or `localhost`:
- **Android / Chrome**: Tap the "Add to Home screen" or "Install App" prompt.
- **iOS / Safari**: Tap "Share" -> "Add to Home Screen".
