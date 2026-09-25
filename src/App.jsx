import React, { useState, useMemo, useEffect } from 'react';
import { AppHeader } from './components/AppHeader';
import { AIWorkerDashboard } from './components/AIWorkerDashboard';
import { RealNetProfitModule } from './components/RealNetProfitModule';
import { UnifiedOrdersPage } from './components/UnifiedOrdersPage';
import { ProProfitTable } from './components/ProProfitTable';
import { MultiChannelProductPublisher } from './components/MultiChannelProductPublisher';
import { WarehouseInventoryPage } from './components/WarehouseInventoryPage';
import { InvoiceManagementPage } from './components/InvoiceManagementPage';
import { CargoAuditPage } from './components/CargoAuditPage';
import { ReturnsManagementPage } from './components/ReturnsManagementPage';
import { AdPerformancePage } from './components/AdPerformancePage';
import { ProductMappingPage } from './components/ProductMappingPage';
import { SalesReportsPage } from './components/SalesReportsPage';
import { MarketplaceIntegrations } from './components/MarketplaceIntegrations';
import { WhatsAppNotifications } from './components/WhatsAppNotifications';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AIChatModal } from './components/AIChatModal';
import { ActionApprovalModal } from './components/ActionApprovalModal';
import { AdminSuperPanel } from './components/AdminSuperPanel';
import { AuthModal } from './components/AuthModal';
import { ContactModal } from './components/ContactModal';
import { WhatsAppFloatingWidget } from './components/WhatsAppFloatingWidget';
import { SmartRepricerPage } from './components/SmartRepricerPage';
import { SupplierReorderPage } from './components/SupplierReorderPage';
import { CustomerQuestionsAIPage } from './components/CustomerQuestionsAIPage';
import { LiveMobileNotificationCenter } from './components/LiveMobileNotificationCenter';
import { ProductPitchDeckModal } from './components/ProductPitchDeckModal';
import { PitchDeckPage } from './components/PitchDeckPage';
import { PageHelpGuideModal } from './components/PageHelpGuideModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PortalEntrancePage } from './components/PortalEntrancePage';
import { getCurrentUser, logoutUser, saveCurrentUser } from './services/authService';
import { Analytics } from '@vercel/analytics/react';

import { 
  INITIAL_PRODUCTS, 
  UNIFIED_LIVE_ORDERS, 
  MOCK_CARGO_AUDIT_LEAKS, 
  MOCK_CHART_TIMELINE,
  DEMO_PRODUCTS,
  DEMO_ORDERS,
  DEMO_CARGO_AUDIT_LEAKS
} from './services/mockData';
import { calculateStoreMetrics } from './services/marketplaceEngine';
import { runAutoSyncAll, backfillOrderImages, getCatalogProducts } from './services/marketplaceSyncService';
import confetti from 'canvas-confetti';

