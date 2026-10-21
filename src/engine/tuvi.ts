/**
 * ĐẠO MỆNH – TỬ VI ĐẨU SỐ ENGINE (ZI WEI DOU SHU CORE)
 * Hệ thống An sao 12 Cung, 14 Chính Tinh, Tứ Hóa, Tam Phương Tứ Chính, Cục số,
 * Lục Cát Tinh, Lục Sát Tinh, Vòng Bác Sĩ, Vòng Thái Tuế, Vòng Tràng Sinh, Tuần/Triệt.
 * Tuyệt đối tuân thủ quy tắc cổ thư Tử Vi Đẩu Số Toàn Thư.
 */

import {
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  NAP_AM_MAP,
  convertSolarToLunar
} from './calendar';

export interface TuViStar {
  name: string;
  type: 'chinh_tinh' | 'tu_hoa' | 'sat_tinh' | 'cat_tinh';
  element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
  brightness?: 'Miếu' | 'Vượng' | 'Đắc' | 'Hãm' | 'Bình';
  meaning: string;
}

export interface TuViPalace {
  index: number; // 0 - 11 (0: Tý, 1: Sửu, 2: Dần... 11: Hợi)
  branch: string; // Tý, Sửu, Dần...
  can: string; // Can của cung (theo Ngũ Hổ Độn)
  name: string; // Cung Mệnh, Phụ Mẫu, Phúc Đức...
  isMenh: boolean;
  isThan: boolean;
  cucName: string;
  majorPeriod: { startAge: number; endAge: number };
  mainStars: TuViStar[];
  assistantStars: TuViStar[];
  badStars: TuViStar[];
  tuHoaStars: TuViStar[];
  thaiTueStar?: string;
  bacSiStar?: string;
  trangSinhStar?: string;
  trietTuan: string[]; // ['Tuần', 'Triệt']
}

export interface TuViChart {
  profile: {
    fullName: string;
    gender: 'male' | 'female';
    birthSolar: string;
    birthLunar: string;
    birthHourCanChi: string;
    yinYangNamNu: string; // Âm Nam / Dương Nam / Âm Nữ / Dương Nữ
    menhCucTuongSinh: string;
  };
  cuc: {
    name: string;
    number: number; // 2: Thủy, 3: Mộc, 4: Kim, 5: Thổ, 6: Hỏa
    element: string;
  };
  menhPalaceBranch: string;
  thanPalaceBranch: string;
  palaces: TuViPalace[]; // Đúng 12 cung
  tamPhuongTuChinhMenh: {
    menh: string;
    taiBach: string;
    quanLoc: string;
    thienDi: string;
  };
}

const PALACE_NAMES = [
  'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch',
  'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách',
  'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'
];

/**
 * Định Vị Cung Mệnh và Cung Thân theo Tháng Âm và Giờ sinh
 */
export function getMenhThanPositions(lunarMonth: number, hourBranchIndex: number): { menhIndex: number; thanIndex: number } {
  // Dần là index 2 trong EARTHLY_BRANCHES (0: Tý, 1: Sửu, 2: Dần...)
  // Khởi tháng 1 tại Dần đi thuận đến tháng sinh:
  const monthPos = (2 + (lunarMonth - 1)) % 12;

  // Từ tháng sinh, khởi giờ Tý đi nghịch đến giờ sinh -> Cung Mệnh
  const menhIndex = (monthPos - hourBranchIndex + 12) % 12;

  // Từ tháng sinh, khởi giờ Tý đi thuận đến giờ sinh -> Cung Thân
  const thanIndex = (monthPos + hourBranchIndex) % 12;

  return { menhIndex, thanIndex };
}

/**
 * Xác định Cục (Thủy Nhị Cục = 2, Mộc Tam Cục = 3, Kim Tứ Cục = 4, Thổ Ngũ Cục = 5, Hỏa Lục Cục = 6)
 */
export function calculateCuc(yearCan: string, menhBranch: string): { name: string; number: number; element: string } {
  const tigerStartStemMap: Record<string, number> = {
    'Giáp': 2, 'Kỷ': 2,
    'Ất': 4, 'Canh': 4,
    'Bính': 6, 'Tân': 6,
    'Đinh': 8, 'Nhâm': 8,
    'Mậu': 0, 'Quý': 0,
  };
  const startStem = tigerStartStemMap[yearCan] ?? 0;
  const branchIdx = EARTHLY_BRANCHES.findIndex(b => b.name === menhBranch);
  const offsetFromDan = (branchIdx - 2 + 12) % 12;
  const menhCan = HEAVENLY_STEMS[(startStem + offsetFromDan) % 10].name;

  const napAmMenh = NAP_AM_MAP[`${menhCan} ${menhBranch}`] || 'Hải Trung Kim';

  if (napAmMenh.includes('Thủy')) return { name: 'Thủy Nhị Cục', number: 2, element: 'Thủy' };
  if (napAmMenh.includes('Mộc')) return { name: 'Mộc Tam Cục', number: 3, element: 'Mộc' };
  if (napAmMenh.includes('Kim')) return { name: 'Kim Tứ Cục', number: 4, element: 'Kim' };
  if (napAmMenh.includes('Thổ')) return { name: 'Thổ Ngũ Cục', number: 5, element: 'Thổ' };
  return { name: 'Hỏa Lục Cục', number: 6, element: 'Hỏa' };
}

