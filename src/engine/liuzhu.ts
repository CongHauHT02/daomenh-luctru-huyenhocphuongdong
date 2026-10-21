/**
 * ĐẠO MỆNH – LỤC TRỤ MỆNH LÝ ENGINE (SIX PILLARS CORE)
 * Nghiên cứu, cấu hình và tính toán Lục Trụ Mệnh Lý độc lập
 * Hỗ trợ 2 trường phái học thuật chính thống:
 * 1. Trường phái Cổ Điển: Tứ Trụ + Thai Nguyên + Mệnh Cung (Cổ thư Tam Mệnh Thông Hội)
 * 2. Trường phái Tân Phái: Tứ Trụ + Khắc Trụ (Phút) + Mệnh Cung (Lưu Quảng Bân)
 */

import {
  CanChi,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  NAP_AM_MAP
} from './calendar';
import { BaziChart, BaziPillar, getLifeStage, getTenGod, HIDDEN_STEMS_MAP, HiddenStem } from './bazi';

export type LiuZhuSchool = 'classical_thai_menh' | 'liu_guang_bin_khac_tru';

export interface LiuZhuPillar extends BaziPillar {
  domain: 'Tiên Thiên' | 'Hậu Thiên';
  historicalSource: string;
  significance: string;
}

export interface LiuZhuComparison {
  baziFourPillarsCount: number;
  liuzhuPillarsCount: number;
  timeResolution: string; // "120 phút (Bát Tự)" vs "15 phút / Phút sinh (Lục Trụ)"
  uniqueAdvantages: string[];
  systemDifferences: {
    factor: string;
    baziMethod: string;
    liuzhuMethod: string;
    impact: string;
  }[];
  philosophicalNote: string;
}

export interface LiuZhuChart {
  school: {
    code: LiuZhuSchool;
    name: string;
    authorOrSource: string;
    description: string;
  };
  pillars: {
    year: LiuZhuPillar;
    month: LiuZhuPillar;
    day: LiuZhuPillar;
    hour: LiuZhuPillar;
    fifthPillar: LiuZhuPillar; // Thai Nguyên hoặc Khắc Trụ
    sixthPillar: LiuZhuPillar; // Mệnh Cung
  };
  synthesis: {
    tienThienBalance: string;
    hauThienSupport: string;
    pillarRelationships: string[];
    specialCombinations: string[];
  };
  comparisonWithBazi: LiuZhuComparison;
}

/**
 * Tính Trụ Thai Nguyên (Cổ Thư Tam Mệnh Thông Hội)
 * Quy tắc: Can Thai Nguyên = Can Tháng + 1; Chi Thai Nguyên = Chi Tháng + 3
 */
export function calculateThaiNguyen(monthCan: string, monthChi: string): CanChi {
  const stemNames = HEAVENLY_STEMS.map(s => s.name);
  const branchNames = EARTHLY_BRANCHES.map(b => b.name);

  const mCanIdx = stemNames.indexOf(monthCan);
  const mChiIdx = branchNames.indexOf(monthChi);

  const thaiCanIdx = (mCanIdx + 1) % 10;
  const thaiChiIdx = (mChiIdx + 3) % 12;

  const stem = HEAVENLY_STEMS[thaiCanIdx];
  const branch = EARTHLY_BRANCHES[thaiChiIdx];

  return {
    can: stem.name,
    chi: branch.name,
    element: stem.element,
    yinYang: stem.yinYang,
    fullName: `${stem.name} ${branch.name}`
  };
}

/**
 * Tính Trụ Mệnh Cung (Cổ Pháp Đồ Bàn 12 Chi)
 * Quy tắc: Dần khởi tháng 1 đi thuận đến tháng sinh, từ đó khởi giờ Tý đi nghịch đến giờ sinh -> Chi Mệnh Cung.
 * Can Mệnh Cung: Độn theo Can Năm (Ngũ Hổ Độn Nguyệt)
 */