export function App() {
  // Kullanıcı Oturumu & Rol Yönetimi
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  // Canlı Giriş / CPANEL Açılış Ekranı (Oturum açık değilse veya çıkış yapılmışsa gösterilir)
  const [isPortalOpen, setIsPortalOpen] = useState(!currentUser || !currentUser.isLoggedIn);

  // Aktif Sekme: 'orders' (Kargo Aşamasındaki Siparişler - Trendyol Paneli)
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedMarketplace, setSelectedMarketplace] = useState('ALL');
  
  // Canlı & Temiz Veri Havuzları (Varsayılan olarak sıfır verili temiz başlar; gerçek satış modu)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('izeeg_live_products');
      return saved !== null ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('izeeg_live_orders');
      const parsed = saved !== null ? JSON.parse(saved) : [];
      return backfillOrderImages(parsed);
    } catch {
      return [];
    }
  });

  const [cargoLeaks, setCargoLeaks] = useState(() => {
    try {
      const saved = localStorage.getItem('izeeg_live_cargo_leaks');
      return saved !== null ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDemoMode, setIsDemoMode] = useState(() => {
    try {
      const saved = localStorage.getItem('izeeg_demo_mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [autoInvoiceEnabled, setAutoInvoiceEnabled] = useState(true);

  // Otomatik Arka Plan Pazaryeri Senkronizasyonu (Varsayılan: Her 10 dakikada bir)
  const [autoSyncIntervalMins, setAutoSyncIntervalMins] = useState(() => {
    try {
      const saved = localStorage.getItem('izeeg_auto_sync_interval_mins');
      return saved !== null ? parseInt(saved, 10) : 10;
    } catch {
      return 10;
    }
  });

  const [lastAutoSyncTime, setLastAutoSyncTime] = useState(null);

  useEffect(() => {
    localStorage.setItem('izeeg_auto_sync_interval_mins', String(autoSyncIntervalMins));
  }, [autoSyncIntervalMins]);

  // Arka Planda Periyodik Otomatik API Taraması
  useEffect(() => {
    if (!autoSyncIntervalMins || autoSyncIntervalMins <= 0) return;

    // İlk açılışta 1.5 saniye sonra arka planda ürünleri ve siparişleri tara & görselleri güncelle
    const initialTimer = setTimeout(() => {
      runAutoSyncAll({
        onToast: showToast,
        onNewOrdersReceived: (mergedOrders) => {
          setOrders(mergedOrders);
          setLastAutoSyncTime(new Date());
        }
      });
    }, 1500);

    // Belirlenen periyotta (örn 10 dk) tekrarlanan otomatik senkronizasyon
    const intervalMs = autoSyncIntervalMins * 60 * 1000;
    const intervalId = setInterval(() => {
      runAutoSyncAll({
        onToast: showToast,
        onNewOrdersReceived: (mergedOrders) => {
          setOrders(mergedOrders);
          setLastAutoSyncTime(new Date());
        }
      });
    }, intervalMs);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [autoSyncIntervalMins]);

  // Verilerin localStorage ile otomatik senkronizasyonu
  useEffect(() => {
    localStorage.setItem('izeeg_live_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('izeeg_live_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('izeeg_live_cargo_leaks', JSON.stringify(cargoLeaks));
  }, [cargoLeaks]);

  useEffect(() => {
    localStorage.setItem('izeeg_demo_mode', isDemoMode ? 'true' : 'false');
  }, [isDemoMode]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedAddonForCheckout, setSelectedAddonForCheckout] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [guideModalPage, setGuideModalPage] = useState(null);

  // Demo Veri Yükleme ve Sıfırlama Fonksiyonları
  const handleLoadDemoData = () => {
    setProducts(DEMO_PRODUCTS);
    setOrders(DEMO_ORDERS);
    setCargoLeaks(DEMO_CARGO_AUDIT_LEAKS);
    setIsDemoMode(true);
    localStorage.setItem('izeeg_live_products', JSON.stringify(DEMO_PRODUCTS));
    localStorage.setItem('izeeg_live_orders', JSON.stringify(DEMO_ORDERS));
    localStorage.setItem('izeeg_live_cargo_leaks', JSON.stringify(DEMO_CARGO_AUDIT_LEAKS));
    localStorage.setItem('izeeg_demo_mode', 'true');
    showToast("✨ Demo test verileri yüklendi! Canlı simülasyon aktif.");
    confetti({ particleCount: 90, spread: 80 });
  };

  const handleResetToClean = () => {
    setProducts([]);
    setOrders([]);
    setCargoLeaks([]);
    setIsDemoMode(false);
    localStorage.setItem('izeeg_live_products', JSON.stringify([]));
    localStorage.setItem('izeeg_live_orders', JSON.stringify([]));
    localStorage.setItem('izeeg_live_cargo_leaks', JSON.stringify([]));
    localStorage.setItem('izeeg_demo_mode', 'false');
    showToast("🧹 Canlı Satış Modu: Tüm deneme verileri temizlendi, tertemiz sıfırlandı.");
  };

  const handleOpenAddonCheckout = (addonId) => {
    setSelectedAddonForCheckout(addonId);
    setIsSubModalOpen(true);
  };

  const handleLoginSuccess = (user, customMessage) => {
    saveCurrentUser(user);
    setCurrentUser(user);
    setIsPortalOpen(false);
    if (user.role === 'admin') {
      setActiveTab('admin-panel');
      showToast(customMessage || "👑 Hoş geldiniz İsmet Bey! Süper Admin Yönetici Modu aktif.");
    } else {
      showToast(customMessage || `Hoş geldiniz ${user.ownerName || user.storeName}!`);
    }
  };

  const handleExploreDemo = () => {
    setProducts(DEMO_PRODUCTS);
    setOrders(DEMO_ORDERS);
    setCargoLeaks(DEMO_CARGO_AUDIT_LEAKS);
    setIsDemoMode(true);
    setIsPortalOpen(false);
    showToast("🚀 Canlı Demo Modu: Tüm özellikleri sınırsız deneyebilirsiniz.");
  };

  const handleLogout = () => {
    logoutUser();
    const guestUser = getCurrentUser();
    setCurrentUser(guestUser);
    setIsPortalOpen(true);
    showToast("👋 Başarıyla çıkış yapıldı. Giriş paneline yönlendirildiniz.");
  };

  // Güvenlik Kapısı & Aksiyon Onay Modalı
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedActionData, setSelectedActionData] = useState(null);

  // Modallar
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [initialAIPrompt, setInitialAIPrompt] = useState('');
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Seçilen Pazar Yerine Göre Ürün Filtresi
  const filteredProducts = useMemo(() => {
    if (selectedMarketplace === 'ALL') return products;
    return products.filter(p => p.marketplace === selectedMarketplace);
  }, [products, selectedMarketplace]);

  // Metrik Hesaplamaları
  const metrics = useMemo(() => {
    return calculateStoreMetrics(filteredProducts, cargoLeaks);
  }, [filteredProducts, cargoLeaks]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenActionApproval = (actionItem) => {
    setSelectedActionData(actionItem);
    setIsActionModalOpen(true);
  };

  const handleActionApprovedSuccess = (logEntry) => {
    showToast(`✅ "${logEntry.actionTitle}" onaylandı ve pazar yerine uygulandı!`);
  };

  const handleSendWhatsAppTest = () => {
    showToast("📱 09:00 WhatsApp sabah yönetici bülteni cep telefonunuza iletildi!");
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.2 }
    });
  };

  if (isPortalOpen) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-[#f27a1a] selection:text-white">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl shadow-emerald-500/30 border border-emerald-400 animate-fadeIn flex items-center gap-2">
            <span>✨</span> {toastMessage}
          </div>
        )}
        <PortalEntrancePage
          onLoginSuccess={handleLoginSuccess}
          onExploreDemo={handleExploreDemo}
        />
        <Analytics />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edf2f7] text-slate-900 flex flex-col font-sans selection:bg-[#f27a1a] selection:text-white w-full max-w-full overflow-x-hidden">
      
      {/* Toast Bildirimi */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl shadow-emerald-500/30 border border-emerald-400 animate-fadeIn flex items-center gap-2">
          <span>✨</span> {toastMessage}
        </div>
      )}

      {/* Modern ve Ferah Üst Header */}
      <AppHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedMarketplace={selectedMarketplace}
        setSelectedMarketplace={setSelectedMarketplace}
        onOpenAIModal={() => {
          setInitialAIPrompt('');
          setIsAIModalOpen(true);
        }}
        onOpenSubModal={() => setIsSubModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onLogout={handleLogout}
        onOpenPortal={() => setIsPortalOpen(true)}
        currentUser={currentUser}
        trialDaysLeft={currentUser.trialDaysLeft || 5}
        liveOrdersCount={orders.length}
        unreadNotificationsCount={3}
        pendingActionsCount={0}
      />

      {/* Ana İçerik Alanı (Mobilde Alt Bar İçin pb-24 Eklendi) */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-3 sm:px-4 lg:px-6 pt-4 sm:pt-5 pb-24 lg:pb-8">
        
        {/* 1. AI E-TİCARET ÇALIŞANI (ANA SAYFA) */}
        {activeTab === 'ai-worker' && (
          <AIWorkerDashboard
            products={products}
            orders={orders}
            cargoLeaks={cargoLeaks}
            isDemoMode={isDemoMode}
            onOpenGuide={() => setGuideModalPage('ai-worker')}
            onTriggerActionApproval={handleOpenActionApproval}
            onOpenAIChatModal={(prompt) => {
              setInitialAIPrompt(prompt);
              setIsAIModalOpen(true);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* 2. GERÇEK NET KÂR MODÜLÜ ("BUGÜN GERÇEKTEN NE KAZANDIM?") */}
        {activeTab === 'net-profit' && (
          <div className="space-y-4">
            <RealNetProfitModule
              products={products}
              orders={orders}
              onOpenGuide={() => setGuideModalPage('net-profit')}
              onNavigateToReturns={() => setActiveTab('returns')}
              onNavigateToAds={() => setActiveTab('ads')}
              onNavigateToProTable={() => setActiveTab('pro-table')}
            />
          </div>
        )}

        {/* 3. SİPARİŞLER MERKEZİ (ANA İZLEME BAŞLIĞI) */}
        {activeTab === 'orders' && (
          <UnifiedOrdersPage
            orders={orders}
            setOrders={setOrders}
            products={products}
            setProducts={setProducts}
            selectedMarketplace={selectedMarketplace}
            autoInvoiceEnabled={autoInvoiceEnabled}
            onOpenGuide={() => setGuideModalPage('orders')}
            onNavigateToInvoices={() => setActiveTab('invoices')}
          />
        )}

        {/* 4. OTOMATİK BUYBOX & FİYAT SAVAŞÇISI (SMART REPRICER) */}
        {activeTab === 'repricer' && (
          <SmartRepricerPage
            products={products}
            onOpenGuide={() => setGuideModalPage('repricer')}
            onNavigateBack={() => setActiveTab('ai-worker')}
          />
        )}

        {/* 5. STOK BİTİŞ TAHMİNİ & TEDARİKÇİ SİPARİŞ FİŞİ (PO) */}
        {activeTab === 'supplier-reorder' && (
          <SupplierReorderPage
            products={products}
            onOpenGuide={() => setGuideModalPage('supplier-reorder')}
            onNavigateBack={() => setActiveTab('warehouse')}
          />
        )}

        {/* 6. MÜŞTERİ SORULARI & YORUMLAR AI YANITLAYICI */}
        {activeTab === 'customer-questions' && (
          <CustomerQuestionsAIPage
            onOpenGuide={() => setGuideModalPage('customer-questions')}
            onNavigateBack={() => setActiveTab('ai-worker')}
          />
        )}

        {/* 7. PRO MALİYET & KÂR/FİYAT SİMÜLATÖRÜ */}
        {activeTab === 'pro-table' && (
          <ProProfitTable
            products={filteredProducts}
            onOpenGuide={() => setGuideModalPage('pro-table')}
            onNavigateToOrders={() => setActiveTab('orders')}
          />
        )}

        {/* 8. ÇOK KANALLI ÜRÜN YÜKLEME & KATALOG DAĞITIM MOTORU (TEK TIKLA TÜM PAZARYERLERİ & WEB) */}
        {(activeTab === 'omnichannel-products' || activeTab === 'warehouse') && (
          <MultiChannelProductPublisher
            products={products}
            setProducts={setProducts}
            onOpenGuide={() => setGuideModalPage('omnichannel-products')}
            onNavigateToProfitTable={() => setActiveTab('pro-table')}
          />
        )}

        {/* 9. E-FATURA & FATURA YAZDIRMA MERKEZİ */}
        {activeTab === 'invoices' && (
          <InvoiceManagementPage
            orders={orders}
            setOrders={setOrders}
            autoInvoiceEnabled={autoInvoiceEnabled}
            setAutoInvoiceEnabled={setAutoInvoiceEnabled}
            onOpenGuide={() => setGuideModalPage('invoices')}
            onNavigateBack={() => setActiveTab('ai-worker')}
          />
        )}

        {/* 10. KARGO OPERASYONU, DESİ KAÇAĞI & İTİRAZ SİHİRBAZI */}
        {(activeTab === 'cargo-audit' || activeTab === 'cargo') && (
          <CargoAuditPage
            cargoLeaks={cargoLeaks}
            setCargoLeaks={setCargoLeaks}
            onOpenGuide={() => setGuideModalPage('cargo-audit')}
            onNavigateBack={() => setActiveTab('ai-worker')}
          />
        )}

        {/* 11. İADE YÖNETİMİ & ÇİFT KARGO MOTORU */}
        {activeTab === 'returns' && (
          <ReturnsManagementPage
            onOpenGuide={() => setGuideModalPage('returns')}
            onNavigateBack={() => setActiveTab('ai-worker')}
            onTriggerActionApproval={handleOpenActionApproval}
          />
        )}

        {/* 12. REKLAM PERFORMANSI & ROAS ANALİZİ */}
        {activeTab === 'ads' && (
          <AdPerformancePage
            onOpenGuide={() => setGuideModalPage('ads')}
            onNavigateBack={() => setActiveTab('ai-worker')}
            onTriggerActionApproval={handleOpenActionApproval}
          />
        )}

        {/* 13. ÇOK KANALLI ÜRÜN & SKU / BARKOD EŞLEŞTİRİCİ */}
        {(activeTab === 'product-mapping' || activeTab === 'products') && (
          <ProductMappingPage
            products={products}
            setProducts={setProducts}
            onOpenGuide={() => setGuideModalPage('omnichannel-products')}
            onNavigateBack={() => setActiveTab('ai-worker')}
          />
        )}

        {/* 14. SATIŞ & OPERASYON RAPORLARI */}
        {activeTab === 'reports' && (
          <SalesReportsPage
            products={filteredProducts}
            onOpenGuide={() => setGuideModalPage('net-profit')}
            onNavigateBack={() => setActiveTab('ai-worker')}
          />
        )}

        {/* 15. PAZARYERİ API BAĞLANTILARI */}
        {activeTab === 'integrations' && (
          <MarketplaceIntegrations 
            orders={orders}
            setOrders={setOrders}
            products={products}
            setProducts={setProducts}
            cargoLeaks={cargoLeaks}
            setCargoLeaks={setCargoLeaks}
            autoSyncIntervalMins={autoSyncIntervalMins}
            setAutoSyncIntervalMins={setAutoSyncIntervalMins}
            lastAutoSyncTime={lastAutoSyncTime}
            onToast={showToast}
            onOpenSubModal={handleOpenAddonCheckout} 
            onOpenGuide={() => setGuideModalPage('ai-worker')}
          />
        )}

        {/* 16. WHATSAPP BÜLTENİ */}
        {activeTab === 'whatsapp' && (
          <WhatsAppNotifications
            metrics={metrics}
            onTriggerWhatsAppSend={handleSendWhatsAppTest}
          />
        )}

        {/* 17. 👑 SÜPER ADMIN & KURUCU KONTROL PANELİ */}
        {activeTab === 'admin-panel' && (
          <AdminSuperPanel 
            onToast={showToast}
            onImpersonateUser={(targetUser) => {
              setCurrentUser(targetUser);
              setActiveTab('ai-worker');
              showToast(`👤 "${targetUser.storeName}" mağazası görünümüne geçildi.`);
            }}
          />
        )}

        {/* 18. TANITIM & PITCH DECK SAYFASI (TAM EKRAN SUNUM) */}
        {(activeTab === 'pitch-deck' || activeTab === 'tanitim' || activeTab === 'pitch') && (
          <PitchDeckPage
            onOpenContactModal={() => setIsContactModalOpen(true)}
            onOpenSubModal={() => setIsSubModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

      </main>

      {/* Şık, Sade & Profesyonel Alt Durum Çubuğu (Footer) */}
      <footer className="bg-[#111827] border-t border-slate-800 py-3 px-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse"></span>
            <span className="font-bold text-slate-200">izeeg AI</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Çok Kanallı E-Ticaret Otomasyonu & AI Yönetim Platformu</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button 
              onClick={() => setGuideModalPage(activeTab)} 
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>💡</span> Bu Sayfa Nasıl Kullanılır?
            </button>
            <button 
              onClick={() => setActiveTab('pitch-deck')} 
              className="text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
            >
              <span>📊</span> Ürün Sunumu & Pitch Deck
            </button>
            <button 
              onClick={() => setIsContactModalOpen(true)} 
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>📞</span> İletişim / Canlı Destek
            </button>
          </div>
        </div>
      </footer>

      {/* Sayfa Kullanım ve Tanıtım Rehberi Modalı (Tüm Sayfalar İçin) */}
      <PageHelpGuideModal
        isOpen={guideModalPage !== null}
        onClose={() => setGuideModalPage(null)}
        pageKey={guideModalPage || activeTab}
      />

      {/* Ürün Tanıtım, Satış Broşürü & Pitch Deck Modalı */}
      <ProductPitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onOpenSubModal={() => setIsSubModalOpen(true)}
      />

      {/* Canlı Mobil / Web Push Bildirim Çekmecesi */}
      <LiveMobileNotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsNotificationsOpen(false);
        }}
        unreadCount={3}
      />

      {/* AI Asistan Modalı */}
      <AIChatModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        storeContext={metrics}
        initialPrompt={initialAIPrompt}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Güvenlik Kapısı: AI Aksiyon Onay Modalı */}
      <ActionApprovalModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        actionData={selectedActionData}
        onActionSuccess={handleActionApprovedSuccess}
      />

      {/* 7 Günlük Deneme & Abonelik Modalı */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => {
          setIsSubModalOpen(false);
          setSelectedAddonForCheckout(null);
        }}
        trialDaysLeft={currentUser.trialDaysLeft || 5}
        totalSaved={2450}
        initialSelectedAddon={selectedAddonForCheckout}
      />

      {/* Giriş & Kayıt & Kurucu Auth & Profil Yönetimi Modalı */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          showToast(`✅ Mağaza profili (${updated.storeName}) başarıyla güncellendi.`);
        }}
        onLogout={handleLogout}
        onResetToClean={handleResetToClean}
        onLoadDemoData={handleLoadDemoData}
        isDemoMode={isDemoMode}
        ordersCount={orders.length}
        productsCount={products.length}
        cargoLeaksCount={cargoLeaks.length}
      />

      {/* Biz Sizi Arayalım & İletişim Modalı */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onToast={showToast}
      />

      {/* Canlı WhatsApp & Arama Talebi Yüzen Butonu */}
      <WhatsAppFloatingWidget
        onOpenContactModal={() => setIsContactModalOpen(true)}
      />

      {/* Sabit Mobil Alt Navigasyon Barı & Modül Çekmecesi (iOS/Android Uyumlu) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        liveOrdersCount={orders.length}
        currentUser={currentUser}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onOpenSubModal={() => setIsSubModalOpen(true)}
        onLogout={handleLogout}
        onOpenPortal={() => setIsPortalOpen(true)}
      />

      {/* Vercel Ücretsiz Canlı Web Analitik İzleyicisi */}
      <Analytics />

    </div>
  );
}

export default App;
