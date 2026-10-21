// Seed data tailored for:
// R&D Penghimpunan & Retensi Donatur - Program Integrasi Donor Retention & Pelaporan Transparan
// Includes Monthly Targets, Weekly Work Journal, and Historical Completed Tasks by Month

export const INITIAL_USER_PROFILE = {
  id: 'default_user',
  full_name: 'Farhan Maulana, S.Sos., M.M.',
  foundation_name: 'Yayasan Khoirur Rooziqiin',
  monthly_target: 'Oktober 2026: Program Integrasi Donor Retention & Pelaporan Transparan (Target Churn Rate Turun dari 30% ke 10% & Uji Coba Auto-Debet Sedekah Subuh)',
  quarterly_target: 'Oktober 2026: Program Integrasi Donor Retention & Pelaporan Transparan (Target Churn Rate Turun dari 30% ke 10% & Uji Coba Auto-Debet Sedekah Subuh)',
  daily_working_hours: 8,
  whatsapp_number: '6281234567890',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  updated_at: new Date().toISOString()
};

// 4 Area Kinerja Utama (KRA) R&D Penghimpunan (Target Bulanan)
export const RND_KRA_METRICS = [
  {
    key: 'diagnosa',
    title: 'Diagnosa & Analisis Data',
    indicator: 'Ketersediaan laporan Root Cause Analysis penurunan donasi & insight perilaku donor',
    target: '1 Laporan komprehensif selesai bulan ini (14 hari kerja)',
    progress: 75,
    status: 'On Track (Hari ke-10)'
  },
  {
    key: 'inovasi',
    title: 'Pengembangan Inovasi Retensi',
    indicator: 'Jumlah rancangan strategi retensi (Impact Report baru, auto-debet Sedekah Subuh) yang diuji coba (piloting)',
    target: '2 Strategi / Produk uji coba bulan ini',
    progress: 60,
    status: 'Piloting Phase'
  },
  {
    key: 'efektivitas',
    title: 'Dampak Intervensi R&D (Efektivitas)',
    indicator: 'Persentase conversion rate dari program/kampanye baru hasil riset R&D',
    target: 'Meningkat +15% dibanding model kampanye lama',
    progress: 50,
    status: 'A/B Testing'
  },
  {
    key: 'kepuasan',
    title: 'Evaluasi Pelaporan Donatur',
    indicator: 'Tingkat Kepuasan Donatur (Donor Satisfaction Score) atas transparansi penyaluran',
    target: 'Skor >8.5 dari skala 10 pada survei bulanan',
    progress: 85,
    status: 'Survey in Progress'
  }
];

