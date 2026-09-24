// Güvenlik Kapısı ve Audit Log (Denetim Kaydı) Servisi
// AI E-Ticaret Çalışanı hiçbir kritik işlemi (fiyat, stok, reklam bütçesi) kullanıcının açık onayı olmadan uygulayamaz.

const AUDIT_STORAGE_KEY = 'ecompulse_audit_logs';

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-1049',
    timestamp: '21.09.2026 14:15',
    actionType: 'PRICE_UPDATE',
    actionTitle: 'Birim Satış Fiyatı Artışı',
    target: 'Hakiki Deri Erkek Klasik Cüzdan (Siyah)',
    marketplace: 'Trendyol',
    oldValue: '289,90 ₺',
    newValue: '329,90 ₺',
    estimatedImpact: '+7.722 ₺/ay Net Nakit Girişi',
    status: 'APPROVED',
    approvedBy: 'Mağaza Sahibi (Onaylandı)',
    source: 'AI Çalışanı Önerisi #104'
  },
  {
    id: 'LOG-1048',
    timestamp: '20.09.2026 18:30',
    actionType: 'AD_BUDGET_REDUCE',
    actionTitle: 'Reklam Bütçesi Optimizasyonu (%30 Kısma)',
    target: 'Kablosuz Bluetooth Kulaklık Pro',
    marketplace: 'Trendyol Reklamları',
    oldValue: '650 ₺ / gün',
    newValue: '455 ₺ / gün',
    estimatedImpact: 'Aylık ~5.850 ₺ Boşa Reklam Kaçağı Önlendi',
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
    marketplace: 'Trendyol & Hepsiburada',
    oldValue: '4-5 Desi Fatura',
    newValue: '2-3 Desi Düzeltme Talebi',
    estimatedImpact: '+67,68 ₺ İade Alındı',
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