export function calculateMenhCung(yearCan: string, monthChi: string, hourChi: string): CanChi {
  const branchNames = EARTHLY_BRANCHES.map(b => b.name);

  // Vị trí Chi: Tý = 0, Sửu = 1, Dần = 2, ...
  const mIdx = branchNames.indexOf(monthChi);
  const hIdx = branchNames.indexOf(hourChi);

  // Thuật toán truyền thống trên bàn tay 12 cung:
  // Cung Mệnh = (14 - mIdx - hIdx + 24) % 12 (Quy chuẩn vị trí bắt đầu từ tháng giêng tại Dần)
  let menhChiIdx = (26 - mIdx - hIdx) % 12;
  const menhChi = EARTHLY_BRANCHES[menhChiIdx];

  // Khẩu quyết Ngũ Hổ Độn Nguyệt tính Can của Mệnh Cung theo Can Năm:
  const tigerStartStemMap: Record<string, number> = {
    'Giáp': 2, 'Kỷ': 2,
    'Ất': 4, 'Canh': 4,
    'Bính': 6, 'Tân': 6,
    'Đinh': 8, 'Nhâm': 8,
    'Mậu': 0, 'Quý': 0,
  };
  const startStem = tigerStartStemMap[yearCan] ?? 0;
  // Chi Dần là index 2, khoảng cách từ Dần đến Chi Mệnh Cung:
  const offsetFromDan = (menhChiIdx - 2 + 12) % 12;
  const menhCanIdx = (startStem + offsetFromDan) % 10;
  const menhCan = HEAVENLY_STEMS[menhCanIdx];

  return {
    can: menhCan.name,
    chi: menhChi.name,
    element: menhCan.element,
    yinYang: menhCan.yinYang,
    fullName: `${menhCan.name} ${menhChi.name}`
  };
}

/**
 * Tính Trụ Khắc / Phân Trụ (Lưu Quảng Bân - Khắc Trụ / Phút sinh)
 * Mỗi canh giờ (120 phút) chia làm 8 khắc (mỗi khắc 15 phút), gán theo 12 Chi và Can độn
 */
export function calculateKhacTru(hourCan: string, minute: number): CanChi {
  // Xác định khắc (0 - 7)
  const khacIndex = Math.min(7, Math.floor(minute / 15));
  
  // Chi của khắc bắt đầu từ Tý, Sửu...
  const branch = EARTHLY_BRANCHES[khacIndex % 12];

  // Can của khắc độn từ Can Giờ theo thuyết tương tự Ngũ Thử Độn:
  const stemNames = HEAVENLY_STEMS.map(s => s.name);
  const hourStemIdx = stemNames.indexOf(hourCan);
  const stemIndex = (hourStemIdx * 2 + khacIndex) % 10;
  const stem = HEAVENLY_STEMS[stemIndex];

  return {
    can: stem.name,
    chi: branch.name,
    element: stem.element,
    yinYang: stem.yinYang,
    fullName: `${stem.name} ${branch.name}`
  };
}

/**
 * HÀM TỔNG HỢP: LẬP LÁ SỐ LỤC TRỤ MỆNH LÝ
 */
