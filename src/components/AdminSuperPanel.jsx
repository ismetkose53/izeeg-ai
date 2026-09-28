import React, { useState, useEffect, useMemo } from 'react';
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
  Unlock,
  Smartphone,
  Flame,
  UserCheck,
  PhoneCall,
  MessageSquare,
  Trash2,
  AlertTriangle,
  UserPlus,
  ShieldCheck,
  Zap,
  Activity,
  Server
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getBankSettings, 
  saveBankSettings, 
  getShopierSettings, 
  saveShopierSettings, 
  getUsersDb, 
  saveUsersDb, 
  fetchLiveUsersFromCloud,
  getPaymentNotifications, 
  fetchPaymentNotificationsFromCloud,
  approvePaymentNotification, 
  extendUserSubscription, 
  toggleUserStatus, 
  getAdminFinancialStats,
  getContactLeads,
  fetchContactLeadsFromCloud,
  toggleLeadStatus,
  toggleUserAddon,
  adminDeleteUserAsync,
  adminCreateUserAsync,
  updateUserPlanAsync
} from '../services/adminSettingsService';
import { IzeegLogo } from './IzeegLogo';

export function AdminSuperPanel({ onToast, onImpersonateUser }) {
  const [activeAdminTab, setActiveAdminTab] = useState('users'); // 'users' | 'payments' | 'leads' | 'settings'
  const [userStatusFilter, setUserStatusFilter] = useState('ALL'); // 'ALL' | 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'ADMIN'
  
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
  const [isRefreshingCloud, setIsRefreshingCloud] = useState(false);

  // Yeni Kullanıcı Ekleme Modalı State'leri
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    plan: 'TRIAL',
    daysRemaining: 7,
    activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
  });

  // Özel Gün Ekleme Prompt State'i
  const [customDaysUserId, setCustomDaysUserId] = useState(null);
  const [customDaysValue, setCustomDaysValue] = useState(30);

  // Verileri Buluttan ve Yerelden Yenile
  const refreshAll = async () => {
    setIsRefreshingCloud(true);
    setBankSettings(getBankSettings());
    setShopierSettings(getShopierSettings());

    try {
      const [cloudUsers, cloudPayments, cloudLeads] = await Promise.all([
        fetchLiveUsersFromCloud(),
        fetchPaymentNotificationsFromCloud(),
        fetchContactLeadsFromCloud()
      ]);

      if (cloudUsers) setUsers(cloudUsers);
      if (cloudPayments) setPayments(cloudPayments);
      if (cloudLeads) setLeads(cloudLeads);
      setStats(getAdminFinancialStats());
    } catch (e) {
      console.warn("Cloud refresh notice:", e);
    } finally {
      setIsRefreshingCloud(false);
    }
  };

  // İlk yüklemede buluttan canlı kullanıcıları ve talepleri çek
  useEffect(() => {
    refreshAll();
  }, []);

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
  const handleApprovePayment = async (notifId, userId) => {
    await approvePaymentNotification(notifId, 30);
    await refreshAll();
    if (onToast) onToast(`🎉 Ödeme onaylandı! Müşterinin lisansı +30 gün uzatıldı.`);
    confetti({ particleCount: 100, spread: 70 });
  };

  // Kullanıcıya Manuel Gün Ekle (+7, +30 veya Özel Gün)
  const handleAddDaysToUser = async (userId, days) => {
    await extendUserSubscription(userId, days);
    await refreshAll();
    if (onToast) onToast(`✅ Kullanıcıya +${days} gün lisans süresi başarıyla eklendi.`);
    confetti({ particleCount: 60, spread: 60 });
  };

  // Kullanıcıyı Dondur / Aç
  const handleToggleUser = async (userId) => {
    await toggleUserStatus(userId);
    await refreshAll();
    if (onToast) onToast(`Kullanıcı hesap durumu güncellendi.`);
  };

  // Kullanıcı Paketini Değiştir
  const handleChangePlan = async (userId, newPlan) => {
    await updateUserPlanAsync(userId, newPlan);
    await refreshAll();
    if (onToast) onToast(`✅ Paket ${newPlan} olarak güncellendi.`);
  };

  // Kullanıcıyı Sil
  const handleDeleteUser = async (userId, storeName) => {
    if (window.confirm(`"${storeName}" mağazasını ve tüm verilerini silmek istediğinize emin misiniz?`)) {
      await adminDeleteUserAsync(userId);
      await refreshAll();
      if (onToast) onToast(`🗑️ ${storeName} mağaza hesabı silindi.`);
    }
  };

  // Yeni Kullanıcı Oluştur
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUserForm.email) {
      alert("Lütfen e-posta adresini giriniz.");
      return;
    }

    await adminCreateUserAsync(newUserForm);
    setIsCreateUserModalOpen(false);
    setNewUserForm({
      storeName: '',
      ownerName: '',
      email: '',
      phone: '',
      plan: 'TRIAL',
      daysRemaining: 7,
      activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
    });
    await refreshAll();
    if (onToast) onToast(`🎉 Yeni satıcı hesabı oluşturuldu ve buluta kaydedildi.`);
    confetti({ particleCount: 90, spread: 70 });
  };

  // Kullanıcı Filtreleme
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Durum Filtresi
      if (userStatusFilter === 'TRIAL' && u.status !== 'TRIAL' && u.plan !== 'TRIAL') return false;
      if (userStatusFilter === 'ACTIVE' && (u.status !== 'ACTIVE' || u.plan === 'TRIAL' || u.role === 'admin')) return false;
      if (userStatusFilter === 'SUSPENDED' && u.status !== 'SUSPENDED') return false;
      if (userStatusFilter === 'ADMIN' && u.role !== 'admin') return false;

      // Arama Sorgusu
      if (searchUserQuery.trim()) {
        const query = searchUserQuery.toLowerCase();
        const matchStore = String(u.storeName || '').toLowerCase().includes(query);
        const matchOwner = String(u.ownerName || '').toLowerCase().includes(query);
        const matchEmail = String(u.email || '').toLowerCase().includes(query);
        const matchPhone = String(u.phone || '').includes(query);
        const matchId = String(u.id || '').toLowerCase().includes(query);
        return matchStore || matchOwner || matchEmail || matchPhone || matchId;
      }
      return true;
    });
  }, [users, userStatusFilter, searchUserQuery]);

  // Durum Sayaçları
  const userCounts = useMemo(() => {
    const all = users.length;
    const trial = users.filter(u => u.status === 'TRIAL' || u.plan === 'TRIAL').length;
    const active = users.filter(u => u.status === 'ACTIVE' && u.plan !== 'TRIAL' && u.role !== 'admin').length;
    const suspended = users.filter(u => u.status === 'SUSPENDED').length;
    const admins = users.filter(u => u.role === 'admin').length;
    return { all, trial, active, suspended, admins };
  }, [users]);

  return (
    <div className="space-y-6 max-w-[1680px] mx-auto pb-16 animate-fadeIn font-sans select-none">
      
      {/* 1. ÜST BAŞLIK, SİSTEM CANLILIK GÖSTERGESİ VE METRİKLER */}
      <div className="bg-gradient-to-r from-slate-900 via-[#101726] to-indigo-950 p-6 lg:p-8 rounded-3xl border border-slate-700 shadow-2xl text-white flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
              <Key className="w-3.5 h-3.5 text-amber-400" /> SÜPER YÖNETİCİ & KURUCU MERKEZİ
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Bulut Veritabanı: Canlı & Senkron
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>izeeg Yönetim, Müşteri & Finans Paneli</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Kayıt olan tüm satıcıları, 7 günlük denemedeki mağazaları canlı izleyin; lisans sürelerini uzatın, hesapları dondurun, modül yetkisi verin ve gelen havaleleri tek tıkla onaylayın.
          </p>
        </div>

        {/* Canlı Finans & Müşteri Sayaçları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto">
          <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl text-center shadow-md">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Aylık Gelir (MRR)</div>
            <div className="text-lg font-black text-emerald-400 mt-0.5 font-mono">{stats.mrr.toLocaleString('tr-TR')} ₺</div>
            <span className="text-[10px] text-slate-400">Yıllık: {(stats.arr).toLocaleString('tr-TR')} ₺</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl text-center shadow-md">
            <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">7 Günlük Deneme</div>
            <div className="text-lg font-black text-amber-400 mt-0.5 font-mono">{userCounts.trial} Mağaza</div>
            <span className="text-[10px] text-slate-400">Canlı Takipte</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl text-center shadow-md">
            <div className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Aktif Lisanslı</div>
            <div className="text-lg font-black text-indigo-400 mt-0.5 font-mono">{userCounts.active} Mağaza</div>
            <span className="text-[10px] text-slate-400">Toplam: {userCounts.all} Kayıt</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl text-center shadow-md">
            <div className="text-[11px] text-rose-300 font-bold uppercase tracking-wider">Bekleyen Havale</div>
            <div className={`text-lg font-black mt-0.5 font-mono ${stats.pendingPaymentsCount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
              {stats.pendingPaymentsCount} Adet
            </div>
            <span className="text-[10px] text-slate-400">Onay Bekliyor</span>
          </div>
        </div>
      </div>

      {/* 2. ANA SEKMELER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeAdminTab === 'users'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-500" />
            <span>👥 Kayıtlı Satıcılar & Lisanslar ({users.length})</span>
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
            <span>💸 Havale / FAST Onay Masası</span>
            {stats.pendingPaymentsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {stats.pendingPaymentsCount}
              </span>
            )}
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
            <span>📞 Arama & Demo Talepleri ({leads.length})</span>
            {stats.newLeadsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
                {stats.newLeadsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeAdminTab === 'settings'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building className="w-4 h-4 text-[#FF6000]" />
            <span>🏦 IBAN & Shopier Linkleri</span>
          </button>
        </div>

        {/* Canlı Yenileme & Yeni Kullanıcı Ekle Butonları */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateUserModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>➕ Yeni Satıcı Tanımla</span>
          </button>

          <button
            type="button"
            onClick={refreshAll}
            disabled={isRefreshingCloud}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer border border-slate-200"
            title="Buluttan son verileri çek"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshingCloud ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isRefreshingCloud ? 'Yenileniyor...' : 'Canlı Yenile'}</span>
          </button>
        </div>
      </div>

      {/* SEKME 1: KULLANICILAR & LİSANS YÖNETİMİ (DETAYLI İZLEME VE MÜDAHALE) */}
      {activeAdminTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
          
          {/* Arama & Alt Durum Filtreleri */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Durum Sekmeleri */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setUserStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  userStatusFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tümü ({userCounts.all})
              </button>

              <button
                onClick={() => setUserStatusFilter('TRIAL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  userStatusFilter === 'TRIAL'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>⏳ Denemedekiler</span>
                <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full">{userCounts.trial}</span>
              </button>

              <button
                onClick={() => setUserStatusFilter('ACTIVE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  userStatusFilter === 'ACTIVE'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>💎 Aktif Aboneler</span>
                <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full">{userCounts.active}</span>
              </button>

              <button
                onClick={() => setUserStatusFilter('SUSPENDED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  userStatusFilter === 'SUSPENDED'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span>❄️ Dondurulanlar</span>
                <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full">{userCounts.suspended}</span>
              </button>

              <button
                onClick={() => setUserStatusFilter('ADMIN')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  userStatusFilter === 'ADMIN'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
                }`}
              >
                <span>👑 Kurucular</span>
                <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full">{userCounts.admins}</span>
              </button>
            </div>

            {/* Arama Inputu */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                placeholder="Mağaza, İsim, E-posta veya Telefon Ara..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
              />
            </div>
          </div>

          {/* Kullanıcı Listesi Tablosu */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Mağaza & Müşteri</th>
                  <th className="p-3.5">İletişim & WhatsApp</th>
                  <th className="p-3.5">Paket & Modül Yetkileri (Tıkla Aç/Kapa)</th>
                  <th className="p-3.5 text-center">Kalan Lisans Süresi</th>
                  <th className="p-3.5 text-center">Durum</th>
                  <th className="p-3.5 text-right">Lisans Müdahalesi & Hızlı İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => {
                  const isTrial = u.status === 'TRIAL' || u.plan === 'TRIAL';
                  const isSuspended = u.status === 'SUSPENDED';
                  const isAdmin = u.role === 'admin';
                  const daysLeft = u.daysRemaining || 0;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/90 transition-colors">
                      {/* 1. Mağaza & Müşteri */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div>
                            <strong className="text-slate-900 block font-bold text-sm flex items-center gap-1.5">
                              <span>{u.storeName}</span>
                              {isAdmin && <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-black">👑 Kurucu</span>}
                              {isTrial && <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">⏳ Deneme</span>}
                            </strong>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>{u.ownerName}</span>
                              <span className="text-slate-300">•</span>
                              <span className="font-mono text-[10px] text-slate-400">{u.id}</span>
                              {u.createdAt && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-[10px] text-slate-400">Kayıt: {u.createdAt}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. İletişim & WhatsApp */}
                      <td className="p-3.5">
                        <div className="text-slate-800 font-medium">{u.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <a 
                            href={`tel:${(u.phone || '').replace(/\s+/g, '')}`} 
                            className="font-mono text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                            title="Telefonla Ara"
                          >
                            <PhoneCall className="w-3 h-3 text-emerald-600" />
                            <span>{u.phone || 'Telefon Yok'}</span>
                          </a>

                          {u.phone && (
                            <a
                              href={`https://wa.me/90${(u.phone || '').replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(`Merhaba ${u.ownerName || u.storeName}, izeeg AI kurucusu İsmet Köse ben. Sisteme kaydınızı gördüm, kurulumda ve Trendyol API entegrasyonunuzda yardımcı olmak isterim.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded font-bold text-[10px] flex items-center gap-1 shadow-2xs"
                              title="WhatsApp Mesajı Başlat"
                            >
                              <MessageSquare className="w-2.5 h-2.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* 3. Paket & Modül Yetkileri */}
                      <td className="p-3.5 max-w-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <select
                            value={u.plan || 'STANDARD'}
                            onChange={(e) => handleChangePlan(u.id, e.target.value)}
                            className="text-xs font-black bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="TRIAL">7 Günlük Ücretsiz Deneme (0 ₺)</option>
                            <option value="STANDARD">Standart Paket (979 ₺/ay)</option>
                            <option value="PRO_PLUS">Pro Plus Paket (1.760 ₺/ay)</option>
                            <option value="SUPER_ADMIN">👑 Süper Yönetici Lisansı</option>
                          </select>
                        </div>

                        {/* Modül Toggle Butonları */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {[
                            { id: 'trendyol', label: '🟠 Trendyol' },
                            { id: 'hepsiburada', label: '🟠 Hepsiburada' },
                            { id: 'amazon', label: '🟡 Amazon' },
                            { id: 'n11', label: '🔴 N11' },
                            { id: 'shopify', label: '🟢 Shopify' },
                            { id: 'sovos', label: '📄 Sovos E-Fatura' }
                          ].map(addon => {
                            const isAssigned = (u.activeAddons || []).includes(addon.id) || isAdmin;
                            return (
                              <button
                                key={addon.id}
                                disabled={isAdmin}
                                onClick={async () => {
                                  await toggleUserAddon(u.id, addon.id);
                                  await refreshAll();
                                  if (onToast) onToast(`${u.storeName} için ${addon.label} ${isAssigned ? 'kapatıldı' : 'açıldı'}!`);
                                }}
                                className={`text-[10px] font-black px-2 py-0.5 rounded-md transition-all flex items-center gap-1 border cursor-pointer ${
                                  isAssigned 
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs font-bold' 
                                    : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200 opacity-60'
                                }`}
                                title={`${addon.label} yetkisini ${isAssigned ? 'Kapat' : 'Aç'}`}
                              >
                                <span>{addon.label}</span>
                                <span className="text-[9px]">{isAssigned ? '✓' : '+'}</span>
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* 4. Kalan Lisans Süresi */}
                      <td className="p-3.5 text-center">
                        <span className={`text-base font-black font-mono block ${
                          daysLeft <= 2 ? 'text-rose-600 animate-pulse' : (daysLeft <= 5 ? 'text-amber-600' : 'text-slate-900')
                        }`}>
                          {daysLeft} Gün
                        </span>
                        <span className="text-[10px] text-slate-400">Bitiş: {u.paidUntil || 'Süresiz'}</span>
                      </td>

                      {/* 5. Durum */}
                      <td className="p-3.5 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          isSuspended 
                            ? 'bg-rose-100 text-rose-800' 
                            : (isTrial ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                        }`}>
                          {isSuspended ? '❄️ Donduruldu' : (isTrial ? '⏳ Denemede' : '✓ Aktif')}
                        </span>
                      </td>

                      {/* 6. Hızlı Aksiyon & Lisans Müdahalesi */}
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {/* +7 Gün Hediye */}
                        <button
                          onClick={() => handleAddDaysToUser(u.id, 7)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                          title="Müşteriye +7 Gün Hediye Ekle"
                        >
                          +7 Gün
                        </button>

                        {/* +30 Gün 1 Ay Lisans */}
                        <button
                          onClick={() => handleAddDaysToUser(u.id, 30)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                          title="1 Aylık Lisans Ekle (+30 Gün)"
                        >
                          +30 Gün
                        </button>

                        {/* Dondur / Aç */}
                        <button
                          onClick={() => handleToggleUser(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSuspended 
                              ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                          title={isSuspended ? "Hesabı Tekrar Aç" : "Hesabı Dondur (Erişimi Durdur)"}
                        >
                          {isSuspended ? '▶️ Aç' : '❄️ Dondur'}
                        </button>

                        {/* Gözlemci Girişi */}
                        {onImpersonateUser && (
                          <button
                            onClick={() => onImpersonateUser(u)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            title="Bu kullanıcının paneline admin olarak gözlemci gir"
                          >
                            <Eye className="w-3.5 h-3.5 inline mr-1" />
                            <span>İncele</span>
                          </button>
                        )}

                        {/* Sil */}
                        {!isAdmin && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.storeName)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Kullanıcıyı Sil"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <h4 className="text-sm font-bold text-slate-700">Eşleşen Kullanıcı Bulunamadı</h4>
                <p className="text-xs text-slate-500">Arama filtrenizi temizleyebilir veya 'Yeni Satıcı Tanımla' butonuyla yeni mağaza açabilirsiniz.</p>
              </div>
            )}
          </div>
        </div>
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
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
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
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
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

      {/* SEKME 3: GELEN ARAMA VE İLETİŞİM TALEPLERİ (LEADS) */}
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
                        onClick={async () => {
                          await toggleLeadStatus(lead.id);
                          await refreshAll();
                          if (onToast) onToast(`Talep durumu güncellendi.`);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
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

      {/* SEKME 4: IBAN VE SHOPIER AYARLARI FORMU */}
      {activeAdminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 1. BANKA & FAST AYARLARI */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  🏦
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Banka & Havale / FAST Bilgileri</h3>
                  <p className="text-xs text-slate-500">Müşterilerin havale yaparken göreceği IBAN ve Kolay Adres bilgileri</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Banka Adı</label>
                  <input
                    type="text"
                    value={bankSettings.bankName}
                    onChange={(e) => setBankSettings({ ...bankSettings, bankName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hesap Sahibi (Ad Soyad / Unvan)</label>
                  <input
                    type="text"
                    value={bankSettings.accountHolder}
                    onChange={(e) => setBankSettings({ ...bankSettings, accountHolder: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">IBAN Numarası</label>
                  <input
                    type="text"
                    value={bankSettings.iban}
                    onChange={(e) => setBankSettings({ ...bankSettings, iban: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">FAST / Kolay Adres (Telefon / E-posta)</label>
                  <input
                    type="text"
                    value={bankSettings.fastEasyAddress}
                    onChange={(e) => setBankSettings({ ...bankSettings, fastEasyAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Havale İndirim Oranı (%)</label>
                  <input
                    type="number"
                    value={bankSettings.discountRateHavale}
                    onChange={(e) => setBankSettings({ ...bankSettings, discountRateHavale: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. SHOPIER KREDİ KARTI LİNKLERİ */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  💳
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Shopier Kredi Kartı Ödeme Linkleri</h3>
                  <p className="text-xs text-slate-500">Shopier panelinizde oluşturduğunuz ürün satın alma linkleri</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Standart Aylık Paket Linki (979 ₺)</label>
                  <input
                    type="text"
                    value={shopierSettings.standardMonthlyUrl}
                    onChange={(e) => setShopierSettings({ ...shopierSettings, standardMonthlyUrl: e.target.value })}
                    placeholder="https://www.shopier.com/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Standart Yıllık Paket Linki (9.990 ₺)</label>
                  <input
                    type="text"
                    value={shopierSettings.standardAnnualUrl}
                    onChange={(e) => setShopierSettings({ ...shopierSettings, standardAnnualUrl: e.target.value })}
                    placeholder="https://www.shopier.com/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Amazon SP-API Ek Paket Linki (+499 ₺)</label>
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
              className="px-8 py-3.5 bg-gradient-to-r from-[#FF6000] to-[#FF3D00] hover:from-[#e55600] hover:to-[#e03600] text-white rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Kaydediliyor...' : 'Tüm Ödeme & IBAN Ayarlarını Kaydet'}</span>
            </button>
          </div>
        </form>
      )}

      {/* YENİ SATICI OLUŞTURMA MODALI */}
      {isCreateUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Yeni Satıcı / Mağaza Tanımla</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Mağaza Adı</label>
                <input
                  type="text"
                  required
                  value={newUserForm.storeName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, storeName: e.target.value })}
                  placeholder="Örn: Butik Moda Ltd."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Satıcı / Yetkili Adı Soyadı</label>
                <input
                  type="text"
                  required
                  value={newUserForm.ownerName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, ownerName: e.target.value })}
                  placeholder="Örn: Ahmet Yılmaz"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">E-Posta Adresi</label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="ahmet@magaza.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Telefon Numarası</label>
                  <input
                    type="tel"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="0532 000 00 00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Paket Türü</label>
                  <select
                    value={newUserForm.plan}
                    onChange={(e) => setNewUserForm({ ...newUserForm, plan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                  >
                    <option value="TRIAL">7 Günlük Ücretsiz Deneme</option>
                    <option value="STANDARD">Standart Paket</option>
                    <option value="PRO_PLUS">Pro Plus Paket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tanımlanacak Gün Sayısı</label>
                  <input
                    type="number"
                    value={newUserForm.daysRemaining}
                    onChange={(e) => setNewUserForm({ ...newUserForm, daysRemaining: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md cursor-pointer"
                >
                  Hesabı Oluştur & Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminSuperPanel;
