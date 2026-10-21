-- ==========================================================
-- SUPABASE SCHEMA & SEED DATA: R&D ImpactFlow
-- Focus: R&D Penghimpunan & Retensi Donatur (LogFrame & Monthly KPI)
-- Fitur: Target Bulanan, Jurnal Mingguan Harian, & Histori Selesai Bulanan
-- ==========================================================

-- 1. Aktifkan Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL: user_profile (Profil Manajer R&D & Target Bulanan)
CREATE TABLE IF NOT EXISTS public.user_profile (
    id TEXT PRIMARY KEY DEFAULT 'default_user',
    full_name TEXT NOT NULL DEFAULT 'Farhan Maulana, S.Sos., M.M.',
    foundation_name TEXT NOT NULL DEFAULT 'Yayasan Khoirur Rooziqiin',
    monthly_target TEXT NOT NULL DEFAULT 'Oktober 2026: Program Integrasi Donor Retention & Pelaporan Transparan (Target Churn Rate Turun dari 30% ke 10% & Uji Coba Auto-Debet Sedekah Subuh)',
    quarterly_target TEXT DEFAULT 'Oktober 2026: Program Integrasi Donor Retention & Pelaporan Transparan',
    daily_working_hours NUMERIC NOT NULL DEFAULT 8,
    whatsapp_number TEXT NOT NULL DEFAULT '6281234567890',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL: kpi_metrics (Hierarki LogFrame: Goal, Outcome, Output, Activity)
CREATE TABLE IF NOT EXISTS public.kpi_metrics (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('goal', 'outcome', 'output', 'activity')),
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_value INTEGER NOT NULL DEFAULT 100,
    weight NUMERIC NOT NULL DEFAULT 1.0,
    evidence TEXT,
    assumptions_risks TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL: tasks (Agenda Tugas R&D, Deadline, Status Selesai)
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    kpi_id TEXT REFERENCES public.kpi_metrics(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('goal', 'outcome', 'output', 'activity')),
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    estimated_hours NUMERIC DEFAULT 2.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABEL: journal_entries (Jurnal Kerja Mingguan untuk Aktivitas Harian)
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    day_name TEXT NOT NULL,
    week_number INTEGER NOT NULL,
    month_key TEXT NOT NULL, -- Format 'YYYY-MM', contoh: '2026-10'
    hours_worked NUMERIC DEFAULT 7.0,
    summary TEXT NOT NULL,
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABEL: donation_progress (Monitoring Capaian Progres Donasi Lintas Program)
CREATE TABLE IF NOT EXISTS public.donation_progress (
    id TEXT PRIMARY KEY,
    program TEXT NOT NULL,
    target NUMERIC NOT NULL DEFAULT 0,
    actual NUMERIC NOT NULL DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- KEAMANAN: ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-write for user_profile" ON public.user_profile;
DROP POLICY IF EXISTS "Allow public read-write for kpi_metrics" ON public.kpi_metrics;
DROP POLICY IF EXISTS "Allow public read-write for tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow public read-write for journal_entries" ON public.journal_entries;
DROP POLICY IF EXISTS "Allow public read-write for donation_progress" ON public.donation_progress;

CREATE POLICY "Allow public read-write for user_profile" ON public.user_profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for kpi_metrics" ON public.kpi_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for journal_entries" ON public.journal_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for donation_progress" ON public.donation_progress FOR ALL USING (true) WITH CHECK (true);

-- ==========================================================
-- REALTIME SYNC (SUPABASE REPLICATION)
-- ==========================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profile, public.kpi_metrics, public.tasks, public.journal_entries, public.donation_progress;

-- ==========================================================
-- SEED DATA TEMPLATE (DATA AWAL OTOMATIS)
-- ==========================================================

-- A. Insert Profil R&D Manager
INSERT INTO public.user_profile (id, full_name, foundation_name, monthly_target, quarterly_target, daily_working_hours, whatsapp_number, avatar_url)
VALUES (
    'default_user',
    'Farhan Maulana, S.Sos., M.M.',
    'Yayasan Khoirur Rooziqiin',
    'Oktober 2026: Program Integrasi Donor Retention & Pelaporan Transparan (Target Churn Rate Turun dari 30% ke 10% & Uji Coba Auto-Debet Sedekah Subuh)',
    'Oktober 2026: Program Integrasi Donor Retention & Pelaporan Transparan (Target Churn Rate Turun dari 30% ke 10% & Uji Coba Auto-Debet Sedekah Subuh)',
    8,
    '6281234567890',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    foundation_name = EXCLUDED.foundation_name,
    monthly_target = EXCLUDED.monthly_target;

-- B. Insert Matriks KPI LogFrame
INSERT INTO public.kpi_metrics (id, category, code, title, description, target_value, weight, evidence, assumptions_risks, order_index)
VALUES 
    ('kpi-goal-1', 'goal', 'GOAL-1', 'Penurunan Churn Rate Donatur Rutin (30% ➔ 10%)', 'Terjaganya keberlanjutan pendanaan untuk program Adik Asuh, pendidikan dhuafa, dan dakwah.', 100, 0.10, 'Laporan Keuangan Tahunan & Dashboard CRM', 'Asumsi kondisi ekonomi makro donatur stabil.', 0),
    ('kpi-oc-1', 'outcome', 'OC-1', 'Re-aktivasi 60% Donatur Pasif via Impact Report', 'Meningkatnya kepercayaan (trust) donatur lama setelah menerima laporan dampak personal.', 100, 0.35, 'Analisis data recovery dari CRM yayasan', 'Asumsi: Donatur menyukai pelaporan foto/video anak asuh.', 1),
    ('kpi-oc-2', 'outcome', 'OC-2', 'Migrasi 1.000 Donatur ke Auto-Debet Sedekah Subuh', 'Kemudahan berdonasi rutin tanpa friction melalui sistem donasi otomatis berlangganan.', 100, 0.25, 'Data transaksi sistem auto-debet payment gateway', 'Asumsi: Donatur nyaman dengan skema recurrent billing.', 2),
    ('kpi-op-1', 'output', 'OP-1', 'Rilis Fitur Donasi Langganan Rutin di Platform Digital', 'Inovasi teknis minim hambatan (frictionless) auto-debet harian / mingguan.', 100, 0.15, 'Tautan / modul aplikasi fitur baru yang live', 'Asumsi: Tim IT mengeksekusi arsitektur tepat waktu.', 3),
    ('kpi-op-2', 'output', 'OP-2', 'Format Personalized Impact Report Wali Asuh', 'Dokumen template pelaporan perkembangan anak asuh (foto terbaru, rapor, catatan prestasi).', 100, 0.15, 'Dokumen master template pelaporan Wali Asuh & sampel terdistribusi', 'Asumsi: Data foto & rapor dari fasilitator lapangan lengkap.', 4),
    ('kpi-ac-1', 'activity', 'AC-1', 'Survei Churn Rate ke 50-100 Donatur Pasif & Aktif', 'Kuesioner mendalam untuk membedakan faktor eksternal (daya beli) vs internal (laporan kurang/bosan).', 100, 0.05, 'Rekap database responden, rekaman telepon sampel, & kuesioner digital', 'Asumsi: Tim CS/Fundraising kooperatif memberikan kontak donatur pasif.', 5),
    ('kpi-ac-2', 'activity', 'AC-2', 'Re-desain Alur Komunikasi Wali Asuh (Storytelling vs Tagihan)', 'Mengevaluasi donor journey: mengganti interaksi "menagih" menjadi keterlibatan emosional.', 100, 0.05, 'Notulensi workshop lintas divisi & flowchart interaksi baru', 'Asumsi: Tim frontline menyepakati tone of voice baru.', 6)
ON CONFLICT (id) DO NOTHING;

-- C. Insert Agenda Tugas R&D (Bulan Berjalan & Histori Lampau)
INSERT INTO public.tasks (id, kpi_id, category, title, description, due_date, is_completed, completed_at, priority, estimated_hours)
VALUES
    -- Tugas Aktif Oktober 2026
    ('task-rca-01', 'kpi-ac-1', 'activity', 'Audit Database Churn Rate Donatur Adik Asuh & Sedekah Subuh', 'Menganalisis database CRM: Apakah donatur Adik Asuh berhenti karena anak sudah lulus atau tidak pernah mendapat kabar perkembangan? Identifikasi titik drop-off terbesar.', CURRENT_DATE, false, null, 'high', 3.5),
    ('task-rca-02', 'kpi-ac-1', 'activity', 'Panggilan Wawancara Mendalam (In-depth Call) 20 Donatur Pasif', 'Menggali akar penyebab: faktor eksternal (ekonomi donatur) vs faktor internal (hanya dihubungi saat butuh donasi / tagihan).', CURRENT_DATE, false, null, 'high', 2.5),
    ('task-inv-01', 'kpi-op-2', 'output', 'Desain Format Personalized Impact Report Wali Asuh (Foto & Rapor)', 'Menyusun template laporan sentuhan emosional: progress akademik, perkembangan kepribadian, surat tulisan tangan anak asuh, dan foto aktivitas.', CURRENT_DATE + INTERVAL '1 day', false, null, 'high', 4.0),
    ('task-inv-02', 'kpi-ac-2', 'activity', 'Workshop Cross-Divisi: Re-desain Donor Journey Pasca-Donasi', 'Bersama tim IT & Marketing: Mengubah touchpoint WhatsApp agar tidak melulu berisi poster donasi baru, melainkan cerita dampak riil penerima manfaat.', CURRENT_DATE + INTERVAL '1 day', false, null, 'medium', 2.0),
    ('task-inv-03', 'kpi-op-1', 'output', 'Finalisasi Skema Fitur Auto-Debet Harian Sedekah Subuh', 'Spesifikasi produk R&D untuk tim programmer: opsi nominal mikro Rp 2.000 - Rp 10.000/hari dengan notifikasi doa harian via WhatsApp.', CURRENT_DATE + INTERVAL '4 days', false, null, 'high', 3.5),
    ('task-inv-04', 'kpi-oc-1', 'outcome', 'Piloting A/B Testing Kampanye Retensi vs Model Lama', 'Menguji efektivitas materi kampanye berbasis insight riset: target peningkatan conversion rate +15% dibanding pesan konvensional.', CURRENT_DATE + INTERVAL '6 days', false, null, 'medium', 3.0),
    ('task-inv-05', 'kpi-oc-2', 'outcome', 'Rancang Skema "Patungan Wakaf Produktif" Berbasis Laporan SROI', 'Eksplorasi produk retensi donatur kelas menengah-atas dengan model bagi hasil sosial (Social Return on Investment).', CURRENT_DATE + INTERVAL '10 days', false, null, 'low', 4.5),
    
    -- Tugas Selesai Oktober 2026
    ('task-comp-01', 'kpi-ac-1', 'activity', 'Penyusunan Kuesioner Digital Donor Satisfaction Survey (50-100 Sampel)', 'Pertanyaan menguji kepuasan transparansi pelaporan, kemudahan UI web donasi, dan alasan berhenti berdonasi.', '2026-10-14', true, '2026-10-14 10:30:00+00', 'high', 3.0),
    ('task-comp-02', 'kpi-ac-2', 'activity', 'Audit 5 Channel Komunikasi Donasi (WhatsApp Blast, Email, Instagram, Web)', 'Ditemukan 82% pesan blast hanya berisi penggalangan dana tanpa pernah mengirimkan laporan bukti penyaluran program.', '2026-10-11', true, '2026-10-11 16:00:00+00', 'high', 4.0),

    -- Histori Selesai September 2026
    ('task-hist-sep-01', 'kpi-op-1', 'output', 'Benchmarking 5 Platform Filantropi Terkemuka terkait Fitur Recurring Donation', 'Mempelajari skema potong saldo otomatis, integrasi Midtrans/Xendit subscription API, dan model UX donasi rutin.', '2026-09-28', true, '2026-09-28 15:00:00+00', 'high', 5.0),
    ('task-hist-sep-02', 'kpi-ac-1', 'activity', 'Penyusunan Desain Metodologi Riset Perilaku Donatur Generasi Muda', 'Penyusunan kerangka sampel kuantitatif dan kualitatif donatur usia 22-35 tahun untuk program Sedekah Subuh.', '2026-09-22', true, '2026-09-22 14:30:00+00', 'medium', 3.5),
    ('task-hist-sep-03', 'kpi-oc-1', 'outcome', 'Evaluasi Laporan Keuangan Sosial & SROI Program Beasiswa Adik Asuh', 'Menghitung Social Return on Investment (SROI) dari setiap Rp 1 donasi yang disalurkan ke biaya sekolah anak binaan.', '2026-09-15', true, '2026-09-15 11:00:00+00', 'high', 6.0),
    ('task-hist-sep-04', 'kpi-ac-2', 'activity', 'Review Arsitektur Database Donatur bersama Tim Data Engineer', 'Pembersihan duplikasi data kontak donatur dan standarisasi tagging program (Adik Asuh, Zakat, Wakaf).', '2026-09-08', true, '2026-09-08 16:30:00+00', 'medium', 4.0),

    -- Histori Selesai Agustus 2026
    ('task-hist-aug-01', 'kpi-ac-1', 'activity', 'Survei Kepuasan Mitra Komunitas Penyalur Program Dakwah Pedalaman', 'Evaluasi ketepatan waktu pengiriman logistik beras dakwah dan feedback dari ustadz pembina 12 desa.', '2026-08-25', true, '2026-08-25 15:20:00+00', 'medium', 4.5),
    ('task-hist-aug-02', 'kpi-op-1', 'output', 'Analisis Efektivitas Saluran Pembayaran (Virtual Account vs E-Wallet vs Transfer Bank)', 'Menemukan bahwa kegagalan pembayaran di portal donasi mencapai 18% akibat drop-off kode unik transfer manual.', '2026-08-18', true, '2026-08-18 10:00:00+00', 'high', 4.0),
    ('task-hist-aug-03', 'kpi-op-2', 'output', 'Penyusunan SOP Pengumpulan Cerita Dampak (Impact Storytelling) Penerima Manfaat', 'Panduan teknis pengambilan foto human interest beretika dan wawancara testimonial wali murid dhuafa.', '2026-08-10', true, '2026-08-10 13:45:00+00', 'medium', 5.5)
ON CONFLICT (id) DO NOTHING;

-- D. Insert Jurnal Kerja Harian (Minggu 3 Oktober 2026)
INSERT INTO public.journal_entries (id, date, day_name, week_number, month_key, hours_worked, summary, notes, tags)
VALUES
    ('jnl-2026-w42-mon', '2026-10-12', 'Senin', 3, '2026-10', 7.0, 'Audit Data Drop-off CRM & Segmentasi Donatur', 'Menganalisis 450 row data donatur pasif di CRM. Ditemukan 68% drop-off terjadi setelah 3 bulan pertama donasi karena tidak pernah menerima kabar anak asuh. Hari ini mulai memformulasikan variabel survei kepuasan.', ARRAY['Root Cause', 'Data Audit', 'Adik Asuh']),
    ('jnl-2026-w42-tue', '2026-10-13', 'Selasa', 3, '2026-10', 7.5, 'Wawancara Telepon Donatur Sedekah Subuh & Analisis Friction', 'Melakukan panggilan mendalam ke 8 donatur aktif Sedekah Subuh. Semua responden menyatakan sering lupa transfer manual setiap subuh dan sangat menyambut baik jika ada fitur auto-debet otomatis Rp 2.000 - Rp 5.000 via e-wallet.', ARRAY['Interview', 'Sedekah Subuh', 'Inovasi']),
    ('jnl-2026-w42-wed', '2026-10-14', 'Rabu', 3, '2026-10', 8.0, 'Penyusunan Kuesioner Digital Donor Satisfaction & FGD Fasilitator', 'Menyelesaikan 15 pertanyaan kuesioner digital (mengukur transparansi, kemudahan aplikasi, dan faktor kepuasan). Berkoordinasi dengan koordinator lapangan untuk prototipe laporan rapor anak asuh.', ARRAY['Kuesioner', 'FGD', 'Wali Asuh']),
    ('jnl-2026-w42-thu', '2026-10-15', 'Kamis', 3, '2026-10', 7.5, 'Evaluasi Alur WhatsApp Blast & Audit Touchpoint', 'Memeriksa 12 pesan blast broadcast terakhir dari tim fundraising. Ditemukan bahwa 10 pesan hanya berisi ajakan transfer baru tanpa ada ucapan terima kasih bernarasi dampak. Menyusun draf perbaikan alur untuk dibahas besok.', ARRAY['Donor Journey', 'WhatsApp Blast', 'Evaluasi']),
    ('jnl-2026-w42-fri', '2026-10-16', 'Jumat', 3, '2026-10', 6.5, 'Sintesis Mingguan & Persiapan Prototipe Auto-Debet', 'Hari ini fokus mengonsolidasi seluruh temuan minggu ke-3 Oktober. Menyiapkan dokumen spesifikasi fungsional fitur auto-debet harian untuk dipresentasikan ke tim IT minggu depan.', ARRAY['Sintesis', 'IT Alignment', 'Auto-Debet'])
ON CONFLICT (id) DO NOTHING;

-- E. Insert Monitoring Progres Donasi Awal (Editable Table Dashboard)
INSERT INTO public.donation_progress (id, program, target, actual, order_index, notes)
VALUES
    ('prog-zakat', 'Zakat', 44100000, 12675646, 1, 'Target penghimpunan zakat mal dan fitrah triwulan IV'),
    ('prog-wakaf', 'Wakaf', 35000000, 8500000, 2, 'Wakaf Produktif sarana klinik dhuafa & pemberdayaan ekonomi'),
    ('prog-infaq', 'Infaq & Sedekah', 25000000, 18250000, 3, 'Sedekah Subuh harian & donasi operasional tanggap bencana'),
    ('prog-wali-asuh', 'Wali Asuh', 20000000, 14600000, 4, 'Beasiswa rutin bulanan pendidikan anak yatim dan dhuafa')
ON CONFLICT (id) DO UPDATE SET
    program = EXCLUDED.program,
    target = EXCLUDED.target,
    actual = EXCLUDED.actual,
    order_index = EXCLUDED.order_index,
    notes = EXCLUDED.notes;