export function generateLiuZhuChart(
  baziChart: BaziChart,
  school: LiuZhuSchool = 'classical_thai_menh',
  minute: number = 0
): LiuZhuChart {
  const dayMaster = baziChart.dayMaster.can;
  const yearCan = baziChart.pillars.year.canChi.can;
  const monthCan = baziChart.pillars.month.canChi.can;
  const monthChi = baziChart.pillars.month.canChi.chi;
  const hourCan = baziChart.pillars.hour.canChi.can;
  const hourChi = baziChart.pillars.hour.canChi.chi;

  // Tính Trụ 5 và Trụ 6
  let fifthCanChi: CanChi;
  let fifthTitle = '';
  let fifthDomain: 'Tiên Thiên' | 'Hậu Thiên' = 'Tiên Thiên';
  let fifthSource = '';
  let fifthSignificance = '';

  if (school === 'classical_thai_menh') {
    fifthCanChi = calculateThaiNguyen(monthCan, monthChi);
    fifthTitle = 'Trụ Thai Nguyên';
    fifthDomain = 'Tiên Thiên';
    fifthSource = '《Tam Mệnh Thông Hội》 quyển 3 - Luận Thai Nguyên';
    fifthSignificance = 'Biểu thị khí chất thụ thai ban đầu, gen di truyền, thể chất tiên thiên và phúc trạch thụ bẩm từ cha mẹ trước khi lọt lòng.';
  } else {
    fifthCanChi = calculateKhacTru(hourCan, minute);
    fifthTitle = 'Trụ Khắc (Phân Trụ)';
    fifthDomain = 'Hậu Thiên';
    fifthSource = '《Lục Trụ Dự Trắc Học》 – Thiềm Thiềm Cư Sĩ Lưu Quảng Bân';
    fifthSignificance = 'Tinh chỉnh đơn vị thời gian từ canh giờ (120 phút) xuống đơn vị khắc (15 phút), phá bỏ sự đồng nhất của những người sinh cùng giờ.';
  }

  const sixthCanChi = calculateMenhCung(yearCan, monthChi, hourChi);
  const sixthTitle = 'Trụ Mệnh Cung';
  const sixthDomain: 'Tiên Thiên' | 'Hậu Thiên' = 'Hậu Thiên';
  const sixthSource = '《Uyên Hải Tử Bình》 & 《Tam Mệnh Thông Hội》 – Luận Mệnh Cung Thần Sát';
  const sixthSignificance = 'Nơi quy túc của bản mệnh, đại diện cho chí hướng, tính cách ẩn sâu, gia thế và đích đến của sự nghiệp.';

  const buildLiuZhuPillar = (
    basePillar: BaziPillar,
    domain: 'Tiên Thiên' | 'Hậu Thiên',
    source: string,
    significance: string
  ): LiuZhuPillar => {
    return {
      ...basePillar,
      domain,
      historicalSource: source,
      significance
    };
  };

  const buildExtraPillar = (
    title: string,
    cc: CanChi,
    domain: 'Tiên Thiên' | 'Hậu Thiên',
    source: string,
    significance: string
  ): LiuZhuPillar => {
    const rawHidden = HIDDEN_STEMS_MAP[cc.chi] || [];
    const hiddenStems: HiddenStem[] = rawHidden.map(h => {
      const stemObj = HEAVENLY_STEMS.find(s => s.name === h.stem)!;
      return {
        stem: h.stem,
        type: h.type,
        element: stemObj.element,
        percentage: h.pct,
        tenGod: getTenGod(dayMaster, h.stem)
      };
    });

    return {
      title,
      canChi: cc,
      napAm: NAP_AM_MAP[cc.fullName] || '',
      hiddenStems,
      tenGodStem: getTenGod(dayMaster, cc.can),
      lifeStage: getLifeStage(dayMaster, cc.chi),
      domain,
      historicalSource: source,
      significance
    };
  };

  const pYear = buildLiuZhuPillar(
    baziChart.pillars.year,
    'Tiên Thiên',
    '《Tử Bình Chân Thuyên》 – Trụ Tổ Tiên',
    'Chủ về cội rễ, âm đức tổ đường và vận thế thời niên thiếu (1 - 16 tuổi).'
  );
  const pMonth = buildLiuZhuPillar(
    baziChart.pillars.month,
    'Tiên Thiên',
    '《Cùng Thông Bảo Giám》 – Trụ Lệnh Tháng',
    'Tiếp nhận khí trời đất vượng tướng hưu tù, chủ về cha mẹ, học hành và thời thanh niên (17 - 32 tuổi).'
  );
  const pDay = buildLiuZhuPillar(
    baziChart.pillars.day,
    'Hậu Thiên',
    '《Đích Thiên Tủy》 – Trụ Nhật Chủ & Phối Ngẫu',
    'Chủ về bản thân, nội tâm và người bạn đời hôn nhân (33 - 48 tuổi).'
  );
  const pHour = buildLiuZhuPillar(
    baziChart.pillars.hour,
    'Hậu Thiên',
    '《Uyên Hải Tử Bình》 – Trụ Thời Quy Túc',
    'Chủ về con cái, cấp dưới, thành tựu cuối đời và hậu vận (49 tuổi trở đi).'
  );

  const pFifth = buildExtraPillar(fifthTitle, fifthCanChi, fifthDomain, fifthSource, fifthSignificance);
  const pSixth = buildExtraPillar(sixthTitle, sixthCanChi, sixthDomain, sixthSource, sixthSignificance);

  const schoolInfo = school === 'classical_thai_menh'
    ? {
        code: school,
        name: 'Trường Phái Cổ Điển: Thai Nguyên & Mệnh Cung',
        authorOrSource: 'Kế thừa từ 《Tam Mệnh Thông Hội》 & 《Uyên Hải Tử Bình》',
        description: 'Bổ sung hai trụ trọng yếu: Thai Nguyên (gốc rễ thụ thai tiên thiên) và Mệnh Cung (nơi nương tựa linh hồn hậu thiên) giúp xem xét vẹn toàn thể trạng và chí hướng.'
      }
    : {
        code: school,
        name: 'Trường Phái Tân Phái: Khắc Trụ & Mệnh Cung',
        authorOrSource: 'Thiềm Thiềm Cư Sĩ Lưu Quảng Bân (《Lục Trụ Dự Trắc Học》)',
        description: 'Phân tách canh giờ 120 phút thành các khắc 15 phút, hình thành Khắc Trụ kết hợp với Mệnh Cung để giải quyết triệt để vấn đề nhiều người sinh cùng giờ có số phận dị biệt.'
      };

  const comparisonWithBazi: LiuZhuComparison = {
    baziFourPillarsCount: 8,
    liuzhuPillarsCount: 12,
    timeResolution: school === 'classical_thai_menh' ? '120 phút (Cộng hưởng Tiên thiên Thụ thai)' : '15 phút (Đơn vị Khắc sinh)',
    uniqueAdvantages: [
      'Gia tăng số lượng can chi từ 8 lên 12 chữ, tăng lượng thông tin phản ánh tương quan ngũ hành.',
      'Soi chiếu cả 2 chiều Tiên Thiên (nguồn cội thụ khí) và Hậu Thiên (thành tựu xã hội).',
      'Cung cấp góc nhìn bổ khuyết trong các trường hợp lá số Bát Tự rơi vào thế nghi ngờ vượng suy hoặc lưỡng nan.'
    ],
    systemDifferences: [
      {
        factor: 'Số lượng trụ và chữ',
        baziMethod: '4 Trụ (Năm, Tháng, Ngày, Giờ) = 8 Can Chi',
        liuzhuMethod: '6 Trụ (Tứ Trụ + Thai Nguyên/Khắc Trụ + Mệnh Cung) = 12 Can Chi',
        impact: 'Mở rộng đồ bàn ngũ hành, phát hiện thêm các lực sinh trợ hoặc khắc phạt ẩn tàng.'
      },
      {
        factor: 'Độ mịn của thời gian sinh',
        baziMethod: '1 Canh giờ = 120 phút',
        liuzhuMethod: school === 'classical_thai_menh' ? '120 phút + Thời gian thụ thai' : 'Khắc sinh = 15 phút',
        impact: 'Giảm thiểu sự trùng lặp lá số của những người sinh cùng giờ.'
      },
      {
        factor: 'Tính chính thống cổ thư',
        baziMethod: 'Được ghi nhận toàn diện trong tứ đại kinh điển Tử Bình',
        liuzhuMethod: 'Thai/Mệnh ghi trong Tam Mệnh; Khắc Trụ là nghiên cứu cận đại của Lưu Quảng Bân',
        impact: 'Cần phân biệt rõ trường phái để người nghiên cứu thẩm định khách quan, không ngộ nhận.'
      }
    ],
    philosophicalNote: 'Lục Trụ Mệnh Lý không phủ nhận Bát Tự Tứ Trụ mà là sự đào sâu chi tiết hóa. Bát Tự là khung xương gốc, Lục Trụ là bức tranh phân giải cao hơn của cùng một thực tại thời gian.'
  };

  return {
    school: schoolInfo,
    pillars: {
      year: pYear,
      month: pMonth,
      day: pDay,
      hour: pHour,
      fifthPillar: pFifth,
      sixthPillar: pSixth
    },
    synthesis: {
      tienThienBalance: `Thai Nguyên (${pFifth.canChi.fullName}) nạp âm ${pFifth.napAm}, tương tác mật thiết với Trụ Tháng và Trụ Năm, thể hiện nền tảng thể chất vững chãi.`,
      hauThienSupport: `Mệnh Cung (${pSixth.canChi.fullName}) nạp âm ${pSixth.napAm}, phối hợp với Trụ Ngày và Trụ Giờ tạo thế nâng đỡ chí hướng hậu vận.`,
      pillarRelationships: [
        `Trụ 5 (${pFifth.title}) tương phối ngũ hành ${pFifth.canChi.element}`,
        `Trụ 6 (${pSixth.title}) tọa chi ${pSixth.canChi.chi} mang thuộc tính ${pSixth.canChi.element}`
      ],
      specialCombinations: [
        'Tam Kỳ tương hội nếu Thiên Can các trụ xuất hiện Giáp-Mậu-Canh hoặc Ất-Bính-Đinh.',
        'Mệnh Cung tương hòa với Nhật Chủ tạo phong thái điềm đạm, vững chí khi đối diện nghịch cảnh.'
      ]
    },
    comparisonWithBazi
  };
}
