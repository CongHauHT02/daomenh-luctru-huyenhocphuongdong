import React, { useState } from 'react';
import { searchKnowledgeBase, CLASSICAL_TREATISES, ClassicalTreatise } from '../engine/knowledgeBase';
import {
  BookOpen,
  Search,
  Filter,
  Scroll,
  Layers,
  Sparkles,
  Smile,
  Compass,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';

export const KnowledgeBaseDisplay: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTreatiseId, setExpandedTreatiseId] = useState<string>('uyen-hai-tu-binh');

  const treatises = searchKnowledgeBase(searchQuery, selectedCategory);

  const categories = [
    { id: 'all', label: 'Tất Cả Thư Mục' },
    { id: 'bazi', label: 'Bát Tự Tứ Trụ' },
    { id: 'liuzhu', label: 'Lục Trụ Mệnh Lý' },
    { id: 'tuvi', label: 'Tử Vi Đẩu Số' },
    { id: 'physiognomy', label: 'Tướng Học & Chỉ Tay' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gold-gradient-text font-oriental mb-2">
          Thư Viện Cổ Thư & Tri Thức Huyền Học
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm">
          Kho tàng thư tịch mệnh lý phương Đông nguyên bản và bản dịch đối chiếu: Uyên Hải Tử Bình, Tam Mệnh Thông Hội,
          Đích Thiên Tủy, Cùng Thông Bảo Giám, Tử Vi Đẩu Số Toàn Thư, Ma Y Thần Tướng.
        </p>
      </div>

      {/* Search Bar & Filters */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gold-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tác phẩm, tên chữ Hán, khái niệm (Thập thần, Dụng thần, Thai nguyên, Lệnh tháng)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-ink-950 border border-slate-700 text-slate-100 text-sm focus:border-gold-500 focus:outline-none shadow-inner"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gold-500 text-ink-950 font-bold shadow-md'
                  : 'bg-ink-900 text-slate-300 hover:bg-ink-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Treatises Accordion List */}
      <div className="space-y-6">
        {treatises.map(treatise => {
          const isExpanded = expandedTreatiseId === treatise.id;
          return (
            <div
              key={treatise.id}
              className="oriental-card rounded-2xl border border-gold-500/25 overflow-hidden transition-all shadow-lg"
            >
              {/* Header Box */}
              <div
                onClick={() => setExpandedTreatiseId(isExpanded ? '' : treatise.id)}
                className="p-5 sm:p-6 bg-ink-900/80 cursor-pointer flex items-start justify-between gap-4 hover:bg-ink-850 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xl font-bold text-slate-100 font-oriental">
                      {treatise.titleVi}
                    </span>
                    <span className="text-base text-gold-400 font-serif font-medium">
                      ({treatise.titleZh})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500/10 text-gold-300 border border-gold-500/30">
                      {treatise.categoryLabel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 space-x-3">
                    <span>Tác giả: <strong className="text-slate-300">{treatise.author}</strong></span>
                    <span>•</span>
                    <span>Thời đại: <strong className="text-slate-300">{treatise.dynasty}</strong></span>
                    <span>•</span>
                    <span className="text-jade-400 font-medium">{treatise.reliability}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {treatise.description}
                  </p>
                </div>

                <button className="p-2 rounded-lg bg-ink-950 text-slate-400 hover:text-gold-300 flex-shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Expanded Chapters */}
              {isExpanded && (
                <div className="p-5 sm:p-6 bg-ink-950/60 border-t border-slate-800 space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400">
                    Các Chương Mục Điển Hình & Khẩu Quyết Nguyên Văn:
                  </h4>

                  <div className="space-y-4">
                    {treatise.chapters.map(chap => (
                      <div
                        key={chap.id}
                        className="p-4 rounded-xl bg-ink-900 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-200 font-oriental">
                            Chương {chap.chapterIndex}: {chap.chapterTitle}
                          </span>
                          <span className="text-[11px] text-slate-400 italic">
                            Trường phái: {chap.applicableSchool}
                          </span>
                        </div>

                        {/* Hán Văn Cổ */}
                        <div className="p-3 rounded-lg bg-ink-950 border border-gold-500/20 text-gold-200 font-serif text-sm tracking-widest leading-loose">
                          {chap.originalTextZh}
                        </div>

                        {/* Bản Dịch Tiếng Việt */}
                        <div className="text-xs text-slate-300 leading-relaxed italic bg-ink-950/40 p-3 rounded-lg border border-slate-800/80">
                          <strong className="text-gold-300 not-italic block mb-1">Dịch nghĩa học thuật:</strong>
                          &ldquo;{chap.translationVi}&rdquo;
                        </div>

                        {/* Giải Thích & Khái Niệm */}
                        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                          <p className="text-slate-300 text-xs">
                            <strong className="text-gold-400">Ứng dụng mệnh lý:</strong> {chap.explanation}
                          </p>
                          <div className="flex items-center space-x-1">
                            <Tag className="w-3.5 h-3.5 text-slate-500" />
                            {chap.concepts.map((c, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-ink-800 text-slate-400">
                                #{c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
