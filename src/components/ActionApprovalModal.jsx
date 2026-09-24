import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Lock, 
  TrendingUp,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveAuditLog } from '../services/safetyAuditService';

export function ActionApprovalModal({ isOpen, onClose, actionData, onActionSuccess }) {
  if (!isOpen || !actionData) return null;

  const handleConfirm = () => {
    // Audit Log'a kaydet
    const logEntry = {
      actionType: actionData.action?.type || 'AI_ACTION',
      actionTitle: actionData.action?.label || actionData.title,
      target: actionData.product || actionData.sku || 'Genel Mağaza',
      marketplace: actionData.marketplace || 'Tüm Kanallar',
      oldValue: actionData.action?.payload?.oldPrice || 'Mevcut Durum',
      newValue: actionData.action?.payload?.newPrice || 'AI Optimize Edildi',
      estimatedImpact: actionData.q3_financialImpact || actionData.action?.payload?.estimatedSaving || 'Kâr İyileştirmesi',
      source: `AI Çalışanı (${actionData.id || 'Öneri'})`
    };

    saveAuditLog(logEntry);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onActionSuccess) {
      onActionSuccess(logEntry);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-scaleUp">
        
        {/* Başlık Alanı */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  Güvenlik Kapısı • Kullanıcı Onayı
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                AI Aksiyon Onay Protokolü
              </h3>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gövde */}
        <div className="p-6 space-y-5">
          
          {/* Bilgilendirme Notu */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Kritik Güvenlik İlkesi:</strong> AI E-Ticaret Çalışanı işletmenizin fiyatlarını, reklam bütçelerini veya stoklarını sizin açık onayınız olmadan <u>asla</u> kendiliğinden değiştirmez.
            </p>
          </div>

          {/* Uygulanacak Aksiyon Özeti */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Uygulanacak Operasyonel Değişiklik
            </div>

            <div className="text-sm font-black text-slate-900">
              {actionData.title || actionData.action?.label}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block">Kanal / Pazar Yeri:</span>
                <strong className="text-slate-800 font-bold">{actionData.marketplace}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Hedef Ürün / SKU:</span>
                <strong className="text-slate-800 font-bold truncate block">{actionData.product}</strong>
              </div>
            </div>

            {/* Tahmini Finansal Etki */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">Tahmini Net Finansal Kazanım:</span>
              </div>
              <span className="text-xs font-black text-emerald-700">
                {actionData.action?.payload?.estimatedSaving || actionData.q3_financialImpact?.slice(0, 40) || 'Pozitif Nakit'}
              </span>
            </div>
          </div>

          {/* Güvenlik & Denetim İzi */}
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Bu işlem onaylandığında <strong>Audit Log (Denetim Kaydı)</strong> sistemine işlenecektir.</span>
          </div>

        </div>

        {/* Alt Butonlar */}
        <div className="bg-slate-100 p-4 px-6 flex items-center justify-between border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all"
          >
            İptal Et / Değişikliği Reddet
          </button>

          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Onayla ve Pazar Yerine Uygula</span>
          </button>
        </div>

      </div>
    </div>
  );
}
