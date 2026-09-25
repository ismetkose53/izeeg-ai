// Güvenlik Kapısı ve Audit Log (Denetim Kaydı) Servisi
// AI E-Ticaret Çalışanı hiçbir kritik işlemi (fiyat, stok, reklam bütçesi) kullanıcının açık onayı olmadan uygulayamaz.

const AUDIT_STORAGE_KEY = 'ecompulse_audit_logs';

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-1049',
    timestamp: '21.09.2026 14:15',
    actionType: 'PRICE_UPDATE',
    actionTitle: 'Birim Satış Fiyatı Artışı',
    target: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
    marketplace: 'Trendyol',
    oldValue: '1.950,00 ₺',
    newValue: '2.090,00 ₺',
    estimatedImpact: '+14.200 ₺/ay Net Nakit Girişi',
    status: 'APPROVED',
    approvedBy: 'Mağaza Sahibi (Onaylandı)',
    source: 'AI Çalışanı Önerisi #104'
  },
  {
    id: 'LOG-1048',
    timestamp: '20.09.2026 18:30',
    actionType: 'AD_BUDGET_REDUCE',
    actionTitle: 'Reklam Bütçesi Optimizasyonu (%35 Kısma)',
    target: 'Dökümlü Saten Midi Elbise (Zümrüt Yeşili)',
    marketplace: 'Trendyol Reklamları',
    oldValue: '485 ₺ / gün',
    newValue: '315 ₺ / gün',
    estimatedImpact: 'Aylık ~5.100 ₺ Boşa Reklam Kaçağı Önlendi',
    status: 'APPROVED',
    approvedBy: 'Mağaza Yöneticisi',
    source: 'AI Çalışanı Anomali Tespiti'
  },
  {
    id: 'LOG-1047',
    timestamp: '19.09.2026 11:00',
    actionType: 'CARGO_CLAIM_FILED',
    actionTitle: 'Desi İtiraz Dilekçesi İletildi',
    target: '3 Sipariş (TY-9480851, TY-9479901, HB-7690122)',
    marketplace: 'Trendyol Express',
    oldValue: '4-5 Desi Fatura',
    newValue: '1-2 Desi Düzeltme Talebi',
    estimatedImpact: '+124,50 ₺ İade Alındı',
    status: 'COMPLETED',
    approvedBy: 'Otomatik İtiraz Formu',
    source: 'Kargo Desi Denetçisi'
  }
];

export function getAuditLogs() {
  const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Audit log yükleme hatası:", e);
    }
  }
  return INITIAL_AUDIT_LOGS;
}

export function saveAuditLog(logEntry) {
  const current = getAuditLogs();
  const newEntry = {
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    status: 'APPROVED',
    approvedBy: 'Mağaza Yöneticisi',
    ...logEntry
  };
  const updated = [newEntry, ...current];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
