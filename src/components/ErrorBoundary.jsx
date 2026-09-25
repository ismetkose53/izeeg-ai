import React from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("izeeg AI App Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndRecover = () => {
    try {
      localStorage.removeItem('izeeg_live_orders');
      localStorage.removeItem('izeeg_live_products');
      localStorage.removeItem('izeeg_live_cargo_leaks');
    } catch (e) {
      console.warn("Storage reset note:", e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-[#f27a1a]">
          <div className="max-w-lg w-full bg-[#0e1422] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-[#f27a1a] flex items-center justify-center mx-auto border border-orange-500/20 shadow-lg shadow-orange-500/10">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">izeeg AI Güvenli Kurtarma Modu</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bir veri veya tarayıcı önbellek uyuşmazlığı nedeniyle arayüz güvenli moda alındı. Panelinizi kurtarmak için aşağıdaki butonları kullanabilirsiniz.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left overflow-x-auto text-[11px] font-mono text-rose-400 max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="py-3 px-4 rounded-xl bg-[#f27a1a] hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sayfayı Yenile</span>
              </button>

              <button
                onClick={this.handleResetAndRecover}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Önbelleği Temizle</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
