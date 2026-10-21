import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Scroll,
  Layers,
  Sparkles,
  Hand,
  Smile,
  Heart,
  Calendar,
  BookOpen,
  Settings,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { config, activeTab, setActiveTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang Chủ', icon: Compass },
    { id: 'bazi', label: 'Bát Tự Tứ Trụ', icon: Scroll },
    { id: 'liuzhu', label: 'Lục Trụ Mệnh Lý', icon: Layers },
    { id: 'tuvi', label: 'Tử Vi Đẩu Số', icon: Sparkles },
    { id: 'palmistry', label: 'Vẽ & Xem Chỉ Tay', icon: Hand },
    { id: 'face_fingerprint', label: 'Tướng Mặt & Vân Tay', icon: Smile },
    { id: 'compatibility', label: 'Xem Tuổi Hôn Nhân', icon: Heart },
    { id: 'date_selection', label: 'Xem Ngày Tốt Xấu', icon: Calendar },
    { id: 'knowledge', label: 'Thư Viện Cổ Thư', icon: BookOpen },
    { id: 'admin', label: 'Quản Trị & Kiểm Thử', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-ink-950/95 backdrop-blur-md border-b border-gold-500/25 shadow-2xl">
      {/* Tier 1: Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group py-1"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gold-500/40 p-1 flex items-center justify-center bg-ink-900 group-hover:border-gold-400 transition-colors shadow-gold-glow flex-shrink-0">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 animate-spin-slow" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="#0b0f14" stroke="#d4af37" strokeWidth="3"/>
                <path d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,1 50,50 A24,24 0 0,0 50,2 Z" fill="#d4af37"/>
                <circle cx="50" cy="26" r="8" fill="#0b0f14"/>
                <circle cx="50" cy="74" r="8" fill="#d4af37"/>
              </svg>
            </div>
            <div>
              <span className="text-base sm:text-lg lg:text-xl font-bold tracking-wider gold-gradient-text block font-oriental leading-tight">
                {config.brandName}
              </span>
              <span className="text-[11px] text-slate-400 font-light hidden sm:block">
                Hệ Thống Mệnh Lý Thuần Cổ Thư (Zero-AI Decision Platform)
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Zero-AI Certification Badge */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Thuần Cổ Thư</span>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => handleNavClick('bazi')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-ink-950 font-bold text-xs tracking-wider shadow-md transition-all active:scale-95 flex-shrink-0"
            >
              <Scroll className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Lập Lá Số Ngay</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-gold-300 hover:bg-ink-850 border border-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Dedicated Navigation Strip (Optimized for laptops and mobile) */}
      <div className="border-t border-slate-800/80 bg-ink-950/90 shadow-inner relative">
        <div className="max-w-7xl mx-auto px-1 sm:px-4">
          <nav className="flex items-center justify-start 2xl:justify-center overflow-x-auto no-scrollbar py-1.5 px-2 space-x-1 sm:space-x-1.5 touch-pan-x scroll-smooth">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`whitespace-nowrap flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-gold-500 text-ink-950 font-bold shadow-gold-glow scale-102'
                      : 'text-slate-300 hover:text-gold-200 hover:bg-ink-900 border border-transparent hover:border-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-ink-950' : 'text-gold-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer (When Open) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ink-900/98 border-b border-gold-500/30 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-fade-in backdrop-blur-xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Danh Mục Chức Năng</span>
            <span className="text-[10px] text-emerald-400 font-mono">0% AI CAN THIỆP</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-gold-500 text-ink-950 font-bold shadow-md'
                      : 'text-slate-200 bg-ink-950/80 hover:bg-ink-800 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-ink-950' : 'text-gold-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
