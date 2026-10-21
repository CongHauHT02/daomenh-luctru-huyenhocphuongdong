import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { evaluateDate } from '../engine/dateSelection';
import { getCurrentSolarTerm, getDayCanChi } from '../engine/calendar';
import {
  Compass,
  Scroll,
  Layers,
  Sparkles,
  Hand,
  Smile,
  Heart,
  Calendar,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Feather
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { config, setActiveTab, calculateAllCharts, currentProfile } = useApp();

  // Quick Calculator State - synchronized with global profile
  const [quickName, setQuickName] = useState(currentProfile?.fullName || 'Nguyễn Văn An');
  const [quickGender, setQuickGender] = useState<'male' | 'female'>(currentProfile?.gender || 'male');
  const [quickDate, setQuickDate] = useState(currentProfile?.birthDate || '1990-01-01');
  const [quickHour, setQuickHour] = useState(currentProfile ? currentProfile.birthHour : 1);
  const [quickMinute, setQuickMinute] = useState(currentProfile ? currentProfile.birthMinute : 0);

  useEffect(() => {
    if (currentProfile) {
      setQuickName(currentProfile.fullName);
      setQuickGender(currentProfile.gender);
      setQuickDate(currentProfile.birthDate);
      setQuickHour(currentProfile.birthHour);
      setQuickMinute(currentProfile.birthMinute);
    }
  }, [currentProfile]);

  const today = new Date();
  const todayRating = evaluateDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const todayTerm = getCurrentSolarTerm(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const todayCanChi = getDayCanChi(today.getDate(), today.getMonth() + 1, today.getFullYear());

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [y, m, d] = quickDate.split('-').map(Number);
    calculateAllCharts(quickName, quickGender, y, m, d, quickHour, quickMinute);
    setActiveTab('bazi');
  };

  const featureCards = [
    {
      id: 'bazi',
      title: 'Bát Tự Tứ Trụ',
      subtitle: 'Kinh điển Tử Bình truyền thống',
      desc: 'Phân định năm tháng ngày giờ theo 24 tiết khí, tàng can, thập thần, ngũ hành vượng suy và đại vận 10 năm.',
      icon: Scroll,
      badge: 'Cốt Lõi',
      color: 'border-gold-500/40 text-gold-300'
    },
    {
      id: 'liuzhu',
      title: 'Lục Trụ Mệnh Lý',
      subtitle: 'Thai Nguyên & Khắc Trụ',
      desc: 'Nâng cao độ phân giải mệnh bàn từ 4 lên 6 trụ (12 can chi), soi chiếu Tiên Thiên Thụ Khí và Mệnh Cung Hậu Thiên.',
      icon: Layers,
      badge: 'Đặc Quyền',
      color: 'border-jade-500/40 text-jade-300'
    },
    {
      id: 'tuvi',
      title: 'Tử Vi Đẩu Số',
      subtitle: 'Địa bàn 12 cung chức vị',
      desc: 'An Mệnh Thân theo tháng âm lịch, định Cục số, an 14 Chính Tinh, Tứ Hóa Can Năm và tam phương tứ chính.',
      icon: Sparkles,
      badge: 'Toàn Diện',
      color: 'border-cyan-500/40 text-cyan-300'
    },
    {
      id: 'palmistry',
      title: 'Vẽ & Xem Chỉ Tay',
      subtitle: 'Canvas tương tác trực tiếp',
      desc: 'Tự vẽ đường sinh đạo, trí đạo, tâm đạo trên canvas cảm ứng hoặc tải ảnh lòng bàn tay lên để đối chiếu quy tắc.',
      icon: Hand,
      badge: 'Tương Tác',
      color: 'border-emerald-500/40 text-emerald-300'
    },
    {
      id: 'face_fingerprint',
      title: 'Tướng Mặt & Vân Tay',
      subtitle: 'Tam Đình Ngũ Nhạc & Sinh Trắc',
      desc: 'Khảo cứu hình thái Tam Đình, 12 Cung diện mạo (Ma Y Thần Tướng) và 3 hệ vân tay (Whorl, Loop, Arch).',
      icon: Smile,
      badge: 'Khoa Học',
      color: 'border-amber-500/40 text-amber-300'
    },
    {
      id: 'compatibility',
      title: 'Xem Tuổi Hôn Nhân',
      subtitle: 'Tương hợp đa trường phái',
      desc: 'Đối chiếu Nạp Âm ngũ hành, Bát Trạch Cung Phi nam nữ, tư vấn tâm lý giao tiếp và phương pháp hóa giải.',
      icon: Heart,
      badge: 'Gia Đạo',
      color: 'border-rose-500/40 text-rose-300'
    },
    {
      id: 'date_selection',
      title: 'Xem Ngày Tốt Xấu',
      subtitle: 'Trạch cát 12 Trực & 28 Tú',
      desc: 'Lựa chọn thời khắc cát tường cho cưới hỏi, khai trương, động thổ, nhập trạch với minh bạch lý do lọc ngày.',
      icon: Calendar,
      badge: 'Trạch Cát',
      color: 'border-yellow-500/40 text-yellow-300'
    },
    {
      id: 'knowledge',
      title: 'Thư Viện Cổ Thư',
      subtitle: 'Uyên Hải, Đích Thiên Tủy, Tam Mệnh',
      desc: 'Tra cứu hàng trăm chương mục nguyên bản chữ Hán kèm bản dịch tiếng Việt chuẩn xác và chú giải học thuật.',
      icon: BookOpen,
      badge: 'Tri Thức',
      color: 'border-slate-500/40 text-slate-300'
    }
  ];

  return (
    <div className="space-y-16 py-6 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-xs font-semibold text-gold-300 shadow-sm">
                <Feather className="w-3.5 h-3.5 text-gold-400" />
                <span>Nền Tảng Huyền Học Phương Đông Chuẩn Mực</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight gold-gradient-text font-oriental leading-tight">
                {config.brandName}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
                Khám phá chân lý sinh mệnh qua sự phối hợp chặt chẽ giữa <strong>Toán học lịch pháp thiên văn</strong>, 
                <strong> Tứ đại cổ thư kinh điển</strong> và <strong>Kiến trúc AI luận giải 3 lớp</strong>.
                Không mê tín dị đoan, tuyệt đối không suy đoán bừa bãi.
              </p>

              {/* Badges / Guarantees */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs text-slate-300">
                <span className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-ink-900 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-jade-400" />
                  <span>Tiết khí VSOP87 chính xác từng phút</span>
                </span>
                <span className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-ink-900 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-jade-400" />
                  <span>Tách biệt Bát Tự & Tử Vi</span>
                </span>
                <span className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-ink-900 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-jade-400" />
                  <span>Trích dẫn cổ thư nguyên bản</span>
                </span>
              </div>
            </div>

            {/* Right Hero: Quick Birth Chart Form */}
            <div className="lg:col-span-5">
              <div className="oriental-card rounded-3xl p-6 sm:p-8 border border-gold-500/35 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 font-oriental">Tra Cứu Nhanh Lá Số</h3>
                    <span className="text-xs text-slate-400">Khởi lập Bát Tự, Lục Trụ & Tử Vi ngay tức thì</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                  </div>
                </div>

                <form onSubmit={handleQuickSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Họ Tên Đương Số</label>
                    <input
                      type="text"
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                      placeholder="VD: Nguyễn Văn An..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Giới Tính</label>
                      <select
                        value={quickGender}
                        onChange={(e) => setQuickGender(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Ngày Sinh (Dương) <span className="text-[10px] text-gold-400 font-normal ml-1">VD: 01/01/1990</span>
                      </label>
                      <input
                        type="date"
                        value={quickDate}
                        onChange={(e) => setQuickDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Giờ Sinh (0 - 23) <span className="text-[10px] text-gold-400 font-normal ml-1">VD: 01</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        placeholder="01"
                        value={quickHour}
                        onChange={(e) => setQuickHour(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phút Sinh (0 - 59) <span className="text-[10px] text-gold-400 font-normal ml-1">VD: 00</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="00"
                        value={quickMinute}
                        onChange={(e) => setQuickMinute(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-slate-700 text-slate-100 text-xs focus:border-gold-500 focus:outline-none text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-ink-950 font-bold text-xs tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 mt-2"
                  >
                    <span>Lập Lá Số & Xem Luận Giải</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-[11px] text-slate-500 mt-3 text-center">
                  * Tự động chuyển đổi âm lịch & tính toán cả Bát Tự, Lục Trụ và Tử Vi cùng lúc.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TODAY'S METAPHYSICAL CLIMATE STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="oriental-card rounded-2xl p-6 border border-gold-500/25">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400">Thời Tiết Mệnh Lý Hôm Nay</span>
                <h3 className="text-lg font-bold text-slate-100 font-oriental">
                  Ngày {todayCanChi.fullName} – Tiết Khí {todayTerm.name}
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-ink-950 border border-slate-800">
                <span className="text-slate-400">Khí Vận: </span>
                <strong className={todayRating.hoangDao.isHoangDao ? 'text-gold-300' : 'text-rose-400'}>
                  {todayRating.hoangDao.name}
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-ink-950 border border-slate-800">
                <span className="text-slate-400">Trực: </span>
                <strong className="text-emerald-300">{todayRating.truc.name} ({todayRating.truc.nature})</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-ink-950 border border-slate-800">
                <span className="text-slate-400">Nhị Thập Bát Tú: </span>
                <strong className="text-slate-200">Sao {todayRating.tu28.name}</strong>
              </div>
              <button
                onClick={() => setActiveTab('date_selection')}
                className="px-3 py-2 rounded-xl bg-gold-500/20 text-gold-300 hover:bg-gold-500/30 border border-gold-500/40 font-semibold transition-colors"
              >
                Xem Chi Tiết Ngày &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* THREE FUNDAMENTAL PRINCIPLES BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">Tôn Chỉ Học Thuật</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-oriental mt-1">
            Ba Nguyên Tắc Vàng Của Nền Tảng Đạo Mệnh
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="oriental-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold font-oriental text-lg">
              1
            </div>
            <h3 className="text-base font-bold text-slate-100 font-oriental">
              Phân Biệt Đúng Các Hệ Thống
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bát Tự Tứ Trụ, Lục Trụ Mệnh Lý và Tử Vi Đẩu Số không phải là ba tên gọi thay thế cho nhau. Mỗi hệ thống có quy tắc lập riêng, nguồn tài liệu riêng và thuật toán tính tháng riêng biệt.
            </p>
          </div>

          <div className="oriental-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-jade-500/10 border border-jade-500/30 flex items-center justify-center text-jade-400 font-bold font-oriental text-lg">
              2
            </div>
            <h3 className="text-base font-bold text-slate-100 font-oriental">
              Tính Toán Trước, AI Diễn Giải Sau
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Can Chi, ngày âm, tiết khí, sao và lá số phải được tính bằng thuật toán thiên văn xác định có thể kiểm thử. AI chỉ đóng vai trò phân tích và giải thích ngôn ngữ tự nhiên từ dữ liệu đã tính.
            </p>
          </div>

          <div className="oriental-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-oriental text-lg">
              3
            </div>
            <h3 className="text-base font-bold text-slate-100 font-oriental">
              Coi Trọng Cổ Thư & Đạo Đức
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tuyệt đối không bịa trích dẫn cổ thư. Không dùng ngôn từ gieo rắc nỗi sợ hãi về tai họa hay bệnh tật. Mọi luận giải mang tính tham khảo hoàn thiện nhân cách và định hướng cuộc sống.
            </p>
          </div>
        </div>
      </section>

      {/* 8 FEATURE CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">Công Cụ Nghiên Cứu</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-oriental mt-1">
            Các Chuyên Mục Mệnh Lý Chuyên Sâu
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="oriental-card oriental-card-hover rounded-2xl p-6 border cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl bg-ink-950 border ${card.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-ink-950 text-slate-400 border border-slate-800">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-oriental">
                      {card.title}
                    </h3>
                    <span className="text-xs text-gold-400 block mb-2">{card.subtitle}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-gold-300 font-semibold">
                  <span>Trải nghiệm ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gold-500/20 pt-10 pb-8 text-center text-xs text-slate-500 max-w-7xl mx-auto px-4">
        <p className="font-oriental text-slate-400 mb-2">
          {config.brandName} – {config.slogan}
        </p>
        <p>
          Hệ thống nghiên cứu văn hóa truyền thống phương Đông. Không thay thế các tư vấn y khoa, tài chính, pháp lý chuyên nghiệp.
        </p>
      </footer>

    </div>
  );
};
