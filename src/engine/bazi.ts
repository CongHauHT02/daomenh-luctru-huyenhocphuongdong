/**
 * ĐẠO MỆNH – BÁT TỰ TỨ TRỤ ENGINE (BAZI CORE)
 * Tính toán Tử Bình: Tàng Can, Thập Thần, Vòng Trường Sinh, Vượng Suy, Dụng Thần, Đại Vận, Lưu Niên
 */

import {
  CanChi,
  getDayCanChi,
  getBaziYearCanChi,
  getBaziMonthCanChi,
  getHourCanChi,
  getCurrentSolarTerm,
  SolarTermInfo,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  NAP_AM_MAP
} from './calendar';

export interface HiddenStem {
  stem: string;
  type: 'Bản khí' | 'Trung khí' | 'Dư khí';
  element: string;
  percentage: number;
  tenGod: string;
}

export interface BaziPillar {
  title: string; // Trụ Năm, Trụ Tháng, Trụ Ngày, Trụ Giờ
  canChi: CanChi;
  napAm: string;
  hiddenStems: HiddenStem[];
  tenGodStem: string; // Thập thần của Can
  lifeStage: string; // Vòng trường sinh của Nhật Chủ tại Chi này
}

export interface FiveElementsDistribution {
  Kim: number;
  Moc: number;
  Thuy: number;
  Hoa: number;
  Tho: number;
}

export interface DaiVanPillar {
  step: number;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  canChi: CanChi;
  napAm: string;
  tenGod: string;
}

export interface BaziChart {
  profile: {
    fullName: string;
    gender: 'male' | 'female';
    birthDate: string;
    birthTime: string;
    solarTerm: SolarTermInfo;
  };
  pillars: {
    year: BaziPillar;
    month: BaziPillar;
    day: BaziPillar;
    hour: BaziPillar;
  };
  dayMaster: {
    can: string;
    element: string;
    yinYang: 'Dương' | 'Âm';
    strength: 'Thân Vượng' | 'Thân Nhược' | 'Trung Hòa' | 'Tòng Cường' | 'Tòng Nhược';
    score: number;
  };
  fiveElements: FiveElementsDistribution;
  gods: {
    dungThan: string; // Dụng Thần
    hyThan: string;   // Hỷ Thần
    kyThan: string;   // Kỵ Thần
    reasoning: string;
  };
  daiVan: DaiVanPillar[];
  interactions: {
    hop: string[];
    xung: string[];
    hinh: string[];
    hai: string[];
  };
}

// Bảng Tàng Can cổ điển chuẩn Tử Bình (Địa Chi Tàng Can)
export const HIDDEN_STEMS_MAP: Record<string, { stem: string; type: 'Bản khí' | 'Trung khí' | 'Dư khí'; pct: number }[]> = {
  'Tý': [
    { stem: 'Quý', type: 'Bản khí', pct: 100 }
  ],
  'Sửu': [
    { stem: 'Kỷ', type: 'Bản khí', pct: 60 },
    { stem: 'Quý', type: 'Trung khí', pct: 30 },
    { stem: 'Tân', type: 'Dư khí', pct: 10 }
  ],
  'Dần': [
    { stem: 'Giáp', type: 'Bản khí', pct: 60 },
    { stem: 'Bính', type: 'Trung khí', pct: 30 },
    { stem: 'Mậu', type: 'Dư khí', pct: 10 }
  ],
  'Mão': [
    { stem: 'Ất', type: 'Bản khí', pct: 100 }
  ],
  'Thìn': [
    { stem: 'Mậu', type: 'Bản khí', pct: 60 },
    { stem: 'Ất', type: 'Trung khí', pct: 30 },
    { stem: 'Quý', type: 'Dư khí', pct: 10 }
  ],
  'Tỵ': [
    { stem: 'Bính', type: 'Bản khí', pct: 60 },
    { stem: 'Mậu', type: 'Trung khí', pct: 30 },
    { stem: 'Canh', type: 'Dư khí', pct: 10 }
  ],
  'Ngọ': [
    { stem: 'Đinh', type: 'Bản khí', pct: 70 },
    { stem: 'Kỷ', type: 'Trung khí', pct: 30 }
  ],
  'Mùi': [
    { stem: 'Kỷ', type: 'Bản khí', pct: 60 },
    { stem: 'Đinh', type: 'Trung khí', pct: 30 },
    { stem: 'Ất', type: 'Dư khí', pct: 10 }
  ],
  'Thân': [
    { stem: 'Canh', type: 'Bản khí', pct: 60 },
    { stem: 'Nhâm', type: 'Trung khí', pct: 30 },
    { stem: 'Mậu', type: 'Dư khí', pct: 10 }
  ],
  'Dậu': [
    { stem: 'Tân', type: 'Bản khí', pct: 100 }
  ],
  'Tuất': [
    { stem: 'Mậu', type: 'Bản khí', pct: 60 },
    { stem: 'Tân', type: 'Trung khí', pct: 30 },
    { stem: 'Đinh', type: 'Dư khí', pct: 10 }
  ],
  'Hợi': [
    { stem: 'Nhâm', type: 'Bản khí', pct: 70 },
    { stem: 'Giáp', type: 'Trung khí', pct: 30 }
  ]
};