// Logical Framework (LogFrame) Levels
export const INITIAL_KPIS = [
  // GOAL (Dampak Jangka Panjang)
  {
    id: 'kpi-goal-1',
    category: 'goal',
    code: 'GOAL-1',
    title: 'Penurunan Churn Rate Donatur Rutin (30% ➔ 10%)',
    description: 'Terjaganya keberlanjutan pendanaan untuk program Adik Asuh, pendidikan dhuafa, dan dakwah.',
    target_value: 100,
    weight: 0.10,
    order_index: 0,
    evidence: 'Laporan Keuangan Tahunan & Dashboard Database Donatur',
    assumptions_risks: 'Tujuan akhir dampak lembaga, asumsi makro stabil.'
  },

  // OUTCOME (Hasil & Perubahan Perilaku)
  {
    id: 'kpi-oc-1',
    category: 'outcome',
    code: 'OC-1',
    title: 'Re-aktivasi 60% Donatur Pasif via Impact Report',
    description: 'Meningkatnya kepercayaan (trust) donatur lama setelah menerima laporan dampak personal.',
    target_value: 100,
    weight: 0.35,
    order_index: 1,
    evidence: 'Analisis data recovery dari CRM yayasan',
    assumptions_risks: 'Asumsi: Kondisi ekonomi makro kelas menengah relatif stabil. Risiko: Sentimen negatif media nasional.'
  },
  {
    id: 'kpi-oc-2',
    category: 'outcome',
    code: 'OC-2',
    title: 'Migrasi 1.000 Donatur ke Auto-Debet Sedekah Subuh',
    description: 'Kemudahan berdonasi rutin tanpa friction melalui sistem donasi otomatis berlangganan.',
    target_value: 100,
    weight: 0.25,
    order_index: 2,
    evidence: 'Data transaksi sistem auto-debet payment gateway',
    assumptions_risks: 'Asumsi: Donatur nyaman dengan skema recurrent billing.'
  },

  // OUTPUT (Keluaran Nyata Riset & Sistem)
  {
    id: 'kpi-op-1',
    category: 'output',
    code: 'OP-1',
    title: 'Rilis Fitur Donasi Langganan Rutin di Platform Digital',
    description: 'Inovasi teknis minim hambatan (frictionless) auto-debet harian / mingguan.',
    target_value: 100,
    weight: 0.15,
    order_index: 3,
    evidence: 'Tautan / modul aplikasi fitur baru yang live',
    assumptions_risks: 'Asumsi: Tim IT mampu mengeksekusi arsitektur platform tepat waktu.'
  },
  {
    id: 'kpi-op-2',
    category: 'output',
    code: 'OP-2',
    title: 'Format Personalized Impact Report Wali Asuh',
    description: 'Dokumen template pelaporan perkembangan anak asuh (foto terbaru, rapor, catatan prestasi).',
    target_value: 100,
    weight: 0.15,
    order_index: 4,
    evidence: 'Dokumen master template pelaporan Wali Asuh & sampel terdistribusi',
    assumptions_risks: 'Asumsi: Data foto & rapor dari fasilitator lapangan lengkap.'
  },

  // ACTIVITIES (Aktivitas Lapangan R&D)
  {
    id: 'kpi-ac-1',
    category: 'activity',
    code: 'AC-1',
    title: 'Survei Churn Rate ke 50-100 Donatur Pasif & Aktif',
    description: 'Kuesioner mendalam untuk membedakan faktor eksternal (daya beli) vs internal (laporan kurang/bosan).',
    target_value: 100,
    weight: 0.05,
    order_index: 5,
    evidence: 'Rekap database responden, rekaman telepon sampel, & anggaran riset',
    assumptions_risks: 'Asumsi: Tim CS/Fundraising kooperatif memberikan kontak donatur pasif.'
  },
  {
    id: 'kpi-ac-2',
    category: 'activity',
    code: 'AC-2',
    title: 'Re-desain Alur Komunikasi Wali Asuh (Storytelling vs Tagihan)',
    description: 'Mengevaluasi donor journey: mengganti interaksi "menagih" menjadi keterlibatan emosional.',
    target_value: 100,
    weight: 0.05,
    order_index: 6,
    evidence: 'Notulensi workshop lintas divisi (R&D, IT, Marketing) & flowchart interaksi baru',
    assumptions_risks: 'Asumsi: Seluruh tim frontline menyepakati perubahan tone of voice komunikasi.'
  }
];