/**
 * An Sao Tử Vi theo Cục và Ngày Âm lịch
 */
export function getTuViPosition(cucNumber: number, lunarDay: number): number {
  let day = lunarDay;
  let remainder = day % cucNumber;
  let quotient = Math.floor(day / cucNumber);

  let targetIndex = 2; // Bắt đầu từ Dần (2)
  if (remainder === 0) {
    targetIndex = (2 + quotient - 1) % 12;
  } else {
    let borrow = cucNumber - remainder;
    let newDay = day + borrow;
    let newQuotient = newDay / cucNumber;
    if (borrow % 2 === 1) {
      targetIndex = (2 + newQuotient - 1 - borrow + 12) % 12;
    } else {
      targetIndex = (2 + newQuotient - 1 + borrow) % 12;
    }
  }
  return (targetIndex % 12 + 12) % 12;
}

// Bảng Độ Sáng Miếu Vượng Đắc Hãm của 14 Chính Tinh tại 12 Cung (Tý -> Hợi)
const STAR_BRIGHTNESS: Record<string, Array<'Miếu' | 'Vượng' | 'Đắc' | 'Hãm' | 'Bình'>> = {
  // Thứ tự 12 cung: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi
  'Tử Vi':     ['Bình', 'Miếu', 'Miếu', 'Vượng', 'Đắc', 'Vượng', 'Miếu', 'Miếu', 'Đắc', 'Vượng', 'Bình', 'Vượng'],
  'Thiên Cơ':   ['Miếu', 'Đắc', 'Vượng', 'Miếu', 'Bình', 'Hãm',  'Miếu', 'Đắc', 'Vượng', 'Miếu', 'Bình', 'Hãm'],
  'Thái Dương': ['Hãm',  'Hãm',  'Vượng', 'Miếu', 'Vượng', 'Miếu', 'Miếu', 'Đắc', 'Bình', 'Bình', 'Hãm',  'Hãm'],
  'Vũ Khúc':    ['Vượng', 'Miếu', 'Đắc',  'Bình', 'Miếu', 'Bình', 'Vượng', 'Miếu', 'Đắc',  'Bình', 'Miếu', 'Bình'],
  'Thiên Đồng': ['Vượng', 'Bình', 'Miếu', 'Hãm',  'Bình', 'Đắc',  'Hãm',  'Bình', 'Miếu', 'Hãm',  'Bình', 'Đắc'],
  'Liêm Trinh': ['Bình', 'Đắc',  'Miếu', 'Bình', 'Vượng', 'Hãm',  'Bình', 'Đắc',  'Miếu', 'Bình', 'Vượng', 'Hãm'],
  'Thiên Phủ':  ['Miếu', 'Miếu', 'Miếu', 'Bình', 'Miếu', 'Đắc',  'Vượng', 'Miếu', 'Đắc',  'Bình', 'Miếu', 'Đắc'],
  'Thái Âm':    ['Miếu', 'Đắc',  'Hãm',  'Hãm',  'Hãm',  'Hãm',  'Hãm',  'Bình', 'Đắc',  'Vượng', 'Miếu', 'Miếu'],
  'Tham Lang':  ['Vượng', 'Miếu', 'Bình', 'Bình', 'Miếu', 'Hãm',  'Vượng', 'Miếu', 'Bình', 'Bình', 'Miếu', 'Hãm'],
  'Cự Môn':     ['Vượng', 'Bình', 'Miếu', 'Miếu', 'Hãm',  'Hãm',  'Vượng', 'Hãm',  'Miếu', 'Miếu', 'Bình', 'Đắc'],
  'Thiên Tướng':['Vượng', 'Miếu', 'Miếu', 'Hãm',  'Vượng', 'Đắc',  'Vượng', 'Miếu', 'Miếu', 'Hãm',  'Vượng', 'Đắc'],
  'Thiên Lương':['Miếu', 'Vượng', 'Miếu', 'Vượng', 'Miếu', 'Hãm',  'Miếu', 'Vượng', 'Hãm',  'Đắc',  'Miếu', 'Hãm'],
  'Thất Sát':   ['Miếu', 'Đắc',  'Miếu', 'Hãm',  'Bình', 'Bình', 'Miếu', 'Đắc',  'Miếu', 'Hãm',  'Bình', 'Bình'],
  'Phá Quân':   ['Miếu', 'Vượng', 'Hãm',  'Hãm',  'Vượng', 'Đắc',  'Miếu', 'Vượng', 'Hãm',  'Hãm',  'Vượng', 'Đắc']
};

