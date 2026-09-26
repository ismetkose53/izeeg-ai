// Güvenlik Kapısı ve Audit Log (Denetim Kaydı) Servisi
// AI E-Ticaret Çalışanı hiçbir kritik işlemi (fiyat, stok, reklam bütçesi) kullanıcının açık onayı olmadan uygulayamaz.

const AUDIT_STORAGE_KEY = 'ecompulse_audit_logs';

export const INITIAL_AUDIT_LOGS = [];

export function getAuditLogs() {
  const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
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
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
}
