import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  EventPurpose,
  findGoodDates,
  evaluateDate,
  get12ZodiacCompatibility,
  evaluatePersonalDateCompatibility
} from '../engine/dateSelection';
import { ClassicalEvidenceDrawer } from './ClassicalEvidenceDrawer';
import { PersonalProfileBar } from './PersonalProfileBar';
import {
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  ShieldCheck,
  Search,
  User,
  Compass,
  Star,
  ShieldAlert,
  Award,
  BookmarkCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export const DateSelectionDisplay: React.FC = () => {
  const { currentProfile } = useApp();

  const [selectedPurpose, setSelectedPurpose] = useState<EventPurpose>('cuoi_hoi');
  const [startDateStr, setStartDateStr] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [durationDays, setDurationDays] = useState<number>(14);

  // Ngày người dùng nhập để tra cứu bản mệnh cá nhân - sync with global profile
  const [birthDateStr, setBirthDateStr] = useState<string>(() => {
    return currentProfile?.birthDate || '1990-01-01';
  });

  useEffect(() => {
    if (currentProfile?.birthDate) {
      setBirthDateStr(currentProfile.birthDate);
    }
  }, [currentProfile]);

  // Ngày đang được chọn để soi chi tiết 12 con giáp và đối chiếu tuổi
  const [inspectedDateStr, setInspectedDateStr] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const startDate = new Date(startDateStr);
  const goodDates = findGoodDates(startDate, durationDays, selectedPurpose);

  // Tính toán dữ liệu cho ngày đang khảo sát
  const inspectedParts = inspectedDateStr.split('-').map(Number);
  const inspectedYear = inspectedParts[0] || 2026;
  const inspectedMonth = inspectedParts[1] || 10;
  const inspectedDay = inspectedParts[2] || 21;
  const inspectedDayRating = evaluateDate(inspectedYear, inspectedMonth, inspectedDay);

  // Tách Chi ngày từ fullName (ví dụ: "Canh Thìn" -> "Thìn")
  const dayBranch = inspectedDayRating.dayCanChi.split(' ')[1] || 'Thìn';
  const zodiacList = get12ZodiacCompatibility(dayBranch);

  // Tính toán cá nhân hóa
  const birthParts = birthDateStr.split('-').map(Number);
  const birthYear = birthParts[0] || 1990;
  const birthMonth = birthParts[1] || 1;
  const birthDay = birthParts[2] || 1;
  const personalComp = evaluatePersonalDateCompatibility(
    birthYear,
    birthMonth,
    birthDay,
    inspectedYear,
    inspectedMonth,
    inspectedDay
  );

  const purposesList: { id: EventPurpose; label: string; desc: string }[] = [
    { id: 'cuoi_hoi', label: 'Cưới Hỏi & Đính Hôn', desc: 'Chọn ngày hòa hợp, trực Thành/Khai, tránh Cô Hư Sát' },
    { id: 'khai_truong', label: 'Khai Trương Mở Cửa', desc: 'Chọn ngày Hoàng Đạo sinh tài, trực Mãn/Khai/Thành' },
    { id: 'dong_tho', label: 'Động Thổ Khởi Công', desc: 'Chọn ngày hoàng đạo, trực Định/Trừ, tránh Nguyệt Phá' },
    { id: 'nhap_trach', label: 'Nhập Trạch Nhà Mới', desc: 'Chọn ngày định cư an lạc, sao tốt Nhị Thập Bát Tú' },
    { id: 'ky_ket', label: 'Ký Kết Hợp Đồng', desc: 'Chọn ngày thông thuận giao dịch, trực Thâu/Khai' },
    { id: 'xuat_hanh', label: 'Xuất Hành Đi Xa', desc: 'Chọn ngày Thanh Long, Minh Đường, tránh ngày thụ tử' },
  ];

  const getRecommendationBadge = (level: string) => {
    switch (level) {
      case 'Đại Cát':
      case 'Đại Cát Hợp Bản Mệnh':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Thứ Cát':
      case 'Cát Lợi Khá':
        return 'bg-gold-500/20 text-gold-300 border-gold-500/40';
      case 'Bình Hòa':
      case 'Bình Hòa Có Thể Dùng':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Nên Thận Trọng':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  const getRelationBadge = (rel: string) => {
    switch (rel) {
      case 'Lục Hợp':
        return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50';
      case 'Tam Hợp':
        return 'bg-jade-500/25 text-jade-300 border-jade-500/50';
      case 'Lục Xung':
        return 'bg-rose-500/25 text-rose-300 border-rose-500/50';
      case 'Tương Hại':
      case 'Tương Hình':
        return 'bg-amber-500/25 text-amber-300 border-amber-500/50';
      case 'Tương Phá':
        return 'bg-purple-500/25 text-purple-300 border-purple-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Icon con giáp trực quan
  const getAnimalEmoji = (branch: string) => {
    switch (branch) {
      case 'Tý': return '🐭';
      case 'Sửu': return '🐂';
      case 'Dần': return '🐯';
      case 'Mão': return '🐱';
      case 'Thìn': return '🐲';
      case 'Tỵ': return '🐍';
      case 'Ngọ': return '🐴';
      case 'Mùi': return '🐐';
      case 'Thân': return '🐵';
      case 'Dậu': return '🐔';
      case 'Tuất': return '🐶';
      case 'Hợi': return '🐷';
      default: return '⭐';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span>100% Thuần Cổ Thư – Khâm Định Hiệp Kỷ Biện Phương Thư & Ngọc Hạp Thông Thư</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gold-gradient-text font-oriental">
          Hệ Thống Trạch Cát – Xem Ngày Tốt Xấu
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-xs sm:text-sm leading-relaxed">
          Tra cứu ngày giờ theo 12 Trực, 28 Nhị Thập Bát Tú, Lục Thần Hoàng Đạo và Bảng Tương Quan 12 Con Giáp.
          Đặc biệt hỗ trợ nhập ngày tháng năm sinh để đối chiếu trực tiếp với bản mệnh đương số theo nguyên tắc cổ điển.
        </p>
      </div>

      {/* Personal Profile Bar */}
      <PersonalProfileBar moduleTitle="Xem Ngày Tốt Xấu & Trạch Cát" />

      {/* Form Chọn Mục Đích & Khoảng Thời Gian */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/25 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-gold-400" />
            <h3 className="text-sm font-bold text-slate-100 font-oriental">1. Lựa Chọn Mục Đích Khởi Sự</h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Phép trạch cát phân định theo từng đại sự cụ thể</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {purposesList.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPurpose(p.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPurpose === p.id
                  ? 'border-gold-500 bg-gold-500/15 text-gold-200 shadow-sm'
                  : 'border-slate-800 bg-ink-950/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              <strong className="text-xs block font-oriental mb-0.5">{p.label}</strong>
              <span className="text-[10px] text-slate-400 line-clamp-2">{p.desc}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Bắt Đầu Từ Ngày:</label>
            <input
              type="date"
              value={startDateStr}
              onChange={(e) => setStartDateStr(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-ink-900 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Khoảng Thời Gian Tìm Kiếm:</label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-ink-900 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
            >
              <option value={7}>Trong 7 ngày tới</option>
              <option value={14}>Trong 14 ngày tới (2 tuần)</option>
              <option value={30}>Trong 30 ngày tới (1 tháng)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gold-400 font-semibold mb-1">Ngày Đang Xem Chi Tiết:</label>
            <input
              type="date"
              value={inspectedDateStr}
              onChange={(e) => setInspectedDateStr(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-ink-900 border border-gold-500/50 text-gold-200 font-semibold text-xs focus:border-gold-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* PHẦN 2: Ô NHẬP NGÀY THÁNG NĂM SINH & ĐÁNH GIÁ CÁ NHÂN HÓA */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/35 space-y-5 bg-gradient-to-b from-ink-900/90 to-ink-950/90 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <User className="w-5 h-5 text-gold-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100 font-oriental">
                2. Khảo Cứu Cá Nhân Hóa Theo Ngày Tháng Năm Sinh Của Đương Số
              </h3>
              <p className="text-xs text-slate-400">
                Nhập ngày sinh để đối chiếu trực tiếp Can Chi, Nạp Âm và Thần Sát của ngày với bản mệnh
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-ink-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">
              Ngày sinh đương số <span className="text-[10px] text-gold-400 font-normal ml-1">(VD: 01/01/1990)</span>:
            </span>
            <input
              type="date"
              value={birthDateStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              className="px-2 py-0.5 rounded bg-ink-900 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Khối Thông Tin Đương Số & Ngày Đang Soi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-ink-950/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block">Bản Mệnh Đương Số</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-slate-100 font-oriental">{personalComp.personYearCanChi}</span>
              <span className="text-xs text-slate-400">({personalComp.personNapAm})</span>
            </div>
            <p className="text-xs text-slate-400">
              Sinh ngày Dương lịch: <strong className="text-slate-200">{personalComp.personBirthDate}</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-ink-950/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Khí Vận Ngày Đang Xem</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-slate-100 font-oriental">Ngày {personalComp.dayCanChi}</span>
              <span className="text-xs text-slate-400">({personalComp.dayNapAm})</span>
            </div>
            <p className="text-xs text-slate-400">
              Thời gian: <strong className="text-slate-200">{personalComp.targetDate}</strong> • Trực: <strong className="text-slate-200">{inspectedDayRating.truc.name}</strong> • Khí: <strong className="text-slate-200">{inspectedDayRating.hoangDao.name}</strong>
            </p>
          </div>
        </div>

        {/* Thẻ Kết Luận Cá Nhân Hóa */}
        <div className={`p-5 rounded-2xl border ${personalComp.branchRelation.isConflict ? 'border-rose-500/60 bg-rose-950/20' : 'border-gold-500/40 bg-ink-950/90'} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              {personalComp.branchRelation.isConflict ? (
                <ShieldAlert className="w-7 h-7 text-rose-400 flex-shrink-0 animate-pulse" />
              ) : (
                <Award className="w-7 h-7 text-gold-400 flex-shrink-0" />
              )}
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Đánh Giá Bản Mệnh Với Ngày</span>
                <h4 className="text-lg font-bold text-slate-100 font-oriental">
                  {personalComp.verdict}
                </h4>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-xs px-3 py-1 rounded-lg border font-bold ${getRecommendationBadge(personalComp.verdict)}`}>
                Điểm Cá Nhân: {personalComp.totalScore}/100
              </span>
            </div>
          </div>

          {/* 4 Trụ Cột Tương Phối Cổ Điển */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-ink-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-semibold">1. Địa Chi Tuổi vs Chi Ngày</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getRelationBadge(personalComp.branchRelation.type)}`}>
                {personalComp.branchRelation.type}
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
                {personalComp.branchRelation.explanation}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-ink-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-semibold">2. Thiên Can Tuổi vs Can Ngày</span>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-ink-950 border border-slate-700 text-slate-200">
                {personalComp.stemRelation.type}
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
                {personalComp.stemRelation.explanation}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-ink-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-semibold">3. Nạp Âm Ngũ Hành</span>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-ink-950 border border-slate-700 text-slate-200">
                {personalComp.napAmRelation.type}
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
                {personalComp.napAmRelation.explanation}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-ink-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-semibold">4. Thần Sát Bản Mệnh Đắc Vị</span>
              {personalComp.deities.length > 0 ? (
                <div className="space-y-1 pt-0.5">
                  {personalComp.deities.map((d, i) => (
                    <div key={i} className="text-[11px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      ★ <strong>{d.name}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 text-[11px] block pt-1">Không đắc thần sát đặc biệt</span>
              )}
            </div>
          </div>

          {/* Lời Khuyên Hành Động */}
          <div className="p-3.5 rounded-xl bg-ink-900/90 border border-slate-800 text-xs text-slate-200 space-y-1">
            <strong className="text-gold-300 font-oriental flex items-center space-x-1.5">
              <BookmarkCheck className="w-4 h-4 text-gold-400" />
              <span>Khuyến Nghị Hành Động Dành Riêng Cho Đương Số:</span>
            </strong>
            <p className="leading-relaxed pl-5 text-slate-300">
              {personalComp.advice}
            </p>
          </div>

          {/* Hồ sơ dẫn chứng cổ thư A -> H */}
          <ClassicalEvidenceDrawer evidence={personalComp.classicalEvidence} />
        </div>
      </div>

      {/* PHẦN 3: BẢNG HIỂN THỊ ĐỦ 12 CON GIÁP TRONG NGÀY ĐANG XEM */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 font-oriental flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span>3. Bảng Tương Quan Đầy Đủ 12 Con Giáp Trong Ngày {personalComp.dayCanChi} ({inspectedDateStr})</span>
            </h3>
            <span className="text-xs text-slate-400">
              Khảo sát toàn diện Lục Hợp, Tam Hợp, Lục Xung, Tương Hại, Tương Hình, Tương Phá theo 《Hiệp Kỷ Biện Phương Thư》
            </span>
          </div>
          <span className="text-xs px-3 py-1 rounded bg-ink-950 text-gold-300 border border-gold-500/30 font-mono">
            Chi ngày: {dayBranch}
          </span>
        </div>

        {/* 12 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {zodiacList.map((z, idx) => {
            const isUserZodiac = z.branch === personalComp.personYearCanChi.split(' ')[1];
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all space-y-2 relative ${
                  isUserZodiac
                    ? 'border-gold-400 bg-gold-500/10 shadow-md ring-1 ring-gold-400/30'
                    : z.relationType === 'Lục Xung'
                    ? 'border-rose-500/40 bg-rose-950/15'
                    : z.relationType === 'Lục Hợp' || z.relationType === 'Tam Hợp'
                    ? 'border-emerald-500/40 bg-emerald-950/15'
                    : 'border-slate-800 bg-ink-950/70'
                }`}
              >
                {isUserZodiac && (
                  <span className="absolute -top-2 right-2 text-[10px] px-2 py-0.2 rounded-full bg-gold-500 text-ink-950 font-bold shadow">
                    Tuổi Của Bạn
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getAnimalEmoji(z.branch)}</span>
                    <div>
                      <strong className="text-sm font-bold text-slate-100 font-oriental">
                        {z.branch} ({z.animal})
                      </strong>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getRelationBadge(z.relationType)}`}>
                    {z.relationType}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                  <span className="text-[11px] text-slate-400">Đánh giá:</span>
                  <span className={`text-[11px] px-2 py-0.2 rounded border font-semibold ${getRecommendationBadge(z.level)}`}>
                    {z.level}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                  {z.advice}
                </p>

                <div className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800/40 font-mono line-clamp-2">
                  {z.classicalQuote}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PHẦN 4: DANH SÁCH NGÀY ĐỀ XUẤT THEO MỤC ĐÍCH */}
      <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-200 font-oriental flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gold-400" />
              <span>4. Danh Sách Ngày Được Đề Xuất (Xếp theo Điểm Cát Khí Tự Nhiên)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Nhấn vào bất kỳ ngày nào bên dưới để nạp vào Bảng Tra Cứu 12 Con Giáp & Bản Mệnh ở trên
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-ink-950 text-gold-300 border border-slate-800 font-mono">
            {goodDates.length} ngày gợi ý
          </span>
        </div>

        <div className="space-y-3">
          {goodDates.map((item, idx) => {
            const isSelected = item.solarDate === inspectedDateStr;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all space-y-2 ${
                  isSelected
                    ? 'border-gold-500 bg-gold-500/15 shadow-md ring-1 ring-gold-400/40'
                    : 'bg-ink-950/70 border-slate-800 hover:border-gold-500/40'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-base font-bold text-slate-100 font-oriental">
                      {item.solarDate}
                    </span>
                    <span className="text-xs font-semibold text-gold-300 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                      Ngày {item.dayCanChi}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      Tiết khí: <strong className="text-slate-200">{item.solarTerm}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded border font-semibold ${getRecommendationBadge(item.recommendationLevel)}`}>
                      {item.recommendationLevel} ({item.score}đ)
                    </span>
                    <button
                      type="button"
                      onClick={() => setInspectedDateStr(item.solarDate)}
                      className={`text-xs px-3 py-1 rounded-lg border font-medium flex items-center space-x-1 transition-all ${
                        isSelected
                          ? 'bg-gold-500 text-ink-950 border-gold-400 font-bold'
                          : 'bg-ink-900 text-gold-300 border-slate-700 hover:border-gold-500 hover:bg-gold-500/10'
                      }`}
                    >
                      <span>{isSelected ? 'Đang Xem Chi Tiết' : 'Soi 12 Con Giáp'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Badges: Trực, Tú, Hoàng Đạo */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-ink-900 border border-slate-800 text-slate-300">
                    Trực: <strong className={item.truc.nature === 'Cát' ? 'text-emerald-300' : 'text-slate-300'}>{item.truc.name} ({item.truc.nature})</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-ink-900 border border-slate-800 text-slate-300">
                    Nhị Thập Bát Tú: <strong className={item.tu28.nature === 'Cát' ? 'text-emerald-300' : 'text-slate-300'}>Sao {item.tu28.name} ({item.tu28.animal})</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-ink-900 border border-slate-800 text-slate-300">
                    Khí vận: <strong className={item.hoangDao.isHoangDao ? 'text-gold-300' : 'text-rose-400'}>{item.hoangDao.name}</strong>
                  </span>
                </div>

                {/* Detailed Reason */}
                <p className="text-xs text-slate-300 pt-1 leading-relaxed border-t border-slate-800/60">
                  {item.detailedReason}
                </p>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 rounded-xl bg-ink-950 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-jade-400 flex-shrink-0 mt-0.5" />
          <span>
            Hệ thống tuân thủ nghiêm ngặt tôn chỉ của 《Khâm Định Hiệp Kỷ Biện Phương Thư》: "Dĩ nhân vi bản, dĩ nhật vi dụng". Chọn ngày tốt vừa hòa hợp thiên thời, vừa tương sinh với căn mệnh của đương số, tuyệt đối loại trừ các ngày trực xung bản mệnh.
          </span>
        </div>
      </div>

    </div>
  );
};
