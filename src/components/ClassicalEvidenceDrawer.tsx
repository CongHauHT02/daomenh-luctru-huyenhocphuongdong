import React, { useState } from 'react';
import { ClassicalEvidenceProfile, VerificationStatus } from '../engine/classicalEvidence';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertCircle,
  FileText,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Layers,
  Scale
} from 'lucide-react';

export const ClassicalEvidenceDrawer: React.FC<{ evidence: ClassicalEvidenceProfile }> = ({ evidence }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Đã xác minh văn bản và vị trí trang':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Đã xác minh nội dung nhưng chưa xác minh được số trang':
        return 'bg-gold-500/20 text-gold-300 border-gold-500/40';
      case 'Có dị bản hoặc cách giải thích chưa thống nhất':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-gold-500/30 overflow-hidden bg-ink-950/80 transition-all">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-ink-900/90 hover:bg-ink-850 flex items-center justify-between text-left transition-colors border-b border-transparent data-[open=true]:border-slate-800"
        data-open={isOpen}
      >
        <div className="flex items-center space-x-2.5">
          <BookOpen className="w-4 h-4 text-gold-400" />
          <span className="text-xs font-bold text-gold-300 tracking-wide font-oriental">
            Căn Cứ Cổ Thư & Hồ Sơ Dẫn Chứng ({evidence.ruleCode})
          </span>
          <span className={`text-[10px] px-2 py-0.2 rounded border font-medium hidden sm:inline-block ${getStatusBadge(evidence.verificationStatus)}`}>
            {evidence.verificationStatus}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="hidden sm:inline text-[11px]">{isOpen ? 'Thu gọn hồ sơ' : 'Xem nguyên văn & số trang'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gold-400" /> : <ChevronDown className="w-4 h-4 text-gold-400" />}
        </div>
      </button>

      {/* Expanded Evidence Details (Mục XIV.3: A -> H) */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4 text-xs text-slate-300 bg-ink-950/60 divide-y divide-slate-800/80">
          
          {/* A. Kết luận đang được giải thích */}
          <div className="pt-2 first:pt-0 space-y-1">
            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">
              A. Kết Luận Đang Được Thẩm Định:
            </span>
            <p className="text-slate-100 font-medium leading-relaxed bg-ink-900 p-2.5 rounded-lg border border-slate-800">
              {evidence.conclusion}
            </p>
          </div>

          {/* B. Nguồn tư liệu & Số trang */}
          <div className="pt-3 space-y-2">
            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">
              B. Nguồn Tư Liệu & Vị Trí Lưu Giữ:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-ink-900 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 block">Tác phẩm:</span>
                <strong className="text-slate-100 text-xs">{evidence.bookTitleVi} ({evidence.bookTitleZh})</strong>
                <span className="text-slate-400 block text-[10px]">Tác giả: {evidence.author} ({evidence.dynastyEra})</span>
              </div>
              <div className="p-2.5 rounded-lg bg-ink-900 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 block">Vị trí & Số trang xác minh:</span>
                <strong className="text-gold-300 block">{evidence.pagePrinted}</strong>
                <span className="text-slate-400 block">{evidence.pagePdf} | {evidence.chapterSection}</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 italic">
              Kho lưu trữ / Phiên bản: {evidence.edition} – {evidence.publisherOrArchive}
            </div>
          </div>

          {/* C. Nguyên văn Chữ Hán */}
          <div className="pt-3 space-y-1.5">
            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">
              C. Nguyên Văn Cổ Bản:
            </span>
            <div className="p-3 rounded-lg bg-ink-900/90 border border-gold-500/25 font-serif text-gold-200 text-xs sm:text-sm tracking-widest leading-loose">
              {evidence.originalTextZh}
            </div>
          </div>

          {/* D. Bản dịch tiếng Việt */}
          <div className="pt-3 space-y-1.5">
            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">
              D. Bản Dịch Tiếng Việt (Đã Thẩm Định Học Thuật):
            </span>
            <blockquote className="p-3 rounded-lg bg-ink-900/60 border border-slate-800 text-slate-200 italic leading-relaxed">
              &ldquo;{evidence.translationVi}&rdquo;
            </blockquote>
          </div>

          {/* E. Nội dung đoạn trích */}
          <div className="pt-3 space-y-1">
            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">
              E. Nội Dung Quy Tắc Rút Ra Từ Đoạn Trích:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {evidence.sourceMeaning}
            </p>
          </div>

          {/* F. Cách áp dụng vào lá số */}
          <div className="pt-3 space-y-1">
            <span className="text-[10px] font-bold text-jade-400 uppercase tracking-wider block">
              F. Dữ Liệu Thực Tế Thỏa Mãn Điều Kiện:
            </span>
            <div className="p-2.5 rounded-lg bg-jade-950/40 border border-jade-500/30 text-jade-200">
              {evidence.appliedChartData}
            </div>
          </div>

          {/* G. Giới hạn áp dụng */}
          <div className="pt-3 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              G. Giới Hạn Áp Dụng & Trường Phái:
            </span>
            <p className="text-slate-400 leading-relaxed">
              {evidence.applicationLimits} (Thuộc trường phái: <strong className="text-slate-300">{evidence.school}</strong>)
            </p>
          </div>

          {/* H. Trạng thái xác minh */}
          <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-300">Trạng thái xác minh:</span>
              <span className={`px-2 py-0.5 rounded border font-semibold ${getStatusBadge(evidence.verificationStatus)}`}>
                {evidence.verificationStatus}
              </span>
            </div>
            <div className="space-x-2">
              <span>Kiểm duyệt: <strong className="text-slate-300">{evidence.reviewer}</strong></span>
              <span>•</span>
              <span>Phiên bản: <strong className="text-slate-300">{evidence.approvalVersion} ({evidence.approvalDate})</strong></span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