const getRelativeDateString = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS = [
  // ========================================================
  // BULAN INI: OKTOBER 2026 (Aktif & Berjalan)
  // ========================================================
  {
    id: 'task-rca-01',
    kpi_id: 'kpi-ac-1',
    category: 'activity',
    title: 'Audit Database Churn Rate Donatur Adik Asuh & Sedekah Subuh',
    description: 'Menganalisis database CRM: Apakah donatur Adik Asuh berhenti karena anak sudah lulus atau tidak pernah mendapat kabar perkembangan? Identifikasi titik drop-off terbesar.',
    due_date: getRelativeDateString(0), // Today
    is_completed: false,
    priority: 'high',
    estimated_hours: 3.5,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'task-rca-02',
    kpi_id: 'kpi-ac-1',
    category: 'activity',
    title: 'Panggilan Wawancara Mendalam (In-depth Call) 20 Donatur Pasif',
    description: 'Menggali akar penyebab: faktor eksternal (ekonomi donatur) vs faktor internal (hanya dihubungi saat butuh donasi / tagihan).',
    due_date: getRelativeDateString(0), // Today
    is_completed: false,
    priority: 'high',
    estimated_hours: 2.5,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'task-inv-01',
    kpi_id: 'kpi-op-2',
    category: 'output',
    title: 'Desain Format Personalized Impact Report Wali Asuh (Foto & Rapor)',
    description: 'Menyusun template laporan sentuhan emosional: progress akademik, perkembangan kepribadian, surat tulisan tangan anak asuh, dan foto aktivitas.',
    due_date: getRelativeDateString(1), // Tomorrow
    is_completed: false,
    priority: 'high',
    estimated_hours: 4.0,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'task-inv-02',
    kpi_id: 'kpi-ac-2',
    category: 'activity',
    title: 'Workshop Cross-Divisi: Re-desain Donor Journey Pasca-Donasi',
    description: 'Bersama tim IT & Marketing: Mengubah touchpoint WhatsApp agar tidak melulu berisi poster donasi baru, melainkan cerita dampak riil penerima manfaat.',
    due_date: getRelativeDateString(1), // Tomorrow
    is_completed: false,
    priority: 'medium',
    estimated_hours: 2.0,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'task-inv-03',
    kpi_id: 'kpi-op-1',
    category: 'output',
    title: 'Finalisasi Skema Fitur Auto-Debet Harian Sedekah Subuh',
    description: 'Spesifikasi produk R&D untuk tim programmer: opsi nominal mikro Rp 2.000 - Rp 10.000/hari dengan notifikasi doa harian via WhatsApp.',
    due_date: getRelativeDateString(4), // Future
    is_completed: false,
    priority: 'high',
    estimated_hours: 3.5,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'task-inv-04',
    kpi_id: 'kpi-oc-1',
    category: 'outcome',
    title: 'Piloting A/B Testing Kampanye Retensi vs Model Lama',
    description: 'Menguji efektivitas materi kampanye berbasis insight riset: target peningkatan conversion rate +15% dibanding pesan konvensional.',
    due_date: getRelativeDateString(6), // Future
    is_completed: false,
    priority: 'medium',
    estimated_hours: 3.0,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'task-inv-05',
    kpi_id: 'kpi-oc-2',
    category: 'outcome',
    title: 'Rancang Skema "Patungan Wakaf Produktif" Berbasis Laporan SROI',
    description: 'Eksplorasi produk retensi donatur kelas menengah-atas dengan model bagi hasil sosial (Social Return on Investment).',
    due_date: getRelativeDateString(10), // Future
    is_completed: false,
    priority: 'low',
    estimated_hours: 4.5,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  // Selesai di Bulan Oktober 2026
  {
    id: 'task-comp-01',
    kpi_id: 'kpi-ac-1',
    category: 'activity',
    title: 'Penyusunan Kuesioner Digital Donor Satisfaction Survey (50-100 Sampel)',
    description: 'Pertanyaan menguji kepuasan transparansi pelaporan, kemudahan UI web donasi, dan alasan berhenti berdonasi.',
    due_date: '2026-10-14',
    is_completed: true,
    completed_at: '2026-10-14T10:30:00.000Z',
    priority: 'high',
    estimated_hours: 3.0,
    created_at: '2026-10-10T08:00:00.000Z'
  },
  {
    id: 'task-comp-02',
    kpi_id: 'kpi-ac-2',
    category: 'activity',
    title: 'Audit 5 Channel Komunikasi Donasi (WhatsApp Blast, Email, Instagram, Web)',
    description: 'Ditemukan 82% pesan blast hanya berisi penggalangan dana tanpa pernah mengirimkan laporan bukti penyaluran program.',
    due_date: '2026-10-11',
    is_completed: true,
    completed_at: '2026-10-11T16:00:00.000Z',
    priority: 'high',
    estimated_hours: 4.0,
    created_at: '2026-10-08T09:00:00.000Z'
  },

  // ========================================================
  // HISTORI: BULAN SEPTEMBER 2026 (Tugas Selesai Terarsip)
  // ========================================================
  {
    id: 'task-hist-sep-01',
    kpi_id: 'kpi-op-1',
    category: 'output',
    title: 'Benchmarking 5 Platform Filantropi Terkemuka terkait Fitur Recurring Donation',
    description: 'Mempelajari skema potong saldo otomatis, integrasi Midtrans/Xendit subscription API, dan model UX donasi rutin.',
    due_date: '2026-09-28',
    is_completed: true,
    completed_at: '2026-09-28T15:00:00.000Z',
    priority: 'high',
    estimated_hours: 5.0,
    created_at: '2026-09-20T08:00:00.000Z'
  },
  {
    id: 'task-hist-sep-02',
    kpi_id: 'kpi-ac-1',
    category: 'activity',
    title: 'Penyusunan Desain Metodologi Riset Perilaku Donatur Generasi Muda',
    description: 'Penyusunan kerangka sampel kuantitatif dan kualitatif donatur usia 22-35 tahun untuk program Sedekah Subuh.',
    due_date: '2026-09-22',
    is_completed: true,
    completed_at: '2026-09-22T14:30:00.000Z',
    priority: 'medium',
    estimated_hours: 3.5,
    created_at: '2026-09-16T10:00:00.000Z'
  },
  {
    id: 'task-hist-sep-03',
    kpi_id: 'kpi-oc-1',
    category: 'outcome',
    title: 'Evaluasi Laporan Keuangan Sosial & SROI Program Beasiswa Adik Asuh',
    description: 'Menghitung Social Return on Investment (SROI) dari setiap Rp 1 donasi yang disalurkan ke biaya sekolah anak binaan.',
    due_date: '2026-09-15',
    is_completed: true,
    completed_at: '2026-09-15T11:00:00.000Z',
    priority: 'high',
    estimated_hours: 6.0,
    created_at: '2026-09-08T09:00:00.000Z'
  },
  {
    id: 'task-hist-sep-04',
    kpi_id: 'kpi-ac-2',
    category: 'activity',
    title: 'Review Arsitektur Database Donatur bersama Tim Data Engineer',
    description: 'Pembersihan duplikasi data kontak donatur dan standarisasi tagging program (Adik Asuh, Zakat, Wakaf).',
    due_date: '2026-09-08',
    is_completed: true,
    completed_at: '2026-09-08T16:30:00.000Z',
    priority: 'medium',
    estimated_hours: 4.0,
    created_at: '2026-09-02T13:00:00.000Z'
  },

  // ========================================================
  // HISTORI: BULAN AGUSTUS 2026 (Tugas Selesai Terarsip)
  // ========================================================
  {
    id: 'task-hist-aug-01',
    kpi_id: 'kpi-ac-1',
    category: 'activity',
    title: 'Survei Kepuasan Mitra Komunitas Penyalur Program Dakwah Pedalaman',
    description: 'Evaluasi ketepatan waktu pengiriman logistik beras dakwah dan feedback dari ustadz pembina 12 desa.',
    due_date: '2026-08-25',
    is_completed: true,
    completed_at: '2026-08-25T15:20:00.000Z',
    priority: 'medium',
    estimated_hours: 4.5,
    created_at: '2026-08-18T10:00:00.000Z'
  },
  {
    id: 'task-hist-aug-02',
    kpi_id: 'kpi-op-1',
    category: 'output',
    title: 'Analisis Efektivitas Saluran Pembayaran (Virtual Account vs E-Wallet vs Transfer Bank)',
    description: 'Menemukan bahwa kegagalan pembayaran di portal donasi mencapai 18% akibat drop-off kode unik transfer manual.',
    due_date: '2026-08-18',
    is_completed: true,
    completed_at: '2026-08-18T10:00:00.000Z',
    priority: 'high',
    estimated_hours: 4.0,
    created_at: '2026-08-12T08:00:00.000Z'
  },
  {
    id: 'task-hist-aug-03',
    kpi_id: 'kpi-op-2',
    category: 'output',
    title: 'Penyusunan SOP Pengumpulan Cerita Dampak (Impact Storytelling) Penerima Manfaat',
    description: 'Panduan teknis pengambilan foto human interest beretika dan wawancara testimonial wali murid dhuafa.',
    due_date: '2026-08-10',
    is_completed: true,
    completed_at: '2026-08-10T13:45:00.000Z',
    priority: 'medium',
    estimated_hours: 5.5,
    created_at: '2026-08-04T09:00:00.000Z'
  }
];

// Jurnal Kerja Harian per Minggu (Weekly Work Journal)
export const INITIAL_JOURNAL_ENTRIES = [
  {
    id: 'jnl-2026-w42-mon',
    date: '2026-10-12',
    day_name: 'Senin',
    week_number: 3,
    month_key: '2026-10',
    hours_worked: 7.0,
    summary: 'Audit Data Drop-off CRM & Segmentasi Donatur',
    notes: 'Menganalisis 450 row data donatur pasif di CRM. Ditemukan 68% drop-off terjadi setelah 3 bulan pertama donasi karena tidak pernah menerima kabar anak asuh. Hari ini mulai memformulasikan variabel survei kepuasan.',
    tags: ['Root Cause', 'Data Audit', 'Adik Asuh'],
    created_at: '2026-10-12T17:00:00.000Z'
  },
  {
    id: 'jnl-2026-w42-tue',
    date: '2026-10-13',
    day_name: 'Selasa',
    week_number: 3,
    month_key: '2026-10',
    hours_worked: 7.5,
    summary: 'Wawancara Telepon Donatur Sedekah Subuh & Analisis Friction',
    notes: 'Melakukan panggilan mendalam ke 8 donatur aktif Sedekah Subuh. Semua responden menyatakan sering lupa transfer manual setiap subuh dan sangat menyambut baik jika ada fitur auto-debet otomatis Rp 2.000 - Rp 5.000 via e-wallet.',
    tags: ['Interview', 'Sedekah Subuh', 'Inovasi'],
    created_at: '2026-10-13T17:00:00.000Z'
  },
  {
    id: 'jnl-2026-w42-wed',
    date: '2026-10-14',
    day_name: 'Rabu',
    week_number: 3,
    month_key: '2026-10',
    hours_worked: 8.0,
    summary: 'Penyusunan Kuesioner Digital Donor Satisfaction & FGD Fasilitator',
    notes: 'Menyelesaikan 15 pertanyaan kuesioner digital (mengukur transparansi, kemudahan aplikasi, dan faktor kepuasan). Berkoordinasi dengan koordinator lapangan untuk prototipe laporan rapor anak asuh.',
    tags: ['Kuesioner', 'FGD', 'Wali Asuh'],
    created_at: '2026-10-14T17:00:00.000Z'
  },
  {
    id: 'jnl-2026-w42-thu',
    date: '2026-10-15',
    day_name: 'Kamis',
    week_number: 3,
    month_key: '2026-10',
    hours_worked: 7.5,
    summary: 'Evaluasi Alur WhatsApp Blast & Audit Touchpoint',
    notes: 'Memeriksa 12 pesan blast broadcast terakhir dari tim fundraising. Ditemukan bahwa 10 pesan hanya berisi ajakan transfer baru tanpa ada ucapan terima kasih bernarasi dampak. Menyusun draf perbaikan alur untuk dibahas besok.',
    tags: ['Donor Journey', 'WhatsApp Blast', 'Evaluasi'],
    created_at: '2026-10-15T17:00:00.000Z'
  },
  {
    id: 'jnl-2026-w42-fri',
    date: '2026-10-16',
    day_name: 'Jumat',
    week_number: 3,
    month_key: '2026-10',
    hours_worked: 6.5,
    summary: 'Sintesis Mingguan & Persiapan Prototipe Auto-Debet',
    notes: 'Hari ini fokus mengonsolidasi seluruh temuan minggu ke-3 Oktober. Menyiapkan dokumen spesifikasi fungsional fitur auto-debet harian untuk dipresentasikan ke tim IT minggu depan.',
    tags: ['Sintesis', 'IT Alignment', 'Auto-Debet'],
    created_at: '2026-10-16T17:00:00.000Z'
  }
];

// Tabel Progres Penghimpunan Donasi (Program, Target, Actual, Persentase)
export const INITIAL_DONATION_PROGRAMS = [
  {
    id: 'prog-zakat',
    program: 'Zakat',
    target: 44100000,
    actual: 12675646,
    notes: 'Zakat Maal & Zakat Profesi'
  },
  {
    id: 'prog-wakaf',
    program: 'Wakaf',
    target: 35000000,
    actual: 8500000,
    notes: 'Patungan Wakaf Produktif & Sarana'
  },
  {
    id: 'prog-infaq',
    program: 'Infaq & Sedekah',
    target: 25000000,
    actual: 18250000,
    notes: 'Sedekah Subuh & Infaq Operasional'
  },
  {
    id: 'prog-wali-asuh',
    program: 'Wali Asuh',
    target: 20000000,
    actual: 14600000,
    notes: 'Beasiswa Pendidikan Adik Asuh'
  }
];
