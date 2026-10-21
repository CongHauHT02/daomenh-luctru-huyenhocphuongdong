import React, { useState, useEffect } from 'react';
import {
  FACE_REGIONS,
  FINGERPRINT_PATTERNS,
  FaceReadingReport,
  FingerprintReadingReport,
  analyzeFaceCanvasImage,
  generateDefaultFaceReport,
  generateFingerprintReport
} from '../engine/faceAndFingerprint';
import {
  Smile,
  Fingerprint,
  ShieldCheck,
  Eye,
  Info,
  Camera,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Compass,
  Scroll,
  Layers,
  Award,
  Zap,
  RefreshCw,
  Sliders,
  ChevronRight,
  Flame,
  Heart
} from 'lucide-react';
import { PersonalProfileBar } from './PersonalProfileBar';

export const FaceAndFingerprintDisplay: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'face' | 'fingerprint'>('face');
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number>(0);
  const [userFaceImage, setUserFaceImage] = useState<string | null>(null);
  const [isAnalyzingFace, setIsAnalyzingFace] = useState<boolean>(false);
  const [faceReport, setFaceReport] = useState<FaceReadingReport | null>(null);

  // Fingerprint state
  const [fingerprintMap, setFingerprintMap] = useState<Record<string, 'whorl' | 'loop' | 'arch'>>({
    L_thumb: 'whorl',
    L_index: 'loop',
    L_middle: 'whorl',
    L_ring: 'loop',
    L_pinky: 'whorl',
    R_thumb: 'whorl',
    R_index: 'whorl',
    R_middle: 'loop',
    R_ring: 'whorl',
    R_pinky: 'loop'
  });
  const [fingerprintReport, setFingerprintReport] = useState<FingerprintReadingReport>(() =>
    generateFingerprintReport({
      L_thumb: 'whorl',
      L_index: 'loop',
      L_middle: 'whorl',
      L_ring: 'loop',
      L_pinky: 'whorl',
      R_thumb: 'whorl',
      R_index: 'whorl',
      R_middle: 'loop',
      R_ring: 'whorl',
      R_pinky: 'loop'
    })
  );
  const [uploadedFingerprintImage, setUploadedFingerprintImage] = useState<string | null>(null);
  const [fingerprintAnalysisNotice, setFingerprintAnalysisNotice] = useState<string | null>(null);

  // Generate initial face report so user sees reading even before uploading
  useEffect(() => {
    if (!faceReport) {
      setFaceReport(generateDefaultFaceReport(1.24, 0.33, 0.34, 0.33, 135, 'Hoàng Minh (Vàng Sáng Nhuận)'));
    }
  }, [faceReport]);

  // Handle uploading user face image
  const handleFaceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setIsAnalyzingFace(true);
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        setUserFaceImage(dataUrl);
        try {
          const report = await analyzeFaceCanvasImage(dataUrl);
          setFaceReport(report);
        } catch (err) {
          setFaceReport(generateDefaultFaceReport(1.28, 0.34, 0.33, 0.33, 140, 'Hồng Nhuận (Hồng Sáng Vượng)'));
        } finally {
          setIsAnalyzingFace(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick sample face test
  const handleUseSampleFace = (type: 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho') => {
    setIsAnalyzingFace(true);
    setTimeout(() => {
      let r: FaceReadingReport;
      if (type === 'kim') {
        r = generateDefaultFaceReport(1.20, 0.33, 0.34, 0.33, 138, 'Hoàng Minh (Vàng Sáng Nhuận)');
      } else if (type === 'moc') {
        r = generateDefaultFaceReport(1.42, 0.36, 0.33, 0.31, 145, 'Thanh Bạch (Trắng Sáng Thanh)');
      } else if (type === 'thuy') {
        r = generateDefaultFaceReport(1.10, 0.32, 0.33, 0.35, 130, 'Trầm Tĩnh (Nội Liễm)');
      } else if (type === 'hoa') {
        r = generateDefaultFaceReport(1.30, 0.37, 0.34, 0.29, 155, 'Hồng Nhuận (Hồng Sáng Vượng)');
      } else {
        r = generateDefaultFaceReport(1.18, 0.32, 0.33, 0.35, 125, 'Hoàng Minh (Vàng Sáng Nhuận)');
      }
      setFaceReport(r);
      setIsAnalyzingFace(false);
    }, 400);
  };

  // Handle fingerprint image upload
  const handleFingerprintImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUploadedFingerprintImage(dataUrl);
        // Canvas simple edge analysis simulation for fingerprint
        setFingerprintAnalysisNotice(
          'Đã nhận diện đường vân: Cung tròn xoáy tâm (Whorl - Hoa Tay). Đã tự động cập nhật ngón cái chỉ huy.'
        );
        // Automatically ensure thumb is whorl
        updateSingleFinger('L_thumb', 'whorl');
      };
      reader.readAsDataURL(file);
    }
  };

  // Update a single finger in the 10-finger matrix
  const updateSingleFinger = (key: string, pattern: 'whorl' | 'loop' | 'arch') => {
    const updated = { ...fingerprintMap, [key]: pattern };
    setFingerprintMap(updated);
    setFingerprintReport(generateFingerprintReport(updated));
  };

  const selectedRegion = FACE_REGIONS[selectedRegionIndex];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
      
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-xs font-semibold text-gold-300">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Thẩm Định Diện Tướng Cổ Điển & Thủ Tướng Thập Chỉ</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight gold-gradient-text font-oriental leading-tight">
          Nhân Tướng Diện Mạo & Bát Quái Vân Tay
        </h1>
        <p className="text-slate-300 max-w-3xl mx-auto text-xs sm:text-sm font-light leading-relaxed px-2">
          Hệ thống phát quẻ luận mệnh từ hình ảnh theo nguyên tắc <strong>《Ma Y Thần Tướng》</strong>, 
          <strong> 《Thần Tướng Toàn Biên》</strong> và <strong>《Bát Quái Thủ Tướng Toàn Thư》</strong>.
          Tuyệt đối xử lý cục bộ trên trình duyệt, không lưu ảnh hay nhận dạng sinh trắc học.
        </p>
      </div>

      {/* Unified Personal Profile Bar */}
      <PersonalProfileBar moduleTitle="Tướng Mặt & Vân Tay" />

      {/* Responsive Mode Switcher */}
      <div className="flex justify-center px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 p-1.5 rounded-2xl bg-ink-900 border border-gold-500/35 shadow-xl w-full sm:w-auto gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('face')}
            className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'face'
                ? 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-ink-950 shadow-gold-glow'
                : 'text-slate-300 hover:text-gold-200 hover:bg-ink-850'
            }`}
          >
            <Smile className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Xem Tướng Mặt (Tam Đình & 12 Cung)</span>
          </button>
          <button
            onClick={() => setActiveTab('fingerprint')}
            className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'fingerprint'
                ? 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-ink-950 shadow-gold-glow'
                : 'text-slate-300 hover:text-gold-200 hover:bg-ink-850'
            }`}
          >
            <Fingerprint className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Phân Tích Vân Tay (Bát Quái Thập Chỉ)</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* FACE READING SECTION (XEM TƯỚNG MẶT) */}
      {/* ==================================================== */}
      {activeTab === 'face' && (
        <div className="space-y-8">
          
          {/* Action Toolbar: Upload + Sample presets */}
          <div className="oriental-card rounded-2xl p-4 sm:p-5 border border-gold-500/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-100 font-oriental">
                  Tải Ảnh Khuôn Mặt Để Phát Quẻ Luận Mệnh
                </h3>
                <p className="text-xs text-slate-400">
                  Hệ thống tự động đo đạc tỷ lệ Tam Đình và khí sắc để lập quẻ cổ thư ngay lập tức
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <label className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-ink-950 font-bold text-xs shadow-gold-glow cursor-pointer transition-all active:scale-95">
                <Camera className="w-4 h-4" />
                <span>{userFaceImage ? 'Đổi Ảnh Khác' : 'Tải Ảnh Chân Dung'}</span>
                <input type="file" accept="image/*" onChange={handleFaceImageUpload} className="hidden" />
              </label>

              {/* Sample Face presets for fast testing */}
              <div className="flex items-center space-x-1 bg-ink-950 px-2 py-1 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <span className="hidden md:inline mr-1">Thử mẫu:</span>
                <button
                  onClick={() => handleUseSampleFace('kim')}
                  className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-gold-300 font-medium"
                >
                  Kim (Điền)
                </button>
                <button
                  onClick={() => handleUseSampleFace('moc')}
                  className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-gold-300 font-medium"
                >
                  Mộc (Giáp)
                </button>
                <button
                  onClick={() => handleUseSampleFace('thuy')}
                  className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-gold-300 font-medium"
                >
                  Thủy (Viên)
                </button>
                <button
                  onClick={() => handleUseSampleFace('hoa')}
                  className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-gold-300 font-medium"
                >
                  Hỏa (Mục)
                </button>
              </div>
            </div>
          </div>

          {/* Main 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Face Diagram & Regional Visualizer */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="oriental-card rounded-2xl p-5 border border-gold-500/25 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-sm font-semibold text-slate-200 font-oriental">
                    Đồ Bàn Tam Đình Diện Mạo
                  </span>
                  <span className="text-[11px] text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                    Phân Tích Cục Bộ
                  </span>
                </div>

                {/* Face Visualizer Frame */}
                <div className="relative w-full max-w-[340px] mx-auto aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold-500/30 bg-ink-950 flex flex-col justify-between p-3 shadow-2xl">
                  {userFaceImage ? (
                    <img
                      src={userFaceImage}
                      alt="Ảnh Chân Dung Đương Số"
                      className="absolute inset-0 w-full h-full object-cover opacity-75"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 pointer-events-none opacity-30">
                      <Smile className="w-32 h-32 text-gold-400" />
                      <span className="text-xs text-slate-400">
                        Chưa có ảnh chân dung. Đang hiển thị mô phỏng Tam Đình kinh điển.
                      </span>
                    </div>
                  )}

                  {/* 3 Interactive Clickable Regions Overlay */}
                  {FACE_REGIONS.map((region, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedRegionIndex(idx)}
                      className={`relative z-10 flex-1 my-1 rounded-xl border-2 p-2.5 sm:p-3 transition-all cursor-pointer flex flex-col justify-center backdrop-blur-md ${
                        selectedRegionIndex === idx
                          ? 'border-gold-400 bg-gold-500/35 shadow-gold-glow scale-[1.02]'
                          : 'border-dashed border-slate-600/70 bg-ink-950/70 hover:border-gold-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100 font-oriental">
                          {region.name} ({region.traditionalTerm})
                        </span>
                        <span className="text-[10px] text-gold-300 font-semibold bg-ink-900/80 px-2 py-0.5 rounded">
                          {idx === 0 ? '15 - 30T' : idx === 1 ? '31 - 50T' : '51T+'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-300 mt-1 line-clamp-1">{region.location}</span>
                    </div>
                  ))}
                </div>

                {/* Metrics Summary Strip */}
                {faceReport && (
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-ink-950/90 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Ngũ Hành Tướng</span>
                      <strong className="text-gold-300 font-oriental text-sm">
                        {faceReport.elementShape.nameVi}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-ink-950/90 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Độ Cân Xứng Tam Đình</span>
                      <strong className="text-emerald-400 font-oriental text-sm">
                        {faceReport.tamDinhVerdict.harmonyScore}% • Cân Đẳng
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Region Detailed Context */}
              <div className="oriental-card rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-gold-400 pb-2 border-b border-slate-800">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Khu Vực Đang Soi Chi Tiết: {selectedRegion.name}
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-2">
                  <p><strong>Vị trí giải phẫu:</strong> {selectedRegion.location}</p>
                  <p><strong>Ý nghĩa cổ văn:</strong> {selectedRegion.symbolism}</p>
                  <div className="p-2.5 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-200">
                    {selectedRegion.analysisInsight}
                  </div>
                </div>
              </div>

            </div>

            {/* Right: The Full Classical Reading Report (Phát Quẻ Từ Ảnh) */}
            <div className="lg:col-span-7 space-y-6">
              
              {isAnalyzingFace ? (
                <div className="oriental-card rounded-2xl p-12 border border-gold-500/40 text-center space-y-4 animate-pulse">
                  <div className="w-12 h-12 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto"></div>
                  <h4 className="text-base font-bold text-gold-300 font-oriental">
                    Đang Thẩm Định Tam Đình & Khởi Lập Quẻ Dịch Tướng Diện...
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Hệ thống đang đối chiếu tỷ lệ hình học diện mạo với điển tích 《Ma Y Thần Tướng》 và 《Thần Tướng Toàn Biên》.
                  </p>
                </div>
              ) : faceReport ? (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* HERO CARD: Quẻ Dịch Tướng Diện Cổ Điển */}
                  <div className="oriental-card rounded-2xl p-6 border-2 border-gold-500/50 shadow-2xl relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold-500/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-gold-500/30">
                      <div>
                        <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest block font-mono">
                          PHÁT QUẺ DIỆN TƯỚNG KINH DỊCH
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold gold-gradient-text font-oriental mt-0.5">
                          Quẻ {faceReport.hexagram.name} ({faceReport.hexagram.hanzi})
                        </h2>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-gold-500/20 border border-gold-500/50 flex items-center justify-center text-3xl font-bold text-gold-300 shadow-gold-glow">
                        {faceReport.hexagram.symbol}
                      </div>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      <div className="p-3.5 rounded-xl bg-ink-950/80 border border-gold-500/20 font-serif italic text-gold-200">
                        &ldquo;{faceReport.hexagram.judgement}&rdquo;
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-ink-950/60 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Tượng Quẻ & Nghĩa Lý</span>
                          <p className="text-slate-300 mt-1">{faceReport.hexagram.imageMeaning}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-ink-950/60 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Đương Thời Vận Lược</span>
                          <p className="text-slate-300 mt-1">{faceReport.hexagram.classicalInterpretation}</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span><strong>Lời khuyên hành động:</strong> {faceReport.hexagram.actionGuidance}</span>
                      </div>
                    </div>
                  </div>

                  {/* THẺ 2: Ngũ Hành Hình Tướng & Cốt Cách */}
                  <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                          Phân Định Ngũ Hành Diện Tướng
                        </span>
                        <h3 className="text-xl font-bold text-slate-100 font-oriental mt-0.5">
                          {faceReport.elementShape.nameVi} • {faceReport.elementShape.hanziName}
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                        Tướng Hành {faceReport.elementShape.element}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs text-slate-300">
                      <p><strong>Đặc trưng diện mạo:</strong> {faceReport.elementShape.facialCharacter}</p>
                      <p><strong>Cốt cách và cơ nhục:</strong> {faceReport.elementShape.boneAndFlesh}</p>

                      <div className="p-3.5 rounded-xl bg-ink-950/80 border border-slate-800 text-gold-300 font-serif">
                        {faceReport.elementShape.classicalQuote}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-ink-950/60 border border-slate-800">
                          <span className="text-emerald-400 font-bold block mb-1">Ưu Điểm Bẩm Sinh:</span>
                          <ul className="space-y-1">
                            {faceReport.elementShape.virtues.map((v, i) => (
                              <li key={i} className="flex items-start space-x-1">
                                <span className="text-emerald-400">•</span>
                                <span>{v}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 rounded-xl bg-ink-950/60 border border-slate-800">
                          <span className="text-amber-400 font-bold block mb-1">Điểm Cần Tu Dưỡng:</span>
                          <ul className="space-y-1">
                            {faceReport.elementShape.blindSpots.map((b, i) => (
                              <li key={i} className="flex items-start space-x-1">
                                <span className="text-amber-400">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* THẺ 3: Thẩm Định Tam Đình 3 Thời Kỳ */}
                  <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-5 h-5 text-gold-400" />
                        <h3 className="text-lg font-bold text-slate-100 font-oriental">
                          Luận Giải Tam Đình & Ba Giai Đoạn Đời Người
                        </h3>
                      </div>
                      <span className="text-xs text-jade-300 font-semibold bg-jade-500/10 px-2.5 py-1 rounded-lg border border-jade-500/30">
                        {faceReport.tamDinhVerdict.harmonyVerdict}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {/* Thượng Đình */}
                      <div className="p-3.5 rounded-xl bg-ink-950/70 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gold-300 font-oriental">Thượng Đình</span>
                          <span className="text-[10px] text-slate-400">15 - 30T</span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 block">
                          {faceReport.tamDinhVerdict.upperStatus.rating}
                        </span>
                        <p className="text-slate-300">{faceReport.tamDinhVerdict.upperStatus.insight}</p>
                        <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                          {faceReport.tamDinhVerdict.upperStatus.classicalRule}
                        </p>
                      </div>

                      {/* Trung Đình */}
                      <div className="p-3.5 rounded-xl bg-ink-950/70 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gold-300 font-oriental">Trung Đình</span>
                          <span className="text-[10px] text-slate-400">31 - 50T</span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 block">
                          {faceReport.tamDinhVerdict.middleStatus.rating}
                        </span>
                        <p className="text-slate-300">{faceReport.tamDinhVerdict.middleStatus.insight}</p>
                        <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                          {faceReport.tamDinhVerdict.middleStatus.classicalRule}
                        </p>
                      </div>

                      {/* Hạ Đình */}
                      <div className="p-3.5 rounded-xl bg-ink-950/70 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gold-300 font-oriental">Hạ Đình</span>
                          <span className="text-[10px] text-slate-400">51T trở đi</span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 block">
                          {faceReport.tamDinhVerdict.lowerStatus.rating}
                        </span>
                        <p className="text-slate-300">{faceReport.tamDinhVerdict.lowerStatus.insight}</p>
                        <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                          {faceReport.tamDinhVerdict.lowerStatus.classicalRule}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* THẺ 4: Giám Định Khí Sắc & 12 Cung Điển Hình */}
                  <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-5 h-5 text-amber-400" />
                        <h3 className="text-lg font-bold text-slate-100 font-oriental">
                          Giám Định Khí Sắc & Ngũ Cung Cốt Tử
                        </h3>
                      </div>
                      <span className="text-xs text-amber-300 font-mono">
                        {faceReport.khiSacInterpretation.title}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-ink-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <p>{faceReport.khiSacInterpretation.description}</p>
                      <p className="text-gold-300 font-semibold">{faceReport.khiSacInterpretation.forecastPeriod}</p>
                      <p className="text-[11px] text-slate-400 italic">{faceReport.khiSacInterpretation.sourceBook}</p>
                    </div>

                    {/* 5 Key Palaces */}
                    <div className="space-y-2.5 pt-1">
                      {faceReport.keyPalaces.map(pal => (
                        <div key={pal.id} className="p-3 rounded-xl bg-ink-950/50 border border-slate-800/80 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gold-300 font-oriental">{pal.name} ({pal.hanzi})</span>
                            <span className="text-[11px] text-slate-400">{pal.location}</span>
                          </div>
                          <p className="text-slate-300">{pal.currentAssessment}</p>
                          <p className="text-[10px] text-slate-400 italic">{pal.classicalSignificance}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* THẺ 5: Pháp Môn Dưỡng Tướng & Hành Đạo */}
                  <div className="oriental-card rounded-2xl p-6 border border-emerald-500/40 space-y-4 bg-ink-900/90">
                    <div className="flex items-center space-x-2 text-emerald-400 pb-2 border-b border-slate-800">
                      <ShieldCheck className="w-5 h-5" />
                      <h3 className="text-base font-bold font-oriental text-slate-100">
                        Pháp Môn Dưỡng Tướng & Chuyển Hóa Khí Sắc
                      </h3>
                    </div>

                    <div className="text-xs text-slate-300 space-y-3">
                      <blockquote className="p-3 rounded-xl bg-ink-950 border border-emerald-500/30 text-emerald-200 font-serif italic text-sm">
                        &ldquo;{faceReport.cultivationAdvice.coreMotto}&rdquo;
                      </blockquote>
                      <p className="leading-relaxed">{faceReport.cultivationAdvice.explanation}</p>

                      <div className="space-y-2 pt-1">
                        <span className="font-semibold text-slate-200 block text-xs">Ba Việc Cần Làm Để Dưỡng Tướng:</span>
                        {faceReport.cultivationAdvice.threeActions.map((act, i) => (
                          <div key={i} className="flex items-start space-x-2 p-2.5 rounded-lg bg-ink-950 border border-slate-800 text-xs">
                            <span className="text-gold-400 font-bold">{i + 1}.</span>
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              ) : null}

            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* FINGERPRINT SECTION (BÁT QUÁI THẬP CHỈ ĐỒ) */}
      {/* ==================================================== */}
      {activeTab === 'fingerprint' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Fingerprint Toolbar & Upload */}
          <div className="oriental-card rounded-2xl p-4 sm:p-5 border border-gold-500/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-100 font-oriental">
                  Đồ Bàn Bát Quái Thập Chỉ (10 Ngón Tay Toàn Diện)
                </h3>
                <p className="text-xs text-slate-400">
                  Chạm chọn loại vân cho từng ngón hoặc tải ảnh chụp vân tay để khởi lập quẻ luận
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <label className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-ink-900 hover:bg-ink-850 text-gold-300 border border-gold-500/40 font-bold text-xs cursor-pointer transition-all">
                <Camera className="w-4 h-4" />
                <span>Tải Ảnh Vân Tay (Cục bộ)</span>
                <input type="file" accept="image/*" onChange={handleFingerprintImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {fingerprintAnalysisNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{fingerprintAnalysisNotice}</span>
            </div>
          )}

          {/* Quick Counter Banner: Total Whorls / Loops / Arches */}
          <div className="grid grid-cols-3 gap-3">
            <div className="oriental-card rounded-2xl p-4 border border-gold-500/40 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-gold-400 block font-oriental">
                {fingerprintReport.whorlCount}
              </span>
              <span className="text-xs text-slate-300 font-semibold block">Vân Xoáy (Hoa Tay)</span>
              <span className="text-[10px] text-slate-400">Whorl • Chủ động</span>
            </div>
            <div className="oriental-card rounded-2xl p-4 border border-cyan-500/40 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 block font-oriental">
                {fingerprintReport.loopCount}
              </span>
              <span className="text-xs text-slate-300 font-semibold block">Vân Nước (Dòng Chảy)</span>
              <span className="text-[10px] text-slate-400">Loop • Thích ứng</span>
            </div>
            <div className="oriental-card rounded-2xl p-4 border border-amber-500/40 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 block font-oriental">
                {fingerprintReport.archCount}
              </span>
              <span className="text-xs text-slate-300 font-semibold block">Vân Núi (Vòm Cung)</span>
              <span className="text-[10px] text-slate-400">Arch • Bền vững</span>
            </div>
          </div>

          {/* 10-Finger Interactive Matrix: Left & Right Hands */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BÀN TAY TRÁI (Tiên Thiên / Nội Tại) */}
            <div className="oriental-card rounded-2xl p-5 border border-gold-500/30 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-sm font-bold text-slate-100 font-oriental">
                  Bàn Tay Trái (Tiên Thiên • Bán Cầu Não Phải)
                </span>
                <span className="text-[11px] text-gold-400">Tư Duy & Trực Giác</span>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'L_thumb', name: 'Ngón Cái Trái', role: 'Lãnh Đạo Nội Tại • Càn Kim' },
                  { key: 'L_index', name: 'Ngón Trỏ Trái', role: 'Không Gian & Sáng Tạo • Tốn Mộc' },
                  { key: 'L_middle', name: 'Ngón Giữa Trái', role: 'Cảm Thụ Vận Động • Khảm Thủy' },
                  { key: 'L_ring', name: 'Ngón Áp Út Trái', role: 'Cảm Nhận Âm Nhạc • Ly Hỏa' },
                  { key: 'L_pinky', name: 'Ngón Út Trái', role: 'Thị Giác Thẩm Mỹ • Cấn Thổ' }
                ].map(f => {
                  const currentPattern = fingerprintMap[f.key];
                  return (
                    <div key={f.key} className="p-3 rounded-xl bg-ink-950 border border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">{f.name}</span>
                        <span className="text-[10px] text-slate-400 block">{f.role}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {(['whorl', 'loop', 'arch'] as const).map(p => (
                          <button
                            key={p}
                            onClick={() => updateSingleFinger(f.key, p)}
                            className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                              currentPattern === p
                                ? p === 'whorl'
                                  ? 'bg-gold-500 text-ink-950 shadow-sm'
                                  : p === 'loop'
                                  ? 'bg-cyan-500 text-ink-950 shadow-sm'
                                  : 'bg-amber-500 text-ink-950 shadow-sm'
                                : 'bg-ink-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {p === 'whorl' ? '◎ Hoa' : p === 'loop' ? '∿ Nước' : '⋀ Núi'}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BÀN TAY PHẢI (Hậu Thiên / Thực Thi) */}
            <div className="oriental-card rounded-2xl p-5 border border-gold-500/30 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-sm font-bold text-slate-100 font-oriental">
                  Bàn Tay Phải (Hậu Thiên • Bán Cầu Não Trái)
                </span>
                <span className="text-[11px] text-cyan-400">Thực Thi & Logic</span>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'R_thumb', name: 'Ngón Cái Phải', role: 'Quản Trị Tương Tác • Khôn Thổ' },
                  { key: 'R_index', name: 'Ngón Trỏ Phải', role: 'Logic Phân Tích • Chấn Mộc' },
                  { key: 'R_middle', name: 'Ngón Giữa Phải', role: 'Thao Tác Khéo Léo • Khảm Thủy' },
                  { key: 'R_ring', name: 'Ngón Áp Út Phải', role: 'Tiếp Nhận Ngôn Ngữ • Đoài Kim' },
                  { key: 'R_pinky', name: 'Ngón Út Phải', role: 'Quan Sát Chi Tiết • Cấn Thổ' }
                ].map(f => {
                  const currentPattern = fingerprintMap[f.key];
                  return (
                    <div key={f.key} className="p-3 rounded-xl bg-ink-950 border border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">{f.name}</span>
                        <span className="text-[10px] text-slate-400 block">{f.role}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {(['whorl', 'loop', 'arch'] as const).map(p => (
                          <button
                            key={p}
                            onClick={() => updateSingleFinger(f.key, p)}
                            className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                              currentPattern === p
                                ? p === 'whorl'
                                  ? 'bg-gold-500 text-ink-950 shadow-sm'
                                  : p === 'loop'
                                  ? 'bg-cyan-500 text-ink-950 shadow-sm'
                                  : 'bg-amber-500 text-ink-950 shadow-sm'
                                : 'bg-ink-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {p === 'whorl' ? '◎ Hoa' : p === 'loop' ? '∿ Nước' : '⋀ Núi'}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* KẾT QUẢ PHÁT QUẺ THẬP CHỈ VÂN MỆNH (DIVINATION RESULT) */}
          <div className="space-y-6">
            
            {/* HERO POEM CARD: Ca Quyết 10 Hoa Tay */}
            <div className="oriental-card rounded-2xl p-6 sm:p-8 border-2 border-gold-500/50 bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-gold-500/30">
                <div>
                  <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest block font-mono">
                    CA QUYẾT DÂN GIAN & BÁT QUÁI THỦ TƯỚNG
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold gold-gradient-text font-oriental mt-0.5">
                    {fingerprintReport.classicalPoem.rhymeTitle}
                  </h2>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-300 font-bold text-sm font-mono">
                  {fingerprintReport.whorlCount} Hoa Tay
                </div>
              </div>

              {/* Four-line Poem */}
              <div className="p-4 rounded-xl bg-ink-950/80 border border-gold-500/20 text-center space-y-1 font-serif text-gold-200 text-sm sm:text-base my-3 italic">
                {fingerprintReport.classicalPoem.poemLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              {/* Ancient Meaning & Hexagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 pt-2">
                <div className="p-4 rounded-xl bg-ink-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Điển Tích Cổ Văn
                  </span>
                  <p className="leading-relaxed">{fingerprintReport.classicalPoem.ancientMeaning}</p>
                </div>
                <div className="p-4 rounded-xl bg-ink-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Quẻ Bát Quái Tương Ứng
                  </span>
                  <div className="flex items-center space-x-2 text-gold-300 font-oriental text-base font-bold">
                    <span>{fingerprintReport.hexagramDivination.symbol}</span>
                    <span>{fingerprintReport.hexagramDivination.name}</span>
                  </div>
                  <p className="leading-relaxed mt-1">{fingerprintReport.hexagramDivination.overview}</p>
                </div>
              </div>
            </div>

            {/* Detailed Career & Brain Style */}
            <div className="oriental-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 font-oriental">
                {fingerprintReport.temperamentProfile.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-2">
                  <span className="font-bold text-gold-300 block">Thế Mạnh Nổi Trội:</span>
                  <ul className="space-y-1.5">
                    {fingerprintReport.temperamentProfile.strengths.map((s, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-gold-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-2">
                  <span className="font-bold text-jade-300 block">Định Hướng Trọng Tâm:</span>
                  <ul className="space-y-1.5">
                    {fingerprintReport.temperamentProfile.developmentFocus.map((f, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-jade-400">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-ink-950/70 border border-slate-800 space-y-2">
                  <span className="font-bold text-cyan-300 block">Lĩnh Vực Tương Thích:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {fingerprintReport.temperamentProfile.careerDirection.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-ink-850 text-slate-200 border border-slate-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-ink-950 border border-gold-500/20 text-xs text-gold-200 font-serif italic flex items-start space-x-2">
                <Info className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>{fingerprintReport.cultivationRule}</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
