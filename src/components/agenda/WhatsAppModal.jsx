import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MessageSquare, 
  ExternalLink, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Calendar, 
  Code2, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { 
  generateWhatsAppUrl, 
  triggerWhatsAppWebhook, 
  formatIndonesianDate,
  formatWhatsAppNumber 
} from '../../lib/whatsapp';

export const WhatsAppModal = () => {
  const { waModalTask, setWaModalTask, userProfile, showToast } = useApp();
  const [loadingWebhook, setLoadingWebhook] = useState(false);
  const [webhookResult, setWebhookResult] = useState(null);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);

  if (!waModalTask) return null;

  const phone = formatWhatsAppNumber(userProfile?.whatsapp_number || '6281234567890');
  const formattedDate = formatIndonesianDate(waModalTask.due_date);

  // Handle Option A: Open wa.me link directly
  const handleOpenWaDirect = () => {
    const url = generateWhatsAppUrl(waModalTask, userProfile);
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('Membuka tautan WhatsApp...', 'info');
    setWaModalTask(null);
  };

  // Handle Option B: Dispatch to Supabase Edge Function / Webhook
  const handleTriggerWebhook = async () => {
    setLoadingWebhook(true);
    setWebhookResult(null);

    const res = await triggerWhatsAppWebhook(waModalTask, userProfile);
    setLoadingWebhook(false);
    setWebhookResult(res);

    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-growth-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-growth-600 text-white shadow-sm">
              <MessageSquare className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Pengingat WhatsApp R&D
              </h3>
              <p className="text-xs text-slate-500">
                Kirim reminder tenggat waktu tugas penelitian
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setWaModalTask(null);
              setWebhookResult(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {/* Target Info */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-growth-600" />
              <span className="text-slate-500">Nomor Tujuan:</span>
              <span className="font-bold text-slate-900">+{phone}</span>
            </div>
            <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
              {userProfile?.full_name}
            </span>
          </div>

          {/* Task Preview Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-400 mb-1">
              <span>Task #{waModalTask.id.toString().substring(0, 8)}</span>
              <span>•</span>
              <span className="text-growth-600">{waModalTask.category}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">{waModalTask.title}</h4>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Tenggat: <strong className="text-slate-800">{formattedDate}</strong></span>
            </div>
          </div>

          {/* WhatsApp Message Preview Bubble */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Pratinjau Pesan WhatsApp:
            </label>
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/60 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
              {`🔔 *REMINDER R&D YAYASAN*
Halo ${userProfile?.full_name || 'R&D Manager'},
Mohon tindak lanjuti agenda penelitian berikut:

📋 *Tugas:* ${waModalTask.title}
🏷️ *LogFrame:* ${waModalTask.category.toUpperCase()}
⏰ *Tenggat Waktu:* ${formattedDate}
⏳ *Estimasi:* ${waModalTask.estimated_hours || 1} Jam Kerja

Semangat mencapai target kuartal ini! 🚀
_${userProfile?.foundation_name}_`}
            </div>
          </div>

          {/* Webhook Status Banner */}
          {webhookResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              webhookResult.success 
                ? 'bg-growth-50 border-growth-200 text-growth-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {webhookResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-growth-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{webhookResult.message}</p>
                {webhookResult.mode === 'mock' && (
                  <p className="text-[11px] text-growth-700/80 mt-0.5">
                    Mode simulasi aktif. Untuk pengiriman pesan nyata otomatis, tautkan URL Supabase Edge Function di .env.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Two Distinct Integration Options */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* OPTION A: Frontend wa.me */}
            <button
              onClick={handleOpenWaDirect}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-growth-500 bg-growth-50 hover:bg-growth-100/80 text-growth-800 transition text-center group active:scale-95"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <span>Option A: Buka wa.me</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </div>
              <span className="text-[10px] text-growth-700/80 mt-1">
                Langsung buka aplikasi WhatsApp dengan pesan terisi
              </span>
            </button>

            {/* OPTION B: Backend Edge Function Webhook */}
            <button
              onClick={handleTriggerWebhook}
              disabled={loadingWebhook}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 bg-slate-900 hover:bg-slate-800 text-white transition text-center group active:scale-95 disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                {loadingWebhook ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Option B: Trigger Webhook</span>
              </div>
              <span className="text-[10px] text-slate-300 mt-1">
                Kirim via Supabase Edge Function / Twilio API
              </span>
            </button>

          </div>

          {/* Toggle Architecture Snippet for Option B */}
          <div className="pt-1 text-center">
            <button
              onClick={() => setShowCodeSnippet(!showCodeSnippet)}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showCodeSnippet ? 'Sembunyikan Arsitektur Edge Function' : 'Lihat Arsitektur Supabase Edge Function'}</span>
            </button>
          </div>

          {showCodeSnippet && (
            <div className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-40">
              <p className="text-slate-400">// Supabase Edge Function: /functions/send-whatsapp-reminder/index.ts</p>
              <p className="text-growth-400">import {'{'} serve {'}'} from "https://deno.land/std@0.168.0/http/server.ts";</p>
              <p>serve(async (req) =&gt; {'{'}</p>
              <p>  const {'{'} phone, task_title, due_date {'}'} = await req.json();</p>
              <p>  // Call Twilio / Wablas / Meta Cloud API here</p>
              <p>  return new Response(JSON.stringify({'{'} sent: true {'}'}), {'{'} headers: {'{'} "Content-Type": "application/json" {'}'} {'}'});</p>
              <p>{'}'});</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
