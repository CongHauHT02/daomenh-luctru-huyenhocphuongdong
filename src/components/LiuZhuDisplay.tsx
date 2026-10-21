import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LiuZhuSchool, generateLiuZhuChart } from '../engine/liuzhu';
import { ClassicalEvidenceDrawer } from './ClassicalEvidenceDrawer';
import { buildVerifiedInterpretationItem } from '../engine/classicalEvidence';
import {
  Layers,
  Sparkles,
  BookOpen,
  Info,
  Scale,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

import { PersonalProfileBar } from './PersonalProfileBar';

export const LiuZhuDisplay: React.FC = () => {
  const { currentBaziChart } = useApp();
  const [selectedSchool, setSelectedSchool] = useState<LiuZhuSchool>('classical_thai_menh');
  const [minuteOffset, setMinuteOffset] = useState<number>(30);

  // Generate LiuZhu chart for current bazi and selected school
  const liuzhuChart = generateLiuZhuChart(currentBaziChart, selectedSchool, minuteOffset);

  const getElementBadgeColor = (element: string) => {
    switch (element) {
      case 'Kim': return 'bg-amber-100/10 text-amber-200 border-amber-300/40';
      case 'Mộc': return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
      case 'Thủy': return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40';
      case 'Hỏa': return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      case 'Thổ': return 'bg-yellow-600/15 text-yellow-300 border-yellow-600/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const renderSixPillarCard = (pillar: any, index: number, isExtra: boolean = false) => {
    return (
      <div className={`oriental-card rounded-2xl p-4 sm:p-5 text-center transition-all ${
        isExtra 
          ? 'border-jade-500/50 shadow-jade-glow bg-jade-950/20' 
          : 'border-slate-800 hover:border-gold-500/40'
      }`}>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-400">
            Trụ {index + 1}: {pillar.title}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
            pillar.domain === 'Tiên Thiên' ? 'bg-gold-500/20 text-gold-300' : 'bg-jade-500/20 text-jade-300'
          }`}>
            {pillar.domain}
          </span>
        </div>

        {/* Can */}
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-oriental mb-1">
            {pillar.canChi.can}
          </div>
          <div className="flex items-center justify-center space-x-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getElementBadgeColor(pillar.canChi.element)}`}>
              {pillar.canChi.element} ({pillar.canChi.yinYang})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {pillar.tenGodStem}
          </span>
        </div>

        {/* Chi */}
        <div className="mt-2 pt-2 border-t border-slate-800/80">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-oriental mb-1">
            {pillar.canChi.chi}
          </div>
          <span className="text-xs text-gold-300 block mb-1">
            {pillar.napAm}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-ink-800 text-slate-300 border border-slate-700">
            {pillar.lifeStage}
          </span>
        </div>

        {/* Ý nghĩa */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-left">
          <span className="text-[10px] font-semibold text-gold-300 block mb-1">Ý nghĩa & Cổ thư:</span>
          <p className="text-[11px] text-slate-300 line-clamp-3 leading-snug">
            {pillar.significance}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gold-gradient-text font-oriental mb-2">
          Hệ Thống Lục Trụ Mệnh Lý Chuyên Biệt
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm">
          Mở rộng cấu trúc 4 trụ Bát Tự lên 6 trụ (12 Can Chi) theo các trường phái học thuật có nguồn gốc rõ ràng.
          Minh bạch phương pháp luận, không gán ghép bừa bãi.
        </p>
      </div>

      {/* Personal Profile Bar */}
      <PersonalProfileBar moduleTitle="Lục Trụ Mệnh Lý" />

      {/* School Selection Banner */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-200 font-oriental flex items-center space-x-2">
              <Layers className="w-5 h-5 text-gold-400" />
              <span>Lựa Chọn Trường Phái Học Thuật Lục Trụ</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Hệ thống cung cấp 2 trường phái đã được xác minh văn bản để người dùng đối chiếu khách quan.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSchool('classical_thai_menh')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedSchool === 'classical_thai_menh'
                  ? 'bg-gold-500 text-ink-950 shadow-gold-glow'
                  : 'bg-ink-800 text-slate-300 hover:bg-ink-700'
              }`}
            >
              1. Thai Nguyên & Mệnh Cung (Cổ Điển)
            </button>
            <button
              onClick={() => setSelectedSchool('liu_guang_bin_khac_tru')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedSchool === 'liu_guang_bin_khac_tru'
                  ? 'bg-gold-500 text-ink-950 shadow-gold-glow'
                  : 'bg-ink-800 text-slate-300 hover:bg-ink-700'
              }`}
            >
              2. Khắc Trụ & Mệnh Cung (Lưu Quảng Bân)
            </button>
          </div>
        </div>

        {/* Selected School Explanation */}
        <div className="mt-4 p-4 rounded-xl bg-ink-950/70 border border-slate-800 flex items-start space-x-3">
          <BookOpen className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <div>
              <strong className="text-gold-300 text-sm">{liuzhuChart.school.name}</strong>
              <span className="text-slate-400 ml-2">({liuzhuChart.school.authorOrSource})</span>
            </div>
            <p className="leading-relaxed">{liuzhuChart.school.description}</p>
          </div>
        </div>
      </div>

      {/* 6 Pillars Interactive Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-200 font-oriental flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span>Đồ Bàn Sáu Trụ (Lục Trụ Đồ)</span>
          </h2>
          <span className="text-xs text-slate-400">
            Đầy đủ 6 Trụ = 12 Can Chi (Gồm Tiên Thiên & Hậu Thiên)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {renderSixPillarCard(liuzhuChart.pillars.year, 0)}
          {renderSixPillarCard(liuzhuChart.pillars.month, 1)}
          {renderSixPillarCard(liuzhuChart.pillars.day, 2)}
          {renderSixPillarCard(liuzhuChart.pillars.hour, 3)}
          {renderSixPillarCard(liuzhuChart.pillars.fifthPillar, 4, true)}
          {renderSixPillarCard(liuzhuChart.pillars.sixthPillar, 5, true)}
        </div>

        {/* Evidence Drawer for Classical LiuZhu Rule */}
        {selectedSchool === 'classical_thai_menh' && (
          <div className="mt-4">
            {(() => {
              const thaiEvidence = buildVerifiedInterpretationItem(
                'Căn Cứ Cổ Thư Xác Định Trụ Thai Nguyên (Trụ 5)',
                'RULE-LZ-001',
                `Trụ Thai Nguyên (${liuzhuChart.pillars.fifthPillar.canChi.fullName} - ${liuzhuChart.pillars.fifthPillar.napAm}) là khởi nguồn thụ nhận tiên thiên chân khí, quyết định thể trạng và phúc đức nguyên sơ.`,
                `Chi Tháng (${currentBaziChart.pillars.month.canChi.chi}) tiến 3, Can Tháng (${currentBaziChart.pillars.month.canChi.can}) tiến 1 định vị Trụ Thai Nguyên.`
              );
              return thaiEvidence.evidence ? (
                <ClassicalEvidenceDrawer evidence={thaiEvidence.evidence} />
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* Synthesis & Comparison with Bazi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Synthesis */}
        <div className="lg:col-span-5 oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4">
          <h3 className="text-base font-bold text-gold-300 font-oriental flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Scale className="w-5 h-5 text-gold-400" />
            <span>Luận Giải Tổng Hợp Sáu Trụ</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-ink-950/70 border border-slate-800">
              <span className="font-semibold text-gold-300 block mb-1">Thế Khí Tiên Thiên (Trụ 1, 2 & 5):</span>
              <p>{liuzhuChart.synthesis.tienThienBalance}</p>
            </div>

            <div className="p-3 rounded-xl bg-ink-950/70 border border-slate-800">
              <span className="font-semibold text-jade-300 block mb-1">Thế Khí Hậu Thiên (Trụ 3, 4 & 6):</span>
              <p>{liuzhuChart.synthesis.hauThienSupport}</p>
            </div>

            <div className="p-3 rounded-xl bg-ink-950/70 border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-1">Quan Hệ Đặc Thù:</span>
              <ul className="space-y-1 text-slate-400">
                {liuzhuChart.synthesis.specialCombinations.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Deep Comparison Table */}
        <div className="lg:col-span-7 oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4">
          <h3 className="text-base font-bold text-slate-200 font-oriental flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Info className="w-5 h-5 text-gold-400" />
            <span>Bảng So Sánh Đối Chiếu: Bát Tự Tứ Trụ vs Lục Trụ Mệnh Lý</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ink-950 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Tiêu Chí</th>
                  <th className="py-2.5 px-3 font-semibold text-gold-300">Bát Tự Tứ Trụ</th>
                  <th className="py-2.5 px-3 font-semibold text-jade-300">Lục Trụ Mệnh Lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {liuzhuChart.comparisonWithBazi.systemDifferences.map((item, idx) => (
                  <tr key={idx} className="hover:bg-ink-900/40">
                    <td className="py-2.5 px-3 font-medium text-slate-200">{item.factor}</td>
                    <td className="py-2.5 px-3 text-slate-300">{item.baziMethod}</td>
                    <td className="py-2.5 px-3 text-slate-300">{item.liuzhuMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-ink-950/80 border border-slate-800 text-xs text-slate-400 italic">
            &ldquo;{liuzhuChart.comparisonWithBazi.philosophicalNote}&rdquo;
          </div>
        </div>

      </div>

    </div>
  );
};
