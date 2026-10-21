/**
 * WhatsApp Integration Utilities
 * Supports Option A (Direct Frontend wa.me deep-link)
 * and Option B (Backend Webhook / Supabase Edge Function)
 */

export const formatWhatsAppNumber = (phone) => {
  if (!phone) return '';
  // Remove non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  // If starts with 08..., replace leading 0 with 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return cleaned;
};

export const formatIndonesianDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

/**
 * Option A: Generates pre-filled wa.me URL
 */
export const generateWhatsAppUrl = (task, userProfile) => {
  const phone = formatWhatsAppNumber(userProfile?.whatsapp_number || '6281234567890');
  const formattedDate = formatIndonesianDate(task.due_date);
  const categoryLabel = task.category?.toUpperCase() || 'R&D TASK';

  const message = `🔔 *REMINDER R&D YAYASAN*
Halo ${userProfile?.full_name || 'R&D Manager'},
Mohon tindak lanjuti agenda penelitian berikut:

📋 *Tugas:* ${task.title}
🏷️ *LogFrame:* ${categoryLabel} (Ref: ${task.kpi_id || 'Umum'})
⏰ *Tenggat Waktu:* ${formattedDate}
⏳ *Estimasi:* ${task.estimated_hours || 1} Jam Kerja
${task.description ? `📝 *Catatan:* ${task.description}\n` : ''}
Semangat mencapai target kuartal ini! 🚀
_${userProfile?.foundation_name || 'Philanthropy Foundation'}_`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

/**
 * Option B: Trigger Supabase Edge Function or external API Webhook (Twilio / Wablas / Meta Cloud API)
 */
export const triggerWhatsAppWebhook = async (task, userProfile) => {
  const webhookUrl = import.meta.env.VITE_WA_WEBHOOK_URL;
  const payload = {
    phone: formatWhatsAppNumber(userProfile?.whatsapp_number || '6281234567890'),
    recipient_name: userProfile?.full_name || 'R&D Manager',
    foundation: userProfile?.foundation_name || 'Yayasan',
    task_id: task.id,
    task_title: task.title,
    task_category: task.category,
    due_date: task.due_date,
    estimated_hours: task.estimated_hours,
    timestamp: new Date().toISOString()
  };

  // If webhook is not configured or in sandbox mode, simulate successful trigger
  if (!webhookUrl || webhookUrl.includes('your-project')) {
    console.log('[Mock Webhook] WhatsApp dispatch payload:', payload);
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 800));
    return {
      success: true,
      mode: 'mock',
      message: `[Simulasi Webhook] Pesan WhatsApp otomatis ke +${payload.phone} berhasil dikirim ke antrean pengiriman.`
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      mode: 'live',
      data,
      message: `Pesan WhatsApp berhasil dikirim via Supabase Edge Function!`
    };
  } catch (error) {
    console.error('Failed to trigger WhatsApp Webhook:', error);
    return {
      success: false,
      error: error.message,
      message: `Gagal memanggil webhook: ${error.message}. Anda tetap bisa menggunakan tautan langsung WhatsApp (Option A).`
    };
  }
};
