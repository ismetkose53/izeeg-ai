import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  CreditCard, 
  Building, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Save, 
  Plus, 
  Sparkles, 
  Key, 
  TrendingUp, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Check, 
  RefreshCw,
  Eye,
  Lock,
  Smartphone,
  Flame,
  UserCheck,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getBankSettings, 
  saveBankSettings, 
  getShopierSettings, 
  saveShopierSettings, 
  getUsersDb, 
  saveUsersDb, 
  getPaymentNotifications, 
  approvePaymentNotification, 
  extendUserSubscription, 
  toggleUserStatus, 
  getAdminFinancialStats,
  getContactLeads,
  toggleLeadStatus,
  toggleUserAddon
} from '../services/adminSettingsService';
import { IzeegLogo } from './IzeegLogo';

export function AdminSuperPanel({ onToast, onImpersonateUser }) {
  const [activeAdminTab, setActiveAdminTab] = useState('settings'); // 'settings' | 'users' | 'payments' | 'leads'
  
  // Ayar State'leri
  const [bankSettings, setBankSettings] = useState(getBankSettings());
  const [shopierSettings, setShopierSettings] = useState(getShopierSettings());
  
  // Veritabanı State'leri
  const [users, setUsers] = useState(getUsersDb());
  const [payments, setPayments] = useState(getPaymentNotifications());
  const [leads, setLeads] = useState(getContactLeads());
  const [stats, setStats] = useState(getAdminFinancialStats());
  
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Verileri Yenile
  const refreshAll = () => {
    setBankSettings(getBankSettings());
    setShopierSettings(getShopierSettings());
    setUsers(getUsersDb());
    setPayments(getPaymentNotifications());
    setLeads(getContactLeads());
    setStats(getAdminFinancialStats());
  };

  // Banka & Shopier Ayarlarını Kaydet
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    saveBankSettings(bankSettings);
    saveShopierSettings(shopierSettings);
    
    setTimeout(() => {
      setIsSaving(false);
      if (onToast) onToast("✅ Banka IBAN ve Shopier linkleri başarıyla kaydedildi! Abonelik ekranına anında yansıdı.");
      confetti({ particleCount: 70, spread: 60 });
    }, 400);
  };

  // Havale Bildirimini Onayla
  const handleApprovePayment = (notifId, userId) => {
    approvePaymentNotification(notifId, 30);
    refreshAll();
    if (onToast) onToast(`🎉 Ödeme onaylandı! Müşterinin lisansı +30 gün uzatıldı.`);
    confetti({ particleCount: 100, spread: 70 });
  };

  // Kullanıcıya Manuel Gün Ekle (+30 Gün veya +7 Gün)
  const handleAddDaysToUser = (userId, days) => {
    extendUserSubscription(userId, days);
    refreshAll();
    if (onToast) onToast(`✅ Kullanıcıya +${days} gün lisans süresi eklendi.`);
  };

  // Kullanıcıyı Dondur / Aç
  const handleToggleUser = (userId) => {
    toggleUserStatus(userId);
    refreshAll();
    if (onToast) onToast(`Durum güncellendi.`);
  };

  const filteredUsers = users.filter(u => 
    u.storeName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.ownerName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16 animate-fadeIn font-sans">
      
      {/* 1. ÜST BAŞLIK VE METRİKLER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 lg:p-8 rounded-3xl border border-slate-700 shadow-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-black border border-amber-500/30 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> SÜPER YÖNETİCİ & KURUCU MODU
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            izeeg Yönetim & Finans Kontrol Merkezi
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            IBAN bilgilerinizi güncelleyin, Shopier mağaza linklerinizi bağlayın, kayıtlı satıcıların lisans sürelerini yönetin ve gelen havaleleri tek tıkla onaylayın.
          </p>
        </div>

        {/* Canlı Sayaçlar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl text-center">
            <div className="text-[11px] text-slate-400 font-bold uppercase">Aylık Düzenli Gelir (MRR)</div>
            <div className="text-lg font-black text-emerald-400 mt-0.5 font-mono">{stats.mrr.toLocaleString('tr-TR')} ₺</div>
            <span className="text-[10px] text-slate-400">Yıllık ARR: {(stats.arr).toLocaleString('tr-TR')} ₺</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl text-center">
            <div className="text-[11px] text-slate-400 font-bold uppercase">Aktif Abone / Deneme</div>
            <div className="text-lg font-black text-amber-400 mt-0.5 font-mono">{stats.activeSubscribers} <span className="text-xs text-slate-300">/ {stats.trialUsers} Deneme</span></div>
            <span className="text-[10px] text-slate-400">Toplam: {stats.totalUsers} Mağaza</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl text-center col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-400 font-bold uppercase">Bekleyen Havale</div>
            <div className={`text-lg font-black mt-0.5 font-mono ${stats.pendingPaymentsCount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
              {stats.pendingPaymentsCount} Adet
            </div>
            <span className="text-[10px] text-slate-400">Onay Bekliyor</span>
          </div>
        </div>
      </div>

      {/* 2. SEKME BUTONLARI */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeAdminTab === 'settings'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4 text-[#FF6000]" />
          <span>🏦 IBAN & Shopier Ayarları</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('payments')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 relative ${
            activeAdminTab === 'payments'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-500" />
          <span>💸 Havale / EFT Bildirimleri</span>
          {stats.pendingPaymentsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {stats.pendingPaymentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeAdminTab === 'users'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-500" />
          <span>👥 Kullanıcılar & Lisans Yönetimi ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('leads')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 relative ${
            activeAdminTab === 'leads'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PhoneCall className="w-4 h-4 text-emerald-600" />
          <span>📞 Gelen Arama Talepleri ({leads.length})</span>
          {stats.newLeadsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
              {stats.newLeadsCount}
            </span>
          )}
        </button>
      </div>

      {/* SEKME 1: IBAN VE SHOPIER AYARLARI FORMU */}
      {activeAdminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* SOL KART: BANKA & IBAN BİLGİLERİ */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF6000] flex items-center justify-center font-black">
                    🏦
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Banka FAST & IBAN Bilgileriniz</h3>
                    <p className="text-[11px] text-slate-500">Müşteriler havale seçtiğinde bu hesap bilgilerini görür.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  %0 Komisyonlu
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Banka Adı</label>
                  <input
                    type="text"
                    value={bankSettings.bankName}
                    onChange={(e) => setBankSettings({ ...bankSettings, bankName: e.target.value })}
                    placeholder="Örn: Ziraat Bankası, Garanti BBVA, İş Bankası..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hesap Sahibi (Alıcı Adı Soyadı)</label>
                  <input
                    type="text"
                    value={bankSettings.accountHolder}
                    onChange={(e) => setBankSettings({ ...bankSettings, accountHolder: e.target.value })}
                    placeholder="Örn: İsmet Köse"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">IBAN Numarası</label>
                  <input
                    type="text"
                    value={bankSettings.iban}
                    onChange={(e) => setBankSettings({ ...bankSettings, iban: e.target.value })}
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Şube Kodu / Adı</label>
                    <input
                      type="text"
                      value={bankSettings.branchCode}
                      onChange={(e) => setBankSettings({ ...bankSettings, branchCode: e.target.value })}
                      placeholder="1048 - Merkez"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Havale İndirim Oranı (%)</label>
                    <input
                      type="number"
                      value={bankSettings.discountRateHavale}
                      onChange={(e) => setBankSettings({ ...bankSettings, discountRateHavale: Number(e.target.value) })}
                      placeholder="15"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">FAST / Kolay Adres (İsteğe Bağlı)</label>
                  <input
                    type="text"
                    value={bankSettings.fastEasyAddress}
                    onChange={(e) => setBankSettings({ ...bankSettings, fastEasyAddress: e.target.value })}
                    placeholder="0555 123 45 67 (Telefon / E-posta)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Havale Açıklama Kuralı / Talimatı</label>
                  <textarea
                    rows={2}
                    value={bankSettings.paymentNoteInstructions}
                    onChange={(e) => setBankSettings({ ...bankSettings, paymentNoteInstructions: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                  />
                </div>
              </div>
            </div>

            {/* SAĞ KART: SHOPIER KREDİ KARTI LİNKLERİ */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                    💳
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Shopier Kredi Kartı Ödeme Linkleri</h3>
                    <p className="text-[11px] text-slate-500">Müşterinin kartla satın alacağı Shopier ürün linkleriniz.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  3D Secure Kart
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Standart Paket Aylık Shopier Linki</label>
                  <input
                    type="text"
                    value={shopierSettings.standardMonthlyUrl}
                    onChange={(e) => setShopierSettings({ ...shopierSettings, standardMonthlyUrl: e.target.value })}
                    placeholder="https://www.shopier.com/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Standart Paket Yıllık Shopier Linki (%20 İndirimli)</label>
                  <input
                    type="text"
                    value={shopierSettings.standardAnnualUrl}
                    onChange={(e) => setShopierSettings({ ...shopierSettings, standardAnnualUrl: e.target.value })}
                    placeholder="https://www.shopier.com/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Amazon Entegrasyonu Ek Paket Shopier Linki (+249 ₺)</label>
                  <input
                    type="text"
                    value={shopierSettings.addonAmazonUrl}
                    onChange={(e) => setShopierSettings({ ...shopierSettings, addonAmazonUrl: e.target.value })}
                    placeholder="https://www.shopier.com/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Sovos / E-Fatura Ek Paket Linki (+149 ₺)</label>
                  <input
                    type="text"
                    value={shopierSettings.addonSovosUrl}
                    onChange={(e) => setShopierSettings({ ...shopierSettings, addonSovosUrl: e.target.value })}
                    placeholder="https://www.shopier.com/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp Hızlı Dekont & Destek Hattı Numarası</label>
                  <input
                    type="text"
                    value={bankSettings.whatsappSupportNumber}
                    onChange={(e) => setBankSettings({ ...bankSettings, whatsappSupportNumber: e.target.value })}
                    placeholder="905551234567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KAYDET BUTONU */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3.5 bg-gradient-to-r from-[#FF6000] to-[#FF3D00] hover:from-[#e55600] hover:to-[#e03600] text-white rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Kaydediliyor...' : 'Tüm Ödeme & IBAN Ayarlarını Kaydet'}</span>
            </button>
          </div>
        </form>
      )}

      {/* SEKME 2: HAVALE / FAST BİLDİRİMLERİ ONAY MASASI */}
      {activeAdminTab === 'payments' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Gelen Havale / FAST Ödeme Bildirimleri</h3>
              <p className="text-xs text-slate-500">
                Müşterilerin bankadan gönderip panelden bildirdiği ödemeleri inceleyin ve tek tıkla onaylayın.
              </p>
            </div>
            <button
              onClick={refreshAll}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Yenile
            </button>
          </div>

          {payments.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">Bekleyen Havale Bildirimi Yok</h4>
              <p className="text-xs text-slate-500">Müşteriler ödeme bildirimi yaptığında anında burada listelenir.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Bildirim No / Tarih</th>
                    <th className="p-3">Mağaza & Müşteri</th>
                    <th className="p-3">Seçilen Paket</th>
                    <th className="p-3 text-right">Tutar</th>
                    <th className="p-3">Referans Kodu & Dekont Notu</th>
                    <th className="p-3 text-center">Durum</th>
                    <th className="p-3 text-right">Hızlı Aksiyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map(pay => (
                    <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <span className="font-mono font-bold text-slate-900 block">{pay.id}</span>
                        <span className="text-[10px] text-slate-400">{pay.date}</span>
                      </td>

                      <td className="p-3">
                        <strong className="text-slate-900 block font-bold">{pay.userStore}</strong>
                        <span className="text-[11px] text-slate-500">{pay.userName} • {pay.senderBank}</span>
                      </td>

                      <td className="p-3 font-medium text-slate-800">
                        {pay.planSelected}
                      </td>

                      <td className="p-3 text-right font-mono font-black text-emerald-700 text-sm">
                        {pay.amount.toLocaleString('tr-TR')} ₺
                      </td>

                      <td className="p-3">
                        <span className="font-mono font-bold text-[#FF6000] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {pay.referenceCode}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1 italic max-w-xs truncate">{pay.slipNote}</p>
                      </td>

                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pay.status === 'APPROVED' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {pay.status === 'APPROVED' ? 'Onaylandı' : 'Bekliyor'}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        {pay.status === 'PENDING' ? (
                          <button
                            onClick={() => handleApprovePayment(pay.id, pay.userId)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Ödemeyi Onayla (+30 Gün Aç)</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold">Lisans Aktif Edildi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SEKME 3: KULLANICI & LİSANS YÖNETİMİ TABLOSU */}
      {activeAdminTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Kayıtlı Mağazalar & Lisans Durumları</h3>
              <p className="text-xs text-slate-500">Müşterilerinize hediye gün verin, üyeliklerini uzatın veya hesaplarını dondurun.</p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                placeholder="Mağaza, İsim veya E-posta Ara..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Kullanıcı ID & Mağaza</th>
                  <th className="p-3">İletişim</th>
                  <th className="p-3">Paket & Eklentiler</th>
                  <th className="p-3 text-center">Kalan Gün</th>
                  <th className="p-3 text-center">Durum</th>
                  <th className="p-3 text-right">Lisans Müdahalesi & Hediye</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <strong className="text-slate-900 block font-bold text-sm">{u.storeName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{u.id} • {u.ownerName}</span>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-800 font-medium">{u.email}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{u.phone}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{u.planName}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 mb-0.5">Tanımlı Modüller (Tıkla Aç/Kapat):</div>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { id: 'amazon', label: '🟡 Amazon SP-API' },
                          { id: 'n11', label: '🔴 N11' },
                          { id: 'shopify', label: '🟢 Shopify' },
                          { id: 'ciceksepeti', label: '🌸 Çiçeksepeti' },
                          { id: 'meta-ads', label: '📊 Meta Ads' }
                        ].map(addon => {
                          const isAssigned = (u.activeAddons || []).includes(addon.id);
                          return (
                            <button
                              key={addon.id}
                              onClick={() => {
                                toggleUserAddon(u.id, addon.id);
                                refreshAll();
                                if (onToast) onToast(`${u.storeName} için ${addon.label} lisansı ${isAssigned ? 'kaldırıldı' : 'tanımlandı (AÇILDI)'}!`);
                                confetti({ particleCount: 50, spread: 50 });
                              }}
                              className={`text-[10px] font-black px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 border ${
                                isAssigned 
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs' 
                                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200 opacity-60'
                              }`}
                              title={`${addon.label} lisansını ${isAssigned ? 'Kapat' : 'Aç'}`}
                            >
                              <span>{addon.label}</span>
                              <span className="text-[9px] font-mono">{isAssigned ? '✓ Açık' : '+ Kapalı'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <span className="text-base font-black font-mono text-slate-900 block">
                        {u.daysRemaining} Gün
                      </span>
                      <span className="text-[10px] text-slate-400">Bitiş: {u.paidUntil}</span>
                    </td>

                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        u.status === 'ACTIVE' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : u.status === 'TRIAL'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.status === 'ACTIVE' ? 'Aktif Abone' : u.status === 'TRIAL' ? 'Denemede' : 'Donduruldu'}
                      </span>
                    </td>

                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleAddDaysToUser(u.id, 7)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all"
                        title="7 Gün Hediye Deneme Ver"
                      >
                        +7 Gün
                      </button>

                      <button
                        onClick={() => handleAddDaysToUser(u.id, 30)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                        title="1 Aylık Lisans Ekle"
                      >
                        +30 Gün
                      </button>

                      <button
                        onClick={() => handleToggleUser(u.id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                      >
                        {u.status === 'ACTIVE' ? 'Dondur' : 'Aktif Et'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEKME 4: GELEN ARAMA VE İLETİŞİM TALEPLERİ (LEADS) */}
      {activeAdminTab === 'leads' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                📞
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Gelen Arama ve İletişim Talepleri</h3>
                <p className="text-[11px] text-slate-500">Müşterilerin web sitesi iletişim ve 'Biz Sizi Arayalım' formundan gönderdiği talepler.</p>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-600">
              Toplam <strong>{leads.length}</strong> Talep ({leads.filter(l => l.status === 'NEW').length} Yeni)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Ad Soyad & Mağaza</th>
                  <th className="p-3">Telefon Numarası</th>
                  <th className="p-3">Talep Konusu & Mesaj</th>
                  <th className="p-3 text-center">Tarih</th>
                  <th className="p-3 text-center">Durum</th>
                  <th className="p-3 text-right">Doğrudan İletişim & Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <strong className="text-slate-900 block font-bold text-sm">{lead.fullName}</strong>
                      <span className="text-[11px] text-slate-500">{lead.storeName}</span>
                    </td>

                    <td className="p-3">
                      <a 
                        href={`tel:${lead.phone.replace(/\s+/g, '')}`} 
                        className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lead.phone}</span>
                      </a>
                    </td>

                    <td className="p-3 max-w-xs">
                      <span className="inline-block text-[10px] font-bold bg-orange-100 text-[#FF6000] px-2 py-0.5 rounded-full mb-1">
                        {lead.subject}
                      </span>
                      <p className="text-slate-600 text-[11px] line-clamp-2">{lead.message}</p>
                    </td>

                    <td className="p-3 text-center text-slate-500 font-mono text-[11px]">
                      {lead.date}
                    </td>

                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        lead.status === 'NEW'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {lead.status === 'NEW' ? 'Yeni Talep' : 'Görüşüldü'}
                      </span>
                    </td>

                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      {/* WhatsApp'tan Doğrudan Yaz */}
                      <a
                        href={`https://wa.me/90${lead.phone.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(`Merhaba ${lead.fullName}, izeeg AI e-ticaret yönetim sistemi üzerinden bıraktığınız arama talebi için ulaşıyorum.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                        title="WhatsApp'tan Yaz"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Durum Değiştir */}
                      <button
                        onClick={() => {
                          toggleLeadStatus(lead.id);
                          refreshAll();
                          if (onToast) onToast(`Talep durumu güncellendi.`);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                      >
                        {lead.status === 'NEW' ? 'Görüşüldü Yap' : 'Yeni Yap'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminSuperPanel;