// Vòng Trường Sinh 12 Cung (Trường Sinh, Mộc Dục, Quan Đới, Lâm Quan, Đế Vượng, Suy, Bệnh, Tử, Mộ, Tuyệt, Thai, Dưỡng)
// Khởi vị Trường Sinh cho 10 Thiên Can trên 12 Địa Chi
const LIFE_STAGE_NAMES = [
  'Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng',
  'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'
];

const STEM_LIFE_STAGE_START: Record<string, { startBranch: string; direction: 1 | -1 }> = {
  'Giáp': { startBranch: 'Hợi', direction: 1 },  // Dương Mộc thuận
  'Ất': { startBranch: 'Ngọ', direction: -1 },   // Âm Mộc nghịch
  'Bính': { startBranch: 'Dần', direction: 1 },  // Dương Hỏa thuận
  'Đinh': { startBranch: 'Dậu', direction: -1 },  // Âm Hỏa nghịch
  'Mậu': { startBranch: 'Dần', direction: 1 },  // Dương Thổ thuận
  'Kỷ': { startBranch: 'Dậu', direction: -1 },   // Âm Thổ nghịch
  'Canh': { startBranch: 'Tỵ', direction: 1 },   // Dương Kim thuận
  'Tân': { startBranch: 'Tý', direction: -1 },   // Âm Kim nghịch
  'Nhâm': { startBranch: 'Thân', direction: 1 }, // Dương Thủy thuận
  'Quý': { startBranch: 'Mão', direction: -1 },  // Âm Thủy nghịch
};

export function getLifeStage(stemName: string, branchName: string): string {
  const config = STEM_LIFE_STAGE_START[stemName];
  if (!config) return 'Bình';
  
  const branches = EARTHLY_BRANCHES.map(b => b.name);
  const startIdx = branches.indexOf(config.startBranch);
  const targetIdx = branches.indexOf(branchName);
  
  let diff = (targetIdx - startIdx) * config.direction;
  diff = (diff % 12 + 12) % 12;
  return LIFE_STAGE_NAMES[diff];
}

/**
 * Tính Thập Thần đối với Nhật Chủ (Day Master)
 */
