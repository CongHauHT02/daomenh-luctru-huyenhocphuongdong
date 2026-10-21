import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TuViPalace, TuViStar } from '../engine/tuvi';
import { ClassicalEvidenceDrawer } from './ClassicalEvidenceDrawer';
import { PersonalProfileBar } from './PersonalProfileBar';
import { buildVerifiedInterpretationItem } from '../engine/classicalEvidence';
import {
  Sparkles,
  Compass,
  Star,
  ShieldCheck,
  ChevronRight,
  Info,
  BookOpen,
  Layers,
  Award
} from 'lucide-react';

export const TuViDisplay: React.FC = () => {
  const { currentTuViChart } = useApp();
  const [selectedPalaceIndex, setSelectedPalaceIndex] = useState<number>(0);

  const selectedPalace = currentTuViChart.palaces.find(p => p.index === selectedPalaceIndex) || currentTuViChart.palaces[0];

  const getStarBadgeClass = (star: TuViStar) => {
    switch (star.type) {
      case 'chinh_tinh':
        return 'text-gold-300 font-bold';
      case 'tu_hoa':
        return 'text-emerald-400 font-bold bg-emerald-950/60 px-1 rounded border border-emerald-500/30';
      case 'sat_tinh':
        return 'text-rose-400';
      default:
        return 'text-slate-300';
    }
  };

  const getBrightnessBadge = (b?: string) => {
    if (!b) return null;
    const colors: Record<string, string> = {
      'Miếu': 'text-amber-300 bg-amber-950/50 border-amber-500/40',
      'Vượng': 'text-emerald-300 bg-emerald-950/50 border-emerald-500/40',
      'Đắc': 'text-cyan-300 bg-cyan-950/50 border-cyan-500/40',
      'Hãm': 'text-rose-400 bg-rose-950/50 border-rose-500/40',
      'Bình': 'text-slate-400 bg-slate-900 border-slate-700'
    };
    return (
      <span className={`text-[9px] px-1 py-0.2 rounded border font-semibold ml-1 ${colors[b] || 'text-slate-400'}`}>
        {b}
      </span>
    );
  };

  const getTuHoaBadge = (starName: string) => {
    if (starName === 'Hóa Lộc') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (starName === 'Hóa Quyền') return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (starName === 'Hóa Khoa') return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gold-gradient-text font-oriental mb-2">
          Hệ Thống Tử Vi Đẩu Số 12 Cung
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm">
          An Mệnh Thân, định Cục số, phân bổ đầy đủ 14 Chính Tinh, Tứ Hóa, Lục Cát Tinh, Lục Sát Tinh, Vòng Bác Sĩ, Vòng Thái Tuế và Vòng Tràng Sinh theo đúng quy tắc cổ thư Trần Đoàn.
        </p>
      </div>

      {/* Input Form & Synchronized Profile Bar */}
      <PersonalProfileBar moduleTitle="Tử Vi Đẩu Số 12 Cung" />

      {/* Chart Profile Strip */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/30">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-2.5 rounded-xl bg-ink-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Đương Số</span>
            <strong className="text-sm text-slate-100 font-semibold">{currentTuViChart.profile.fullName}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-ink-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Âm Dương Nam Nữ</span>
            <strong className="text-sm text-gold-300 font-semibold">{currentTuViChart.profile.yinYangNamNu}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-ink-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Cục Số</span>
            <strong className="text-sm text-jade-300 font-semibold">{currentTuViChart.cuc.name} ({currentTuViChart.cuc.number})</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-ink-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Cung Mệnh</span>
            <strong className="text-sm text-slate-100 font-semibold">Tại {currentTuViChart.menhPalaceBranch}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-ink-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Cung Thân</span>
            <strong className="text-sm text-slate-100 font-semibold">Tại {currentTuViChart.thanPalaceBranch}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-ink-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Ngày Sinh Âm Lịch</span>
            <strong className="text-sm text-slate-100 font-semibold">{currentTuViChart.profile.birthLunar}</strong>
          </div>
        </div>
      </div>

      {/* 12 Palaces Grid Display */}
      <div>
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-200 font-oriental flex items-center space-x-2">
              <Compass className="w-5 h-5 text-gold-400" />
              <span>Địa Bàn Mười Hai Cung Chức Vị (Hiện Đầy Đủ Tinh Diệu)</span>
            </h2>
            <span className="text-xs text-slate-400">
              Nhấn vào từng cung để xem luận giải chi tiết, chính tinh, phụ tinh và tam phương tứ chính.
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-gold-400"></span><span className="text-slate-300">Chính Tinh</span></span>
            <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><span className="text-slate-300">Cát Tinh & Tứ Hóa</span></span>
            <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span><span className="text-slate-300">Sát Tinh</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentTuViChart.palaces.map(palace => {
            const isSelected = selectedPalaceIndex === palace.index;
            return (
              <div
                key={palace.index}
                onClick={() => setSelectedPalaceIndex(palace.index)}
                className={`oriental-card rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-gold-500 shadow-gold-glow bg-ink-900/95 ring-2 ring-gold-500/50'
                    : palace.isMenh
                    ? 'border-gold-500/60 bg-gold-950/15'
                    : 'border-slate-800 hover:border-gold-500/40'
                }`}
              >
                <div>
                  {/* Palace Header */}
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <span className="text-sm font-bold text-slate-100 font-oriental">
                        {palace.name}
                      </span>
                      {palace.isMenh && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gold-500 text-ink-950">MỆNH</span>
                      )}
                      {palace.isThan && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-jade-500 text-ink-950">THÂN</span>
                      )}
                      {palace.trietTuan.map((tt, idx) => (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            tt === 'Triệt' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-ink-950'
                          }`}
                        >
                          {tt.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {palace.can} {palace.branch}
                    </span>
                  </div>

                  {/* 1. Major Stars (Chính Tinh) */}
                  <div className="min-h-[46px] mb-2 space-y-1">
                    {palace.mainStars.length > 0 ? (
                      palace.mainStars.map((star, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gold-300">
                            ★ {star.name}
                          </span>
                          {getBrightnessBadge(star.brightness)}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic block pt-1">Vô Chính Diệu</span>
                    )}
                  </div>

                  {/* 2. Tứ Hóa Stars */}
                  {palace.tuHoaStars.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2 pt-1 border-t border-slate-800/60">
                      {palace.tuHoaStars.map((th, thIdx) => (
                        <span
                          key={thIdx}
                          className={`text-[10px] px-1.5 py-0.2 rounded font-bold border ${getTuHoaBadge(th.name)}`}
                        >
                          {th.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 3. Assistant Stars (Cát Tinh) */}
                  <div className="flex flex-wrap gap-1 mb-2 pt-1 border-t border-slate-800/60 min-h-[24px]">
                    {palace.assistantStars.map((star, aIdx) => (
                      <span
                        key={aIdx}
                        className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                      >
                        {star.name}
                      </span>
                    ))}
                    {palace.assistantStars.length === 0 && (
                      <span className="text-[10px] text-slate-600 italic">Không có phụ cát tinh</span>
                    )}
                  </div>

                  {/* 4. Bad Stars (Sát Tinh & Bại Tinh) */}
                  {palace.badStars.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2 pt-1 border-t border-slate-800/60">
                      {palace.badStars.map((star, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/40 text-rose-300 border border-rose-500/30"
                        >
                          {star.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Palace Footer: Vòng Sao & Đại Hạn */}
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vòng Tuế: <span className="text-gold-300/90 font-medium">{palace.thaiTueStar}</span></span>
                    <span className="text-slate-500">Bác Sĩ: <span className="text-cyan-300/90 font-medium">{palace.bacSiStar}</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tràng Sinh: <span className="text-purple-300/90 font-medium">{palace.trangSinhStar}</span></span>
                    <span className="font-semibold text-gold-400">
                      {palace.majorPeriod.startAge} - {palace.majorPeriod.endAge}t
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Palace Detailed Analysis & Tam Phuong Tu Chinh */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Palace Details */}
        <div className="lg:col-span-7 oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400">Chi Tiết Cung Đang Chọn</span>
              <h3 className="text-xl font-bold gold-gradient-text font-oriental">
                Cung {selectedPalace.name} ({selectedPalace.can} {selectedPalace.branch})
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-300 bg-ink-950 px-3 py-1.5 rounded-lg border border-slate-800 block">
                Đại hạn: {selectedPalace.majorPeriod.startAge} - {selectedPalace.majorPeriod.endAge} tuổi
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Tràng Sinh: {selectedPalace.trangSinhStar} | Bác Sĩ: {selectedPalace.bacSiStar}
              </span>
            </div>
          </div>

          {/* Main Stars Detail */}
          <div>
            <h4 className="text-xs font-semibold text-gold-300 mb-2">Chính Tinh Tọa Thủ & Biểu Trưng:</h4>
            {selectedPalace.mainStars.length > 0 ? (
              <div className="space-y-2">
                {selectedPalace.mainStars.map((star, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-ink-950/70 border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-1">
                      <span className="text-gold-300">★ {star.name} ({star.element})</span>
                      <span>Độ Sáng: {star.brightness}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{star.meaning}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-ink-950/70 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                Cung Vô Chính Diệu: Không có chính tinh tọa thủ, cần mượn chính tinh của cung xung chiếu (Cung đối diện) để luận đoán khí thế. Người có cung Mệnh Vô Chính Diệu thường linh hoạt, thích ứng hoàn cảnh nhanh nhưng cần tự bồi đắp định lực.
              </div>
            )}
          </div>

          {/* Phụ Tinh & Tứ Hóa Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-ink-950/70 border border-emerald-500/25 space-y-1.5">
              <span className="font-semibold text-emerald-300 block">Cát Tinh Hội Tụ ({selectedPalace.assistantStars.length}):</span>
              {selectedPalace.assistantStars.length > 0 ? (
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {selectedPalace.assistantStars.map((st, i) => (
                    <li key={i}>• <strong>{st.name}:</strong> {st.meaning}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-slate-500 italic">Không có cát tinh tại cung này.</p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-ink-950/70 border border-rose-500/25 space-y-1.5">
              <span className="font-semibold text-rose-300 block">Sát Tinh & Bại Tinh ({selectedPalace.badStars.length}):</span>
              {selectedPalace.badStars.length > 0 ? (
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {selectedPalace.badStars.map((st, i) => (
                    <li key={i}>• <strong>{st.name}:</strong> {st.meaning}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-emerald-400 italic">Cung này thanh sạch, không gặp sát tinh trực xung.</p>
              )}
            </div>
          </div>

          {/* Classical Evidence for Cung Menh */}
          {selectedPalace.isMenh && (
            <div className="pt-2 border-t border-slate-800">
              {(() => {
                const menhEvidence = buildVerifiedInterpretationItem(
                  'Căn Cứ Cổ Thư Luận Định Cung Mệnh & Chính Tinh Tọa Thủ',
                  'RULE-TV-001',
                  `Cung Mệnh tại ${selectedPalace.can} ${selectedPalace.branch} quản định 50% cốt cách tiên thiên và thế lực thọ yểu phú quý của một đời.`,
                  `Cung Mệnh đóng tại ${selectedPalace.branch}, Cục số ${currentTuViChart.cuc.name}, Can Chi năm sinh ${currentTuViChart.profile.birthLunar}.`
                );
                return menhEvidence.evidence ? (
                  <ClassicalEvidenceDrawer evidence={menhEvidence.evidence} />
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Tam Phương Tứ Chính */}
        <div className="lg:col-span-5 oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4">
          <h3 className="text-base font-bold text-slate-200 font-oriental pb-3 border-b border-slate-800 flex items-center space-x-2">
            <Star className="w-5 h-5 text-gold-400" />
            <span>Tam Phương Tứ Chính Cung Mệnh</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-ink-950/70 border border-gold-500/20">
              <span className="text-[10px] text-gold-400 uppercase tracking-wider block mb-0.5">Cung Bản Mệnh</span>
              <strong className="text-sm text-slate-100 block">{currentTuViChart.tamPhuongTuChinhMenh.menh}</strong>
            </div>

            <div className="p-3 rounded-xl bg-ink-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Cung Tài Bạch (Hội tụ)</span>
              <strong className="text-sm text-slate-200 block">{currentTuViChart.tamPhuongTuChinhMenh.taiBach}</strong>
            </div>

            <div className="p-3 rounded-xl bg-ink-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Cung Quan Lộc (Hội tụ)</span>
              <strong className="text-sm text-slate-200 block">{currentTuViChart.tamPhuongTuChinhMenh.quanLoc}</strong>
            </div>

            <div className="p-3 rounded-xl bg-ink-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Cung Thiên Di (Xung chiếu)</span>
              <strong className="text-sm text-slate-200 block">{currentTuViChart.tamPhuongTuChinhMenh.thienDi}</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-ink-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
            <Info className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
            <span>Tam Phương Tứ Chính là trụ cột xem xét toàn diện Mệnh Tài Quan Di, đánh giá độ vững vàng và cơ hội thành công của bản mệnh.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
