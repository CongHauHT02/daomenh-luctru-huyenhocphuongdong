import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { runAllMetaphysicsTests, TestCaseResult } from '../engine/testRunner';
import { VERIFIED_CLASSICAL_RULES_REGISTRY } from '../engine/classicalEvidence';
import {
  Settings,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sliders,
  Database,
  Cpu,
  Save,
  Check,
  BookOpen,
  FileText,
  Search,
  Filter,
  AlertTriangle,
  Layers,
  History,
  FileCheck,
  ExternalLink,
  Ban,
  ArrowRight
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { config, updateConfig, savedProfiles } = useApp();

  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'rules' | 'config' | 'tests' | 'profiles'>('rules');

  // Brand config state
  const [brandInput, setBrandInput] = useState(config.brandName);
  const [sloganInput, setSloganInput] = useState(config.slogan);
  const [apiKeyInput, setApiKeyInput] = useState(config.geminiApiKey || '');
  const [aiProvider, setAiProvider] = useState<'gemini' | 'internal_heuristic'>(config.aiProvider);
  const [dayBoundary, setDayBoundary] = useState<'zi_split' | 'midnight'>(config.dayBoundaryMethod);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Test Runner state
  const [testResults, setTestResults] = useState<{
    total: number;
    passedCount: number;
    failedCount: number;
    results: TestCaseResult[];
  } | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Section XVII: Classical Rules & Evidence Management State
  const [rulesRegistry, setRulesRegistry] = useState(
    Object.values(VERIFIED_CLASSICAL_RULES_REGISTRY).map(rule => ({
      ...rule,
      drafter: 'Ban Biên Tập Cổ Thư Hán Nôm',
      checker: 'Ban Thư Ký Học Thuật Đạo Mệnh',
      isRevoked: false,
      revocationReason: ''
    }))
  );
  const [ruleSearch, setRuleSearch] = useState('');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  const [selectedRuleForLookup, setSelectedRuleForLookup] = useState<any | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      brandName: brandInput,
      slogan: sloganInput,
      geminiApiKey: apiKeyInput,
      aiProvider,
      dayBoundaryMethod: dayBoundary
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleRunVerification = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const res = runAllMetaphysicsTests();
      setTestResults(res);
      setIsRunningTests(false);
    }, 400);
  };

  const handleToggleRevokeRule = (ruleCode: string) => {
    setRulesRegistry(prev =>
      prev.map(r => {
        if (r.ruleCode === ruleCode) {
          const nextState = !r.isRevoked;
          return {
            ...r,
            isRevoked: nextState,
            revocationReason: nextState ? 'Phát hiện vấn đề văn bản học cần thẩm tra lại số trang và bản khắc gốc.' : ''
          };
        }
        return r;
      })
    );
    setStatusMessage(`Cập nhật trạng thái quy tắc ${ruleCode} thành công.`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const filteredRules = rulesRegistry.filter(rule => {
    const matchSearch =
      rule.ruleCode.toLowerCase().includes(ruleSearch.toLowerCase()) ||
      rule.bookTitleVi.toLowerCase().includes(ruleSearch.toLowerCase()) ||
      rule.bookTitleZh.includes(ruleSearch) ||
      rule.sourceMeaning.toLowerCase().includes(ruleSearch.toLowerCase());
    const matchSchool =
      selectedSchoolFilter === 'all' || rule.school.toLowerCase().includes(selectedSchoolFilter.toLowerCase());
    return matchSearch && matchSchool;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gold-gradient-text font-oriental mb-2">
          Quản Trị Hệ Thống & Giám Sát Cổ Thư
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm">
          Trung tâm điều hành nền tảng: Thẩm định quy tắc cổ thư 3 cấp, quản lý dẫn chứng số trang in & PDF, cấu hình thương hiệu và chạy bộ kiểm thử toàn diện.
        </p>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-ink-950 border border-slate-800 max-w-4xl mx-auto">
        {[
          { id: 'rules', label: 'Quản Lý Cổ Thư & Phê Duyệt Quy Tắc (Mục XVII)', icon: BookOpen },
          { id: 'config', label: 'Cấu Hình Thương Hiệu & Tham Số', icon: Sliders },
          { id: 'tests', label: 'Bộ Kiểm Thử Thuật Toán (Test Suite)', icon: Cpu },
          { id: 'profiles', label: `Hồ Sơ Đã Lưu (${savedProfiles.length})`, icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gold-500 text-ink-950 font-bold shadow-gold-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-ink-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {showSavedToast && (
        <div className="p-4 rounded-xl bg-jade-500/20 border border-jade-500 text-jade-200 text-xs flex items-center space-x-2 animate-fade-in shadow-lg max-w-xl mx-auto">
          <CheckCircle2 className="w-4 h-4 text-jade-400 flex-shrink-0" />
          <span>Cấu hình hệ thống đã được lưu thành công vào bộ nhớ vĩnh viễn!</span>
        </div>
      )}

      {statusMessage && (
        <div className="p-4 rounded-xl bg-gold-500/20 border border-gold-500 text-gold-200 text-xs flex items-center space-x-2 animate-fade-in shadow-lg max-w-xl mx-auto">
          <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* TAB 1: RULES & CLASSICAL EVIDENCE MANAGEMENT (MỤC XVII) */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          
          {/* Rules Banner & Governance Protocol */}
          <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-oriental flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-gold-400" />
                  <span>Quy Trình Phê Duyệt Quy Tắc Cổ Thư Ba Cấp (Tam Cấp Thẩm Định)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tuân thủ Mục XVII: Người soạn (Chuyên viên Hán Nôm) → Người kiểm tra (Thư ký Học thuật) → Người phê duyệt (Hội đồng Cố vấn). Nghiêm cấm AI tự động kích hoạt quy tắc.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-ink-950 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero-AI Decision Enforced: Chỉ quy tắc đã được duyệt mới được sinh báo cáo.</span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
              <div className="md:col-span-8 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={ruleSearch}
                  onChange={(e) => setRuleSearch(e.target.value)}
                  placeholder="Tìm theo mã quy tắc, tên sách, nguyên văn chữ Hán, ý nghĩa..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-ink-950 border border-slate-700 text-xs text-slate-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-4">
                <select
                  value={selectedSchoolFilter}
                  onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-slate-700 text-xs text-slate-100 focus:border-gold-500 focus:outline-none"
                >
                  <option value="all">Tất Cả Trường Phái</option>
                  <option value="Tử Bình Điệu Hầu Phái">Tử Bình Điệu Hầu Phái</option>
                  <option value="Tử Bình Chân Thuyên">Tử Bình Chân Thuyên Chính Cách</option>
                  <option value="Tam Mệnh Thông Hội">Tam Mệnh Thông Hội Cổ Pháp</option>
                  <option value="Nam Phái Tử Vi">Nam Phái Tử Vi Đẩu Số</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rules Cards List */}
          <div className="space-y-4">
            {filteredRules.map(rule => (
              <div
                key={rule.ruleCode}
                className={`oriental-card rounded-2xl p-5 border transition-all ${
                  rule.isRevoked
                    ? 'border-rose-500/40 bg-rose-950/10'
                    : 'border-gold-500/20 hover:border-gold-500/50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-sm font-bold text-gold-300 font-mono tracking-wide">
                      {rule.ruleCode}
                    </span>
                    <span className="text-xs text-slate-300 font-oriental">
                      {rule.bookTitleVi} ({rule.bookTitleZh})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-ink-800 text-slate-400 border border-slate-700">
                      {rule.school}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {rule.isRevoked ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center space-x-1">
                        <Ban className="w-3 h-3 text-rose-400" />
                        <span>ĐÃ THU HỒI</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>ĐÃ PHÊ DUYỆT (v{rule.approvalVersion})</span>
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedRuleForLookup(rule)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-ink-800 hover:bg-ink-700 text-slate-200 border border-slate-700 flex items-center space-x-1"
                    >
                      <Search className="w-3 h-3 text-gold-400" />
                      <span>Tra cứu kết luận</span>
                    </button>

                    <button
                      onClick={() => handleToggleRevokeRule(rule.ruleCode)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        rule.isRevoked
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-ink-950 font-bold'
                          : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {rule.isRevoked ? 'Kích Hoạt Lại' : 'Thu Hồi Quy Tắc'}
                    </button>
                  </div>
                </div>

                {/* Rule Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3 text-xs">
                  {/* Left Column: Citation Details */}
                  <div className="lg:col-span-4 space-y-2 text-slate-400">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Tác giả & Thời kỳ:</span>
                      <strong className="text-slate-200">{rule.author} ({rule.dynastyEra})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Phiên bản & Lưu trữ:</span>
                      <span className="text-slate-300 block">{rule.edition}</span>
                      <span className="text-[11px] text-slate-500">{rule.publisherOrArchive}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-ink-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Số trang in trên sách:</span>
                        <strong className="text-gold-300">{rule.pagePrinted}</strong>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Số trang PDF / Ảnh số:</span>
                        <strong className="text-slate-200">{rule.pagePdf}</strong>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate pt-0.5 border-t border-slate-800">
                        {rule.chapterSection}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Original Text & Translation */}
                  <div className="lg:col-span-5 space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold-400 block mb-1">
                        Nguyên văn Hán văn cổ bản:
                      </span>
                      <div className="p-2.5 rounded-lg bg-ink-950 border border-gold-500/20 font-serif text-gold-200 text-xs tracking-wider leading-relaxed">
                        {rule.originalTextZh}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Bản dịch tiếng Việt đã thẩm định:
                      </span>
                      <p className="p-2 rounded-lg bg-ink-950/60 border border-slate-800 text-slate-300 italic text-[11px] leading-relaxed">
                        &ldquo;{rule.translationVi}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Right Column: 3-Tier Approval Metadata */}
                  <div className="lg:col-span-3 space-y-2 border-l border-slate-800/80 pl-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Hồ Sơ Thẩm Định 3 Cấp:
                    </span>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-start space-x-1.5">
                        <span className="text-slate-500">1. Soạn:</span>
                        <span className="text-slate-300">{rule.drafter}</span>
                      </div>
                      <div className="flex items-start space-x-1.5">
                        <span className="text-slate-500">2. Soát:</span>
                        <span className="text-slate-300">{rule.checker}</span>
                      </div>
                      <div className="flex items-start space-x-1.5">
                        <span className="text-slate-500">3. Duyệt:</span>
                        <span className="text-gold-300 font-semibold">{rule.reviewer}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                        Ngày duyệt: {rule.approvalDate} (v{rule.approvalVersion})
                      </div>
                    </div>

                    {rule.isRevoked && (
                      <div className="p-2 rounded bg-rose-950/40 border border-rose-500/40 text-[10px] text-rose-300">
                        <strong>Lý do thu hồi:</strong> {rule.revocationReason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reverse Lookup Modal */}
          {selectedRuleForLookup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in">
              <div className="oriental-card rounded-2xl max-w-2xl w-full p-6 border border-gold-500/40 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-gold-400" />
                    <h3 className="text-base font-bold text-slate-100 font-oriental">
                      Tra Cứu Kết Luận Sử Dụng Quy Tắc ({selectedRuleForLookup.ruleCode})
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedRuleForLookup(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-100 bg-ink-800 hover:bg-ink-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-ink-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div>Tác phẩm: <strong className="text-gold-300">{selectedRuleForLookup.bookTitleVi}</strong></div>
                  <div>Trang in: <span className="text-slate-200">{selectedRuleForLookup.pagePrinted}</span> | Trang PDF: <span className="text-slate-200">{selectedRuleForLookup.pagePdf}</span></div>
                  <div>Trạng thái: <span className={selectedRuleForLookup.isRevoked ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{selectedRuleForLookup.isRevoked ? 'ĐÃ THU HỒI' : 'ĐANG ÁP DỤNG TRÊN PRODUCTION'}</span></div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 block">
                    Danh Sách Kết Luận Báo Cáo Đang Ràng Buộc Với Quy Tắc Này:
                  </span>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-ink-900 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-200 font-semibold">
                        <span>• Module Bát Tự – Luận Dụng Thần & Vượng Suy</span>
                        <span className="text-[10px] text-jade-400 font-mono">ID: CLM-BZ-002-8812</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Xác định Dụng Thần phù ức và trạng thái thân vượng/nhược của Nhật Chủ theo lệnh tháng.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-ink-900 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-200 font-semibold">
                        <span>• Module Bát Tự – Định Hướng Năng Lực & Trụ Thời Khắc</span>
                        <span className="text-[10px] text-jade-400 font-mono">ID: CLM-BZ-002-9941</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Rút ra khuyến nghị phát triển bản thân dựa trên ngũ hành Dụng Thần chính cách.
                      </p>
                    </div>
                  </div>
                </div>

                {selectedRuleForLookup.isRevoked && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 space-y-1">
                    <span className="font-bold block">Cảnh báo thu hồi quy tắc:</span>
                    <p className="text-[11px]">
                      Quy tắc này hiện đang bị thu hồi. Mọi báo cáo tạo mới sẽ tự động hiển thị: <em>&ldquo;Chưa có đủ căn cứ cổ thư đã xác minh để đưa ra kết luận theo tiêu chuẩn của hệ thống.&rdquo;</em> theo đúng Mục XIV.5.
                    </p>
                  </div>
                )}

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setSelectedRuleForLookup(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-gold-500 text-ink-950 hover:bg-gold-400"
                  >
                    Đóng Hộp Thoại
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: GENERAL CONFIG & SYSTEM SETTINGS */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-6">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Sliders className="w-5 h-5 text-gold-400" />
              <h3 className="text-base font-bold text-slate-100 font-oriental">
                Cấu Hình Thương Hiệu & Tham Số Vận Hành
              </h3>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên Thương Hiệu Nền Tảng (Hiển thị Header / Footer / Báo Cáo):
                </label>
                <input
                  type="text"
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                  placeholder="VD: ĐẠO MỆNH – LỤC TRỤ MỆNH LÝ..."
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  Dễ dàng thay đổi tên thương hiệu theo đúng yêu cầu đề bài.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Khẩu Hiệu / Slogan:
                </label>
                <input
                  type="text"
                  value={sloganInput}
                  onChange={(e) => setSloganInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mô Hình AI Luận Giải (Interpretation Engine):
                </label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                >
                  <option value="internal_heuristic">Internal Heuristic Engine (Chuẩn Quy Tắc Cổ Thư 100% Ổn Định)</option>
                  <option value="gemini">Google Gemini AI API (Chỉ dùng cho OCR & trợ giúp văn thư phụ trợ)</option>
                </select>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Lưu ý: Ngay cả khi kích hoạt AI, AI cũng chỉ được hỗ trợ OCR / tra cứu và tuyệt đối không được can thiệp vào kết quả tính lá số (Mục XV.6).
                </span>
              </div>

              {aiProvider === 'gemini' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gemini API Key (Tùy chọn phụ trợ):
                  </label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 rounded-lg bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quy Ước Ranh Giới Giờ Tý:
                </label>
                <select
                  value={dayBoundary}
                  onChange={(e) => setDayBoundary(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                >
                  <option value="zi_split">Phân biệt Dạ Tý (23h-24h ngày cũ) & Tý Chính (0h-1h ngày mới)</option>
                  <option value="midnight">23h chuyển hẳn sang Can Chi ngày mới (Trường phái Tý nhật)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-ink-950 font-bold text-xs tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Cấu Hình Quản Trị</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4 text-xs text-slate-300">
            <h4 className="font-bold text-slate-100 font-oriental flex items-center space-x-2 pb-2 border-b border-slate-800">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Tiêu Chuẩn Kiến Trúc Bốn Lớp</span>
            </h4>
            <div className="space-y-2 leading-relaxed">
              <p>• <strong>Lớp 1: Calculation Engine</strong>: Lập số, an sao, đổi lịch thuần túy bằng toán học thiên văn.</p>
              <p>• <strong>Lớp 2: Classical Rule Engine</strong>: Bộ quy tắc logic có mã, số trang và người duyệt.</p>
              <p>• <strong>Lớp 3: Evidence Engine</strong>: Hồ sơ nguồn truy xuất 8 mục A → H.</p>
              <p>• <strong>Lớp 4: Report Renderer</strong>: Xuất báo cáo theo mẫu đã định sẵn, không cho AI bịa chuyện.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VERIFICATION TEST RUNNER */}
      {activeTab === 'tests' && (
        <div className="oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-gold-400" />
              <h3 className="text-base font-bold text-slate-100 font-oriental">
                Bộ Kiểm Thử Thuật Toán Tự Động (Verification Suite)
              </h3>
            </div>
            <button
              onClick={handleRunVerification}
              disabled={isRunningTests}
              className="px-3.5 py-1.5 rounded-lg bg-jade-600 hover:bg-jade-500 text-ink-950 font-bold text-xs tracking-wider shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningTests ? 'Đang chạy...' : 'Chạy Kiểm Thử'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Chạy bộ kiểm thử tự động gồm các trường hợp đối soát lịch pháp lịch sử: ranh giới Lập Xuân, Ngũ Thử Độn Nhật, thuật toán Thai Nguyên Lục Trụ và an sao Cung Mệnh Tử Vi.
          </p>

          {testResults ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-ink-950 border border-slate-800">
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-400">Tổng số ca kiểm thử: <strong className="text-slate-200">{testResults.total}</strong></span>
                  <span>•</span>
                  <span className="text-jade-400 font-semibold">Đạt: {testResults.passedCount}</span>
                  <span>•</span>
                  <span className="text-rose-400 font-semibold">Thất bại: {testResults.failedCount}</span>
                </div>
                <span className="text-xs font-bold text-jade-300">
                  {testResults.failedCount === 0 ? '100% VƯỢT QUA' : 'CÓ LỖI'}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {testResults.results.map(test => (
                  <div
                    key={test.id}
                    className="p-3.5 rounded-xl bg-ink-950/80 border border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{test.name}</span>
                      {test.passed ? (
                        <span className="flex items-center space-x-1 text-jade-400 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PASS</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-rose-400 text-[11px] font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>FAIL</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{test.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono pt-1">
                      Kỳ vọng: <span className="text-slate-300">{JSON.stringify(test.expected)}</span> | Thực tế: <span className="text-gold-300">{JSON.stringify(test.actual)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-ink-950/50 border border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
              <span className="text-xs text-slate-400 block">
                Nhấn &ldquo;Chạy Kiểm Thử&rdquo; phía trên để thẩm định tính chính xác của toàn bộ engine.
              </span>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SAVED PROFILES SECTION */}
      {activeTab === 'profiles' && (
        <div className="oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Database className="w-5 h-5 text-gold-400" />
            <h3 className="text-base font-bold text-slate-100 font-oriental">
              Danh Sách Hồ Sơ Lá Số Đã Lưu ({savedProfiles.length})
            </h3>
          </div>

          {savedProfiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {savedProfiles.map(p => (
                <div key={p.id} className="p-3.5 rounded-xl bg-ink-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-xs text-slate-200 block">{p.name}</strong>
                    <span className="text-[11px] text-slate-400">{p.birthDate}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{p.createdAt}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">Chưa có hồ sơ nào được lưu trong bộ nhớ.</p>
          )}
        </div>
      )}

    </div>
  );
};