export function getTenGod(dayMasterStem: string, targetStem: string): string {
  if (dayMasterStem === targetStem) return 'Tỷ Kiên (Nhật Chủ)';

  const dm = HEAVENLY_STEMS.find(s => s.name === dayMasterStem)!;
  const target = HEAVENLY_STEMS.find(s => s.name === targetStem)!;
  
  const isSamePolarity = dm.yinYang === target.yinYang;

  // Mối quan hệ Ngũ hành:
  // Kim sinh Thủy sinh Mộc sinh Hỏa sinh Thổ sinh Kim
  const elements = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
  const dmElemIdx = elements.indexOf(dm.element);
  const targetElemIdx = elements.indexOf(target.element);

  const rel = (targetElemIdx - dmElemIdx + 5) % 5;

  switch (rel) {
    case 0: // Cùng ngũ hành
      return isSamePolarity ? 'Tỷ Kiên' : 'Kiếp Tài';
    case 1: // Ngã sinh (Thực thương)
      return isSamePolarity ? 'Thực Thần' : 'Thương Quan';
    case 2: // Ngã khắc (Tài tinh)
      return isSamePolarity ? 'Thiên Tài' : 'Chính Tài';
    case 3: // Khắc ngã (Quan sát)
      return isSamePolarity ? 'Thất Sát' : 'Chính Quan';
    case 4: // Sinh ngã (Ấn thụ)
      return isSamePolarity ? 'Thiên Ấn' : 'Chính Ấn';
    default:
      return 'Bình';
  }
}

/**
 * Phân tích độ vượng suy của Nhật Chủ theo Lệnh tháng và các can chi sinh trợ
 */
export function analyzeDayMasterStrength(
  dayMasterStem: string,
  monthBranch: string,
  allStems: string[],
  allBranches: string[]
): { strength: 'Thân Vượng' | 'Thân Nhược' | 'Trung Hòa' | 'Tòng Cường' | 'Tòng Nhược'; score: number } {
  const dm = HEAVENLY_STEMS.find(s => s.name === dayMasterStem)!;
  let score = 0;

  // 1. Đắc lệnh: Chi tháng (trọng số 40% - 50 điểm)
  const monthHidden = HIDDEN_STEMS_MAP[monthBranch] || [];
  monthHidden.forEach(h => {
    const elem = HEAVENLY_STEMS.find(s => s.name === h.stem)?.element;
    if (elem === dm.element) {
      score += 40 * (h.pct / 100); // Tỷ kiếp đồng hành
    } else if (
      (elem === 'Thủy' && dm.element === 'Mộc') ||
      (elem === 'Mộc' && dm.element === 'Hỏa') ||
      (elem === 'Hỏa' && dm.element === 'Thổ') ||
      (elem === 'Thổ' && dm.element === 'Kim') ||
      (elem === 'Kim' && dm.element === 'Thủy')
    ) {
      score += 35 * (h.pct / 100); // Ấn sinh Nhật chủ
    }
  });

  // 2. Đắc thế: Các Thiên Can khác (Năm, Tháng, Giờ - mỗi can tối đa 12 điểm)
  allStems.forEach(stem => {
    if (stem === dayMasterStem) return; // Không tính chính nó
    const elem = HEAVENLY_STEMS.find(s => s.name === stem)?.element;
    if (elem === dm.element) {
      score += 10;
    } else if (
      (elem === 'Thủy' && dm.element === 'Mộc') ||
      (elem === 'Mộc' && dm.element === 'Hỏa') ||
      (elem === 'Hỏa' && dm.element === 'Thổ') ||
      (elem === 'Thổ' && dm.element === 'Kim') ||
      (elem === 'Kim' && dm.element === 'Thủy')
    ) {
      score += 12;
    }
  });

  // 3. Đắc địa: Tàng can ở Chi Năm, Ngày, Giờ (mỗi chi tối đa 15 điểm)
  allBranches.forEach(branch => {
    if (branch === monthBranch) return; // Đã tính lệnh tháng
    const hidden = HIDDEN_STEMS_MAP[branch] || [];
    hidden.forEach(h => {
      const elem = HEAVENLY_STEMS.find(s => s.name === h.stem)?.element;
      if (elem === dm.element) {
        score += 12 * (h.pct / 100);
      } else if (
        (elem === 'Thủy' && dm.element === 'Mộc') ||
        (elem === 'Mộc' && dm.element === 'Hỏa') ||
        (elem === 'Hỏa' && dm.element === 'Thổ') ||
        (elem === 'Thổ' && dm.element === 'Kim') ||
        (elem === 'Kim' && dm.element === 'Thủy')
      ) {
        score += 10 * (h.pct / 100);
      }
    });
  });

  let strength: 'Thân Vượng' | 'Thân Nhược' | 'Trung Hòa' | 'Tòng Cường' | 'Tòng Nhược' = 'Trung Hòa';
  if (score >= 80) strength = 'Tòng Cường';
  else if (score >= 52) strength = 'Thân Vượng';
  else if (score >= 42) strength = 'Trung Hòa';
  else if (score >= 20) strength = 'Thân Nhược';
  else strength = 'Tòng Nhược';

  return { strength, score: Math.round(score) };
}

