import React, { useState } from 'react';
import {
  calculateDailyHoroscope,
  DailyHoroscopeReport,
  HourlyFortune,
  DailyAspectAssessment
} from '../engine/dailyHoroscope';
import { ClassicalEvidenceDrawer } from './ClassicalEvidenceDrawer';
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
  BookOpen
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
  const [activeSubTab, setActiveSubTab] = useState<'hexagram' | 'aspects' | 'hours' | 'directions'>('hexagram');

  // Parse inspected date
  const [iYear, iMonth, iDay] = inspectedDateStr.split('-').map(Number);
  const [bYear, bMonth, bDay] = birthDateStr.split('-').map(Number);

  const report: DailyHoroscopeReport = calculateDailyHoroscope(
    iYear || 2026,
    iMonth || 10,
    iDay || 24,
    bYear || 1990,
    bMonth || 1,
    bDay || 1
  );

  const {
    hexagramDivination,
    lucNham,
    aspects,
    hourlyFortunes,
    directions,
    doActivities,
    dontActivities,
    overallDailyScore,
    dailyVerdict
  } = report;

  // Icon ánh xạ phương diện
  const getAspectIcon = (aspect: string) => {
    switch (aspect) {
      case 'career': return <Briefcase className="w-5 h-5 text-cyan-400" />;
      case 'wealth': return <Coins className="w-5 h-5 text-amber-400" />;
      case 'love': return <HeartHandshake className="w-5 h-5 text-rose-400" />;
      default: return <Activity className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 65) return 'text-gold-300 border-gold-500/40 bg-gold-500/10';
    if (score >= 50) return 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10';
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  };

  const getLucNhamBadge = (nature: string) => {
    switch (nature) {
      case 'Đại Cát':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'Thứ Cát':
        return 'bg-gold-500/20 text-gold-300 border-gold-500/50';
      case 'Bình Hòa':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
    }
  };

  // Vẽ hào âm dương (1: Dương ———, 0: Âm ——  ——)
  const renderHexagramLines = (upperNum: number, lowerNum: number, movingLineIndex?: number) => {
    // Tiên thiên bát quái lines
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
      <div className="flex flex-col space-y-1.5 w-28 mx-auto my-2">
        {all6.slice().reverse().map((val, idx) => {
          const lineNum = 6 - idx;
          const isMoving = lineNum === movingLineIndex;
          return (
            <div key={idx} className="flex items-center space-x-2">
              <span className={`text-[10px] font-mono w-4 text-right ${isMoving ? 'text-gold-400 font-bold' : 'text-slate-500'}`}>
                {lineNum}
              </span>
              <div className={`flex-1 h-3 rounded flex items-center justify-between ${isMoving ? 'ring-2 ring-gold-400 animate-pulse' : ''}`}>
                {val === 1 ? (
                  <div className={`w-full h-2 rounded ${isMoving ? 'bg-gold-400' : 'bg-slate-300'}`} />
                ) : (
                  <div className="w-full flex justify-between">
                    <div className={`w-[45%] h-2 rounded ${isMoving ? 'bg-gold-400' : 'bg-slate-400'}`} />
                    <div className={`w-[45%] h-2 rounded ${isMoving ? 'bg-gold-400' : 'bg-slate-400'}`} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="oriental-card rounded-2xl p-6 border-2 border-gold-500/50 space-y-6 bg-gradient-to-b from-ink-900/95 via-ink-950/95 to-ink-950 shadow-2xl relative overflow-hidden">
      
      {/* Decorative Aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gold-500/30">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1">
              <Scroll className="w-3.5 h-3.5" />
              <span>Mai Hoa Dịch Số • Chu Dịch • Tiểu Lục Nhâm</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
              0% AI Interference
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-oriental flex items-center space-x-2.5">
            <Compass className="w-6 h-6 text-gold-400" />
            <span>Tử Vi Hàng Ngày & Luận Quẻ Cổ Thư</span>
          </h3>
          <p className="text-xs text-slate-400">
            Khảo sự nhật dụng, vạn sự thường nhật cho ngày <strong className="text-gold-300">{report.targetDate}</strong> ({report.dayCanChi} • {report.lunarDateStr})
          </p>
        </div>

        {/* Điểm Cát Khí Tổng Hòa */}
        <div className="flex items-center space-x-3 bg-ink-950 px-4 py-2 rounded-2xl border border-gold-500/40 shadow-inner">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cát Khí Tổng Hòa</span>
            <span className="text-xs font-bold text-gold-300 font-oriental">{dailyVerdict}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold-500/15 border border-gold-400/50 flex flex-col items-center justify-center font-oriental">
            <span className="text-lg font-black text-gold-200 leading-none">{overallDailyScore}</span>
            <span className="text-[9px] text-gold-400 leading-none mt-0.5">/100đ</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('hexagram')}
          className={`px-3 py-1.5 rounded-xl text-xs font-oriental font-bold flex items-center space-x-2 transition-all ${
            activeSubTab === 'hexagram'
              ? 'bg-gold-500 text-ink-950 shadow-md font-bold'
              : 'bg-ink-900 text-slate-300 border border-slate-800 hover:border-gold-500/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Quẻ Dịch & Tiểu Lục Nhâm Ngày</span>
        </button>

        <button
          onClick={() => setActiveSubTab('aspects')}
          className={`px-3 py-1.5 rounded-xl text-xs font-oriental font-bold flex items-center space-x-2 transition-all ${
            activeSubTab === 'aspects'
              ? 'bg-gold-500 text-ink-950 shadow-md font-bold'
              : 'bg-ink-900 text-slate-300 border border-slate-800 hover:border-gold-500/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Vận Trình 4 Phương Diện Đời Sống</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hours')}
          className={`px-3 py-1.5 rounded-xl text-xs font-oriental font-bold flex items-center space-x-2 transition-all ${
            activeSubTab === 'hours'
              ? 'bg-gold-500 text-ink-950 shadow-md font-bold'
              : 'bg-ink-900 text-slate-300 border border-slate-800 hover:border-gold-500/40'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>3. Bảng 12 Giờ Hoàng Đạo & Giờ Xuất Hành</span>
        </button>

        <button
          onClick={() => setActiveSubTab('directions')}
          className={`px-3 py-1.5 rounded-xl text-xs font-oriental font-bold flex items-center space-x-2 transition-all ${
            activeSubTab === 'directions'
              ? 'bg-gold-500 text-ink-950 shadow-md font-bold'
              : 'bg-ink-900 text-slate-300 border border-slate-800 hover:border-gold-500/40'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>4. Hướng Xuất Hành & Việc Nên/Kiêng</span>
        </button>
      </div>

      {/* SUB-TAB 1: QUẺ DỊCH MAI HOA & TIỂU LỤC NHÂM */}
      {activeSubTab === 'hexagram' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Khối Quẻ Dịch 3 Cột: Quẻ Chủ - Quẻ Hỗ - Quẻ Biến */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Quẻ Chủ */}
            <div className="p-4 rounded-xl bg-ink-950/90 border border-gold-500/40 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-bold text-gold-400">Quẻ Chủ (Chánh Quái)</span>
                <span className="text-xl font-serif text-gold-300">{hexagramDivination.primaryHexagram.symbol}</span>
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-slate-100 font-oriental">
                  {hexagramDivination.primaryHexagram.nameVi}
                </h4>
                <span className="text-xs font-mono text-slate-400">{hexagramDivination.primaryHexagram.nameZh}</span>
              </div>

              {renderHexagramLines(
                hexagramDivination.primaryHexagram.upperTrigram,
                hexagramDivination.primaryHexagram.lowerTrigram,
                hexagramDivination.movingLine
              )}

              <div className="text-xs space-y-1 text-slate-300 pt-2 border-t border-slate-800/80">
                <p className="text-[11px] leading-relaxed italic text-gold-200">
                  {hexagramDivination.primaryHexagram.judgment}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {hexagramDivination.primaryHexagram.greatImage}
                </p>
              </div>
            </div>

            {/* Quẻ Hỗ (Nội tình tiềm ẩn) */}
            <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-bold text-cyan-400">Quẻ Hỗ (Khí Tiềm Ẩn)</span>
                <span className="text-xl font-serif text-cyan-300">{hexagramDivination.mutualHexagram.symbol}</span>
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-slate-100 font-oriental">
                  {hexagramDivination.mutualHexagram.nameVi}
                </h4>
                <span className="text-xs font-mono text-slate-400">{hexagramDivination.mutualHexagram.nameZh}</span>
              </div>

              {renderHexagramLines(
                hexagramDivination.mutualHexagram.upperTrigram,
                hexagramDivination.mutualHexagram.lowerTrigram
              )}

              <div className="text-xs space-y-1 text-slate-300 pt-2 border-t border-slate-800/80">
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {hexagramDivination.mutualHexagram.meaning}
                </p>
                <span className="text-[10px] text-cyan-400 block">
                  Đại biểu cho diễn biến nội tâm và tình thế ngầm định trong ngày.
                </span>
              </div>
            </div>

            {/* Quẻ Biến (Tương lai & kết quả) */}
            <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                  Quẻ Biến (Động Hào {hexagramDivination.movingLine})
                </span>
                <span className="text-xl font-serif text-emerald-300">{hexagramDivination.futureHexagram.symbol}</span>
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-slate-100 font-oriental">
                  {hexagramDivination.futureHexagram.nameVi}
                </h4>
                <span className="text-xs font-mono text-slate-400">{hexagramDivination.futureHexagram.nameZh}</span>
              </div>

              {renderHexagramLines(
                hexagramDivination.futureHexagram.upperTrigram,
                hexagramDivination.futureHexagram.lowerTrigram
              )}

              <div className="text-xs space-y-1 text-slate-300 pt-2 border-t border-slate-800/80">
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {hexagramDivination.futureHexagram.meaning}
                </p>
                <span className="text-[10px] text-emerald-400 block">
                  Định hướng xu thế hành động và kết quả về chiều tối.
                </span>
              </div>
            </div>

          </div>

          {/* Hào Động Lời Chu Công Đán */}
          <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 space-y-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-gold-400" />
              <strong className="text-xs text-gold-300 font-oriental uppercase">
                Lời Hào Động Thứ {hexagramDivination.movingLine} (Chu Công Đán Chỉ Dẫn Hành Xử):
              </strong>
            </div>
            <p className="text-sm font-semibold text-slate-100 pl-6 leading-relaxed">
              "{hexagramDivination.movingLineText}"
            </p>
            <p className="text-xs text-slate-300 pl-6 leading-relaxed">
              {hexagramDivination.hexagramAnalysis}
            </p>
          </div>

          {/* Thẻ Quẻ Khổng Minh Tiểu Lục Nhâm */}
          <div className="p-5 rounded-xl bg-ink-950 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Scroll className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-slate-100 font-oriental">
                  Khổng Minh Tiểu Lục Nhâm Chiêm Đoán: Quẻ [{lucNham.name}]
                </h4>
              </div>
              <span className={`text-[11px] px-2.5 py-0.5 rounded border font-semibold ${getLucNhamBadge(lucNham.nature)}`}>
                {lucNham.nature} • Thần: {lucNham.deity}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-ink-900/80 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-bold text-gold-400 block font-oriental">Bài Ca Quyết Khổng Minh:</span>
                <p className="text-slate-200 whitespace-pre-line font-serif leading-relaxed text-xs">
                  {lucNham.poemVi}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-ink-900/80 border border-slate-800/80 space-y-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">Ý Nghĩa Ngày Thường Nhật:</span>
                  <p className="text-slate-200 text-xs leading-relaxed">{lucNham.dailyMeaning}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 block">Khuyên Hành Động:</span>
                  <p className="text-slate-300 text-xs leading-relaxed">{lucNham.actionAdvice}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: VẬN TRÌNH 4 PHƯƠNG DIỆN ĐỜI SỐNG HÀNG NGÀY */}
      {activeSubTab === 'aspects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {(Object.keys(aspects) as (keyof typeof aspects)[]).map((key) => {
            const asp: DailyAspectAssessment = aspects[key];
            return (
              <div
                key={key}
                className="p-4 rounded-xl bg-ink-950/90 border border-slate-800 space-y-3 relative hover:border-gold-500/40 transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    {getAspectIcon(key)}
                    <h4 className="text-sm font-bold text-slate-100 font-oriental">{asp.titleVi}</h4>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${getScoreColor(asp.score)}`}>
                    {asp.score}đ • {asp.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      asp.score >= 80 ? 'bg-emerald-400' : asp.score >= 60 ? 'bg-gold-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${asp.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {asp.summary}
                </p>

                <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-slate-800/60">
                  {asp.detailedAdvice}
                </p>

                <div className="text-[10px] text-slate-500 italic font-mono pt-1">
                  {asp.classicalRuleQuote}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 3: BẢNG 12 GIỜ HOÀNG ĐẠO & GIỜ XUẤT HÀNH */}
      {activeSubTab === 'hours' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Phân định Hoàng Đạo / Hắc Đạo và Khổng Minh Lục Nhâm từng canh giờ trong ngày
            </span>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1 text-gold-300">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-400 inline-block" />
                <span>Giờ Hoàng Đạo</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                <span>Giờ Hắc Đạo</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {hourlyFortunes.map((h: HourlyFortune, idx: number) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all space-y-1.5 ${
                  h.isHoangDao
                    ? 'bg-gold-500/10 border-gold-500/40 shadow-sm ring-1 ring-gold-400/20'
                    : 'bg-ink-950 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className={`text-xs font-bold font-oriental ${h.isHoangDao ? 'text-gold-200' : 'text-slate-300'}`}>
                    Giờ {h.branchName}
                  </strong>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${h.isHoangDao ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'bg-slate-800 text-slate-400'}`}>
                    {h.isHoangDao ? 'Hoàng Đạo' : 'Hắc Đạo'}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400">{h.timeRange}</div>

                <div className="text-[11px] text-slate-300 font-medium">
                  {h.starName.split(' ')[0]}
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/60">
                  <span className="text-slate-500">Quẻ Lục Nhâm:</span>
                  <span className={`font-semibold ${['Đại An', 'Tốc Hỷ', 'Tiểu Cát'].includes(h.lucNhamHour) ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {h.lucNhamHour}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: HƯỚNG XUẤT HÀNH & VIỆC NÊN/KIÊNG */}
      {activeSubTab === 'directions' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Hướng Cát Lợi */}
          <div className="p-4 rounded-xl bg-ink-950 border border-gold-500/35 space-y-3">
            <h4 className="text-sm font-bold text-slate-100 font-oriental flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-gold-400" />
              <span>Phương Vị Xuất Hành Cát Lợi Trong Ngày (Hiệp Kỷ Biện Phương Thư)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-ink-900 border border-emerald-500/30 space-y-1">
                <span className="text-emerald-300 font-bold block">★ Hướng Hỷ Thần:</span>
                <span className="text-base font-bold text-slate-100 font-oriental block">{directions.hyThanDirection}</span>
                <p className="text-[11px] text-slate-400">Xuất hành hướng này đón nhận niềm vui, gặp gỡ nhân duyên tốt đẹp, hòa khí gia tăng.</p>
              </div>

              <div className="p-3 rounded-lg bg-ink-900 border border-gold-500/30 space-y-1">
                <span className="text-gold-300 font-bold block">★ Hướng Tài Thần:</span>
                <span className="text-base font-bold text-slate-100 font-oriental block">{directions.taiThanDirection}</span>
                <p className="text-[11px] text-slate-400">Xuất hành hoặc giao dịch theo phương này lợi cho buôn bán, kinh doanh, đón tài đón lộc.</p>
              </div>

              <div className="p-3 rounded-lg bg-ink-900 border border-rose-500/30 space-y-1">
                <span className="text-rose-400 font-bold block">⚠ Hướng Hạc Thần (Cần Tránh):</span>
                <span className="text-base font-bold text-slate-100 font-oriental block">{directions.hacThanDirection}</span>
                <p className="text-[11px] text-slate-400">Hướng hung thần lưu trú trong ngày, đi xa hoặc khởi sự lớn nên tránh đối diện phương này.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
              {directions.explanation}
            </p>
          </div>

          {/* Việc Nên Làm & Việc Nên Kiêng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            <div className="p-4 rounded-xl bg-ink-950 border border-emerald-500/30 space-y-2">
              <span className="text-sm font-bold text-emerald-300 font-oriental flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Việc Nên Làm Trong Ngày:</span>
              </span>
              <ul className="space-y-1.5 pt-1">
                {doActivities.map((act, i) => (
                  <li key={i} className="flex items-start space-x-2 text-slate-200">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-ink-950 border border-rose-500/30 space-y-2">
              <span className="text-sm font-bold text-rose-300 font-oriental flex items-center space-x-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Việc Nên Kiêng Cữ Trong Ngày:</span>
              </span>
              <ul className="space-y-1.5 pt-1">
                {dontActivities.map((act, i) => (
                  <li key={i} className="flex items-start space-x-2 text-slate-200">
                    <span className="text-rose-400 font-bold mt-0.5">✗</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* Hồ sơ dẫn chứng cổ thư minh bạch (Classical Evidence Profile) */}
      <div className="pt-2">
        <ClassicalEvidenceDrawer evidence={report.classicalEvidence} />
      </div>

    </div>
  );
};
