import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured, localSyncChannel } from '../lib/supabase';
import { INITIAL_USER_PROFILE, INITIAL_KPIS, INITIAL_TASKS, INITIAL_JOURNAL_ENTRIES, INITIAL_DONATION_PROGRAMS, RND_KRA_METRICS } from '../lib/mockData';
import { categorizeFromTags } from '../lib/categorizer';

const getStoredItem = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
  } catch (e) {
    console.warn('Error reading ' + key, e);
  }
  return fallback;
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Always initialize from localStorage cache so reopening loads last data immediately
  const [userProfile, setUserProfile] = useState(() => getStoredItem('impactflow_profile', INITIAL_USER_PROFILE));
  const [kpis, setKpis] = useState(() => getStoredItem('impactflow_kpis', INITIAL_KPIS));
  const [tasks, setTasks] = useState(() => getStoredItem('impactflow_tasks', INITIAL_TASKS));
  const [journalEntries, setJournalEntries] = useState(() => getStoredItem('impactflow_journal', INITIAL_JOURNAL_ENTRIES));
  const [donationPrograms, setDonationPrograms] = useState(() => getStoredItem('impactflow_donation_programs', INITIAL_DONATION_PROGRAMS));
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState('2026-10');
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState(isSupabaseConfigured() ? 'syncing' : 'sandbox');
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | agenda | journal | history | report | profile
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [waModalTask, setWaModalTask] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  // Show Toast Helper
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Trigger celebratory confetti on task completion
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2563eb', '#10b981', '#3b82f6', '#34d399', '#f59e0b']
      });
    } catch {
      // safe fallback
    }
  };

  // 1. Initial Load & Persistence Setup
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);

      if (isSupabaseConfigured()) {
        try {
          // Fetch User Profile
          const { data: profileData, error: profileErr } = await supabase
            .from('user_profile')
            .select('*')
            .limit(1)
            .maybeSingle();

          if (!profileErr && profileData && isMounted) {
            setUserProfile(profileData);
            localStorage.setItem('impactflow_profile', JSON.stringify(profileData));
          }

          // Fetch KPI Metrics
          const { data: kpiData, error: kpiErr } = await supabase
            .from('kpi_metrics')
            .select('*')
            .order('order_index', { ascending: true });

          if (!kpiErr && kpiData && kpiData.length > 0 && isMounted) {
            setKpis(kpiData);
            localStorage.setItem('impactflow_kpis', JSON.stringify(kpiData));
          }

          // Fetch Tasks
          const { data: taskData, error: taskErr } = await supabase
            .from('tasks')
            .select('*')
            .order('due_date', { ascending: true });

          if (!taskErr && taskData && isMounted) {
            setTasks(taskData);
            localStorage.setItem('impactflow_tasks', JSON.stringify(taskData));
          }

          // Fetch Journal Entries (Persist & sync across devices)
          const { data: journalData, error: journalErr } = await supabase
            .from('journal_entries')
            .select('*')
            .order('date', { ascending: false });

          if (!journalErr && journalData && isMounted) {
            setJournalEntries(journalData);
            localStorage.setItem('impactflow_journal', JSON.stringify(journalData));
          }

          // Fetch Donation Programs (if table exists)
          try {
            const { data: donData, error: donErr } = await supabase
              .from('donation_progress')
              .select('*')
              .order('order_index', { ascending: true });

            if (!donErr && donData && donData.length > 0 && isMounted) {
              setDonationPrograms(donData);
              localStorage.setItem('impactflow_donation_programs', JSON.stringify(donData));
            }
          } catch (e) {
            // Table optional
          }

          if (isMounted) {
            setSyncStatus('synced');
            showToast('Tersambung ke Supabase Realtime', 'success');
          }
        } catch (err) {
          console.error('Supabase load error:', err);
          if (isMounted) setSyncStatus('offline');
        }
      } else {
        // Fallback: LocalStorage Sandbox
        try {
          const cachedProfile = localStorage.getItem('impactflow_profile');
          const cachedKpis = localStorage.getItem('impactflow_kpis');
          const cachedTasks = localStorage.getItem('impactflow_tasks');
          const cachedJournal = localStorage.getItem('impactflow_journal');

          if (cachedProfile && cachedKpis && cachedTasks) {
            setUserProfile(JSON.parse(cachedProfile));
            setKpis(JSON.parse(cachedKpis));
            setTasks(JSON.parse(cachedTasks));
            if (cachedJournal) setJournalEntries(JSON.parse(cachedJournal));
            const cachedDonations = localStorage.getItem('impactflow_donation_programs');
            if (cachedDonations) setDonationPrograms(JSON.parse(cachedDonations));
          } else {
            // Upgrade to Monthly Target, Weekly Journal & Historic Archive dataset
            setUserProfile(INITIAL_USER_PROFILE);
            setKpis(INITIAL_KPIS);
            setTasks(INITIAL_TASKS);
            setJournalEntries(INITIAL_JOURNAL_ENTRIES);
            setDonationPrograms(INITIAL_DONATION_PROGRAMS);
            localStorage.setItem('impactflow_version', 'v3_monthly_journal');
            localStorage.setItem('impactflow_profile', JSON.stringify(INITIAL_USER_PROFILE));
            localStorage.setItem('impactflow_kpis', JSON.stringify(INITIAL_KPIS));
            localStorage.setItem('impactflow_tasks', JSON.stringify(INITIAL_TASKS));
            localStorage.setItem('impactflow_journal', JSON.stringify(INITIAL_JOURNAL_ENTRIES));
            localStorage.setItem('impactflow_donation_programs', JSON.stringify(INITIAL_DONATION_PROGRAMS));
          }

          setSyncStatus('sandbox');
        } catch (e) {
          console.error('LocalStorage load error:', e);
        }
      }

      if (isMounted) setLoading(false);
    };

    loadData();

    // 2. Setup Realtime Sync
    let supabaseChannel = null;

    if (isSupabaseConfigured()) {
      // Supabase Postgres Realtime Channel
      supabaseChannel = supabase
        .channel('public:realtime_ngo')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tasks' },
          (payload) => {
            console.log('Realtime task event received:', payload);
            if (payload.eventType === 'INSERT') {
              setTasks((prev) => {
                if (prev.some((t) => t.id === payload.new.id)) return prev;
                return [...prev, payload.new].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
              });
              showToast(`Tugas baru ditambahkan secara realtime: "${payload.new.title}"`, 'info');
            } else if (payload.eventType === 'UPDATE') {
              setTasks((prev) =>
                prev.map((t) => (t.id === payload.new.id ? { ...t, ...payload.new } : t))
              );
              showToast(`Tugas diperbarui: "${payload.new.title}"`, 'info');
            } else if (payload.eventType === 'DELETE') {
              setTasks((prev) => prev.filter((t) => t.id === payload.old.id));
              showToast('Tugas dihapus dari perangkat lain', 'info');
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'journal_entries' },
          (payload) => {
            console.log('Realtime journal event received:', payload);
            if (payload.eventType === 'INSERT') {
              setJournalEntries((prev) => {
                if (prev.some((j) => j.id === payload.new.id)) return prev;
                return [payload.new, ...prev];
              });
              showToast(`Jurnal baru ditambahkan: "${payload.new.summary}"`, 'info');
            } else if (payload.eventType === 'UPDATE') {
              setJournalEntries((prev) =>
                prev.map((j) => (j.id === payload.new.id ? { ...j, ...payload.new } : j))
              );
              showToast(`Jurnal diperbarui: "${payload.new.summary}"`, 'info');
            } else if (payload.eventType === 'DELETE') {
              setJournalEntries((prev) => prev.filter((j) => j.id !== payload.old.id));
              showToast('Catatan jurnal dihapus dari perangkat lain', 'info');
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_profile' },
          (payload) => {
            if (payload.new) {
              setUserProfile(payload.new);
              showToast('Profil pengguna disinkronkan', 'info');
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setSyncStatus('synced');
          }
        });
    } else if (localSyncChannel) {
      // Multi-tab BroadcastChannel sync for instant preview
      localSyncChannel.onmessage = (event) => {
        const { type, data } = event.data || {};
        if (type === 'SYNC_ALL') {
          if (data.userProfile) setUserProfile(data.userProfile);
          if (data.kpis) setKpis(data.kpis);
          if (data.tasks) setTasks(data.tasks);
          if (data.journalEntries) setJournalEntries(data.journalEntries);
          showToast('Data disinkronkan dari tab lain', 'info');
        }
      };
    }

    return () => {
      isMounted = false;
      if (supabaseChannel) supabase.removeChannel(supabaseChannel);
    };
  }, [showToast]);

  // Always keep localStorage updated with the latest snapshot of data (survives refreshes & restarts)
  useEffect(() => {
    try {
      localStorage.setItem('impactflow_profile', JSON.stringify(userProfile));
      localStorage.setItem('impactflow_kpis', JSON.stringify(kpis));
      localStorage.setItem('impactflow_tasks', JSON.stringify(tasks));
      localStorage.setItem('impactflow_journal', JSON.stringify(journalEntries));
      localStorage.setItem('impactflow_donation_programs', JSON.stringify(donationPrograms));
      localStorage.setItem('impactflow_version', 'v3_monthly_journal');

      if (localSyncChannel) {
        localSyncChannel.postMessage({
          type: 'SYNC_ALL',
          data: { userProfile, kpis, tasks, journalEntries, donationPrograms }
        });
      }
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }, [userProfile, kpis, tasks, journalEntries, donationPrograms]);

  // ==========================================
  // LOGFRAME & KPI AUTOMATION CALCULATIONS
  // ==========================================
  const progressMetrics = useMemo(() => {
    // Breakdown by LogFrame Category (Goal, Outcome, Output, Activity)
    const categoryStats = {
      goal: { total: 0, completed: 0, percent: 0 },
      outcome: { total: 0, completed: 0, percent: 0 },
      output: { total: 0, completed: 0, percent: 0 },
      activity: { total: 0, completed: 0, percent: 0 },
    };

    tasks.forEach((t) => {
      const cat = t.category?.toLowerCase() || 'activity';
      if (categoryStats[cat]) {
        categoryStats[cat].total += 1;
        if (t.is_completed) categoryStats[cat].completed += 1;
      }
    });

    Object.keys(categoryStats).forEach((cat) => {
      const { total, completed } = categoryStats[cat];
      categoryStats[cat].percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    });

    // 4 Key Result Areas (KRA) from Image 1:
    // 1. Diagnosa & Analisis Data (Root Cause Analysis - AC-1, tasks related to churn data audit)
    const diagTasks = tasks.filter((t) => t.id?.includes('rca') || t.title?.toLowerCase().includes('audit') || t.title?.toLowerCase().includes('survei'));
    const diagCompleted = diagTasks.filter((t) => t.is_completed).length;
    const diagPercent = diagTasks.length > 0 ? Math.round((diagCompleted / diagTasks.length) * 100) : 70;

    // 2. Pengembangan Inovasi Retensi (Auto-debet Sedekah Subuh, Impact Report Wali Asuh - OP-1, OP-2)
    const inovTasks = tasks.filter((t) => t.category === 'output' || t.title?.toLowerCase().includes('skema') || t.title?.toLowerCase().includes('format'));
    const inovCompleted = inovTasks.filter((t) => t.is_completed).length;
    const inovPercent = inovTasks.length > 0 ? Math.round((inovCompleted / inovTasks.length) * 100) : 60;

    // 3. Dampak Intervensi R&D (Conversion Rate Uplift +15% - OC-1, OC-2)
    const impactTasks = tasks.filter((t) => t.category === 'outcome' || t.title?.toLowerCase().includes('a/b') || t.title?.toLowerCase().includes('piloting'));
    const impactCompleted = impactTasks.filter((t) => t.is_completed).length;
    const impactPercent = impactTasks.length > 0 ? Math.round((impactCompleted / impactTasks.length) * 100) : 50;

    // 4. Evaluasi Pelaporan Donatur (Donor Satisfaction Score >8.5/10 - AC-2)
    const satTasks = tasks.filter((t) => t.title?.toLowerCase().includes('donor journey') || t.title?.toLowerCase().includes('kepuasan') || t.title?.toLowerCase().includes('alur komunikasi'));
    const satCompleted = satTasks.filter((t) => t.is_completed).length;
    const satPercent = satTasks.length > 0 ? Math.round((satCompleted / satTasks.length) * 100) : 65;

    const kraCards = [
      {
        key: 'diagnosa',
        title: 'Diagnosa & Analisis Data',
        indicator: 'Ketersediaan laporan Root Cause Analysis mengenai penurunan donasi (insight perilaku donor)',
        target: '1 Laporan komprehensif dalam 14 hari kerja',
        percent: diagPercent,
        status: diagPercent >= 100 ? 'Selesai / Terbit' : 'Hari ke-10 (Drafting)'
      },
      {
        key: 'inovasi',
        title: 'Pengembangan Inovasi Retensi',
        indicator: 'Jumlah rancangan strategi retensi (format Impact Report baru, skema auto-debet Sedekah Subuh) diuji coba',
        target: '2 Strategi / Produk uji coba per kuartal',
        percent: inovPercent,
        status: inovPercent >= 50 ? '1 Produk Piloting' : 'Perancangan Konsep'
      },
      {
        key: 'efektivitas',
        title: 'Dampak Intervensi R&D',
        indicator: 'Persentase conversion rate dari program/kampanye baru hasil riset R&D',
        target: 'Meningkat +15% dibanding model lama',
        percent: impactPercent,
        status: impactPercent >= 50 ? 'A/B Testing Aktif' : 'Persiapan Uji Coba'
      },
      {
        key: 'evaluasi',
        title: 'Evaluasi Pelaporan Donatur',
        indicator: 'Tingkat Kepuasan Donatur (Donor Satisfaction Score) atas transparansi penyaluran',
        target: 'Skor >8.5 dari skala 10',
        percent: satPercent,
        status: 'Survei Berjalan'
      }
    ];

    // Overall KRA weighted percentage based on 4 KRA areas
    const weightedKRA = Math.round((diagPercent + inovPercent + impactPercent + satPercent) / 4);

    // Flat task completion rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.is_completed).length;
    const flatCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      categoryStats,
      kraCards,
      weightedKRA,
      flatCompletionRate,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
    };
  }, [tasks]);

  // ==========================================
  // CRUD OPERATIONS (Synced with Supabase / Sandbox)
  // ==========================================

  // Toggle Task Completion
  const toggleTaskCompletion = async (taskId) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const newStatus = !targetTask.is_completed;
    const completedAt = newStatus ? new Date().toISOString() : null;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, is_completed: newStatus, completed_at: completedAt }
          : t
      )
    );

    if (newStatus) {
      triggerConfetti();
      showToast('Tugas selesai! KPI terupdate otomatis 🎉', 'success');
    }

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('tasks')
          .update({
            is_completed: newStatus,
            completed_at: completedAt,
            updated_at: new Date().toISOString()
          })
          .eq('id', taskId);

        if (error) throw error;
      } catch (err) {
        console.error('Failed to update task in Supabase:', err);
        showToast('Gagal menyimpan ke Supabase: ' + err.message, 'error');
        // Rollback
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? targetTask : t))
        );
      }
    }
  };

  // Add Task
  const addTask = async (taskData) => {
    const newTask = {
      id: isSupabaseConfigured() ? undefined : 'task-' + Date.now(),
      ...taskData,
      is_completed: false,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert([taskData])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setTasks((prev) => [...prev, data].sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
        }
        showToast('Tugas R&D berhasil ditambahkan', 'success');
      } catch (err) {
        console.error('Error inserting task:', err);
        showToast('Gagal menambahkan tugas: ' + err.message, 'error');
      }
    } else {
      setTasks((prev) => [...prev, newTask].sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
      showToast('Tugas berhasil dibuat (Tersimpan Lokal)', 'success');
    }
  };

  // Update Task
  const updateTask = async (taskId, updatedData) => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ ...updatedData, updated_at: new Date().toISOString() })
          .eq('id', taskId);

        if (error) throw error;
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, ...updatedData } : t))
        );
        showToast('Tugas berhasil diperbarui', 'success');
      } catch (err) {
        console.error('Error updating task:', err);
        showToast('Gagal memperbarui: ' + err.message, 'error');
      }
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updatedData } : t))
      );
      showToast('Tugas diperbarui', 'success');
    }
  };

  // Delete Task
  const deleteTask = async (taskId) => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId);
        if (error) throw error;
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        showToast('Tugas dihapus', 'info');
      } catch (err) {
        console.error('Error deleting task:', err);
        showToast('Gagal menghapus: ' + err.message, 'error');
      }
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast('Tugas dihapus', 'info');
    }
  };

  // Update User Profile
  const updateProfile = async (newProfileData) => {
    const updated = {
      ...userProfile,
      ...newProfileData,
      updated_at: new Date().toISOString()
    };

    setUserProfile(updated);

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('user_profile')
          .upsert({ ...updated, id: 'default_user' });

        if (error) throw error;
        showToast('Profil & Target Kuartal berhasil disimpan ke Supabase!', 'success');
      } catch (err) {
        console.error('Error updating profile in Supabase:', err);
        showToast('Gagal simpan ke Supabase: ' + err.message, 'error');
      }
    } else {
      showToast('Profil berhasil diperbarui (Mode Lokal)', 'success');
    }
  };

  // Group completed tasks into monthly archives
  const completedTasksByMonth = useMemo(() => {
    const map = {};
    tasks
      .filter((t) => t.is_completed)
      .forEach((t) => {
        const rawDate = t.completed_at || t.due_date;
        const monthKey = rawDate ? rawDate.substring(0, 7) : '2026-10';
        if (!map[monthKey]) {
          map[monthKey] = [];
        }
        map[monthKey].push(t);
      });
    return map;
  }, [tasks]);

  // Weekly Work Journal CRUD Operations (Connected directly to Agenda & Supabase)
  const addJournalEntry = async (entry) => {
    const entryId = entry.id || 'jnl-' + Date.now();
    const autoCat = categorizeFromTags(entry.tags, entry.summary, entry.notes);
    const tagsArr = Array.isArray(entry.tags)
      ? entry.tags
      : (entry.tags ? entry.tags.split(',').map((t) => t.trim()).filter(Boolean) : []);

    const newJournal = {
      id: entryId,
      date: entry.date,
      day_name: entry.day_name,
      week_number: parseInt(entry.week_number) || 3,
      month_key: entry.month_key || entry.date.substring(0, 7),
      hours_worked: parseFloat(entry.hours_worked) || 7,
      summary: entry.summary,
      notes: entry.notes || '',
      tags: tagsArr,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Linked Task for Agenda
    const taskId = 'task-jnl-' + entryId;
    const isCompleted = entry.is_completed !== false; // default true for completed daily work
    const linkedTask = {
      id: taskId,
      kpi_id: autoCat.kpi_id,
      category: autoCat.category,
      title: entry.summary,
      description: entry.notes
        ? `${entry.notes}\n\n[Otomatis dari Jurnal • Durasi: ${entry.hours_worked} Jam • Tag: ${tagsArr.join(', ') || '-'}]`
        : `[Otomatis dari Jurnal • Durasi: ${entry.hours_worked} Jam • Tag: ${tagsArr.join(', ') || '-'}]`,
      due_date: entry.date,
      is_completed: isCompleted,
      completed_at: isCompleted ? (entry.completed_at || new Date().toISOString()) : null,
      priority: 'medium',
      estimated_hours: parseFloat(entry.hours_worked) || 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Immediately update local state
    setJournalEntries((prev) => [newJournal, ...prev.filter((j) => j.id !== entryId)]);
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === taskId);
      const next = exists ? prev.map((t) => (t.id === taskId ? linkedTask : t)) : [linkedTask, ...prev];
      return next.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    });

    if (isCompleted) {
      triggerConfetti();
    }

    // Persist to Supabase
    if (isSupabaseConfigured()) {
      try {
        const { error: jErr } = await supabase.from('journal_entries').upsert(newJournal);
        if (jErr) console.error('Supabase journal upsert error:', jErr);

        const { error: tErr } = await supabase.from('tasks').upsert(linkedTask);
        if (tErr) console.error('Supabase linked task upsert error:', tErr);
      } catch (err) {
        console.error('Failed to sync journal/task to Supabase:', err);
      }
    }

    showToast(`Kerjaan tersimpan di Jurnal & otomatis muncul di Agenda (${autoCat.label})`, 'success');
  };

  const updateJournalEntry = async (id, updated) => {
    const autoCat = categorizeFromTags(updated.tags, updated.summary, updated.notes);
    const tagsArr = Array.isArray(updated.tags)
      ? updated.tags
      : (updated.tags ? updated.tags.split(',').map((t) => t.trim()).filter(Boolean) : []);

    const updatedJournal = {
      ...updated,
      id,
      tags: tagsArr,
      updated_at: new Date().toISOString()
    };

    const taskId = 'task-jnl-' + id;
    const isCompleted = updated.is_completed !== false;
    const linkedTaskUpdate = {
      kpi_id: autoCat.kpi_id,
      category: autoCat.category,
      title: updated.summary,
      description: updated.notes
        ? `${updated.notes}\n\n[Otomatis dari Jurnal • Durasi: ${updated.hours_worked} Jam • Tag: ${tagsArr.join(', ') || '-'}]`
        : `[Otomatis dari Jurnal • Durasi: ${updated.hours_worked} Jam • Tag: ${tagsArr.join(', ') || '-'}]`,
      due_date: updated.date,
      is_completed: isCompleted,
      completed_at: isCompleted ? (updated.completed_at || new Date().toISOString()) : null,
      estimated_hours: parseFloat(updated.hours_worked) || 2,
      updated_at: new Date().toISOString()
    };

    setJournalEntries((prev) => prev.map((j) => (j.id === id ? { ...j, ...updatedJournal } : j)));
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...linkedTaskUpdate } : t)));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('journal_entries').update(updatedJournal).eq('id', id);
        await supabase.from('tasks').update(linkedTaskUpdate).eq('id', taskId);
      } catch (err) {
        console.error('Failed to update journal/task in Supabase:', err);
      }
    }

    showToast('Catatan jurnal & agenda berhasil diperbarui', 'success');
  };

  const deleteJournalEntry = async (id) => {
    const taskId = 'task-jnl-' + id;
    setJournalEntries((prev) => prev.filter((j) => j.id !== id));
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('journal_entries').delete().eq('id', id);
        await supabase.from('tasks').delete().eq('id', taskId);
      } catch (err) {
        console.error('Failed to delete journal/task from Supabase:', err);
      }
    }

    showToast('Catatan jurnal & tugas agenda dihapus', 'info');
  };

  // Donation Progress CRUD Operations (Tabel Progres Penghimpunan Donasi)
  const updateDonationProgram = async (id, updatedFields) => {
    const updatedList = donationPrograms.map((p) =>
      p.id === id ? { ...p, ...updatedFields, updated_at: new Date().toISOString() } : p
    );
    setDonationPrograms(updatedList);
    localStorage.setItem('impactflow_donation_programs', JSON.stringify(updatedList));

    if (isSupabaseConfigured()) {
      try {
        const itemToUpdate = updatedList.find((p) => p.id === id);
        if (itemToUpdate) {
          await supabase.from('donation_progress').upsert(itemToUpdate);
        }
      } catch (e) {
        console.log('Supabase donation_progress update skipped:', e.message);
      }
    }
    showToast('Progres program donasi berhasil diperbarui', 'success');
  };

  const addDonationProgram = async (newProgram) => {
    const item = {
      id: 'prog-' + Date.now(),
      program: newProgram.program || 'Program Baru',
      target: parseFloat(newProgram.target) || 0,
      actual: parseFloat(newProgram.actual) || 0,
      notes: newProgram.notes || '',
      order_index: donationPrograms.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updatedList = [...donationPrograms, item];
    setDonationPrograms(updatedList);
    localStorage.setItem('impactflow_donation_programs', JSON.stringify(updatedList));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('donation_progress').upsert(item);
      } catch (e) {
        console.log('Supabase donation_progress add skipped:', e.message);
      }
    }
    showToast('Program donasi baru berhasil ditambahkan', 'success');
  };

  const deleteDonationProgram = async (id) => {
    const updatedList = donationPrograms.filter((p) => p.id !== id);
    setDonationPrograms(updatedList);
    localStorage.setItem('impactflow_donation_programs', JSON.stringify(updatedList));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('donation_progress').delete().eq('id', id);
      } catch (e) {
        console.log('Supabase donation_progress delete skipped:', e.message);
      }
    }
    showToast('Program donasi dihapus', 'info');
  };

  const saveAllDonationPrograms = async (newList) => {
    setDonationPrograms(newList);
    localStorage.setItem('impactflow_donation_programs', JSON.stringify(newList));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('donation_progress').upsert(newList);
      } catch (e) {
        console.log('Supabase donation_progress batch save skipped:', e.message);
      }
    }
    showToast('Tabel progres donasi berhasil disimpan!', 'success');
  };

  // Reset / Re-seed to Donor Retention Template
  const resetToRetentionTemplate = () => {
    setUserProfile(INITIAL_USER_PROFILE);
    setKpis(INITIAL_KPIS);
    setTasks(INITIAL_TASKS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setDonationPrograms(INITIAL_DONATION_PROGRAMS);
    localStorage.setItem('impactflow_version', 'v3_monthly_journal');
    localStorage.setItem('impactflow_profile', JSON.stringify(INITIAL_USER_PROFILE));
    localStorage.setItem('impactflow_kpis', JSON.stringify(INITIAL_KPIS));
    localStorage.setItem('impactflow_tasks', JSON.stringify(INITIAL_TASKS));
    localStorage.setItem('impactflow_journal', JSON.stringify(INITIAL_JOURNAL_ENTRIES));
    localStorage.setItem('impactflow_donation_programs', JSON.stringify(INITIAL_DONATION_PROGRAMS));
    showToast('Template Riset Retensi Donatur & Jurnal Mingguan berhasil dimuat!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        kpis,
        tasks,
        journalEntries,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        donationPrograms,
        updateDonationProgram,
        addDonationProgram,
        deleteDonationProgram,
        saveAllDonationPrograms,
        completedTasksByMonth,
        selectedHistoryMonth,
        setSelectedHistoryMonth,
        loading,
        syncStatus,
        activeTab,
        setActiveTab,
        progressMetrics,
        toggleTaskCompletion,
        addTask,
        updateTask,
        deleteTask,
        updateProfile,
        resetToRetentionTemplate,
        isTaskModalOpen,
        setIsTaskModalOpen,
        editingTask,
        setEditingTask,
        waModalTask,
        setWaModalTask,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