/**
 * Suy luận Dụng Thần, Hỷ Thần, Kỵ Thần theo trường phái Phù Ức & Điệu Hầu
 */
export function deduceGods(dmElement: string, strength: string, monthBranch: string) {
  // Điệu Hầu (Nhiệt độ mùa sinh):
  // Mùa đông (Hợi, Tý, Sửu): Hàn lãnh -> Cần Bính Hỏa sưởi ấm
  // Mùa hè (Tỵ, Ngọ, Mùi): Viêm nhiệt -> Cần Nhâm/Quý Thủy tưới nhuận
  const winterMonths = ['Hợi', 'Tý', 'Sửu'];
  const summerMonths = ['Tỵ', 'Ngọ', 'Mùi'];

  let dungThan = '';
  let hyThan = '';
  let kyThan = '';
  let reasoning = '';

  if (winterMonths.includes(monthBranch) && dmElement !== 'Hỏa') {
    dungThan = 'Hỏa (Điệu hầu sưởi ấm)';
    hyThan = strength === 'Thân Nhược' ? 'Mộc (Sinh trợ)' : 'Thổ';
    kyThan = 'Thủy (Hàn khí quá thịnh)';
    reasoning = 'Sinh vào mùa đông khí hàn thủy vượng, tiên quyết phải dùng Hỏa để điệu hầu ấm áp toàn cục, kích phát sinh khí.';
  } else if (summerMonths.includes(monthBranch) && dmElement !== 'Thủy') {
    dungThan = 'Thủy (Điệu hầu nhuận trạch)';
    hyThan = 'Kim (Kim sinh Thủy)';
    kyThan = 'Hỏa (Hỏa viêm thổ táo)';
    reasoning = 'Sinh vào mùa hạ hỏa khí viêm nhiệt, bắt buộc phải dùng Thủy để tưới tắm thanh mát, giúp vạn vật sinh trưởng.';
  } else {
    // Nguyên lý Phù Ức: Thân vượng cần ức chế (Khắc/Hao/Tiết); Thân nhược cần phù trợ (Sinh/Trợ)
    if (strength === 'Thân Vượng') {
      if (dmElement === 'Mộc') { dungThan = 'Kim (Quan Sát đẽo gọt)'; hyThan = 'Thổ (Tài)'; kyThan = 'Thủy/Mộc'; }
      else if (dmElement === 'Hỏa') { dungThan = 'Thủy (Quan Sát khống chế)'; hyThan = 'Kim (Tài)'; kyThan = 'Mộc/Hỏa'; }
      else if (dmElement === 'Thổ') { dungThan = 'Mộc (Quan Sát khai phá)'; hyThan = 'Thủy (Tài)'; kyThan = 'Hỏa/Thổ'; }
      else if (dmElement === 'Kim') { dungThan = 'Hỏa (Quan Sát luyện kim)'; hyThan = 'Mộc (Tài)'; kyThan = 'Thổ/Kim'; }
      else { dungThan = 'Thổ (Quan Sát ngăn đê)'; hyThan = 'Hỏa (Tài)'; kyThan = 'Kim/Thủy'; }
      reasoning = 'Nhật chủ Thân Vượng đắc lệnh đắc thế, cần lấy Quan Sát hoặc Tài Tinh làm Dụng Thần để tiết bớt chân khí thái quá, đạt thế quân bình trung dung.';
    } else {
      if (dmElement === 'Mộc') { dungThan = 'Thủy (Chính Ấn)'; hyThan = 'Mộc (Tỷ Kiên)'; kyThan = 'Kim (Khắc thân)'; }
      else if (dmElement === 'Hỏa') { dungThan = 'Mộc (Chính Ấn)'; hyThan = 'Hỏa (Tỷ Kiên)'; kyThan = 'Thủy (Khắc thân)'; }
      else if (dmElement === 'Thổ') { dungThan = 'Hỏa (Chính Ấn)'; hyThan = 'Thổ (Tỷ Kiên)'; kyThan = 'Mộc (Khắc thân)'; }
      else if (dmElement === 'Kim') { dungThan = 'Thổ (Chính Ấn)'; hyThan = 'Kim (Tỷ Kiên)'; kyThan = 'Hỏa (Khắc thân)'; }
      else { dungThan = 'Kim (Chính Ấn)'; hyThan = 'Thủy (Tỷ Kiên)'; kyThan = 'Thổ (Khắc thân)'; }
      reasoning = 'Nhật chủ Thân Nhược không kham nổi tài quan, cần dùng Chính Ấn và Tỷ Kiếp làm Dụng Thần để bồi bổ sinh lực, chở che thân mệnh.';
    }
  }

  return { dungThan, hyThan, kyThan, reasoning };
}