// Bảng Tứ Hóa Can Năm
const TU_HOA_CAN_MAP: Record<string, { loc: string; quyen: string; khoa: string; ky: string }> = {
  'Giáp': { loc: 'Liêm Trinh', quyen: 'Phá Quân', khoa: 'Vũ Khúc', ky: 'Thái Dương' },
  'Ất':   { loc: 'Thiên Cơ', quyen: 'Thiên Lương', khoa: 'Tử Vi', ky: 'Thái Âm' },
  'Bính': { loc: 'Thiên Đồng', quyen: 'Thiên Cơ', khoa: 'Văn Xương', ky: 'Liêm Trinh' },
  'Đinh': { loc: 'Thái Âm', quyen: 'Thiên Đồng', khoa: 'Thiên Cơ', ky: 'Cự Môn' },
  'Mậu':  { loc: 'Tham Lang', quyen: 'Thái Âm', khoa: 'Hữu Bật', ky: 'Thiên Cơ' },
  'Kỷ':   { loc: 'Vũ Khúc', quyen: 'Tham Lang', khoa: 'Thiên Lương', ky: 'Văn Khúc' },
  'Canh': { loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thiên Đồng', ky: 'Thái Âm' },
  'Tân':  { loc: 'Cự Môn', quyen: 'Thái Dương', khoa: 'Văn Khúc', ky: 'Văn Xương' },
  'Nhâm': { loc: 'Thiên Lương', quyen: 'Tử Vi', khoa: 'Tả Phụ', ky: 'Vũ Khúc' },
  'Quý':  { loc: 'Phá Quân', quyen: 'Cự Môn', khoa: 'Thái Âm', ky: 'Tham Lang' },
};

// Bảng Vòng Bác Sĩ (12 sao)
const BAC_SI_STARS = [
  { name: 'Bác Sĩ', type: 'cat_tinh', element: 'Thủy', meaning: 'Chủ thông minh, nhân hậu, đỗ đạt.' },
  { name: 'Lực Sĩ', type: 'cat_tinh', element: 'Hỏa', meaning: 'Chủ dũng lực, quyền biến, năng động.' },
  { name: 'Thanh Long', type: 'cat_tinh', element: 'Thủy', meaning: 'Cát tinh may mắn, giải trừ hung hiểm.' },
  { name: 'Tiểu Hao', type: 'sat_tinh', element: 'Hỏa', meaning: 'Hao tán tài vật nhỏ, dịch chuyển.' },
  { name: 'Tướng Quân', type: 'cat_tinh', element: 'Mộc', meaning: 'Uy phong, dũng cảm, nắm quyền bính.' },
  { name: 'Tấu Thư', type: 'cat_tinh', element: 'Kim', meaning: 'Lợi thi cử văn thơ, ăn nói khéo léo.' },
  { name: 'Phi Liêm', type: 'sat_tinh', element: 'Hỏa', meaning: 'Thị phi, nhanh nhẹn, dễ nóng vội.' },
  { name: 'Hỷ Thần', type: 'cat_tinh', element: 'Hỏa', meaning: 'Niềm vui mừng, hôn sự, may mắn.' },
  { name: 'Bệnh Phù', type: 'sat_tinh', element: 'Thổ', meaning: 'Chủ đau ốm, thể trạng mệt mỏi.' },
  { name: 'Đại Hao', type: 'sat_tinh', element: 'Hỏa', meaning: 'Hao tán lớn, thay đổi môi trường sống.' },
  { name: 'Phục Binh', type: 'sat_tinh', element: 'Hỏa', meaning: 'Phòng tiểu nhân ám hại, trắc trở ngầm.' },
  { name: 'Quan Phủ', type: 'sat_tinh', element: 'Hỏa', meaning: 'Kiện tụng, pháp luật, tranh cãi.' },
] as const;

// Bảng Vòng Thái Tuế (12 sao)
const THAI_TUE_STARS = [
  'Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm',
  'Quan Phù', 'Tử Phù', 'Tuế Phá', 'Long Đức',
  'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Trực Phù'
];

// Bảng Vòng Tràng Sinh (12 sao)
const TRANG_SINH_STARS = [
  'Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan',
  'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'
];

/**
 * HÀM TỔNG HỢP: LẬP LÁ SỐ TỬ VI ĐẨU SỐ ĐẦY ĐỦ CÁC TỔ HỢP SAO CHÍNH XÁC THEO CỔ THƯ
 */
export function generateTuViChart(
  fullName: string,
  gender: 'male' | 'female',
  year: number,
  month: number,
  day: number,
  hour: number,
  lunarDay?: number,
  lunarMonth?: number,
  yearCan?: string,
  yearChi?: string
): TuViChart {
  const lunar = convertSolarToLunar(day, month, year);
  const actualLunarDay = lunarDay !== undefined ? lunarDay : lunar.day;
  const actualLunarMonth = lunarMonth !== undefined ? lunarMonth : lunar.month;

  const canIndex = (lunar.year - 4) % 10;
  const chiIndex = (lunar.year - 4) % 12;
  const actualYearCan = yearCan || HEAVENLY_STEMS[(canIndex + 10) % 10].name;
  const actualYearChi = yearChi || EARTHLY_BRANCHES[(chiIndex + 12) % 12].name;

  const hourBranchIdx = Math.floor((hour + 1) / 2) % 12;
  const hourBranch = EARTHLY_BRANCHES[hourBranchIdx].name;

  const yearChiIdx = EARTHLY_BRANCHES.findIndex(b => b.name === actualYearChi);
  const yearCanIdx = HEAVENLY_STEMS.findIndex(s => s.name === actualYearCan);

  const { menhIndex, thanIndex } = getMenhThanPositions(actualLunarMonth, hourBranchIdx);
  const menhBranch = EARTHLY_BRANCHES[menhIndex].name;
  const thanBranch = EARTHLY_BRANCHES[thanIndex].name;

  const cuc = calculateCuc(actualYearCan, menhBranch);
  const tuViIdx = getTuViPosition(cuc.number, actualLunarDay);
  const thienPhuIdx = (16 - tuViIdx + 12) % 12;

  // Chiều an Đại Hạn & Vòng sao (Dương Nam Âm Nữ thuận; Âm Nam Dương Nữ nghịch)
  const isYangYear = HEAVENLY_STEMS.find(s => s.name === actualYearCan)?.yinYang === 'Dương';
  const isForward = (gender === 'male' && isYangYear) || (gender === 'female' && !isYangYear);

  // 1. AN LỤC CÁT TINH & CÁT TINH QUAN TRỌNG
  // Tả Phụ (Khởi Thìn=4 đi thuận đến tháng) / Hữu Bật (Khởi Tuất=10 đi nghịch đến tháng)
  const taPhuIdx = (4 + (actualLunarMonth - 1)) % 12;
  const huuBatIdx = (10 - (actualLunarMonth - 1) + 12) % 12;

  // Văn Xương (Khởi Tuất=10 đi nghịch đến giờ) / Văn Khúc (Khởi Thìn=4 đi thuận đến giờ)
  const vanXuongIdx = (10 - hourBranchIdx + 12) % 12;
  const vanKhucIdx = (4 + hourBranchIdx) % 12;

  // Thiên Khôi & Thiên Việt (Theo Can Năm)
  const KHOI_VIET_POS: Record<string, { khoi: number; viet: number }> = {
    'Giáp': { khoi: 1, viet: 7 }, 'Mậu': { khoi: 1, viet: 7 },
    'Ất': { khoi: 0, viet: 8 },   'Kỷ': { khoi: 0, viet: 8 },
    'Bính': { khoi: 11, viet: 9 },'Đinh': { khoi: 11, viet: 9 },
    'Canh': { khoi: 6, viet: 2 }, 'Tân': { khoi: 6, viet: 2 },
    'Nhâm': { khoi: 3, viet: 5 }, 'Quý': { khoi: 3, viet: 5 },
  };
  const khoiViet = KHOI_VIET_POS[actualYearCan] || { khoi: 1, viet: 7 };

  // Lộc Tồn (Theo Can Năm)
  const LOC_TON_POS: Record<string, number> = {
    'Giáp': 2, 'Ất': 3, 'Bính': 5, 'Mậu': 5, 'Đinh': 6, 'Kỷ': 6, 'Canh': 8, 'Tân': 9, 'Nhâm': 11, 'Quý': 0
  };
  const locTonIdx = LOC_TON_POS[actualYearCan] ?? 2;

  // Kình Dương (Trước Lộc Tồn), Đà La (Sau Lộc Tồn)
  const kinhDuongIdx = (locTonIdx + 1) % 12;
  const daLaIdx = (locTonIdx - 1 + 12) % 12;

  // Địa Không, Địa Kiếp (Khởi Hợi = 11, Không nghịch, Kiếp thuận)
  const diaKhongIdx = (11 - hourBranchIdx + 12) % 12;
  const diaKiepIdx = (11 + hourBranchIdx) % 12;

  // Hỏa Tinh, Linh Tinh (Theo Chi Năm & Giờ Sinh)
  let hoaTinhStart = 1; // Mặc định Dần Ngọ Tuất
  let linhTinhStart = 3;
  if ([8, 0, 4].includes(yearChiIdx)) { // Thân Tý Thìn
    hoaTinhStart = 2; linhTinhStart = 10;
  } else if ([5, 9, 1].includes(yearChiIdx)) { // Tỵ Dậu Sửu
    hoaTinhStart = 3; linhTinhStart = 10;
  } else if ([11, 3, 7].includes(yearChiIdx)) { // Hợi Mão Mùi
    hoaTinhStart = 9; linhTinhStart = 10;
  }
  const hoaTinhIdx = (hoaTinhStart + hourBranchIdx) % 12;
  const linhTinhIdx = (linhTinhStart + hourBranchIdx) % 12;

  // Thiên Mã (Theo Chi Năm)
  let thienMaIdx = 8; // Mặc định Thân
  if ([8, 0, 4].includes(yearChiIdx)) thienMaIdx = 2; // Dần
  else if ([5, 9, 1].includes(yearChiIdx)) thienMaIdx = 11; // Hợi
  else if ([11, 3, 7].includes(yearChiIdx)) thienMaIdx = 5; // Tỵ

  // Đào Hoa (Theo Chi Năm)
  let daoHoaIdx = 9; // Thân Tý Thìn -> Dậu
  if ([2, 6, 10].includes(yearChiIdx)) daoHoaIdx = 3; // Mão
  else if ([5, 9, 1].includes(yearChiIdx)) daoHoaIdx = 6; // Ngọ
  else if ([11, 3, 7].includes(yearChiIdx)) daoHoaIdx = 0; // Tý

  // Hồng Loan (Khởi Mão=3 nghịch đến Chi năm) / Thiên Hỷ (Đối xứng)
  const hongLoanIdx = (3 - yearChiIdx + 12) % 12;
  const thienHyIdx = (hongLoanIdx + 6) % 12;

  // Thiên Khốc (Khởi Ngọ=6 nghịch đến năm) / Thiên Hư (Khởi Ngọ=6 thuận đến năm)
  const thienKhocIdx = (6 - yearChiIdx + 12) % 12;
  const thienHuIdx = (6 + yearChiIdx) % 12;

  // Thiên Hình (Khởi Dậu=9 thuận đến tháng) / Thiên Diêu (Khởi Sửu=1 thuận đến tháng)
  const thienHinhIdx = (9 + (actualLunarMonth - 1)) % 12;
  const thienDieuIdx = (1 + (actualLunarMonth - 1)) % 12;

  // Vòng Tràng Sinh: khởi theo Cục
  let trangSinhStart = 8; // Thủy Nhị Cục / Thổ Ngũ Cục khởi Thân
  if (cuc.number === 3) trangSinhStart = 11; // Mộc khởi Hợi
  else if (cuc.number === 4) trangSinhStart = 5; // Kim khởi Tỵ
  else if (cuc.number === 6) trangSinhStart = 2; // Hỏa khởi Dần

  // Triệt Không (Theo Can Năm)
  const TRIET_MAP: Record<string, number[]> = {
    'Giáp': [8, 9], 'Kỷ': [8, 9],
    'Ất': [6, 7], 'Canh': [6, 7],
    'Bính': [4, 5], 'Tân': [4, 5],
    'Đinh': [2, 3], 'Nhâm': [2, 3],
    'Mậu': [0, 1], 'Quý': [0, 1],
  };
  const trietBranches = TRIET_MAP[actualYearCan] || [];

  // Tuần Không (Theo Tuần Giáp của Can Chi năm)
  const tuanStartChi = (yearChiIdx - yearCanIdx + 12) % 12;
  const tuanBranches = [(tuanStartChi + 10) % 12, (tuanStartChi + 11) % 12];

  // Lập 12 Cung chức vị
  const palaces: TuViPalace[] = [];
  for (let i = 0; i < 12; i++) {
    const branchIdx = i; // 0: Tý, 1: Sửu, 2: Dần...
    const branch = EARTHLY_BRANCHES[branchIdx].name;

    // Tên cung (Đi nghịch từ Cung Mệnh)
    const palaceNameIdx = (menhIndex - branchIdx + 12) % 12;
    const palaceName = PALACE_NAMES[palaceNameIdx];

    // Can của cung (Ngũ Hổ Độn)
    const tigerStartStemMap: Record<string, number> = {
      'Giáp': 2, 'Kỷ': 2, 'Ất': 4, 'Canh': 4, 'Bính': 6, 'Tân': 6, 'Đinh': 8, 'Nhâm': 8, 'Mậu': 0, 'Quý': 0,
    };
    const startStem = tigerStartStemMap[actualYearCan] ?? 0;
    const offsetFromDan = (branchIdx - 2 + 12) % 12;
    const can = HEAVENLY_STEMS[(startStem + offsetFromDan) % 10].name;

    // Đại Hạn 10 năm tại cung này
    const stepDistance = isForward 
      ? (branchIdx - menhIndex + 12) % 12 
      : (menhIndex - branchIdx + 12) % 12;
    const startAge = cuc.number + stepDistance * 10;
    const endAge = startAge + 9;

    const mainStars: TuViStar[] = [];
    const assistantStars: TuViStar[] = [];
    const badStars: TuViStar[] = [];
    const tuHoaStars: TuViStar[] = [];
    const trietTuan: string[] = [];

    // Kiểm tra Tuần / Triệt
    if (trietBranches.includes(branchIdx)) trietTuan.push('Triệt');
    if (tuanBranches.includes(branchIdx)) trietTuan.push('Tuần');

    // An Hệ Thống 6 Sao Chòm Tử Vi:
    if (branchIdx === tuViIdx) mainStars.push({ name: 'Tử Vi', type: 'chinh_tinh', element: 'Thổ', brightness: STAR_BRIGHTNESS['Tử Vi'][branchIdx], meaning: 'Đế Vương Chi Tinh, tôn quý, quang minh chính đại, hóa giải hung họa.' });
    if (branchIdx === (tuViIdx - 1 + 12) % 12) mainStars.push({ name: 'Thiên Cơ', type: 'chinh_tinh', element: 'Mộc', brightness: STAR_BRIGHTNESS['Thiên Cơ'][branchIdx], meaning: 'Thiện Tinh, chủ về mưu lược, trí tuệ linh hoạt, cơ biến.' });
    if (branchIdx === (tuViIdx - 3 + 12) % 12) mainStars.push({ name: 'Thái Dương', type: 'chinh_tinh', element: 'Hỏa', brightness: STAR_BRIGHTNESS['Thái Dương'][branchIdx], meaning: 'Quan Lộc Chi Tinh, bác ái, nhiệt huyết, danh vọng.' });
    if (branchIdx === (tuViIdx - 4 + 12) % 12) mainStars.push({ name: 'Vũ Khúc', type: 'chinh_tinh', element: 'Kim', brightness: STAR_BRIGHTNESS['Vũ Khúc'][branchIdx], meaning: 'Tài Bạch Tinh, quyết đoán, quả cảm, thực tế, tài chính.' });
    if (branchIdx === (tuViIdx - 5 + 12) % 12) mainStars.push({ name: 'Thiên Đồng', type: 'chinh_tinh', element: 'Thủy', brightness: STAR_BRIGHTNESS['Thiên Đồng'][branchIdx], meaning: 'Phúc Tinh, hòa nhã, thiện lương, thích an nhàn.' });
    if (branchIdx === (tuViIdx - 8 + 12) % 12) mainStars.push({ name: 'Liêm Trinh', type: 'chinh_tinh', element: 'Hỏa', brightness: STAR_BRIGHTNESS['Liêm Trinh'][branchIdx], meaning: 'Tù Tinh / Đào Hoa, nghiêm cẩn, liêm khiết, khí phách kiên cường.' });

    // An Hệ Thống 8 Sao Chòm Thiên Phủ:
    if (branchIdx === thienPhuIdx) mainStars.push({ name: 'Thiên Phủ', type: 'chinh_tinh', element: 'Thổ', brightness: STAR_BRIGHTNESS['Thiên Phủ'][branchIdx], meaning: 'Lệnh Tinh, kho tàng trời đất, bao dung, quản lý tài sản.' });
    if (branchIdx === (thienPhuIdx + 1) % 12) mainStars.push({ name: 'Thái Âm', type: 'chinh_tinh', element: 'Thủy', brightness: STAR_BRIGHTNESS['Thái Âm'][branchIdx], meaning: 'Điền Trạch & Phú Tinh, nhu hòa, tinh tế, giàu cảm xúc.' });
    if (branchIdx === (thienPhuIdx + 2) % 12) mainStars.push({ name: 'Tham Lang', type: 'chinh_tinh', element: 'Thủy', brightness: STAR_BRIGHTNESS['Tham Lang'][branchIdx], meaning: 'Đào Hoa & Dục Vọng Tinh, đa tài, giỏi ngoại giao, thích nghi nhanh.' });
    if (branchIdx === (thienPhuIdx + 3) % 12) mainStars.push({ name: 'Cự Môn', type: 'chinh_tinh', element: 'Thủy', brightness: STAR_BRIGHTNESS['Cự Môn'][branchIdx], meaning: 'Ám Tinh, hùng biện, nghiên cứu sâu sắc, tài ăn nói.' });
    if (branchIdx === (thienPhuIdx + 4) % 12) mainStars.push({ name: 'Thiên Tướng', type: 'chinh_tinh', element: 'Thủy', brightness: STAR_BRIGHTNESS['Thiên Tướng'][branchIdx], meaning: 'Ấn Tinh, trọng danh dự, trượng nghĩa, phò tá đắc lực.' });
    if (branchIdx === (thienPhuIdx + 5) % 12) mainStars.push({ name: 'Thiên Lương', type: 'chinh_tinh', element: 'Mộc', brightness: STAR_BRIGHTNESS['Thiên Lương'][branchIdx], meaning: 'Ấm Tinh / Thọ Tinh, thanh cao, thích che chở, nguyên tắc.' });
    if (branchIdx === (thienPhuIdx + 6) % 12) mainStars.push({ name: 'Thất Sát', type: 'chinh_tinh', element: 'Kim', brightness: STAR_BRIGHTNESS['Thất Sát'][branchIdx], meaning: 'Tướng Tinh, dũng mãnh, tiên phong, dám nghĩ dám làm.' });
    if (branchIdx === (thienPhuIdx + 10) % 12) mainStars.push({ name: 'Phá Quân', type: 'chinh_tinh', element: 'Thủy', brightness: STAR_BRIGHTNESS['Phá Quân'][branchIdx], meaning: 'Hao Tinh, phá cũ lập mới, tiên phong khai phá, không ngại gian khó.' });

    // An Cát Tinh
    if (branchIdx === taPhuIdx) assistantStars.push({ name: 'Tả Phụ', type: 'cat_tinh', element: 'Thổ', meaning: 'Phù tá, nâng đỡ, tăng cường quý nhân và trợ lực.' });
    if (branchIdx === huuBatIdx) assistantStars.push({ name: 'Hữu Bật', type: 'cat_tinh', element: 'Thổ', meaning: 'Phù tá, nâng đỡ, gia tăng cơ hội và uy tín.' });
    if (branchIdx === vanXuongIdx) assistantStars.push({ name: 'Văn Xương', type: 'cat_tinh', element: 'Kim', meaning: 'Khoa bảng, văn chương, thanh danh hiển đạt.' });
    if (branchIdx === vanKhucIdx) assistantStars.push({ name: 'Văn Khúc', type: 'cat_tinh', element: 'Thủy', meaning: 'Tài hoa nghệ thuật, ăn nói lưu loát, thi cử đỗ đạt.' });
    if (branchIdx === khoiViet.khoi) assistantStars.push({ name: 'Thiên Khôi', type: 'cat_tinh', element: 'Hỏa', meaning: 'Quý nhân đệ nhất, đứng đầu bảng vàng công danh.' });
    if (branchIdx === khoiViet.viet) assistantStars.push({ name: 'Thiên Việt', type: 'cat_tinh', element: 'Hỏa', meaning: 'Quý nhân che chở, cơ hội thăng tiến bất ngờ.' });
    if (branchIdx === locTonIdx) assistantStars.push({ name: 'Lộc Tồn', type: 'cat_tinh', element: 'Thổ', meaning: 'Thiên lộc trời ban, phúc thọ song toàn, tiền tài ổn định.' });
    if (branchIdx === thienMaIdx) assistantStars.push({ name: 'Thiên Mã', type: 'cat_tinh', element: 'Hỏa', meaning: 'Năng động, di chuyển, thăng tiến nhanh nơi xa xứ.' });
    if (branchIdx === hongLoanIdx) assistantStars.push({ name: 'Hồng Loan', type: 'cat_tinh', element: 'Thủy', meaning: 'Duyên dáng, nhân duyên tốt, hôn sự cát lành.' });
    if (branchIdx === thienHyIdx) assistantStars.push({ name: 'Thiên Hỷ', type: 'cat_tinh', element: 'Thủy', meaning: 'Tin vui, hoan hỷ, gia đạo có việc mừng.' });
    if (branchIdx === daoHoaIdx) assistantStars.push({ name: 'Đào Hoa', type: 'cat_tinh', element: 'Mộc', meaning: 'Thu hút người khác phái, duyên dáng, lãng mạn.' });

    // An Sát Tinh & Bại Tinh
    if (branchIdx === kinhDuongIdx) badStars.push({ name: 'Kình Dương', type: 'sat_tinh', element: 'Kim', brightness: 'Đắc', meaning: 'Cương liệt, hình thương, quả cảm nhưng dễ va chạm.' });
    if (branchIdx === daLaIdx) badStars.push({ name: 'Đà La', type: 'sat_tinh', element: 'Kim', brightness: 'Đắc', meaning: 'Trì trệ, ám muội, kiên trì nhẫn nại nhưng dễ kéo dài.' });
    if (branchIdx === diaKhongIdx) badStars.push({ name: 'Địa Không', type: 'sat_tinh', element: 'Hỏa', brightness: 'Đắc', meaning: 'Ý tưởng dị biệt, thăng trầm bất ngờ, lợi cho sáng tạo.' });
    if (branchIdx === diaKiepIdx) badStars.push({ name: 'Địa Kiếp', type: 'sat_tinh', element: 'Hỏa', brightness: 'Đắc', meaning: 'Hao tán đột biến, gan dạ, dám mạo hiểm.' });
    if (branchIdx === hoaTinhIdx) badStars.push({ name: 'Hỏa Tinh', type: 'sat_tinh', element: 'Hỏa', brightness: 'Đắc', meaning: 'Nóng nảy, quả cảm, hành động nhanh như chớp.' });
    if (branchIdx === linhTinhIdx) badStars.push({ name: 'Linh Tinh', type: 'sat_tinh', element: 'Hỏa', brightness: 'Đắc', meaning: 'Âm ỉ, mưu lược sâu, tính toán thâm trầm.' });
    if (branchIdx === thienKhocIdx) badStars.push({ name: 'Thiên Khốc', type: 'sat_tinh', element: 'Thủy', meaning: 'Âu lo, ưu tư, có chí lớn nhưng nhiều gian truân.' });
    if (branchIdx === thienHuIdx) badStars.push({ name: 'Thiên Hư', type: 'sat_tinh', element: 'Thủy', meaning: 'Hao tổn tinh thần, danh hảo tâm hư.' });
    if (branchIdx === thienHinhIdx) badStars.push({ name: 'Thiên Hình', type: 'sat_tinh', element: 'Hỏa', meaning: 'Kỷ luật thép, chấp pháp, cẩn trọng dao kéo pháp lý.' });
    if (branchIdx === thienDieuIdx) badStars.push({ name: 'Thiên Diêu', type: 'sat_tinh', element: 'Thủy', meaning: 'Say mê nghệ thuật, đào hoa phong nhã.' });

    // Tứ Hóa Can Năm (10 Can chuẩn xác)
    const canTuHoa = TU_HOA_CAN_MAP[actualYearCan];
    if (canTuHoa) {
      // Kiểm tra chính tinh & cát tinh trong cung
      const allStarsInPalace = [...mainStars, ...assistantStars];
      allStarsInPalace.forEach(st => {
        if (st.name === canTuHoa.loc) tuHoaStars.push({ name: 'Hóa Lộc', type: 'tu_hoa', element: 'Mộc', meaning: `Gắn với ${st.name}: Gia tăng tài lộc, nhân duyên và hanh thông.` });
        if (st.name === canTuHoa.quyen) tuHoaStars.push({ name: 'Hóa Quyền', type: 'tu_hoa', element: 'Mộc', meaning: `Gắn với ${st.name}: Gia tăng quyền uy, tài lãnh đạo và sự quyết đoán.` });
        if (st.name === canTuHoa.khoa) tuHoaStars.push({ name: 'Hóa Khoa', type: 'tu_hoa', element: 'Thủy', meaning: `Gắn với ${st.name}: Đỗ đạt, khoa bảng, danh tiếng và quý nhân cứu giải.` });
        if (st.name === canTuHoa.ky) tuHoaStars.push({ name: 'Hóa Kỵ', type: 'tu_hoa', element: 'Thủy', meaning: `Gắn với ${st.name}: Thử thách, cản trở, tôi luyện ý chí bền bỉ.` });
      });
    }

    // Vòng Bác Sĩ (12 sao từ Lộc Tồn)
    const bacSiStep = isForward
      ? (branchIdx - locTonIdx + 12) % 12
      : (locTonIdx - branchIdx + 12) % 12;
    const bacSiStar = BAC_SI_STARS[bacSiStep];

    // Vòng Thái Tuế (12 sao từ Chi Năm)
    const thaiTueStep = (branchIdx - yearChiIdx + 12) % 12;
    const thaiTueStarName = THAI_TUE_STARS[thaiTueStep];

    // Vòng Tràng Sinh (12 sao từ vị trí Cục)
    const trangSinhStep = isForward
      ? (branchIdx - trangSinhStart + 12) % 12
      : (trangSinhStart - branchIdx + 12) % 12;
    const trangSinhStarName = TRANG_SINH_STARS[trangSinhStep];

    palaces.push({
      index: branchIdx,
      branch,
      can,
      name: palaceName,
      isMenh: branchIdx === menhIndex,
      isThan: branchIdx === thanIndex,
      cucName: cuc.name,
      majorPeriod: { startAge, endAge },
      mainStars,
      assistantStars,
      badStars,
      tuHoaStars,
      thaiTueStar: thaiTueStarName,
      bacSiStar: bacSiStar.name,
      trangSinhStar: trangSinhStarName,
      trietTuan
    });
  }

  // Tam Phương Tứ Chính
  const menhPalace = palaces[menhIndex];
  const taiBachIdx = (menhIndex + 4) % 12;
  const quanLocIdx = (menhIndex + 8) % 12;
  const thienDiIdx = (menhIndex + 6) % 12;

  return {
    profile: {
      fullName: fullName || 'Đương Số',
      gender,
      birthSolar: `${day}/${month}/${year}`,
      birthLunar: `${actualLunarDay}/${actualLunarMonth} năm ${actualYearCan} ${actualYearChi}`,
      birthHourCanChi: `Giờ ${hourBranch}`,
      yinYangNamNu: `${isYangYear ? 'Dương' : 'Âm'} ${gender === 'male' ? 'Nam' : 'Nữ'}`,
      menhCucTuongSinh: `Bản Mệnh tương hòa với ${cuc.name}`
    },
    cuc,
    menhPalaceBranch: menhBranch,
    thanPalaceBranch: thanBranch,
    palaces,
    tamPhuongTuChinhMenh: {
      menh: `${menhBranch} (${menhPalace.mainStars.map(s => s.name).join(', ') || 'Vô Chính Diệu'})`,
      taiBach: `${EARTHLY_BRANCHES[taiBachIdx].name} (${palaces[taiBachIdx].mainStars.map(s => s.name).join(', ') || 'Vô Chính Diệu'})`,
      quanLoc: `${EARTHLY_BRANCHES[quanLocIdx].name} (${palaces[quanLocIdx].mainStars.map(s => s.name).join(', ') || 'Vô Chính Diệu'})`,
      thienDi: `${EARTHLY_BRANCHES[thienDiIdx].name} (${palaces[thienDiIdx].mainStars.map(s => s.name).join(', ') || 'Vô Chính Diệu'})`
    }
  };
}
