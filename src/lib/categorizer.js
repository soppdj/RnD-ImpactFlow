// Smart Auto-Categorization based on tags, summary, and notes
export const categorizeFromTags = (tags = [], summary = '', notes = '') => {
  const tagsStr = Array.isArray(tags) ? tags.join(' ') : (tags || '');
  const combined = `${tagsStr} ${summary || ''} ${notes || ''}`.toLowerCase();

  // 1. Goal (Dampak / Penurunan Churn / Sasaran Tahunan)
  if (
    combined.includes('goal') ||
    combined.includes('tujuan') ||
    combined.includes('churn rate') ||
    combined.includes('sasaran tahunan') ||
    combined.includes('dampak jangka panjang')
  ) {
    return {
      category: 'goal',
      kpi_id: 'kpi-goal-1',
      label: 'Goal (Dampak)',
      pillClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
  }

  // 2. Output (Keluaran Nyata, Format, Template, SOP, Desain, Fitur, Modul, Dokumen, Rapor)
  if (
    combined.includes('desain') ||
    combined.includes('design') ||
    combined.includes('output') ||
    combined.includes('fitur') ||
    combined.includes('modul') ||
    combined.includes('prototipe') ||
    combined.includes('prototype') ||
    combined.includes('template') ||
    combined.includes('format') ||
    combined.includes('sop') ||
    combined.includes('rapor') ||
    combined.includes('spesifikasi') ||
    combined.includes('dokumen') ||
    combined.includes('release') ||
    combined.includes('rilis') ||
    combined.includes('laporan')
  ) {
    const isReport = combined.includes('report') || combined.includes('rapor') || combined.includes('template') || combined.includes('wali asuh');
    return {
      category: 'output',
      kpi_id: isReport ? 'kpi-op-2' : 'kpi-op-1',
      label: 'Output (Keluaran)',
      pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }

  // 3. Outcome (Hasil / Perubahan Perilaku, Retensi, Konversi, Piloting, Uji Coba, A/B Test, SROI, Auto-Debet, Wakaf)
  if (
    combined.includes('retensi') ||
    combined.includes('retention') ||
    combined.includes('outcome') ||
    combined.includes('piloting') ||
    combined.includes('uji coba') ||
    combined.includes('a/b test') ||
    combined.includes('re-aktivasi') ||
    combined.includes('reaktivasi') ||
    combined.includes('konversi') ||
    combined.includes('auto-debet') ||
    combined.includes('autodebet') ||
    combined.includes('wakaf') ||
    combined.includes('sroi')
  ) {
    const isAutoDebet = combined.includes('auto-debet') || combined.includes('autodebet');
    return {
      category: 'outcome',
      kpi_id: isAutoDebet ? 'kpi-oc-2' : 'kpi-oc-1',
      label: 'Outcome (Hasil)',
      pillClass: 'bg-blue-50 text-blue-700 border-blue-200'
    };
  }

  // 4. Activity (Aktivitas Lapangan, Analisis, Audit, Survei, Wawancara, Interview, FGD, Rapat, Evaluasi, Data, Cek)
  // Default category for daily research journal logs
  const isComm = combined.includes('komunikasi') || combined.includes('alur') || combined.includes('journey') || combined.includes('storytelling');
  return {
    category: 'activity',
    kpi_id: isComm ? 'kpi-ac-2' : 'kpi-ac-1',
    label: 'Activity (Aktivitas)',
    pillClass: 'bg-purple-50 text-purple-700 border-purple-200'
  };
};
