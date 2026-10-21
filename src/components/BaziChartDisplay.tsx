import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BaziPillar } from '../engine/bazi';
import { generateBaziInterpretation } from '../engine/aiInterpreter';
import { ClassicalEvidenceDrawer } from './ClassicalEvidenceDrawer';
import { PersonalProfileBar } from './PersonalProfileBar';
import {
  Scroll,
  Sparkles,
  BookOpen,
  Award,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Heart,
  Briefcase,
  CheckCircle,
  Clock,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export const BaziChartDisplay: React.FC = () => {
  const { currentBaziChart, calculateAllCharts, saveCurrentProfile } = useApp();
  const [activeReportTab, setActiveReportTab] = useState<'interpretations' | 'interactions' | 'summary' | 'audit'>('interpretations');

  const report = generateBaziInterpretation(currentBaziChart);

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

  const renderPillarCard = (pillar: BaziPillar, isDayMaster: boolean = false) => {
    return (
      <div className={`oriental-card rounded-2xl p-4 sm:p-5 text-center transition-all ${
        isDayMaster ? 'border-gold-500/80 shadow-gold-glow bg-ink-900/90' : 'border-slate-800 hover:border-gold-500/40'
      }`}>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-400">{pillar.title}</span>
          {isDayMaster && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500 text-ink-950 uppercase tracking-wider">
              Nhật Chủ
            </span>
          )}
        </div>

        {/* Thiên Can */}
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-oriental mb-1">
            {pillar.canChi.can}
          </div>
          <div className="flex items-center justify-center space-x-1.5">
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getElementBadgeColor(pillar.canChi.element)}`}>
              {pillar.canChi.element} ({pillar.canChi.yinYang})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {pillar.tenGodStem}
          </span>
        </div>

        {/* Địa Chi */}
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-oriental mb-1">
            {pillar.canChi.chi}
          </div>
          <span className="text-xs text-slate-400 block mb-2">
            Nạp Âm: <span className="text-gold-300 font-medium">{pillar.napAm}</span>
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-ink-800 text-slate-300 border border-slate-700">
            Vòng: {pillar.lifeStage}
          </span>
        </div>

        {/* Tàng Can & Thập Thần */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-left">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1.5 text-center">
            Địa Chi Tàng Can
          </span>
          <div className="space-y-1">
            {pillar.hiddenStems.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px] p-1 rounded bg-ink-950/70 border border-slate-800/50">
                <span className="font-semibold text-slate-200">
                  {h.stem} <span className="text-[10px] text-slate-400 font-normal">({h.type})</span>
                </span>
                <span className="text-gold-400 text-[10px]">{h.tenGod}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gold-gradient-text font-oriental mb-2">
          Hệ Thống Lập Mệnh Bát Tự Tứ Trụ
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm">
          Tính toán Thiên Can, Địa Chi, Tàng Can, Thập Thần, Vòng Trường Sinh và Vượng Suy theo chuẩn cổ thư Tử Bình.
          Toàn bộ phép tính phân định tiết khí theo kinh độ mặt trời VSOP87, không dùng suy đoán của AI.
        </p>
      </div>

      {/* Input Form & Synchronized Profile Bar */}
      <PersonalProfileBar moduleTitle="Bát Tự Tứ Trụ" />

      {/* 4 Pillars Grid Display */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-200 font-oriental flex items-center space-x-2">
            <Scroll className="w-5 h-5 text-gold-400" />
            <span>Đồ Bàn Bát Tự Tứ Trụ</span>
          </h2>
          <span className="text-xs text-slate-400">
            Trụ Năm (Gốc) &rarr; Trụ Tháng (Môn Hộ) &rarr; Trụ Ngày (Nhật Chủ) &rarr; Trụ Giờ (Quy Túc)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {renderPillarCard(currentBaziChart.pillars.year)}
          {renderPillarCard(currentBaziChart.pillars.month)}
          {renderPillarCard(currentBaziChart.pillars.day, true)}
          {renderPillarCard(currentBaziChart.pillars.hour)}
        </div>
      </div>

      {/* Day Master Strength & Gods (Dụng Thần / Hỷ Thần) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Day Master Gauge */}
        <div className="oriental-card rounded-2xl p-5 border border-gold-500/25 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Nội Lực Nhật Chủ (Day Master)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-100 font-oriental">
              {currentBaziChart.dayMaster.strength}
            </span>
            <span className="text-sm font-semibold text-gold-300">
              {currentBaziChart.dayMaster.score} / 100 Điểm
            </span>
          </div>
          <div className="w-full bg-ink-950 rounded-full h-3 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-jade-500 via-gold-500 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentBaziChart.dayMaster.score}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nhật Can <strong className="text-slate-200">{currentBaziChart.dayMaster.can}</strong> ({currentBaziChart.dayMaster.element} {currentBaziChart.dayMaster.yinYang}).
            Sinh vào tháng <strong className="text-slate-200">{currentBaziChart.pillars.month.canChi.chi}</strong>.
          </p>
        </div>

        {/* Gods (Dụng Thần / Hỷ Thần / Kỵ Thần) */}
        <div className="md:col-span-2 oriental-card rounded-2xl p-5 border border-gold-500/25 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Tam Thần Bát Tự (Dụng Thần - Hỷ Thần - Kỵ Thần)
          </span>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-jade-950/60 border border-jade-500/30">
              <span className="text-[11px] text-jade-400 block mb-0.5 font-semibold">Dụng Thần (Cốt lõi)</span>
              <strong className="text-sm text-jade-200 block">{currentBaziChart.gods.dungThan}</strong>
            </div>
            <div className="p-3 rounded-xl bg-gold-950/60 border border-gold-500/30">
              <span className="text-[11px] text-gold-400 block mb-0.5 font-semibold">Hỷ Thần (Tương sinh)</span>
              <strong className="text-sm text-gold-200 block">{currentBaziChart.gods.hyThan}</strong>
            </div>
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30">
              <span className="text-[11px] text-rose-400 block mb-0.5 font-semibold">Kỵ Thần (Cần hóa giải)</span>
              <strong className="text-sm text-rose-200 block">{currentBaziChart.gods.kyThan}</strong>
            </div>
          </div>
          <p className="text-xs text-slate-300 italic pt-1 border-t border-slate-800">
            &ldquo;{currentBaziChart.gods.reasoning}&rdquo;
          </p>
        </div>

      </div>

      {/* Đại Vận (Major 10-Year Luck Cycles) */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200 font-oriental flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-gold-400" />
            <span>Đại Vận Vận Trình (8 Bước Chuyển Tiếp)</span>
          </h3>
          <span className="text-xs text-slate-400">Khởi vận mỗi 10 năm theo quy tắc âm dương thuận nghịch</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {currentBaziChart.daiVan.map((dv) => (
            <div key={dv.step} className="p-3 rounded-xl bg-ink-950/80 border border-slate-800 text-center hover:border-gold-500/40 transition-colors">
              <span className="text-[11px] text-gold-400 font-bold block mb-1">
                {dv.startAge} - {dv.endAge} Tuổi
              </span>
              <div className="text-lg font-bold text-slate-100 font-oriental">
                {dv.canChi.fullName}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {dv.startYear} - {dv.endYear}
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                {dv.napAm}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hệ Thống Luận Lý Thuần Cổ Thư (Zero-AI Decision Report) */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-6">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-gold-400" />
              <h3 className="text-xl font-bold gold-gradient-text font-oriental">
                Hồ Sơ Luận Giải Cổ Thư & Dẫn Chứng Xác Minh
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tuân thủ Mục XIV & XV: 100% nhận định truy xuất nguồn gốc sách cổ, trang in, trang PDF. Cấm AI can thiệp vào lá số.
            </p>
          </div>

          {/* Report Tabs */}
          <div className="flex flex-wrap gap-1 bg-ink-950 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'interpretations', label: 'Hồ Sơ Luận Giải (A → H)' },
              { id: 'interactions', label: 'Tương Tác Địa Chi' },
              { id: 'summary', label: 'Cấu Trúc Tứ Trụ' },
              { id: 'audit', label: 'Chứng Thư 0% AI Can Thiệp' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveReportTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeReportTab === tab.id
                    ? 'bg-gold-500 text-ink-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="text-sm text-slate-300 leading-relaxed min-h-[160px]">
          {activeReportTab === 'interpretations' && (
            <div className="space-y-5">
              {report.items.map((item, idx) => (
                <div key={item.id || idx} className="p-4 sm:p-5 rounded-2xl bg-ink-950/70 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                    <span className="text-xs font-bold text-gold-300 font-oriental tracking-wide">
                      {idx + 1}. {item.topicTitle}
                    </span>
                    {item.hasVerifiedEvidence && item.evidence ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>MÃ QUY TẮC: {item.evidence.ruleCode}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>CHƯA XÁC MINH SỐ TRANG CỔ THƯ</span>
                      </span>
                    )}
                  </div>

                  {item.hasVerifiedEvidence && item.evidence ? (
                    <div>
                      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-3">
                        {item.conclusion}
                      </p>
                      {/* Detailed Evidence Drawer with 8 fields A -> H */}
                      <ClassicalEvidenceDrawer evidence={item.evidence} />
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
                      <div className="flex items-center space-x-2 font-semibold text-xs text-amber-300">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>Chưa có đủ căn cứ cổ thư đã xác minh để đưa ra kết luận theo tiêu chuẩn của hệ thống.</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {item.unverifiedFallbackNotice || 'Hệ thống tuân thủ nghiêm ngặt nguyên tắc: "Không có nguồn xác minh: không tạo quy tắc. Không đủ căn cứ: không đưa ra kết luận". Tuyệt đối không dùng AI để phỏng đoán kết quả.'}
                      </p>
                      <div className="text-[10px] text-slate-400 italic pt-1 border-t border-amber-500/20">
                        Nguyên tắc tối thượng: Không được thay thế phần thiếu căn cứ bằng suy luận của AI.
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeReportTab === 'interactions' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-ink-950/60 border border-slate-800/80 space-y-2">
                  <span className="font-semibold text-gold-300 text-xs block">Lục Hợp & Tam Hợp Địa Chi:</span>
                  {currentBaziChart.interactions.hop.length > 0 ? (
                    currentBaziChart.interactions.hop.map((item, i) => (
                      <p key={i} className="text-jade-300 text-xs">• {item}</p>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Không xuất hiện Lục Hợp hoặc Tam Hợp trực tiếp giữa các trụ.</p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-ink-950/60 border border-slate-800/80 space-y-2">
                  <span className="font-semibold text-rose-300 text-xs block">Tương Xung, Hình, Hại, Phá:</span>
                  {currentBaziChart.interactions.xung.length > 0 ? (
                    currentBaziChart.interactions.xung.map((item, i) => (
                      <p key={i} className="text-rose-300 text-xs">• {item}</p>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Không có xung khắc trực diện giữa các chi.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeReportTab === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-ink-950/60 border border-slate-800/80 space-y-2">
                <span className="font-semibold text-gold-300 text-xs block">Cấu Trúc Tứ Trụ Căn Bản:</span>
                <p className="text-xs text-slate-200">{report.calculatedSummary}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-ink-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dụng Thần Phù Ức</span>
                  <strong className="text-sm text-gold-300 font-bold block mt-1">{currentBaziChart.gods.dungThan}</strong>
                </div>
                <div className="p-3 rounded-xl bg-ink-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hỷ Thần Sinh Trợ</span>
                  <strong className="text-sm text-jade-300 font-bold block mt-1">{currentBaziChart.gods.hyThan}</strong>
                </div>
                <div className="p-3 rounded-xl bg-ink-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Kỵ Thần Cần Tiết Chế</span>
                  <strong className="text-sm text-rose-300 font-bold block mt-1">{currentBaziChart.gods.kyThan}</strong>
                </div>
              </div>
            </div>
          )}

          {activeReportTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-ink-950/80 border border-gold-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-gold-300">
                  <ShieldCheck className="w-5 h-5 text-gold-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Chứng Thư Kiểm Thẩm Thuần Cổ Thư (Mục XV)</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-ink-900 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Phiên bản Bộ Máy Tính Toán:</span>
                    <strong className="text-slate-100 font-mono text-xs">{report.systemAuditStamp.engineVersion}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-ink-900 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Phiên bản Bộ Quy Tắc Đã Phê Duyệt:</span>
                    <strong className="text-slate-100 font-mono text-xs">{report.systemAuditStamp.rulesVersion}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-ink-900 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Thời điểm thiết lập báo cáo:</span>
                    <strong className="text-slate-100 font-mono text-xs">{report.systemAuditStamp.calculatedAt}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
                    <span className="text-emerald-400 block text-[11px]">Cam kết can thiệp AI:</span>
                    <strong className="text-emerald-300 font-bold text-xs">{report.systemAuditStamp.aiInterference}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                  Mô hình xử lý phân lớp: <strong>Dữ liệu đầu vào → Bộ máy tính toán xác định → Bộ quy tắc cổ thư đã phê duyệt → Kiểm tra điều kiện áp dụng → Hồ sơ dẫn chứng (A → H) → Báo cáo hiển thị.</strong> AI tuyệt đối không có quyền can thiệp lá số hoặc tự ý sinh quy tắc mệnh lý mới.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ethical Disclaimer */}
        <div className="p-3.5 rounded-xl bg-ink-950 border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-400">
          <ShieldAlert className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
          <p>{report.ethicalDisclaimer}</p>
        </div>

      </div>

    </div>
  );
};
