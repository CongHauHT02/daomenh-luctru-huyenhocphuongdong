import React, { useState } from 'react';
import {
  calculateDailyHoroscope,
  DailyHoroscopeReport,
  HourlyFortune,
  DailyAspectAssessment
} from '../engine/dailyHoroscope';
import { ClassicalEvidenceDrawer } from './ClassicalEvidenceDrawer';
import { convertSolarToLunar } from '../engine/calendar';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  Briefcase,
  Coins,
  HeartHandshake,
  Activity,
  Clock,
  Navigation,
  CheckCircle2,
  AlertOctagon,
  Scroll,
  HelpCircle,
  Eye,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Home,
  User,
  ArrowRight,
  Zap,
  TrendingUp,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface DailyHoroscopeSectionProps {
  inspectedDateStr: string; // YYYY-MM-DD
  birthDateStr: string;     // YYYY-MM-DD
  onSelectDate?: (dateStr: string) => void;
}

export const DailyHoroscopeSection: React.FC<DailyHoroscopeSectionProps> = ({
  inspectedDateStr,
  birthDateStr,
  onSelectDate
}) => {
  const { currentProfile, calculateAllCharts } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'aspects' | 'hexagram' | 'lucnham' | 'hours' | 'directions'>('aspects');
  const [showBaziEditor, setShowBaziEditor] = useState<boolean>(false);

  // Profile form local state (synchronized with currentProfile)
  const [localName, setLocalName] = useState(currentProfile?.fullName || 'Đương Số');
  const [localGender, setLocalGender] = useState<'male' | 'female'>(currentProfile?.gender || 'male');
  const [localBirthDate, setLocalBirthDate] = useState(birthDateStr || currentProfile?.birthDate || '1990-01-01');
  const [localBirthHour, setLocalBirthHour] = useState(currentProfile?.birthHour ?? 12);

  // Parse inspected date
  const [iYear, iMonth, iDay] = inspectedDateStr.split('-').map(Number);
  const [bYear, bMonth, bDay] = (localBirthDate || birthDateStr).split('-').map(Number);

  // Calculate Daily Horoscope using Classical Engine
  const report: DailyHoroscopeReport = calculateDailyHoroscope(
    iYear || 2026,
    iMonth || 10,
    iDay || 24,
    bYear || 1990,
    bMonth || 1,
    bDay || 1,
    Number(localBirthHour) || 12
  );

  const {
    dayCanChi,
    dayNapAm,
    lunarDateStr,
    solarTerm,
    truc,
    sao28,
    userBazi,
    hexagramDivination,
    lucNham,
    aspects,
    hourlyFortunes,
    directions,
    doActivities,
    dontActivities,
    overallDailyScore,
    dailyVerdict,
    summaryVerdict,
    classicalSummaryVerse
  } = report;

  // Xử lý chuyển ngày nhanh
  const changeTargetDate = (offsetDays: number) => {
    const current = new Date(inspectedDateStr);
    current.setDate(current.getDate() + offsetDays);
    const newStr = current.toISOString().split('T')[0];
    if (onSelectDate) onSelectDate(newStr);
  };

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    if (onSelectDate) onSelectDate(today);
  };

  // Cập nhật Bát Tự đương số
  const handleUpdateBazi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localBirthDate) return;
    const [y, m, d] = localBirthDate.split('-').map(Number);
    calculateAllCharts(localName, localGender, y, m, d, Number(localBirthHour), 0);
    setShowBaziEditor(false);
  };

  // Badge màu Cát Hung tổng thể
  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'Đại Cát Đại Lợi':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-950/40';
      case 'Cát Lợi Thuận Buồm':
        return 'bg-gold-500/20 text-gold-300 border-gold-500/50 shadow-gold-950/40';
      case 'Bình Hòa Ổn Định':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-950/40';
      case 'Nên Cẩn Trọng':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-950/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-rose-950/40';
    }
  };

  // Icon phương diện
  const getPillarIcon = (aspect: string) => {
    switch (aspect) {
      case 'cong_danh':
        return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'su_nghiep':
        return <Briefcase className="w-5 h-5 text-cyan-400" />;
      case 'tien_tai':
        return <Coins className="w-5 h-5 text-amber-400" />;
      case 'tinh_duyen':
        return <HeartHandshake className="w-5 h-5 text-rose-400" />;
      case 'gia_dao':
        return <Home className="w-5 h-5 text-emerald-400" />;
      default:
        return <Activity className="w-5 h-5 text-teal-400" />;
    }
  };

  // Theme màu phương diện
  const getPillarBorder = (aspect: string) => {
    switch (aspect) {
      case 'cong_danh': return 'border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-950/15';
      case 'su_nghiep': return 'border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-950/15';
      case 'tien_tai': return 'border-amber-500/30 hover:border-amber-500/60 bg-amber-950/15';
      case 'tinh_duyen': return 'border-rose-500/30 hover:border-rose-500/60 bg-rose-950/15';
      case 'gia_dao': return 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/15';
      default: return 'border-teal-500/30 hover:border-teal-500/60 bg-teal-950/15';
    }
  };

  // Vẽ hào âm dương (1: Dương ———, 0: Âm ——  ——)
  const renderHexagramLines = (upperNum: number, lowerNum: number, movingLineIndex?: number) => {
    const trigramLines: Record<number, number[]> = {
      1: [1, 1, 1], // Càn
      2: [1, 1, 0], // Đoài
      3: [1, 0, 1], // Ly
      4: [1, 0, 0], // Chấn
      5: [0, 1, 1], // Tốn
      6: [0, 1, 0], // Khảm
      7: [0, 0, 1], // Cấn
      8: [0, 0, 0], // Khôn
    };

    const low = trigramLines[lowerNum] || [1, 1, 1];
    const up = trigramLines[upperNum] || [1, 1, 1];
    const all6 = [...low, ...up]; // index 0..5 = Hào 1..6

    // Render từ trên xuống dưới (Hào 6 ở trên, Hào 1 ở dưới)
    return (
      <div className="flex flex-col space-y-1.5 w-32 mx-auto my-2">
        {all6.slice().reverse().map((val, idx) => {
          const lineNum = 6 - idx;
          const isMoving = movingLineIndex === lineNum;

          return (
            <div
              key={lineNum}
              className={`relative flex items-center justify-between h-3.5 px-1 rounded transition-all ${
                isMoving
                  ? 'ring-2 ring-gold-400 bg-gold-500/25 animate-pulse shadow-lg shadow-gold-500/20'
                  : 'bg-slate-900/60'
              }`}
            >
              {val === 1 ? (
                // Dương: Hào liền
                <div className={`w-full h-2 rounded-sm ${isMoving ? 'bg-gold-400' : 'bg-slate-300'}`} />
              ) : (
                // Âm: Hào đứt (hai vạch cân đối)
                <div className="w-full flex justify-between space-x-2">
                  <div className={`w-[45%] h-2 rounded-sm ${isMoving ? 'bg-gold-400' : 'bg-slate-300'}`} />
                  <div className={`w-[45%] h-2 rounded-sm ${isMoving ? 'bg-gold-400' : 'bg-slate-300'}`} />
                </div>
              )}
              {isMoving && (
                <span className="absolute -right-7 text-[9px] font-bold text-gold-400 whitespace-nowrap">
                  Hào {lineNum} (Động)
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Danh sách 5 trụ cột hiển thị
  const pillarsList: DailyAspectAssessment[] = [
    aspects.congDanh,
    aspects.suNghiep,
    aspects.tienTai,
    aspects.tinhDuyen,
    aspects.giaDao,
    aspects.sucKhoe
  ];

  return (
    <div className="oriental-card rounded-2xl p-4 sm:p-6 border border-gold-500/35 space-y-6 shadow-2xl bg-ink-950/80">
      
      {/* 1. THANH ĐIỀU HƯỚNG NGÀY & NẠP BÁT TỰ */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        
        {/* Nút lùi/tiến ngày */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => changeTargetDate(-1)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-ink-900 text-slate-200 hover:border-gold-500 hover:text-gold-300 text-xs font-medium transition-all"
            title="Xem ngày hôm trước"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Hôm Trước</span>
          </button>

          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-lg border border-gold-500/40 bg-gold-500/10 text-gold-300 hover:bg-gold-500/20 text-xs font-semibold transition-all flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Hôm Nay</span>
          </button>

          <button
            onClick={() => changeTargetDate(1)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-ink-900 text-slate-200 hover:border-gold-500 hover:text-gold-300 text-xs font-medium transition-all"
            title="Xem ngày hôm sau"
          >
            <span className="hidden sm:inline">Hôm Sau</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Ô nhập ngày đang xem */}
          <div className="flex items-center space-x-1 pl-2">
            <Calendar className="w-4 h-4 text-gold-400" />
            <input
              type="date"
              value={inspectedDateStr}
              onChange={(e) => onSelectDate && onSelectDate(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-ink-900 border border-gold-500/40 text-gold-200 text-xs font-semibold focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Nút toggle đổi Bát Tự đương số */}
        <div className="flex items-center justify-between sm:justify-end space-x-2">
          <button
            onClick={() => setShowBaziEditor(!showBaziEditor)}
            className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-xs font-medium transition-all flex items-center space-x-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>{showBaziEditor ? 'Đóng Bát Tự' : 'Đổi Ngày Sinh Bát Tự'}</span>
          </button>
        </div>
      </div>

      {/* FORM SỬA NHANH BÁT TỰ (KHI MỞ) */}
      {showBaziEditor && (
        <form onSubmit={handleUpdateBazi} className="p-4 rounded-xl border border-cyan-500/30 bg-ink-900/90 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 font-oriental">Nhập Thông Tin Bát Tự Tứ Trụ Của Bạn:</span>
            <span className="text-[11px] text-slate-400">Dùng xác định Nhật Chủ & Thập Thần hàng ngày</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Họ Tên:</label>
              <input
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-ink-950 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Ngày Tháng Năm Sinh (Dương Lịch):</label>
              <input
                type="date"
                value={localBirthDate}
                onChange={(e) => setLocalBirthDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-ink-950 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Giờ Sinh (0-23h):</label>
              <select
                value={localBirthHour}
                onChange={(e) => setLocalBirthHour(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded bg-ink-950 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value={23}>Giờ Tý (23:00 - 00:59)</option>
                <option value={1}>Giờ Sửu (01:00 - 02:59)</option>
                <option value={3}>Giờ Dần (03:00 - 04:59)</option>
                <option value={5}>Giờ Mão (05:00 - 06:59)</option>
                <option value={7}>Giờ Thìn (07:00 - 08:59)</option>
                <option value={9}>Giờ Tỵ (09:00 - 10:59)</option>
                <option value={11}>Giờ Ngọ (11:00 - 12:59)</option>
                <option value={13}>Giờ Mùi (13:00 - 14:59)</option>
                <option value={15}>Giờ Thân (15:00 - 16:59)</option>
                <option value={17}>Giờ Dậu (17:00 - 18:59)</option>
                <option value={19}>Giờ Tuất (19:00 - 20:59)</option>
                <option value={21}>Giờ Hợi (21:00 - 22:59)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Giới Tính:</label>
              <select
                value={localGender}
                onChange={(e) => setLocalGender(e.target.value as 'male' | 'female')}
                className="w-full px-2.5 py-1.5 rounded bg-ink-950 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="male">Nam Mệnh</option>
                <option value="female">Nữ Mệnh</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md"
            >
              Áp Dụng Luận Tử Vi Hàng Ngày
            </button>
          </div>
        </form>
      )}

      {/* 2. THANH THÔNG TIN BÁT TỰ TỨ TRỤ ĐƯƠNG SỐ */}
      <div className="p-3 sm:p-4 rounded-xl border border-slate-800 bg-ink-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400">Đương số Bát Tự:</span>
          
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold font-oriental">
            🌟 Nhật Chủ: {userBazi.dayMasterCan} ({userBazi.dayMasterElement} - {userBazi.dayMasterYinYang})
          </span>

          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Năm {userBazi.yearCanChi} | Ngày {userBazi.dayCanChi}
          </span>

          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-gold-300 border border-slate-700">
            Mệnh: {userBazi.napAm}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400">Khí vận hôm nay:</span>
          
          <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 font-semibold">
            Thập Thần: {userBazi.todayTenGod}
          </span>

          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Phu Thê: {userBazi.branchRelation}
          </span>

          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            Vòng: {userBazi.todayLifeStage}
          </span>
        </div>
      </div>

      {/* 3. HERO OVERVIEW: THÔNG TIN TỔNG QUÁT HÔM NAY (ĐẠI CÁT / HUNG / ĐIỂM SỐ / THƠ VẬN) */}
      <div className="p-5 sm:p-6 rounded-2xl border border-gold-500/40 bg-gradient-to-br from-ink-950 via-ink-900 to-slate-900 shadow-xl relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          {/* Cột Trái: Trực quan Cát/Hung & Thông Điệp */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border font-oriental tracking-wide shadow-md ${getVerdictBadge(dailyVerdict)}`}>
                {dailyVerdict}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 text-xs">
                Ngày {dayCanChi} ({dayNapAm})
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700 text-xs">
                {lunarDateStr}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold gold-gradient-text font-oriental leading-tight">
              Tử Vi & Dịch Số Ngày {inspectedDateStr.split('-').reverse().join('/')}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {summaryVerdict}
            </p>

            {/* Thơ tóm lược cổ điển */}
            <div className="p-3 rounded-xl bg-ink-950/70 border border-slate-800/80 text-xs italic text-gold-300/90 whitespace-pre-line font-serif">
              "{classicalSummaryVerse}"
            </div>

            {/* Việc Nên Làm & Nên Kiêng nhanh */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div className="flex items-start space-x-1.5 text-emerald-300 bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Nên làm:</strong> {doActivities.slice(0, 2).join('; ')}.</span>
              </div>
              <div className="flex items-start space-x-1.5 text-rose-300 bg-rose-950/30 p-2 rounded-lg border border-rose-500/20">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>Nên kiêng:</strong> {dontActivities.slice(0, 2).join('; ')}.</span>
              </div>
            </div>
          </div>

          {/* Cột Phải: Đồng Hồ Điểm Cát Khí Trực Quan */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-ink-950/80 border border-gold-500/30 w-full md:w-56 shrink-0 shadow-lg text-center">
            <span className="text-[11px] font-semibold text-slate-400 font-oriental uppercase tracking-wider mb-1">
              Chỉ Số Cát Khí
            </span>

            {/* Radial score box */}
            <div className="relative flex items-center justify-center w-28 h-28 my-1">
              <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
              <div
                className="absolute inset-0 rounded-full border-4 border-gold-400 border-t-transparent animate-spin-slow"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold gold-gradient-text font-oriental">
                  {overallDailyScore}
                </span>
                <span className="text-[10px] text-slate-400">/ 100 điểm</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 space-y-0.5 mt-1">
              <div>Trực: <strong className="text-gold-300">{truc}</strong> • Sao: <strong className="text-gold-300">{sao28}</strong></div>
              <div>Lục Nhâm: <strong className="text-cyan-300">{lucNham.name} ({lucNham.nature})</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. THANH CHUYỂN TAB ĐẶC TRƯNG CÁC PHƯƠNG DIỆN */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('aspects')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeSubTab === 'aspects'
              ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Layers className="w-4 h-4 text-gold-400" />
          <span>5 Trụ Cột Vận Mệnh</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hexagram')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeSubTab === 'hexagram'
              ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Luận Quẻ Chu Dịch ({hexagramDivination.primaryHexagram.nameVi})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('lucnham')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeSubTab === 'lucnham'
              ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Khổng Minh Lục Nhâm ({lucNham.name})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hours')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeSubTab === 'hours'
              ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Giờ Hoàng Đạo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('directions')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeSubTab === 'directions'
              ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Navigation className="w-4 h-4 text-rose-400" />
          <span>Hướng Xuất Hành</span>
        </button>
      </div>

      {/* 5. NỘI DUNG CHI TIẾT TỪNG PHÂN HỆ */}

      {/* SUB-TAB 1: 5 TRỤ CỘT VẬN MỆNH (CÔNG DANH, SỰ NGHIỆP, TIỀN TÀI, TÌNH DUYÊN, GIA ĐẠO + SỨC KHỎE) */}
      {activeSubTab === 'aspects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Chi tiết 5 phương diện cuộc sống được tính toán theo <strong>Thập Thần Bát Tự + Trực Ngày + Cung Phu Thê</strong>:
            </span>
            <span className="text-[11px] text-gold-300/80 hidden sm:inline">100% Cổ Thư Tử Bình & Hiệp Kỷ Biện Phương Thư</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillarsList.map((item) => (
              <div
                key={item.aspect}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${getPillarBorder(item.aspect)}`}
              >
                <div>
                  {/* Header thẻ phương diện */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60">
                        {getPillarIcon(item.aspect)}
                      </div>
                      <div>
                        <strong className="text-sm font-bold text-slate-100 font-oriental block">
                          {item.pillarName}
                        </strong>
                        <span className="text-[10px] text-slate-400">{item.tenGodOrFactor}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-gold-300 font-oriental">
                        {item.score}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{item.status}</span>
                    </div>
                  </div>

                  {/* Thanh phần trăm điểm số */}
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full my-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.score >= 85
                          ? 'bg-emerald-400'
                          : item.score >= 70
                          ? 'bg-gold-400'
                          : item.score >= 55
                          ? 'bg-cyan-400'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  {/* Tiêu đề & Tóm lược */}
                  <div className="space-y-1.5 pt-1">
                    <h4 className="text-xs font-semibold text-slate-200">
                      {item.titleVi}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.summary}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed bg-ink-950/60 p-2 rounded-lg border border-slate-800/60">
                      👉 <strong>Chỉ dẫn:</strong> {item.detailedAdvice}
                    </p>
                  </div>
                </div>

                {/* Trích dẫn kinh sách cổ điển */}
                <div className="pt-2 border-t border-slate-800/60 text-[10px] text-gold-300/80 italic font-serif">
                  {item.classicalRuleQuote}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LUẬN QUẺ CHU DỊCH MAI HOA DỊCH SỐ 64 QUẺ */}
      {activeSubTab === 'hexagram' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-gold-500/30 bg-ink-900/60 text-xs text-slate-300 leading-relaxed">
            <strong className="text-gold-300 font-oriental text-sm block mb-1">
              Phép Khởi Quẻ Mai Hoa Dịch Số – Chu Dịch Toàn Thư (Thiệu Khang Tiết, Chu Văn Vương, Khổng Tử)
            </strong>
            {hexagramDivination.hexagramAnalysis}
          </div>

          {/* Hiển thị 3 quẻ: Quẻ Chủ -> Hào Động -> Quẻ Biến & Quẻ Hỗ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Quẻ Chủ */}
            <div className="p-4 rounded-xl border border-gold-500/40 bg-ink-950/70 text-center space-y-2">
              <div className="inline-block px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 text-[10px] font-semibold uppercase">
                Quẻ Chủ (Hiện Tại)
              </div>
              <h3 className="text-base font-bold text-slate-100 font-oriental">
                {hexagramDivination.primaryHexagram.nameVi}
              </h3>
              <span className="text-xs text-slate-400 block font-serif">
                {hexagramDivination.primaryHexagram.nameZh} ({hexagramDivination.primaryHexagram.symbol})
              </span>

              {renderHexagramLines(
                hexagramDivination.primaryHexagram.upperNum,
                hexagramDivination.primaryHexagram.lowerNum,
                hexagramDivination.movingLine
              )}

              <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/60 leading-relaxed text-left">
                {hexagramDivination.primaryHexagram.meaning}
              </p>
            </div>

            {/* Quẻ Biến */}
            <div className="p-4 rounded-xl border border-cyan-500/40 bg-ink-950/70 text-center space-y-2">
              <div className="inline-block px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold uppercase">
                Quẻ Biến (Tương Lai Ứng Nghiệm)
              </div>
              <h3 className="text-base font-bold text-slate-100 font-oriental">
                {hexagramDivination.futureHexagram.nameVi}
              </h3>
              <span className="text-xs text-slate-400 block font-serif">
                {hexagramDivination.futureHexagram.nameZh} ({hexagramDivination.futureHexagram.symbol})
              </span>

              {renderHexagramLines(
                hexagramDivination.futureHexagram.upperNum,
                hexagramDivination.futureHexagram.lowerNum
              )}

              <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/60 leading-relaxed text-left">
                {hexagramDivination.futureHexagram.meaning}
              </p>
            </div>

            {/* Quẻ Hỗ */}
            <div className="p-4 rounded-xl border border-purple-500/40 bg-ink-950/70 text-center space-y-2">
              <div className="inline-block px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold uppercase">
                Quẻ Hỗ (Nội Tình Tiềm Ẩn)
              </div>
              <h3 className="text-base font-bold text-slate-100 font-oriental">
                {hexagramDivination.mutualHexagram.nameVi}
              </h3>
              <span className="text-xs text-slate-400 block font-serif">
                {hexagramDivination.mutualHexagram.nameZh} ({hexagramDivination.mutualHexagram.symbol})
              </span>

              {renderHexagramLines(
                hexagramDivination.mutualHexagram.upperNum,
                hexagramDivination.mutualHexagram.lowerNum
              )}

              <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/60 leading-relaxed text-left">
                {hexagramDivination.mutualHexagram.meaning}
              </p>
            </div>
          </div>

          {/* Lời Kinh Văn Cổ Thư Chi Tiết */}
          <div className="p-5 rounded-xl border border-slate-800 bg-ink-900/60 space-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-gold-400 font-bold block font-oriental">1. Thoán Từ (Chu Văn Vương):</span>
              <p className="text-slate-300 italic pl-3 border-l-2 border-gold-500/50">
                "{hexagramDivination.primaryHexagram.judgment}"
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-cyan-400 font-bold block font-oriental">2. Đại Tượng Truyện (Khổng Tử):</span>
              <p className="text-slate-300 italic pl-3 border-l-2 border-cyan-500/50">
                "{hexagramDivination.primaryHexagram.greatImage}"
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-amber-400 font-bold block font-oriental">
                3. Lời Hào Từ Hào {hexagramDivination.movingLine} Động (Chu Công Đán):
              </span>
              <p className="text-slate-200 font-semibold italic pl-3 border-l-2 border-amber-500/50 bg-amber-950/20 p-2 rounded-r-lg">
                "{hexagramDivination.movingLineText}"
              </p>
            </div>

            <div className="space-y-1 pt-1 border-t border-slate-800">
              <span className="text-slate-400 font-bold block">4. Lời Khuyên Hành Sự Trong Ngày:</span>
              <p className="text-slate-300">
                {hexagramDivination.primaryHexagram.dailyAdvice}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: KHỔNG MINH TIỂU LỤC NHÂM THẦN QUYẾT */}
      {activeSubTab === 'lucnham' && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-ink-900/60 text-xs text-slate-300 leading-relaxed">
            <strong className="text-cyan-300 font-oriental text-sm block mb-1">
              Tiểu Lục Nhâm Khổng Minh Thần Quyết – Phương Pháp Bấm Độn Giờ Khắc (Gia Cát Vũ Hầu)
            </strong>
            Khởi từ tháng Giêng tại cung Đại An, đếm thuận theo chiều kim đồng hồ qua 6 cung: 
            <strong> Đại An ➔ Lưu Niên ➔ Tốc Hỷ ➔ Xích Khẩu ➔ Tiểu Cát ➔ Không Vong</strong>.
            Hôm nay (Tháng {convertSolarToLunar(iDay, iMonth, iYear).month}, Ngày {convertSolarToLunar(iDay, iMonth, iYear).day} Âm lịch) nhập vào cung 
            <strong className="text-gold-300"> {lucNham.name} ({lucNham.nature})</strong>.
          </div>

          {/* 6 Cung Lục Nhâm Trực Quan */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { code: 'dai_an', name: 'Đại An', nature: 'Đại Cát', num: 1 },
              { code: 'luu_nien', name: 'Lưu Niên', nature: 'Bình Hòa', num: 2 },
              { code: 'toc_hy', name: 'Tốc Hỷ', nature: 'Đại Cát', num: 3 },
              { code: 'xich_khau', name: 'Xích Khẩu', nature: 'Bất Lợi', num: 4 },
              { code: 'tieu_cat', name: 'Tiểu Cát', nature: 'Thứ Cát', num: 5 },
              { code: 'khong_vong', name: 'Không Vong', nature: 'Đại Hung', num: 6 }
            ].map((p) => {
              const isActive = lucNham.code === p.code;
              return (
                <div
                  key={p.code}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isActive
                      ? 'border-gold-400 bg-gold-500/20 shadow-lg shadow-gold-500/20 ring-2 ring-gold-400/50'
                      : 'border-slate-800 bg-ink-950/60 text-slate-400 opacity-60'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Cung {p.num}</span>
                  <h4 className={`text-base font-bold font-oriental ${isActive ? 'text-gold-300' : 'text-slate-300'}`}>
                    {p.name}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 font-semibold ${
                    p.nature === 'Đại Cát' ? 'bg-emerald-500/20 text-emerald-300' :
                    p.nature === 'Thứ Cát' ? 'bg-gold-500/20 text-gold-300' :
                    p.nature === 'Bình Hòa' ? 'bg-cyan-500/20 text-cyan-300' :
                    'bg-rose-500/20 text-rose-300'
                  }`}>
                    {p.nature}
                  </span>
                  {isActive && (
                    <div className="mt-2 pt-2 border-t border-gold-500/40 text-[10px] text-gold-200 font-semibold animate-pulse">
                      ★ Ngày Đang Soi
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Thơ Quyết & Lời Khuyên Cung Hiện Tại */}
          <div className="p-5 rounded-xl border border-gold-500/40 bg-gradient-to-br from-ink-950 to-slate-900 space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <h3 className="text-sm font-bold text-slate-100 font-oriental">
                Thơ Quyết Cung {lucNham.name} ({lucNham.hanzi}) – Hành: {lucNham.element}
              </h3>
            </div>

            <div className="p-3 rounded-lg bg-ink-900/80 border border-slate-800 text-xs text-gold-300/90 font-serif italic whitespace-pre-line leading-relaxed">
              "{lucNham.verse}"
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Diễn giải:</strong> {lucNham.summary}
            </p>

            <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
              💡 <strong>Hành sự chuẩn:</strong> {lucNham.guidance}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: GIỜ HOÀNG ĐẠO TRONG NGÀY */}
      {activeSubTab === 'hours' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Bảng 12 Canh Giờ Hoàng Đạo & Hắc Đạo (Khâm Định Hiệp Kỷ Biện Phương Thư):</span>
            <span className="text-[11px] text-emerald-400">Giờ Hoàng Đạo có sao tốt che chở</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {hourlyFortunes.map((h) => (
              <div
                key={h.branchIndex}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  h.isHoangDao
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-slate-200'
                    : 'border-slate-800/80 bg-ink-950/60 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <strong className={`font-oriental text-sm ${h.isHoangDao ? 'text-emerald-300' : 'text-slate-300'}`}>
                    Giờ {h.branchName}
                  </strong>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    h.isHoangDao ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {h.isHoangDao ? 'Hoàng Đạo' : 'Hắc Đạo'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mb-1">{h.timeRange}</div>
                <div className="text-[11px] text-gold-300/90 font-medium">{h.starName}</div>
                <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800/60 flex justify-between">
                  <span>Lục Nhâm: <strong>{h.lucNhamHour}</strong></span>
                  <span className={h.isHoangDao ? 'text-emerald-400' : 'text-slate-400'}>{h.evaluation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: HƯỚNG XUẤT HÀNH CÁT LỢI */}
      {activeSubTab === 'directions' && (
        <div className="p-5 rounded-xl border border-rose-500/30 bg-ink-900/60 space-y-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-slate-100 font-oriental">
              Phương Vị Xuất Hành & Chiêu Tài Đón Hỷ (Khâm Định Hiệp Kỷ Biện Phương Thư)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-1 text-center">
              <span className="text-[10px] font-semibold text-rose-300 uppercase tracking-wider block">
                Hướng Hỷ Thần (Niềm Vui)
              </span>
              <strong className="text-xl font-bold text-slate-100 font-oriental block py-1">
                {directions.hyThanDirection}
              </strong>
              <p className="text-[11px] text-slate-400">
                Xuất hành hướng này nghênh đón niềm vui, hòa khí và việc cưới hỏi, đàm đạo thân mật.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-1 text-center">
              <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider block">
                Hướng Tài Thần (Tài Lộc)
              </span>
              <strong className="text-xl font-bold text-slate-100 font-oriental block py-1">
                {directions.taiThanDirection}
              </strong>
              <p className="text-[11px] text-slate-400">
                Cầu tài, mở cửa hàng, ký kết giao dịch kinh tế nên đi về hướng này để đón vượng khí.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1 text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Hướng Hạc Thần (Nên Tránh)
              </span>
              <strong className="text-xl font-bold text-slate-300 font-oriental block py-1">
                {directions.hacThanDirection}
              </strong>
              <p className="text-[11px] text-slate-400">
                Hạc Thần du hành kỵ xuất hành khởi sự việc lớn đối đầu trực diện.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-ink-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {directions.explanation}
          </div>
        </div>
      )}

      {/* 6. HỒ SƠ DẪN CHỨNG CỔ THƯ (MODAL DRAWER) */}
      <div className="pt-2">
        <ClassicalEvidenceDrawer evidence={report.classicalEvidence} />
      </div>

    </div>
  );
};