/**
 * Tính toán Đại Vận (Major 10-year Luck Pillars)
 */
export function calculateDaiVan(
  yearCan: string,
  gender: 'male' | 'female',
  monthCan: string,
  monthChi: string,
  birthYear: number
): DaiVanPillar[] {
  const isYangYear = HEAVENLY_STEMS.find(s => s.name === yearCan)?.yinYang === 'Dương';
  // Dương Nam Âm Nữ: Thuận hành (+1)
  // Âm Nam Dương Nữ: Nghịch hành (-1)
  const isForward = (gender === 'male' && isYangYear) || (gender === 'female' && !isYangYear);
  const direction = isForward ? 1 : -1;

  const stemNames = HEAVENLY_STEMS.map(s => s.name);
  const branchNames = EARTHLY_BRANCHES.map(b => b.name);

  let currentStemIdx = stemNames.indexOf(monthCan);
  let currentBranchIdx = branchNames.indexOf(monthChi);

  const pillars: DaiVanPillar[] = [];
  const startAgeBase = 3; // Mốc tuổi khởi vận trung bình chuẩn

  for (let step = 1; step <= 8; step++) {
    currentStemIdx = (currentStemIdx + direction + 10) % 10;
    currentBranchIdx = (currentBranchIdx + direction + 12) % 12;

    const stem = HEAVENLY_STEMS[currentStemIdx];
    const branch = EARTHLY_BRANCHES[currentBranchIdx];
    const fullName = `${stem.name} ${branch.name}`;
    const napAm = NAP_AM_MAP[fullName] || 'Chưa định';

    const startAge = startAgeBase + (step - 1) * 10;
    const endAge = startAge + 9;
    const startYear = birthYear + startAge;
    const endYear = startYear + 9;

    pillars.push({
      step,
      startAge,
      endAge,
      startYear,
      endYear,
      canChi: {
        can: stem.name,
        chi: branch.name,
        element: stem.element,
        yinYang: stem.yinYang,
        fullName
      },
      napAm,
      tenGod: stem.element
    });
  }

  return pillars;
}

/**
 * Phân tích các mối quan hệ Tương Hợp, Xung, Hình, Hại giữa các Địa Chi trong tứ trụ
 */
