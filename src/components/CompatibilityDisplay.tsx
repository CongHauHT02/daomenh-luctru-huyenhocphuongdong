import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PersonInfo, analyzeCompatibility } from '../engine/compatibility';
import { getBaziYearCanChi } from '../engine/calendar';
import { ClassicalEvidenceDrawer } from './ClassicalEvidenceDrawer';
import { PersonalProfileBar } from './PersonalProfileBar';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Scale,
  Users,
  Compass,
  MessageCircle,
  PiggyBank,
  Calendar,
  Baby,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const CompatibilityDisplay: React.FC = () => {
  const { currentProfile } = useApp();

  // Person 1 State (Chú rể)
  const [p1Name, setP1Name] = useState('Nguyễn Văn An');
  const [p1Gender, setP1Gender] = useState<'male' | 'female'>('male');
  const [p1Year, setP1Year] = useState(1990);

  // Person 2 State (Cô dâu)
  const [p2Name, setP2Name] = useState('Trần Thị Mai');
  const [p2Gender, setP2Gender] = useState<'male' | 'female'>('female');
  const [p2Year, setP2Year] = useState(1993);

  // Automatically sync with current profile if available
  useEffect(() => {
    if (currentProfile) {
      const birthYear = parseInt(currentProfile.birthDate.split('-')[0]) || 1990;
      if (currentProfile.gender === 'female') {
        setP2Name(currentProfile.fullName);
        setP2Gender('female');
        setP2Year(birthYear);
      } else {
        setP1Name(currentProfile.fullName);
        setP1Gender('male');
        setP1Year(birthYear);
      }
    }
  }, [currentProfile]);

  const syncP1WithProfile = () => {
    const birthYear = parseInt(currentProfile.birthDate.split('-')[0]) || 1990;
    setP1Name(currentProfile.fullName);
    setP1Gender(currentProfile.gender);
    setP1Year(birthYear);
  };

  const syncP2WithProfile = () => {
    const birthYear = parseInt(currentProfile.birthDate.split('-')[0]) || 1990;
    setP2Name(currentProfile.fullName);
    setP2Gender(currentProfile.gender);
    setP2Year(birthYear);
  };

  const calculateCanChiFromYear = (year: number) => {
    return getBaziYearCanChi(year, 6, 15).fullName;
  };

  const person1: PersonInfo = {
    name: p1Name,
    gender: p1Gender,
    year: p1Year,
    canChiYear: calculateCanChiFromYear(p1Year)
  };

  const person2: PersonInfo = {
    name: p2Name,
    gender: p2Gender,
    year: p2Year,
    canChiYear: calculateCanChiFromYear(p2Year)
  };

  const result = analyzeCompatibility(person1, person2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gold-gradient-text font-oriental mb-2">
          Xem Tuổi Hôn Nhân & Chọn Năm Nghênh Hôn
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm">
          Khảo sát toàn diện theo cổ thư: Nạp Âm Ngũ Hành, Bát Trạch Cung Phi, Mệnh Bát Quái Âm Dương,
          xác định chính xác khi nào được tuổi cưới (tránh Kim Lâu, Tam Tai) và dự báo đường con cái thuận hòa.
        </p>
      </div>

      {/* Unified Profile Bar */}
      <PersonalProfileBar moduleTitle="Xem Tuổi Hôn Nhân" />

      {/* Dual Input Form */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/25 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          
          {/* Groom Box */}
          <div className="space-y-4 p-4 rounded-xl bg-ink-950/60 border border-slate-800">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-gold-300 uppercase tracking-wider block">
                Thông Tin Chú Rể (Nam Mệnh)
              </span>
              <button
                type="button"
                onClick={syncP1WithProfile}
                className="text-[10px] text-gold-400 hover:text-gold-300 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20"
                title="Lấy thông tin từ hồ sơ hiện tại"
              >
                Gán Hồ Sơ Hiện Tại
              </button>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Họ Tên Chú Rể</label>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ink-900 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Giới Tính</label>
                <select
                  value={p1Gender}
                  onChange={(e) => setP1Gender(e.target.value as 'male' | 'female')}
                  className="w-full px-3 py-2 rounded-lg bg-ink-900 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Năm Sinh (Dương)</label>
                <input
                  type="number"
                  min="1930"
                  max="2030"
                  value={p1Year}
                  onChange={(e) => setP1Year(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-ink-900 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>
            <span className="text-xs text-slate-400 block pt-1">
              Can Chi: <strong className="text-gold-300">{person1.canChiYear}</strong> | Cung Phi: <strong className="text-jade-300">{result.batQuaiYinYang.groomCung}</strong> ({result.batQuaiYinYang.groomElement})
            </span>
          </div>

          {/* Bride Box */}
          <div className="space-y-4 p-4 rounded-xl bg-ink-950/60 border border-slate-800">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                Thông Tin Cô Dâu (Nữ Mệnh)
              </span>
              <button
                type="button"
                onClick={syncP2WithProfile}
                className="text-[10px] text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20"
                title="Lấy thông tin từ hồ sơ hiện tại"
              >
                Gán Hồ Sơ Hiện Tại
              </button>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Họ Tên Cô Dâu</label>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ink-900 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Giới Tính</label>
                <select
                  value={p2Gender}
                  onChange={(e) => setP2Gender(e.target.value as 'male' | 'female')}
                  className="w-full px-3 py-2 rounded-lg bg-ink-900 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                >
                  <option value="female">Nữ</option>
                  <option value="male">Nam</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Năm Sinh (Dương)</label>
                <input
                  type="number"
                  min="1930"
                  max="2030"
                  value={p2Year}
                  onChange={(e) => setP2Year(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-ink-900 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>
            <span className="text-xs text-slate-400 block pt-1">
              Can Chi: <strong className="text-rose-300">{person2.canChiYear}</strong> | Cung Phi: <strong className="text-jade-300">{result.batQuaiYinYang.brideCung}</strong> ({result.batQuaiYinYang.brideElement})
            </span>
          </div>

        </div>
      </div>

      {/* Overall Score Meter Card */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-slate-400">Chỉ Số Tương Hợp Hôn Nhân</span>
        <div className="text-5xl font-extrabold gold-gradient-text font-oriental">
          {result.totalScore} / 100
        </div>
        <p className="text-sm font-semibold text-slate-200 max-w-xl mx-auto">
          {result.overallAssessment}
        </p>

        {/* 3 Pillar Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-left">
          <div className="p-3 rounded-xl bg-ink-950/70 border border-slate-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Nạp Âm Ngũ Hành:</span>
              <span className="font-bold text-gold-300">{result.napAmScore.relation}</span>
            </div>
            <div className="w-full bg-ink-900 rounded-full h-2">
              <div className="bg-gold-500 h-2 rounded-full" style={{ width: `${result.napAmScore.score}%` }}></div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-ink-950/70 border border-slate-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Bát Trạch Cung Phi:</span>
              <span className="font-bold text-jade-300">{result.batTrachScore.batTrachResult}</span>
            </div>
            <div className="w-full bg-ink-900 rounded-full h-2">
              <div className="bg-jade-500 h-2 rounded-full" style={{ width: `${result.batTrachScore.score}%` }}></div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-ink-950/70 border border-slate-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Can Chi Niên Mệnh:</span>
              <span className="font-bold text-cyan-300">{result.canChiScore.score}%</span>
            </div>
            <div className="w-full bg-ink-900 rounded-full h-2">
              <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${result.canChiScore.score}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* YÊU CẦU 3.1: KHI NÀO MỚI ĐƯỢC TUỔI CƯỚI (CHỌN NĂM NGHÊNH HÔN) */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-5">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Calendar className="w-5 h-5 text-gold-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100 font-oriental">
              Khi Nào Mới Được Tuổi Cưới? (Khảo Sát Hạn Kim Lâu & Tam Tai 6 Năm Sắp Tới)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Quy tắc cổ truyền Ngọc Hạp: &ldquo;Lấy vợ xem tuổi đàn bà, làm nhà xem tuổi đàn ông&rdquo;. Tuổi mụ chia 9 tránh các số dư 1 (Thân), 3 (Thê), 6 (Tử), 8 (Lục Súc).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.marriageYears.map((yrItem) => {
            const isBest = yrItem.rating === 'Đại Cát Để Cưới Hỏi';
            const isAvoid = yrItem.rating === 'Nên Tránh';
            return (
              <div
                key={yrItem.year}
                className={`p-4 rounded-xl border transition-all ${
                  isBest
                    ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md'
                    : isAvoid
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : 'bg-ink-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-sm font-bold text-slate-100 font-oriental">
                    Năm {yrItem.year} ({yrItem.canChiYear})
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isBest
                        ? 'bg-emerald-500 text-ink-950'
                        : isAvoid
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-500 text-ink-950'
                    }`}
                  >
                    {yrItem.rating}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Cô dâu {person2.name}:</span>
                    <strong className="text-gold-300">{yrItem.brideAgeMu} tuổi mụ</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Hạn Kim Lâu cô dâu:</span>
                    <span className={yrItem.kimLauStatus.isKimLau ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {yrItem.kimLauStatus.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Hạn Tam Tai:</span>
                    <span className="text-slate-300">{yrItem.tamTaiStatus.detail}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed italic">
                    {yrItem.recommendationReason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* YÊU CẦU 3.2: MỆNH BÁT QUÁI ÂM DƯƠNG (CHU DỊCH TƯƠNG PHỐI) */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-5">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Compass className="w-5 h-5 text-gold-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100 font-oriental">
              Mệnh Bát Quái Âm Dương & Đạo Cương Nhu Chu Dịch
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Phối quẻ Tiên Thiên / Hậu Thiên Bát Quái xem đạo trời đất giao hòa, âm dương tương sinh tương tế.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-2">
            <span className="font-bold text-gold-300 text-sm block">1. Cung Phi Chú Rể ({person1.name})</span>
            <div className="space-y-1">
              <p>• Quẻ Cung Phi: <strong>{result.batQuaiYinYang.groomCung}</strong> ({result.batQuaiYinYang.groomSymbol})</p>
              <p>• Thuộc Trạch: <strong>{result.batQuaiYinYang.groomTrach}</strong> | Ngũ hành: <strong>{result.batQuaiYinYang.groomElement}</strong></p>
              <p>• Khí Chất Âm Dương: <strong className="text-gold-400">{result.batQuaiYinYang.groomYinYang} Cương</strong> (Chủ về gánh vác, dẫn dắt, bảo vệ gia đạo).</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-2">
            <span className="font-bold text-rose-300 text-sm block">2. Cung Phi Cô Dâu ({person2.name})</span>
            <div className="space-y-1">
              <p>• Quẻ Cung Phi: <strong>{result.batQuaiYinYang.brideCung}</strong> ({result.batQuaiYinYang.brideSymbol})</p>
              <p>• Thuộc Trạch: <strong>{result.batQuaiYinYang.brideTrach}</strong> | Ngũ hành: <strong>{result.batQuaiYinYang.brideElement}</strong></p>
              <p>• Khí Chất Âm Dương: <strong className="text-rose-400">{result.batQuaiYinYang.brideYinYang} Nhu</strong> (Chủ về vun vén, nuôi dưỡng, gìn giữ hòa khí gia đình).</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-ink-950 border border-gold-500/25 space-y-2 text-xs">
          <span className="font-bold text-gold-300 block">Đánh Giá Tương Tác Âm Dương Bát Quái:</span>
          <p className="text-slate-200 leading-relaxed">{result.batQuaiYinYang.yinYangBalance}</p>
          <p className="text-slate-400 pt-1 border-t border-slate-800">{result.batQuaiYinYang.queDichMeaning}</p>
        </div>
      </div>

      {/* YÊU CẦU 3.3: DỰ BÁO ĐƯỜNG CON CÁI THEO CỔ THƯ */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-5">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Baby className="w-5 h-5 text-jade-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100 font-oriental">
              Dự Báo Đường Con Cái & Ngũ Hành Thông Quan
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cổ pháp sinh con hợp mệnh cha mẹ để làm cầu nối sinh khí, chuyển hóa xung khắc tự nhiên thành phúc lộc dài lâu.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-2">
            <span className="font-bold text-jade-300 text-sm block">Ngũ Hành Thông Quan Phụ Mẫu:</span>
            <p className="leading-relaxed">{result.childrenForecast.nguHanhThongQuan}</p>
            <div className="pt-2">
              <span className="text-slate-400 block mb-1">Hành của con cái thuận sinh nhất:</span>
              <div className="flex gap-2">
                {result.childrenForecast.recommendedChildElements.map((el, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-jade-500/20 text-jade-300 border border-jade-500/30 font-bold">
                    Hành {el}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-2">
            <span className="font-bold text-gold-300 text-sm block">Gợi Ý Năm Sinh Con Đại Cát:</span>
            <ul className="space-y-1.5 text-slate-300">
              {result.childrenForecast.recommendedChildYears.map((yr, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-jade-400 flex-shrink-0" />
                  <span>{yr}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800">
              {result.childrenForecast.parentChildHarmonyAdvice}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-ink-900 border border-slate-800 text-xs text-gold-200/90 font-serif italic text-center">
          {result.childrenForecast.classicalQuote}
        </div>
      </div>

      {/* Classical Evidence Drawer */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/30">
        <ClassicalEvidenceDrawer evidence={result.evidence} />
      </div>

      {/* Practical Counseling & Remedies */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
        <h3 className="text-base font-bold text-gold-300 font-oriental pb-3 border-b border-slate-800 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <span>Gợi Ý Thực Tế & Lời Khuyên Hòa Hợp Hạnh Phúc</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-semibold text-gold-300">
              <Compass className="w-4 h-4" />
              <span>Phương Pháp Hóa Giải Phong Thủy:</span>
            </div>
            <p className="leading-relaxed">{result.remediesAndAdvice.traditionalRemedy}</p>
          </div>

          <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-semibold text-jade-300">
              <MessageCircle className="w-4 h-4" />
              <span>Giao Tiếp & Giải Quyết Mâu Thuẫn:</span>
            </div>
            <p className="leading-relaxed">{result.remediesAndAdvice.practicalCommunicationAdvice}</p>
          </div>

          <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-semibold text-amber-300">
              <PiggyBank className="w-4 h-4" />
              <span>Tài Chính & Trách Nhiệm Gia Đình:</span>
            </div>
            <p className="leading-relaxed">{result.remediesAndAdvice.financialAndFamilyHarmony}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-ink-950 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-jade-400 flex-shrink-0 mt-0.5" />
          <span>
            Hôn nhân là sự vun đắp của hai con người có tự do ý chí và lòng bao dung. Mọi quy tắc cổ truyền chỉ đóng vai trò gương soi để hai bạn hiểu rõ điểm khác biệt và nâng niu mối duyên lành.
          </span>
        </div>
      </div>

    </div>
  );
};
