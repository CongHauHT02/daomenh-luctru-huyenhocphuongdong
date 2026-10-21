import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Calendar,
  Clock,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Bookmark
} from 'lucide-react';

import { convertSolarToLunar } from '../engine/calendar';

interface PersonalProfileBarProps {
  moduleTitle?: string;
  className?: string;
}

export const PersonalProfileBar: React.FC<PersonalProfileBarProps> = ({
  moduleTitle = 'Hồ Sơ Đương Số',
  className = ''
}) => {
  const { currentProfile, calculateAllCharts, saveCurrentProfile, currentBaziChart } = useApp();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fullName, setFullName] = useState(currentProfile.fullName);
  const [gender, setGender] = useState<'male' | 'female'>(currentProfile.gender);
  const [birthDate, setBirthDate] = useState(currentProfile.birthDate);
  const [birthHour, setBirthHour] = useState(currentProfile.birthHour);
  const [birthMinute, setBirthMinute] = useState(currentProfile.birthMinute);
  const [justUpdated, setJustUpdated] = useState<boolean>(false);

  // Sync with global currentProfile whenever it changes from any other tab
  useEffect(() => {
    setFullName(currentProfile.fullName);
    setGender(currentProfile.gender);
    setBirthDate(currentProfile.birthDate);
    setBirthHour(currentProfile.birthHour);
    setBirthMinute(currentProfile.birthMinute);
  }, [currentProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;
    const [y, m, d] = birthDate.split('-').map(Number);
    calculateAllCharts(fullName, gender, y, m, d, Number(birthHour), Number(birthMinute));
    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 3000);
    setIsEditing(false);
  };

  // Format display solar & lunar date
  const [y, m, d] = currentProfile.birthDate.split('-').map(Number);
  const solarDateDisplay = `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y}`;
  const timeDisplay = `${currentProfile.birthHour.toString().padStart(2, '0')}:${currentProfile.birthMinute.toString().padStart(2, '0')}`;
  const lunar = convertSolarToLunar(d, m, y);
  const lunarYearCanChi = currentBaziChart.pillars.year.canChi.fullName;
  const lunarDisplay = `Ngày ${lunar.day}/${lunar.month}${lunar.isLeap ? ' (nhuận)' : ''} năm ${lunarYearCanChi}`;

  return (
    <div className={`oriental-card rounded-2xl border border-gold-500/35 p-4 sm:p-5 shadow-xl transition-all ${className}`}>
      {/* Header bar: Info summary + Edit toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-oriental font-bold shadow-sm">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-lg font-bold text-slate-100 font-oriental tracking-wide">
                {currentProfile.fullName || 'Đương Số'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                currentProfile.gender === 'male'
                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}>
                {currentProfile.gender === 'male' ? 'Nam' : 'Nữ'}
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                Đang xem: {moduleTitle}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                <span>Dương: <strong className="text-slate-200">{solarDateDisplay}</strong></span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Giờ: <strong className="text-slate-200">{timeDisplay}</strong> ({currentBaziChart.pillars.hour.canChi.chi})</span>
              </span>
              <span className="flex items-center space-x-1 text-amber-300">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Âm Lịch: <strong>{lunarDisplay}</strong></span>
              </span>
              {currentBaziChart.profile.solarTerm && (
                <span className="hidden md:inline-flex items-center space-x-1 text-emerald-400">
                  <span>Tiết Khí: <strong>{currentBaziChart.profile.solarTerm.name}</strong></span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end sm:justify-start sm:ml-auto pt-2 sm:pt-0">
          {justUpdated && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã đồng bộ toàn bộ tab!</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isEditing 
                ? 'bg-gold-500 text-ink-950 border-gold-400 shadow-gold-glow' 
                : 'bg-ink-900 hover:bg-gold-500/15 text-gold-300 border-gold-500/40 hover:border-gold-400'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isEditing ? 'animate-spin' : ''}`} />
            <span>{isEditing ? 'Đóng form nhập' : 'Nhập lại thông tin mới'}</span>
            {isEditing ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={saveCurrentProfile}
            title="Lưu hồ sơ này vào danh sách"
            className="p-1.5 rounded-xl bg-ink-900 hover:bg-slate-800 text-slate-300 hover:text-gold-300 border border-slate-700 transition-colors"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Re-entry Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t border-slate-800/80 animate-fade-in">
          <div className="text-xs text-gold-400 font-semibold mb-3 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Nhập Thông Tin Mới – Tự Động Đồng Bộ Sang Tất Cả Các Tab (Bát Tự, Lục Trụ, Tử Vi, Thủ Tướng, Trạch Cát, Hôn Nhân)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            {/* Họ tên */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-medium text-slate-300 mb-1">Họ Tên Đương Số</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="VD: Nguyễn Văn An..."
                className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                required
              />
            </div>

            {/* Giới tính */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Giới Tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
              >
                <option value="male">Nam (Dương/Âm Nam)</option>
                <option value="female">Nữ (Dương/Âm Nữ)</option>
              </select>
            </div>

            {/* Ngày sinh dương */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ngày Sinh (Dương) <span className="text-[10px] text-gold-400 font-normal ml-1">VD: 01/01/1990</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                required
              />
            </div>

            {/* Giờ & Phút */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Giờ <span className="text-[10px] text-gold-400 font-normal">VD: 01</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  placeholder="01"
                  value={birthHour}
                  onChange={(e) => setBirthHour(Number(e.target.value))}
                  className="w-full px-2 py-2 rounded-xl bg-ink-950 border border-slate-700 text-slate-100 text-xs text-center focus:border-gold-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phút <span className="text-[10px] text-gold-400 font-normal">VD: 00</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="00"
                  value={birthMinute}
                  onChange={(e) => setBirthMinute(Number(e.target.value))}
                  className="w-full px-2 py-2 rounded-xl bg-ink-950 border border-slate-700 text-slate-100 text-xs text-center focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-ink-950 font-bold text-xs shadow-gold-glow flex items-center justify-center space-x-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cập Nhật & Tính Toán</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