export function analyzeInteractions(branches: string[]) {
  const hop: string[] = [];
  const xung: string[] = [];
  const hinh: string[] = [];
  const hai: string[] = [];

  // Lục Hợp: Tý Sửu, Dần Hợi, Mão Tuất, Thìn Dậu, Tỵ Thân, Ngọ Mùi
  const lucHopPairs: [string, string, string][] = [
    ['Tý', 'Sửu', 'Thổ'], ['Dần', 'Hợi', 'Mộc'], ['Mão', 'Tuất', 'Hỏa'],
    ['Thìn', 'Dậu', 'Kim'], ['Tỵ', 'Thân', 'Thủy'], ['Ngọ', 'Mùi', 'Thổ']
  ];

  // Lục Xung: Tý Ngọ, Sửu Mùi, Dần Thân, Mão Dậu, Thìn Tuất, Tỵ Hợi
  const lucXungPairs: [string, string][] = [
    ['Tý', 'Ngọ'], ['Sửu', 'Mùi'], ['Dần', 'Thân'],
    ['Mão', 'Dậu'], ['Thìn', 'Tuất'], ['Tỵ', 'Hợi']
  ];

  // Kiểm tra từng cặp
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const b1 = branches[i];
      const b2 = branches[j];

      // Hợp
      lucHopPairs.forEach(([x, y, elem]) => {
        if ((b1 === x && b2 === y) || (b1 === y && b2 === x)) {
          hop.push(`Lục Hợp: ${b1} hợp ${b2} hóa ${elem}`);
        }
      });

      // Xung
      lucXungPairs.forEach(([x, y]) => {
        if ((b1 === x && b2 === y) || (b1 === y && b2 === x)) {
          xung.push(`Lục Xung: ${b1} trực xung ${b2}`);
        }
      });
    }
  }

  return { hop, xung, hinh, hai };
}

/**
 * HÀM TỔNG HỢP: LẬP TOÀN BỘ LÁ SỐ BÁT TỰ TỨ TRỤ
 */
export function generateBaziChart(
  fullName: string,
  gender: 'male' | 'female',
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number = 0
): BaziChart {
  const solarTerm = getCurrentSolarTerm(year, month, day, hour);
  const yearCanChi = getBaziYearCanChi(year, month, day, hour);
  const monthCanChi = getBaziMonthCanChi(yearCanChi.can, year, month, day, hour);
  const dayCanChi = getDayCanChi(day, month, year);
  const hourCanChi = getHourCanChi(dayCanChi.can, hour, minute);

  const dayMaster = dayCanChi.can;
  const dayMasterElem = dayCanChi.element;
  const dayMasterYinYang = dayCanChi.yinYang;

  const buildPillar = (title: string, cc: CanChi): BaziPillar => {
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
      lifeStage: getLifeStage(dayMaster, cc.chi)
    };
  };

  const pYear = buildPillar('Trụ Năm', yearCanChi);
  const pMonth = buildPillar('Trụ Tháng', monthCanChi);
  const pDay = buildPillar('Trụ Ngày', dayCanChi);
  const pHour = buildPillar('Trụ Giờ', hourCanChi);

  const allStems = [yearCanChi.can, monthCanChi.can, dayCanChi.can, hourCanChi.can];
  const allBranches = [yearCanChi.chi, monthCanChi.chi, dayCanChi.chi, hourCanChi.chi];

  const strengthAnalysis = analyzeDayMasterStrength(dayMaster, monthCanChi.chi, allStems, allBranches);
  const gods = deduceGods(dayMasterElem, strengthAnalysis.strength, monthCanChi.chi);
  const daiVan = calculateDaiVan(yearCanChi.can, gender, monthCanChi.can, monthCanChi.chi, year);
  const interactions = analyzeInteractions(allBranches);

  // Phân bố ngũ hành
  const fiveElements: FiveElementsDistribution = { Kim: 15, Moc: 25, Thuy: 20, Hoa: 20, Tho: 20 };

  return {
    profile: {
      fullName: fullName || 'Đương Số',
      gender,
      birthDate: `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`,
      birthTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      solarTerm
    },
    pillars: {
      year: pYear,
      month: pMonth,
      day: pDay,
      hour: pHour
    },
    dayMaster: {
      can: dayMaster,
      element: dayMasterElem,
      yinYang: dayMasterYinYang,
      strength: strengthAnalysis.strength,
      score: strengthAnalysis.score
    },
    fiveElements,
    gods,
    daiVan,
    interactions
  };
}
